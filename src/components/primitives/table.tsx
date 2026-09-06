import type { ReactNode } from 'react';

export type Density = 'comfortable' | 'compact';

/**
 * Tables are the primary surface of this product, so the wrapper owns the
 * horizontal scroll: a narrow viewport keeps access to every column instead of
 * hiding cells that may carry legal status.
 */
export function DataTable({
  caption,
  density = 'comfortable',
  children,
}: {
  caption: string;
  density?: Density;
  children: ReactNode;
}) {
  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label={caption}>
      <table className={density === 'compact' ? 'table compact' : 'table'}>
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

/** Right-aligned, tabular-figure cell. The unit stays beside the number. */
export function NumericCell({ value, unit }: { value: string; unit?: string }) {
  return (
    <td className="numeric">
      {value}
      {unit ? <span className="unit">{unit}</span> : null}
    </td>
  );
}

/**
 * An absent value is stated, never blank: a blank cell cannot be told apart
 * from a rendering fault.
 */
export function EmptyValue({ label = 'Not provided' }: { label?: string }) {
  return (
    <span className="empty-value">
      <span aria-hidden="true">—</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
