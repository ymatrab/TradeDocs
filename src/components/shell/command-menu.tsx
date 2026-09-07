'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Dialog } from '@/components/primitives/dialog';

type Command = { label: string; href: string; keywords?: string };

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
  const [onMac, setOnMac] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  // Read after mount: the server has no way to know which keyboard this is, and
  // rendering the wrong modifier is worse than rendering it a frame late.
  useEffect(() => {
    setOnMac(/mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent));
  }, []);

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
