import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, Callout } from '@/components/primitives/feedback';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { ShipmentEditor } from './shipment-editor';

export const metadata: Metadata = { title: 'Shipment' };

export default async function ShipmentPage({
  params,
}: {
  params: Promise<{ org: string; shipment: string }>;
}) {
  const { org, shipment: shipmentId } = await params;
  const client = await createClient();

  const { data: shipment } = await client
    .from('shipments')
    .select('*')
    .eq('id', shipmentId)
    .maybeSingle();
  if (!shipment) notFound();

  const { data: items } = await client
    .from('shipment_items')
    .select('*')
    .eq('shipment_id', shipmentId)
    .order('position', { ascending: true });

  const { data: documents } = await client
    .from('documents')
    .select('id, kind, number, status, shipment_revision, created_at')
    .eq('shipment_id', shipmentId)
    .order('created_at', { ascending: false });

  const lines = items ?? [];
  const totals = lines.reduce(
    (accumulator, item) => ({
      quantity: accumulator.quantity + Number(item.quantity),
      value: accumulator.value + Number(item.quantity) * Number(item.unit_price),
      net: accumulator.net + Number(item.net_weight_kg ?? 0),
    }),
    { quantity: 0, value: 0, net: 0 },
  );

  return (
    <AppShell title={shipment.reference} current="Shipments" orgId={org}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 1040 }}>
        <BoxGrid label="Shipment summary">
          <FieldBox ordinal="1" caption="Reference">
            <span className="data">{shipment.reference}</span>
          </FieldBox>
          <FieldBox ordinal="2" caption="Currency" value={shipment.currency} />
          <FieldBox ordinal="3" caption="Revision">
            <span className="data">{shipment.revision}</span>
          </FieldBox>
          <FieldBox ordinal="4" caption="Total value">
            <span className="data">
              {totals.value.toLocaleString('en-GB', { minimumFractionDigits: 2 })}{' '}
              {shipment.currency}
            </span>
          </FieldBox>
        </BoxGrid>

        <Callout tone="legal" title="Preparation only">
          Documents generated here are prepared from your own data. They are not issued, endorsed,
          certified or cleared by any authority.
        </Callout>

        <ShipmentEditor
          org={org}
          shipmentId={shipmentId}
          shipment={{
            incoterm: shipment.incoterm,
            incoterm_place: shipment.incoterm_place,
            port_of_loading: shipment.port_of_loading,
            port_of_discharge: shipment.port_of_discharge,
            country_of_origin: shipment.country_of_origin,
            country_of_destination: shipment.country_of_destination,
            marks_and_numbers: shipment.marks_and_numbers,
            revision: shipment.revision,
            currency: shipment.currency,
          }}
          items={lines.map((item) => ({
            id: item.id,
            position: item.position,
            description: item.description,
            hs_code: item.hs_code,
            quantity: String(item.quantity),
            unit: item.unit,
            unit_price: String(item.unit_price),
            net_weight_kg: item.net_weight_kg == null ? null : String(item.net_weight_kg),
          }))}
          totals={totals}
          documents={(documents ?? []).map((document) => ({
            id: document.id,
            kind: document.kind,
            number: document.number,
            status: document.status,
            stale: document.shipment_revision < shipment.revision,
          }))}
        />

        <Panel title="Audit">
          <p className="muted" style={{ marginBottom: 0 }}>
            Every generated document keeps an immutable copy of the shipment it came from. Editing
            this shipment never changes a document you have already sent; it marks that document
            stale so you can decide whether to re-issue it.
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}
