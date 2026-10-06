import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpSearch } from '@/components/help/help-search';
import { helpEntries, type HelpEntry } from '@/lib/content/faq';
import { openGraphFor } from '@/lib/seo/social';

export const metadata: Metadata = {
  title: 'Help centre — answers about TradeDocs, its documents and tools',
  description:
    'Search every answer on TradeDocs in one place: accounts, documents, the free generators and calculators, Incoterms and shipping guides.',
  alternates: { canonical: '/help' },
  openGraph: openGraphFor(
    'TradeDocs help centre',
    'Search every answer on TradeDocs: accounts, documents, free tools, Incoterms and guides.',
    '/help',
  ),
};

/** Entries in the order they are built, grouped under the page each comes from. */
function bySource(entries: readonly HelpEntry[]) {
  const groups = new Map<string, { label: string; href: string; entries: HelpEntry[] }>();
  for (const entry of entries) {
    const group = groups.get(entry.source.href) ?? { ...entry.source, entries: [] };
    group.entries.push(entry);
    groups.set(entry.source.href, group);
  }
  return [...groups.values()];
}

export default function HelpPage() {
  const entries = helpEntries();
  const groups = bySource(entries);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Help centre</p>
        <h1>Answers, in one place</h1>
        <p className="lede">
          Every question answered across TradeDocs — accounts, documents, the free tools, Incoterms®
          and the guides — searchable from here. The search runs in your browser.
        </p>
      </section>

      <section className="section" aria-label="Search">
        <HelpSearch entries={entries} label="Search every answer" />
      </section>

      {groups.map((group) => (
        <section
          className="section"
          key={group.href}
          aria-labelledby={`help-${group.entries[0]?.id}`}
        >
          <h2 id={`help-${group.entries[0]?.id}`}>
            {group.href === '/help' ? (
              group.label
            ) : (
              <Link className="text-link" href={group.href}>
                {group.label}
              </Link>
            )}
          </h2>
          <div className="faq">
            {group.entries.map((entry) => (
              <details key={entry.id} id={entry.id}>
                <summary>{entry.q}</summary>
                <p>{entry.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      <section className="section sunken" aria-labelledby="help-contact">
        <h2 id="help-contact">Still stuck? Contact us</h2>
        <p className="measure">
          If none of these answers it, send a message and a person will reply to the address you
          give.
        </p>
        <div className="cta-row">
          <Link className="btn" href="/contact">
            Contact us
          </Link>
          <Link className="text-link" href="/tools">
            Browse the free tools
          </Link>
        </div>
      </section>
    </>
  );
}
