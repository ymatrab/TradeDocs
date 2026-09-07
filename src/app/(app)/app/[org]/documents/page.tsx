import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Download } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, EmptyState, Callout } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { DocumentStatus, type DocumentState } from '@/components/document/status';
import { LinkButton } from '@/components/primitives/button';
import { documentKindLabel } from '@/lib/labels';

export const metadata: Metadata = { title: 'Documents' };

const NOTHING_YET =
  'Documents are generated from a shipment, so that every one of them quotes the ' +
  'same figures. Open a shipment to produce its first.';

/**
 * Every document the organization has produced, newest first. A document's own
 * status outranks staleness: a superseded or voided revision is that, whether or
 * not the shipment has since moved on.
 */
function renderedState(status: string, stale: boolean): DocumentState {
  if (status === 'voided') return 'voided';
  if (status === 'superseded') return 'superseded';
  return stale ? 'stale' : 'final';
}

export default async function DocumentsPage({ params }: { params: Promise<{ org: string }> }) {
  const { org } = await params;
  const client = await createClient();

  const { data: organization } = await client
    .from('organizations')
    .select('id, name')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  const { data: documents } = await client
    .from('documents')
    .select('id, kind, number, status, shipment_id, shipment_revision, created_at')
    .eq('org_id', org)
    .order('created_at', { ascending: false });

  const { data: shipments } = await client
    .from('shipments')
    .select('id, reference, revision')
    .eq('org_id', org);
  const shipmentOf = new Map((shipments ?? []).map((row) => [row.id, row]));

  const rows = documents ?? [];

  return (
    <AppShell title="Documents" current="Documents" orgId={org}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 1040 }}>
        <Callout tone="legal" title="Preparation only">
          These documents are prepared from your own data. They are not issued, endorsed, certified
          or cleared by any authority.
        </Callout>

        <Panel title="Documents">
          {rows.length > 0 ? (
            <DataTable caption={`Documents prepared in ${organization.name}`}>
              <thead>
                <tr>
                  <th scope="col">Number</th>
                  <th scope="col">Type</th>
                  <th scope="col">Shipment</th>
                  <th scope="col">State</th>
                  <th scope="col">
                    <span className="sr-only">Download</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((document) => {
                  const shipment = shipmentOf.get(document.shipment_id);
                  const stale = document.shipment_revision < (shipment?.revision ?? 0);
                  return (
                    <tr key={document.id}>
                      <td className="data">{document.number}</td>
                      <td>{documentKindLabel(document.kind)}</td>
                      <td>
                        <Link
                          className="text-link data"
                          href={`/app/${org}/shipments/${document.shipment_id}`}
                        >
                          {shipment?.reference ?? 'Open'}
                        </Link>
                      </td>
                      <td>
                        <DocumentStatus state={renderedState(document.status, stale)} />
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
                  );
                })}
              </tbody>
            </DataTable>
          ) : (
            <EmptyState title="No documents yet" description={NOTHING_YET} />
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
