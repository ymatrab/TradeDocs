import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, Callout, EmptyState } from '@/components/primitives/feedback';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { DataTable } from '@/components/primitives/table';
import { ShipmentStatus } from '@/components/document/status';
import { LinkButton } from '@/components/primitives/button';

export const metadata: Metadata = { title: 'Overview' };

const FIRST_SHIPMENT =
  'Create a shipment to capture its parties, goods and packing once, then produce ' +
  'every document from it.';

/**
 * What the workspace holds, and what in it needs attention. A stale document is
 * the only thing here that asks for a decision, so it is the only figure given
 * its own route out.
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

  const { data: shipments } = await client
    .from('shipments')
    .select('id, reference, status, revision, created_at')
    .eq('org_id', org)
    .order('created_at', { ascending: false });

  const { data: documents } = await client
    .from('documents')
    .select('id, shipment_id, status, shipment_revision')
    .eq('org_id', org);

  const { count: memberCount } = await client
    .from('memberships')
    .select('user_id', { count: 'exact', head: true })
    .eq('org_id', org);

  const revisionOf = new Map((shipments ?? []).map((row) => [row.id, row.revision]));
  const stale = (documents ?? []).filter(
    (document) =>
      document.status === 'final' &&
      document.shipment_revision < (revisionOf.get(document.shipment_id) ?? 0),
  ).length;

  const recent = (shipments ?? []).slice(0, 5);

  return (
    <AppShell title={organization.name} current="Overview" orgId={org}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 940 }}>
        <BoxGrid label="Workspace summary">
          <FieldBox ordinal="1" caption="Shipments">
            <span className="data">{shipments?.length ?? 0}</span>
          </FieldBox>
          <FieldBox ordinal="2" caption="Documents">
            <span className="data">{documents?.length ?? 0}</span>
          </FieldBox>
          <FieldBox ordinal="3" caption="Members">
            <span className="data">{memberCount ?? 0}</span>
          </FieldBox>
          <FieldBox ordinal="4" caption="Stale documents">
            <span className="data">{stale}</span>
          </FieldBox>
        </BoxGrid>

        {stale > 0 ? (
          <Callout tone="warning" title="Some documents no longer match their shipment">
            {stale === 1 ? 'One document was' : `${stale} documents were`} rendered from an earlier
            revision. Nothing has been rewritten; decide for each whether to re-issue it.
          </Callout>
        ) : null}

        <Callout tone="legal" title="Preparation only">
          TradeDocs prepares documents. It does not issue, endorse or clear them.
        </Callout>

        <Panel
          title="Recent shipments"
          actions={
            <LinkButton href={`/app/${org}/shipments`} tone="secondary" compact>
              All shipments
            </LinkButton>
          }
        >
          {recent.length > 0 ? (
            <DataTable caption="The most recently created shipments">
              <thead>
                <tr>
                  <th scope="col">Reference</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="numeric">
                    Revision
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent.map((shipment) => (
                  <tr key={shipment.id}>
                    <td>
                      <Link
                        className="text-link data"
                        href={`/app/${org}/shipments/${shipment.id}`}
                      >
                        {shipment.reference}
                      </Link>
                    </td>
                    <td>
                      <ShipmentStatus state={shipment.status} />
                    </td>
                    <td className="numeric">{shipment.revision}</td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ) : (
            <EmptyState
              title="Nothing here yet"
              description={FIRST_SHIPMENT}
              action={
                <LinkButton href={`/app/${org}/shipments`}>Create the first shipment</LinkButton>
              }
            />
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
