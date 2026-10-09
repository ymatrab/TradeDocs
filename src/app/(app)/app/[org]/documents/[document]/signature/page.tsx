import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Download } from 'lucide-react';
import { AppShell } from '@/components/shell/app';
import { Callout, EmptyState, Panel } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { LinkButton } from '@/components/primitives/button';
import { hasEntitlement } from '@/lib/billing/server';
import { parseStoredSigners } from '@/lib/esign/callback';
import { currentEsignConfig } from '@/lib/esign/server';
import { documentKindLabel } from '@/lib/labels';
import { MAX_ESIGN_MESSAGE, MAX_ESIGN_SIGNERS } from '@/lib/limits';
import { createClient } from '@/lib/supabase/server';
import { SendForSignatureForm } from './send-form';

export const metadata: Metadata = { title: 'E-signature' };

const REQUEST_STATUS: Record<string, string> = {
  sending: 'Sending',
  sent: 'Out for signature',
  signed: 'Signed',
  declined: 'Declined',
  cancelled: 'Cancelled',
  expired: 'Expired',
  error: 'Provider error',
  failed: 'Not sent',
};

const SIGNER_STATUS: Record<string, string> = {
  awaiting_signature: 'awaiting signature',
  signed: 'signed',
  declined: 'declined',
  error: 'error',
  unknown: 'status unknown',
};

function formatTime(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) +
        ' UTC';
}

/**
 * Sending one finalized document for e-signature through Dropbox Sign (D-025), and the
 * requests already sent for it.
 *
 * Every state is said plainly: not available yet (no provider connected), part of Pro and
 * Team, a document that cannot be sent (superseded, voided or stale), or the form. The
 * server action decides each case again.
 */
export default async function SignaturePage({
  params,
}: {
  params: Promise<{ org: string; document: string }>;
}) {
  const { org, document: documentId } = await params;
  const client = await createClient();

  const { data: organization } = await client
    .from('organizations')
    .select('id, name')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  const { data: document } = await client
    .from('documents')
    .select('id, kind, number, status, shipment_id, shipment_revision')
    .eq('id', documentId)
    .eq('org_id', org)
    .maybeSingle();
  if (!document) notFound();

  const [{ data: shipment }, { data: requests, error: requestsError }, entitled] =
    await Promise.all([
      client.from('shipments').select('revision').eq('id', document.shipment_id).maybeSingle(),
      client
        .from('esign_requests')
        .select(
          'id, status, test_mode, signers, signed_object_path, signed_stored_at, created_at, failure_reason',
        )
        .eq('document_id', document.id)
        .order('created_at', { ascending: false }),
      hasEntitlement(org, 'esign'),
    ]);

  const config = currentEsignConfig();
  const available = config.state === 'ready';
  const stale = !shipment || shipment.revision !== document.shipment_revision;
  const sendable = document.status === 'final' && !stale;
  const kind = documentKindLabel(document.kind);
  const history = requests ?? [];

  return (
    <AppShell title={`E-signature · ${document.number}`} current="Documents" orgId={org}>
      <div className="app-page wide">
        <p>
          <Link className="text-link" href={`/app/${org}/documents`}>
            Back to documents
          </Link>
        </p>

        {available || history.length > 0 ? (
          <Callout tone="legal" title="Signature provided by Dropbox Sign">
            The electronic signature is provided by Dropbox Sign, which emails each signer, records
            their signature and produces the signed PDF. TradeDocs prepares the document and passes
            it to Dropbox Sign; it does not verify a signer’s identity beyond what Dropbox Sign
            does, and it does not certify the document. This is separate from the signature image
            (PDF branding) printed on your documents.
          </Callout>
        ) : null}

        <Panel title={`Send ${kind.toLowerCase()} ${document.number} for signature`}>
          {!available ? (
            <EmptyState
              title="E-signature not available yet"
              description="Sending documents for electronic signature is not switched on for this workspace yet. You can still download the PDF and sign it the way you do today."
              action={
                <LinkButton href={`/api/documents/${document.id}`} tone="secondary" download>
                  <Download size={15} aria-hidden="true" /> Download PDF
                </LinkButton>
              }
            />
          ) : !entitled ? (
            <Callout tone="neutral" title="E-signature is part of Pro and Team">
              Sending documents for signature through Dropbox Sign comes with Pro and Team. See{' '}
              <Link className="text-link" href={`/app/${org}/billing`}>
                Billing
              </Link>{' '}
              for this organization’s plan.
            </Callout>
          ) : !sendable ? (
            <Callout tone="warning" title="This document cannot be sent">
              {document.status !== 'final'
                ? `This document is ${document.status}. Only the current final document can be sent for signature.`
                : 'The shipment changed after this document was generated. Regenerate it from the shipment, then send the new one.'}
            </Callout>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {config.testMode ? (
                <Callout tone="warning" title="Test mode">
                  Requests from this workspace are sent in Dropbox Sign test mode. A test request is
                  not legally binding.
                </Callout>
              ) : null}
              <SendForSignatureForm
                org={org}
                document={document.id}
                maxSigners={MAX_ESIGN_SIGNERS}
                maxMessage={MAX_ESIGN_MESSAGE}
                testMode={config.testMode}
              />
            </div>
          )}
        </Panel>

        <Panel title="Signature requests">
          {requestsError ? (
            <Callout tone="warning" title="Requests could not be loaded">
              Reload the page to try again.
            </Callout>
          ) : history.length === 0 ? (
            <p className="muted">No signature requests for this document yet.</p>
          ) : (
            <DataTable caption={`Signature requests for ${document.number}`} stack>
              <thead>
                <tr>
                  <th scope="col">Sent</th>
                  <th scope="col">Status</th>
                  <th scope="col">Signers</th>
                  <th scope="col">
                    <span className="sr-only">Signed copy</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((request) => {
                  const signers = parseStoredSigners(request.signers);
                  return (
                    <tr key={request.id}>
                      <td className="stack-title">{formatTime(request.created_at)}</td>
                      <td data-label="Status">
                        {REQUEST_STATUS[request.status] ?? request.status}
                        {request.test_mode ? (
                          <span className="row-note">Test request, not legally binding</span>
                        ) : null}
                        {request.status === 'signed' && !request.signed_object_path ? (
                          <span className="row-note">
                            Dropbox Sign is preparing the signed copy.
                          </span>
                        ) : null}
                      </td>
                      <td data-label="Signers">
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {signers.map((signer) => (
                            <li key={signer.email}>
                              {signer.name} ({signer.email}):{' '}
                              {SIGNER_STATUS[signer.status] ?? signer.status}
                              {signer.signed_at ? `, ${formatTime(signer.signed_at)}` : ''}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="stack-actions">
                        {request.signed_object_path ? (
                          <LinkButton
                            href={`/api/esign/${request.id}/signed`}
                            tone="secondary"
                            compact
                          >
                            <Download size={15} aria-hidden="true" /> Signed PDF
                            <span className="sr-only"> of {document.number}</span>
                          </LinkButton>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DataTable>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
