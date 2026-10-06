'use client';

import { useActionState } from 'react';
import { Download, FolderDown, RefreshCw } from 'lucide-react';
import { Button, LinkButton } from '@/components/primitives/button';
import { Field, Select } from '@/components/primitives/form';
import { Panel } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { ActionResult } from '@/components/primitives/action-result';
import { sent, useOutcomeToast } from '@/components/primitives/use-outcome-toast';
import { DocumentStatus, type DocumentState } from '@/components/document/status';
import { documentKindLabel, documentKindLabels } from '@/lib/labels';
import { generateDocument } from '@/app/(app)/shipment-actions';
import { isRegulatedDocumentKind, REGULATED_DOCUMENT_LIMITATION } from '@/lib/trade/regulated';
import type { ActionState } from '@/app/(app)/actions';

export type GeneratedDocument = {
  id: string;
  kind: string;
  number: string;
  status: string;
  /** The shipment revision the document was rendered from. */
  revision: number;
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
  revision,
  regulatedEnabled,
}: {
  org: string;
  shipmentId: string;
  documents: GeneratedDocument[];
  /** The shipment's current revision, which a stale document is measured against. */
  revision: number;
  /** Regulated types are offered only once approved; the server refuses them regardless. */
  regulatedEnabled: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(generateDocument, {});
  const kinds = Object.entries(documentKindLabels).filter(
    ([kind]) => regulatedEnabled || !isRegulatedDocumentKind(kind),
  );
  const current = documents.filter((document) => document.status === 'final' && !document.stale);
  const remember = useOutcomeToast(state, (submitted) => {
    const kind = sent(submitted, 'kind');
    return `${kind ? documentKindLabel(kind) : 'The document'} is ready to download.`;
  });
  // A kind regenerated once already has a current copy; its older stale copy needs no
  // second offer to regenerate.
  const currentKinds = new Set(current.map((document) => document.kind));

  return (
    <Panel
      title="Documents"
      id="documents"
      actions={
        current.length > 0 ? (
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
          onSubmit={remember}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}
        >
          <input type="hidden" name="org" value={org} />
          <input type="hidden" name="shipment" value={shipmentId} />
          <div style={{ minWidth: 220 }}>
            <Field id="kind" label="Document type">
              {({ id }) => (
                <Select id={id} name="kind" defaultValue="commercial_invoice">
                  {kinds.map(([kind, label]) => (
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
        {regulatedEnabled ? null : (
          <p className="muted" style={{ margin: 0 }}>
            {REGULATED_DOCUMENT_LIMITATION}
          </p>
        )}

        {documents.length > 0 ? (
          <>
            <DataTable caption="Documents generated from this shipment" stack>
              <thead>
                <tr>
                  <th scope="col">Number</th>
                  <th scope="col">Type</th>
                  <th scope="col">State</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => {
                  const shown = renderedState(document);
                  const label = documentKindLabel(document.kind);
                  // Offered only where the server would accept it: a regulated kind
                  // stays refused until its review is approved.
                  const offerRegenerate =
                    shown === 'stale' &&
                    !currentKinds.has(document.kind) &&
                    (regulatedEnabled || !isRegulatedDocumentKind(document.kind));
                  return (
                    <tr key={document.id}>
                      <td className="data stack-title">{document.number}</td>
                      <td data-label="Type">{label}</td>
                      <td data-label="State">
                        <DocumentStatus state={shown} />
                        {shown === 'stale' ? (
                          <span className="row-note">
                            Rendered from revision {document.revision}; the shipment is now at
                            revision {revision}.
                          </span>
                        ) : null}
                      </td>
                      <td className="stack-actions">
                        <div className="row-actions">
                          {offerRegenerate ? (
                            <form action={action} onSubmit={remember}>
                              <input type="hidden" name="org" value={org} />
                              <input type="hidden" name="shipment" value={shipmentId} />
                              <input type="hidden" name="kind" value={document.kind} />
                              <Button
                                type="submit"
                                tone="accent"
                                compact
                                pending={pending}
                                pendingLabel="Regenerating…"
                              >
                                <RefreshCw size={15} aria-hidden="true" /> Regenerate
                                <span className="sr-only"> the {label.toLowerCase()}</span>
                              </Button>
                            </form>
                          ) : null}
                          <LinkButton
                            href={`/api/documents/${document.id}`}
                            tone={shown === 'final' ? 'secondary' : 'quiet'}
                            compact
                            download
                          >
                            <Download size={15} aria-hidden="true" /> PDF
                            <span className="sr-only"> of {document.number}</span>
                          </LinkButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
