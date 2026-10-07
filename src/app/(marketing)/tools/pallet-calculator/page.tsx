import type { Metadata } from 'next';
import Link from 'next/link';
import { DataTable, NumericCell } from '@/components/primitives/table';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';
import { PALLET_CALCULATOR_FAQ } from '@/lib/tools/faq';
import { PALLET_PRESETS, palletLoad } from '@/lib/trade/pallet';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../page-parts';
import { PalletCalculator } from './calculator';

const PATH = '/tools/pallet-calculator';

export const metadata: Metadata = {
  title: 'Pallet calculator: cartons per layer, per pallet and weight',
  description:
    'Work out how many cartons fit on a pallet per layer and in total, the loaded height and the pallet gross weight, for 48 × 40 in, euro and 1,200 × 1,000 mm pallets. Free, in your browser.',
  alternates: { canonical: PATH },
  openGraph: openGraphFor(
    'Pallet calculator: cartons per pallet',
    'Cartons per layer and per pallet, loaded height and gross weight for US and euro pallets. Free, in your browser.',
    PATH,
  ),
};

/** Worked examples, computed by the same function the calculator uses. */
const EXAMPLES = [
  {
    name: 'Carton 40 × 30 × 30 cm, 12 kg',
    length: '40',
    width: '30',
    height: '30',
    weight: '12',
  },
  {
    name: 'Carton 60 × 40 × 40 cm, 18 kg',
    length: '60',
    width: '40',
    height: '40',
    weight: '18',
  },
] as const;

const EXAMPLE_PALLETS = PALLET_PRESETS.filter((preset) => preset.id !== 'gma');

const faq = PALLET_CALCULATOR_FAQ;

export default function PalletCalculatorPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>Pallet calculator</h1>
        <p className="lede">
          Cartons per pallet = cartons per layer × layers. Divide the deck by the carton both ways
          round for the layer, and the height you may load to, less the pallet itself, by the
          carton height for the layers; a weight limit can cap it lower. Enter your carton below
          for the count, loaded height and gross weight. It runs in your browser.
        </p>
      </section>

      <section className="section">
        <PalletCalculator />
      </section>

      <section className="section" aria-labelledby="examples-title">
        <h2 id="examples-title">Worked examples</h2>
        <p className="measure">
          Two common cartons on the two EPAL pallets, loaded to 1,800 mm including the pallet,
          within EPAL’s safe working load. Every carton upright and facing the same way in a layer.
        </p>
        <DataTable caption="Cartons per pallet for two example cartons, loaded to 1,800 mm">
          <thead>
            <tr>
              <th scope="col">Carton</th>
              {EXAMPLE_PALLETS.map((pallet) => (
                <th key={pallet.id} scope="col" className="numeric">
                  {pallet.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EXAMPLES.map((example) => (
              <tr key={example.name}>
                <th scope="row">{example.name}</th>
                {EXAMPLE_PALLETS.map((pallet) => {
                  const outcome = palletLoad({
                    cartonLength: example.length,
                    cartonWidth: example.width,
                    cartonHeight: example.height,
                    cartonUnit: 'cm',
                    cartonWeight: example.weight,
                    weightUnit: 'kg',
                    palletLength: pallet.length,
                    palletWidth: pallet.width,
                    palletHeight: pallet.height,
                    palletUnit: pallet.unit,
                    palletWeight: pallet.weightKg,
                    maxHeight: '1800',
                    maxLoad: pallet.safeWorkingLoadKg,
                  });
                  return (
                    <NumericCell
                      key={pallet.id}
                      value={
                        outcome.ok
                          ? `${outcome.result.cartonsPerPallet} (${outcome.result.perLayer} × ${outcome.result.layersUsed})`
                          : '—'
                      }
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </DataTable>
        <p className="muted measure">
          Figures are cartons per pallet, with cartons per layer × layers in brackets. For the
          pallet sizes themselves and where each figure comes from, see{' '}
          <Link className="text-link" href="/guides/pallet-sizes">
            standard pallet sizes
          </Link>
          ; for how many pallets fit a container, the{' '}
          <Link className="text-link" href="/tools/container-loading-calculator">
            container loading calculator
          </Link>
          .
        </p>
      </section>

      <section className="section" aria-labelledby="presets-title">
        <h2 id="presets-title">The pallet presets</h2>
        <ul className="measure">
          {PALLET_PRESETS.map((preset) => (
            <li key={preset.id}>
              <strong>{preset.label}</strong>: {preset.note}
            </li>
          ))}
        </ul>
        <p className="muted measure">
          ISO 6780 sets the principal dimensions and tolerances of flat pallets for intercontinental
          handling. Wooden pallets made from raw wood fall under ISPM 15, so ask your supplier for
          treated, marked pallets for export.
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
        <h2>From pallets to the packing list</h2>
        <p className="measure">
          Each pallet you build here is a line on the packing list: the cartons on it, its loaded
          height and its gross weight with the pallet. The packing list generator prints them, and
          with an account a shipment holds them once for every document in the set.
        </p>
        <ToolCta
          secondary={{ href: '/tools/packing-list-generator', label: 'Packing list generator' }}
        />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.palletCalculator} />
      <RelatedTools current={PATH} />
      <ToolJsonLd path={PATH} faq={faq} />
    </>
  );
}
