import type { Metadata } from 'next';
import Link from 'next/link';
import { DataTable, NumericCell } from '@/components/primitives/table';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';
import { UNIT_CONVERTER_FAQ } from '@/lib/tools/faq';
import { convert, type Conversion } from '@/lib/trade/conversions';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../page-parts';
import { UnitConverter } from './converter';

const PATH = '/tools/unit-converter';

export const metadata: Metadata = {
  title: 'CBM to cubic feet and kg to lb converter for shipping',
  description:
    'Convert cubic metres (CBM) to cubic feet and kilograms to pounds, both ways, with the exact factors NIST lists. Free, and nothing leaves your browser.',
  alternates: { canonical: PATH },
  openGraph: openGraphFor(
    'CBM to cubic feet and kg to lb converter',
    'Cubic metres to cubic feet and kilograms to pounds, both ways, with exact factors. Free, in your browser.',
    PATH,
  ),
};

/** Reference tables, computed by the converter's own function rather than typed in. */
type ReferenceTable = {
  caption: string;
  from: string;
  to: string;
  conversion: Conversion;
  values: readonly string[];
};

const TABLES: readonly ReferenceTable[] = [
  {
    caption: 'Cubic metres to cubic feet',
    from: 'm³',
    to: 'ft³',
    conversion: 'm3_to_ft3',
    values: ['1', '10', '33', '67', '76'],
  },
  {
    caption: 'Kilograms to pounds',
    from: 'kg',
    to: 'lb',
    conversion: 'kg_to_lb',
    values: ['1', '10', '25', '100', '1000'],
  },
  {
    caption: 'Pounds to kilograms',
    from: 'lb',
    to: 'kg',
    conversion: 'lb_to_kg',
    values: ['1', '50', '100', '150', '2000'],
  },
];

const faq = UNIT_CONVERTER_FAQ;

export default function UnitConverterPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>CBM to cubic feet and kg to lb converter</h1>
        <p className="lede">
          One cubic metre is 35.3147 cubic feet, and one kilogram is 2.2046 pounds. Type a figure in
          either field below and the other fills in, using the exact definitions of the foot and the
          pound. Everything is worked out in your browser.
        </p>
      </section>

      <section className="section">
        <UnitConverter />
      </section>

      <section className="section" aria-labelledby="tables-title">
        <h2 id="tables-title">Common figures</h2>
        <div className="form-grid">
          {TABLES.map((table) => (
            <DataTable key={table.caption} caption={table.caption}>
              <thead>
                <tr>
                  <th scope="col" className="numeric">
                    {table.from}
                  </th>
                  <th scope="col" className="numeric">
                    {table.to}
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.values.map((value) => (
                  <tr key={value}>
                    <NumericCell value={value} />
                    <NumericCell value={convert(value, table.conversion) ?? '—'} />
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ))}
        </div>
        <p className="muted measure">
          33, 67 and 76 m³ are the typical internal volumes of a 20ft, 40ft and 40ft high-cube
          container. To work out the volume of a consignment from carton sizes, use the{' '}
          <Link className="text-link" href="/tools/cbm-calculator">
            CBM calculator
          </Link>
          ; to see whether you will be billed on that volume, the{' '}
          <Link className="text-link" href="/tools/chargeable-weight">
            dimensional weight calculator
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
        <h2>One unit across the set</h2>
        <p className="measure">
          A packing list in kilograms beside an invoice in pounds is a question waiting to be asked.
          With an account, a shipment holds its weights once and every document prints the same
          figures.
        </p>
        <ToolCta secondary={{ href: '/tools', label: 'All trade tools' }} />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.unitConverter} />
      <RelatedTools current={PATH} />
      <ToolJsonLd path={PATH} faq={faq} />
    </>
  );
}
