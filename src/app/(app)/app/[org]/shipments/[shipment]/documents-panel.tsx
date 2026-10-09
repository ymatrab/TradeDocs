'use client';

import { useActionState, useState } from 'react';
import { Download, Eye, FolderDown, RefreshCw } from 'lucide-react';
import { Button, LinkButton } from '@/components/primitives/button';
import { Field, Input, Select } from '@/components/primitives/form';
import { ConfirmButton } from '@/components/primitives/confirm';
import { Panel } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { ActionResult } from '@/components/primitives/action-result';
import { sent, useOutcomeToast } from '@/components/primitives/use-outcome-toast';
import { DocumentStatus, type DocumentState } from '@/components/document/status';
import {
  DOCUMENT_KINDS,
  documentKindGroupLabels,
  documentKindGroups,
  documentKindLabel,
  documentKindLabels,
  type DocumentKindGroup,
} from '@/lib/labels';
import { generateDocument, voidDocument } from '@/app/(app)/shipment-actions';
import {
  CERTIFICATE_OF_ORIGIN_NOTICE,
  isRegulatedDocumentKind,
  REGULATED_DOCUMENT_LIMITATION,
} from '@/lib/trade/regulated';
import type { ActionState } from '@/app/(app)/actions';

export type GeneratedDocument = {
  id: string;
  kind: string;
  number: string;
  status: string;
  /** The shipment revision the document was rendered from. */
  revision: number;
  stale: boolean;
  /** Why a stale document no longer matches the shipment. */
  reason?: string | null;
  /** Why a document was superseded or voided, as recorded. */
  statusReason?: string | null;
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
  canVoid = false,
}: {
  org: string;
  shipmentId: string;
  documents: GeneratedDocument[];
  /** The shipment's current revision, which a stale document is measured against. */
  revision: number;
  /** Regulated types are offered only once approved; the server refuses them regardless. */
  regulatedEnabled: boolean;
  /** Owners and administrators may void; the routine refuses everyone else regardless. */
  canVoid?: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(generateDocument, {});
  // Controlled, so the chosen type survives React's form reset after each generation.
  const [selectedKind, setSelectedKind] = useState<string>('commercial_invoice');
  const [voidState, voidAction, voidPending] = useActionState<ActionState, FormData>(
    voidDocument,
    {},
  );
  const kinds = DOCUMENT_KINDS.filter(
    (kind) => regulatedEnabled || !isRegulatedDocumentKind(kind),
  ).map((kind) => [kind, documentKindLabels[kind]] as const);
  // Grouped as a shipment's paperwork runs: the sale, the invoice and packing, the shipping.
  const groups = (Object.keys(documentKindGroupLabels) as DocumentKindGroup[]).map(
    (group) => [group, kinds.filter(([kind]) => documentKindGroups[kind] === group)] as const,
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
        <ActionResult state={{ notice: voidState.notice }} successTitle="Voided" />
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
                <Select
                  id={id}
                  name="kind"
                  value={selectedKind}
                  onChange={(event) => setSelectedKind(event.target.value)}
                >
                  {groups.map(([group, members]) => (
                    <optgroup key={group} label={documentKindGroupLabels[group]}>
                      {members.map(([kind, label]) => (
                        <option key={kind} value={kind}>
                          {label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <Button type="submit" tone="accent" pending={pending} pendingLabel="Generating…">
            Generate document
          </Button>
        </form>
        <div className="muted" style={{ display: 'grid', gap: 4 }}>
          <p style={{ margin: 0 }}>
            Preview before you generate. A preview carries no number and is marked as not issued.
          </p>
          {groups.map(([group, members]) => (
            <p key={group} style={{ margin: 0 }}>
              <span className="caption">{documentKindGroupLabels[group]}:</span>{' '}
              {members.map(([kind, label], index) => (
                <span key={kind}>
                  {index > 0 ? ' · ' : null}
                  <a
                    className="text-link"
                    href={`/api/shipments/${shipmentId}/preview?kind=${kind}`}
                    target="_blank"
                    rel="noopener"
                  >
                    <Eye size={13} aria-hidden="true" /> {label}
                  </a>
                </span>
              ))}
            </p>
          ))}
        </div>
        <p className="muted" style={{ margin: 0 }}>
          {regulatedEnabled ? CERTIFICATE_OF_ORIGIN_NOTICE : REGULATED_DOCUMENT_LIMITATION}
        </p>

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
                            {document.reason ??
                              `Rendered from revision ${document.revision}; the shipment is now at revision ${revision}.`}
                          </span>
                        ) : null}
                        {document.status !== 'final' && document.statusReason ? (
                          <span className="row-note">{document.statusReason}</span>
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
                          {canVoid && document.status === 'final' ? (
                            <>
                              <form id={`void-${document.id}`} action={voidAction}>
                                <input type="hidden" name="org" value={org} />
                                <input type="hidden" name="shipment" value={shipmentId} />
                                <input type="hidden" name="document" value={document.id} />
                              </form>
                              <ConfirmButton
                                form={`void-${document.id}`}
                                tone="quiet"
                                compact
                                trigger="Void"
                                triggerLabel={`Void ${document.number}`}
                                title={`Void ${document.number}?`}
                                description="A voided document stays in the history with your reason and can no longer be part of the set. This cannot be undone; generate a new revision if one is needed."
                                confirm="Void the document"
                                cancel="Keep it"
                                pending={voidPending}
                                error={voidState.fields?.reason ? undefined : voidState.error}
                                failed={Boolean(voidState.error)}
                              >
                                <Field
                                  id={`void-reason-${document.id}`}
                                  label="Reason"
                                  hint="Shown beside the document, such as “Issued in error”."
                                  error={voidState.fields?.reason}
                                >
                                  {({ id, describedBy, invalid }) => (
                                    <Input
                                      id={id}
                                      name="reason"
                                      form={`void-${document.id}`}
                                      maxLength={500}
                                      required
                                      invalid={invalid}
                                      aria-describedby={describedBy}
                                    />
                                  )}
                                </Field>
                              </ConfirmButton>
                            </>
                          ) : null}
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
