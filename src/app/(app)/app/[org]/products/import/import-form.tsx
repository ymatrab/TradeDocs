'use client';

import { useActionState, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, FileDown } from 'lucide-react';
import { Button, LinkButton } from '@/components/primitives/button';
import { Field, Textarea } from '@/components/primitives/form';
import { Callout, Panel } from '@/components/primitives/feedback';
import { DataTable, EmptyValue } from '@/components/primitives/table';
import { importCatalog, type ImportState } from '@/app/(app)/master-data-actions';
import { parseCatalog, readDecimal, type ImportColumn, type ImportRow } from '@/lib/csv';

/** The columns a preview shows, in the order an operator reads a product. */
const PREVIEW_COLUMNS: { column: ImportColumn; label: string; numeric?: boolean }[] = [
  { column: 'sku', label: 'Code' },
  { column: 'description', label: 'Description' },
  { column: 'hs_code', label: 'HS code' },
  { column: 'country_of_origin', label: 'Origin' },
  { column: 'unit', label: 'Unit' },
  { column: 'unit_price', label: 'Price', numeric: true },
  { column: 'net_weight_kg', label: 'Net kg', numeric: true },
  { column: 'gross_weight_kg', label: 'Gross kg', numeric: true },
];

const PREVIEW_ROWS = 50;

type Preview = {
  /** The import result current when this preview was read. */
  under: ImportState;
  source: 'file' | 'text';
  name?: string;
  rows: ImportRow[];
  ignored: string[];
  missingDescription: boolean;
};

/**
 * What the browser can already see is wrong with a row: a figure that is not a number.
 * The import itself is still the judge — it checks everything and writes nothing unless
 * every row passes — so this only flags early what it would refuse anyway.
 */
function earlyProblem(row: ImportRow): string | null {
  for (const { column, label, numeric } of PREVIEW_COLUMNS) {
    const value = row[column];
    if (numeric && value !== undefined && readDecimal(value) === null) {
      return `${label} “${value}” is not a number.`;
    }
  }
  return null;
}

function cellClass(column: ImportColumn, numeric?: boolean): string | undefined {
  if (numeric) return 'numeric';
  return column === 'description' ? undefined : 'data';
}

/**
 * Import is a one-screen conversation: give us the file, see the rows as they were read,
 * and if anything is wrong get back the row numbers as they appear in your own
 * spreadsheet, marked in that same preview. Nothing is written unless every row is
 * acceptable, so there is never a half-imported catalog to reconcile.
 */
export function ImportForm({ org }: { org: string }) {
  const [state, action, pending] = useActionState<ImportState, FormData>(importCatalog, {});
  const [preview, setPreview] = useState<Preview | null>(null);
  const form = useRef<HTMLFormElement>(null);

  const read = (text: string, source: Preview['source'], name?: string) => {
    if (!text.trim()) {
      setPreview(null);
      return;
    }
    const parsed = parseCatalog(text);
    setPreview({ under: state, source, name, ...parsed });
  };

  // A preview read before the latest result is the file that result is about: its rows
  // carry the result's problems. Once that file has imported cleanly it has done its job.
  const answered = preview !== null && preview.under !== state;
  const shown = answered && state.notice ? null : preview;
  const problemOf = new Map(
    answered ? (state.problems ?? []).map((problem) => [problem.row, problem.problem]) : [],
  );
  // Problems on rows the preview does not draw are still listed, below it.
  const drawn = shown ? Math.min(PREVIEW_ROWS, shown.rows.length) : 0;
  const unlisted = (state.problems ?? []).filter((problem) => !shown || problem.row > drawn);
  const flagged = shown
    ? shown.rows.filter((row, index) => problemOf.has(index + 1) || earlyProblem(row)).length
    : 0;

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

        <div className="import-start">
          <div className="field">
            <label htmlFor="file">Choose a CSV file</label>
            <p className="hint" id="file-hint">
              Exported from a spreadsheet. Comma, semicolon and tab separated files are all
              accepted, as are quoted descriptions and European decimal commas.
            </p>
            <input
              type="file"
              id="file"
              name="file"
              accept=".csv,text/csv,text/plain"
              aria-describedby="file-hint"
              className="file-input"
              onChange={async (event) => {
                const file = event.currentTarget.files?.[0];
                if (!file) {
                  setPreview(null);
                  return;
                }
                // Read only to show what the import will see; the file itself is what is
                // submitted. Past the import's own limit there is nothing useful to show.
                if (file.size > 2_000_000) {
                  setPreview(null);
                  return;
                }
                read(await file.text(), 'file', file.name);
              }}
            />
          </div>
          <LinkButton href="/api/catalog-template" tone="secondary" compact download>
            <FileDown size={15} aria-hidden="true" /> Download the template
          </LinkButton>
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
              onChange={(event) => {
                // A chosen file outranks pasted rows, as it does on import.
                const file = form.current?.querySelector<HTMLInputElement>('#file');
                if (file?.files?.length) return;
                read(event.currentTarget.value, 'text');
              }}
            />
          )}
        </Field>

        <div>
          <Button type="submit" pending={pending} pendingLabel="Reading the file…">
            Import catalog
          </Button>
        </div>
      </form>

      {shown ? (
        <Panel title={answered ? 'Rows as they were read' : 'Preview'}>
          <div style={{ display: 'grid', gap: 12 }}>
            {shown.missingDescription ? (
              <Callout tone="warning" title="No description column found">
                The heading row needs a description column (also read as product, product name,
                name or goods). Nothing below can be imported until it has one.
              </Callout>
            ) : (
              <p className="muted" style={{ margin: 0 }}>
                {shown.name ? (
                  <>
                    <span className="data">{shown.name}</span>:{' '}
                  </>
                ) : null}
                {shown.rows.length} {shown.rows.length === 1 ? 'product' : 'products'} read
                {flagged > 0 ? `, ${flagged} marked to correct` : ''}.
                {shown.ignored.length > 0
                  ? ` Not used: ${shown.ignored.join(', ')}.`
                  : ' Every column was recognised.'}
                {answered ? '' : ' Nothing is saved until you import.'}
              </p>
            )}
            {shown.rows.length > 0 ? (
              <DataTable caption="Products read from the file" density="compact">
                <thead>
                  <tr>
                    <th scope="col" className="numeric">
                      Row
                    </th>
                    {PREVIEW_COLUMNS.map(({ column, label, numeric }) => (
                      <th key={column} scope="col" className={numeric ? 'numeric' : undefined}>
                        {label}
                      </th>
                    ))}
                    <th scope="col">Check</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.rows.slice(0, PREVIEW_ROWS).map((row, index) => {
                    const problem = problemOf.get(index + 1) ?? earlyProblem(row);
                    return (
                      <tr key={index} className={problem ? 'row-flagged' : undefined}>
                        <td className="numeric">{index + 1}</td>
                        {PREVIEW_COLUMNS.map(({ column, numeric }) => (
                          <td key={column} className={cellClass(column, numeric)}>
                            {row[column] ?? <EmptyValue />}
                          </td>
                        ))}
                        <td>
                          {problem ? (
                            <span className="error-text">
                              <AlertCircle size={15} aria-hidden="true" />
                              {problem}
                            </span>
                          ) : (
                            <span className="muted">Looks fine</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </DataTable>
            ) : null}
            {shown.rows.length > PREVIEW_ROWS ? (
              <p className="muted" style={{ margin: 0 }}>
                Showing the first {PREVIEW_ROWS} rows; all {shown.rows.length} are imported.
              </p>
            ) : null}
          </div>
        </Panel>
      ) : null}

      {/* Problems on rows the preview cannot show: beyond its first rows, or every row
          when no preview was read (a file chosen before the page's script loaded). */}
      {unlisted.length > 0 ? (
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
                {unlisted.map((problem) => (
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
