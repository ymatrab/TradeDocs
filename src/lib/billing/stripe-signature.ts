import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Stripe webhook signature verification, by Stripe's documented manual scheme
 * (https://docs.stripe.com/webhooks#verify-manually, retrieved 2026-10-06):
 *
 * 1. The Stripe-Signature header is comma-separated `prefix=value` pairs. `t` is the Unix
 *    timestamp; every `v1` is a signature. Every other scheme (including the test-only `v0`)
 *    is ignored, which prevents a downgrade.
 * 2. The signed payload is `${t}.${rawBody}`: the body exactly as received, never re-serialised.
 * 3. The expected signature is HMAC-SHA256 of that payload keyed with the endpoint secret.
 * 4. Each `v1` is compared in constant time; there may be several while a secret is rolled.
 *    A match must also have a timestamp within the tolerance (Stripe's libraries default to
 *    five minutes), which bounds replay. Event ids are deduplicated separately.
 *
 * No SDK: node:crypto is all the scheme needs.
 */

export const SIGNATURE_TOLERANCE_SECONDS = 300;

export type SignatureFailure = 'missing' | 'malformed' | 'no_match' | 'outside_tolerance';
export type SignatureResult =
  { ok: true; timestamp: number } | { ok: false; reason: SignatureFailure };

const MAX_HEADER_LENGTH = 4096;

export function verifyStripeSignature(
  payload: Uint8Array,
  header: string | null | undefined,
  secret: string,
  nowSeconds: number = Math.floor(Date.now() / 1000),
  toleranceSeconds: number = SIGNATURE_TOLERANCE_SECONDS,
): SignatureResult {
  // A zero or negative tolerance would switch the recency check off; refuse to run that way.
  if (!Number.isInteger(toleranceSeconds) || toleranceSeconds <= 0) {
    throw new Error('Signature tolerance must be a positive number of seconds.');
  }
  if (!secret) throw new Error('A webhook signing secret is required.');
  if (!header) return { ok: false, reason: 'missing' };
  if (header.length > MAX_HEADER_LENGTH) return { ok: false, reason: 'malformed' };

  let timestamp: string | undefined;
  const signatures: Buffer[] = [];
  for (const element of header.split(',')) {
    const separator = element.indexOf('=');
    if (separator < 1) continue;
    const prefix = element.slice(0, separator).trim();
    const value = element.slice(separator + 1).trim();
    if (prefix === 't') {
      if (timestamp !== undefined) return { ok: false, reason: 'malformed' };
      timestamp = value;
    } else if (prefix === 'v1' && /^[0-9a-f]{64}$/.test(value)) {
      signatures.push(Buffer.from(value, 'hex'));
    }
  }
  if (timestamp === undefined || !/^\d{1,12}$/.test(timestamp) || signatures.length === 0) {
    return { ok: false, reason: 'malformed' };
  }

  const expected = createHmac('sha256', secret)
    .update(`${timestamp}.`, 'utf8')
    .update(payload)
    .digest();
  // Every candidate is compared, so the time taken does not reveal which one matched.
  let matched = false;
  for (const signature of signatures) {
    if (signature.length === expected.length && timingSafeEqual(signature, expected)) {
      matched = true;
    }
  }
  if (!matched) return { ok: false, reason: 'no_match' };

  const signedAt = Number(timestamp);
  if (Math.abs(nowSeconds - signedAt) > toleranceSeconds) {
    return { ok: false, reason: 'outside_tolerance' };
  }
  return { ok: true, timestamp: signedAt };
}
