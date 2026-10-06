import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../page-parts';
import { LandedCostCalculator } from './calculator';
import { LANDED_COST_FAQ } from '@/lib/content/faq';

const PATH = '/tools/landed-cost-calculator';

export const metadata: Metadata = {
  title: 'Landed cost calculator — goods, freight, duty and taxes',
  description:
    'Estimate the landed cost of an import from the goods value, freight, insurance, the duty and tax rates you enter and any other costs, with a cost per unit. Free, and nothing leaves your browser.',
  alternates: { canonical: PATH },
  openGraph: openGraphFor(
    'Landed cost calculator: goods, freight, duty and taxes',
    'Estimate the landed cost of an import from your own figures and rates, with a cost per unit. Free, in your browser.',
    PATH,
  ),
};

const assumptions = [
  'Every rate is yours. The calculator has no tariff or tax tables and never suggests a rate; blank rates count as zero.',
  'Duty is a single percentage of the basis you choose: the goods value alone, or the goods plus freight and insurance (CIF value). Specific duties charged per kilogram or per unit, anti-dumping duties and quotas are not modelled.',
  'Taxes and fees are a single percentage of the customs value, with or without the duty added, as you choose.',
  'Duty and taxes are rounded once each to the currency’s minor units, and the total is the sum of the rounded lines.',
  'All amounts are in one currency. Convert freight or fees quoted in another currency before you enter them.',
  'The cost per unit spreads the whole landed cost evenly over the units you enter.',
];

const faq = LANDED_COST_FAQ;

export default function LandedCostPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>Landed cost calculator</h1>
        <p className="lede">
          What an import costs once it is at your door: goods, freight, insurance, duty, import
          taxes and the other charges, as a total and per unit. You supply the rates; everything is
          worked out in your browser and nothing is sent anywhere.
        </p>
      </section>

      <section className="section">
        <LandedCostCalculator />
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
        <Callout tone="legal" title="What this estimate is">
          An arithmetic estimate from the figures and rates you entered. It is not a duty or tax
          ruling, a quotation or customs, tax or financial advice. The duty and taxes actually due
          are decided by the importing country’s customs authority on the classification, origin and
          value it accepts.
        </Callout>
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
        <h2>From an estimate to a priced shipment</h2>
        <p className="measure">
          The goods value in a landed cost is the figure on your commercial invoice, and the
          Incoterms® rule decides which of these costs the seller has already paid. Under DDP, for
          example, the duty and taxes are in the seller’s price.{' '}
          <Link className="text-link" href="/guides/dap-vs-ddp">
            Read DAP vs DDP
          </Link>
          .
        </p>
        <ToolCta secondary={{ href: '/tools', label: 'All trade tools' }} />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.landedCost} />
      <RelatedTools current={PATH} />
      <ToolJsonLd path={PATH} faq={faq} />
    </>
  );
}
