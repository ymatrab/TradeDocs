import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isDatabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

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
