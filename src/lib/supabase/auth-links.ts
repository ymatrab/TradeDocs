import 'server-only';

import type { EmailOtpType } from '@supabase/supabase-js';
import type { ServerEnv } from '@/lib/config/schema';

/** Where a person was headed before an email-borne step (see rememberNext in the actions). */
export const NEXT_COOKIE = 'td_next';

/**
 * The absolute URL Supabase sends people back to from an auth email that uses the default
 * template ({{ .ConfirmationURL }}). /auth/callback exchanges the PKCE code, which only works
 * in the browser that asked; the token-hash templates (supabase/templates, RUNBOOK) point at
 * /auth/confirm instead and work on any device.
 */
export function callbackUrl(env: ServerEnv, next?: string): string {
  const url = new URL('/auth/callback', env.APP_URL ?? 'http://127.0.0.1:3000');
  if (next && next !== '/app') url.searchParams.set('next', next);
  return url.toString();
}

export const EMAIL_LINK_TYPES = [
  'signup',
  'email',
  'magiclink',
  'recovery',
  'invite',
  'email_change',
] as const satisfies readonly EmailOtpType[];

export function emailLinkType(value: string | null): EmailOtpType | null {
  return (EMAIL_LINK_TYPES as readonly string[]).includes(value ?? '')
    ? (value as EmailOtpType)
    : null;
}

/** Where each kind of link goes once verified, unless a safe `next` says otherwise. */
export function landingFor(type: EmailOtpType | null): string {
  if (type === 'recovery') return '/reset-password/new';
  if (type === 'email_change') return '/app/account';
  return '/app';
}

/** Where a failed link sends someone: the screen that can issue a fresh one. */
export function expiredLandingFor(type: EmailOtpType | null, next: string | null): string {
  if (type === 'recovery' || next?.startsWith('/reset-password')) {
    return '/reset-password?link=expired';
  }
  if (type === 'email_change') return '/app/account?email=link-expired';
  return '/sign-in?link=expired';
}
