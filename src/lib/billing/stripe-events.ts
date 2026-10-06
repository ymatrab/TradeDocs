import { z } from 'zod';
import type { PaidPlanId } from '@/lib/billing/plans';

/**
 * What a verified Stripe event means for an organization's entitlement. Pure: the webhook
 * route verifies the signature first, and fetches any live object an intent asks for.
 *
 * The mapping, and why:
 *
 * - checkout.session.completed grants a plan. The organization comes from client_reference_id
 *   (set by the in-app upgrade button); the plan comes from the session's payment_link, which
 *   Stripe sets and a visitor cannot choose, so editing the URL cannot buy Team at Pro's price.
 * - customer.subscription.created|updated|deleted re-reads the subscription from Stripe and
 *   applies its current state. Stripe does not guarantee event order, so the event's own copy
 *   is never trusted to be the latest.
 * - charge.refunded revokes access only on a full refund; a partial refund changes nothing.
 * - charge.dispute.created revokes access. A dispute names a charge, not a customer, so the
 *   route reads the charge to find the customer.
 *
 * Everything else, and anything malformed, is ignored and recorded as such.
 */

const id = (prefix: string) =>
  z
    .string()
    .regex(new RegExp(`^${prefix}_[A-Za-z0-9_]{1,255}$`))
    .max(260);

export const EVENT_ID = id('evt');
export const CUSTOMER_ID = id('cus');
export const SUBSCRIPTION_ID = id('sub');
export const CHARGE_ID = id('ch');
export const CHECKOUT_ID = id('cs');

/** The envelope every event shares. The object itself is read per type below. */
export const stripeEventSchema = z.object({
  id: EVENT_ID,
  object: z.literal('event'),
  type: z.string().min(1).max(100),
  livemode: z.boolean(),
  created: z.number().int(),
  data: z.object({ object: z.record(z.string(), z.unknown()) }),
});
export type StripeEvent = z.output<typeof stripeEventSchema>;

/** An id field that Stripe may also send expanded, as an object carrying the id. */
const reference = (schema: z.ZodString) =>
  z.union([schema, z.object({ id: schema }).transform((value) => value.id)]);

const checkoutSessionSchema = z.object({
  id: CHECKOUT_ID,
  mode: z.string(),
  payment_status: z.string(),
  client_reference_id: z.string().nullish(),
  customer: reference(CUSTOMER_ID).nullish(),
  subscription: reference(SUBSCRIPTION_ID).nullish(),
  payment_link: z.string().nullish(),
});

const subscriptionRefSchema = z.object({ id: SUBSCRIPTION_ID });

const chargeSchema = z.object({
  id: CHARGE_ID,
  refunded: z.boolean(),
  customer: reference(CUSTOMER_ID).nullish(),
});

const disputeSchema = z.object({ charge: reference(CHARGE_ID) });

export type BillingIntent =
  | {
      kind: 'grant';
      org_id: string;
      plan: PaidPlanId;
      customer_ref: string;
      subscription_ref: string;
      checkout_ref: string;
    }
  | { kind: 'subscription'; subscription_ref: string }
  | { kind: 'revoke'; reason: 'refund'; customer_ref: string }
  | { kind: 'revoke_charge'; reason: 'dispute'; charge_ref: string }
  | { kind: 'ignore'; reason: string };

const SUBSCRIPTION_EVENTS = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export function interpretEvent(
  event: StripeEvent,
  paymentLinks: ReadonlyMap<string, PaidPlanId>,
): BillingIntent {
  const object = event.data.object;

  if (event.type === 'checkout.session.completed') {
    const session = checkoutSessionSchema.safeParse(object);
    if (!session.success) return { kind: 'ignore', reason: 'malformed_session' };
    const value = session.data;
    if (value.mode !== 'subscription') return { kind: 'ignore', reason: 'not_a_subscription' };
    // An asynchronous payment method can complete checkout before the money arrives.
    if (value.payment_status !== 'paid' && value.payment_status !== 'no_payment_required') {
      return { kind: 'ignore', reason: 'not_paid' };
    }
    const org = z.uuid().safeParse(value.client_reference_id);
    if (!org.success) return { kind: 'ignore', reason: 'no_organization_reference' };
    const plan = value.payment_link ? paymentLinks.get(value.payment_link) : undefined;
    if (!plan) return { kind: 'ignore', reason: 'unknown_payment_link' };
    if (!value.customer || !value.subscription) {
      return { kind: 'ignore', reason: 'missing_customer_or_subscription' };
    }
    return {
      kind: 'grant',
      org_id: org.data.toLowerCase(),
      plan,
      customer_ref: value.customer,
      subscription_ref: value.subscription,
      checkout_ref: value.id,
    };
  }

  if (SUBSCRIPTION_EVENTS.has(event.type)) {
    const subscription = subscriptionRefSchema.safeParse(object);
    if (!subscription.success) return { kind: 'ignore', reason: 'malformed_subscription' };
    return { kind: 'subscription', subscription_ref: subscription.data.id };
  }

  if (event.type === 'charge.refunded') {
    const charge = chargeSchema.safeParse(object);
    if (!charge.success) return { kind: 'ignore', reason: 'malformed_charge' };
    // `refunded` is true only once the whole amount has been refunded.
    if (!charge.data.refunded) return { kind: 'ignore', reason: 'partial_refund' };
    if (!charge.data.customer) return { kind: 'ignore', reason: 'no_customer' };
    return { kind: 'revoke', reason: 'refund', customer_ref: charge.data.customer };
  }

  if (event.type === 'charge.dispute.created') {
    const dispute = disputeSchema.safeParse(object);
    if (!dispute.success) return { kind: 'ignore', reason: 'malformed_dispute' };
    return { kind: 'revoke_charge', reason: 'dispute', charge_ref: dispute.data.charge };
  }

  return { kind: 'ignore', reason: 'unhandled_type' };
}

// --- Subscription state ---------------------------------------------------------------

export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'inactive';

export type SubscriptionState = {
  status: SubscriptionStatus;
  /** Unix seconds; null when Stripe reported none. */
  current_period_end: number | null;
  cancel_at_period_end: boolean;
};

const periodEnd = z.number().int().positive();

const subscriptionSchema = z.object({
  id: SUBSCRIPTION_ID,
  status: z.string(),
  cancel_at_period_end: z.boolean().optional(),
  // Older API versions carry the period on the subscription; newer ones on each item.
  current_period_end: periodEnd.nullish(),
  items: z
    .object({
      data: z.array(z.object({ current_period_end: periodEnd.nullish() })),
    })
    .optional(),
});

/**
 * Stripe's subscription status, reduced to what access depends on. Trialing counts as active
 * because a trial is something the owner configured on the Payment Link. Every status that
 * means "not paid" (incomplete, unpaid, paused, and any status added later) is inactive.
 */
export function subscriptionState(input: unknown): SubscriptionState | null {
  const parsed = subscriptionSchema.safeParse(input);
  if (!parsed.success) return null;
  const value = parsed.data;
  const status: SubscriptionStatus =
    value.status === 'active' || value.status === 'trialing'
      ? 'active'
      : value.status === 'past_due'
        ? 'past_due'
        : value.status === 'canceled'
          ? 'cancelled'
          : 'inactive';
  const itemEnds = (value.items?.data ?? [])
    .map((item) => item.current_period_end)
    .filter((end): end is number => typeof end === 'number');
  const end = value.current_period_end ?? (itemEnds.length > 0 ? Math.max(...itemEnds) : null);
  return {
    status,
    current_period_end: end,
    cancel_at_period_end: value.cancel_at_period_end ?? false,
  };
}

/** The customer a charge belongs to, from a live charge object. */
export function chargeCustomer(input: unknown): string | null {
  const parsed = chargeSchema.pick({ customer: true }).safeParse(input);
  return parsed.success ? (parsed.data.customer ?? null) : null;
}

// --- Database actions ---------------------------------------------------------------------

/** The jsonb public.apply_billing_event receives. Validated again by the database. */
export type BillingAction =
  | {
      kind: 'grant';
      org_id: string;
      plan: PaidPlanId;
      customer_ref: string;
      subscription_ref: string;
      checkout_ref: string;
      status: SubscriptionStatus;
      current_period_end: number | null;
      cancel_at_period_end: boolean;
    }
  | {
      kind: 'subscription';
      subscription_ref: string;
      status: SubscriptionStatus;
      current_period_end: number | null;
      cancel_at_period_end: boolean;
    }
  | { kind: 'revoke'; reason: 'refund' | 'dispute'; customer_ref: string }
  | { kind: 'ignore'; reason: string };
