import type { Metadata } from 'next';
import { Geist_Mono, Inter, Inter_Tight } from 'next/font/google';
import { getPublicBaseUrl, isIndexable } from '@/lib/http/base-url';
import { SITE_NAME } from '@/lib/seo/site';
import { SHARE_IMAGE, openGraphFor } from '@/lib/seo/social';
import './globals.css';

/**
 * Three faces, each with a job, all self-hosted at build time so a real typeface costs no
 * layout shift (`adjustFontFallback` is next/font's default and sizes the fallback to match).
 *
 * Inter Tight carries the headlines at 500–600 with negative tracking: Inter's own skeleton,
 * so headline and running text read as one family, drawn tight enough for display sizes.
 * Inter sets the running text, because dense trade data needs a face drawn for screens.
 * Geist Mono takes every code, label and figure: an HS code, a container number and a
 * document number are strings a reader compares character by character. It is narrower than
 * the JetBrains Mono it replaces, so a plate or a button label takes less width.
 *
 * The PDFs embed their own font (src/lib/pdf/fonts) and are unaffected by anything here.
 */
const display = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-text',
});

const mono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-code',
});

// Per-request CSP nonces must never be cached in a static HTML artifact.
export const dynamic = 'force-dynamic';

const DEFAULT_DESCRIPTION =
  'Enter a shipment once and prepare a commercial invoice, proforma invoice, packing list and delivery note that carry the same figures.';

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
    title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
    description: DEFAULT_DESCRIPTION,
    applicationName: SITE_NAME,
    openGraph: openGraphFor(SITE_NAME, DEFAULT_DESCRIPTION),
    twitter: { card: 'summary_large_image', images: [SHARE_IMAGE.url] },
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
