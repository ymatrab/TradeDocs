import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeReturnPath } from '@/lib/security/redirect';

export const dynamic = 'force-dynamic';

/**
 * Terminates every email-borne flow: confirmation, magic link and password reset. The
 * destination is passed through the same-origin path filter so a crafted link cannot turn
 * a valid sign-in into an off-site redirect.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = safeReturnPath(url.searchParams.get('next'), '/app');

  if (code) {
    const client = await createClient();
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin), 303);
  }
  return NextResponse.redirect(new URL('/sign-in?link=expired', url.origin), 303);
}
