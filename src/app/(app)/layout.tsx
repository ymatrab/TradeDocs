import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';

// The session is verified per request; a signed-out caller never reaches a child page.
export const dynamic = 'force-dynamic';

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  if (!user) redirect('/sign-in');
  return <>{children}</>;
}
