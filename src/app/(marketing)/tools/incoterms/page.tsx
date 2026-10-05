import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import {
  INCOTERMS,
  INCOTERMS_CHART,
  INCOTERMS_DISCLAIMER,
  INCOTERMS_HUB_FAQ,
} from '@/lib/trade/incoterms';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../page-parts';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';

export const metadata: Metadata = {
  title: 'Incoterms 2020 chart and explanation — all eleven rules',
  description:
    'An Incoterms 2020 responsibilities chart and a plain-language summary of every rule: where risk passes, who pays for carriage, who clears customs and who insures, with the trap in each one named.',
  alternates: { canonical: '/tools/incoterms' },
  openGraph: openGraphFor(
    'Incoterms 2020 explained: all eleven rules',
    'Where risk passes, who pays for carriage, who clears customs and who insures, for every Incoterms 2020 rule, in plain language.',
    '/tools/incoterms',
  ),
};

export default function IncotermsPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free reference</p>
        <h1>Incoterms® 2020, explained</h1>
        <p className="lede">
          Eleven rules that decide who pays for what, who carries the risk, and who deals with
          customs. Here is each one in a sentence, with the mistake it most often causes.
        </p>
      </section>

      <section className="section">
        <DataTable caption="The eleven Incoterms® 2020 rules compared">
          <thead>
            <tr>
              <th scope="col">Rule</th>
              <th scope="col">Mode</th>
              <th scope="col">Main carriage</th>
              <th scope="col">Risk passes</th>
              <th scope="col">Export</th>
              <th scope="col">Import</th>
            </tr>
          </thead>
          <tbody>
            {INCOTERMS.map((term) => (
              <tr key={term.code}>
                <td>
                  <Link className="text-link" href={`/tools/incoterms/${term.code.toLowerCase()}`}>
                    <span className="data">{term.code}</span> — {term.name}
                  </Link>
                </td>
                <td>{term.mode === 'sea' ? 'Sea and inland waterway' : 'Any mode'}</td>
                <td>{term.mainCarriage === 'seller' ? 'Seller' : 'Buyer'}</td>
                <td>{term.riskPasses}</td>
                <td>{term.exportClearance === 'seller' ? 'Seller' : 'Buyer'}</td>
                <td>{term.importClearance === 'seller' ? 'Seller' : 'Buyer'}</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </section>

      <section className="section" aria-labelledby="chart-title">
        <h2 id="chart-title">Incoterms® 2020 responsibilities chart</h2>
        <p className="measure">
          Who does what under each rule, read down a column. The chart is built from the same data
          as the rule pages, so the two cannot disagree.
        </p>
        <DataTable caption="Incoterms® 2020 responsibilities by rule" density="compact">
          <thead>
            <tr>
              <th scope="col">Obligation</th>
              {INCOTERMS.map((term) => (
                <th key={term.code} scope="col">
                  <Link className="text-link" href={`/tools/incoterms/${term.code.toLowerCase()}`}>
                    <span className="data">{term.code}</span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {INCOTERMS_CHART.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {INCOTERMS.map((term) => (
                  <td key={term.code}>{row.cell(term)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </DataTable>
        <p className="muted measure">
          Origin means risk passes in the seller’s country, at the named place or port of shipment,
          even under the C rules where the seller pays carriage further. Unloading at destination
          can be included in the carriage contract the seller buys; the chart shows who the rules
          themselves put it on.
        </p>
      </section>

      <section className="section">
        <h2>Questions people ask</h2>
        <div className="faq">
          {INCOTERMS_HUB_FAQ.map((entry) => (
            <details key={entry.q}>
              <summary>{entry.q}</summary>
              <p>{entry.a}</p>
            </details>
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
        <h2>On the document itself</h2>
        <p className="measure">
          The rule you agree has to appear on the invoice, with the named place beside it — “FCA
          Rotterdam” means something; “FCA” alone does not. TradeDocs carries the term and its place
          on every document generated from a shipment, so the set cannot state two different
          answers.
        </p>
        <ToolCta secondary={{ href: '/tools', label: 'All trade tools' }} />
      </section>
      <RelatedTools current="/tools/incoterms" />
      <ToolJsonLd path="/tools/incoterms" faq={INCOTERMS_HUB_FAQ} />
    </>
  );
}
