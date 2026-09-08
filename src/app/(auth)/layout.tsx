import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { isDatabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Never indexed, whatever the deployment permits at the root. Robots.ts excludes these
 * paths too; a page that carries tenant data should say so itself rather than depend on
 * one file being correct.
 */
export const metadata: Metadata = { robots: { index: false, follow: false, nocache: true } };

/**
 * A deployment without a database has no accounts to sign in to. It used to report that
 * as a missing route, which is accurate about the route and wrong about the situation:
 * ten "Create a free account" buttons across the marketing pages point here, so every one
 * of them dead-ended at "This page isn't here" — a broken link, as far as a visitor can
 * tell. The route now answers honestly instead, and the workspace keeps its 404 because
 * nothing public links to it.
 */
function AccountsClosed() {
  return (
    <>
      <p className="eyebrow" style={{ marginBottom: 8 }}>
        Not open yet
      </p>
      <h1 style={{ marginBottom: 12 }}>Accounts aren’t open.</h1>
      <p className="lede" style={{ marginBottom: 24 }}>
        TradeDocs is deployed here without its workspace, so there is nothing to sign in to
        yet. The calculators and the document generator work now and need no account.
      </p>
      <div className="cta-row" style={{ marginTop: 0 }}>
        <Link className="btn" href="/tools">
          Use the free tools
        </Link>
        <Link className="text-link" href="/">
          Back to the overview
        </Link>
      </div>
    </>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const open = isDatabaseConfigured();
  return (
    <main id="main-content" className="foundation">
      <article>
        <Link href="/" className="wordmark" style={{ marginBottom: 24 }}>
          <span className="rule" aria-hidden="true" />
          TradeDocs
        </Link>
        {open ? children : <AccountsClosed />}
      </article>
    </main>
  );
}
