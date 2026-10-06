import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Every request is verified against the auth server and the allowlist; nothing is cached.
export const dynamic = 'force-dynamic';

/**
 * Never indexed and never listed: not in the sitemap, llms.txt or robots.txt (listing it
 * there would advertise it). The proxy adds X-Robots-Tag for the path as well.
 *
 * Deliberately no access check here: layouts render in parallel with their pages, so each
 * page and action calls adminContext() itself before it reads anything.
 */
export const metadata: Metadata = {
  title: 'Platform admin',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
