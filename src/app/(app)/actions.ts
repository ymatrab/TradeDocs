'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { fieldErrors, summaryOf } from '@/lib/form-errors';

export type ActionState = {
  error?: string;
  notice?: string;
  token?: string;
  /** Messages keyed by form field name, so each lands beside the control it rejects. */
  fields?: Record<string, string>;
};

const uuid = z.uuid();

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

/**
 * Every action below relies on the database for authorization. The client carries the
 * caller's session, so a policy or a routine's own role check decides the outcome; none of
 * these functions grants access by deciding for itself.
 */
export async function createOrganization(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .string()
    .trim()
    .min(1, 'Enter an organization name.')
    .max(160, 'Use 160 characters or fewer.')
    .safeParse(read(formData, 'name'));
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Check the name.';
    return { error: message, fields: { name: message } };
  }

  const client = await createClient();
  const { data, error } = await client.rpc('create_organization', {
    organization_name: parsed.data,
  });
  if (error || !data) return { error: 'That organization could not be created.' };
  revalidatePath('/app');
  redirect(`/app/${data}/members`);
}

export async function inviteMember(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      email: z.email('Enter a valid email address.'),
      role: z.enum(['admin', 'member']),
    })
    .safeParse({
      org: read(formData, 'org'),
      email: read(formData, 'email'),
      role: read(formData, 'role'),
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the details.'), fields };
  }

  const client = await createClient();
  const { data, error } = await client.rpc('create_invitation', {
    target_org: parsed.data.org,
    invitee_email: parsed.data.email,
    invitee_role: parsed.data.role,
  });
  if (error || !data) return { error: 'That invitation could not be created.' };

  revalidatePath(`/app/${parsed.data.org}/members`);
  // Returned once and never stored in readable form. Delivery by email arrives with
  // Task 07; until then the inviter passes the link on themselves.
  return { notice: `Invitation ready for ${parsed.data.email}.`, token: data };
}

export async function changeRole(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = z
    .object({ org: uuid, user: uuid, role: z.enum(['owner', 'admin', 'member']) })
    .safeParse({
      org: read(formData, 'org'),
      user: read(formData, 'user'),
      role: read(formData, 'role'),
    });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the details.'), fields };
  }

  const client = await createClient();
  const { error } = await client
    .from('memberships')
    .update({ role: parsed.data.role })
    .eq('org_id', parsed.data.org)
    .eq('user_id', parsed.data.user);
  if (error) {
    return {
      error: error.message.includes('at least one owner')
        ? 'An organization must keep at least one owner.'
        : 'That role could not be changed.',
    };
  }
  revalidatePath(`/app/${parsed.data.org}/members`);
  return { notice: 'Role updated.' };
}

export async function removeMember(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ org: uuid, user: uuid })
    .safeParse({ org: read(formData, 'org'), user: read(formData, 'user') });
  if (!parsed.success) return { error: 'Check the details.' };

  const client = await createClient();
  const { error } = await client
    .from('memberships')
    .delete()
    .eq('org_id', parsed.data.org)
    .eq('user_id', parsed.data.user);
  if (error) {
    return {
      error: error.message.includes('at least one owner')
        ? 'An organization must keep at least one owner.'
        : 'That member could not be removed.',
    };
  }
  revalidatePath(`/app/${parsed.data.org}/members`);
  return { notice: 'Member removed.' };
}

export async function acceptInvitation(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = read(formData, 'token');
  if (!token) return { error: 'This invitation link is incomplete.' };

  const client = await createClient();
  const { data, error } = await client.rpc('accept_invitation', { token });
  if (error || !data) return { error: 'This invitation is no longer valid.' };
  redirect(`/app/${data}/members`);
}

/**
 * Scheduling a deletion is destructive enough to require the password again. A session
 * left open on a shared machine must not be enough to queue someone's account for removal.
 */
async function scheduleDeletion(password: string): Promise<ActionState> {
  if (!password) {
    const message = 'Enter your password to confirm.';
    return { error: message, fields: { password: message } };
  }

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user?.email) return { error: 'Sign in again, then retry.' };

  const { error: reauthError } = await client.auth.signInWithPassword({
    email: user.email,
    password,
  });
  if (reauthError) {
    const message = 'That password is not correct.';
    return { error: message, fields: { password: message } };
  }

  const { error } = await client.rpc('request_account_deletion', { grace: '30 days' });
  if (error) return { error: 'That request could not be recorded.' };
  revalidatePath('/app/account');
  return { notice: 'Deletion is scheduled. You can withdraw it during the grace period.' };
}

async function withdrawDeletion(): Promise<ActionState> {
  const client = await createClient();
  const { error } = await client.rpc('cancel_account_deletion');
  if (error) return { error: 'There is no deletion request to withdraw.' };
  revalidatePath('/app/account');
  return { notice: 'Deletion withdrawn. Your account stays open.' };
}

/**
 * Both lifecycle outcomes share one action, so the screen has a single message to show.
 * Holding a result per action meant whichever ran first kept the display for good.
 */
export async function updateAccountLifecycle(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const intent = read(formData, 'intent');
  if (intent === 'withdraw') return withdrawDeletion();
  if (intent === 'schedule') return scheduleDeletion(read(formData, 'password'));
  return { error: 'That request was not recognised.' };
}
