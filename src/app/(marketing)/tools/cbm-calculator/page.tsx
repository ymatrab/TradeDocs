import type { Metadata } from 'next';
import Link from 'next/link';
import { DataTable, NumericCell } from '@/components/primitives/table';
import { decimal } from '@/lib/format';
import { cubicFeetToCubicMetres, cubicMetresToCubicFeet } from '@/lib/trade/calculations';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../page-parts';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';
import { CbmCalculator } from './calculator';

export const metadata: Metadata = {
  title: 'CBM calculator — cubic metres and cubic feet for shipping cartons',
  description:
    'Work out the CBM of a consignment from carton dimensions in cm, mm, m, inches or feet, convert CBM to cubic feet, and see how it sits against a 20ft, 40ft or high-cube container. Free, and nothing leaves your browser.',
  alternates: { canonical: '/tools/cbm-calculator' },
  openGraph: openGraphFor(
    'CBM calculator: cubic metres for shipping cartons',
    'Work out the CBM of a consignment from carton dimensions and check it against a 20ft, 40ft or high-cube container. Free, and nothing leaves your browser.',
    '/tools/cbm-calculator',
  ),
};

/** Worked conversions, computed from the exact factor rather than typed in. */
const CUBIC_METRE_EXAMPLES = [1, 2.5, 10, 33, 67, 76] as const;
const CUBIC_FOOT_EXAMPLES = [1, 100, 500, 1000] as const;

const faq = [
  {
    q: 'How do I convert CBM to cubic feet?',
    a: 'Multiply by 35.3147. One foot is exactly 0.3048 metres, so one cubic foot is 0.0283168 m³ and one cubic metre is about 35.3147 ft³. To go the other way, multiply cubic feet by 0.0283168, or divide by 35.3147.',
  },
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
    a: 'Typically about 33 m³ of internal volume, against roughly 67 m³ in a 40ft standard and 76 m³ in a 40ft high cube — the figures Maersk, for example, publishes for its dry containers. Individual boxes vary by series and carrier, and loaded cargo rarely reaches those figures, because cartons do not divide neatly into the floor and cannot always be stacked.',
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

      <section className="section" aria-labelledby="cubic-feet-title">
        <h2 id="cubic-feet-title">CBM to cubic feet</h2>
        <p className="measure">
          One cubic metre is 35.3147 cubic feet. The factor is exact by definition: a foot is 0.3048
          metres, so a cubic foot is 0.3048³ = 0.028 316 846 592 m³, the figure NIST publishes. The
          calculator above shows both units; the tables below are for converting a figure you
          already have.
        </p>
        <div className="form-grid">
          <DataTable caption="Cubic metres to cubic feet">
            <thead>
              <tr>
                <th scope="col" className="numeric">
                  CBM (m³)
                </th>
                <th scope="col" className="numeric">
                  Cubic feet (ft³)
                </th>
              </tr>
            </thead>
            <tbody>
              {CUBIC_METRE_EXAMPLES.map((value) => (
                <tr key={value}>
                  <NumericCell value={decimal(value, value % 1 === 0 ? 0 : 1)} />
                  <NumericCell value={decimal(cubicMetresToCubicFeet(value), 2)} />
                </tr>
              ))}
            </tbody>
          </DataTable>
          <DataTable caption="Cubic feet to cubic metres">
            <thead>
              <tr>
                <th scope="col" className="numeric">
                  Cubic feet (ft³)
                </th>
                <th scope="col" className="numeric">
                  CBM (m³)
                </th>
              </tr>
            </thead>
            <tbody>
              {CUBIC_FOOT_EXAMPLES.map((value) => (
                <tr key={value}>
                  <NumericCell value={decimal(value, 0)} />
                  <NumericCell value={decimal(cubicFeetToCubicMetres(value), 3)} />
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
        <p className="muted measure">
          33, 67 and 76 m³ are the typical internal volumes of a 20ft, 40ft and 40ft high-cube
          container, for comparison. Whether a volume is worth a container of its own or ships as
          groupage is a separate question:{' '}
          <Link className="text-link" href="/guides/lcl-vs-fcl">
            read LCL vs FCL
          </Link>
          .
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
        <h2>Once the cartons are real</h2>
        <p className="measure">
          A calculator is a one-off answer. On a live shipment the same dimensions belong on the
          packing list, where TradeDocs derives the volume for you, checks that what is packed
          matches what is invoiced, and prints both from the same figures.
        </p>
        <ToolCta secondary={{ href: '/tools', label: 'All trade tools' }} />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.cbm} />
      <RelatedTools current="/tools/cbm-calculator" />
      <ToolJsonLd path="/tools/cbm-calculator" faq={faq} />
    </>
  );
}
