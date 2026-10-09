import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { verifyStripeSignature } from '@/lib/billing/stripe-signature';
import {
  interpretEvent,
  stripeEventSchema,
  subscriptionState,
  type StripeEvent,
} from '@/lib/billing/stripe-events';
import {
  FEATURES,
  PAID_PLAN_IDS,
  PROPOSED_PRICES,
  featurePlans,
  listedPrices,
  paidOnlyFeatures,
  paymentLinkPlans,
  pricesApproved,
  resolveOffer,
  resolvePlans,
  upgradeUrl,
} from '@/lib/billing/plans';
import {
  entitlementGrants,
  summarizeEntitlement,
  type EntitlementRow,
} from '@/lib/billing/entitlements';
import { MAX_IMPORT_ROWS, MAX_SET_DOCUMENTS, MAX_TOOL_LINES } from '@/lib/limits';

// Synthetic: deliberately not in Stripe's whsec_ format, so no scanner mistakes it for a key.
const SECRET = 'synthetic-webhook-signing-secret';
const NOW = 1_790_000_000;
const encoder = new TextEncoder();

function sign(body: string, timestamp: number, secret = SECRET): string {
  return createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
}

describe('Stripe signature verification', () => {
  const body = '{"id":"evt_1","object":"event"}';
  const payload = encoder.encode(body);

  it('accepts a v1 signature over the raw body within the tolerance', () => {
    const header = `t=${NOW},v1=${sign(body, NOW)}`;
    expect(verifyStripeSignature(payload, header, SECRET, NOW + 299)).toEqual({
      ok: true,
      timestamp: NOW,
    });
  });

  it('accepts any of several v1 signatures, as while a secret is rolled', () => {
    const old = sign(body, NOW, 'old-secret-being-rolled');
    const header = `t=${NOW},v1=${old},v1=${sign(body, NOW)}`;
    expect(verifyStripeSignature(payload, header, SECRET, NOW).ok).toBe(true);
  });

  it('rejects a body changed by a single byte', () => {
    const header = `t=${NOW},v1=${sign(body, NOW)}`;
    const changed = encoder.encode(body.replace('evt_1', 'evt_2'));
    expect(verifyStripeSignature(changed, header, SECRET, NOW)).toEqual({
      ok: false,
      reason: 'no_match',
    });
  });

  it('rejects a signature made with another secret', () => {
    const header = `t=${NOW},v1=${sign(body, NOW, 'someone-elses-secret')}`;
    expect(verifyStripeSignature(payload, header, SECRET, NOW).ok).toBe(false);
  });

  it('rejects a replay older than five minutes, and a timestamp from the future', () => {
    const header = `t=${NOW},v1=${sign(body, NOW)}`;
    expect(verifyStripeSignature(payload, header, SECRET, NOW + 301)).toEqual({
      ok: false,
      reason: 'outside_tolerance',
    });
    expect(verifyStripeSignature(payload, header, SECRET, NOW - 301).ok).toBe(false);
  });

  it('rejects a moved timestamp, because the timestamp is part of what is signed', () => {
    const header = `t=${NOW + 60},v1=${sign(body, NOW)}`;
    expect(verifyStripeSignature(payload, header, SECRET, NOW + 60).ok).toBe(false);
  });

  it('ignores every scheme except v1, so a v0 test signature cannot downgrade', () => {
    const header = `t=${NOW},v0=${sign(body, NOW)}`;
    expect(verifyStripeSignature(payload, header, SECRET, NOW)).toEqual({
      ok: false,
      reason: 'malformed',
    });
  });

  const hex = 'a'.repeat(64);
  it.each([null, '', 'garbage', `v1=${hex}`, `t=abc,v1=${hex}`, 't=1,t=2,v1=x'])(
    'rejects a missing or malformed header %j',
    (header) => {
      expect(verifyStripeSignature(payload, header, SECRET, NOW).ok).toBe(false);
    },
  );

  it('refuses to run with the recency check switched off', () => {
    expect(() => verifyStripeSignature(payload, `t=${NOW},v1=x`, SECRET, NOW, 0)).toThrow();
  });
});

function event(type: string, object: Record<string, unknown>, livemode = false): StripeEvent {
  return stripeEventSchema.parse({
    id: 'evt_synthetic',
    object: 'event',
    type,
    livemode,
    created: NOW,
    data: { object },
  });
}

const ORG = '0a000000-0000-4000-8000-00000000000a';
const LINKS = new Map([['plink_synthpro123', 'pro' as const]]);
const session = {
  id: 'cs_test_synthetic',
  object: 'checkout.session',
  mode: 'subscription',
  payment_status: 'paid',
  client_reference_id: ORG,
  customer: 'cus_synthetic',
  subscription: 'sub_synthetic',
  payment_link: 'plink_synthpro123',
};

describe('Stripe event mapping', () => {
  it('grants the plan the Payment Link belongs to, for the referenced organization', () => {
    expect(interpretEvent(event('checkout.session.completed', session), LINKS)).toEqual({
      kind: 'grant',
      org_id: ORG,
      plan: 'pro',
      customer_ref: 'cus_synthetic',
      subscription_ref: 'sub_synthetic',
      checkout_ref: 'cs_test_synthetic',
    });
  });

  it.each([
    [{ payment_link: 'plink_unknown12345' }, 'unknown_payment_link'],
    [{ payment_link: null }, 'unknown_payment_link'],
    [{ client_reference_id: null }, 'no_organization_reference'],
    [{ client_reference_id: 'person@example.invalid' }, 'no_organization_reference'],
    [{ payment_status: 'unpaid' }, 'not_paid'],
    [{ mode: 'payment' }, 'not_a_subscription'],
    [{ subscription: null }, 'missing_customer_or_subscription'],
  ])('grants nothing for a checkout with %j', (change, reason) => {
    const changed = event('checkout.session.completed', { ...session, ...change });
    expect(interpretEvent(changed, LINKS)).toEqual({ kind: 'ignore', reason });
  });

  it('re-reads the subscription for every subscription event', () => {
    for (const type of [
      'customer.subscription.created',
      'customer.subscription.updated',
      'customer.subscription.deleted',
    ]) {
      const subscription = event(type, { id: 'sub_synthetic', status: 'active' });
      expect(interpretEvent(subscription, LINKS)).toEqual({
        kind: 'subscription',
        subscription_ref: 'sub_synthetic',
      });
    }
  });

  it('revokes on a full refund only', () => {
    const charge = { id: 'ch_synthetic', customer: 'cus_synthetic', refunded: true };
    expect(interpretEvent(event('charge.refunded', charge), LINKS)).toEqual({
      kind: 'revoke',
      reason: 'refund',
      customer_ref: 'cus_synthetic',
    });
    const partial = event('charge.refunded', { ...charge, refunded: false });
    expect(interpretEvent(partial, LINKS)).toEqual({ kind: 'ignore', reason: 'partial_refund' });
  });

  it('revokes on a dispute, resolving the charge later', () => {
    const dispute = event('charge.dispute.created', { id: 'dp_1', charge: 'ch_synthetic' });
    expect(interpretEvent(dispute, LINKS)).toEqual({
      kind: 'revoke_charge',
      reason: 'dispute',
      charge_ref: 'ch_synthetic',
    });
  });

  it('ignores event types it does not handle', () => {
    expect(interpretEvent(event('invoice.paid', { id: 'in_1' }), LINKS)).toEqual({
      kind: 'ignore',
      reason: 'unhandled_type',
    });
  });

  it('rejects an envelope that is not a Stripe event', () => {
    expect(stripeEventSchema.safeParse({ id: 'nope', type: 'x' }).success).toBe(false);
  });
});

describe('subscription state', () => {
  it.each([
    ['active', 'active'],
    ['trialing', 'active'],
    ['past_due', 'past_due'],
    ['canceled', 'cancelled'],
    ['unpaid', 'inactive'],
    ['incomplete', 'inactive'],
    ['incomplete_expired', 'inactive'],
    ['paused', 'inactive'],
    ['a_status_added_later', 'inactive'],
  ])('maps %s to %s', (status, expected) => {
    expect(subscriptionState({ id: 'sub_1', status })?.status).toBe(expected);
  });

  it('reads the period end from the subscription or, on newer API versions, its items', () => {
    expect(subscriptionState({ id: 'sub_1', status: 'active', current_period_end: NOW })).toEqual({
      status: 'active',
      current_period_end: NOW,
      cancel_at_period_end: false,
    });
    expect(
      subscriptionState({
        id: 'sub_1',
        status: 'active',
        cancel_at_period_end: true,
        items: { data: [{ current_period_end: NOW }, { current_period_end: NOW + 10 }] },
      }),
    ).toEqual({ status: 'active', current_period_end: NOW + 10, cancel_at_period_end: true });
  });

  it('answers null for something that is not a subscription', () => {
    expect(subscriptionState({ id: 'cus_1', status: 'active' })).toBeNull();
  });
});

describe('entitlement rules', () => {
  const now = new Date('2026-10-06T12:00:00Z');
  const row: EntitlementRow = {
    org_id: ORG,
    plan: 'pro',
    status: 'active',
    paid_through: '2026-11-06T12:00:00Z',
    cancel_at_period_end: false,
    revoked_at: null,
    revoke_reason: null,
    updated_at: '2026-10-06T12:00:00Z',
  };

  it('grants an active plan until the paid period ends', () => {
    expect(entitlementGrants(row, ['pro'], now)).toBe(true);
    expect(entitlementGrants(row, ['pro'], new Date('2026-11-06T12:00:00Z'))).toBe(false);
  });

  it('keeps a cancelled plan until the end of the paid period (cancelled is not revoked)', () => {
    const cancelled = { ...row, status: 'cancelled' };
    expect(entitlementGrants(cancelled, ['pro'], now)).toBe(true);
    expect(summarizeEntitlement(cancelled, now)).toEqual({
      kind: 'ending',
      plan: 'pro',
      until: row.paid_through,
    });
  });

  it('ends at once on a refund or dispute', () => {
    const revoked = {
      ...row,
      status: 'revoked',
      revoked_at: '2026-10-06T11:00:00Z',
      revoke_reason: 'dispute',
    };
    expect(entitlementGrants(revoked, ['pro'], now)).toBe(false);
    expect(summarizeEntitlement(revoked, now)).toEqual({
      kind: 'revoked',
      plan: 'pro',
      reason: 'dispute',
    });
  });

  it('fails closed on anything missing or unrecognised', () => {
    expect(entitlementGrants(null, ['pro'], now)).toBe(false);
    expect(entitlementGrants({ ...row, paid_through: null }, ['pro'], now)).toBe(false);
    expect(entitlementGrants({ ...row, paid_through: 'not a date' }, ['pro'], now)).toBe(false);
    expect(entitlementGrants({ ...row, status: 'inactive' }, ['pro'], now)).toBe(false);
    expect(entitlementGrants({ ...row, status: 'something_new' }, ['pro'], now)).toBe(false);
    expect(entitlementGrants({ ...row, plan: 'enterprise' }, ['pro'], now)).toBe(false);
    expect(entitlementGrants(row, ['team'], now)).toBe(false);
    expect(entitlementGrants(row, [], now)).toBe(false);
  });

  it('describes no entitlement as the free plan', () => {
    expect(summarizeEntitlement(null, now)).toEqual({ kind: 'free' });
  });
});

describe('plans and offers', () => {
  const configured = {
    PRICES_APPROVED: 'true',
    PRICE_PRO_AMOUNT: '29',
    PRICE_PRO_CURRENCY: 'USD',
    PRICE_PRO_INTERVAL: 'month',
    PAYMENT_LINK_PRO_URL: 'https://buy.stripe.com/test_synthetic',
    PAYMENT_LINK_PRO_ID: 'plink_synthpro123',
  };

  it('offers no paid plan, and no price, while nothing is configured', () => {
    const plans = resolvePlans({}, true);
    expect(plans.map((plan) => [plan.id, plan.offer.state])).toEqual([
      ['free', 'free'],
      ['pro', 'unavailable'],
      ['team', 'unavailable'],
    ]);
  });

  it('offers a plan only with every value set and payments open', () => {
    expect(resolveOffer('pro', configured, true)).toEqual({
      state: 'purchasable',
      price: '$29',
      interval: 'month',
      paymentLinkUrl: 'https://buy.stripe.com/test_synthetic',
    });
    // Approved but not buyable: the proposed prices show, with nothing to buy.
    expect(resolveOffer('pro', configured, false)).toEqual({
      state: 'listed',
      prices: listedPrices('pro'),
    });
    for (const key of Object.keys(configured)) {
      expect(resolveOffer('pro', { ...configured, [key]: '' }, true).state).toBe(
        key === 'PRICES_APPROVED' ? 'unavailable' : 'listed',
      );
    }
  });

  it('shows no price at all until the owner approves the prices', () => {
    for (const value of [undefined, '', 'false', 'TRUE', '1', 'yes']) {
      expect(pricesApproved({ PRICES_APPROVED: value })).toBe(false);
      expect(resolveOffer('pro', { ...configured, PRICES_APPROVED: value }, true)).toEqual({
        state: 'unavailable',
      });
    }
    expect(pricesApproved({ PRICES_APPROVED: 'true' })).toBe(true);
  });

  it('lists the proposed prices, monthly and yearly, in US dollars and euros', () => {
    const plans = resolvePlans({ PRICES_APPROVED: 'true' }, false);
    expect(plans.map((plan) => [plan.id, plan.offer.state])).toEqual([
      ['free', 'free'],
      ['pro', 'listed'],
      ['team', 'listed'],
    ]);
    expect(listedPrices('pro')).toEqual([
      { currency: 'USD', month: '$19', year: '$190', monthsFree: 2 },
      { currency: 'EUR', month: '€19', year: '€190', monthsFree: 2 },
    ]);
    expect(listedPrices('team').map((price) => [price.month, price.year])).toEqual([
      ['$49', '$490'],
      ['€49', '€490'],
    ]);
    for (const plan of PAID_PLAN_IDS) {
      for (const currency of ['USD', 'EUR'] as const) {
        const { month, year } = PROPOSED_PRICES[plan][currency];
        expect(year).toBeLessThan(month * 12);
      }
    }
  });

  it.each([
    ['PRICE_PRO_AMOUNT', '0'],
    ['PRICE_PRO_AMOUNT', '29.999'],
    ['PRICE_PRO_AMOUNT', '-5'],
    ['PRICE_PRO_CURRENCY', 'usd'],
    ['PRICE_PRO_CURRENCY', 'ZZZ1'],
    ['PRICE_PRO_INTERVAL', 'week'],
    ['PAYMENT_LINK_PRO_URL', 'http://buy.stripe.com/test_synthetic'],
    ['PAYMENT_LINK_PRO_URL', 'https://buy.stripe.com/test_synthetic?prefilled_email=a@b.c'],
    ['PAYMENT_LINK_PRO_ID', 'not-a-link'],
  ])('fails one plan closed on an invalid %s', (key, value) => {
    expect(resolveOffer('pro', { ...configured, [key]: value }, true).state).toBe('listed');
  });

  it('maps Payment Link ids to plans independently of the displayed price', () => {
    expect(paymentLinkPlans({ PAYMENT_LINK_PRO_ID: 'plink_synthpro123' })).toEqual(
      new Map([['plink_synthpro123', 'pro']]),
    );
    expect(paymentLinkPlans({ PAYMENT_LINK_PRO_ID: 'bogus' }).size).toBe(0);
  });

  it('passes only the organization id to checkout', () => {
    expect(upgradeUrl('https://buy.stripe.com/test_synthetic', ORG)).toBe(
      `https://buy.stripe.com/test_synthetic?client_reference_id=${ORG}`,
    );
    expect(upgradeUrl('https://buy.stripe.com/test_synthetic', 'person@example.invalid')).toBe(
      undefined,
    );
  });

  it('gates PDF branding, the accounting imports and the API, and invents no other paid-only feature', () => {
    const paid = FEATURES.filter((feature) => !featurePlans(feature.key).includes('free'));
    expect(paid.map((feature) => feature.key)).toEqual([
      'pdf_branding',
      'integrations.quickbooks',
      'integrations.xero',
      'api',
    ]);
    // The imports and the API need configuration; without it they are not claimed (D-025).
    expect(paidOnlyFeatures('pro').map((feature) => feature.key)).toEqual(['pdf_branding']);
    expect(paidOnlyFeatures('team').map((feature) => feature.key)).toEqual(['pdf_branding']);
    expect(
      paidOnlyFeatures('team', { rest_api: true }).map((feature) => feature.key),
    ).toEqual(['pdf_branding', 'api']);
    const both = { quickbooks_import: true, xero_import: true, rest_api: true };
    expect(paidOnlyFeatures('pro', both).map((feature) => feature.key)).toEqual([
      'pdf_branding',
      'integrations.quickbooks',
      'integrations.xero',
    ]);
    expect(paidOnlyFeatures('team', both).map((feature) => feature.key)).toEqual([
      'pdf_branding',
      'integrations.quickbooks',
      'integrations.xero',
      'api',
    ]);
    expect(PAID_PLAN_IDS).toEqual(['pro', 'team']);
    expect(featurePlans('a.feature.that.does.not.exist')).toEqual([]);
  });

  it('states the limits the code enforces', () => {
    const limits = FEATURES.map((feature) => ('limit' in feature ? feature.limit : '')).join(' ');
    expect(limits).toContain(`Up to ${MAX_TOOL_LINES} lines`);
    expect(limits).toContain(`Up to ${MAX_SET_DOCUMENTS} documents`);
    expect(limits).toContain(MAX_IMPORT_ROWS.toLocaleString('en'));
  });
});
