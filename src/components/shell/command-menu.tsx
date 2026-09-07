'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Dialog } from '@/components/primitives/dialog';

const commands = [
  'Create shipment',
  'Find document by reference',
  'Open directory',
  'Review stale documents',
] as const;

/**
 * Search and command share one surface, reached by pointer or by the shortcut.
 * The trigger states the shortcut so it is discoverable without documentation.
 */
export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

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

  const matches = commands.filter((command) =>
    command.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Search shipments and documents"
      >
        <Search size={15} aria-hidden="true" />
        <span className="search-trigger-label">Search shipments and documents</span>
        <kbd>Ctrl K</kbd>
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
            className="input"
            value={query}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <ul className="command-list" style={{ marginTop: 12 }}>
          {matches.length === 0 ? (
            <li className="muted" style={{ padding: 12 }}>
              No command matches “{query}”. Try a shipment reference instead.
            </li>
          ) : (
            matches.map((command) => (
              <li key={command}>
                <button type="button" onClick={() => setOpen(false)}>
                  {command}
                </button>
              </li>
            ))
          )}
        </ul>
      </Dialog>
    </>
  );
}
