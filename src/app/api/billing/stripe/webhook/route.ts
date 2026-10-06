import { NextResponse, type NextRequest } from 'next/server';
import {
  applyBillingEvent,
  currentBillingConfig,
  resolveIntent,
  type ApplyOutcome,
} from '@/lib/billing/server';
import { createStripeReader } from '@/lib/billing/stripe-api';
import {
  interpretEvent,
  stripeEventSchema,
  type BillingAction,
  type StripeEvent,
} from '@/lib/billing/stripe-events';
import { verifyStripeSignature } from '@/lib/billing/stripe-signature';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Stripe's webhook for Payment Links. The only path that grants, changes or revokes a paid
 * entitlement, and it acts only on facts it has verified:
 *
 * 1. Payments must be open (src/lib/billing/server.ts). Closed answers 404, as if the route
 *    did not exist; open but misconfigured answers 503.
 * 2. The Stripe-Signature must match the raw body within five minutes (stripe-signature.ts).
 * 3. The event's mode must match the environment: production takes live events only, every
 *    other environment test events only, so a preview can never act on a real payment.
 * 4. Subscription state and dispute customers are read live from Stripe, not from the event.
 * 5. The event id and its effect are written in one transaction; a redelivery is a no-op.
 *
 * A failure Stripe should retry (Stripe or the database unreachable) answers 5xx; a request
 * that will never succeed (bad signature, malformed body) answers 400. Logs carry the event id,
 * type and outcome only — never a customer, an amount or an address.
 */

/** Stripe events are a few kilobytes; this bounds what an unauthenticated caller can send. */
const MAX_BODY_BYTES = 256 * 1024;

function reply(status: number, body: Record<string, unknown>, headers?: HeadersInit) {
  const merged = new Headers(headers);
  merged.set('Cache-Control', 'no-store');
  return NextResponse.json(body, { status, headers: merged });
}

function log(entry: Record<string, string>) {
  console.info(JSON.stringify({ source: 'billing.webhook', ...entry }));
}

async function readBounded(request: Request): Promise<Uint8Array | null> {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => undefined);
      return null;
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function POST(request: NextRequest) {
  const config = currentBillingConfig();
  if (config.state === 'disabled') return reply(404, { error: 'Not found.' });
  if (config.state === 'misconfigured') {
    log({ outcome: 'misconfigured', reason: config.reason });
    return reply(503, { error: 'Billing is not available.' }, { 'Retry-After': '300' });
  }

  const declared = request.headers.get('content-length');
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > MAX_BODY_BYTES)) {
    return reply(413, { error: 'Payload too large.' });
  }
  const body = await readBounded(request);
  if (!body) return reply(413, { error: 'Payload too large.' });

  const signature = verifyStripeSignature(
    body,
    request.headers.get('stripe-signature'),
    config.webhookSecret,
  );
  if (!signature.ok) {
    log({ outcome: 'rejected', reason: signature.reason });
    return reply(400, { error: 'Invalid signature.' });
  }

  let event: StripeEvent;
  try {
    const parsed = stripeEventSchema.safeParse(
      JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(body)),
    );
    if (!parsed.success) throw new Error('shape');
    event = parsed.data;
  } catch {
    log({ outcome: 'rejected', reason: 'malformed_event' });
    return reply(400, { error: 'Malformed event.' });
  }

  if (event.livemode !== config.livemode) {
    // Acknowledged so Stripe stops retrying, and recorded nowhere: this deployment must not act
    // on the other mode's events at all.
    log({ id: event.id, type: event.type, outcome: 'ignored', reason: 'mode_mismatch' });
    return reply(200, { received: true });
  }

  let action: BillingAction;
  try {
    action = await resolveIntent(
      interpretEvent(event, config.paymentLinks),
      createStripeReader(config.apiKey),
    );
  } catch {
    log({ id: event.id, type: event.type, outcome: 'retry', reason: 'stripe_unavailable' });
    return reply(503, { error: 'Temporarily unavailable.' }, { 'Retry-After': '60' });
  }

  let outcome: ApplyOutcome;
  try {
    outcome = await applyBillingEvent(config, event, action);
  } catch {
    log({ id: event.id, type: event.type, outcome: 'retry', reason: 'ledger_unavailable' });
    return reply(500, { error: 'Temporarily unavailable.' });
  }

  log({
    id: event.id,
    type: event.type,
    outcome,
    ...(action.kind === 'ignore' ? { reason: action.reason } : {}),
  });
  return reply(200, { received: true });
}
