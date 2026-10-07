import type { Metadata } from 'next';
import Link from 'next/link';
import { DataTable, NumericCell } from '@/components/primitives/table';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';
import { CBM_TO_CUBIC_FEET_FAQ } from '@/lib/tools/faq';
import { convertVolume } from '@/lib/trade/conversions';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../page-parts';
import { VolumeConverter } from './converter';

const PATH = '/tools/cbm-to-cubic-feet';

export const metadata: Metadata = {
  title: 'CBM to cubic feet converter (m³ to ft³, CFT to CBM)',
  description:
    'Convert cubic metres (CBM) to cubic feet and back, and to cm³, cubic inches and litres, with the exact factors NIST lists. 1 CBM = 35.3147 ft³. Free, in your browser.',
  alternates: { canonical: PATH },
  openGraph: openGraphFor(
    'CBM to cubic feet converter',
    'Cubic metres to cubic feet, cm³, cubic inches and litres, both ways, with exact factors. Free, in your browser.',
    PATH,
  ),
};

/** Reference rows, computed by the converter's own function rather than typed in. */
const CBM_ROWS = ['0.5', '1', '2.5', '5', '10', '33', '67', '76'] as const;
const CFT_ROWS = ['1', '10', '50', '100', '500', '1000'] as const;

const faq = CBM_TO_CUBIC_FEET_FAQ;

export default function CbmToCubicFeetPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>CBM to cubic feet converter</h1>
        <p className="lede">
          One cubic metre (CBM) is 35.3147 cubic feet, and one cubic foot is 0.028317 CBM. Type a
          volume in any unit below and see it in cubic metres, cubic feet, cubic centimetres, cubic
          inches and litres at once. The factors are exact by definition and the arithmetic runs in
          your browser.
        </p>
      </section>

      <section className="section">
        <VolumeConverter />
      </section>

      <section className="section" aria-labelledby="formula-title">
        <h2 id="formula-title">The CBM to cubic feet formula</h2>
        <p className="measure">
          Cubic feet = cubic metres × 35.3147. Cubic metres = cubic feet × 0.028 316 846 592. The
          foot is defined as exactly 0.3048 m, so the cubic foot is exactly 0.3048³ m³; the
          converter uses that exact figure and rounds only the answer. The inch is exactly 0.0254 m
          and the litre exactly 0.001 m³, so those conversions are exact too.
        </p>
      </section>

      <section className="section" aria-labelledby="tables-title">
        <h2 id="tables-title">Common figures</h2>
        <div className="form-grid">
          <DataTable caption="Cubic metres to cubic feet">
            <thead>
              <tr>
                <th scope="col" className="numeric">
                  m³ (CBM)
                </th>
                <th scope="col" className="numeric">
                  ft³
                </th>
              </tr>
            </thead>
            <tbody>
              {CBM_ROWS.map((value) => (
                <tr key={value}>
                  <NumericCell value={value} />
                  <NumericCell value={convertVolume(value, 'm3', 'ft3') ?? '—'} />
                </tr>
              ))}
            </tbody>
          </DataTable>
          <DataTable caption="Cubic feet to cubic metres">
            <thead>
              <tr>
                <th scope="col" className="numeric">
                  ft³
                </th>
                <th scope="col" className="numeric">
                  m³ (CBM)
                </th>
              </tr>
            </thead>
            <tbody>
              {CFT_ROWS.map((value) => (
                <tr key={value}>
                  <NumericCell value={value} />
                  <NumericCell value={convertVolume(value, 'ft3', 'm3') ?? '—'} />
                </tr>
              ))}
            </tbody>
          </DataTable>
        </div>
        <p className="muted measure">
          33, 67 and 76 m³ are the typical internal volumes of a 20ft, 40ft and 40ft high-cube dry
          container on Maersk’s published sheet. To get a volume from carton sizes in the first
          place, use the{' '}
          <Link className="text-link" href="/tools/cbm-calculator">
            CBM calculator
          </Link>
          ; for kilograms and pounds, the{' '}
          <Link className="text-link" href="/tools/unit-converter">
            CBM and kg converter
          </Link>
          ; and for what CBM means on a freight quote, the glossary entry{' '}
          <Link className="text-link" href="/glossary/cbm">
            CBM
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
        <h2>The same volume on every document</h2>
        <p className="measure">
          A packing list in cubic metres and a booking in cubic feet have to describe the same
          cargo. With an account, a shipment holds its packages and their dimensions once, and the
          packing list prints the total volume in cubic metres from the same record as the rest of
          the set.
        </p>
        <ToolCta
          secondary={{ href: '/tools/packing-list-generator', label: 'Packing list generator' }}
        />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.cbmToCubicFeet} />
      <RelatedTools current={PATH} />
      <ToolJsonLd path={PATH} faq={faq} />
    </>
  );
}
