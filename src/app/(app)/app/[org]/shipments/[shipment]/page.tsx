import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, Callout } from '@/components/primitives/feedback';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { decimal } from '@/lib/format';
import { ShipmentEditor } from './shipment-editor';
import { PartiesPanel } from './parties-panel';
import { PackingPanel } from './packing-panel';
import { DocumentsPanel } from './documents-panel';

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

  // Everything this screen needs, fetched together. The panels below are the parts of
  // one record, not separate pages, so they must not each pay a round trip.
  const [itemsResult, documentsResult, packagesResult, contentsResult, companiesResult, catalogResult] =
    await Promise.all([
      client
        .from('shipment_items')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('position', { ascending: true }),
      client
        .from('documents')
        .select('id, kind, number, status, shipment_revision, created_at')
        .eq('shipment_id', shipmentId)
        .order('created_at', { ascending: false }),
      client
        .from('shipment_packages')
        .select('*')
        .eq('shipment_id', shipmentId)
        .order('position', { ascending: true }),
      client
        .from('package_contents')
        .select('id, package_id, item_id, quantity')
        .eq('org_id', org),
      client
        .from('companies')
        .select('id, name, city, country_code')
        .eq('org_id', org)
        .is('archived_at', null)
        .order('name'),
      client
        .from('products')
        .select('id, sku, description, hs_code, unit, unit_price')
        .eq('org_id', org)
        .is('archived_at', null)
        .order('description')
        .limit(500),
    ]);

  const lines = itemsResult.data ?? [];
  const packageRows = packagesResult.data ?? [];
  const packageIds = new Set(packageRows.map((row) => row.id));
  const contents = (contentsResult.data ?? []).filter((row) => packageIds.has(row.package_id));

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
              {decimal(totals.value)} {shipment.currency}
            </span>
          </FieldBox>
        </BoxGrid>

        <Callout tone="legal" title="Preparation only">
          Documents generated here are prepared from your own data. They are not issued, endorsed,
          certified or cleared by any authority.
        </Callout>

        <PartiesPanel
          org={org}
          shipmentId={shipmentId}
          options={companiesResult.data ?? []}
          selected={{
            exporter_id: shipment.exporter_id,
            consignee_id: shipment.consignee_id,
            notify_id: shipment.notify_id,
          }}
        />

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
          catalog={(catalogResult.data ?? []).map((product) => ({
            id: product.id,
            sku: product.sku,
            description: product.description,
            hs_code: product.hs_code,
            unit: product.unit,
            unit_price: Number(product.unit_price),
          }))}
        />

        <PackingPanel
          org={org}
          shipmentId={shipmentId}
          packages={packageRows.map((row) => ({
            id: row.id,
            position: row.position,
            kind: row.kind,
            package_count: row.package_count,
            length_cm: row.length_cm === null ? null : Number(row.length_cm),
            width_cm: row.width_cm === null ? null : Number(row.width_cm),
            height_cm: row.height_cm === null ? null : Number(row.height_cm),
            net_weight_kg: row.net_weight_kg === null ? null : Number(row.net_weight_kg),
            gross_weight_kg: row.gross_weight_kg === null ? null : Number(row.gross_weight_kg),
            volume_m3: row.volume_m3 === null ? null : Number(row.volume_m3),
            marks: row.marks,
            contents: contents
              .filter((content) => content.package_id === row.id)
              .map((content) => ({
                id: content.id,
                item_id: content.item_id,
                quantity: Number(content.quantity),
              })),
          }))}
          items={lines.map((item) => ({
            id: item.id,
            position: item.position,
            description: item.description,
            quantity: Number(item.quantity),
            unit: item.unit,
          }))}
        />

        <DocumentsPanel
          org={org}
          shipmentId={shipmentId}
          documents={(documentsResult.data ?? []).map((document) => ({
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
