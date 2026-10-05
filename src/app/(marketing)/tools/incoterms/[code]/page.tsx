import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Callout } from '@/components/primitives/feedback';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import {
  INCOTERMS,
  INCOTERMS_DISCLAIMER,
  findIncoterm,
  type Incoterm,
} from '@/lib/trade/incoterms';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../../page-parts';
import { IncotermJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';

/** The eleven codes this route answers on. Anything else is a 404, not an empty page. */
export function generateStaticParams() {
  return INCOTERMS.map((term) => ({ code: term.code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const term = findIncoterm(code);
  if (!term) return { title: 'Incoterms 2020' };

  const title = term.search?.title ?? `${term.code} Incoterms 2020 — ${term.name}, explained`;
  const description = term.search
    ? `${term.search.lead} Who pays, who insures, and the mistake it most often causes.`
    : `${term.riskPasses} What ${term.code} means for cost, risk, insurance and customs clearance, and the mistake it most often causes.`;
  const path = `/tools/incoterms/${term.code.toLowerCase()}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: openGraphFor(title, description, path),
  };
}

const party = (value: Incoterm['mainCarriage']) => (value === 'seller' ? 'Seller' : 'Buyer');

/** Export and import clearance in one sentence, built from the data so all eleven agree. */
function clearance(term: Incoterm): string {
  if (term.exportClearance === term.importClearance) {
    return `The ${term.exportClearance} handles both export and import clearance, including any import duties and taxes.`;
  }
  return `The ${term.exportClearance} clears the goods for export. The ${term.importClearance} clears them for import and pays any import duties and taxes.`;
}

export default async function IncotermPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const term = findIncoterm(code);
  if (!term) notFound();

  const others = INCOTERMS.filter((entry) => entry.mode === term.mode && entry.code !== term.code);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">
          <Link className="text-link" href="/tools/incoterms">
            Incoterms® 2020
          </Link>
        </p>
        <h1>{term.search?.heading ?? `${term.code} Incoterms® 2020 — ${term.name}`}</h1>
        <p className="lede">
          {term.search ? `${term.search.lead} ` : null}
          {term.riskPasses}
        </p>
      </section>

      <section className="section">
        <BoxGrid label={`${term.code} at a glance`}>
          <FieldBox ordinal="1" caption="Transport mode">
            {term.mode === 'sea' ? 'Sea and inland waterway only' : 'Any mode, including sea'}
          </FieldBox>
          <FieldBox ordinal="2" caption="Main carriage arranged by">
            {party(term.mainCarriage)}
          </FieldBox>
          <FieldBox ordinal="3" caption="Export clearance">
            {party(term.exportClearance)}
          </FieldBox>
          <FieldBox ordinal="4" caption="Import clearance">
            {party(term.importClearance)}
          </FieldBox>
          <FieldBox ordinal="5" caption="Seller pays for" wide>
            {term.sellerCosts}
          </FieldBox>
        </BoxGrid>
      </section>

      <section className="section">
        <h2>Who arranges the main carriage</h2>
        <p className="measure">{term.carriageNote}</p>

        <h2>Where risk transfers</h2>
        <p className="measure">{term.riskPasses}</p>

        <h2>Export and import clearance</h2>
        <p className="measure">{clearance(term)}</p>

        <h2>Insurance</h2>
        <p className="measure">{term.insurance}</p>

        <h2>When {term.code} is the right choice</h2>
        <p className="measure">{term.suits}</p>
      </section>

      <section className="section">
        <h2>A worked example</h2>
        <p className="measure">{term.example}</p>
        <p className="muted measure">The parties are invented, for illustration only.</p>

        <h2>Common mistakes</h2>
        <p className="measure">{term.watchOut}</p>
        <ul className="measure">
          {term.mistakes.map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Questions about {term.code}</h2>
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
        <h2>Other {term.mode === 'sea' ? 'maritime' : 'any-mode'} rules</h2>
        <div className="form-grid">
          {others.map((entry) => (
            <Link
              key={entry.code}
              href={`/tools/incoterms/${entry.code.toLowerCase()}`}
              className="form-cell"
            >
              <h3>
                {entry.code} — {entry.name}
              </h3>
              <p>{entry.riskPasses}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <Callout tone="legal" title="What this page is">
          {INCOTERMS_DISCLAIMER}
        </Callout>
      </section>

      <SourcesBlock ids={PAGE_SOURCES.incoterms} />

      <section className="section">
        <h2>Putting {term.code} on a document</h2>
        <p className="measure">
          The rule belongs on the invoice with its named place — {term.code} on its own does not
          identify a delivery point. TradeDocs carries the term and the place from the shipment onto
          every document generated from it, so an invoice and a packing list cannot state different
          terms.
        </p>
        <ToolCta secondary={{ href: '/tools/incoterms', label: 'Compare all eleven rules' }} />
      </section>
      <RelatedTools current="/tools/incoterms" />
      <IncotermJsonLd code={term.code} />
    </>
  );
}
