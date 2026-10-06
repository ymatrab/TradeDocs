import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Boxes, Building2, FileUp, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, Callout, EmptyState, ErrorState } from '@/components/primitives/feedback';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { DataTable } from '@/components/primitives/table';
import { DocumentStatus, ShipmentStatus } from '@/components/document/status';
import { LinkButton } from '@/components/primitives/button';
import { Checklist, type ChecklistStep } from '@/components/primitives/checklist';
import { documentKindLabel } from '@/lib/labels';
import { shortDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Overview' };

const FIRST_SHIPMENT =
  'Create a shipment to capture its parties, goods and packing once, then produce ' +
  'every document from it.';

/**
 * What the workspace holds, and what in it needs attention.
 *
 * A new organization sees the setup checklist first: three things saved once (your own
 * company, a customer, a product) and then the first shipment. Each step is ticked from
 * the data itself, so the list disappears on its own once the work is done and never
 * claims a step the user has not taken.
 *
 * A stale document is the only thing here that asks for a decision, so the documents
 * that need one are listed by name with the way to the shipment that can re-issue them.
 */
export default async function OverviewPage({ params }: { params: Promise<{ org: string }> }) {
  const { org } = await params;
  const client = await createClient();

  const { data: organization } = await client
    .from('organizations')
    .select('id, name')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  const [shipmentsResult, documentsResult, membersResult, companiesResult, productsResult] =
    await Promise.all([
      client
        .from('shipments')
        .select('id, reference, status, revision, created_at')
        .eq('org_id', org)
        .order('created_at', { ascending: false }),
      client
        .from('documents')
        .select('id, kind, number, shipment_id, status, shipment_revision, created_at')
        .eq('org_id', org)
        .order('created_at', { ascending: false }),
      client
        .from('memberships')
        .select('user_id', { count: 'exact', head: true })
        .eq('org_id', org),
      client.from('companies').select('kind').eq('org_id', org).is('archived_at', null),
      client
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('org_id', org)
        .is('archived_at', null),
    ]);

  const shipments = shipmentsResult.data ?? [];
  const documents = documentsResult.data ?? [];
  const companyKinds = new Set((companiesResult.data ?? []).map((row) => row.kind));
  const productCount = productsResult.count ?? 0;
  const failed = Boolean(shipmentsResult.error || documentsResult.error);

  const shipmentOf = new Map(shipments.map((row) => [row.id, row]));
  const stale = documents.filter(
    (document) =>
      document.status === 'final' &&
      document.shipment_revision < (shipmentOf.get(document.shipment_id)?.revision ?? 0),
  );

  const recent = shipments.slice(0, 5);
  const base = `/app/${org}`;

  // Ticked from what exists, never from a dismissed flag. The read of companies or
  // products failing leaves its step unticked rather than claiming it.
  const steps: ChecklistStep[] = [
    {
      id: 'own-company',
      title: 'Add your company',
      description:
        'The exporter on every document: legal name, address and the identifiers your buyer needs.',
      done: companyKinds.has('own'),
      href: `${base}/companies/new?kind=own`,
      action: 'Add your company',
    },
    {
      id: 'customer',
      title: 'Add a customer',
      description: 'Who the goods are consigned to. Saved once, picked from a list after that.',
      done: companyKinds.has('customer'),
      href: `${base}/companies/new?kind=customer`,
      action: 'Add a customer',
    },
    {
      id: 'product',
      title: 'Add a product',
      description:
        'Description, HS code, origin, weight and price, stated once so every document quotes the same figures.',
      done: productCount > 0,
      href: `${base}/products/new`,
      action: 'Add a product',
      alternative: { href: `${base}/products/import`, label: 'Import a spreadsheet' },
    },
    {
      id: 'shipment',
      title: 'Create your first shipment',
      description:
        'Pick the parties, add the goods and packing, then generate the invoice, packing list and delivery note from it.',
      done: shipments.length > 0,
      href: `${base}/shipments#new-shipment`,
      action: 'Create a shipment',
    },
  ];
  const setupComplete = steps.every((step) => step.done);

  return (
    <AppShell title={organization.name} current="Overview" orgId={org}>
      <div className="app-page">
        {failed ? (
          <Panel title="Workspace">
            <ErrorState
              title="This overview could not be loaded"
              description="Your shipments and documents are safe; the page could not read them just now. Try again in a moment."
              action={
                <LinkButton href={base} tone="secondary">
                  Try again
                </LinkButton>
              }
            />
          </Panel>
        ) : null}

        {setupComplete ? null : (
          <Panel title="Get set up">
            <Checklist label="Workspace setup progress" steps={steps} />
          </Panel>
        )}

        <div className="quick-actions" role="group" aria-label="Quick actions">
          <LinkButton href={`${base}/shipments#new-shipment`} compact>
            <Plus size={15} aria-hidden="true" /> New shipment
          </LinkButton>
          <LinkButton href={`${base}/products/new`} tone="secondary" compact>
            <Boxes size={15} aria-hidden="true" /> Add product
          </LinkButton>
          <LinkButton href={`${base}/companies/new`} tone="secondary" compact>
            <Building2 size={15} aria-hidden="true" /> Add company
          </LinkButton>
          <LinkButton href={`${base}/products/import`} tone="secondary" compact>
            <FileUp size={15} aria-hidden="true" /> Import catalog
          </LinkButton>
        </div>

        <BoxGrid label="Workspace summary">
          <FieldBox ordinal="1" caption="Shipments">
            <span className="data">{shipments.length}</span>
          </FieldBox>
          <FieldBox ordinal="2" caption="Documents">
            <span className="data">{documents.length}</span>
          </FieldBox>
          <FieldBox ordinal="3" caption="Members">
            <span className="data">{membersResult.count ?? 0}</span>
          </FieldBox>
          <FieldBox ordinal="4" caption="Stale documents">
            <span className="data">{stale.length}</span>
          </FieldBox>
        </BoxGrid>

        {stale.length > 0 ? (
          <Panel title="Needs attention">
            <div style={{ display: 'grid', gap: 16 }}>
              <Callout tone="warning" title="Some documents no longer match their shipment">
                {stale.length === 1 ? 'One document was' : `${stale.length} documents were`}{' '}
                rendered from an earlier revision. Nothing has been rewritten; open the shipment and
                regenerate the ones you still need to send.
              </Callout>
              <DataTable caption="Documents rendered from an earlier shipment revision" stack>
                <thead>
                  <tr>
                    <th scope="col">Document</th>
                    <th scope="col">Shipment</th>
                    <th scope="col">State</th>
                    <th scope="col">
                      <span className="sr-only">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stale.slice(0, 8).map((document) => {
                    const shipment = shipmentOf.get(document.shipment_id);
                    return (
                      <tr key={document.id}>
                        <td data-label="Document">
                          <span className="data">{document.number}</span>
                          <br />
                          <span className="muted">{documentKindLabel(document.kind)}</span>
                        </td>
                        <td data-label="Shipment" className="data">
                          {shipment?.reference ?? '—'}
                        </td>
                        <td data-label="State">
                          <DocumentStatus state="stale" />
                          <span className="row-note">
                            Revision {document.shipment_revision} of {shipment?.revision ?? '—'}
                          </span>
                        </td>
                        <td data-label="Action">
                          <LinkButton
                            href={`${base}/shipments/${document.shipment_id}#documents`}
                            tone="secondary"
                            compact
                          >
                            Review<span className="sr-only"> {document.number}</span>
                          </LinkButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </DataTable>
              {stale.length > 8 ? (
                <p className="muted" style={{ margin: 0 }}>
                  And {stale.length - 8} more on the{' '}
                  <Link className="text-link" href={`${base}/documents`}>
                    documents page
                  </Link>
                  .
                </p>
              ) : null}
            </div>
          </Panel>
        ) : null}

        <Panel
          title="Recent shipments"
          actions={
            <LinkButton href={`${base}/shipments`} tone="secondary" compact>
              All shipments
            </LinkButton>
          }
        >
          {recent.length > 0 ? (
            <DataTable caption="The most recently created shipments" stack>
              <thead>
                <tr>
                  <th scope="col">Reference</th>
                  <th scope="col">Status</th>
                  <th scope="col">Created</th>
                  <th scope="col" className="numeric">
                    Revision
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent.map((shipment) => (
                  <tr key={shipment.id}>
                    <td data-label="Reference">
                      <Link className="text-link data" href={`${base}/shipments/${shipment.id}`}>
                        {shipment.reference}
                      </Link>
                    </td>
                    <td data-label="Status">
                      <ShipmentStatus state={shipment.status} />
                    </td>
                    <td data-label="Created">{shortDate(shipment.created_at)}</td>
                    <td data-label="Revision" className="numeric">
                      {shipment.revision}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ) : (
            <EmptyState
              title="Nothing here yet"
              description={FIRST_SHIPMENT}
              action={
                <LinkButton href={`${base}/shipments#new-shipment`}>
                  Create the first shipment
                </LinkButton>
              }
            />
          )}
        </Panel>

        <Callout tone="legal" title="Preparation only">
          TradeDocs prepares documents. It does not issue, endorse or clear them.
        </Callout>
      </div>
    </AppShell>
  );
}
