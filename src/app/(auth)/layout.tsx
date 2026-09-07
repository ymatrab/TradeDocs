import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
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
