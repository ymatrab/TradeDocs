import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { buildContentSecurityPolicy } from '@/lib/security/headers';
import { getServerEnv } from '@/lib/config/server';

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const env = getServerEnv();
  const csp = buildContentSecurityPolicy({
    nonce,
    development: env.APP_ENV === 'local' || env.APP_ENV === 'test',
    supabaseUrl: env.SUPABASE_URL,
  });
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  // An access token that expires mid-session must be refreshed somewhere that can write
  // cookies. A Server Component cannot, so it happens here or not at all. In foundation
  // mode the configuration resolves to no database and this is skipped entirely.
  if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
    const client = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(written) {
          for (const { name, value } of written) request.cookies.set(name, value);
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
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
