import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import { getPublicBaseUrl, isIndexable } from '@/lib/http/base-url';
import './globals.css';

// Self-hosted at build time with a size-matched fallback, so a real typeface costs no
// layout shift. Archivo is a sturdy grotesque: it reads as industrial rather than startup,
// and its tabular figures keep quantities and totals aligned.
const display = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

// Per-request CSP nonces must never be cached in a static HTML artifact.
export const dynamic = 'force-dynamic';

/**
 * Indexing is decided per deployment, not hard-coded.
 *
 * A blanket noindex here is right for a preview, a staging environment and the closed
 * foundation build, and wrong for the production service, whose public pages exist to be
 * found. `metadataBase` resolves the relative canonicals the marketing pages declare;
 * without it they would silently resolve against the wrong host.
 *
 * Individual private routes do not rely on this. The workspace is behind authentication
 * and is excluded in robots.ts regardless of what this returns.
 */
export function generateMetadata(): Metadata {
  const indexable = isIndexable();
  return {
    metadataBase: new URL(getPublicBaseUrl()),
    title: { default: 'TradeDocs', template: '%s · TradeDocs' },
    description:
      'A shipment workspace for reusable company, customer, product, and trade document data.',
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={display.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
