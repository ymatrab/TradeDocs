import type { ReactNode } from 'react';
import Link from 'next/link';
import { Building2, Inbox, LayoutDashboard, LogOut, ScrollText, Users } from 'lucide-react';
import { ErrorState } from '@/components/primitives/feedback';

const navigation = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/organizations', label: 'Organizations', icon: Building2 },
  { href: '/admin/messages', label: 'Messages', icon: Inbox },
  { href: '/admin/audit', label: 'Audit log', icon: ScrollText },
] as const;

export type AdminSection = (typeof navigation)[number]['label'];

/**
 * The platform admin shell. It reuses the workspace shell's layout classes so the panel
 * reads as part of the same product, and says on every page that it is the operator view.
 */
export function AdminShell({
  title,
  current,
  adminEmail,
  children,
}: {
  title: string;
  current: AdminSection;
  adminEmail: string;
  children: ReactNode;
}) {
  const links = navigation.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={item.label === current ? 'page' : undefined}
    >
      <item.icon size={17} aria-hidden="true" />
      {item.label}
    </Link>
  ));
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link href="/admin" className="wordmark">
          <span className="rule" aria-hidden="true" />
          TradeDocs
        </Link>
        <div>
          <p className="caption nav-caption">Platform admin</p>
          <nav aria-label="Platform admin">{links}</nav>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <p className="caption nav-caption">Signed in as</p>
          <p className="muted admin-identity">{adminEmail}</p>
          <form action="/auth/sign-out" method="post" className="nav-signout">
            <button type="submit" className="btn quiet">
              <LogOut size={17} aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div style={{ minWidth: 0 }}>
        <header className="app-topbar">
          <nav className="admin-topnav" aria-label="Platform admin, compact">
            {links}
          </nav>
          <div className="app-heading">
            <p className="caption">Platform admin · {current}</p>
            <h1 className="app-title">{title}</h1>
          </div>
        </header>
        <main id="main-content" className="app-main">
          {children}
        </main>
      </div>
    </div>
  );
}

/** Shown when the deployment has no database or no service-role key (fails closed). */
export function AdminUnavailable() {
  return (
    <main id="main-content" className="foundation">
      <article>
        <ErrorState
          title="Admin needs the production database"
          description="This deployment has no database connection with the service-role key, so there is nothing the admin panel can read. Configure SUPABASE_SERVICE_ROLE_KEY on the production service; previews never get one (D-011)."
        />
      </article>
    </main>
  );
}

/** An admin page whose audit record could not be written shows nothing else. */
export function AdminAuditRefused({ cause }: { cause: string }) {
  return (
    <ErrorState
      title="Not shown: the audit record failed"
      description={`Every admin view is recorded before it is shown, and this one could not be. Cause: ${cause}`}
    />
  );
}
