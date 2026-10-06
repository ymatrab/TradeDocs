import { AlertTriangle, CheckCircle2, Circle, MinusCircle } from 'lucide-react';
import { ShipmentStatus } from '@/components/document/status';
import { decimal, quantity as showQuantity } from '@/lib/format';

export type StepState = 'done' | 'todo' | 'check' | 'optional';

export type BuilderStep = {
  /** The id of the panel the step jumps to. */
  target: string;
  title: string;
  state: StepState;
  /** One short line on where the step stands, from the data. */
  detail: string;
};

const stateWord: Record<StepState, string> = {
  done: 'Done',
  todo: 'To do',
  check: 'Check',
  optional: 'Optional',
};

const stateIcon = {
  done: CheckCircle2,
  todo: Circle,
  check: AlertTriangle,
  optional: MinusCircle,
} as const;

/**
 * The order a shipment is assembled in — parties, goods, packing, documents — as links
 * down the one screen, each saying where it stands. The panels stay on one page because
 * they are parts of one record; the steps only make the order and the gaps visible.
 *
 * Every state is a word and a glyph, never colour alone.
 */
export function ShipmentSteps({ steps }: { steps: readonly BuilderStep[] }) {
  return (
    <nav aria-label="Shipment steps" className="builder-steps">
      <ol>
        {steps.map((step, index) => {
          const Icon = stateIcon[step.state];
          return (
            <li key={step.target} className={`builder-step ${step.state}`}>
              <a href={`#${step.target}`}>
                <span className="builder-step-head">
                  <span className="builder-step-ordinal">{index + 1}</span>
                  <span className="builder-step-title">{step.title}</span>
                </span>
                <span className="builder-step-state">
                  <Icon size={14} aria-hidden="true" />
                  {stateWord[step.state]}
                  <span className="builder-step-detail"> · {step.detail}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export type SummaryFigures = {
  reference: string;
  status: string;
  revision: number;
  currency: string;
  lines: number;
  quantity: number;
  net: number;
  /** Null until a package is described: a gross weight of zero would be a claim. */
  gross: number | null;
  volume: number | null;
  packages: number;
  value: string;
};

/**
 * The totals every document in the set will quote, beside the work on wide screens so
 * they move as lines and packages are added; above it on narrower ones. Not a live
 * region: each action already announces its own outcome, and reading six changed
 * figures after every line would bury it.
 */
export function ShipmentSummary({ figures }: { figures: SummaryFigures }) {
  const rows: { label: string; value: string; unit?: string }[] = [
    { label: 'Lines', value: String(figures.lines) },
    { label: 'Quantity', value: showQuantity(figures.quantity) },
    { label: 'Net weight', value: decimal(figures.net, 3), unit: 'kg' },
    {
      label: 'Gross weight',
      value: figures.gross === null ? '—' : decimal(figures.gross, 3),
      unit: figures.gross === null ? undefined : 'kg',
    },
    {
      label: 'Volume',
      value: figures.volume === null ? '—' : decimal(figures.volume, 3),
      unit: figures.volume === null ? undefined : 'm³',
    },
    { label: 'Packages', value: String(figures.packages) },
  ];
  return (
    <aside className="builder-summary" aria-label="Shipment summary">
      <div className="builder-summary-head">
        <p className="caption">Shipment</p>
        <p className="builder-summary-ref data">{figures.reference}</p>
        <div className="builder-summary-meta">
          <ShipmentStatus state={figures.status} />
          <span className="caption">
            Rev. {figures.revision} · {figures.currency}
          </span>
        </div>
      </div>
      <dl className="builder-summary-figures">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="caption">{row.label}</dt>
            <dd>
              {row.value}
              {row.unit ? <span className="unit">{row.unit}</span> : null}
            </dd>
          </div>
        ))}
        <div className="builder-summary-total">
          <dt className="caption">Total value</dt>
          <dd>
            {figures.value}
            <span className="unit">{figures.currency}</span>
          </dd>
        </div>
      </dl>
    </aside>
  );
}
