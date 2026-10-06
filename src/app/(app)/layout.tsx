import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { safeNextPath } from '@/lib/security/redirect';
import { getUser, isDatabaseConfigured } from '@/lib/supabase/server';

// The session is verified per request; a signed-out caller never reaches a child page.
export const dynamic = 'force-dynamic';

/**
 * Never indexed, whatever the deployment permits at the root. Robots.ts excludes these
 * paths too; a page that carries tenant data should say so itself rather than depend on
 * one file being correct.
 */
export const metadata: Metadata = { robots: { index: false, follow: false, nocache: true } };

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  // A foundation deployment has no database, so the workspace is not part of it. Reporting
  // a missing route is accurate; a server error would suggest something had broken.
  if (!isDatabaseConfigured()) notFound();
  const user = await getUser();
  if (!user) {
    // Back to the page they asked for after signing in; the path holds ids, never personal data.
    const next = safeNextPath((await headers()).get('x-request-path'));
    redirect(next === '/app' ? '/sign-in' : `/sign-in?next=${encodeURIComponent(next)}`);
  }
  return <>{children}</>;
}
