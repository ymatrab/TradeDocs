import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

/**
 * Dropbox Sign (formerly HelloSign) API v3, by its official documentation, retrieved
 * 2026-10-09. No SDK: fetch and FormData are all the calls need.
 *
 * - Base URL https://api.hellosign.com/v3 (OpenAPI `servers`,
 *   https://github.com/hellosign/hellosign-openapi/blob/main/openapi.yaml).
 * - Auth: HTTP Basic, the API key as the user name and an empty password ("the API key is
 *   passed as the username and the password is left blank";
 *   https://developers.hellosign.com/api/reference/authentication/).
 * - POST /signature_request/send accepts multipart/form-data with the file as `files[0]` and
 *   signers as `signers[i][email_address]` / `signers[i][name]`
 *   (https://developers.hellosign.com/api/reference/operation/signatureRequestSend/ and the
 *   official curl example, examples/SignatureRequestSendExample.sh in hellosign-openapi).
 *   title and subject are at most 255 characters, message 5000; metadata up to 10 keys, key
 *   names up to 40 characters, values up to 1000. `test_mode=1` is not legally binding.
 * - GET /signature_request/{id} returns the live request: is_complete, is_declined,
 *   has_error, expires_at, metadata, test_mode and signatures[] (status_code, signed_at).
 * - GET /signature_request/files/{id}?file_type=pdf returns the merged signed PDF, or 409
 *   while the files are still being prepared
 *   (https://developers.hellosign.com/api/reference/operation/signatureRequestFiles/).
 * - Callbacks (https://developers.hellosign.com/docs/events/walkthrough/): multipart/form-data
 *   with the event in a field named `json`; the endpoint must answer 200 with a body
 *   containing "Hello API Event Received". `event_hash` is HMAC-SHA256, keyed with the API
 *   key, of event_time followed by event_type, hex encoded (the official Node SDK's
 *   EventCallbackHelper.isValid compares against digest('hex')).
 *
 * The event hash covers event_time and event_type only, not the request it describes, so the
 * callback never trusts the payload's state: it treats a verified event as a prompt and reads
 * the request live from the API with this deployment's own key.
 */

export const DROPBOX_SIGN_API = 'https://api.hellosign.com/v3';
export const CALLBACK_ACKNOWLEDGEMENT = 'Hello API Event Received';
/** The metadata key that carries TradeDocs' own request id to the provider and back. */
export const REQUEST_METADATA_KEY = 'tradedocs_request_id';

export function basicAuthorization(apiKey: string): string {
  return `Basic ${Buffer.from(`${apiKey}:`, 'utf8').toString('base64')}`;
}

// --- Sending -----------------------------------------------------------------------------

export type SignerInput = { email: string; name: string };

export type SendInput = {
  pdf: Uint8Array;
  fileName: string;
  title: string;
  subject: string;
  message: string | null;
  signers: readonly SignerInput[];
  testMode: boolean;
  clientId: string | null;
  /** TradeDocs' own request id, returned in metadata on every response and event. */
  requestId: string;
};

const clip = (value: string, max: number) => (value.length > max ? value.slice(0, max) : value);

/** The multipart body of POST /signature_request/send. Pure, so it can be tested. */
export function buildSendForm(input: SendInput): FormData {
  const form = new FormData();
  // A copy: the Blob must own its bytes, whatever buffer the PDF was rendered into.
  form.append(
    'files[0]',
    new Blob([new Uint8Array(input.pdf)], { type: 'application/pdf' }),
    clip(input.fileName, 120),
  );
  form.append('title', clip(input.title, 255));
  form.append('subject', clip(input.subject, 255));
  if (input.message) form.append('message', clip(input.message, 5000));
  input.signers.forEach((signer, index) => {
    form.append(`signers[${index}][email_address]`, signer.email);
    form.append(`signers[${index}][name]`, clip(signer.name, 255));
  });
  form.append(`metadata[${REQUEST_METADATA_KEY}]`, input.requestId);
  form.append('test_mode', input.testMode ? '1' : '0');
  if (input.clientId) form.append('client_id', input.clientId);
  return form;
}

// --- Responses ---------------------------------------------------------------------------

const signatureSchema = z.object({
  signature_id: z.string().nullish(),
  signer_email_address: z.string().nullish(),
  signer_name: z.string().nullish(),
  status_code: z.string().nullish(),
  signed_at: z.number().int().nullish(),
});

export const signatureRequestSchema = z.object({
  signature_request_id: z.string().regex(/^[A-Za-z0-9]{10,64}$/),
  test_mode: z.boolean().nullish(),
  is_complete: z.boolean().nullish(),
  is_declined: z.boolean().nullish(),
  has_error: z.boolean().nullish(),
  expires_at: z.number().int().nullish(),
  metadata: z.record(z.string(), z.unknown()).nullish(),
  signatures: z.array(signatureSchema).max(50).nullish(),
});
export type SignatureRequest = z.infer<typeof signatureRequestSchema>;

const responseSchema = z.object({ signature_request: signatureRequestSchema });

export type ProviderFailure = { ok: false; kind: 'rejected' | 'unavailable'; status: number };

/** Our request id as the provider returns it, or null. */
export function metadataRequestId(request: Pick<SignatureRequest, 'metadata'>): string | null {
  const value = request.metadata?.[REQUEST_METADATA_KEY];
  return typeof value === 'string' && z.uuid().safeParse(value).success ? value : null;
}

// --- Status -----------------------------------------------------------------------------

export type RequestStatus = 'sent' | 'signed' | 'declined' | 'cancelled' | 'expired' | 'error';
export type SignerStatus = 'awaiting_signature' | 'signed' | 'declined' | 'error' | 'unknown';

export type SignerState = {
  email: string;
  name: string;
  status: SignerStatus;
  signed_at: string | null;
};

/** One signer's provider status_code, folded into the few states TradeDocs shows. */
export function mapSignerStatus(code: string | null | undefined): SignerStatus {
  if (!code) return 'unknown';
  if (code === 'signed') return 'signed';
  if (code === 'declined') return 'declined';
  if (code === 'awaiting_signature' || code === 'on_hold') return 'awaiting_signature';
  if (code.startsWith('error')) return 'error';
  return 'unknown';
}

/**
 * The overall status from the live request. Completion and decline outrank everything; an
 * unsigned request past its expiry is expired; an error flag is an error; anything else is
 * still out for signature. Cancellation is decided by the caller, because a cancelled
 * request is no longer readable (it answers 404 or 410).
 */
export function mapRequestStatus(request: SignatureRequest, nowSeconds: number): RequestStatus {
  if (request.is_complete) return 'signed';
  if (request.is_declined) return 'declined';
  if (typeof request.expires_at === 'number' && request.expires_at <= nowSeconds) return 'expired';
  if (request.has_error) return 'error';
  return 'sent';
}

/**
 * Each signer's state, matched to the signers TradeDocs recorded by email so the stored list
 * keeps the names it was sent with. A signer the provider no longer lists keeps its last
 * state; one it adds (a reassignment) is appended.
 */
export function signerStates(
  recorded: readonly SignerState[],
  request: SignatureRequest,
): SignerState[] {
  const live = new Map<string, z.infer<typeof signatureSchema>>();
  for (const signature of request.signatures ?? []) {
    const email = signature.signer_email_address?.trim().toLowerCase();
    if (email && !live.has(email)) live.set(email, signature);
  }
  const result = recorded.map((signer) => {
    const signature = live.get(signer.email.toLowerCase());
    if (!signature) return signer;
    live.delete(signer.email.toLowerCase());
    return {
      email: signer.email,
      name: signer.name,
      status: mapSignerStatus(signature.status_code),
      signed_at:
        typeof signature.signed_at === 'number'
          ? new Date(signature.signed_at * 1000).toISOString()
          : null,
    };
  });
  for (const [email, signature] of live) {
    if (result.length >= 5) break;
    result.push({
      email,
      name: clip(signature.signer_name?.trim() || email, 120),
      status: mapSignerStatus(signature.status_code),
      signed_at:
        typeof signature.signed_at === 'number'
          ? new Date(signature.signed_at * 1000).toISOString()
          : null,
    });
  }
  return result;
}

// --- Events ------------------------------------------------------------------------------

export const callbackEventSchema = z.object({
  event: z.object({
    event_time: z.union([z.string(), z.number()]).transform(String),
    event_type: z.string().min(1).max(100),
    event_hash: z.string().max(256),
  }),
  signature_request: z
    .object({
      signature_request_id: z.string().regex(/^[A-Za-z0-9]{10,64}$/),
      metadata: z.record(z.string(), z.unknown()).nullish(),
    })
    .nullish(),
});
export type CallbackEvent = z.infer<typeof callbackEventSchema>;

/**
 * Whether an event's hash is the one Dropbox Sign computes with this API key. The expected
 * value is HMAC-SHA256(apiKey, event_time + event_type) in hex; the comparison is constant
 * time and refuses anything that is not 64 hex characters.
 */
export function verifyEventHash(
  event: { event_time: string; event_type: string; event_hash: string },
  apiKey: string,
): boolean {
  if (!apiKey) throw new Error('An API key is required to verify Dropbox Sign events.');
  if (!/^[0-9a-f]{64}$/i.test(event.event_hash)) return false;
  if (!/^\d{1,12}$/.test(event.event_time)) return false;
  const expected = createHmac('sha256', apiKey)
    .update(`${event.event_time}${event.event_type}`, 'utf8')
    .digest();
  const given = Buffer.from(event.event_hash.toLowerCase(), 'hex');
  return given.length === expected.length && timingSafeEqual(given, expected);
}

// --- Client ------------------------------------------------------------------------------

export type DropboxSignClient = {
  send(
    input: SendInput,
  ): Promise<{ ok: true; request: SignatureRequest } | ProviderFailure>;
  get(
    id: string,
  ): Promise<{ ok: true; request: SignatureRequest } | ProviderFailure | { ok: false; kind: 'gone' }>;
  /** The merged signed PDF; 'not_ready' while the provider is still preparing it (409). */
  signedPdf(
    id: string,
    maxBytes: number,
  ): Promise<{ ok: true; bytes: Uint8Array } | { ok: false; kind: 'not_ready' | 'too_large' | 'invalid' } | ProviderFailure>;
};

async function readBounded(response: Response, maxBytes: number): Promise<Uint8Array | null> {
  const declared = response.headers.get('content-length');
  if (declared && /^\d+$/.test(declared) && Number(declared) > maxBytes) {
    await response.body?.cancel().catch(() => undefined);
    return null;
  }
  const reader = response.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => undefined);
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function failure(status: number): ProviderFailure {
  // 4xx other than rate limiting will not succeed on retry; 429 and 5xx might.
  const kind = status === 429 || status >= 500 ? 'unavailable' : 'rejected';
  return { ok: false, kind, status };
}

export function createDropboxSignClient(
  apiKey: string,
  fetcher: typeof fetch = fetch,
): DropboxSignClient {
  const authorization = basicAuthorization(apiKey);
  const call = (path: string, init: RequestInit = {}, timeout = 15_000) =>
    fetcher(`${DROPBOX_SIGN_API}${path}`, {
      ...init,
      headers: { Authorization: authorization, Accept: 'application/json', ...init.headers },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(timeout),
    });

  async function parseRequest(response: Response) {
    const parsed = responseSchema.safeParse(await response.json().catch(() => null));
    return parsed.success ? parsed.data.signature_request : null;
  }

  return {
    async send(input) {
      const response = await call(
        '/signature_request/send',
        { method: 'POST', body: buildSendForm(input) },
        30_000,
      );
      if (!response.ok) {
        void response.body?.cancel().catch(() => undefined);
        return failure(response.status);
      }
      const request = await parseRequest(response);
      return request ? { ok: true, request } : { ok: false, kind: 'unavailable', status: 502 };
    },

    async get(id) {
      if (!/^[A-Za-z0-9]{10,64}$/.test(id)) return { ok: false, kind: 'rejected', status: 400 };
      const response = await call(`/signature_request/${id}`);
      if (response.status === 404 || response.status === 410) {
        void response.body?.cancel().catch(() => undefined);
        return { ok: false, kind: 'gone' };
      }
      if (!response.ok) {
        void response.body?.cancel().catch(() => undefined);
        return failure(response.status);
      }
      const request = await parseRequest(response);
      return request ? { ok: true, request } : { ok: false, kind: 'unavailable', status: 502 };
    },

    async signedPdf(id, maxBytes) {
      if (!/^[A-Za-z0-9]{10,64}$/.test(id)) return { ok: false, kind: 'rejected', status: 400 };
      const response = await call(
        `/signature_request/files/${id}?file_type=pdf`,
        { headers: { Accept: 'application/pdf' } },
        30_000,
      );
      if (response.status === 409) {
        void response.body?.cancel().catch(() => undefined);
        return { ok: false, kind: 'not_ready' };
      }
      if (!response.ok) {
        void response.body?.cancel().catch(() => undefined);
        return failure(response.status);
      }
      const bytes = await readBounded(response, maxBytes);
      if (!bytes) return { ok: false, kind: 'too_large' };
      if (!isPdf(bytes)) return { ok: false, kind: 'invalid' };
      return { ok: true, bytes };
    },
  };
}

/** A PDF starts with "%PDF-". Anything else is not stored as a signed copy. */
export function isPdf(bytes: Uint8Array): boolean {
  return (
    bytes.length > 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  );
}
