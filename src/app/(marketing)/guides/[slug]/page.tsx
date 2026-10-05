import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Callout } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { CoverFigure } from '@/components/content/cover-figure';
import { GuideJsonLd } from '@/components/seo/json-ld';
import { GUIDES, GUIDE_DISCLAIMER, findGuide, type GuideSection } from '@/lib/content/guides';
import { shortDate } from '@/lib/format';
import { findPublicTool, type PublicTool } from '@/lib/seo/site';
import { unsplashShareImage } from '@/lib/content/images';
import { openGraphFor, twitterFor } from '@/lib/seo/social';
import { SourcesBlock, ToolCta } from '../../tools/page-parts';

/** The guides this route answers on. Anything else is a 404, not an empty page. */
export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) return { title: 'Guides' };
  const path = `/guides/${guide.slug}`;
  const image = unsplashShareImage(guide.cover);
  return {
    title: guide.metaTitle,
    description: guide.description,
    alternates: { canonical: path },
    openGraph: openGraphFor(guide.metaTitle, guide.description, path, image),
    twitter: twitterFor(image),
  };
}

function Section({ section }: { section: GuideSection }) {
  return (
    <>
      <h2>{section.heading}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="measure">
          {paragraph}
        </p>
      ))}
      {section.list ? (
        <ul className="measure">
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.table ? (
        <DataTable caption={section.table.caption}>
          <thead>
            <tr>
              {section.table.head.map((cell, index) => (
                <th key={`${cell}-${index}`} scope="col">
                  {cell === '' ? <span className="sr-only">Item</span> : cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.table.rows.map((row) => (
              <tr key={row.join('|')}>
                {row.map((cell, index) =>
                  index === 0 ? (
                    <th key={`${cell}-${index}`} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={`${cell}-${index}`}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </DataTable>
      ) : null}
    </>
  );
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) notFound();

  const tools = guide.tools
    .map((path) => findPublicTool(path))
    .filter((tool): tool is PublicTool => tool !== undefined);
  const others = GUIDES.filter((entry) => entry.slug !== guide.slug);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">
          <Link className="text-link" href="/guides">
            Guides
          </Link>
        </p>
        <h1>{guide.title}</h1>
        <p className="lede">{guide.lede}</p>
        <p className="muted">
          {guide.byline} · Published {shortDate(guide.published)} · Last reviewed{' '}
          {shortDate(guide.reviewed)}
        </p>
      </section>

      <section className="section guide-cover-section">
        <CoverFigure photo={guide.cover} priority />
      </section>

      <section className="section" aria-labelledby="answer-title">
        <h2 id="answer-title">The short answer</h2>
        <p className="measure">{guide.answer}</p>
      </section>

      <article className="section">
        {guide.sections.map((section) => (
          <Section key={section.heading} section={section} />
        ))}
      </article>

      {tools.length > 0 ? (
        <section className="section" aria-labelledby="guide-tools-title">
          <h2 id="guide-tools-title">Tools for this</h2>
          <div className="form-grid">
            {tools.map((tool) => (
              <Link key={tool.path} href={tool.path} className="form-cell">
                <h3>{tool.name}</h3>
                <p>{tool.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section">
        <h2>Questions people ask</h2>
        <div className="faq">
          {guide.faq.map((entry) => (
            <details key={entry.q}>
              <summary>{entry.q}</summary>
              <p>{entry.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <Callout tone="legal" title="What this guide is">
          {GUIDE_DISCLAIMER}
        </Callout>
      </section>

      <SourcesBlock ids={guide.sources} />

      <section className="section">
        <h2>One record, every document</h2>
        <p className="measure">
          The invoice, the proforma and the packing list only agree if they are prepared from the
          same figures. TradeDocs keeps the parties, goods and terms of a shipment once and prepares
          each document from that record.
        </p>
        <ToolCta secondary={{ href: '/guides', label: 'All guides' }} />
      </section>

      {others.length > 0 ? (
        <section className="section" aria-labelledby="more-guides-title">
          <h2 id="more-guides-title">More guides</h2>
          <div className="form-grid">
            {others.map((entry) => (
              <Link key={entry.slug} href={`/guides/${entry.slug}`} className="form-cell">
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <GuideJsonLd slug={guide.slug} />
    </>
  );
}
