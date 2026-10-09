import { createHash } from 'node:crypto';
import { z } from 'zod';
import { MAX_SIGNED_PDF_BYTES } from '@/lib/limits';
import {
  mapRequestStatus,
  metadataRequestId,
  signerStates,
  type CallbackEvent,
  type DropboxSignClient,
  type RequestStatus,
  type SignerState,
} from './dropbox-sign';

/**
 * What a verified Dropbox Sign callback does, independent of HTTP and of the database client
 * so each branch can be tested with fakes. The route verifies the event hash first; this
 * never sees an unverified event.
 *
 * 1. Events without a signature request (callback_test, account events) are acknowledged.
 * 2. The event key (hash of event hash, type and request id) is checked against the ledger;
 *    a duplicate is acknowledged unless the request is signed and its copy still missing.
 * 3. The request is matched to a TradeDocs row by provider id, or by TradeDocs' own id from
 *    the metadata when the send was never confirmed. Unknown requests are acknowledged and
 *    left alone (another integration on the same account).
 * 4. The live request is read from the API with this deployment's key: the event payload is
 *    not covered by the hash, so its state is never trusted. The live metadata must name the
 *    same row and the live mode must equal the row's.
 * 5. Status and signers are applied with the ledger entry in one transaction.
 * 6. A completed request's signed PDF is fetched, stored as a new object and recorded
 *    (write once). 409 from the provider means not ready; the downloadable event retries.
 *
 * Outcomes that Dropbox Sign should retry throw; everything else returns.
 */

export type StoredRequest = {
  id: string;
  org_id: string;
  status: string;
  provider_request_id: string | null;
  test_mode: boolean;
  signers: SignerState[];
  signed_object_path: string | null;
};

export type CallbackDeps = {
  provider: DropboxSignClient;
  recorded(eventKey: string): Promise<boolean>;
  findByProviderId(providerId: string): Promise<StoredRequest | null>;
  findUnconfirmed(requestId: string): Promise<StoredRequest | null>;
  apply(input: {
    eventKey: string;
    eventType: string;
    requestId: string;
    providerRequestId: string;
    status: RequestStatus;
    signers: SignerState[];
  }): Promise<'applied' | 'duplicate' | 'ignored' | 'unmatched'>;
  storeSigned(input: {
    request: StoredRequest;
    bytes: Uint8Array;
  }): Promise<'stored' | 'already'>;
  nowSeconds(): number;
};

export type CallbackOutcome =
  | 'acknowledged'
  | 'duplicate'
  | 'unmatched'
  | 'mode_mismatch'
  | 'applied'
  | 'ignored'
  | 'stored'
  | 'file_pending'
  | 'copy_refused';

export class RetryableCallbackError extends Error {
  constructor(readonly reason: string) {
    super(`Retry: ${reason}`);
  }
}

const storedSignerSchema = z.array(
  z.object({
    email: z.string(),
    name: z.string(),
    status: z.enum(['awaiting_signature', 'signed', 'declined', 'error', 'unknown']),
    signed_at: z.string().nullable(),
  }),
);

/** The signers column as stored, or an empty list when it is not in the expected shape. */
export function parseStoredSigners(value: unknown): SignerState[] {
  const parsed = storedSignerSchema.safeParse(value);
  return parsed.success ? parsed.data : [];
}

export function eventKey(event: CallbackEvent): string {
  return createHash('sha256')
    .update(
      `${event.event.event_hash.toLowerCase()}\u0000${event.event.event_type}\u0000${event.signature_request?.signature_request_id ?? ''}`,
      'utf8',
    )
    .digest('hex');
}

const END_STATES = new Set(['signed', 'declined', 'cancelled', 'expired']);

export async function handleVerifiedEvent(
  event: CallbackEvent,
  deps: CallbackDeps,
): Promise<CallbackOutcome> {
  const providerId = event.signature_request?.signature_request_id;
  if (!providerId) return 'acknowledged';

  const key = eventKey(event);
  let request = await deps.findByProviderId(providerId);
  if (!request) {
    const ours = event.signature_request?.metadata
      ? metadataRequestId({ metadata: event.signature_request.metadata })
      : null;
    if (ours) request = await deps.findUnconfirmed(ours);
  }
  if (!request) return 'unmatched';

  const copyMissing = request.status === 'signed' && !request.signed_object_path;
  if (!copyMissing && (await deps.recorded(key))) return 'duplicate';

  const live = await deps.provider.get(providerId);
  let status: RequestStatus;
  let signers = request.signers;
  if (!live.ok) {
    if (live.kind === 'gone' && event.event.event_type === 'signature_request_canceled') {
      status = 'cancelled';
    } else if (live.kind === 'gone' || live.kind === 'rejected') {
      // Deleted, or not readable with this key: nothing to apply, and retrying cannot help.
      return 'unmatched';
    } else {
      throw new RetryableCallbackError('provider_unavailable');
    }
  } else {
    const named = metadataRequestId(live.request);
    if (named && named !== request.id) return 'unmatched';
    if (!named && request.provider_request_id !== providerId) return 'unmatched';
    if (Boolean(live.request.test_mode) !== request.test_mode) return 'mode_mismatch';
    status =
      event.event.event_type === 'signature_request_canceled'
        ? 'cancelled'
        : mapRequestStatus(live.request, deps.nowSeconds());
    signers = signerStates(request.signers, live.request);
  }

  // An end state never moves (the routine refuses it); a duplicate changes nothing.
  const outcome = await deps.apply({
    eventKey: key,
    eventType: event.event.event_type,
    requestId: request.id,
    providerRequestId: providerId,
    status,
    signers,
  });
  if (outcome === 'unmatched') return 'unmatched';

  const signed =
    request.status === 'signed' || (!END_STATES.has(request.status) && status === 'signed');
  if (!signed || request.signed_object_path) return outcome;

  const file = await deps.provider.signedPdf(providerId, MAX_SIGNED_PDF_BYTES);
  if (!file.ok) {
    if (file.kind === 'not_ready') return 'file_pending';
    if (file.kind === 'unavailable') throw new RetryableCallbackError('provider_unavailable');
    // Too large, not a PDF, or refused: retrying will not change it, and repeated failures
    // would make Dropbox Sign clear the callback URL. Acknowledged; the route logs it.
    return 'copy_refused';
  }
  await deps.storeSigned({ request: { ...request, status: 'signed' }, bytes: file.bytes });
  return 'stored';
}
