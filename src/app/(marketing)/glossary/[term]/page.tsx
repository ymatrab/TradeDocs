import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleToolCta, toolCtaLabel } from '@/components/content/article-view';
import { ContentTable } from '@/components/content/content-table';
import { Callout } from '@/components/primitives/feedback';
import { GlossaryTermJsonLd } from '@/components/seo/json-ld';
import { GLOSSARY, findTerm } from '@/lib/content/glossary';
import { GLOSSARY_DISCLAIMER, isTermListed } from '@/lib/content/glossary-term';
import { resolvePageLinks } from '@/lib/content/page-links';
import { shortDate } from '@/lib/format';
import { findPublicTool } from '@/lib/seo/site';
import { openGraphFor } from '@/lib/seo/social';
import { SourcesBlock, ToolCta } from '../../tools/page-parts';

/** The terms this route answers on. Anything else is a 404, not an empty page. */
export function generateStaticParams() {
  return GLOSSARY.map((entry) => ({ term: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term: slug } = await params;
  const term = findTerm(slug);
  if (!term) return { title: 'Glossary' };
  const path = `/glossary/${term.slug}`;
  return {
    title: term.metaTitle,
    description: term.description,
    alternates: { canonical: path },
    openGraph: openGraphFor(term.metaTitle, term.description, path),
    // A regulated term waits for its review record before it may be indexed.
    ...(isTermListed(term) ? {} : { robots: { index: false, follow: true, nocache: true } }),
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term: slug } = await params;
  const term = findTerm(slug);
  if (!term) notFound();

  const tool = findPublicTool(term.tool);
  const related = resolvePageLinks(term.related);
  const short = term.abbreviation ?? term.term.toLowerCase();

  return (
    <>
      <section className="hero">
        <p className="eyebrow">
          <Link className="text-link" href="/glossary">
            Glossary
          </Link>
        </p>
        <h1>{term.term}</h1>
        <p className="lede">{term.shortDefinition}</p>
        {term.aliases.length > 0 ? (
          <p className="muted">Also: {term.aliases.join(' · ')}</p>
        ) : null}
        <p className="muted">
          TradeDocs team · Published{' '}
          <time dateTime={term.published}>{shortDate(term.published)}</time> · Last reviewed{' '}
          <time dateTime={term.reviewed}>{shortDate(term.reviewed)}</time>
        </p>
        {tool ? <ArticleToolCta tool={tool} /> : null}
      </section>

      <article className="section">
        <h2>What does {short} mean?</h2>
        {term.definition.map((paragraph) => (
          <p key={paragraph} className="measure">
            {paragraph}
          </p>
        ))}

        <h2>Where {short} appears on your documents</h2>
        {term.onYourDocuments.map((paragraph) => (
          <p key={paragraph} className="measure">
            {paragraph}
          </p>
        ))}
        {tool ? (
          <Callout title={tool.name}>
            {term.toolPitch}{' '}
            <Link className="text-link" href={tool.path}>
              {toolCtaLabel(tool)}
            </Link>
          </Callout>
        ) : null}

        <h2>Example</h2>
        <p className="muted measure">{term.example.caption}</p>
        {term.example.paragraphs.map((paragraph) => (
          <p key={paragraph} className="measure">
            {paragraph}
          </p>
        ))}
        {term.example.table ? <ContentTable table={term.example.table} /> : null}

        {term.confusedWith && term.confusedWith.length > 0 ? (
          <>
            <h2>Not to be confused with</h2>
            <dl className="record-list measure">
              {term.confusedWith.map((entry) => (
                <div key={entry.term}>
                  <dt className="caption">{entry.term}</dt>
                  <dd>{entry.difference}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}
      </article>

      <section className="section" aria-labelledby="faq-title">
        <h2 id="faq-title">Questions people ask</h2>
        <div className="faq">
          {term.faq.map((entry) => (
            <details key={entry.q}>
              <summary>{entry.q}</summary>
              <p>{entry.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <Callout tone="legal" title="What this page is">
          {GLOSSARY_DISCLAIMER}
        </Callout>
      </section>

      <SourcesBlock ids={term.sources} />

      <section className="section">
        <h2>One record, every document</h2>
        <p className="measure">
          Terms like this one turn up across the invoice, the packing list and the transport
          documents, and they only agree if they come from the same figures. TradeDocs keeps a
          shipment’s parties, goods and packages once and prepares each document from that record.
        </p>
        <ToolCta secondary={{ href: '/glossary', label: 'All glossary terms' }} />
      </section>

      {related.length > 0 ? (
        <section className="section" aria-labelledby="related-title">
          <h2 id="related-title">Related</h2>
          <div className="form-grid">
            {related.map((link) => (
              <Link key={link.href} href={link.href} className="form-cell">
                <h3>{link.title}</h3>
                <p>{link.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <GlossaryTermJsonLd slug={term.slug} />
    </>
  );
}
