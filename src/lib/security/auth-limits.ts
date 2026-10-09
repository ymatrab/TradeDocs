import 'server-only';

import { headers } from 'next/headers';
import type { ServerEnv } from '@/lib/config/schema';
import { getServerEnv } from '@/lib/config/server';
import { HttpError } from '@/lib/http/request';
import {
  addressSubject,
  attestedClientAddress,
  limitSubject,
  peekRateLimit,
  type RateLimitPolicy,
} from '@/lib/security/rate-limit';

/**
 * Quotas for every account action. Each sensitive action is counted twice where it can be:
 * per attested client address (one machine trying many accounts) and per account or
 * address being acted on (many machines trying one account). Subjects are HMAC-hashed
 * before they reach the store, so no email address or IP is kept there.
 *
 * A deployment without the rate-limit store runs degraded and reports it on /api/ready; one
 * with the store fails closed when it cannot be reached.
 */
export const AUTH_LIMITS = {
  signInAddress: { namespace: 'auth:signin-ip', limit: 30, windowSeconds: 900 },
  signInAccount: { namespace: 'auth:signin-email', limit: 10, windowSeconds: 900 },
  /** Failed sign-ins only. Reaching the limit asks for a bot challenge rather than refusing. */
  signInFailAccount: { namespace: 'auth:signin-fail-email', limit: 3, windowSeconds: 900 },
  signInFailAddress: { namespace: 'auth:signin-fail-ip', limit: 10, windowSeconds: 900 },
  signUpAddress: { namespace: 'auth:signup-ip', limit: 10, windowSeconds: 3600 },
  /** Magic links, reset links and confirmation resends: each one sends an email. */
  emailLinkAddress: { namespace: 'auth:email-link-ip', limit: 10, windowSeconds: 900 },
  emailLinkAccount: { namespace: 'auth:email-link-email', limit: 3, windowSeconds: 900 },
  /** The "resend" cooldown the confirmation screen shows, enforced here as well. */
  resendCooldown: { namespace: 'auth:resend-cooldown', limit: 1, windowSeconds: 60 },
  /** Password, email and name changes, and deletion confirmations, per account. */
  accountChange: { namespace: 'auth:account-change', limit: 10, windowSeconds: 3600 },
  invitationSend: { namespace: 'org:invite-send', limit: 30, windowSeconds: 3600 },
  /** Logo and signature uploads, per account: each one decodes an image in full. */
  brandingUpload: { namespace: 'org:branding-upload', limit: 30, windowSeconds: 3600 },
  /** QuickBooks/Xero: starting a connection, and each check or import (each reads the provider). */
  integrationConnect: { namespace: 'org:integration-connect', limit: 20, windowSeconds: 3600 },
  integrationImport: { namespace: 'org:integration-import', limit: 60, windowSeconds: 3600 },
} as const satisfies Record<string, RateLimitPolicy>;

export type Quota = readonly [RateLimitPolicy, string];

export type QuotaOutcome = { ok: true } | { ok: false; message: string };

export type ActionContext = {
  env: ServerEnv;
  /** The subject the caller's attested address is counted under. */
  address: string;
  /** The attested address itself, for Turnstile's optional remoteip. Null when unattested. */
  remoteIp: string | null;
};

/** Resolves the configuration and caller identity a server action counts quotas against. */
export async function actionContext(): Promise<ActionContext> {
  const env = getServerEnv();
  const request = { headers: new Headers(await headers()) };
  return {
    env,
    address: addressSubject(request, env),
    remoteIp: attestedClientAddress(request, env),
  };
}

export const emailSubject = (email: string) => `email:${email.trim().toLowerCase()}`;
export const userSubject = (id: string) => `user:${id}`;

function waitPhrase(seconds: number): string {
  if (seconds <= 90) return 'in a minute';
  const minutes = Math.ceil(seconds / 60);
  return minutes >= 90 ? `in about ${Math.ceil(minutes / 60)} hours` : `in ${minutes} minutes`;
}

/**
 * Consumes each quota in order and stops at the first refusal. The message is the same
 * whichever quota refused, and whether or not the account exists.
 */
export async function consumeQuotas(
  env: ServerEnv,
  quotas: readonly Quota[],
): Promise<QuotaOutcome> {
  for (const [policy, subject] of quotas) {
    try {
      await limitSubject(subject, policy, env);
    } catch (error) {
      if (error instanceof HttpError && error.status === 429) {
        const retry = Number(new Headers(error.headers).get('Retry-After') ?? '60');
        return { ok: false, message: `Too many attempts. Try again ${waitPhrase(retry)}.` };
      }
      console.error('auth: quota store unavailable', { namespace: policy.namespace });
      return { ok: false, message: 'This is temporarily unavailable. Try again in a minute.' };
    }
  }
  return { ok: true };
}

/**
 * Whether the counted failures have reached a quota's limit. Null when the deployment has no
 * store to count in; throws when the store is configured but unreachable.
 */
export async function reachedLimit(
  env: ServerEnv,
  policy: RateLimitPolicy,
  subject: string,
): Promise<boolean | null> {
  const used = await peekRateLimit(subject, policy, env);
  return used === null ? null : used >= policy.limit;
}

/** Records a failure without refusing anything; the count only gates a challenge. */
export async function recordFailure(
  env: ServerEnv,
  policy: RateLimitPolicy,
  subject: string,
): Promise<boolean> {
  try {
    const result = await limitSubject(subject, policy, env);
    return result !== null && result.remaining === 0;
  } catch (error) {
    // Over the limit is the expected state after repeated failures, not an error.
    if (error instanceof HttpError && error.status === 429) return true;
    console.error('auth: failure counter unavailable', { namespace: policy.namespace });
    return false;
  }
}
