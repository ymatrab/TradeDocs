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

  const { data: shipments } = await client
    .from('shipments')
    .select('id, reference, status, currency, revision, created_at')
    .eq('org_id', org)
    .order('created_at', { ascending: false });

  return (
    <AppShell title="Shipments" current="Shipments" orgId={org}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 940 }}>
        <Panel title="Shipments">
          {shipments && shipments.length > 0 ? (
            <DataTable caption="Shipments in this organization">
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
                    <td className="data">{shipment.currency}</td>
                    <NumericCell value={String(shipment.revision)} />
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ) : (
            <EmptyState
              title="No shipments yet"
              description="Create one to capture its parties, goods and packing once, then produce every document from it."
            />
          )}
        </Panel>
        <Panel title="New shipment">
          <CreateShipmentForm org={org} />
        </Panel>
      </div>
    </AppShell>
  );
}
