import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LinkButton } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { INCOTERMS, INCOTERMS_DISCLAIMER, findIncoterm } from '@/lib/trade/incoterms';

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

  return {
    title: `${term.code} Incoterms 2020 — ${term.name}, explained`,
    description: `${term.riskPasses} What ${term.code} means for cost, risk, insurance and customs clearance, and the mistake it most often causes.`,
    alternates: { canonical: `/tools/incoterms/${term.code.toLowerCase()}` },
  };
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
            Incoterms 2020
          </Link>
        </p>
        <h1>
          {term.code} — {term.name}
        </h1>
        <p className="lede">{term.riskPasses}</p>
      </section>

      <section className="section">
        <BoxGrid label={`${term.code} at a glance`}>
          <FieldBox ordinal="1" caption="Transport mode">
            {term.mode === 'sea' ? 'Sea and inland waterway only' : 'Any mode, including sea'}
          </FieldBox>
          <FieldBox ordinal="2" caption="Export clearance">
            {term.exportClearance === 'seller' ? 'Seller' : 'Buyer'}
          </FieldBox>
          <FieldBox ordinal="3" caption="Import clearance">
            {term.importClearance === 'seller' ? 'Seller' : 'Buyer'}
          </FieldBox>
          <FieldBox ordinal="4" caption="Seller pays for" wide>
            {term.sellerCosts}
          </FieldBox>
        </BoxGrid>
      </section>

      <section className="section">
        <h2>Insurance</h2>
        <p className="measure">{term.insurance}</p>

        <h2>When {term.code} is the right choice</h2>
        <p className="measure">{term.suits}</p>

        <h2>What goes wrong</h2>
        <p className="measure">{term.watchOut}</p>
      </section>

      <section className="section">
        <h2>
          Other {term.mode === 'sea' ? 'maritime' : 'any-mode'} rules
        </h2>
        <div className="doc-stack">
          {others.map((entry) => (
            <Link
              key={entry.code}
              href={`/tools/incoterms/${entry.code.toLowerCase()}`}
              className="doc-card"
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

      <section className="section">
        <h2>Putting {term.code} on a document</h2>
        <p className="measure">
          The rule belongs on the invoice with its named place — {term.code} on its own does not
          identify a delivery point. TradeDocs carries the term and the place from the shipment
          onto every document generated from it, so an invoice and a packing list cannot state
          different terms.
        </p>
        <div className="cta-row">
          <LinkButton href="/sign-up">Create a free account</LinkButton>
          <Link className="text-link" href="/tools/incoterms">
            Compare all eleven rules
          </Link>
        </div>
      </section>
    </>
  );
}
