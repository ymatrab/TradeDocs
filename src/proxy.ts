import { NextResponse, type NextRequest } from 'next/server';
import { buildContentSecurityPolicy } from '@/lib/security/headers';

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildContentSecurityPolicy({
    nonce,
    development: process.env.APP_ENV === 'local' || process.env.APP_ENV === 'test',
  });
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = {
  matcher: ['/((?!api/|_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
