'use client';

import { useActionState, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { PackagePlus } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Field, Input } from '@/components/primitives/form';
import { ActionResult } from '@/components/primitives/action-result';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { decimal } from '@/lib/format';
import { addFromCatalog } from '@/app/(app)/master-data-actions';
import type { ActionState } from '@/app/(app)/actions';

export type CatalogEntry = {
  id: string;
  sku: string | null;
  description: string;
  hs_code: string | null;
  unit: string;
  unit_price: number;
};

function label(entry: CatalogEntry): string {
  return entry.sku ? `${entry.sku} — ${entry.description}` : entry.description;
}

/**
 * Adds a line by choosing a saved product and stating a quantity.
 *
 * The list is filtered here rather than on the server: a catalog is a few hundred rows,
 * it is already loaded to render the page, and a round trip between keystrokes would make
 * the one interaction this product exists to speed up feel slower than retyping.
 *
 * Only the id and the quantity are submitted. The values are copied from the catalog
 * inside the database, so what lands on the line cannot be a mixture of two versions of
 * a product that was edited while this form sat open.
 */
export function CatalogPicker({
  org,
  shipmentId,
  catalog,
}: {
  org: string;
  shipmentId: string;
  catalog: CatalogEntry[];
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(addFromCatalog, {});
  const [term, setTerm] = useState('');
  const [chosen, setChosen] = useState<CatalogEntry | null>(null);
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  const matches = useMemo(() => {
    const needle = term.trim().toLowerCase();
    if (!needle) return catalog.slice(0, 8);
    return catalog
      .filter(
        (entry) =>
          entry.description.toLowerCase().includes(needle) ||
          (entry.sku ?? '').toLowerCase().includes(needle),
      )
      .slice(0, 8);
  }, [catalog, term]);

  if (catalog.length === 0) {
    return (
      <p className="muted" style={{ marginBottom: 0 }}>
        Your catalog is empty.{' '}
        <Link className="text-link" href={`/app/${org}/products`}>
          Save the goods you ship
        </Link>{' '}
        and adding a line becomes a quantity instead of a form.
      </p>
    );
  }

  return (
    <form ref={form} action={action} style={{ display: 'grid', gap: 16 }} noValidate>
      <input type="hidden" name="org" value={org} />
      <input type="hidden" name="shipment" value={shipmentId} />
      <input type="hidden" name="product" value={chosen?.id ?? ''} />

      <ActionResult state={state} successTitle="Added" />

      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          alignItems: 'start',
        }}
      >
        <Field
          id="catalog-filter"
          label="Find a product"
          hint="Search the description or the product code."
          error={state.fields?.product}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              type="search"
              autoComplete="off"
              value={chosen ? label(chosen) : term}
              invalid={invalid}
              aria-describedby={describedBy}
              onChange={(event) => {
                setChosen(null);
                setTerm(event.target.value);
              }}
            />
          )}
        </Field>
        <Field id="catalog-quantity" label="Quantity" error={state.fields?.quantity}>
          {({ id, invalid }) => (
            <Input
              id={id}
              name="quantity"
              type="number"
              step="0.001"
              min="0.001"
              defaultValue="1"
              invalid={invalid}
            />
          )}
        </Field>
      </div>

      {chosen ? (
        <p className="muted" style={{ margin: 0 }}>
          Adding <strong>{chosen.description}</strong> at {decimal(chosen.unit_price, 4)} per{' '}
          {chosen.unit}
          {chosen.hs_code ? `, HS ${chosen.hs_code}` : ''}. The line keeps these values even if the
          catalog changes later.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 6 }}>
          <p className="caption" style={{ margin: 0 }}>
            {term.trim() ? `Matches for “${term.trim()}”` : 'Recently in the catalog'}
          </p>
          {matches.length > 0 ? (
            <ul style={{ display: 'grid', gap: 4, listStyle: 'none', margin: 0, padding: 0 }}>
              {matches.map((entry) => (
                <li key={entry.id}>
                  <Button
                    type="button"
                    tone="quiet"
                    compact
                    block
                    onClick={() => setChosen(entry)}
                    style={{ justifyContent: 'space-between', textAlign: 'left' }}
                  >
                    <span>{label(entry)}</span>
                    <span className="data">
                      {decimal(entry.unit_price, 4)} / {entry.unit}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted" style={{ margin: 0 }}>
              Nothing in the catalog matches that.
            </p>
          )}
        </div>
      )}

      <div>
        <Button
          type="submit"
          tone="secondary"
          disabled={!chosen}
          pending={pending}
          pendingLabel="Adding…"
        >
          <PackagePlus size={16} aria-hidden="true" />
          Add from catalog
        </Button>
      </div>
    </form>
  );
}
