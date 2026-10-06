'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { HelpEntry } from '@/lib/content/faq';
import { searchHelp } from '@/lib/help/search';

/**
 * The search box and its answers, shared by the help centre and the help panel.
 *
 * The query is component state only: it is never written to the URL, a cookie or storage,
 * and never sent anywhere, so a question someone types stays on their device.
 */
export function HelpSearch({
  entries,
  /** Shown before anything is typed. Defaults to nothing (the caller renders its own). */
  suggestions = [],
  limit = 20,
  autoFocus,
  label = 'Search the help centre',
}: {
  entries: readonly HelpEntry[];
  suggestions?: readonly HelpEntry[];
  limit?: number;
  autoFocus?: boolean;
  label?: string;
}) {
  const [query, setQuery] = useState('');
  const base = useId();
  const results = useMemo(() => searchHelp(entries, query, limit), [entries, query, limit]);
  const searching = query.trim().length > 1;
  const shown = searching ? results : suggestions;

  return (
    <div className="help-search">
      <form role="search" onSubmit={(event) => event.preventDefault()} className="help-search-box">
        <label htmlFor={`${base}-query`} className="sr-only">
          {label}
        </label>
        <Search size={18} aria-hidden="true" />
        <input
          id={`${base}-query`}
          className="input"
          type="search"
          autoComplete="off"
          spellCheck={false}
          maxLength={120}
          placeholder="Try “delete account” or “CBM”"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-describedby={`${base}-status`}
          autoFocus={autoFocus}
        />
      </form>
      <p
        id={`${base}-status`}
        className="muted help-search-status"
        role="status"
        aria-live="polite"
      >
        {searching
          ? results.length === 0
            ? 'No answer matches that yet. Try other words, or contact us.'
            : `${results.length} ${results.length === 1 ? 'answer' : 'answers'}`
          : ''}
      </p>
      {shown.length > 0 ? (
        <div className="faq help-results">
          {shown.map((entry) => (
            <details key={entry.id} id={`${base}-${entry.id}`}>
              <summary>{entry.q}</summary>
              <p>{entry.a}</p>
              <p className="help-source">
                From{' '}
                <Link className="text-link" href={entry.source.href}>
                  {entry.source.label}
                </Link>
              </p>
            </details>
          ))}
        </div>
      ) : null}
    </div>
  );
}
