import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, EmptyState } from '@/components/primitives/feedback';
import { DataTable, NumericCell } from '@/components/primitives/table';
import { ShipmentStatus } from '@/components/document/status';
import { CreateShipmentForm } from './create-shipment-form';

export const metadata: Metadata = { title: 'Shipments' };

export default async function ShipmentsPage({ params }: { params: Promise<{ org: string }> }) {
  const { org } = await params;
  const client = await createClient();
  const { data: organization } = await client
    .from('organizations')
    .select('id, name')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  const [{ data: shipments }, { data: settings }] = await Promise.all([
    client
      .from('shipments')
      .select('id, reference, status, currency, revision, created_at')
      .eq('org_id', org)
      .order('created_at', { ascending: false }),
    client
      .from('organization_settings')
      .select('default_currency')
      .eq('org_id', org)
      .maybeSingle(),
  ]);

  return (
    <AppShell title="Shipments" current="Shipments" orgId={org}>
      <div className="app-page">
        <Panel title="Shipments">
          {shipments && shipments.length > 0 ? (
            <DataTable caption="Shipments in this organization" stack>
              <thead>
                <tr>
                  <th scope="col">Reference</th>
                  <th scope="col">Status</th>
                  <th scope="col">Currency</th>
                  <th scope="col" className="numeric">
                    Revision
                  </th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td className="stack-title">
                      <Link
                        className="text-link data"
                        href={`/app/${org}/shipments/${shipment.id}`}
                      >
                        {shipment.reference}
                      </Link>
                    </td>
                    <td data-label="Status">
                      <ShipmentStatus state={shipment.status} />
                    </td>
                    <td className="data" data-label="Currency">
                      {shipment.currency}
                    </td>
                    <NumericCell label="Revision" value={String(shipment.revision)} />
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ) : (
            <EmptyState
              title="No shipments yet"
              description="Create one to capture its parties, goods and packing once, then produce every document from it."
              action={
                <a className="btn" href="#new-shipment">
                  Start a shipment below
                </a>
              }
            />
          )}
        </Panel>
        <Panel title="New shipment" id="new-shipment">
          <CreateShipmentForm org={org} defaultCurrency={settings?.default_currency ?? 'EUR'} />
        </Panel>
      </div>
    </AppShell>
  );
}
