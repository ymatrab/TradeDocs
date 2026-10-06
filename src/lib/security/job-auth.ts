import 'server-only';

import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * The shared secret a scheduler presents to an internal job endpoint. Vercel Cron sends
 * `Authorization: Bearer $CRON_SECRET` on its own, so the same variable serves a Vercel
 * schedule, a Supabase pg_net call or a manual curl.
 *
 * Read per feature, outside the strict schema: a missing or short secret disables the job
 * endpoint (503) and never the deployment.
 */
export function cronSecret(raw: string | undefined = process.env.CRON_SECRET): string | null {
  const value = raw?.trim();
  return value && value.length >= 32 ? value : null;
}

/** Constant-time comparison of the presented bearer token with the configured secret. */
export function bearerMatches(header: string | null, secret: string): boolean {
  if (!header?.startsWith('Bearer ')) return false;
  const presented = createHash('sha256').update(header.slice('Bearer '.length)).digest();
  const expected = createHash('sha256').update(secret).digest();
  return timingSafeEqual(presented, expected);
}
