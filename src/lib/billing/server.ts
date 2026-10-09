import 'server-only';

import { getServerEnv } from '@/lib/config/server';
import type { ServerEnv } from '@/lib/config/schema';
import {
  ENTITLEMENT_COLUMNS,
  entitlementGrants,
  type EntitlementRow,
} from '@/lib/billing/entitlements';
import {
  featurePlans,
  paymentLinkPlans,
  resolvePlans,
  type FeatureKey,
  type PaidPlanId,
  type Plan,
} from '@/lib/billing/plans';
import {
  chargeCustomer,
  subscriptionState,
  type BillingAction,
  type BillingIntent,
} from '@/lib/billing/stripe-events';
import type { StripeReader } from '@/lib/billing/stripe-api';
import { createClient, type TradeDocsClient } from '@/lib/supabase/server';

/**
 * Billing on the server: whether payments are open, the plans as offered right now, the
 * entitlement check, and the webhook's database write.
 *
 * Payments open only when every gate agrees: service mode, ENABLE_PAYMENTS with its recorded
 * approval (enforced by the config schema), Stripe as the provider, the API key and webhook
 * secret, and the service-role connection the webhook writes through. Any configuration error
 * answers "closed", which fails the billing feature alone and leaves the rest of the app up.
 */

export type BillingConfig =
  | { state: 'disabled' }
  | { state: 'misconfigured'; reason: string }
  | {
      state: 'ready';
      webhookSecret: string;
      apiKey: string;
      supabaseUrl: string;
      serviceRoleKey: string;
      /** Production accepts live-mode events only; every other environment test-mode only. */
      livemode: boolean;
      paymentLinks: Map<string, PaidPlanId>;
    };

export function billingConfig(
  env: ServerEnv,
  input: Record<string, string | undefined> = process.env,
): BillingConfig {
  if (!env.ENABLE_PAYMENTS) return { state: 'disabled' };
  if (env.APPLICATION_MODE !== 'service' || !env.PAYMENTS_APPROVED) {
    return { state: 'misconfigured', reason: 'payments_not_approved_for_service' };
  }
  if (env.PAYMENT_PROVIDER !== 'stripe') {
    return { state: 'misconfigured', reason: 'provider_not_stripe' };
  }
  if (!env.PAYMENT_API_KEY || !env.PAYMENT_WEBHOOK_SECRET) {
    return { state: 'misconfigured', reason: 'provider_keys_missing' };
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return { state: 'misconfigured', reason: 'service_role_missing' };
  }
  return {
    state: 'ready',
    webhookSecret: env.PAYMENT_WEBHOOK_SECRET,
    apiKey: env.PAYMENT_API_KEY,
    supabaseUrl: env.SUPABASE_URL,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    livemode: env.APP_ENV === 'production',
    paymentLinks: paymentLinkPlans(input),
  };
}

/** Fails closed: a broken environment reports payments as closed. */
export function currentBillingConfig(): BillingConfig {
  try {
    return billingConfig(getServerEnv());
  } catch {
    return { state: 'misconfigured', reason: 'invalid_configuration' };
  }
}

export function paymentsOpen(): boolean {
  return currentBillingConfig().state === 'ready';
}

/** The plans as they are offered on this deployment right now. */
export function currentPlans(): Plan[] {
  return resolvePlans(process.env, paymentsOpen());
}

/** The caller's view of an organization's entitlement, through row level security. */
export async function readEntitlement(
  client: TradeDocsClient,
  orgId: string,
): Promise<{ row: EntitlementRow | null; failed: boolean }> {
  const { data, error } = await client
    .from('entitlements')
    .select(ENTITLEMENT_COLUMNS)
    .eq('org_id', orgId)
    .maybeSingle();
  if (error) return { row: null, failed: true };
  return { row: data, failed: false };
}

/** Reads an organization's entitlement row; `failed` when it could not be read. */
export type EntitlementRead = (
  orgId: string,
) => Promise<{ row: EntitlementRow | null; failed: boolean }>;

/**
 * Whether an organization may use a feature. A feature every plan includes, the free plan
 * among them, is never gated. A paid feature needs a current, unrevoked entitlement, read as
 * the signed-in caller unless another reader is given (the public API passes one that reads
 * with the service role for the organization its verified key belongs to); a missing table,
 * a query error, an unknown feature or no session all answer false.
 */
export async function hasEntitlement(
  orgId: string,
  feature: FeatureKey,
  read?: EntitlementRead,
): Promise<boolean> {
  const plans = featurePlans(feature);
  if (plans.length === 0) return false;
  if (plans.includes('free')) return true;
  try {
    const { row, failed } = read
      ? await read(orgId)
      : await readEntitlement(await createClient(), orgId);
    if (failed) return false;
    return entitlementGrants(row, plans, new Date());
  } catch {
    return false;
  }
}

// --- Webhook --------------------------------------------------------------------------

/**
 * Turns an intent into the database action, reading the live Stripe object where the intent
 * needs one. Throws when Stripe cannot be read, so the delivery is retried.
 */
export async function resolveIntent(
  intent: BillingIntent,
  stripe: StripeReader,
): Promise<BillingAction> {
  switch (intent.kind) {
    case 'grant': {
      const state = subscriptionState(await stripe.subscription(intent.subscription_ref));
      if (!state) throw new Error('Unreadable subscription.');
      return { ...intent, ...state };
    }
    case 'subscription': {
      const state = subscriptionState(await stripe.subscription(intent.subscription_ref));
      if (!state) throw new Error('Unreadable subscription.');
      return { kind: 'subscription', subscription_ref: intent.subscription_ref, ...state };
    }
    case 'revoke':
      return intent;
    case 'revoke_charge': {
      const customer = chargeCustomer(await stripe.charge(intent.charge_ref));
      if (!customer) return { kind: 'ignore', reason: 'dispute_without_customer' };
      return { kind: 'revoke', reason: intent.reason, customer_ref: customer };
    }
    case 'ignore':
      return intent;
  }
}

export type ApplyOutcome = 'applied' | 'duplicate' | 'ignored' | 'unmatched';

/**
 * Records the event and applies its action in one database transaction
 * (public.apply_billing_event, executable by service_role only). The event id is the ledger's
 * primary key, so a redelivered event answers "duplicate" and changes nothing.
 */
export async function applyBillingEvent(
  config: Extract<BillingConfig, { state: 'ready' }>,
  event: { id: string; type: string },
  action: BillingAction,
  fetcher: typeof fetch = fetch,
): Promise<ApplyOutcome> {
  const response = await fetcher(new URL('/rest/v1/rpc/apply_billing_event', config.supabaseUrl), {
    method: 'POST',
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_event_id: event.id, p_event_type: event.type, p_action: action }),
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) {
    void response.body?.cancel().catch(() => undefined);
    throw new Error(`Billing ledger write failed with HTTP ${response.status}.`);
  }
  const outcome: unknown = await response.json();
  if (
    outcome === 'applied' ||
    outcome === 'duplicate' ||
    outcome === 'ignored' ||
    outcome === 'unmatched'
  ) {
    return outcome;
  }
  throw new Error('Unexpected billing ledger response.');
}
