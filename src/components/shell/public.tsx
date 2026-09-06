import type { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

const navigation = [
  { href: '/', label: 'Overview' },
  { href: '/_design', label: 'Design system' },
] as const;

function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" className={['wordmark', className].filter(Boolean).join(' ')}>
      <span className="rule" aria-hidden="true" />
      TradeDocs
    </Link>
  );
}

/**
 * Every public surface carries the boundary statement. TradeDocs prepares
 * documents; it does not issue, endorse or clear them, and the interface says
 * so before a visitor reads anything else.
 */
export function DisclosureBar() {
  return (
    <div className="disclosure-bar">
      <div className="bar-inner">
        <ShieldAlert size={15} aria-hidden="true" />
        <span>
          TradeDocs prepares documents. It is not a customs broker, carrier, chamber or issuing
          authority.
        </span>
      </div>
    </div>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="public-header">
        <DisclosureBar />
        <div className="bar-inner">
          <Wordmark />
          <nav className="public-nav" aria-label="Primary">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <MobileNav />
        </div>
      </header>
      <main id="main-content" className="public-main">
        {children}
      </main>
      <footer className="public-footer">
        <div className="bar-inner">
          <span>© {new Date().getFullYear()} TradeDocs</span>
          <span className="muted" style={{ marginLeft: 'auto' }}>
            Preparation software. Not legal, customs or compliance advice.
          </span>
        </div>
      </footer>
    </>
  );
}

/**
 * Disclosure-based mobile navigation: a native `<details>` needs no script and
 * cannot desynchronise its expanded state from what is on screen.
 */
export function MobileNav() {
  return (
    <details className="mobile-nav" style={{ marginLeft: 'auto' }}>
      <summary className="btn secondary compact">Menu</summary>
      <nav aria-label="Primary, mobile" style={{ paddingTop: 8, display: 'grid', gap: 4 }}>
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} className="btn quiet compact">
            {item.label}
          </Link>
        ))}
      </nav>
    </details>
  );
}
