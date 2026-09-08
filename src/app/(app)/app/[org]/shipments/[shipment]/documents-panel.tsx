'use client';

import { useActionState } from 'react';
import { Download, FolderDown } from 'lucide-react';
import { Button, LinkButton } from '@/components/primitives/button';
import { Field, Select } from '@/components/primitives/form';
import { Panel } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { ActionResult } from '@/components/primitives/action-result';
import { DocumentStatus, type DocumentState } from '@/components/document/status';
import { documentKindLabel, documentKindLabels } from '@/lib/labels';
import { generateDocument } from '@/app/(app)/shipment-actions';
import type { ActionState } from '@/app/(app)/actions';

export type GeneratedDocument = {
  id: string;
  kind: string;
  number: string;
  status: string;
  stale: boolean;
};

/**
 * A document's own status outranks staleness: a superseded or voided revision is
 * that, whether or not the shipment has since moved on. Only a document the
 * schema still calls current can be reported as stale or final.
 */
function renderedState(document: GeneratedDocument): DocumentState {
  if (document.status === 'voided') return 'voided';
  if (document.status === 'superseded') return 'superseded';
  return document.stale ? 'stale' : 'final';
}

export function DocumentsPanel({
  org,
  shipmentId,
  documents,
}: {
  org: string;
  shipmentId: string;
  documents: GeneratedDocument[];
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(generateDocument, {});
  const current = documents.filter((document) => document.status === 'final' && !document.stale);

  return (
    <Panel
      title="Documents"
      actions={
        documents.length > 0 ? (
          <LinkButton
            href={`/api/shipments/${shipmentId}/documents.zip`}
            tone="secondary"
            compact
            download
          >
            <FolderDown size={15} aria-hidden="true" /> Download the set
          </LinkButton>
        ) : undefined
      }
    >
      <div style={{ display: 'grid', gap: 16 }}>
        <ActionResult state={state} />
        <form
          action={action}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}
        >
          <input type="hidden" name="org" value={org} />
          <input type="hidden" name="shipment" value={shipmentId} />
          <div style={{ minWidth: 220 }}>
            <Field id="kind" label="Document type">
              {({ id }) => (
                <Select id={id} name="kind" defaultValue="commercial_invoice">
                  {Object.entries(documentKindLabels).map(([kind, label]) => (
                    <option key={kind} value={kind}>
                      {label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <Button type="submit" tone="accent" pending={pending} pendingLabel="Generating…">
            Generate document
          </Button>
        </form>

        {documents.length > 0 ? (
          <>
            <DataTable caption="Documents generated from this shipment">
              <thead>
                <tr>
                  <th scope="col">Number</th>
                  <th scope="col">Type</th>
                  <th scope="col">State</th>
                  <th scope="col">
                    <span className="sr-only">Download</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td className="data">{document.number}</td>
                    <td>{documentKindLabel(document.kind)}</td>
                    <td>
                      <DocumentStatus state={renderedState(document)} />
                    </td>
                    <td>
                      <LinkButton
                        href={`/api/documents/${document.id}`}
                        tone="secondary"
                        compact
                        download
                      >
                        <Download size={15} aria-hidden="true" /> PDF
                      </LinkButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className="muted" style={{ marginBottom: 0 }}>
              {current.length > 0
                ? `The set downloads ${current.length} current ${current.length === 1 ? 'document' : 'documents'} with a manifest of their checksums. Stale, superseded and voided revisions stay out of it and remain downloadable one at a time.`
                : 'Every document here is stale, superseded or voided, so the set download would be empty. Generate current revisions first.'}
            </p>
          </>
        ) : (
          <p className="muted" style={{ marginBottom: 0 }}>
            No documents yet. Generate one once the shipment has at least one line.
          </p>
        )}
      </div>
    </Panel>
  );
}
