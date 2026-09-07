import type { ReactNode } from 'react';
import Link from 'next/link';
import { FileStack, LayoutDashboard, LogOut, Package, UserCog, Users } from 'lucide-react';
import { CommandMenu } from '@/components/shell/command-menu';
import { NavDisclosure } from '@/components/shell/nav-disclosure';

type NavItem = { href: string; label: string; icon: typeof Package };

/**
 * The authenticated shell. Workspace links carry the organization in the path, so the
 * tenant a page acts on is never implied by hidden state.
 *
 * The sidebar is a wide-screen affordance, not the navigation itself. Below the
 * breakpoint the same destinations move into a topbar disclosure, because a
 * workspace whose every page is unreachable on a phone is not responsive, it is
 * broken.
 */
export function AppShell({
  title,
  current,
  orgId,
  children,
}: {
  title: string;
  current?: string;
  orgId?: string;
  children: ReactNode;
}) {
  const workspace: NavItem[] = orgId
    ? [
        { href: `/app/${orgId}`, label: 'Overview', icon: LayoutDashboard },
        { href: `/app/${orgId}/shipments`, label: 'Shipments', icon: Package },
        { href: `/app/${orgId}/documents`, label: 'Documents', icon: FileStack },
        { href: `/app/${orgId}/members`, label: 'Members', icon: Users },
      ]
    : [{ href: '/app', label: 'Organizations', icon: LayoutDashboard }];

  const account: NavItem[] = [{ href: '/app/account', label: 'Account', icon: UserCog }];

  const links = (items: readonly NavItem[]) =>
    items.map((item) => (
      <Link
        key={item.label}
        href={item.href}
        aria-current={item.label === current ? 'page' : undefined}
      >
        <item.icon size={17} aria-hidden="true" />
        {item.label}
      </Link>
    ));

  // Leaving is separated from the destinations above it, so it is never the thing
  // a hurried tap lands on.
  const signOut = (
    <form action="/auth/sign-out" method="post" className="nav-signout">
      <button type="submit" className="btn quiet">
        <LogOut size={17} aria-hidden="true" />
        Sign out
      </button>
    </form>
  );

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link href="/app" className="wordmark">
          <span className="rule" aria-hidden="true" />
          TradeDocs
        </Link>
        <div>
          <p className="caption nav-caption">Workspace</p>
          <nav aria-label="Workspace">{links(workspace)}</nav>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <p className="caption nav-caption">Account</p>
          <nav aria-label="Account">{links(account)}</nav>
          {signOut}
        </div>
      </aside>
      <div style={{ minWidth: 0 }}>
        <header className="app-topbar">
          <NavDisclosure className="app-nav" summary="Menu" label="Workspace and account">
            <p className="caption nav-caption">Workspace</p>
            {links(workspace)}
            <p className="caption nav-caption">Account</p>
            {links(account)}
            {signOut}
          </NavDisclosure>
          <h1 className="app-title">{title}</h1>
          <div style={{ marginLeft: 'auto' }}>
            <CommandMenu orgId={orgId} />
          </div>
        </header>
        <main id="main-content" className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}
