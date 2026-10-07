import type { Metadata } from 'next';
import Link from 'next/link';
import { DataTable, NumericCell } from '@/components/primitives/table';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { decimal } from '@/lib/format';
import { openGraphFor } from '@/lib/seo/social';
import { CONTAINER_LOADING_FAQ } from '@/lib/tools/faq';
import { CONTAINERS } from '@/lib/trade/calculations';
import { containerLoading, LOADING_CONTAINERS } from '@/lib/trade/container-loading';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../page-parts';
import { ContainerLoadingCalculator } from './calculator';

const PATH = '/tools/container-loading-calculator';

export const metadata: Metadata = {
  title: 'Container loading calculator — cartons and pallets per 20ft, 40ft and 40ft HC',
  description:
    'Estimate how many cartons or pallets fit a 20ft, 40ft or 40ft high-cube container by volume and by weight, and how many containers a shipment needs. Free, and nothing leaves your browser.',
  alternates: { canonical: PATH },
  openGraph: openGraphFor(
    'Container loading calculator: cartons and pallets per container',
    'How many cartons or pallets fit a 20ft, 40ft or high-cube container, by volume and by weight. An estimate, free, in your browser.',
    PATH,
  ),
};

/** Worked examples, computed by the same function the calculator uses. */
const EXAMPLES = [
  {
    name: 'Carton 60 × 40 × 40 cm, 15 kg',
    length: '60',
    width: '40',
    height: '40',
    weight: '15',
  },
  {
    name: 'Euro pallet 120 × 80 × 150 cm, 600 kg',
    length: '120',
    width: '80',
    height: '150',
    weight: '600',
  },
] as const;

const faq = CONTAINER_LOADING_FAQ;

export default function ContainerLoadingPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>Container loading calculator</h1>
        <p className="lede">
          At most, a container takes its internal volume divided by the volume of one carton, or
          its payload divided by the weight of one carton, whichever is smaller. Enter one carton
          or pallet below for that ceiling in a 20ft, 40ft and 40ft high-cube container. It is an
          estimate, not a stow plan, and it runs in your browser.
        </p>
      </section>

      <section className="section">
        <ContainerLoadingCalculator />
      </section>

      <section className="section" aria-labelledby="examples-title">
        <h2 id="examples-title">Worked examples</h2>
        <p className="measure">
          The same arithmetic on two common units, at 100% usable volume. Read them as ceilings:
          the floor layout and stacking decide how close a real load gets.
        </p>
        <DataTable caption="Upper-bound units per container for two example units">
          <thead>
            <tr>
              <th scope="col">Unit</th>
              {LOADING_CONTAINERS.map((kind) => (
                <th key={kind} scope="col" className="numeric">
                  {CONTAINERS[kind].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EXAMPLES.map((example) => {
              const result = containerLoading({
                ...example,
                lengthUnit: 'cm',
                weightUnit: 'kg',
              });
              return (
                <tr key={example.name}>
                  <td>{example.name}</td>
                  {(result?.containers ?? []).map((option) => (
                    <NumericCell
                      key={option.kind}
                      value={`${decimal(option.units, 0)} (${option.limitedBy})`}
                    />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </DataTable>
        <p className="muted measure">
          The pallet row shows why these are ceilings: pallets 150 cm tall cannot go two high in any
          of these containers, and a single tier covers the floor long before the volume is used,
          so far fewer fit in practice. For the floor itself, see{' '}
          <Link className="text-link" href="/guides/pallet-sizes">
            pallet sizes
          </Link>{' '}
          and{' '}
          <Link className="text-link" href="/guides/shipping-container-sizes">
            shipping container sizes
          </Link>
          .
        </p>
      </section>

      <section className="section" aria-labelledby="figures-title">
        <h2 id="figures-title">The container figures it uses</h2>
        <DataTable caption="Typical internal volume and maximum payload">
          <thead>
            <tr>
              <th scope="col">Container</th>
              <th scope="col" className="numeric">
                Internal volume (m³)
              </th>
              <th scope="col" className="numeric">
                Maximum payload (kg)
              </th>
            </tr>
          </thead>
          <tbody>
            {LOADING_CONTAINERS.map((kind) => (
              <tr key={kind}>
                <td>{CONTAINERS[kind].label}</td>
                <NumericCell value={decimal(CONTAINERS[kind].volumeM3, 0)} />
                <NumericCell value={decimal(CONTAINERS[kind].payloadKg, 0)} />
              </tr>
            ))}
          </tbody>
        </DataTable>
        <p className="muted measure">
          Typical figures for steel dry containers as one carrier publishes them; individual boxes
          vary by series and carrier. For the volume of a mixed consignment, use the{' '}
          <Link className="text-link" href="/tools/cbm-calculator">
            CBM calculator
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
        <h2>Once the load is booked</h2>
        <p className="measure">
          The cartons you counted here end up on the packing list. With an account, a shipment
          holds the packages, weights and dimensions once, works out the volume, and prints the
          packing list and the commercial invoice from the same figures.
        </p>
        <ToolCta secondary={{ href: '/tools', label: 'All trade tools' }} />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.containerLoading} />
      <RelatedTools current={PATH} />
      <ToolJsonLd path={PATH} faq={faq} />
    </>
  );
}
