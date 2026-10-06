import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { buildContentSecurityPolicy } from '@/lib/security/headers';
import { getServerEnv } from '@/lib/config/server';
import { isIndexable } from '@/lib/http/base-url';
import { canonicalHostRedirect, robotsHeaderFor } from '@/lib/http/indexing';

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const env = getServerEnv();

  // One canonical host (D-007): once a custom domain is attached, the vercel.app production
  // alias answers with a permanent redirect instead of a duplicate copy of every page.
  const canonical = canonicalHostRedirect({
    requestHost: request.headers.get('host'),
    appUrl: env.APP_URL,
    vercelEnv: env.VERCEL_ENV,
    productionAlias: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
  });
  if (canonical) return NextResponse.redirect(canonical, 308);

  const csp = buildContentSecurityPolicy({
    nonce,
    development: env.APP_ENV === 'local' || env.APP_ENV === 'test',
    supabaseUrl: env.SUPABASE_URL,
  });
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);
  // Lets a layout send a signed-out visitor to sign-in and back to the page they asked for.
  // Set here from the URL, never trusted from the client: any incoming value is overwritten.
  requestHeaders.set('x-request-path', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  // An access token that expires mid-session must be refreshed somewhere that can write
  // cookies. A Server Component cannot, so it happens here or not at all. In foundation
  // mode the configuration resolves to no database and this is skipped entirely.
  //
  // Two cases are left alone. /auth/* establishes the session itself; and a request with no
  // session cookie has nothing to refresh. In both, getUser() would find no session and
  // auth-js would "clean up" by expiring the session and PKCE code-verifier cookies, and that
  // expiry rode on the same response as the session /auth/confirm had just written, so the
  // browser dropped it: a verified reset link reached /reset-password/new signed out.
  const holdsSession = request.cookies
    .getAll()
    .some(({ name }) => /^sb-.+-auth-token(\.\d+)?$/.test(name));
  const establishesSession = request.nextUrl.pathname.startsWith('/auth/');
  if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY && holdsSession && !establishesSession) {
    const client = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(written) {
          for (const { name, value } of written) request.cookies.set(name, value);
          // The page must render with the refreshed pair, not the cookies the browser sent.
          requestHeaders.set('cookie', request.cookies.toString());
          response = NextResponse.next({ request: { headers: requestHeaders } });
          for (const { name, value, options } of written) {
            response.cookies.set(name, value, options);
          }
        },
      },
    });
    // Verified against the auth server; this is what rotates the cookie pair.
    await client.auth.getUser();
  }

  response.headers.set('Content-Security-Policy', csp);
  const robots = robotsHeaderFor({ indexable: isIndexable(), pathname: request.nextUrl.pathname });
  if (robots) response.headers.set('X-Robots-Tag', robots);
  return response;
}

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
