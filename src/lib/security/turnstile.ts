import 'server-only';

import { z } from 'zod';
import { turnstileEnforced } from '@/lib/config/controls';
import type { ServerEnv } from '@/lib/config/schema';
import { getServerEnv } from '@/lib/config/server';

/** The form field Cloudflare's widget writes its token into, and the header JSON callers use. */
export const TURNSTILE_FIELD = 'cf-turnstile-response';
export const TURNSTILE_HEADER = 'cf-turnstile-response';

export type TurnstileAction = 'sign_up' | 'sign_in' | 'contact' | 'tool_document';

export type ChallengeResult =
  | { ok: true; verified: boolean }
  | {
      ok: false;
      reason: 'missing_token' | 'invalid_token' | 'unavailable' | 'misconfigured';
    };

const siteverifySchema = z.object({
  success: z.boolean(),
  action: z.string().optional(),
  'error-codes': z.array(z.string()).optional(),
});

/** The public site key, for rendering the widget. Null when the challenge is not active. */
export function turnstileSiteKey(env: ServerEnv): string | null {
  return turnstileEnforced(env) ? (env.TURNSTILE_SITE_KEY ?? null) : null;
}

/** The site key for this deployment's pages; null when off or on a configuration fault. */
export function publicSiteKey(): string | null {
  try {
    return turnstileSiteKey(getServerEnv());
  } catch {
    return null;
  }
}

/**
 * Verifies a Turnstile token with Cloudflare's siteverify endpoint.
 *
 * Runs whenever any Turnstile key is configured (turnstileEnforced, D-017); it is skipped
 * only when the owner waived the control and no key exists. Once active it fails closed:
 * a missing secret, a missing or forged token, a token minted for another action, or an
 * unreachable Cloudflare all refuse the request. A token is single-use, so a replay fails
 * at Cloudflare. The remote address is sent only when the platform attested it.
 */
export async function verifyChallenge(
  env: ServerEnv,
  token: string | null | undefined,
  action: TurnstileAction,
  remoteIp: string | null,
  fetcher: typeof fetch = fetch,
): Promise<ChallengeResult> {
  if (!turnstileEnforced(env)) return { ok: true, verified: false };
  if (!env.TURNSTILE_SECRET_KEY || !env.TURNSTILE_SITE_KEY) {
    return { ok: false, reason: 'misconfigured' };
  }
  if (!token || token.length > 2048) return { ok: false, reason: 'missing_token' };

  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  let payload: unknown;
  try {
    const response = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(3_000),
    });
    if (!response.ok) {
      void response.body?.cancel().catch(() => undefined);
      return { ok: false, reason: 'unavailable' };
    }
    payload = await response.json();
  } catch {
    return { ok: false, reason: 'unavailable' };
  }

  const parsed = siteverifySchema.safeParse(payload);
  if (!parsed.success) return { ok: false, reason: 'unavailable' };
  if (!parsed.data.success) {
    const codes = parsed.data['error-codes'] ?? [];
    // A secret Cloudflare does not recognise is our fault, not the visitor's.
    if (codes.some((code) => code.includes('secret'))) {
      return { ok: false, reason: 'misconfigured' };
    }
    return { ok: false, reason: 'invalid_token' };
  }
  // Cloudflare's dummy test keys return no action; a real widget always echoes it.
  if (parsed.data.action && parsed.data.action !== action) {
    return { ok: false, reason: 'invalid_token' };
  }
  return { ok: true, verified: true };
}

/** What a person reads when the check refused them. Never the reason code itself. */
export function challengeMessage(result: Extract<ChallengeResult, { ok: false }>): string {
  switch (result.reason) {
    case 'missing_token':
      return 'Complete the security check, then try again.';
    case 'invalid_token':
      return 'The security check did not pass. Try it again.';
    case 'unavailable':
      return 'The security check could not be reached. Try again in a minute.';
    case 'misconfigured':
      return 'The security check is not working on our side. Try again later or contact us.';
  }
}
