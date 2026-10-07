import { Fragment } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleToolCta } from '@/components/content/article-view';
import { Callout } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { CountryJsonLd } from '@/components/seo/json-ld';
import { COUNTRIES, COUNTRY_POSTS, findCountry } from '@/lib/content/countries';
import { COUNTRY_DISCLAIMER, isCountryListed, type DocumentStatus } from '@/lib/content/country';
import { shortDate } from '@/lib/format';
import { findPublicTool } from '@/lib/seo/site';
import { openGraphFor } from '@/lib/seo/social';
import { SOURCES, type SourceId } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../../tools/page-parts';

const STATUS_LABELS: Record<DocumentStatus, string> = {
  required: 'Required',
  conditional: 'If it applies',
  typical: 'Usually sent',
};

/** The countries this route answers on. Anything else is a 404, not an empty page. */
export function generateStaticParams() {
  return COUNTRIES.map((entry) => ({ country: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: slug } = await params;
  const country = findCountry(slug);
  if (!country) return { title: 'Export documents by country' };
  const path = `/export-documents/${country.slug}`;
  return {
    title: country.metaTitle,
    description: country.description,
    alternates: { canonical: path },
    openGraph: openGraphFor(country.metaTitle, country.description, path),
    // Country pages state customs facts: noindex until a named review record exists.
    ...(isCountryListed(country) ? {} : { robots: { index: false, follow: true, nocache: true } }),
  };
}

/** The source a row rests on, linked, so each fact can be checked where it is stated. */
function SourceLink({ id }: { id: SourceId }) {
  const record = SOURCES[id];
  return (
    <a className="text-link" href={record.url} rel="noopener">
      {record.authority}
    </a>
  );
}

export default async function CountryDocumentsPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: slug } = await params;
  const country = findCountry(slug);
  if (!country) notFound();

  const tool = findPublicTool(country.tool);
  const others = COUNTRIES.filter((entry) => entry.slug !== country.slug);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">
          <Link className="text-link" href="/export-documents">
            Export documents by country
          </Link>
        </p>
        <h1>Export documents for {country.name}</h1>
        <p className="lede">{country.lede}</p>
        <p className="muted">
          TradeDocs team · Published{' '}
          <time dateTime={country.published}>{shortDate(country.published)}</time> · Last
          checked against sources{' '}
          <time dateTime={country.reviewed}>{shortDate(country.reviewed)}</time>
        </p>
      </section>

      <section className="section" aria-labelledby="answer-title">
        <h2 id="answer-title">Short answer</h2>
        <p className="measure">{country.answer}</p>
        <p className="measure">
          Customs authority:{' '}
          <a className="text-link" href={country.customsAuthority.url} rel="noopener">
            {country.customsAuthority.name}
          </a>
          .
        </p>
        {tool ? <ArticleToolCta tool={tool} /> : null}
      </section>

      <section className="section" aria-labelledby="documents-title">
        <h2 id="documents-title">Which documents does a shipment to {country.name} need?</h2>
        <DataTable caption={`Documents for a shipment to ${country.name}`} stack>
          <thead>
            <tr>
              <th scope="col">Document</th>
              <th scope="col">Status</th>
              <th scope="col">When and why</th>
              <th scope="col">Source</th>
            </tr>
          </thead>
          <tbody>
            {country.documents.map((row) => {
              const rowTool = row.tool ? findPublicTool(row.tool) : undefined;
              return (
                <tr key={row.document}>
                  <th scope="row" data-label="Document">
                    {row.document}
                    {rowTool ? (
                      <>
                        {' '}
                        <Link className="text-link" href={rowTool.path}>
                          ({rowTool.name})
                        </Link>
                      </>
                    ) : null}
                  </th>
                  <td data-label="Status">{STATUS_LABELS[row.status]}</td>
                  <td data-label="When and why">{row.condition}</td>
                  <td data-label="Source">
                    <SourceLink id={row.sourceId} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      </section>

      <section className="section" aria-labelledby="invoice-title">
        <h2 id="invoice-title">What the commercial invoice for {country.name} must show</h2>
        <ul className="measure">
          {country.invoiceRequirements.map((line) => (
            <li key={line.text}>
              {line.text} <span className="muted">Source: </span>
              <SourceLink id={line.sourceId} />
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="ids-title">
        <h2 id="ids-title">Importer identifiers and registrations</h2>
        <dl className="record-list measure">
          {country.importerIdentifiers.map((row) => (
            <div key={row.name}>
              <dt className="caption">{row.name}</dt>
              <dd>
                {row.whoNeedsIt} <span className="muted">Source: </span>
                <SourceLink id={row.sourceId} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="section" aria-labelledby="importer-title">
        <h2 id="importer-title">Who can be the importer, and DDP</h2>
        {country.incotermsNotes.map((line) => (
          <p key={line.text} className="measure">
            {line.text} <span className="muted">Source: </span>
            <SourceLink id={line.sourceId} />
          </p>
        ))}
        {country.valuationBasis ? (
          <p className="measure">
            Customs value is assessed on a {country.valuationBasis.basis} basis.{' '}
            <span className="muted">Source: </span>
            <SourceLink id={country.valuationBasis.sourceId} />
          </p>
        ) : null}
      </section>

      {country.controlledGoods ? (
        <section className="section" aria-labelledby="controlled-title">
          <h2 id="controlled-title">Restricted and prohibited goods</h2>
          <p className="measure">
            Check the official list:{' '}
            <a className="text-link" href={country.controlledGoods.officialUrl} rel="noopener">
              {country.controlledGoods.label}
            </a>
            . TradeDocs does not classify goods or say which list a product is on.
          </p>
        </section>
      ) : null}

      {country.lowValueThreshold ? (
        <section className="section" aria-labelledby="threshold-title">
          <h2 id="threshold-title">Low-value shipments</h2>
          <p className="measure">
            {country.lowValueThreshold.text} Effective{' '}
            {shortDate(country.lowValueThreshold.effectiveDate)}.{' '}
            <span className="muted">Source: </span>
            <SourceLink id={country.lowValueThreshold.sourceId} />
          </p>
        </section>
      ) : null}

      <article className="section">
        {country.sections.map((section) => (
          // A fragment, not a wrapper: the section styles select direct children of .section.
          <Fragment key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="measure">
                {paragraph}
              </p>
            ))}
          </Fragment>
        ))}
      </article>

      <section className="section" aria-labelledby="faq-title">
        <h2 id="faq-title">Questions people ask</h2>
        <div className="faq">
          {country.faq.map((entry) => (
            <details key={entry.q}>
              <summary>{entry.q}</summary>
              <p>{entry.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <Callout tone="legal" title="What this page is">
          {COUNTRY_DISCLAIMER}
        </Callout>
      </section>

      <SourcesBlock ids={country.sources} />

      <section className="section">
        <h2>Prepare the set once</h2>
        <p className="measure">
          The broker in {country.name} works from your invoice and packing list, so the two have to
          agree line for line. TradeDocs keeps a shipment’s parties, goods and packages once and
          prepares each document from that record.
        </p>
        <ToolCta secondary={{ href: '/export-documents', label: 'All countries' }} />
      </section>

      {others.length > 0 || COUNTRY_POSTS.length > 0 ? (
        <section className="section" aria-labelledby="other-countries-title">
          <h2 id="other-countries-title">Other destinations</h2>
          <div className="form-grid">
            {others.map((entry) => (
              <Link
                key={entry.slug}
                href={`/export-documents/${entry.slug}`}
                className="form-cell"
              >
                <h3>Export documents for {entry.name}</h3>
                <p>{entry.description}</p>
              </Link>
            ))}
            {COUNTRY_POSTS.map((post) => (
              <Link key={post.href} href={post.href} className="form-cell">
                <h3>{post.name}</h3>
                <p>The commercial invoice for a shipment to {post.name}, on the blog.</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <CountryJsonLd slug={country.slug} />
    </>
  );
}
