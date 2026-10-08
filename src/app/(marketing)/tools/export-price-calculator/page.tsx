import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { EXPORT_PRICE_FAQ } from '@/lib/content/faq';
import { SourcesBlock, ToolCta } from '../page-parts';
import { ExportPriceCalculator } from './calculator';

const PATH = '/tools/export-price-calculator';

export const metadata: Metadata = {
  title: 'Export price calculator — EXW to FOB, CIF and DDP',
  description:
    'Build an export price from your ex-works price and the inland transport, export clearance, loading, freight and insurance costs you enter: FCA/FOB, CFR/CPT, CIF/CIP and a DDP estimate, with a price per unit. Free, in your browser.',
  alternates: { canonical: PATH },
  openGraph: openGraphFor(
    'Export price calculator: EXW to FOB, CIF and DDP',
    'Your ex-works price plus the costs you enter, as FCA/FOB, CFR/CPT, CIF/CIP and a DDP estimate. Free, in your browser.',
    PATH,
  ),
};

const assumptions = [
  'Every cost and rate is yours. The calculator has no freight, insurance, duty or tax figures and never suggests one; blank fields count as zero.',
  'FCA and FOB share one figure: the goods cleared for export and delivered to the main carrier, including the origin loading and terminal charges you enter. If your FCA place is your own premises, or your contract leaves origin terminal charges to the buyer, leave those out.',
  'CFR and CPT add the main freight to the destination; CIF and CIP add the insurance premium. The arithmetic is the same for sea-only and any-mode rules; the insurance level each rule requires is not.',
  'The DDP figure is an estimate. Duty is a single percentage of the CIF or FOB value, and taxes a single percentage of that value with or without the duty. Specific duties, anti-dumping duties, quotas and fees charged per entry are not modelled.',
  'Each amount is rounded once to the currency’s minor units, and each price is the sum of the rounded lines.',
  'All amounts are in one currency. Convert quotes in another currency before you enter them.',
];

const faq = EXPORT_PRICE_FAQ;

export default function ExportPricePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>Export price calculator</h1>
        <p className="lede">
          Turn an ex-works price into the price you quote under the Incoterms® rule your buyer asks
          for: FCA or FOB, CFR or CPT, CIF or CIP, and an estimate for DDP. You enter the costs;
          everything is worked out in your browser and nothing is sent anywhere.
        </p>
      </section>

      <section className="section">
        <ExportPriceCalculator />
      </section>

      <section className="section">
        <Callout tone="legal" title="An estimate, not a quote">
          An arithmetic estimate from the costs and rates you entered. It is not a freight,
          insurance or customs quotation, a duty or tax ruling, or financial advice. Freight and
          insurance come from your forwarder and insurer; the duty and taxes actually due under DDP
          are decided by the importing country’s customs authority.
        </Callout>
      </section>

      <section className="section">
        <h2>What the estimate assumes</h2>
        <ul className="measure">
          {assumptions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Questions people ask</h2>
        <div className="faq">
          {faq.map((entry) => (
            <details key={entry.q}>
              <summary>{entry.q}</summary>
              <p>{entry.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>From a price to a proforma invoice</h2>
        <p className="measure">
          Once you know the price under the rule you are quoting, the proforma invoice is where the
          buyer sees it. In the{' '}
          <Link className="text-link" href="/tools/proforma-invoice-generator">
            proforma invoice generator
          </Link>
          , enter the per-unit price as the unit price and choose the same Incoterms® rule with its
          named place, so the quotation and the price agree. The two pages do not share data: copy
          the figure across yourself. Which costs each rule leaves with you is set out in the{' '}
          <Link className="text-link" href="/tools/incoterms">
            Incoterms 2020 guide
          </Link>
          , and the{' '}
          <Link className="text-link" href="/tools/landed-cost-calculator">
            landed cost calculator
          </Link>{' '}
          shows the same shipment from the buyer’s side.
        </p>
        <ToolCta
          secondary={{
            href: '/tools/proforma-invoice-generator',
            label: 'Open the proforma invoice generator',
          }}
        />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.exportPrice} />
      <RelatedTools current={PATH} />
      <ToolJsonLd path={PATH} faq={faq} />
    </>
  );
}
