'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { adminContext, recordAdminEvent } from '@/lib/admin/server';

export type AdminActionState = { error?: string; done?: boolean };

/**
 * Marks a contact message handled. The caller is re-verified here, not trusted from the page
 * that rendered the button: a server action is a public endpoint. adminContext() 404s anyone
 * outside the allowlist. The update only touches a message that is still open, so a replay
 * changes nothing and records nothing.
 */
export async function markMessageHandled(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const context = await adminContext();
  if (context.kind === 'unavailable') return { error: 'Admin needs the production database.' };

  const id = z.uuid().safeParse(formData.get('id'));
  if (!id.success) return { error: 'That message reference is not valid.' };

  const { data, error } = await context.client
    .from('contact_messages')
    .update({ handled_at: new Date().toISOString(), handled_by: context.admin.id })
    .eq('id', id.data)
    .is('handled_at', null)
    .select('id');
  if (error) return { error: `Not saved. ${error.code ?? 'unknown'}: ${error.message}` };
  if (!data || data.length === 0) {
    revalidatePath('/admin/messages');
    return { done: true };
  }

  const audit = await recordAdminEvent(context, {
    action: 'mark_contact_message_handled',
    targetType: 'contact_message',
    targetId: id.data,
  });
  revalidatePath('/admin/messages');
  if (!audit.ok) {
    return { error: `Marked handled, but the audit record failed. Cause: ${audit.cause}` };
  }
  return { done: true };
}
