import type { ReactNode } from 'react';
import { EmptyValue } from '@/components/primitives/table';

/**
 * The product's signature primitive.
 *
 * A bill of lading or a certificate of origin is a grid of numbered, bordered
 * boxes, each captioned in its corner. Building the workspace from the same
 * grid means the screen a user fills in and the document they print share one
 * structure, so a field can be discussed by its box number in either place.
 */
export function BoxGrid({ children, label }: { children: ReactNode; label: string }) {
  return (
    <section className="box-grid" aria-label={label}>
      {children}
    </section>
  );
}

export function FieldBox({
  ordinal,
  caption,
  value,
  wide,
  children,
}: {
  /** The box number printed on the corresponding document, when it has one. */
  ordinal?: string;
  caption: string;
  value?: string;
  wide?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={wide ? 'field-box span-2' : 'field-box'}>
      <div className="field-box-head">
        {ordinal ? <span className="field-box-ordinal">{ordinal}</span> : null}
        <span className="caption">{caption}</span>
      </div>
      <div className="field-box-value">{children ?? value ?? <EmptyValue />}</div>
    </div>
  );
}
