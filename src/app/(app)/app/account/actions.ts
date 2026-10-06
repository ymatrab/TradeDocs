'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { fieldErrors, summaryOf } from '@/lib/form-errors';
import { AUTH_LIMITS, actionContext, consumeQuotas, userSubject } from '@/lib/security/auth-limits';
import {
  BREACHED_PASSWORD_MESSAGE,
  currentPasswordSchema,
  isBreachedPassword,
  newPasswordSchema,
} from '@/lib/security/password';
import { callbackUrl } from '@/lib/supabase/auth-links';
import { createClient, type TradeDocsClient } from '@/lib/supabase/server';

export type SettingsState = {
  error?: string;
  notice?: string;
  fields?: Record<string, string>;
  /** Changes on every successful save, so a form can reset itself. */
  saved?: number;
};

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

function invalid(error: z.ZodError): SettingsState {
  const fields = fieldErrors(error);
  return { error: summaryOf(fields, 'Check the highlighted fields.'), fields };
}

type Verified =
  | { ok: true; client: TradeDocsClient; id: string; email: string }
  | { ok: false; state: SettingsState };

/**
 * The signed-in account, counted against the account-change quota and, where a password is
 * given, re-verified with it. An open session alone is not enough to change how the account
 * is signed in to: a laptop left unlocked must not hand over the account.
 */
async function verifiedAccount(password?: string): Promise<Verified> {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user?.email) return { ok: false, state: { error: 'Sign in again, then retry.' } };

  const context = await actionContext();
  const quota = await consumeQuotas(context.env, [
    [AUTH_LIMITS.accountChange, userSubject(user.id)],
  ]);
  if (!quota.ok) return { ok: false, state: { error: quota.message } };

  if (password !== undefined) {
    const { error } = await client.auth.signInWithPassword({ email: user.email, password });
    if (error) {
      const message = 'That password is not correct.';
      return { ok: false, state: { error: message, fields: { current_password: message } } };
    }
  }
  return { ok: true, client, id: user.id, email: user.email };
}

export async function updateDisplayName(
  _previous: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const parsed = z
    .object({ display_name: z.string().trim().max(160, 'Use 160 characters or fewer.') })
    .safeParse({ display_name: read(formData, 'display_name') });
  if (!parsed.success) return invalid(parsed.error);

  const account = await verifiedAccount();
  if (!account.ok) return account.state;
  const { error } = await account.client
    .from('profiles')
    .update({ display_name: parsed.data.display_name || null })
    .eq('id', account.id);
  if (error) return { error: 'Your name could not be saved. Try again.' };
  revalidatePath('/app', 'layout');
  return { notice: 'Name saved. Colleagues see it in member lists.', saved: Date.now() };
}

/**
 * Starts an email change. Supabase sends a confirmation link to the new address (and, with
 * secure email change on, to the current one too); nothing changes until it is opened. An
 * address that already belongs to another account gets the same answer, so this screen
 * cannot be used to discover who has an account.
 */
export async function changeEmail(
  _previous: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const parsed = z
    .object({
      email: z.email('Enter a valid email address.').max(254, 'Use 254 characters or fewer.'),
      current_password: currentPasswordSchema,
    })
    .safeParse({
      email: read(formData, 'email'),
      current_password: read(formData, 'current_password'),
    });
  if (!parsed.success) return invalid(parsed.error);

  const account = await verifiedAccount(parsed.data.current_password);
  if (!account.ok) return account.state;
  const target = parsed.data.email.toLowerCase();
  if (target === account.email.toLowerCase()) {
    const message = 'That is already your address.';
    return { error: message, fields: { email: message } };
  }

  const context = await actionContext();
  const { error } = await account.client.auth.updateUser(
    { email: target },
    { emailRedirectTo: callbackUrl(context.env, '/app/account') },
  );
  if (error && error.code !== 'email_exists' && error.code !== 'user_already_exists') {
    if (error.status === 429) {
      return { error: 'Too many emails were sent just now. Try again in a few minutes.' };
    }
    console.error('account: email change failed', { code: error.code ?? 'unknown' });
    return { error: 'The change could not be started. Try again in a minute.' };
  }
  revalidatePath('/app/account');
  return {
    notice:
      'Check both inboxes. Your address changes once you open the confirmation link; until then you keep signing in with the current one.',
    saved: Date.now(),
  };
}

/** Changes the password. Requires the current one; ends every other session afterwards. */
export async function changePassword(
  _previous: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const parsed = z
    .object({ current_password: currentPasswordSchema, new_password: newPasswordSchema })
    .safeParse({
      current_password: read(formData, 'current_password'),
      new_password: read(formData, 'new_password'),
    });
  if (!parsed.success) return invalid(parsed.error);
  if (parsed.data.current_password === parsed.data.new_password) {
    const message = 'Choose a password different from the current one.';
    return { error: message, fields: { new_password: message } };
  }

  const account = await verifiedAccount(parsed.data.current_password);
  if (!account.ok) return account.state;

  if (await isBreachedPassword(parsed.data.new_password)) {
    return {
      error: BREACHED_PASSWORD_MESSAGE,
      fields: { new_password: BREACHED_PASSWORD_MESSAGE },
    };
  }

  const { error } = await account.client.auth.updateUser({ password: parsed.data.new_password });
  if (error) {
    const message =
      error.code === 'weak_password'
        ? 'That password is too easy to guess. Choose a longer, less common one.'
        : 'That password could not be set. Try a different one.';
    return { error: message, fields: { new_password: message } };
  }
  await account.client.auth.signOut({ scope: 'others' });
  return {
    notice: 'Password changed. Every other session has been signed out.',
    saved: Date.now(),
  };
}
