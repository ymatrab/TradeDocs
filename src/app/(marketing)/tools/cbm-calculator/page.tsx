import type { Metadata } from 'next';
import Link from 'next/link';
import { LinkButton } from '@/components/primitives/button';
import { CbmCalculator } from './calculator';

export const metadata: Metadata = {
  title: 'CBM calculator — cubic metres for shipping cartons',
  description:
    'Work out the CBM of a consignment from carton dimensions in cm, mm, m, inches or feet, and see how it sits against a 20ft, 40ft or high-cube container. Free, and nothing leaves your browser.',
  alternates: { canonical: '/tools/cbm-calculator' },
};

const faq = [
  {
    q: 'What is CBM?',
    a: 'CBM is cubic metres — length × width × height, in metres, multiplied by the number of cartons. It is the figure sea freight quotations for LCL cargo are built from, because a shipper pays for the space a consignment occupies as much as for what it weighs.',
  },
  {
    q: 'How do I calculate CBM by hand?',
    a: 'Convert every dimension to metres, multiply the three together for one carton, then multiply by the carton count. A 40 × 30 × 20 cm carton is 0.4 × 0.3 × 0.2 = 0.024 m³, so fifty of them are 1.2 CBM.',
  },
  {
    q: 'Does the carrier charge on CBM or on weight?',
    a: 'On whichever produces the larger figure. Sea LCL commonly bills at one tonne per cubic metre, so 2 CBM weighing 1,500 kg is charged as 2,000 kg. Air freight applies a volumetric divisor instead.',
  },
  {
    q: 'How many CBM fit in a 20ft container?',
    a: 'About 33 m³ of usable interior volume, and roughly 67 m³ in a 40ft standard or 76 m³ in a 40ft high cube. Loaded cargo rarely reaches those figures, because cartons do not divide neatly into the floor and cannot always be stacked.',
  },
];

export default function CbmPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>CBM calculator</h1>
        <p className="lede">
          Enter your carton sizes and get the cubic metres a forwarder will quote against, plus a
          check on whether it fits a container. Everything is worked out in your browser — nothing
          you type is sent anywhere.
        </p>
      </section>

      <section className="section">
        <CbmCalculator />
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
        <h2>Once the cartons are real</h2>
        <p className="measure">
          A calculator is a one-off answer. On a live shipment the same dimensions belong on the
          packing list, where TradeDocs derives the volume for you, checks that what is packed
          matches what is invoiced, and prints both from the same figures.
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
