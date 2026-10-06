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
  stack,
  children,
}: {
  caption: string;
  density?: Density;
  /**
   * Below 640px each row becomes a card, every cell captioned by its column. Cells
   * must carry `data-label` (NumericCell takes `label`). For tables a phone user has to
   * read row by row — goods, packages, documents — where scrolling sideways loses the
   * row's own name.
   */
  stack?: boolean;
  children: ReactNode;
}) {
  const classes = ['table', density === 'compact' ? 'compact' : '', stack ? 'stack' : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div
      className={stack ? 'table-scroll stacks' : 'table-scroll'}
      tabIndex={0}
      role="region"
      aria-label={caption}
    >
      <table className={classes}>
        <caption className="sr-only">{caption}</caption>
        {children}
      </table>
    </div>
  );
}

/** Right-aligned, tabular-figure cell. The unit stays beside the number. */
export function NumericCell({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  /** The column name, shown beside the figure when a stacked table becomes cards. */
  label?: string;
}) {
  return (
    <td className="numeric" data-label={label}>
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
