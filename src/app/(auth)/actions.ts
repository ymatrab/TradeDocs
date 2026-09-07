'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getServerEnv } from '@/lib/config/server';
import { fieldErrors, summaryOf } from '@/lib/form-errors';

export type FormState = {
  error?: string;
  notice?: string;
  /** Messages keyed by form field name, so each lands beside the control it rejects. */
  fields?: Record<string, string>;
};

const credentials = z.object({
  email: z.email('Enter a valid email address.'),
  // Length is the control that matters; composition rules push people towards weaker,
  // more predictable passwords.
  password: z.string().min(12, 'Use at least 12 characters.').max(200),
});

const emailOnly = z.object({ email: z.email('Enter a valid email address.') });

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

function callbackUrl(next?: string): string {
  const env = getServerEnv();
  const base = env.APP_URL ?? 'http://127.0.0.1:3000';
  const url = new URL('/auth/callback', base);
  if (next) url.searchParams.set('next', next);
  return url.toString();
}

export async function signIn(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentials.safeParse({
    email: read(formData, 'email'),
    password: read(formData, 'password'),
  });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check your details.'), fields };
  }

  const client = await createClient();
  const { error } = await client.auth.signInWithPassword(parsed.data);
  // The same message for an unknown address and a wrong password: distinguishing them
  // tells an attacker which addresses hold accounts.
  if (error) {
    return {
      error: 'That email and password combination does not match an account.',
      // Neither field is individually wrong, so neither carries its own message;
      // saying which one was would tell an attacker what they wanted to know.
    };
  }
  redirect('/app');
}

export async function signUp(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = credentials.safeParse({
    email: read(formData, 'email'),
    password: read(formData, 'password'),
  });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check your details.'), fields };
  }

  const client = await createClient();
  const { data, error } = await client.auth.signUp({
    ...parsed.data,
    options: { emailRedirectTo: callbackUrl() },
  });
  if (error) {
    const message = 'That account could not be created. Try a different address.';
    return { error: message, fields: { email: message } };
  }
  if (!data.session) {
    return { notice: 'Check your email to confirm the address, then sign in.' };
  }
  redirect('/app');
}

export async function sendMagicLink(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = emailOnly.safeParse({ email: read(formData, 'email') });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check your details.'), fields };
  }

  const client = await createClient();
  await client.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: callbackUrl(), shouldCreateUser: false },
  });
  // Always the same answer, whether or not the address has an account.
  return { notice: 'If that address has an account, a sign-in link is on its way.' };
}

export async function requestPasswordReset(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = emailOnly.safeParse({ email: read(formData, 'email') });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check your details.'), fields };
  }

  const client = await createClient();
  await client.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: callbackUrl('/account/password'),
  });
  return { notice: 'If that address has an account, a reset link is on its way.' };
}

export async function updatePassword(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = z
    .object({ password: z.string().min(12, 'Use at least 12 characters.').max(200) })
    .safeParse({ password: read(formData, 'password') });
  if (!parsed.success) {
    const fields = fieldErrors(parsed.error);
    return { error: summaryOf(fields, 'Check your details.'), fields };
  }

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { error: 'This reset link has expired. Request a new one.' };

  const { error } = await client.auth.updateUser({ password: parsed.data.password });
  if (error) {
    const message = 'That password could not be set. Try a different one.';
    return { error: message, fields: { password: message } };
  }
  redirect('/app');
}
