import type { Metadata } from 'next';
import { Archivo, Inter, JetBrains_Mono } from 'next/font/google';
import { getPublicBaseUrl, isIndexable } from '@/lib/http/base-url';
import './globals.css';

/**
 * Three faces, each with a job, all self-hosted at build time so a real typeface costs no
 * layout shift.
 *
 * Archivo carries the headlines at heavy weights — a sturdy grotesque that reads as
 * industrial rather than startup. Inter sets the running text, because dense trade data
 * needs a face drawn for screens. JetBrains Mono takes every code and figure: an HS code,
 * a container number and a document number are strings a reader compares character by
 * character, and a proportional face makes that harder than it needs to be.
 *
 * The previous setup loaded Archivo and then set every word in Arial, which is why the
 * product looked dated regardless of anything else on the page.
 */
const display = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-text',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-code',
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
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
