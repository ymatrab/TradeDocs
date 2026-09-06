import type { ReactNode } from 'react';
import Link from 'next/link';
import { FileStack, LayoutDashboard, Package, Users } from 'lucide-react';
import { CommandMenu } from '@/components/shell/command-menu';

/**
 * The authenticated shell. Routes are placeholders until the tasks that own
 * them land; the shell exists now so later tasks add pages, not chrome.
 */
const sections = [
  {
    caption: 'Workspace',
    items: [
      { href: '/_design', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/_design', label: 'Shipments', icon: Package },
      { href: '/_design', label: 'Documents', icon: FileStack },
      { href: '/_design', label: 'Directory', icon: Users },
    ],
  },
] as const;

export function AppShell({
  title,
  current = 'Dashboard',
  children,
}: {
  title: string;
  current?: string;
  children: ReactNode;
}) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link href="/" className="wordmark">
          <span className="rule" aria-hidden="true" />
          TradeDocs
        </Link>
        {sections.map((section) => (
          <div key={section.caption}>
            <p className="caption" style={{ marginBottom: 8 }}>
              {section.caption}
            </p>
            <nav aria-label={section.caption}>
              {section.items.map((item) => (
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
        ))}
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
