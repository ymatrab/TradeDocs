import type { NextRequest } from 'next/server';
import {
  handleVerifiedEvent,
  RetryableCallbackError,
  type CallbackOutcome,
} from '@/lib/esign/callback';
import {
  CALLBACK_ACKNOWLEDGEMENT,
  callbackEventSchema,
  verifyEventHash,
  type CallbackEvent,
} from '@/lib/esign/dropbox-sign';
import { callbackDeps, currentEsignConfig } from '@/lib/esign/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Dropbox Sign's event callback (account or API app callback URL:
 * <APP_URL>/api/esign/dropbox-sign/callback; RUNBOOK.md, "E-signature").
 *
 * 1. E-signature must be configured. Without the API key the route answers 404, as if it did
 *    not exist; configured but incomplete answers 503.
 * 2. The body is bounded, then read as multipart/form-data (the event in field `json`, the
 *    documented default) or as application/json.
 * 3. event_hash must equal HMAC-SHA256(API key, event_time + event_type), compared in
 *    constant time. A mismatch answers 401 and does nothing.
 * 4. The hash does not cover the payload, so the request's state is read live from the API
 *    (src/lib/esign/callback.ts). A replayed event can only prompt a fresh read of the truth;
 *    the event ledger makes a redelivery a no-op.
 * 5. Success answers 200 with "Hello API Event Received", which Dropbox Sign requires. A
 *    failure it should retry (the provider or the database unreachable) answers 5xx.
 *
 * Logs carry the event type, the outcome and TradeDocs' row-free reason only: never a signer,
 * an email address, a document number or any document content.
 */

/** Events are a few kilobytes; this bounds what an unauthenticated caller can send. */
const MAX_BODY_BYTES = 512 * 1024;

function acknowledge(): Response {
  return new Response(CALLBACK_ACKNOWLEDGEMENT, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function refuse(status: number, message: string, headers?: Record<string, string>): Response {
  return Response.json(
    { error: message },
    { status, headers: { 'Cache-Control': 'no-store', ...headers } },
  );
}

function log(entry: Record<string, string>) {
  console.info(JSON.stringify({ source: 'esign.callback', ...entry }));
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

/** The event JSON from either documented body shape, or null. */
async function eventJson(body: Uint8Array, contentType: string): Promise<unknown> {
  try {
    if (contentType.toLowerCase().startsWith('multipart/form-data')) {
      const form = await new Response(body as BodyInit, {
        headers: { 'Content-Type': contentType },
      }).formData();
      const field = form.get('json');
      return typeof field === 'string' ? JSON.parse(field) : null;
    }
    if (contentType.toLowerCase().startsWith('application/x-www-form-urlencoded')) {
      const field = new URLSearchParams(new TextDecoder('utf-8', { fatal: true }).decode(body)).get(
        'json',
      );
      return field ? JSON.parse(field) : null;
    }
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(body));
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const config = currentEsignConfig();
  if (config.state === 'disabled') return refuse(404, 'Not found.');
  if (config.state === 'misconfigured') {
    log({ outcome: 'misconfigured', reason: config.reason });
    return refuse(503, 'E-signature is not available.', { 'Retry-After': '300' });
  }

  const declared = request.headers.get('content-length');
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > MAX_BODY_BYTES)) {
    return refuse(413, 'Payload too large.');
  }
  const body = await readBounded(request);
  if (!body) return refuse(413, 'Payload too large.');

  const parsed = callbackEventSchema.safeParse(
    await eventJson(body, request.headers.get('content-type') ?? ''),
  );
  if (!parsed.success) {
    log({ outcome: 'rejected', reason: 'malformed_event' });
    return refuse(400, 'Malformed event.');
  }
  const event: CallbackEvent = parsed.data;

  if (!verifyEventHash(event.event, config.apiKey)) {
    log({ type: event.event.event_type, outcome: 'rejected', reason: 'bad_event_hash' });
    return refuse(401, 'Invalid event hash.');
  }

  let outcome: CallbackOutcome;
  try {
    outcome = await handleVerifiedEvent(event, callbackDeps(config));
  } catch (error) {
    const reason = error instanceof RetryableCallbackError ? error.reason : 'store_unavailable';
    log({ type: event.event.event_type, outcome: 'retry', reason });
    return refuse(503, 'Temporarily unavailable.', { 'Retry-After': '60' });
  }

  log({ type: event.event.event_type, outcome });
  return acknowledge();
}
