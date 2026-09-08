import type { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { NavDisclosure } from '@/components/shell/nav-disclosure';

const navigation = [
  { href: '/#how', label: 'How it works' },
  { href: '/tools', label: 'Free tools' },
  { href: '/#pricing', label: 'Pricing' },
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
 * Every public surface carries the boundary statement. TradeDocs prepares documents; it
 * does not issue, endorse or clear them, and the site says so before it says anything else.
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

export function PublicShell({
  children,
  /** Marketing pages lay out their own full-bleed sections. */
  contained = true,
}: {
  children: ReactNode;
  contained?: boolean;
}) {
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
            <Link href="/sign-in">Sign in</Link>
            <Link href="/sign-up" className="btn compact header-cta">
              Get started
            </Link>
          </nav>
          <MobileNav />
        </div>
      </header>
      <main id="main-content" className={contained ? 'public-main' : undefined}>
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
 * Disclosure-based mobile navigation: a native `<details>` cannot desynchronise its
 * expanded state from what is on screen, and `NavDisclosure` adds the one behaviour
 * the element lacks — closing once the visitor has gone somewhere.
 */
export function MobileNav() {
  return (
    <NavDisclosure className="mobile-nav" summary="Menu" label="Primary, mobile">
      {navigation.map((item) => (
        <Link key={item.href} href={item.href} className="btn quiet">
          {item.label}
        </Link>
      ))}
      <Link href="/sign-in" className="btn quiet">
        Sign in
      </Link>
      <Link href="/sign-up" className="btn">
        Get started
      </Link>
    </NavDisclosure>
  );
}
