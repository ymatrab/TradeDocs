import 'server-only';

import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Json } from '@/lib/database.types';
import { isPlatformAdmin } from '@/lib/admin/allowlist';
import { createServiceClient, hasServiceRole } from '@/lib/supabase/admin';
import { getUser, isDatabaseConfigured, type TradeDocsClient } from '@/lib/supabase/server';

export type AdminIdentity = { id: string; email: string };

export type AdminContext =
  | { kind: 'ready'; admin: AdminIdentity; client: TradeDocsClient }
  /** The deployment has no database or no service-role key: nothing can be shown. */
  | { kind: 'unavailable' };

/**
 * Who may use /admin, decided on the server for every request and every action.
 *
 * A signed-out visitor and a signed-in non-admin both get a 404, so the panel's existence is
 * not confirmed to anyone outside the allowlist. Only after the caller is verified against
 * the auth server and matched to PLATFORM_ADMIN_EMAILS is the service-role client created;
 * nothing else in the request can reach it. Without a database there is no one to verify
 * and nothing to show, so the panel reports that instead of failing.
 *
 * Every page and every action calls this itself. Layouts render in parallel with pages, so a
 * check in a layout alone would not stop a page from running its queries.
 */
export const adminContext = cache(async (): Promise<AdminContext> => {
  // Without a database nobody can be identified, so the panel does not exist (404).
  if (!isDatabaseConfigured()) notFound();
  let user: Awaited<ReturnType<typeof getUser>>;
  try {
    user = await getUser();
  } catch {
    notFound();
  }
  if (!user || !isPlatformAdmin(user, process.env.PLATFORM_ADMIN_EMAILS)) notFound();
  if (!hasServiceRole()) return { kind: 'unavailable' };
  return {
    kind: 'ready',
    admin: { id: user.id, email: user.email ?? '' },
    client: createServiceClient(),
  };
});

export type AdminEvent = {
  /** Without the prefix; stored as `platform_admin.<action>`. */
  action:
    | 'view_overview'
    | 'view_organizations'
    | 'view_organization'
    | 'view_contact_messages'
    | 'mark_contact_message_handled'
    | 'view_audit_log'
    | 'view_users'
    | 'search_users'
    | 'view_user'
    | 'disable_sign_in'
    | 'enable_sign_in'
    | 'resend_confirmation'
    | 'send_password_reset'
    | 'cancel_account_deletion'
    | 'force_account_deletion'
    | 'run_account_purge';
  targetType: string;
  targetId?: string | null;
  orgId?: string | null;
  metadata?: Record<string, Json>;
};

/**
 * Records an admin action in audit_events: who (actor_id), what (action and target) and when
 * (created_at). Returns whether it was written; callers fail closed and show nothing when it
 * was not, because an unrecorded look at tenant data is the thing the log exists to prevent.
 *
 * An event about one organization carries its org_id, so that organization's own owners and
 * admins can see in their audit history that the platform looked at it.
 */
export async function recordAdminEvent(
  context: Extract<AdminContext, { kind: 'ready' }>,
  event: AdminEvent,
): Promise<{ ok: true } | { ok: false; cause: string }> {
  const { error } = await context.client.from('audit_events').insert({
    actor_id: context.admin.id,
    org_id: event.orgId ?? null,
    action: `platform_admin.${event.action}`,
    target_type: event.targetType,
    target_id: event.targetId ?? null,
    metadata: { via: 'admin_panel', ...(event.metadata ?? {}) },
  });
  if (error) {
    console.error('admin: audit write failed', { action: event.action, code: error.code });
    return { ok: false, cause: `${error.code ?? 'unknown'}: ${error.message}` };
  }
  return { ok: true };
}
