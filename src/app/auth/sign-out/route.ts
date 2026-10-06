import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * POST only. A sign-out reachable by GET can be triggered by any image or link on a page
 * the user did not choose to visit; a cross-site form post is refused by the origin check.
 *
 * `scope=global` ends every session on every device (Supabase revokes all refresh tokens);
 * the default ends only this one.
 */
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const origin = request.headers.get('origin');
  const site = request.headers.get('sec-fetch-site');
  if ((origin && origin !== url.origin) || (site && site !== 'same-origin' && site !== 'none')) {
    return new NextResponse('This request could not be verified.', { status: 403 });
  }
  const client = await createClient();
  const everywhere = url.searchParams.get('scope') === 'global';
  await client.auth.signOut({ scope: everywhere ? 'global' : 'local' });
  // Relative, so the cleared cookies and the next page stay on the same host.
  return new NextResponse(null, {
    status: 303,
    headers: { Location: everywhere ? '/sign-in?signed-out=everywhere' : '/sign-in' },
  });
}
