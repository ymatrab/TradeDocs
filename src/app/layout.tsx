import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
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

export const metadata: Metadata = {
  title: { default: 'TradeDocs', template: '%s · TradeDocs' },
  description:
    'A shipment workspace for reusable company, customer, product, and trade document data.',
  robots: { index: false, follow: false },
};

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
