'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Dialog } from '@/components/primitives/dialog';

type Command = { label: string; href: string; keywords?: string };

/**
 * Which modifier this keyboard actually carries. The platform cannot change
 * while the page is open, so there is nothing to subscribe to; the value is read
 * once on the client and defaults to the non-Apple spelling on the server, which
 * has no way to know. Reading it through a store rather than an effect keeps the
 * first paint honest without a second render pass.
 */
const APPLE_KEYBOARD = /mac|iphone|ipad/i;
const neverChanges = () => () => {};
const readsAsApple = () => APPLE_KEYBOARD.test(navigator.platform || navigator.userAgent);
const unknownOnServer = () => false;

/**
 * Search and command share one surface, reached by pointer or by the shortcut.
 * The trigger states the shortcut so it is discoverable without documentation.
 *
 * Every entry is a real destination. A palette that lists capabilities the
 * product does not have yet is worse than a short palette.
 */
export function CommandMenu({ orgId }: { orgId?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const onMac = useSyncExternalStore(neverChanges, readsAsApple, unknownOnServer);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  const commands = useMemo<readonly Command[]>(
    () => [
      ...(orgId
        ? [
            { label: 'Overview', href: `/app/${orgId}`, keywords: 'dashboard summary' },
            { label: 'Shipments', href: `/app/${orgId}/shipments`, keywords: 'goods lines' },
            {
              label: 'Documents',
              href: `/app/${orgId}/documents`,
              keywords: 'invoice packing list certificate pdf',
            },
            {
              label: 'Products',
              href: `/app/${orgId}/products`,
              keywords: 'catalog goods sku hs code price',
            },
            { label: 'Add a product', href: `/app/${orgId}/products/new`, keywords: 'new catalog' },
            {
              label: 'Import catalog',
              href: `/app/${orgId}/products/import`,
              keywords: 'csv spreadsheet upload bulk',
            },
            {
              label: 'Companies',
              href: `/app/${orgId}/companies`,
              keywords: 'customers suppliers parties consignee exporter addresses',
            },
            {
              label: 'Add a company',
              href: `/app/${orgId}/companies/new`,
              keywords: 'new customer supplier party',
            },
            { label: 'Members', href: `/app/${orgId}/members`, keywords: 'people roles invite' },
          ]
        : []),
      { label: 'Organizations', href: '/app', keywords: 'workspaces switch' },
      { label: 'Account', href: '/app/account', keywords: 'profile password deletion' },
    ],
    [orgId],
  );

  const term = query.trim().toLowerCase();
  const matches = commands.filter((command) =>
    `${command.label} ${command.keywords ?? ''}`.toLowerCase().includes(term),
  );

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Search and commands"
      >
        <Search size={15} aria-hidden="true" />
        <span className="search-trigger-label">Search and commands</span>
        <kbd>{onMac ? '⌘ K' : 'Ctrl K'}</kbd>
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Search and commands"
        description="Type to filter. Press Escape to close."
      >
        <div className="field">
          <label htmlFor="command-query">What do you need?</label>
          <input
            id="command-query"
            ref={input}
            className="input"
            value={query}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {/* The count changes as the list filters, and a filtered list nobody can
            see is a list nobody can use. */}
        <p className="sr-only" role="status" aria-live="polite">
          {matches.length === 1 ? '1 result' : `${matches.length} results`}
        </p>
        <ul className="command-list">
          {matches.length === 0 ? (
            <li className="muted" style={{ padding: 12 }}>
              Nothing here matches “{query}”.
            </li>
          ) : (
            matches.map((command) => (
              <li key={command.href}>
                <Link href={command.href} onClick={() => setOpen(false)}>
                  {command.label}
                </Link>
              </li>
            ))
          )}
        </ul>
      </Dialog>
    </>
  );
}
