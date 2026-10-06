import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeNextPath } from '@/lib/security/redirect';
import {
  NEXT_COOKIE,
  emailLinkType,
  expiredLandingFor,
  landingFor,
} from '@/lib/supabase/auth-links';

export const dynamic = 'force-dynamic';

/**
 * Terminates an email-borne flow sent with the token-hash templates in supabase/templates
 * (`{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=...`). Unlike the PKCE
 * callback this works on any device: the hash itself is the single-use credential, verified
 * here on the server, and the session cookies are written on the redirect.
 *
 * GET because that is what an email client opens. Supabase consumes the hash on first use,
 * so a replay, or a link prefetched by a mail scanner, lands on the "expired" screen.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get('token_hash');
  const type = emailLinkType(url.searchParams.get('type'));
  const rawNext = url.searchParams.get('next') ?? request.cookies.get(NEXT_COOKIE)?.value ?? null;

  let destination = expiredLandingFor(type, rawNext);
  if (tokenHash && tokenHash.length <= 512 && type) {
    const client = await createClient();
    const { error } = await client.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      // A reset always lands on the new-password form, whatever `next` says.
      destination =
        type === 'recovery' ? landingFor(type) : safeNextPath(rawNext, landingFor(type));
      if (type === 'email_change') destination = '/app/account?email=changed';
    }
  }
  const response = NextResponse.redirect(new URL(destination, url.origin), 303);
  response.cookies.delete(NEXT_COOKIE);
  return response;
}
