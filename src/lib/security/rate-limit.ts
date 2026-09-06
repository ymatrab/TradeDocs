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
  if (!/^[a-z][a-z0-9:_-]{0,63}$/.test(policy.namespace) || !Number.isInteger(policy.limit) || policy.limit < 1 || policy.limit > 10_000 || !Number.isInteger(policy.windowSeconds) || policy.windowSeconds < 1 || policy.windowSeconds > 86_400) {
    throw new Error('Invalid rate limit policy.');
  }
}

/** Use a verified user ID or hosting-provider-attested IP; never arbitrary forwarded headers. */
export function rateLimitKey(subject: string, policy: RateLimitPolicy, secret: string): string {
  validatePolicy(policy);
  if (!subject || subject.length > 512 || secret.length < 32) throw new Error('Invalid rate limit identity configuration.');
  return createHmac('sha256', secret).update(`${policy.namespace}\u0000${policy.limit}\u0000${policy.windowSeconds}\u0000${subject}`).digest('hex');
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
        throw new HttpError(503, 'RATE_LIMIT_UNAVAILABLE', 'This service is temporarily unavailable.', { 'Retry-After': '30' });
      }
      const response = await fetcher(new URL('/rest/v1/rpc/consume_rate_limit', env.SUPABASE_URL), {
        method: 'POST',
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_key_hash: keyHash, p_limit: policy.limit, p_window_seconds: policy.windowSeconds }),
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(2_000),
      });
      if (!response.ok) throw new Error('Rate limit provider unavailable.');
      const data: unknown = await response.json();
      const parsed = z.array(resultSchema).length(1).safeParse(data);
      if (!parsed.success || !parsed.data[0]) throw new Error('Invalid rate limit provider response.');
      const result = parsed.data[0];
      if (result.remaining > policy.limit || (result.allowed && result.retry_after_seconds > 0) || (!result.allowed && result.retry_after_seconds === 0)) {
        throw new Error('Inconsistent rate limit provider response.');
      }
      return { allowed: result.allowed, remaining: result.remaining, retryAfterSeconds: result.retry_after_seconds };
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
    throw new HttpError(503, 'RATE_LIMIT_UNAVAILABLE', 'This service is temporarily unavailable.', { 'Retry-After': '30' });
  }
  if (!result.allowed) {
    throw new HttpError(429, 'RATE_LIMITED', 'Too many requests. Please wait and try again.', { 'Retry-After': String(Math.max(1, result.retryAfterSeconds)) });
  }
  return result;
}
