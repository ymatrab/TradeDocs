import type { ReactNode } from 'react';
import Link from 'next/link';
import { LinkButton } from '@/components/primitives/button';
import { primaryAction } from '@/components/shell/public';
import { shortDate } from '@/lib/format';
import { isDatabaseConfigured } from '@/lib/supabase/server';
import { lastReviewed, sourcesFor, type SourceId, type SourceRecord } from '@/lib/trade/sources';

function detailOf(record: SourceRecord): string {
  return `${record.authority}. Cited for ${record.supports}. ${record.jurisdiction}. Retrieved ${shortDate(record.retrieved)}; ${record.reviewer}.`;
}

/**
 * The sources a tool page rests on, with the date they were last checked.
 *
 * Read from the one registry in lib/trade/sources so a review updates every page at once.
 * The reviewer line is shown as it stands: "pending owner review" is not an approval.
 */
export function SourcesBlock({ ids }: { ids: readonly SourceId[] }) {
  const records = sourcesFor(ids);
  return (
    <section className="section" aria-labelledby="sources-title">
      <h2 id="sources-title">Sources · Last reviewed {shortDate(lastReviewed(records))}</h2>
      <ul className="measure">
        {records.map((record) => (
          <li key={record.id}>
            <a className="text-link" href={record.url} rel="noopener">
              {record.title}
            </a>{' '}
            — {detailOf(record)}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The closing offer on a tool page.
 *
 * Follows the live capability, as the home page does: where accounts are not open the
 * button would land on "Accounts aren't open", so it offers the invoice generator instead —
 * and on the invoice generator itself, which is already that offer, only the secondary link.
 */
export function ToolCta({
  secondary,
  current,
}: {
  secondary: { href: string; label: ReactNode };
  current?: string;
}) {
  const accountsOpen = isDatabaseConfigured();
  const action = primaryAction(accountsOpen);
  const showPrimary = action.href !== current;

  return (
    <div className="cta-row">
      {showPrimary ? <LinkButton href={action.href}>{action.label}</LinkButton> : null}
      <Link className="text-link" href={secondary.href}>
        {secondary.label}
      </Link>
      {accountsOpen ? null : (
        <span className="muted">Accounts are not open on this deployment yet.</span>
      )}
    </div>
  );
}
