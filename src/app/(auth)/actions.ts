'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { turnstileEnforced } from '@/lib/config/controls';
import { fieldErrors, summaryOf } from '@/lib/form-errors';
import {
  AUTH_LIMITS,
  actionContext,
  consumeQuotas,
  emailSubject,
  reachedLimit,
  recordFailure,
  userSubject,
} from '@/lib/security/auth-limits';
import {
  BREACHED_PASSWORD_MESSAGE,
  currentPasswordSchema,
  isBreachedPassword,
  newPasswordSchema,
} from '@/lib/security/password';
import { safeNextPath } from '@/lib/security/redirect';
import { TURNSTILE_FIELD, challengeMessage, verifyChallenge } from '@/lib/security/turnstile';
import { NEXT_COOKIE, callbackUrl } from '@/lib/supabase/auth-links';
import { createClient } from '@/lib/supabase/server';

export type FormState = {
  error?: string;
  notice?: string;
  /** Messages keyed by form field name, so each lands beside the control it rejects. */
  fields?: Record<string, string>;
  /** The server wants a bot challenge on the next attempt. */
  challenge?: boolean;
  /** A confirmation link went to this address; the screen switches to "check your inbox". */
  sentTo?: string;
  /** The password was right but the address is unconfirmed; offer to resend the link. */
  unconfirmed?: string;
  /** Changes on every answer, so a single-use challenge token is renewed each time. */
  attempt?: number;
};

const email = z.email('Enter a valid email address.').max(254, 'Use 254 characters or fewer.');

const GENERIC_SIGN_IN_FAILURE = 'That email and password combination does not match an account.';

function read(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === 'string' ? value : '';
}

function invalid(error: z.ZodError): FormState {
  const fields = fieldErrors(error);
  return { error: summaryOf(fields, 'Check your details.'), fields };
}

/**
 * Remembers where a person was going, for the email-borne half of a flow. A confirmation or
 * magic link opened on the same device lands back there; on another device it lands on /app.
 * The path is already restricted to signed-in destinations, and nothing personal is in it.
 */
async function rememberNext(next: string): Promise<void> {
  if (next === '/app') return;
  (await cookies()).set(NEXT_COOKIE, next, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60,
  });
}

export async function signIn(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = z
    .object({ email, password: currentPasswordSchema })
    .safeParse({ email: read(formData, 'email'), password: read(formData, 'password') });
  if (!parsed.success) return invalid(parsed.error);

  const next = safeNextPath(read(formData, 'next'));
  const address = parsed.data.email.toLowerCase();
  const context = await actionContext();
  const { env } = context;
  const attempt = Date.now();

  const quota = await consumeQuotas(env, [
    [AUTH_LIMITS.signInAddress, context.address],
    [AUTH_LIMITS.signInAccount, emailSubject(address)],
  ]);
  if (!quota.ok) return { error: quota.message, attempt };

  // After repeated failures for this account or this address, a bot challenge is required.
  // Where failures cannot be counted (no store, or the store is down) the challenge is
  // required every time instead: an active control never quietly switches itself off.
  if (turnstileEnforced(env)) {
    let required = true;
    try {
      const [account, origin] = await Promise.all([
        reachedLimit(env, AUTH_LIMITS.signInFailAccount, emailSubject(address)),
        reachedLimit(env, AUTH_LIMITS.signInFailAddress, context.address),
      ]);
      required = account === null || origin === null || account || origin;
    } catch {
      required = true;
    }
    if (required) {
      const check = await verifyChallenge(
        env,
        read(formData, TURNSTILE_FIELD),
        'sign_in',
        context.remoteIp,
      );
      if (!check.ok) return { error: challengeMessage(check), challenge: true, attempt };
    }
  }

  const client = await createClient();
  const { error } = await client.auth.signInWithPassword({
    email: address,
    password: parsed.data.password,
  });
  if (error) {
    // Supabase reports these two only after the password matched, so saying so tells the
    // caller nothing they did not already prove by knowing the password.
    if (error.code === 'email_not_confirmed') {
      return {
        error: 'Confirm your email address first. The link is in the email we sent you.',
        unconfirmed: address,
        attempt,
      };
    }
    if (error.code === 'user_banned') {
      return {
        error: 'Sign-in is turned off for this account. Contact us if you think this is a mistake.',
        attempt,
      };
    }
    const [account, origin] = await Promise.all([
      recordFailure(env, AUTH_LIMITS.signInFailAccount, emailSubject(address)),
      recordFailure(env, AUTH_LIMITS.signInFailAddress, context.address),
    ]);
    // The same message for an unknown address and a wrong password: distinguishing them
    // tells an attacker which addresses hold accounts. Neither field carries its own message.
    return {
      error: GENERIC_SIGN_IN_FAILURE,
      challenge: turnstileEnforced(env) && (account || origin) ? true : undefined,
      attempt,
    };
  }
  redirect(next);
}

export async function signUp(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = z
    .object({ email, password: newPasswordSchema })
    .safeParse({ email: read(formData, 'email'), password: read(formData, 'password') });
  if (!parsed.success) return invalid(parsed.error);

  const next = safeNextPath(read(formData, 'next'));
  const address = parsed.data.email.toLowerCase();
  const context = await actionContext();
  const { env } = context;
  const attempt = Date.now();

  const quota = await consumeQuotas(env, [
    [AUTH_LIMITS.signUpAddress, context.address],
    [AUTH_LIMITS.emailLinkAccount, emailSubject(address)],
  ]);
  if (!quota.ok) return { error: quota.message, attempt };

  const check = await verifyChallenge(
    env,
    read(formData, TURNSTILE_FIELD),
    'sign_up',
    context.remoteIp,
  );
  if (!check.ok) return { error: challengeMessage(check), attempt };

  if (await isBreachedPassword(parsed.data.password)) {
    return {
      error: BREACHED_PASSWORD_MESSAGE,
      fields: { password: BREACHED_PASSWORD_MESSAGE },
      attempt,
    };
  }

  const client = await createClient();
  const { data, error } = await client.auth.signUp({
    email: address,
    password: parsed.data.password,
    options: { emailRedirectTo: callbackUrl(env, next) },
  });
  await rememberNext(next);

  if (error) {
    if (error.code === 'weak_password') {
      const message = 'That password is too easy to guess. Choose a longer, less common one.';
      return { error: message, fields: { password: message }, attempt };
    }
    // An address that already has an account gets the answer a new one would: saying it is
    // taken would confirm the account exists. The owner of that address gets no email and
    // can sign in or reset their password as usual.
    if (error.code === 'user_already_exists' || error.code === 'email_exists') {
      return { sentTo: address, attempt };
    }
    if (error.status === 429) {
      return { error: 'Too many emails were sent just now. Try again in a few minutes.', attempt };
    }
    console.error('auth: sign-up failed', { code: error.code ?? 'unknown', status: error.status });
    return { error: 'That account could not be created. Try again in a minute.', attempt };
  }

  // A project without email confirmation (local and CI only) signs the person in at once.
  if (data.session) redirect(next);
  return { sentTo: address, attempt };
}

/** Resends the sign-up confirmation. The same answer whether or not the address is waiting. */
export async function resendConfirmation(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = email.safeParse(read(formData, 'email'));
  if (!parsed.success) return { error: 'That address is not valid.' };
  const address = parsed.data.toLowerCase();
  const next = safeNextPath(read(formData, 'next'));
  const context = await actionContext();
  const attempt = Date.now();

  const quota = await consumeQuotas(context.env, [
    [AUTH_LIMITS.resendCooldown, emailSubject(address)],
    [AUTH_LIMITS.emailLinkAccount, emailSubject(address)],
    [AUTH_LIMITS.emailLinkAddress, context.address],
  ]);
  if (!quota.ok) return { error: quota.message, sentTo: address, attempt };

  const client = await createClient();
  const { error } = await client.auth.resend({
    type: 'signup',
    email: address,
    options: { emailRedirectTo: callbackUrl(context.env, next) },
  });
  if (error && error.status !== 429 && error.status !== 400) {
    console.error('auth: resend failed', { code: error.code ?? 'unknown', status: error.status });
  }
  return {
    notice: 'If that address is waiting for confirmation, a new link is on its way.',
    sentTo: address,
    attempt,
  };
}

export async function sendMagicLink(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = z.object({ email }).safeParse({ email: read(formData, 'email') });
  if (!parsed.success) return invalid(parsed.error);
  const address = parsed.data.email.toLowerCase();
  const next = safeNextPath(read(formData, 'next'));
  const context = await actionContext();

  const quota = await consumeQuotas(context.env, [
    [AUTH_LIMITS.emailLinkAddress, context.address],
    [AUTH_LIMITS.emailLinkAccount, emailSubject(address)],
  ]);
  if (!quota.ok) return { error: quota.message };

  const client = await createClient();
  const { error } = await client.auth.signInWithOtp({
    email: address,
    options: { emailRedirectTo: callbackUrl(context.env, next), shouldCreateUser: false },
  });
  await rememberNext(next);
  // "Signups not allowed for otp" is how an unknown address answers; it is not reported.
  if (error && (error.status ?? 0) >= 500) {
    console.error('auth: magic link failed', {
      code: error.code ?? 'unknown',
      status: error.status,
    });
  }
  // Always the same answer, whether or not the address has an account.
  return { notice: 'If that address has an account, a sign-in link is on its way.' };
}

export async function requestPasswordReset(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = z.object({ email }).safeParse({ email: read(formData, 'email') });
  if (!parsed.success) return invalid(parsed.error);
  const address = parsed.data.email.toLowerCase();
  const context = await actionContext();

  const quota = await consumeQuotas(context.env, [
    [AUTH_LIMITS.emailLinkAddress, context.address],
    [AUTH_LIMITS.emailLinkAccount, emailSubject(address)],
  ]);
  if (!quota.ok) return { error: quota.message };

  const client = await createClient();
  const { error } = await client.auth.resetPasswordForEmail(address, {
    redirectTo: callbackUrl(context.env, '/reset-password/new'),
  });
  if (error && (error.status ?? 0) >= 500) {
    console.error('auth: reset request failed', {
      code: error.code ?? 'unknown',
      status: error.status,
    });
  }
  return { notice: 'If that address has an account, a reset link is on its way.' };
}

/**
 * Sets the new password from a reset link. The link's session is the authority; once the
 * password is saved every other session is ended, because a reset usually means someone
 * else may have had the old one.
 */
export async function updatePassword(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = z
    .object({ password: newPasswordSchema })
    .safeParse({ password: read(formData, 'password') });
  if (!parsed.success) return invalid(parsed.error);

  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    return { error: 'This reset link has expired or was already used. Request a new one.' };
  }

  const context = await actionContext();
  const quota = await consumeQuotas(context.env, [
    [AUTH_LIMITS.accountChange, userSubject(user.id)],
  ]);
  if (!quota.ok) return { error: quota.message };

  if (await isBreachedPassword(parsed.data.password)) {
    return { error: BREACHED_PASSWORD_MESSAGE, fields: { password: BREACHED_PASSWORD_MESSAGE } };
  }

  const { error } = await client.auth.updateUser({ password: parsed.data.password });
  if (error) {
    const message =
      error.code === 'same_password'
        ? 'That is the current password. Choose a new one.'
        : error.code === 'weak_password'
          ? 'That password is too easy to guess. Choose a longer, less common one.'
          : 'That password could not be set. Try a different one.';
    return { error: message, fields: { password: message } };
  }
  await client.auth.signOut({ scope: 'others' });
  redirect('/reset-password/done');
}
