import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { bearerMatches, cronSecret } from '@/lib/security/job-auth';
import { createServiceClient, hasServiceRole } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const summary = z.object({ purged: z.number(), blocked: z.number(), ran_at: z.string() });

function json(body: unknown, status = 200, headers?: HeadersInit): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', ...Object.fromEntries(new Headers(headers)) },
  });
}

/**
 * Removes accounts whose 30-day deletion grace has passed (public.purge_due_accounts).
 *
 * NOT scheduled. No cron entry exists in vercel.json or the database: when and how often it
 * runs is an owner decision (RUNBOOK.md, "Account purge"). Until then it runs only when a
 * platform admin presses "Run purge now", or when this endpoint is called by hand.
 *
 * Authenticated by `Authorization: Bearer $CRON_SECRET` (constant-time compare); without a
 * configured secret the endpoint is closed (503) rather than open. Idempotent and bounded:
 * each call removes at most 50 due accounts, a repeat finds nothing left to do, and
 * overlapping calls share the work (SKIP LOCKED). GET is accepted because that is the only
 * method Vercel Cron sends; the bearer secret, not the method, is what makes it safe.
 * The response carries counts only, never an address.
 */
async function purge(request: NextRequest): Promise<Response> {
  const secret = cronSecret();
  if (!secret || !hasServiceRole()) {
    return json({ error: 'not_configured' }, 503, { 'Retry-After': '3600' });
  }
  if (!bearerMatches(request.headers.get('authorization'), secret)) {
    return json({ error: 'unauthorized' }, 401, { 'WWW-Authenticate': 'Bearer' });
  }

  const { data, error } = await createServiceClient().rpc('purge_due_accounts', { p_limit: 50 });
  if (error) {
    console.error('purge: failed', { code: error.code, message: error.message });
    return json({ error: 'purge_failed', code: error.code ?? 'unknown' }, 500);
  }
  const parsed = summary.safeParse(data);
  if (!parsed.success) return json({ error: 'unexpected_response' }, 500);
  console.info('purge: completed', parsed.data);
  return json(parsed.data);
}

export const GET = purge;
export const POST = purge;
