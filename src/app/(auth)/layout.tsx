import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isDatabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Never indexed, whatever the deployment permits at the root. Robots.ts excludes these
 * paths too; a page that carries tenant data should say so itself rather than depend on
 * one file being correct.
 */
export const metadata: Metadata = { robots: { index: false, follow: false, nocache: true } };

export default function AuthLayout({ children }: { children: ReactNode }) {
  // There are no accounts to sign in to without a database.
  if (!isDatabaseConfigured()) notFound();
  return (
    <main id="main-content" className="foundation">
      <article>
        <Link href="/" className="wordmark" style={{ marginBottom: 24 }}>
          <span className="rule" aria-hidden="true" />
          TradeDocs
        </Link>
        {children}
      </article>
    </main>
  );
}
