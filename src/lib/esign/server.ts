import 'server-only';

import { createHash } from 'node:crypto';
import { getServerEnv } from '@/lib/config/server';
import type { RateLimitPolicy } from '@/lib/security/rate-limit';
import { esignConfig, type EsignConfig } from './config';
import { createDropboxSignClient, type SignerState } from './dropbox-sign';
import { parseStoredSigners, type CallbackDeps, type StoredRequest } from './callback';

/**
 * E-signature on the server: the configuration, the service-role routines of
 * supabase/migrations/20261009000600_esign_requests.sql, and the private esign-signed bucket.
 * Every write goes through a routine executable by service_role only; members read their own
 * organization's requests through row level security.
 */

export const ESIGN_BUCKET = 'esign-signed';

/** Sends, per account and per organization. Each send emails every signer. */
export const ESIGN_LIMITS = {
  sendAccount: { namespace: 'esign:send-user', limit: 20, windowSeconds: 3600 },
  sendOrganization: { namespace: 'esign:send-org', limit: 100, windowSeconds: 86_400 },
} as const satisfies Record<string, RateLimitPolicy>;

export type ReadyEsignConfig = Extract<EsignConfig, { state: 'ready' }>;

/** Fails closed: a broken environment reports the feature as misconfigured. */
export function currentEsignConfig(): EsignConfig {
  try {
    return esignConfig(getServerEnv(), process.env);
  } catch {
    return { state: 'misconfigured', reason: 'invalid_configuration' };
  }
}

export function sha256Hex(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

export function signedObjectPath(orgId: string, requestId: string, sha256: string): string {
  return `org/${orgId}/esign/${requestId}/${sha256}.pdf`;
}

/** What the service-role calls need: a signed copy stays downloadable without the API key. */
export type ServiceConnection = Pick<ReadyEsignConfig, 'supabaseUrl' | 'serviceRoleKey'>;

/** The service-role connection on its own, or null when this deployment has none. */
export function serviceConnection(): ServiceConnection | null {
  try {
    const env = getServerEnv();
    return env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
      ? { supabaseUrl: env.SUPABASE_URL, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY }
      : null;
  } catch {
    return null;
  }
}

function serviceHeaders(config: ServiceConnection): Record<string, string> {
  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
  };
}

/** Calls a service-role routine. Throws on any failure, with the status only. */
export async function serviceRpc<T>(
  config: ServiceConnection,
  name: string,
  args: Record<string, unknown>,
  fetcher: typeof fetch = fetch,
): Promise<T> {
  const response = await fetcher(new URL(`/rest/v1/rpc/${name}`, config.supabaseUrl), {
    method: 'POST',
    headers: { ...serviceHeaders(config), 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) {
    // The body may quote a database message; keep only its code for the caller.
    const body: unknown = await response.json().catch(() => null);
    const code =
      body && typeof body === 'object' && 'code' in body && typeof body.code === 'string'
        ? body.code
        : null;
    throw new EsignRpcError(name, response.status, code);
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export class EsignRpcError extends Error {
  constructor(
    readonly routine: string,
    readonly status: number,
    readonly code: string | null,
  ) {
    super(`${routine} failed with HTTP ${status}${code ? ` (${code})` : ''}.`);
  }
}

const REQUEST_COLUMNS =
  'id,org_id,status,provider_request_id,test_mode,signers,signed_object_path';

async function selectOne(
  config: ReadyEsignConfig,
  filter: string,
  fetcher: typeof fetch,
): Promise<StoredRequest | null> {
  const url = new URL('/rest/v1/esign_requests', config.supabaseUrl);
  url.search = `select=${REQUEST_COLUMNS}&${filter}&limit=1`;
  const response = await fetcher(url, {
    headers: { ...serviceHeaders(config), Accept: 'application/json' },
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) {
    void response.body?.cancel().catch(() => undefined);
    throw new EsignRpcError('esign_requests', response.status, null);
  }
  const rows: unknown = await response.json();
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const row = rows[0] as Record<string, unknown>;
  return {
    id: String(row.id),
    org_id: String(row.org_id),
    status: String(row.status),
    provider_request_id: typeof row.provider_request_id === 'string' ? row.provider_request_id : null,
    test_mode: row.test_mode === true,
    signers: parseStoredSigners(row.signers),
    signed_object_path: typeof row.signed_object_path === 'string' ? row.signed_object_path : null,
  };
}

/**
 * Stores the signed PDF under its content address. The same bytes stored before (a
 * concurrent delivery) are the same object, so "already exists" counts as stored.
 */
export async function uploadSignedCopy(
  config: ReadyEsignConfig,
  path: string,
  bytes: Uint8Array,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  const url = new URL(`/storage/v1/object/${ESIGN_BUCKET}/${path}`, config.supabaseUrl);
  const response = await fetcher(url, {
    method: 'POST',
    headers: {
      ...serviceHeaders(config),
      'Content-Type': 'application/pdf',
      'Cache-Control': 'private, max-age=0',
      'x-upsert': 'false',
    },
    body: new Uint8Array(bytes) as BodyInit,
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  });
  if (response.ok) return;
  const text = await response.text().catch(() => '');
  if (response.status === 409 || /duplicate|already exists/i.test(text)) return;
  throw new EsignRpcError('storage_upload', response.status, null);
}

/** The callback's dependencies, wired to the provider, the routines and the bucket. */
export function callbackDeps(config: ReadyEsignConfig, fetcher: typeof fetch = fetch): CallbackDeps {
  return {
    provider: createDropboxSignClient(config.apiKey, fetcher),
    recorded: (eventKey) =>
      serviceRpc<boolean>(config, 'esign_event_recorded', { p_event_key: eventKey }, fetcher),
    findByProviderId: (providerId) =>
      /^[A-Za-z0-9]{10,64}$/.test(providerId)
        ? selectOne(config, `provider_request_id=eq.${providerId}`, fetcher)
        : Promise.resolve(null),
    findUnconfirmed: (requestId) =>
      /^[0-9a-f-]{36}$/.test(requestId)
        ? selectOne(config, `id=eq.${requestId}&provider_request_id=is.null`, fetcher)
        : Promise.resolve(null),
    apply: (input) =>
      serviceRpc<'applied' | 'duplicate' | 'ignored' | 'unmatched'>(
        config,
        'esign_apply_event',
        {
          p_event_key: input.eventKey,
          p_event_type: input.eventType,
          p_request: input.requestId,
          p_provider_request_id: input.providerRequestId,
          p_status: input.status,
          p_signers: input.signers satisfies SignerState[],
        },
        fetcher,
      ),
    async storeSigned({ request, bytes }) {
      const sha256 = sha256Hex(bytes);
      const path = signedObjectPath(request.org_id, request.id, sha256);
      await uploadSignedCopy(config, path, bytes, fetcher);
      return serviceRpc<'stored' | 'already'>(
        config,
        'esign_attach_signed',
        { p_request: request.id, p_object_path: path, p_sha256: sha256, p_byte_size: bytes.length },
        fetcher,
      );
    },
    nowSeconds: () => Math.floor(Date.now() / 1000),
  };
}
