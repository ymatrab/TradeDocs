import type { ReactNode } from 'react';
import Link from 'next/link';
import { FileStack, LayoutDashboard, LogOut, Package, UserCog, Users } from 'lucide-react';
import { CommandMenu } from '@/components/shell/command-menu';

/**
 * The authenticated shell. Workspace links carry the organization in the path, so the
 * tenant a page acts on is never implied by hidden state.
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
  const workspace = orgId
    ? [
        { href: `/app/${orgId}`, label: 'Overview', icon: LayoutDashboard },
        { href: `/app/${orgId}/shipments`, label: 'Shipments', icon: Package },
        { href: `/app/${orgId}/documents`, label: 'Documents', icon: FileStack },
        { href: `/app/${orgId}/members`, label: 'Members', icon: Users },
      ]
    : [{ href: '/app', label: 'Organizations', icon: LayoutDashboard }];

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link href="/app" className="wordmark">
          <span className="rule" aria-hidden="true" />
          TradeDocs
        </Link>
        <div>
          <p className="caption" style={{ marginBottom: 8 }}>
            Workspace
          </p>
          <nav aria-label="Workspace">
            {workspace.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={item.label === current ? 'page' : undefined}
              >
                <item.icon size={17} aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <p className="caption" style={{ marginBottom: 8 }}>
            Account
          </p>
          <nav aria-label="Account">
            <Link href="/app/account" aria-current={current === 'Account' ? 'page' : undefined}>
              <UserCog size={17} aria-hidden="true" />
              Account
            </Link>
          </nav>
          <form action="/auth/sign-out" method="post" style={{ marginTop: 4 }}>
            <button
              type="submit"
              className="btn quiet compact"
              style={{ color: 'inherit', width: '100%', justifyContent: 'flex-start', gap: 12 }}
            >
              <LogOut size={17} aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div style={{ minWidth: 0 }}>
        <header className="app-topbar">
          <h1 style={{ fontSize: 17, margin: 0, letterSpacing: '-0.02em' }}>{title}</h1>
          <div style={{ marginLeft: 'auto' }}>
            <CommandMenu />
          </div>
        </header>
        <main id="main-content" className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}
