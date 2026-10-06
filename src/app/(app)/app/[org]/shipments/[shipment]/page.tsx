import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient, getUser } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, Callout } from '@/components/primitives/feedback';
import { decimal } from '@/lib/format';
import { currencyMinorUnits, sumLineTotals } from '@/lib/money';
import { regulatedDocumentsEnabled } from '@/lib/config/server';
import { freshnessOf } from '@/lib/trade/staleness';
import { ShipmentEditor } from './shipment-editor';
import { PartiesPanel } from './parties-panel';
import { PackingPanel } from './packing-panel';
import { DocumentsPanel } from './documents-panel';
import { DuplicateShipmentForm } from './duplicate-shipment-form';
import { packingTotals, unreconciledLines } from './figures';
import { ShipmentSteps, ShipmentSummary, type BuilderStep } from './shipment-progress';

export const metadata: Metadata = { title: 'Shipment' };

export default async function ShipmentPage({
  params,
}: {
  params: Promise<{ org: string; shipment: string }>;
}) {
  const { org, shipment: shipmentId } = await params;
  const client = await createClient();
  const user = await getUser();

  const { data: shipment } = await client
    .from('shipments')
    .select('*')
    .eq('id', shipmentId)
    .maybeSingle();
  if (!shipment) notFound();

  // Everything this screen needs, fetched together. The panels below are the parts of
  // one record, not separate pages, so they must not each pay a round trip.
  const [
    itemsResult,
    documentsResult,
    packagesResult,
    companiesResult,
    catalogResult,
    previewResult,
    membershipResult,
  ] = await Promise.all([
    client
      .from('shipment_items')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('position', { ascending: true }),
    client
      .from('documents')
      .select('id, kind, number, status, status_reason, shipment_revision, snapshot, created_at')
      .eq('shipment_id', shipmentId)
      .order('created_at', { ascending: false }),
    client
      .from('shipment_packages')
      .select('*, package_contents (id, item_id, quantity)')
      .eq('shipment_id', shipmentId)
      .order('position', { ascending: true }),
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
    // The snapshot a document would carry now, to say why an earlier one is stale.
    client.rpc('preview_document', {
      target_shipment: shipmentId,
      document_kind: 'commercial_invoice',
    }),
    user
      ? client
          .from('memberships')
          .select('role')
          .eq('org_id', org)
          .eq('user_id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const canVoid =
    membershipResult.data?.role === 'owner' || membershipResult.data?.role === 'admin';

  const lines = itemsResult.data ?? [];
  const packageRows = packagesResult.data ?? [];

  // The value is the sum of lines rounded to the currency's minor unit, exactly as a
  // generated document computes it, so the screen and the invoice cannot disagree.
  const moneyPlaces = currencyMinorUnits(shipment.currency);
  const totals = lines.reduce(
    (accumulator, item) => ({
      ...accumulator,
      quantity: accumulator.quantity + Number(item.quantity),
      net: accumulator.net + Number(item.net_weight_kg ?? 0),
    }),
    { quantity: 0, value: sumLineTotals(lines, moneyPlaces).toNumber(), net: 0 },
  );

  const packages = packageRows.map((row) => ({
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
    contents: row.package_contents.map((content) => ({
      id: content.id,
      item_id: content.item_id,
      quantity: Number(content.quantity),
    })),
  }));
  const packable = lines.map((item) => ({
    id: item.id,
    position: item.position,
    description: item.description,
    quantity: Number(item.quantity),
    unit: item.unit,
  }));
  // Stale when the revision moved on or when the content no longer matches what the
  // shipment would produce now (a party's address corrected, new invoice settings), with
  // the reason the panel shows.
  const now = previewResult.data ?? undefined;
  const documents = (documentsResult.data ?? []).map((document) => {
    const freshness = freshnessOf(document, shipment.revision, now);
    return {
      id: document.id,
      kind: document.kind,
      number: document.number,
      status: document.status,
      revision: document.shipment_revision,
      stale: freshness.stale,
      reason: freshness.reason,
      statusReason: document.status_reason,
    };
  });

  // Where each part of the record stands, read from the record. Packing is optional —
  // a shipment can be documented without it — so its absence is never shown as a gap.
  const packed = packingTotals(packages);
  const mismatched = unreconciledLines(packable, packages).length;
  const current = documents.filter((document) => document.status === 'final' && !document.stale);
  const staleCount = documents.filter(
    (document) => document.status === 'final' && document.stale,
  ).length;
  const partiesSet = Boolean(shipment.exporter_id) && Boolean(shipment.consignee_id);
  const steps: BuilderStep[] = [
    {
      target: 'parties',
      title: 'Parties and terms',
      state: partiesSet ? 'done' : 'todo',
      detail: partiesSet
        ? 'Exporter and consignee set'
        : shipment.exporter_id
          ? 'No consignee yet'
          : 'No exporter yet',
    },
    {
      target: 'goods',
      title: 'Goods',
      state: lines.length > 0 ? 'done' : 'todo',
      detail:
        lines.length === 0
          ? 'No lines yet'
          : `${lines.length} ${lines.length === 1 ? 'line' : 'lines'}`,
    },
    {
      target: 'packing',
      title: 'Packing',
      state: packages.length === 0 ? 'optional' : mismatched > 0 ? 'check' : 'done',
      detail:
        packages.length === 0
          ? 'Not described'
          : mismatched > 0
            ? `${mismatched} ${mismatched === 1 ? 'line differs' : 'lines differ'}`
            : 'Matches the lines',
    },
    {
      target: 'documents',
      title: 'Documents',
      state: staleCount > 0 ? 'check' : current.length > 0 ? 'done' : 'todo',
      detail:
        staleCount > 0
          ? `${staleCount} out of date`
          : current.length > 0
            ? `${current.length} current`
            : 'None generated',
    },
  ];

  return (
    <AppShell
      title={shipment.reference}
      current="Shipments"
      orgId={org}
      parent={{ href: `/app/${org}/shipments`, label: 'Shipments' }}
    >
      <div className="app-page builder">
        <ShipmentSteps steps={steps} />

        <div className="builder-layout">
          <ShipmentSummary
            figures={{
              reference: shipment.reference,
              status: shipment.status,
              revision: shipment.revision,
              currency: shipment.currency,
              lines: lines.length,
              quantity: totals.quantity,
              // Weighed lines, or failing those the packages' own net weights.
              net: totals.net > 0 ? totals.net : packed.net,
              gross: packages.length > 0 ? packed.gross : null,
              volume: packages.length > 0 ? packed.volume : null,
              packages: packed.count,
              value: decimal(totals.value, moneyPlaces),
            }}
          />

          <div className="builder-main">
            <Callout tone="legal" title="Preparation only">
              Documents generated here are prepared from your own data. They are not issued,
              endorsed, certified or cleared by any authority.
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
                shipped_on: shipment.shipped_on,
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

            <PackingPanel org={org} shipmentId={shipmentId} packages={packages} items={packable} />

            <DocumentsPanel
              org={org}
              shipmentId={shipmentId}
              regulatedEnabled={regulatedDocumentsEnabled()}
              revision={shipment.revision}
              canVoid={canVoid}
              documents={documents}
            />

            <DuplicateShipmentForm
              org={org}
              shipmentId={shipmentId}
              reference={shipment.reference}
            />

            <Panel title="Audit">
              <p className="muted" style={{ marginBottom: 0 }}>
                Every generated document keeps an immutable copy of the shipment it came from.
                Editing this shipment never changes a document you have already sent; it marks that
                document stale so you can decide whether to re-issue it.
              </p>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
