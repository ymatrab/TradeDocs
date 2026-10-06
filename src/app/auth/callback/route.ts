import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeNextPath } from '@/lib/security/redirect';
import { NEXT_COOKIE, expiredLandingFor } from '@/lib/supabase/auth-links';

export const dynamic = 'force-dynamic';

/**
 * Terminates an email-borne flow sent with Supabase's default templates (PKCE): sign-up
 * confirmation, magic link, password reset, email change. The destination passes the
 * signed-in safe-list, so a crafted link cannot turn a valid sign-in into an off-site or
 * unexpected redirect.
 *
 * A link that has expired or was already used arrives with `error_code` (otp_expired) or
 * with a code that no longer exchanges; both land on the screen that can send a new one.
 * A confirmation opened in another browser verifies the address at Supabase but carries no
 * code this browser can exchange; the sign-in screen says so.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const rawNext = url.searchParams.get('next') ?? request.cookies.get(NEXT_COOKIE)?.value ?? null;
  const next = safeNextPath(rawNext);

  let destination = expiredLandingFor(null, rawNext);
  if (code && !url.searchParams.get('error_code')) {
    const client = await createClient();
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) destination = next;
  }
  const response = NextResponse.redirect(new URL(destination, url.origin), 303);
  response.cookies.delete(NEXT_COOKIE);
  return response;
}
