import type { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { NavDisclosure } from '@/components/shell/nav-disclosure';
import { NavSentinel } from '@/components/shell/nav-condense';

/** The header row: the four destinations a buyer looks for, then Sign in and the offer. */
const navigation = [
  { href: '/tools', label: 'Free tools' },
  { href: '/guides', label: 'Guides' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
] as const;

/** The phone menu has the room the header row does not, so it carries support too. */
const mobileNavigation = [
  ...navigation,
  { href: '/help', label: 'Help' },
  { href: '/contact', label: 'Contact' },
] as const;

const footerProduct = [
  { href: '/#how', label: 'How it works' },
  { href: '/#documents', label: 'Documents' },
  { href: '/#checklist', label: 'Export document checklist' },
  { href: '/pricing', label: 'Pricing' },
  // There are no prices yet; this line says so in the words the status band uses.
  { href: '/#status', label: 'Free while early' },
] as const;

const footerResources = [
  { href: '/guides', label: 'Guides' },
  { href: '/blog', label: 'Blog' },
  { href: '/help', label: 'Help' },
  { href: '/contact', label: 'Contact' },
] as const;

const footerLegal = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/cookies', label: 'Cookies' },
] as const;

const footerTools = [
  { href: '/tools/invoice-generator', label: 'Commercial invoice' },
  { href: '/tools/proforma-invoice-generator', label: 'Proforma invoice' },
  { href: '/tools/packing-list-generator', label: 'Packing list' },
  { href: '/tools/cbm-calculator', label: 'CBM calculator' },
  { href: '/tools/chargeable-weight', label: 'Dimensional weight' },
  { href: '/tools/landed-cost-calculator', label: 'Landed cost' },
  { href: '/tools/incoterms', label: 'Incoterms 2020' },
] as const;

/** The boundary statement. Carried verbatim in the header card and the footer. */
export const BOUNDARY_STATEMENT =
  'TradeDocs prepares documents. It is not a customs broker, carrier, chamber or issuing authority.';

/**
 * Where the primary call to action leads. A deployment without a database has no accounts,
 * and a "Create a free account" button that lands on "Accounts aren't open" is a broken
 * promise, so the offer follows the same capability check the auth layout makes.
 */
export function primaryAction(accountsOpen: boolean) {
  return accountsOpen
    ? { href: '/sign-up', label: 'Create a free account', short: 'Get started' }
    : {
        href: '/tools/invoice-generator',
        label: 'Use the free invoice generator',
        short: 'Invoice generator',
      };
}

function Wordmark({ className }: { className?: string }) {
  return (
    <Link href="/" className={['wordmark', className].filter(Boolean).join(' ')}>
      <span className="rule" aria-hidden="true" />
      TradeDocs
    </Link>
  );
}

export function PublicShell({
  children,
  accountsOpen,
  /** Marketing pages lay out their own full-bleed sections. */
  contained = true,
}: {
  children: ReactNode;
  accountsOpen: boolean;
  contained?: boolean;
}) {
  const action = primaryAction(accountsOpen);
  return (
    <div className="site">
      <NavSentinel />
      <header className="public-header">
        <div className="nav-card">
          {/* Part of the header itself, so it can never be scrolled past or collapsed. */}
          <p className="nav-boundary">
            <ShieldAlert size={14} aria-hidden="true" />
            <span>{BOUNDARY_STATEMENT}</span>
          </p>
          <div className="nav-row">
            <Wordmark />
            <nav className="public-nav" aria-label="Primary">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <Link href="/sign-in">Sign in</Link>
              <Link href={action.href} className="btn compact header-cta">
                {action.short}
              </Link>
            </nav>
            {/* A phone has room for one short offer beside the menu. */}
            <div className="nav-compact">
              <Link href={accountsOpen ? action.href : '/tools'} className="btn compact">
                {accountsOpen ? action.short : 'Free tools'}
              </Link>
              <MobileNav action={action} />
            </div>
          </div>
        </div>
      </header>
      <main id="main-content" className={contained ? 'public-main' : undefined}>
        {children}
      </main>
      <footer className="public-footer">
        <div className="footer-grid">
          <div>
            <Wordmark />
            <p className="footer-statement">{BOUNDARY_STATEMENT}</p>
            <p className="footer-note">
              Preparation software. Not legal, customs or compliance advice.
            </p>
            <Link href={action.href} className="btn tape footer-cta">
              {action.label}
            </Link>
          </div>
          <FooterColumn label="Product" links={footerProduct}>
            <Link href="/sign-in">Sign in</Link>
          </FooterColumn>
          <FooterColumn label="Free tools" links={footerTools} />
          <FooterColumn label="Resources" links={footerResources} />
        </div>
        <div className="footer-base">
          <span>© {new Date().getFullYear()} TradeDocs</span>
          <nav className="footer-legal" aria-label="Legal">
            {footerLegal.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <span>Prepared · not issued</span>
        </div>
      </footer>
    </div>
  );
}

function FooterColumn({
  label,
  links,
  children,
}: {
  label: string;
  links: readonly { href: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <nav className="footer-col" aria-label={label}>
      <p className="caption">{label}</p>
      {links.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
      {children}
    </nav>
  );
}

/**
 * Disclosure-based mobile navigation: a native `<details>` cannot desynchronise its
 * expanded state from what is on screen, and `NavDisclosure` adds the one behaviour the
 * element lacks — closing once the visitor has gone somewhere.
 */
export function MobileNav({ action }: { action: ReturnType<typeof primaryAction> }) {
  return (
    <NavDisclosure className="mobile-nav" summary="Menu" label="Primary, mobile">
      {mobileNavigation.map((item) => (
        <Link key={item.href} href={item.href} className="btn quiet">
          {item.label}
        </Link>
      ))}
      <Link href="/sign-in" className="btn quiet">
        Sign in
      </Link>
      <Link href={action.href} className="btn">
        {action.label}
      </Link>
    </NavDisclosure>
  );
}
