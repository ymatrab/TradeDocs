import type { Metadata } from 'next';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../page-parts';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';
import { ChargeableWeightCalculator } from './calculator';
import { CHARGEABLE_WEIGHT_FAQ } from '@/lib/content/faq';

export const metadata: Metadata = {
  title: 'Dimensional weight calculator — volumetric vs actual weight',
  description:
    'Work out the dimensional (volumetric) weight of your cartons for air, express, road groupage and sea LCL, compare it with the actual weight and see which one your carrier will bill. Free, in your browser.',
  alternates: { canonical: '/tools/chargeable-weight' },
  openGraph: openGraphFor(
    'Dimensional (volumetric) weight calculator',
    'Dimensional against actual weight for air, express, road groupage and sea LCL, and which one your carrier will bill. Free, in your browser.',
    '/tools/chargeable-weight',
  ),
};

const faq = CHARGEABLE_WEIGHT_FAQ;

export default function ChargeableWeightPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>Dimensional (volumetric) weight calculator</h1>
        <p className="lede">
          The figure that surprises people on a first freight invoice. Enter your cartons and their
          weight to get the dimensional weight, the chargeable weight the carrier will bill on, and
          by how much the two differ. Nothing you type leaves your browser.
        </p>
      </section>

      <section className="section">
        <ChargeableWeightCalculator />
      </section>

      <section className="section" aria-labelledby="formula-title">
        <h2 id="formula-title">The dimensional weight formula</h2>
        <p className="measure">
          Dimensional weight in kilograms = length × width × height in centimetres ÷ the divisor.
          The divisor is set by the carrier and the service, and the published figures below are the
          ones this calculator uses. Your own contract can set a different one, and when it does,
          the contract wins.
        </p>
        <ul className="measure">
          <li>
            <strong>6,000</strong> — the general IATA convention for air cargo, about 167 kg per
            cubic metre.
          </li>
          <li>
            <strong>5,000</strong> — DHL Express, FedEx and UPS for international express in
            centimetres, 200 kg per cubic metre.
          </li>
        </ul>
        <p className="measure">
          The carrier then bills on whichever is greater, the actual or the dimensional weight. That
          greater figure is the chargeable weight.
        </p>
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
        <h2>Quoting a real customer</h2>
        <p className="measure">
          The weights behind this figure are the ones that also have to appear on your packing list
          and agree with your invoice. TradeDocs holds them once per product and prints every
          document in the set from the same numbers.
        </p>
        <ToolCta secondary={{ href: '/tools', label: 'All trade tools' }} />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.chargeableWeight} />
      <RelatedTools current="/tools/chargeable-weight" />
      <ToolJsonLd path="/tools/chargeable-weight" faq={faq} />
    </>
  );
}
