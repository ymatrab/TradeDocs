import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';

export type CalloutTone = 'neutral' | 'legal' | 'warning' | 'danger' | 'success';

const calloutIcon = {
  neutral: Info,
  legal: ShieldAlert,
  warning: AlertTriangle,
  danger: AlertTriangle,
  success: CheckCircle2,
} as const;

/**
 * Carries trust, security and legal disclosure. The `legal` tone is the one
 * that states what a prepared document is and is not; it must never be styled
 * away or reduced to colour alone.
 */
export function Callout({
  tone = 'neutral',
  title,
  /** Set so the callout does not skip a level in its surrounding outline. */
  level = 3,
  children,
}: {
  tone?: CalloutTone;
  title: string;
  level?: 2 | 3 | 4;
  children: ReactNode;
}) {
  const Icon = calloutIcon[tone];
  const Heading: 'h2' | 'h3' | 'h4' = `h${level}`;
  return (
    <div className={tone === 'neutral' ? 'callout' : `callout ${tone}`}>
      <Icon size={18} aria-hidden="true" />
      <div>
        <Heading>{title}</Heading>
        <p className="muted">{children}</p>
      </div>
    </div>
  );
}

export function Panel({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2 className="caption">{title}</h2>
        {actions}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}

/** An empty screen is an invitation to act, so it always carries the action. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="state">
      <h3>{title}</h3>
      <p className="muted">{description}</p>
      {action}
    </div>
  );
}

/** States what failed and what to do next, in the interface's voice. */
export function ErrorState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="state" role="alert">
      <AlertTriangle size={22} aria-hidden="true" />
      <h3>{title}</h3>
      <p className="muted">{description}</p>
      {action}
    </div>
  );
}

export function Skeleton({ width = '100%', height = 14 }: { width?: string; height?: number }) {
  return (
    <span className="skeleton" style={{ width, height, display: 'block' }} aria-hidden="true" />
  );
}

/** Announces that a region is loading without moving focus. */
export function LoadingBlock({ label, lines = 3 }: { label: string; lines?: number }) {
  return (
    <div aria-busy="true" aria-live="polite" style={{ display: 'grid', gap: 10 }}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} width={index === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}
