'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { invitationLink, sendInvitationEmail } from '@/lib/email/invitation';
import { fieldErrors, summaryOf } from '@/lib/form-errors';
import { AUTH_LIMITS, actionContext, consumeQuotas, userSubject } from '@/lib/security/auth-limits';
import { createClient } from '@/lib/supabase/server';

export type ActionState = {
  error?: string;
  notice?: string;
  /** An invitation link to pass on by hand, shown once when no email reached the invitee. */
  link?: string;
  /** How an invitation was delivered, so the screen can say so plainly. */
  delivery?: 'emailed' | 'sandbox' | 'email_failed' | 'not_configured';
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

export async function renameOrganization(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      name: z
        .string()
        .trim()
        .min(1, 'Enter an organization name.')
        .max(160, 'Use 160 characters or fewer.'),
    })
    .safeParse({ org: read(formData, 'org'), name: read(formData, 'name') });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check the name.'), fields };
  }

  const client = await createClient();
  const { error } = await client.rpc('rename_organization', {
    target_org: parsed.data.org,
    new_name: parsed.data.name,
  });
  if (error) return { error: 'The name could not be changed.' };
  revalidatePath(`/app/${parsed.data.org}`, 'layout');
  revalidatePath('/app');
  return { notice: 'Organization renamed.' };
}

type InvitationTicket = {
  id: string;
  token: string;
  email: string;
  role: string;
  expiresAt: string;
};

/**
 * Emails an invitation when Resend is configured, and says plainly when it did not. The
 * link is returned to the inviter only when no email reached the invitee, so it can be
 * passed on by hand; it is never stored readable and cannot be shown again later.
 */
async function deliverInvitation(
  orgId: string,
  ticket: InvitationTicket,
  attempt: string,
): Promise<ActionState> {
  const client = await createClient();
  const { env } = await actionContext();
  const { data: organization } = await client
    .from('organizations')
    .select('name')
    .eq('id', orgId)
    .maybeSingle();
  const link = invitationLink(env.APP_URL, ticket.token);
  const delivery = await sendInvitationEmail(env, {
    invitationId: ticket.id,
    attempt,
    invitee: ticket.email,
    organization: organization?.name ?? 'an organization',
    role: ticket.role,
    link,
    expiresAt: ticket.expiresAt,
  });
  if (delivery.status === 'failed') {
    console.error('invitation: email failed', { reason: delivery.reason });
  }

  if (delivery.status === 'sent' && delivery.to === 'invitee') {
    return {
      notice: `Invitation emailed to ${ticket.email}. The link works once and expires in 7 days.`,
      delivery: 'emailed',
    };
  }
  return {
    notice: `Invitation ready for ${ticket.email}.`,
    delivery:
      delivery.status === 'failed'
        ? 'email_failed'
        : delivery.status === 'sent'
          ? 'sandbox'
          : 'not_configured',
    link,
  };
}

/** Invitations count against the inviter, so one account cannot mail-bomb a list. */
async function inviterWithinQuota(): Promise<ActionState | null> {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { error: 'Sign in again, then retry.' };
  const { env } = await actionContext();
  const quota = await consumeQuotas(env, [[AUTH_LIMITS.invitationSend, userSubject(user.id)]]);
  return quota.ok ? null : { error: quota.message };
}

export async function inviteMember(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({
      org: uuid,
      email: z.email('Enter a valid email address.').max(254, 'Use 254 characters or fewer.'),
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
  const refused = await inviterWithinQuota();
  if (refused) return refused;

  const client = await createClient();
  const email = parsed.data.email.toLowerCase();
  const { data: token, error } = await client.rpc('create_invitation', {
    target_org: parsed.data.org,
    invitee_email: email,
    invitee_role: parsed.data.role,
  });
  if (error || !token) {
    if (error?.code === '23505') {
      const message = 'That address already belongs to this organization.';
      return { error: message, fields: { email: message } };
    }
    if (error?.code === '42501') {
      return { error: 'Only an owner or administrator can invite members.' };
    }
    return { error: 'That invitation could not be created. Try again.' };
  }
  revalidatePath(`/app/${parsed.data.org}/members`);

  // The routine returns only the token; the live row for this address is the one it created.
  const { data: row } = await client
    .from('invitations')
    .select('id, expires_at')
    .eq('org_id', parsed.data.org)
    .eq('email', email)
    .is('accepted_at', null)
    .is('revoked_at', null)
    .maybeSingle();
  if (!row) {
    const { env } = await actionContext();
    return {
      notice: `Invitation ready for ${email}.`,
      delivery: 'not_configured',
      link: invitationLink(env.APP_URL, token),
    };
  }
  return deliverInvitation(
    parsed.data.org,
    { id: row.id, token, email, role: parsed.data.role, expiresAt: row.expires_at },
    'created',
  );
}

const reissued = z.object({
  token: z.string().min(32),
  email: z.string(),
  role: z.string(),
  org_id: z.string(),
  expires_at: z.string(),
});

/** A new link for a pending invitation; the previous link stops working at once. */
export async function resendInvitation(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ org: uuid, invitation: uuid })
    .safeParse({ org: read(formData, 'org'), invitation: read(formData, 'invitation') });
  if (!parsed.success) return { error: 'That invitation reference is not valid.' };
  const refused = await inviterWithinQuota();
  if (refused) return refused;

  const client = await createClient();
  const { data, error } = await client.rpc('reissue_invitation', {
    target_invitation: parsed.data.invitation,
  });
  const ticket = reissued.safeParse(data);
  if (error || !ticket.success || ticket.data.org_id !== parsed.data.org) {
    return { error: 'That invitation can no longer be resent. Create a new one.' };
  }
  revalidatePath(`/app/${parsed.data.org}/members`);
  return deliverInvitation(
    parsed.data.org,
    {
      id: parsed.data.invitation,
      token: ticket.data.token,
      email: ticket.data.email,
      role: ticket.data.role,
      expiresAt: ticket.data.expires_at,
    },
    `reissued-${Date.now()}`,
  );
}

export async function revokeInvitation(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = z
    .object({ org: uuid, invitation: uuid })
    .safeParse({ org: read(formData, 'org'), invitation: read(formData, 'invitation') });
  if (!parsed.success) return { error: 'That invitation reference is not valid.' };

  const client = await createClient();
  const { error } = await client.rpc('revoke_invitation', {
    target_invitation: parsed.data.invitation,
  });
  if (error) return { error: 'That invitation could not be revoked.' };
  revalidatePath(`/app/${parsed.data.org}/members`);
  return { notice: 'Invitation revoked. Its link no longer works.' };
}

function membershipError(error: { message: string; code?: string }, fallback: string): string {
  if (error.message.includes('at least one owner')) {
    return 'An organization must keep at least one owner.';
  }
  if (error.code === '42501') return 'You do not have permission to do that.';
  return fallback;
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
  const { error } = await client.rpc('change_member_role', {
    target_org: parsed.data.org,
    target_user: parsed.data.user,
    new_role: parsed.data.role,
  });
  if (error) return { error: membershipError(error, 'That role could not be changed.') };
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
  const {
    data: { user },
  } = await client.auth.getUser();
  const { error } = await client.rpc('remove_member', {
    target_org: parsed.data.org,
    target_user: parsed.data.user,
  });
  if (error) return { error: membershipError(error, 'That member could not be removed.') };
  revalidatePath(`/app/${parsed.data.org}/members`);
  // Someone who has just left can no longer open the page they were on.
  if (user?.id === parsed.data.user) redirect('/app');
  return { notice: 'Member removed.' };
}

export async function acceptInvitation(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const token = read(formData, 'token');
  if (!token || token.length > 256) return { error: 'This invitation link is incomplete.' };

  const client = await createClient();
  const { data, error } = await client.rpc('accept_invitation', { token });
  if (error || !data) {
    return {
      error: error?.message.includes('different address')
        ? 'This invitation was sent to a different email address. Sign in with that address, or ask for a new invitation.'
        : 'This invitation is no longer valid. It may have expired, been used or been withdrawn; ask for a new one.',
    };
  }
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

  const { env } = await actionContext();
  const quota = await consumeQuotas(env, [[AUTH_LIMITS.accountChange, userSubject(user.id)]]);
  if (!quota.ok) return { error: quota.message, fields: { password: quota.message } };

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
