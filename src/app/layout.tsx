import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
