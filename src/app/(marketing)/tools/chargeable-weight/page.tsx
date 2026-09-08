import type { Metadata } from 'next';
import Link from 'next/link';
import { LinkButton } from '@/components/primitives/button';
import { ChargeableWeightCalculator } from './calculator';

export const metadata: Metadata = {
  title: 'Chargeable weight calculator — volumetric vs actual',
  description:
    'Compare actual and volumetric weight for air, express, road groupage and sea LCL, and see which one your carrier will bill. Free, and worked out in your browser.',
  alternates: { canonical: '/tools/chargeable-weight' },
};

const faq = [
  {
    q: 'What is chargeable weight?',
    a: 'The greater of a consignment’s actual weight and its volumetric weight. Carriers sell space as well as lift, so a light bulky consignment is billed on the room it takes up rather than what it weighs.',
  },
  {
    q: 'What is the volumetric divisor for air freight?',
    a: 'The general IATA convention is 6,000 cm³ per kilogram, which works out at about 167 kg per cubic metre. Express and courier services usually apply 5,000 cm³ per kilogram, or 200 kg per cubic metre, which produces a higher charge for the same box.',
  },
  {
    q: 'How is volumetric weight calculated?',
    a: 'Multiply length by width by height to get the volume, then divide by the carrier’s divisor. For a 60 × 40 × 40 cm carton that is 96,000 cm³; at the IATA divisor of 6,000 that is 16 kg, whatever the scales say.',
  },
  {
    q: 'Does sea freight use volumetric weight?',
    a: 'LCL sea freight uses the same idea under a different name — weight or measure, W/M — and bills at whichever is greater, treating one cubic metre as one tonne. Full container loads are priced per container instead, so the comparison does not arise.',
  },
];

export default function ChargeableWeightPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>Chargeable weight calculator</h1>
        <p className="lede">
          The figure that surprises people on a first freight invoice. Enter your cartons and their
          weight to see which basis the carrier will bill on, and by how much. Nothing you type
          leaves your browser.
        </p>
      </section>

      <section className="section">
        <ChargeableWeightCalculator />
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
        <div className="cta-row">
          <LinkButton href="/sign-up">Create a free account</LinkButton>
          <Link className="text-link" href="/tools">
            All trade tools
          </Link>
        </div>
      </section>
    </>
  );
}
