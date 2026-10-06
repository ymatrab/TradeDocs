import { createHmac } from 'node:crypto';
import { afterEach, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as webhook } from '@/app/api/billing/stripe/webhook/route';

// Synthetic values only; nothing here is a real key or a real Stripe object.
const SECRET = 'synthetic-webhook-signing-secret';
const ORG = '0a000000-0000-4000-8000-00000000000a';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function openPayments() {
  vi.stubEnv('APP_ENV', 'test');
  vi.stubEnv('APPLICATION_MODE', 'service');
  vi.stubEnv('SUPABASE_URL', 'http://127.0.0.1:54321');
  vi.stubEnv('SUPABASE_ANON_KEY', 'synthetic-public-test-key');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'synthetic-service-test-key');
  vi.stubEnv('SUPABASE_PROJECT_REF', 'syntheticproject');
  vi.stubEnv('SUPABASE_ENVIRONMENT', 'test');
  vi.stubEnv('ENABLE_PAYMENTS', 'true');
  vi.stubEnv('PAYMENTS_APPROVED', 'true');
  vi.stubEnv('PAYMENT_PROVIDER', 'stripe');
  vi.stubEnv('PAYMENT_API_KEY', 'synthetic-payment-api-key');
  vi.stubEnv('PAYMENT_WEBHOOK_SECRET', SECRET);
  vi.stubEnv('PAYMENT_LINK_PRO_ID', 'plink_synthpro123');
}

function checkoutEvent(livemode = false) {
  return JSON.stringify({
    id: 'evt_synthetic_checkout',
    object: 'event',
    type: 'checkout.session.completed',
    livemode,
    created: Math.floor(Date.now() / 1000),
    data: {
      object: {
        id: 'cs_test_synthetic',
        object: 'checkout.session',
        mode: 'subscription',
        payment_status: 'paid',
        client_reference_id: ORG,
        customer: 'cus_synthetic',
        subscription: 'sub_synthetic',
        payment_link: 'plink_synthpro123',
      },
    },
  });
}

function signedRequest(body: string, secret = SECRET) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
  return new NextRequest('http://127.0.0.1/api/billing/stripe/webhook', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'stripe-signature': `t=${timestamp},v1=${signature}`,
    },
    body,
  });
}

/** Stripe answers the live subscription read; the database answers the ledger call. */
function services(ledger: Response | Error = Response.json('applied')) {
  return vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
    void _init;
    const url = String(input);
    if (url === 'https://api.stripe.com/v1/subscriptions/sub_synthetic') {
      return Response.json({
        id: 'sub_synthetic',
        object: 'subscription',
        status: 'active',
        cancel_at_period_end: false,
        items: { data: [{ current_period_end: 1_900_000_000 }] },
      });
    }
    if (url.endsWith('/rest/v1/rpc/apply_billing_event')) {
      if (ledger instanceof Error) throw ledger;
      return ledger;
    }
    throw new Error(`Unexpected request to ${url}`);
  });
}

it('does not exist while payments are closed', async () => {
  vi.stubEnv('APP_ENV', 'test');
  const fetcher = vi.fn();
  vi.stubGlobal('fetch', fetcher);
  const response = await webhook(signedRequest(checkoutEvent()));
  expect(response.status).toBe(404);
  expect(fetcher).not.toHaveBeenCalled();
});

it('refuses an unsigned or wrongly signed request before reading anything', async () => {
  openPayments();
  const fetcher = vi.fn();
  vi.stubGlobal('fetch', fetcher);
  expect((await webhook(signedRequest(checkoutEvent(), 'not-the-endpoint-secret'))).status).toBe(
    400,
  );
  const unsigned = new NextRequest('http://127.0.0.1/api/billing/stripe/webhook', {
    method: 'POST',
    body: checkoutEvent(),
  });
  expect((await webhook(unsigned)).status).toBe(400);
  expect(fetcher).not.toHaveBeenCalled();
});

it('grants from a verified checkout using the live subscription state', async () => {
  openPayments();
  const fetcher = services();
  vi.stubGlobal('fetch', fetcher);
  const response = await webhook(signedRequest(checkoutEvent()));
  expect(response.status).toBe(200);

  const ledgerCall = fetcher.mock.calls.find(([url]) => String(url).includes('/rpc/'));
  const init = ledgerCall?.[1] as RequestInit;
  expect(new Headers(init.headers).get('authorization')).toBe('Bearer synthetic-service-test-key');
  expect(JSON.parse(String(init.body))).toEqual({
    p_event_id: 'evt_synthetic_checkout',
    p_event_type: 'checkout.session.completed',
    p_action: {
      kind: 'grant',
      org_id: ORG,
      plan: 'pro',
      customer_ref: 'cus_synthetic',
      subscription_ref: 'sub_synthetic',
      checkout_ref: 'cs_test_synthetic',
      status: 'active',
      current_period_end: 1_900_000_000,
      cancel_at_period_end: false,
    },
  });
});

it('acknowledges a redelivered event without acting twice', async () => {
  openPayments();
  vi.stubGlobal('fetch', services(Response.json('duplicate')));
  expect((await webhook(signedRequest(checkoutEvent()))).status).toBe(200);
});

it('never acts on a live-mode event outside production', async () => {
  openPayments();
  const fetcher = vi.fn();
  vi.stubGlobal('fetch', fetcher);
  expect((await webhook(signedRequest(checkoutEvent(true)))).status).toBe(200);
  expect(fetcher).not.toHaveBeenCalled();
});

it('asks Stripe to retry when the ledger cannot be written', async () => {
  openPayments();
  vi.stubGlobal('fetch', services(new Error('database unreachable')));
  expect((await webhook(signedRequest(checkoutEvent()))).status).toBe(500);
});

it('asks Stripe to retry when the subscription cannot be read', async () => {
  openPayments();
  vi.stubGlobal('fetch', vi.fn(async () => new Response('unavailable', { status: 503 })));
  expect((await webhook(signedRequest(checkoutEvent()))).status).toBe(503);
});

it('refuses an oversized body', async () => {
  openPayments();
  vi.stubGlobal('fetch', vi.fn());
  const body = 'x'.repeat(300 * 1024);
  expect((await webhook(signedRequest(body))).status).toBe(413);
});
