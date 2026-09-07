import type { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import { getUser, isDatabaseConfigured } from '@/lib/supabase/server';

// The session is verified per request; a signed-out caller never reaches a child page.
export const dynamic = 'force-dynamic';

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  // A foundation deployment has no database, so the workspace is not part of it. Reporting
  // a missing route is accurate; a server error would suggest something had broken.
  if (!isDatabaseConfigured()) notFound();
  const user = await getUser();
  if (!user) redirect('/sign-in');
  return <>{children}</>;
}
