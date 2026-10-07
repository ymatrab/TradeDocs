import type { Metadata } from 'next';
import Link from 'next/link';
import { HelpSearch } from '@/components/help/help-search';
import { GlossaryHubJsonLd } from '@/components/seo/json-ld';
import type { HelpEntry } from '@/lib/content/faq';
import { GLOSSARY_HUB, GLOSSARY_HUB_ENTRIES, LISTED_GLOSSARY } from '@/lib/content/glossary';
import { GLOSSARY_DISCLAIMER } from '@/lib/content/glossary-term';
import { PUBLIC_TOOLS } from '@/lib/seo/site';
import { openGraphFor } from '@/lib/seo/social';

export const metadata: Metadata = {
  title: GLOSSARY_HUB.metaTitle,
  description: GLOSSARY_HUB.description,
  alternates: { canonical: '/glossary' },
  openGraph: openGraphFor(GLOSSARY_HUB.title, GLOSSARY_HUB.description, '/glossary'),
};

type HubRow = {
  id: string;
  term: string;
  aliases: readonly string[];
  definition: string;
  href: string;
  /** True when the term has its own page here; false when a guide or tool owns it. */
  ownPage: boolean;
};

function rows(): HubRow[] {
  const pages: HubRow[] = LISTED_GLOSSARY.map((term) => ({
    id: `term-${term.slug}`,
    term: term.term,
    aliases: term.aliases,
    definition: term.shortDefinition,
    href: `/glossary/${term.slug}`,
    ownPage: true,
  }));
  const owned: HubRow[] = GLOSSARY_HUB_ENTRIES.map((entry) => ({
    id: `entry-${entry.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    term: entry.term,
    aliases: entry.aliases ?? [],
    definition: entry.definition,
    href: entry.href,
    ownPage: false,
  }));
  return [...pages, ...owned].sort((a, b) => a.term.localeCompare(b.term, 'en'));
}

function byLetter(list: readonly HubRow[]) {
  const groups = new Map<string, HubRow[]>();
  for (const row of list) {
    const letter = row.term.charAt(0).toUpperCase();
    groups.set(letter, [...(groups.get(letter) ?? []), row]);
  }
  return [...groups.entries()].map(([letter, entries]) => ({ letter, entries }));
}

export default function GlossaryPage() {
  const list = rows();
  const groups = byLetter(list);
  // The search runs over the same rows the page lists, in the browser.
  const searchable: HelpEntry[] = list.map((row) => ({
    id: row.id,
    q: row.term,
    a: row.definition,
    source: { href: row.href, label: row.term },
    keywords: row.aliases.join(' '),
  }));

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Glossary</p>
        <h1>{GLOSSARY_HUB.title}</h1>
        <p className="lede">{GLOSSARY_HUB.lede}</p>
      </section>

      <section className="section" aria-label="Search the glossary">
        <HelpSearch
          entries={searchable}
          label="Search the glossary"
          placeholder="Try “TEU” or “consignor”"
          emptyMessage="No term matches that yet. Try other words, or browse the list below."
          noun={['term', 'terms']}
        />
      </section>

      <section className="section" aria-labelledby="az-title">
        <h2 id="az-title">A–Z</h2>
        <nav aria-label="Glossary letters" className="cta-row">
          {groups.map((group) => (
            <a key={group.letter} className="text-link" href={`#letter-${group.letter}`}>
              {group.letter}
            </a>
          ))}
        </nav>
      </section>

      {groups.map((group) => (
        <section
          key={group.letter}
          className="section"
          id={`letter-${group.letter}`}
          aria-labelledby={`letter-${group.letter}-title`}
        >
          <h2 id={`letter-${group.letter}-title`}>{group.letter}</h2>
          <dl className="record-list measure">
            {group.entries.map((row) => (
              <div key={row.id} id={row.id}>
                <dt>
                  <Link className="text-link" href={row.href}>
                    {row.term}
                  </Link>
                  {row.aliases.length > 0 ? (
                    <span className="muted"> · {row.aliases.join(' · ')}</span>
                  ) : null}
                </dt>
                <dd>
                  {row.definition}{' '}
                  {row.ownPage ? null : (
                    <span className="muted">Explained in full on the linked page.</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}

      <section className="section">
        <h2>Free tools for these terms</h2>
        <p className="measure">
          Most of these words end up as a figure or a box on a document. The {PUBLIC_TOOLS.length}{' '}
          free tools work them out or fill them in, without an account.
        </p>
        <p className="measure">
          <Link className="text-link" href="/tools">
            See the free tools
          </Link>{' '}
          ·{' '}
          <Link className="text-link" href="/guides">
            The guides
          </Link>{' '}
          ·{' '}
          <Link className="text-link" href="/export-documents">
            Export documents by country
          </Link>
        </p>
        <p className="muted measure">{GLOSSARY_DISCLAIMER}</p>
      </section>
      <GlossaryHubJsonLd />
    </>
  );
}
