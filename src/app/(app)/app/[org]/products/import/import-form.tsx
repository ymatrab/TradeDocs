'use client';

import { useActionState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/primitives/button';
import { Field, Textarea } from '@/components/primitives/form';
import { Callout, Panel } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { importCatalog, type ImportState } from '@/app/(app)/master-data-actions';

/**
 * Import is a one-screen conversation: give us the file, and if anything is wrong get
 * back the row numbers as they appear in your own spreadsheet. Nothing is written unless
 * every row is acceptable, so there is never a half-imported catalog to reconcile.
 */
export function ImportForm({ org }: { org: string }) {
  const [state, action, pending] = useActionState<ImportState, FormData>(importCatalog, {});
  const form = useRef<HTMLFormElement>(null);

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <form ref={form} action={action} style={{ display: 'grid', gap: 20 }} noValidate>
        <input type="hidden" name="org" value={org} />

        {state.error ? (
          <Callout tone="danger" title="Nothing was imported" live>
            {state.error}
          </Callout>
        ) : null}
        {state.notice ? (
          <Callout tone="success" title="Catalog updated" live>
            {state.notice}{' '}
            <Link className="text-link" href={`/app/${org}/products`}>
              Open the catalog
            </Link>
            .
          </Callout>
        ) : null}
        {state.ignored && state.ignored.length > 0 ? (
          <Callout tone="warning" title="Some columns were not used">
            {state.ignored.join(', ')}. Everything else was read. Rename a column if it should have
            been imported.
          </Callout>
        ) : null}

        <div className="field">
          <label htmlFor="file">Choose a CSV file</label>
          <p className="hint" id="file-hint">
            Exported from a spreadsheet. Comma, semicolon and tab separated files are all accepted,
            as are quoted descriptions and European decimal commas.
          </p>
          <input
            type="file"
            id="file"
            name="file"
            accept=".csv,text/csv,text/plain"
            aria-describedby="file-hint"
          />
        </div>

        <Field
          id="text"
          label="Or paste the rows"
          requirement="Optional"
          hint="Include the heading row. Used only when no file is chosen."
          error={state.fields?.text}
        >
          {({ id, describedBy, invalid }) => (
            <Textarea
              id={id}
              name="text"
              rows={6}
              invalid={invalid}
              aria-describedby={describedBy}
              className="textarea data"
              placeholder={
                'sku,description,hs_code,origin,unit,unit price\nA-100,Cotton tea towel,630260,IN,pcs,2.40'
              }
            />
          )}
        </Field>

        <div>
          <Button type="submit" pending={pending} pendingLabel="Reading the file…">
            Import catalog
          </Button>
        </div>
      </form>

      {state.problems && state.problems.length > 0 ? (
        <Panel title="Rows to correct">
          <div style={{ display: 'grid', gap: 12 }}>
            <p className="muted">
              Row numbers count the products under your heading row, so row 1 is the first product.
              Fix these and import the file again.
            </p>
            <DataTable caption="Rows that were rejected" density="compact">
              <thead>
                <tr>
                  <th scope="col" className="numeric">
                    Row
                  </th>
                  <th scope="col">Problem</th>
                </tr>
              </thead>
              <tbody>
                {state.problems.map((problem) => (
                  <tr key={problem.row}>
                    <td className="numeric">{problem.row}</td>
                    <td>{problem.problem}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
