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

const filters = [
  { value: 'all', label: 'All' },
  { value: 'attention', label: 'Needs attention' },
  { value: 'current', label: 'Current' },
] as const;

type Filter = (typeof filters)[number]['value'];

export default async function DocumentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ org: string }>;
  searchParams: Promise<{ show?: string }>;
}) {
  const { org } = await params;
  const { show } = await searchParams;
  const filter: Filter = show === 'attention' || show === 'current' ? show : 'all';
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

  // Each document's displayed state, worked out once for the filter and the table alike.
  const all = (documents ?? []).map((document) => {
    const shipment = shipmentOf.get(document.shipment_id);
    const stale = document.shipment_revision < (shipment?.revision ?? 0);
    return { ...document, shipment, shown: renderedState(document.status, stale) };
  });
  const attention = all.filter((document) => document.shown === 'stale').length;
  const rows = all.filter((document) =>
    filter === 'attention'
      ? document.shown === 'stale'
      : filter === 'current'
        ? document.shown === 'final'
        : true,
  );
  const base = `/app/${org}/documents`;

  return (
    <AppShell title="Documents" current="Documents" orgId={org}>
      <div className="app-page wide">
        <Callout tone="legal" title="Preparation only">
          These documents are prepared from your own data. They are not issued, endorsed, certified
          or cleared by any authority.
        </Callout>

        <Panel
          title="Documents"
          actions={
            all.length > 0 ? (
              <nav aria-label="Filter documents" className="filter-chips">
                {filters.map((option) => (
                  <Link
                    key={option.value}
                    href={option.value === 'all' ? base : `${base}?show=${option.value}`}
                    aria-current={filter === option.value ? 'page' : undefined}
                    className="filter-chip"
                  >
                    {option.label}
                    {option.value === 'attention' ? (
                      <span className="filter-count">{attention}</span>
                    ) : null}
                  </Link>
                ))}
              </nav>
            ) : undefined
          }
        >
          {rows.length > 0 ? (
            <DataTable caption={`Documents prepared in ${organization.name}`} stack>
              <thead>
                <tr>
                  <th scope="col">Number</th>
                  <th scope="col">Type</th>
                  <th scope="col">Shipment</th>
                  <th scope="col">State</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((document) => (
                  <tr key={document.id}>
                    <td className="data stack-title">{document.number}</td>
                    <td data-label="Type">{documentKindLabel(document.kind)}</td>
                    <td data-label="Shipment">
                      <Link
                        className="text-link data"
                        href={`/app/${org}/shipments/${document.shipment_id}`}
                      >
                        {document.shipment?.reference ?? 'Open'}
                      </Link>
                    </td>
                    <td data-label="State">
                      <DocumentStatus state={document.shown} />
                      {document.shown === 'stale' ? (
                        <span className="row-note">
                          Rendered from revision {document.shipment_revision}; the shipment is now
                          at revision {document.shipment?.revision ?? '—'}.
                        </span>
                      ) : null}
                    </td>
                    <td className="stack-actions">
                      <div className="row-actions">
                        {document.shown === 'stale' ? (
                          <LinkButton
                            href={`/app/${org}/shipments/${document.shipment_id}#documents`}
                            tone="accent"
                            compact
                          >
                            Review<span className="sr-only"> {document.number}</span>
                          </LinkButton>
                        ) : null}
                        <LinkButton
                          href={`/api/documents/${document.id}`}
                          tone={document.shown === 'final' ? 'secondary' : 'quiet'}
                          compact
                          download
                        >
                          <Download size={15} aria-hidden="true" /> PDF
                          <span className="sr-only"> of {document.number}</span>
                        </LinkButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ) : all.length > 0 ? (
            <EmptyState
              title={filter === 'attention' ? 'Nothing needs attention' : 'No current documents'}
              description={
                filter === 'attention'
                  ? 'Every final document still matches the shipment it was rendered from.'
                  : 'Every document here was rendered from an earlier shipment revision, superseded or voided. Regenerate from the shipment to get a current copy.'
              }
              action={
                <LinkButton href={base} tone="secondary">
                  Show all documents
                </LinkButton>
              }
            />
          ) : (
            <EmptyState
              title="No documents yet"
              description={NOTHING_YET}
              action={<LinkButton href={`/app/${org}/shipments`}>Open your shipments</LinkButton>}
            />
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
