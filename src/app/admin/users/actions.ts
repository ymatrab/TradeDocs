'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { adminContext, recordAdminEvent, type AdminEvent } from '@/lib/admin/server';
import { isBanned, searchUsers, userQuerySchema, type AdminUserRow } from '@/lib/admin/users';
import { getServerEnv } from '@/lib/config/server';
import { callbackUrl } from '@/lib/supabase/auth-links';

/**
 * Platform-admin account actions. Each one re-verifies the caller (a server action is a
 * public endpoint), refuses to act on the admin's own account where that would lock them
 * out, records an audit event, and reports the provider's own error to the admin.
 */

export type SearchState = {
  error?: string;
  rows?: (AdminUserRow & { banned: boolean })[];
  searched?: boolean;
};

/**
 * Searches by email. The query travels in the POST body and comes back in the action's
 * result; it never enters a URL, a log line or the audit record (which keeps the count).
 */
export async function searchUsersAction(
  _previous: SearchState,
  formData: FormData,
): Promise<SearchState> {
  const context = await adminContext();
  if (context.kind === 'unavailable') return { error: 'Admin needs the production database.' };

  const query = userQuerySchema.safeParse(formData.get('query'));
  if (!query.success) return { error: query.error.issues[0]?.message ?? 'Check the search.' };

  const result = await searchUsers(context.client, query.data);
  if (!result.ok) return { error: `Search failed. ${result.cause}` };
  const audit = await recordAdminEvent(context, {
    action: 'search_users',
    targetType: 'user_list',
    metadata: { results: result.rows.length, exact: query.data.includes('@') },
  });
  if (!audit.ok) return { error: `Not shown: the audit record failed. Cause: ${audit.cause}` };
  const rows = result.rows.map((row) => ({ ...row, banned: isBanned(row.banned_until) }));
  return { rows, searched: true };
}

export type UserActionState = { error?: string; notice?: string };

const intents = [
  'disable',
  'enable',
  'resend_confirmation',
  'password_reset',
  'cancel_deletion',
  'force_deletion',
] as const;
type Intent = (typeof intents)[number];

const auditAction: Record<Intent, AdminEvent['action']> = {
  disable: 'disable_sign_in',
  enable: 'enable_sign_in',
  resend_confirmation: 'resend_confirmation',
  password_reset: 'send_password_reset',
  cancel_deletion: 'cancel_account_deletion',
  force_deletion: 'force_account_deletion',
};

/** Roughly a century: Supabase's way of saying "until an admin lifts it". */
const INDEFINITE_BAN = '876000h';

export async function userAction(
  _previous: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const context = await adminContext();
  if (context.kind === 'unavailable') return { error: 'Admin needs the production database.' };

  const parsed = z
    .object({ user: z.uuid(), intent: z.enum(intents) })
    .safeParse({ user: formData.get('user'), intent: formData.get('intent') });
  if (!parsed.success) return { error: 'That request was not recognised.' };
  const { user: id, intent } = parsed.data;

  if (id === context.admin.id && ['disable', 'force_deletion'].includes(intent)) {
    return { error: 'You cannot do that to your own account from the admin panel.' };
  }

  const { client } = context;
  const { data: found, error: lookupError } = await client.auth.admin.getUserById(id);
  if (lookupError || !found.user) {
    return { error: `That account could not be read. ${lookupError?.message ?? 'Not found.'}` };
  }
  const email = found.user.email ?? null;
  const env = getServerEnv();
  let notice: string;
  let metadata: Record<string, string | number | boolean> = {};

  switch (intent) {
    case 'disable': {
      const { error } = await client.auth.admin.updateUserById(id, {
        ban_duration: INDEFINITE_BAN,
      });
      if (error) return { error: `Not disabled. ${error.code ?? error.status}: ${error.message}` };
      // A ban stops new sessions; ending the current ones makes it take effect now.
      const { data: ended, error: sessionError } = await client.rpc('admin_revoke_sessions', {
        p_user: id,
      });
      metadata = { sessions_ended: typeof ended === 'number' ? ended : 0 };
      notice = sessionError
        ? `Sign-in disabled, but open sessions could not be ended (${sessionError.message}). They expire within the hour.`
        : 'Sign-in disabled and every open session ended.';
      break;
    }
    case 'enable': {
      const { error } = await client.auth.admin.updateUserById(id, { ban_duration: 'none' });
      if (error) return { error: `Not enabled. ${error.code ?? error.status}: ${error.message}` };
      notice = 'Sign-in enabled.';
      break;
    }
    case 'resend_confirmation': {
      if (!email) return { error: 'This account has no email address.' };
      if (found.user.email_confirmed_at) return { error: 'This address is already confirmed.' };
      const { error } = await client.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: callbackUrl(env) },
      });
      if (error) return { error: `Not sent. ${error.code ?? error.status}: ${error.message}` };
      notice = 'Confirmation email sent.';
      break;
    }
    case 'password_reset': {
      if (!email) return { error: 'This account has no email address.' };
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: callbackUrl(env, '/reset-password/new'),
      });
      if (error) return { error: `Not sent. ${error.code ?? error.status}: ${error.message}` };
      notice = 'Password reset email sent. The link lets the account holder choose a new one.';
      break;
    }
    case 'cancel_deletion': {
      const { data, error } = await client
        .from('account_deletion_requests')
        .update({ cancelled_at: new Date().toISOString() })
        .eq('user_id', id)
        .is('cancelled_at', null)
        .select('user_id');
      if (error) return { error: `Not cancelled. ${error.code ?? 'unknown'}: ${error.message}` };
      if (!data || data.length === 0) return { error: 'There is no pending deletion to cancel.' };
      notice = 'Deletion cancelled. The account stays open.';
      break;
    }
    case 'force_deletion': {
      const { data, error } = await client.rpc('admin_force_account_deletion', { p_user: id });
      if (error) return { error: `Not deleted. ${error.code ?? 'unknown'}: ${error.message}` };
      metadata = { outcome: String(data) };
      if (data === 'blocked_sole_owner') {
        // Recorded either way: the attempt is the admin's action.
        await recordAdminEvent(context, {
          action: auditAction[intent],
          targetType: 'account',
          targetId: id,
          metadata,
        });
        return {
          error:
            'Not deleted: this account is the only owner of an organization that still has other members. Ask them to hand ownership over first; the deletion stays scheduled.',
        };
      }
      notice = 'Account deleted.';
      break;
    }
  }

  const audit = await recordAdminEvent(context, {
    action: auditAction[intent],
    targetType: 'account',
    targetId: id,
    metadata,
  });
  revalidatePath(`/admin/users/${id}`);
  if (!audit.ok) return { error: `${notice} But the audit record failed. Cause: ${audit.cause}` };
  return { notice };
}

export type PurgeState = { error?: string; notice?: string };

/**
 * "Run purge now": the same idempotent routine a schedule would call. Nothing runs on a
 * timer until the owner decides how to schedule it (RUNBOOK.md).
 */
export async function runPurgeNow(): Promise<PurgeState> {
  const context = await adminContext();
  if (context.kind === 'unavailable') return { error: 'Admin needs the production database.' };

  const { data, error } = await context.client.rpc('purge_due_accounts', { p_limit: 50 });
  if (error) return { error: `Purge failed. ${error.code ?? 'unknown'}: ${error.message}` };
  const summary = z.object({ purged: z.number(), blocked: z.number() }).safeParse(data);
  if (!summary.success) return { error: 'Purge ran, but its summary could not be read.' };

  const audit = await recordAdminEvent(context, {
    action: 'run_account_purge',
    targetType: 'account_purge',
    metadata: { purged: summary.data.purged, blocked: summary.data.blocked },
  });
  revalidatePath('/admin/users');
  const notice =
    `${summary.data.purged} ${summary.data.purged === 1 ? 'account' : 'accounts'} purged` +
    (summary.data.blocked > 0
      ? `; ${summary.data.blocked} held back because they are the only owner of an organization with other members.`
      : '.');
  if (!audit.ok) return { error: `${notice} But the audit record failed. Cause: ${audit.cause}` };
  return { notice };
}
