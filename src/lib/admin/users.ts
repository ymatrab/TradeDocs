import 'server-only';

import { z } from 'zod';
import type { TradeDocsClient } from '@/lib/supabase/server';

/**
 * Platform-admin reads of accounts. Every function takes the service-role client that
 * adminContext() hands out only after the caller is verified against the allowlist, and every
 * caller records an audit event before showing the result.
 */

export const userQuerySchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Type at least 3 characters of the address.')
  .max(254, 'Use 254 characters or fewer.');

const timestamp = z.string().nullable().optional();

export const userRowSchema = z.object({
  id: z.uuid(),
  email: z.string().nullable(),
  created_at: z.string(),
  last_sign_in_at: timestamp,
  email_confirmed_at: timestamp,
  banned_until: timestamp,
  deletion_due: timestamp,
});
export type AdminUserRow = z.infer<typeof userRowSchema>;

export type SearchOutcome = { ok: true; rows: AdminUserRow[] } | { ok: false; cause: string };

/** Exact or prefix match on the address, at most 25 rows (admin_search_users). */
export async function searchUsers(client: TradeDocsClient, query: string): Promise<SearchOutcome> {
  const { data, error } = await client.rpc('admin_search_users', { p_query: query, p_limit: 25 });
  if (error) return { ok: false, cause: `${error.code ?? 'unknown'}: ${error.message}` };
  const parsed = z.array(userRowSchema).safeParse(data);
  if (!parsed.success) return { ok: false, cause: 'Unexpected response from admin_search_users.' };
  return { ok: true, rows: parsed.data };
}

/** Whether a ban is in force now. Supabase stores a far-future timestamp for "disabled". */
export function isBanned(bannedUntil: string | null | undefined, now = Date.now()): boolean {
  return Boolean(bannedUntil && Date.parse(bannedUntil) > now);
}

export type AdminUserDetail = {
  id: string;
  email: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  emailConfirmedAt: string | null;
  banned: boolean;
  memberships: { orgId: string; organization: string; role: string; deleted: boolean }[];
  deletion: {
    purgeAfter: string;
    cancelledAt: string | null;
    lastOutcome: string | null;
  } | null;
};

export type DetailOutcome =
  | { ok: true; user: AdminUserDetail }
  | { ok: false; missing: true }
  | { ok: false; missing: false; cause: string };

export async function getUserDetail(client: TradeDocsClient, id: string): Promise<DetailOutcome> {
  const { data, error } = await client.auth.admin.getUserById(id);
  if (error || !data.user) {
    if (!error || error.status === 404) return { ok: false, missing: true };
    return { ok: false, missing: false, cause: `${error.code ?? error.status}: ${error.message}` };
  }
  const user = data.user;

  const [memberships, deletion] = await Promise.all([
    client
      .from('memberships')
      .select('org_id, role, organizations(name, deleted_at)')
      .eq('user_id', id)
      .order('created_at', { ascending: true }),
    client
      .from('account_deletion_requests')
      .select('purge_after, cancelled_at, last_purge_outcome')
      .eq('user_id', id)
      .maybeSingle(),
  ]);
  if (memberships.error || deletion.error) {
    const failure = memberships.error ?? deletion.error;
    return {
      ok: false,
      missing: false,
      cause: `${failure?.code ?? 'unknown'}: ${failure?.message ?? 'read failed'}`,
    };
  }

  return {
    ok: true,
    user: {
      id: user.id,
      email: user.email ?? null,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at ?? null,
      emailConfirmedAt: user.email_confirmed_at ?? null,
      banned: isBanned((user as { banned_until?: string | null }).banned_until),
      memberships: (memberships.data ?? []).map((row) => ({
        orgId: row.org_id,
        organization: row.organizations?.name ?? 'Unknown organization',
        role: row.role,
        deleted: Boolean(row.organizations?.deleted_at),
      })),
      deletion: deletion.data
        ? {
            purgeAfter: deletion.data.purge_after,
            cancelledAt: deletion.data.cancelled_at,
            lastOutcome: deletion.data.last_purge_outcome,
          }
        : null,
    },
  };
}
