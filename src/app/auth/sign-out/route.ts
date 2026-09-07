import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * POST only. A sign-out reachable by GET can be triggered by any image or link on a page
 * the user did not choose to visit.
 */
export async function POST(request: NextRequest) {
  const client = await createClient();
  const everywhere = new URL(request.url).searchParams.get('scope') === 'global';
  await client.auth.signOut({ scope: everywhere ? 'global' : 'local' });
  return NextResponse.redirect(new URL('/sign-in', new URL(request.url).origin), 303);
}
