import 'server-only';

import { createHmac } from 'node:crypto';
import { z } from 'zod';
import { getServerEnv } from '@/lib/config/server';
import type { ServerEnv } from '@/lib/config/schema';
import { HttpError } from '@/lib/http/request';

export type RateLimitPolicy = { namespace: string; limit: number; windowSeconds: number };
export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds: number };
export interface RateLimitProvider {
  consume(keyHash: string, policy: RateLimitPolicy): Promise<RateLimitResult>;
}

const resultSchema = z.object({
  allowed: z.boolean(),
  remaining: z.number().int().min(0),
  retry_after_seconds: z.number().int().min(0).max(86_400),
});

function validatePolicy(policy: RateLimitPolicy): void {
  if (
    !/^[a-z][a-z0-9:_-]{0,63}$/.test(policy.namespace) ||
    !Number.isInteger(policy.limit) ||
    policy.limit < 1 ||
    policy.limit > 10_000 ||
    !Number.isInteger(policy.windowSeconds) ||
    policy.windowSeconds < 1 ||
    policy.windowSeconds > 86_400
  ) {
    throw new Error('Invalid rate limit policy.');
  }
}

/** Use a verified user ID or hosting-provider-attested IP; never arbitrary forwarded headers. */
export function rateLimitKey(subject: string, policy: RateLimitPolicy, secret: string): string {
  validatePolicy(policy);
  if (!subject || subject.length > 512 || secret.length < 32)
    throw new Error('Invalid rate limit identity configuration.');
  return createHmac('sha256', secret)
    .update(`${policy.namespace}\u0000${policy.limit}\u0000${policy.windowSeconds}\u0000${subject}`)
    .digest('hex');
}

/** The database function performs one atomic increment and is executable only by service_role. */
export function createSupabaseRateLimitProvider(
  env: ServerEnv = getServerEnv(),
  fetcher: typeof fetch = fetch,
): RateLimitProvider {
  return {
    async consume(keyHash, policy) {
      validatePolicy(policy);
      if (!/^[a-f0-9]{64}$/.test(keyHash)) throw new Error('Invalid rate limit key.');
      if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new HttpError(
          503,
          'RATE_LIMIT_UNAVAILABLE',
          'This service is temporarily unavailable.',
          { 'Retry-After': '30' },
        );
      }
      const response = await fetcher(new URL('/rest/v1/rpc/consume_rate_limit', env.SUPABASE_URL), {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_key_hash: keyHash,
          p_limit: policy.limit,
          p_window_seconds: policy.windowSeconds,
        }),
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(2_000),
      });
      if (!response.ok) throw new Error('Rate limit provider unavailable.');
      const data: unknown = await response.json();
      const parsed = z.array(resultSchema).length(1).safeParse(data);
      if (!parsed.success || !parsed.data[0])
        throw new Error('Invalid rate limit provider response.');
      const result = parsed.data[0];
      if (
        result.remaining > policy.limit ||
        (result.allowed && result.retry_after_seconds > 0) ||
        (!result.allowed && result.retry_after_seconds === 0)
      ) {
        throw new Error('Inconsistent rate limit provider response.');
      }
      return {
        allowed: result.allowed,
        remaining: result.remaining,
        retryAfterSeconds: result.retry_after_seconds,
      };
    },
  };
}

/** No process-local fallback: provider failure denies the operation with a retryable 503. */
export async function enforceRateLimit(
  provider: RateLimitProvider,
  keyHash: string,
  policy: RateLimitPolicy,
): Promise<RateLimitResult> {
  let result: RateLimitResult;
  try {
    result = await provider.consume(keyHash, policy);
  } catch {
    throw new HttpError(503, 'RATE_LIMIT_UNAVAILABLE', 'This service is temporarily unavailable.', {
      'Retry-After': '30',
    });
  }
  if (!result.allowed) {
    throw new HttpError(429, 'RATE_LIMITED', 'Too many requests. Please wait and try again.', {
      'Retry-After': String(Math.max(1, result.retryAfterSeconds)),
    });
  }
  return result;
}

export type RateLimitMode = { mode: 'enforced' } | { mode: 'degraded'; reason: string };

/**
 * Why quotas are not enforced. Reported by /api/ready so the degraded state is visible to
 * whoever operates the deployment, rather than discovered during an incident.
 */
export const DEGRADED_RATE_LIMIT_REASON =
  'No database is configured, so request quotas are not enforced. Public endpoints rely on ' +
  'their per-request bounds until the service-role connection and RATE_LIMIT_KEY_SECRET are set.';

/**
 * Quotas need the distributed store. A deployment without a database (the foundation
 * deployment today) has none, and the only alternative, a per-instance counter, would be a
 * guarantee in name only. Such a deployment runs degraded, openly; one that has a database
 * fails closed when the store is unreachable.
 */
export function rateLimitMode(env: ServerEnv): RateLimitMode {
  return env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && env.RATE_LIMIT_KEY_SECRET
    ? { mode: 'enforced' }
    : { mode: 'degraded', reason: DEGRADED_RATE_LIMIT_REASON };
}

/**
 * The caller's address as the hosting platform attests it. Vercel's edge overwrites
 * x-real-ip, so it is trusted there; anywhere else a client can set any header, so no
 * address is trusted and callers share one quota.
 */
export function attestedClientAddress(
  request: Pick<Request, 'headers'>,
  env: ServerEnv,
): string | null {
  if (!env.VERCEL_ENV) return null;
  const value = request.headers.get('x-real-ip')?.trim();
  return value && /^[0-9A-Fa-f:.]{2,45}$/.test(value) ? value : null;
}

/**
 * Applies a quota to an unauthenticated request. Returns null when the deployment runs
 * degraded (see rateLimitMode); otherwise allows, or throws a 429 or a retryable 503.
 */
export async function limitPublicRequest(
  /** A route's Request, or a server action's `{ headers: await headers() }`. */
  request: Pick<Request, 'headers'>,
  policy: RateLimitPolicy,
  env: ServerEnv = getServerEnv(),
  provider?: RateLimitProvider,
): Promise<RateLimitResult | null> {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.RATE_LIMIT_KEY_SECRET) {
    return null;
  }
  const key = rateLimitKey(addressSubject(request, env), policy, env.RATE_LIMIT_KEY_SECRET);
  return enforceRateLimit(provider ?? createSupabaseRateLimitProvider(env), key, policy);
}

/** The subject a public request is counted under. Shared by consume and peek. */
export function addressSubject(request: Pick<Request, 'headers'>, env: ServerEnv): string {
  return `ip:${attestedClientAddress(request, env) ?? 'unattested'}`;
}

/**
 * Applies a quota to an arbitrary subject (an account id, a normalised email address). The
 * subject is HMAC-hashed before it leaves the process, so no address reaches the store.
 * Returns null when degraded; otherwise allows, or throws a 429 or a retryable 503.
 */
export async function limitSubject(
  subject: string,
  policy: RateLimitPolicy,
  env: ServerEnv = getServerEnv(),
  provider?: RateLimitProvider,
): Promise<RateLimitResult | null> {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.RATE_LIMIT_KEY_SECRET) {
    return null;
  }
  const key = rateLimitKey(subject, policy, env.RATE_LIMIT_KEY_SECRET);
  return enforceRateLimit(provider ?? createSupabaseRateLimitProvider(env), key, policy);
}

/**
 * How many times a quota has been consumed in its current window, without consuming it.
 * Used where a count gates something softer than a refusal, such as asking for a bot
 * challenge after repeated failed sign-ins. Returns null when the deployment runs degraded;
 * throws when the store is configured but unreachable, so the caller can fail closed.
 */
export async function peekRateLimit(
  subject: string,
  policy: RateLimitPolicy,
  env: ServerEnv = getServerEnv(),
  fetcher: typeof fetch = fetch,
): Promise<number | null> {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.RATE_LIMIT_KEY_SECRET) {
    return null;
  }
  const keyHash = rateLimitKey(subject, policy, env.RATE_LIMIT_KEY_SECRET);
  const response = await fetcher(new URL('/rest/v1/rpc/peek_rate_limit', env.SUPABASE_URL), {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_key_hash: keyHash, p_window_seconds: policy.windowSeconds }),
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(2_000),
  });
  if (!response.ok) throw new Error('Rate limit provider unavailable.');
  const parsed = z.number().int().min(0).safeParse(await response.json());
  if (!parsed.success) throw new Error('Invalid rate limit provider response.');
  return parsed.data;
}
