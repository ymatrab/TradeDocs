import { NextResponse, type NextRequest } from 'next/server';
import { createRouteClient } from '@/lib/supabase/route';
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
  const { client, bind } = createRouteClient(request);
  if (tokenHash && tokenHash.length <= 512 && type) {
    const { data, error } = await client.auth.verifyOtp({ type, token_hash: tokenHash });
    // A recovery link signs in with the PASSWORD_RECOVERY event, which @supabase/ssr does
    // not reliably flush to cookies. Setting the session again emits SIGNED_IN, which it does.
    const persisted =
      !error && data.session
        ? await client.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          })
        : null;
    if (!error && data.session && !persisted?.error) {
      // A reset always lands on the new-password form, whatever `next` says.
      destination =
        type === 'recovery' ? landingFor(type) : safeNextPath(rawNext, landingFor(type));
      if (type === 'email_change') destination = '/app/account?email=changed';
    }
  }
  // The session cookies ride on this redirect, so the next page request carries them.
  // A relative Location keeps the browser on the host it is already on. Building it from
  // request.url can name a different host (localhost for 127.0.0.1 behind the dev server or a
  // proxy), and the session cookies set for this host would then not travel with the redirect.
  const response = bind(
    new NextResponse(null, { status: 303, headers: { Location: destination } }),
  );
  response.cookies.delete(NEXT_COOKIE);
  return response;
}
