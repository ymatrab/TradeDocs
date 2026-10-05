'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { decimal, money } from '@/lib/format';
import { currencyMinorUnits, lineTotal } from '@/lib/money';
import { chargeableWeight, volumeOf } from '@/lib/trade/calculations';

export type BenchToolId = 'invoice' | 'cbm' | 'weight' | 'incoterms';

export type BenchTool = {
  id: BenchToolId;
  href: string;
  /** The short mark drawn as the column's numeral: CBM, KG, INCO, INV. */
  mark: string;
  name: string;
  detail: string;
};

export type BenchIncoterm = { code: string; name: string; riskPasses: string };

/** The example carton and unit price each preview states in its own label. */
const CARTON = { length: 40, width: 30, height: 20 } as const;
const UNIT_PRICE = '12.50';
const CURRENCY = 'USD';

/** A non-negative finite number, or null for anything a visitor has not finished typing. */
function amount(raw: string): number | null {
  if (raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

/**
 * The four free tools as one bench: each column a large mark, one live field and its
 * result, worked out by the same domain functions the full tools use. Nothing typed here
 * leaves the browser. The figures are examples a visitor can change, labelled as such,
 * never a quotation.
 */
export function ToolBench({
  tools,
  incoterms,
}: {
  tools: readonly BenchTool[];
  incoterms: readonly BenchIncoterm[];
}) {
  return (
    <div className="bench">
      {tools.map((tool) => (
        <BenchColumn key={tool.id} tool={tool} incoterms={incoterms} />
      ))}
    </div>
  );
}

function BenchColumn({
  tool,
  incoterms,
}: {
  tool: BenchTool;
  incoterms: readonly BenchIncoterm[];
}) {
  const id = useId();
  return (
    <article className="bench-col" aria-labelledby={`${id}-name`}>
      <span className="bench-mark" aria-hidden="true">{tool.mark}</span>
      <h3 id={`${id}-name`} className="bench-name">
        <Link href={tool.href}>
          {tool.name} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </h3>
      <p className="bench-detail">{tool.detail}</p>
      <Preview id={id} tool={tool.id} incoterms={incoterms} />
    </article>
  );
}

/** What each preview starts on, so the bench shows a worked result before anything is typed. */
const STARTING_VALUE: Record<BenchToolId, string> = {
  cbm: '50',
  weight: '2',
  invoice: '100',
  incoterms: 'FOB',
};

/** The one field a preview offers, and what its value works out to. */
function worked(tool: Exclude<BenchToolId, 'incoterms'>, raw: string) {
  const value = amount(raw);
  if (tool === 'cbm') {
    return {
      label: `Cartons of ${CARTON.length} × ${CARTON.width} × ${CARTON.height} cm`,
      caption: 'Volume',
      figure:
        value === null
          ? '—'
          : `${decimal(volumeOf([{ ...CARTON, count: value }], 'cm').totalVolumeM3, 3)} m³`,
    };
  }
  if (tool === 'weight') {
    return {
      label: 'Volume in m³, by air (IATA)',
      caption: 'Volumetric weight',
      figure:
        value === null
          ? '—'
          : `${decimal(chargeableWeight(value, 0, 'air_iata').volumetricWeightKg, 2)} kg`,
    };
  }
  return {
    label: `Quantity at ${UNIT_PRICE} ${CURRENCY} each`,
    caption: 'Line total',
    figure:
      value === null
        ? '—'
        : money(lineTotal(value, UNIT_PRICE, currencyMinorUnits(CURRENCY)).toString(), CURRENCY),
  };
}

function Preview({
  id,
  tool,
  incoterms,
}: {
  id: string;
  tool: BenchToolId;
  incoterms: readonly BenchIncoterm[];
}) {
  const [value, setValue] = useState(STARTING_VALUE[tool]);
  const field = `${id}-field`;
  const result = `${id}-result`;

  if (tool === 'incoterms') {
    const rule = incoterms.find((entry) => entry.code === value);
    return (
      <div className="bench-preview">
        <label htmlFor={field}>Rule</label>
        <select
          id={field}
          className="select"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-describedby={result}
        >
          {incoterms.map((entry) => (
            <option key={entry.code} value={entry.code}>
              {entry.code} · {entry.name}
            </option>
          ))}
        </select>
        <output id={result} htmlFor={field} className="bench-result small">
          <span className="caption">Risk passes</span>
          <span>{rule ? rule.riskPasses : '—'}</span>
        </output>
      </div>
    );
  }

  const spec = worked(tool, value);
  return (
    <div className="bench-preview">
      <label htmlFor={field}>{spec.label}</label>
      <input
        id={field}
        className="input data"
        inputMode="decimal"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-describedby={result}
      />
      <output id={result} htmlFor={field} className="bench-result">
        <span className="caption">{spec.caption}</span>
        <span className="bench-figure">{spec.figure}</span>
      </output>
    </div>
  );
}
