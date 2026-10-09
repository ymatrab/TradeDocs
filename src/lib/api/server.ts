import 'server-only';

import { z } from 'zod';
import { ENTITLEMENT_COLUMNS, type EntitlementRow } from '@/lib/billing/entitlements';
import { hasEntitlement, type EntitlementRead } from '@/lib/billing/server';
import { getServerEnv } from '@/lib/config/server';
import type { ServerEnv } from '@/lib/config/schema';
import { HttpError, readJsonBody } from '@/lib/http/request';
import { API_REQUEST_QUOTA, API_WRITE_QUOTA } from '@/lib/limits';
import { limitPublicRequest, limitSubject } from '@/lib/security/rate-limit';
import { apiKeyPepper, hashApiKey, readBearer } from './keys';
import { idempotencyKeySchema, type FieldIssue } from './schemas';

/**
 * The server side of the public REST API v1: configuration, authentication, quotas, calls
 * into the service_role routines of supabase/migrations/20261009000400_public_api.sql, and
 * the one JSON error shape every endpoint answers with:
 *
 *   { "error": { "code": "NOT_FOUND", "message": "…", "details"?: [{ field, message }] } }
 *
 * Authorization lives in the database: every routine resolves the key from its hash and
 * scopes every row to that key's organization. Nothing here passes an organization id in.
 *
 * Nothing private is logged: no key, no hash, no request body, no shipment content. Logs
 * carry the routine name and the database error code only.
 */

export const API_POLICIES = {
  perKey: { namespace: 'api:key', ...API_REQUEST_QUOTA },
  writesPerKey: { namespace: 'api:key-write', ...API_WRITE_QUOTA },
  /** Failed authentications per attested client address. */
  failuresPerAddress: { namespace: 'api:auth-fail-ip', limit: 30, windowSeconds: 900 },
} as const;

const WWW_AUTHENTICATE = 'Bearer realm="TradeDocs API"';

export class ApiError extends HttpError {
  constructor(
    status: number,
    code: string,
    message: string,
    readonly details?: FieldIssue[],
    headers?: HeadersInit,
  ) {
    super(status, code, message, headers);
    this.name = 'ApiError';
  }
}

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

export function apiJson(body: unknown, status = 200, headers?: HeadersInit): Response {
  return Response.json(body, {
    status,
    headers: { ...NO_STORE, ...Object.fromEntries(new Headers(headers)) },
  });
}

/** Any thrown value as the API's error shape. Unknown errors are a retryable 503. */
export function apiErrorResponse(error: unknown, route: string): Response {
  if (error instanceof HttpError) {
    const details = error instanceof ApiError ? error.details : undefined;
    return apiJson(
      {
        error: {
          code: error.code,
          message: error.publicMessage,
          ...(details && details.length > 0 ? { details } : {}),
        },
      },
      error.status,
      error.headers,
    );
  }
  console.error('api: unexpected failure', {
    route,
    name: error instanceof Error ? error.name : typeof error,
  });
  return apiJson(
    {
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'This service is temporarily unavailable. Try again shortly.',
      },
    },
    503,
    { 'Retry-After': '30' },
  );
}

export type ApiConfig = {
  env: ServerEnv;
  pepper: string;
  supabaseUrl: string;
  serviceRoleKey: string;
};

/**
 * The API runs only with a database, the service-role connection and a pepper. Without any
 * of them it answers 503 and the rest of the deployment is unaffected.
 */
export function apiConfig(): ApiConfig | null {
  try {
    const env = getServerEnv();
    const pepper = apiKeyPepper();
    if (env.APPLICATION_MODE !== 'service' || !pepper) return null;
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;
    return {
      env,
      pepper,
      supabaseUrl: env.SUPABASE_URL,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    };
  } catch {
    return null;
  }
}

/** Why the API is off, for /api/ready, or null when it is on. Names only, never values. */
export function apiUnavailableReason(): string | null {
  try {
    const env = getServerEnv();
    if (env.APPLICATION_MODE !== 'service') return null;
    if (!apiKeyPepper()) return 'api_key_pepper_missing';
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return 'service_role_missing';
    return null;
  } catch {
    return 'invalid_configuration';
  }
}

export type RpcError = { status: number; code: string | null; message: string };

export class RpcFailure extends Error {
  constructor(readonly failure: RpcError) {
    super(`rpc failed: ${failure.code ?? failure.status}`);
    this.name = 'RpcFailure';
  }
}

const postgrestError = z.object({ code: z.string().nullish(), message: z.string().nullish() });

/** Calls a service_role routine through PostgREST. Throws RpcFailure with the error code. */
export async function callRpc(
  config: ApiConfig,
  name: string,
  args: Record<string, unknown>,
  fetcher: typeof fetch = fetch,
): Promise<unknown> {
  const response = await fetcher(new URL(`/rest/v1/rpc/${name}`, config.supabaseUrl), {
    method: 'POST',
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(10_000),
  });
  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  if (!response.ok) {
    const parsed = postgrestError.safeParse(body);
    const failure: RpcError = {
      status: response.status,
      code: parsed.success ? (parsed.data.code ?? null) : null,
      message: parsed.success ? (parsed.data.message ?? '') : '',
    };
    console.error('api: routine failed', { routine: name, code: failure.code, status: failure.status });
    throw new RpcFailure(failure);
  }
  return body;
}

/** The entitlement row read with the service role; the organization comes from the key. */
export function serviceEntitlementReader(
  config: ApiConfig,
  fetcher: typeof fetch = fetch,
): EntitlementRead {
  return async (orgId) => {
    try {
      const url = new URL('/rest/v1/entitlements', config.supabaseUrl);
      url.searchParams.set('select', ENTITLEMENT_COLUMNS.replace(/\s+/g, ''));
      url.searchParams.set('org_id', `eq.${orgId}`);
      const response = await fetcher(url, {
        headers: {
          apikey: config.serviceRoleKey,
          Authorization: `Bearer ${config.serviceRoleKey}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(5_000),
      });
      if (!response.ok) return { row: null, failed: true };
      const rows = (await response.json()) as EntitlementRow[];
      if (!Array.isArray(rows) || rows.length > 1) return { row: null, failed: true };
      return { row: rows[0] ?? null, failed: false };
    } catch {
      return { row: null, failed: true };
    }
  };
}

export type ApiPrincipal = {
  config: ApiConfig;
  /** HMAC of the presented key; what every routine is called with. */
  keyHash: string;
  keyId: string;
  orgId: string;
  remaining: number | null;
};

const authenticated = z.discriminatedUnion('status', [
  z.object({ status: z.literal('ok'), key_id: z.uuid(), org_id: z.uuid() }),
  z.object({ status: z.literal('invalid') }),
  z.object({ status: z.literal('not_entitled') }),
]);

async function countFailure(request: Request, config: ApiConfig): Promise<void> {
  // Counted per attested address; when the address is over its quota the 429 replaces the 401.
  await limitPublicRequest(request, API_POLICIES.failuresPerAddress, config.env);
}

const PLAN_REQUIRED = new ApiError(
  403,
  'PLAN_REQUIRED',
  'API access is part of the Team plan. An owner can upgrade the organization from Billing.',
);

/**
 * Authenticates a request by its bearer key, applies the per-key quotas and the Team plan
 * gate (in the database, then again here with hasEntitlement), and returns the principal.
 */
export async function authenticateApiRequest(
  request: Request,
  options: { write?: boolean; fetcher?: typeof fetch } = {},
): Promise<ApiPrincipal> {
  const config = apiConfig();
  if (!config) {
    throw new ApiError(503, 'API_UNAVAILABLE', 'The API is not available on this deployment.', undefined, {
      'Retry-After': '3600',
    });
  }
  const bearer = readBearer(request.headers.get('authorization'));
  if (bearer.kind === 'missing') {
    throw new ApiError(
      401,
      'MISSING_API_KEY',
      'Send your API key as "Authorization: Bearer <key>".',
      undefined,
      { 'WWW-Authenticate': WWW_AUTHENTICATE },
    );
  }
  if (bearer.kind === 'malformed') {
    await countFailure(request, config);
    throw new ApiError(401, 'INVALID_API_KEY', 'That API key is not valid.', undefined, {
      'WWW-Authenticate': `${WWW_AUTHENTICATE}, error="invalid_token"`,
    });
  }

  const keyHash = hashApiKey(bearer.key, config.pepper);
  const quota = await limitSubject(`api-key:${keyHash}`, API_POLICIES.perKey, config.env);
  if (options.write) {
    await limitSubject(`api-key:${keyHash}`, API_POLICIES.writesPerKey, config.env);
  }

  const result = authenticated.safeParse(
    await callRpc(config, 'api_authenticate', { p_key_hash: keyHash }, options.fetcher),
  );
  if (!result.success) throw new Error('Unexpected authentication response.');
  if (result.data.status === 'invalid') {
    await countFailure(request, config);
    throw new ApiError(
      401,
      'INVALID_API_KEY',
      'That API key is not valid. It may have been revoked.',
      undefined,
      { 'WWW-Authenticate': `${WWW_AUTHENTICATE}, error="invalid_token"` },
    );
  }
  if (result.data.status === 'not_entitled') throw PLAN_REQUIRED;

  // Defense in depth: the same rule as the database's, from plans.ts, fail closed.
  const entitled = await hasEntitlement(
    result.data.org_id,
    'api',
    serviceEntitlementReader(config, options.fetcher),
  );
  if (!entitled) throw PLAN_REQUIRED;

  return {
    config,
    keyHash,
    keyId: result.data.key_id,
    orgId: result.data.org_id,
    remaining: quota?.remaining ?? null,
  };
}

/** Headers every authenticated response carries. */
export function principalHeaders(principal: ApiPrincipal): Record<string, string> {
  return principal.remaining === null
    ? {}
    : {
        'RateLimit-Limit': String(API_POLICIES.perKey.limit),
        'RateLimit-Remaining': String(principal.remaining),
      };
}

/** A routine error as the API's answer. Codes are Postgres SQLSTATEs. */
export function rpcErrorToApi(failure: RpcError): ApiError {
  switch (failure.code) {
    case '28000':
      return new ApiError(401, 'INVALID_API_KEY', 'That API key is not valid. It may have been revoked.');
    case '23505':
      return new ApiError(409, 'CONFLICT', 'A shipment with that reference already exists.');
    case '23503':
      return new ApiError(
        422,
        'VALIDATION_FAILED',
        'A party id does not name a company in this organization’s directory.',
      );
    case '23514':
    case '22P02':
    case '22023':
    case '22007':
    case '22008':
      return new ApiError(422, 'VALIDATION_FAILED', 'Check the submitted fields and try again.');
    case '42501':
      return new ApiError(404, 'NOT_FOUND', 'That shipment was not found.');
    default:
      throw new RpcFailure(failure);
  }
}

/** Reads and validates the Idempotency-Key header; null when absent. */
export function readIdempotencyKey(request: Request): string | null {
  const value = request.headers.get('idempotency-key');
  if (value === null) return null;
  if (!idempotencyKeySchema.safeParse(value).success) {
    throw new ApiError(
      400,
      'INVALID_IDEMPOTENCY_KEY',
      'An Idempotency-Key is 1 to 255 letters, digits, dots, underscores, colons or hyphens.',
    );
  }
  return value;
}

export const IDEMPOTENCY_CONFLICT = new ApiError(
  409,
  'IDEMPOTENCY_CONFLICT',
  'That Idempotency-Key was already used with a different request.',
);

export const NOT_FOUND_SHIPMENT = new ApiError(404, 'NOT_FOUND', 'That shipment was not found.');
export const NOT_FOUND_DOCUMENT = new ApiError(404, 'NOT_FOUND', 'That document was not found.');

/** Reads a JSON body of at most maxBytes as unknown; validation is the caller's. */
export async function readApiBody(request: Request, maxBytes: number): Promise<unknown> {
  return readJsonBody(request, z.unknown(), maxBytes);
}
