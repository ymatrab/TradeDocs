'use client';

import { useActionState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { Button, LinkButton } from '@/components/primitives/button';
import { Field, Input, Select } from '@/components/primitives/form';
import { Callout, Panel } from '@/components/primitives/feedback';
import { DataTable, EmptyValue, NumericCell } from '@/components/primitives/table';
import { DocumentStatus } from '@/components/document/status';
import { addItem, generateDocument, removeItem, updateShipment } from '../../../../shipment-actions';
import type { ActionState } from '../../../../actions';

type Item = {
  id: string;
  position: number;
  description: string;
  hs_code: string | null;
  quantity: string;
  unit: string;
  unit_price: string;
  net_weight_kg: string | null;
};

type GeneratedDocument = {
  id: string;
  kind: string;
  number: string;
  status: string;
  stale: boolean;
};

const documentTypes = [
  { kind: 'commercial_invoice', label: 'Commercial invoice' },
  { kind: 'proforma_invoice', label: 'Proforma invoice' },
  { kind: 'packing_list', label: 'Packing list' },
  { kind: 'delivery_note', label: 'Delivery note' },
  { kind: 'certificate_of_origin', label: 'Certificate of origin' },
] as const;

const incoterms = ['', 'EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];

function Result({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <Callout tone="danger" title="That did not work">
        {state.error}
      </Callout>
    );
  }
  if (state.notice) {
    return (
      <Callout tone="success" title="Done">
        {state.notice}
      </Callout>
    );
  }
  return null;
}

export function ShipmentEditor({
  org,
  shipmentId,
  shipment,
  items,
  totals,
  documents,
}: {
  org: string;
  shipmentId: string;
  shipment: Record<string, string | number | null>;
  items: Item[];
  totals: { quantity: number; value: number; net: number };
  documents: GeneratedDocument[];
}) {
  const [detailState, detailAction, detailPending] = useActionState<ActionState, FormData>(
    updateShipment,
    {},
  );
  const [itemState, itemAction, itemPending] = useActionState<ActionState, FormData>(addItem, {});
  const [removeState, removeAction] = useActionState<ActionState, FormData>(removeItem, {});
  const [documentState, documentAction, documentPending] = useActionState<ActionState, FormData>(
    generateDocument,
    {},
  );

  const currency = String(shipment.currency ?? 'EUR');

  return (
    <>
      <Panel title="Shipment details">
        <form action={detailAction} style={{ display: 'grid', gap: 16 }} noValidate>
          <input type="hidden" name="org" value={org} />
          <input type="hidden" name="shipment" value={shipmentId} />
          <Result state={detailState} />
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            }}
          >
            <Field id="incoterm" label="Incoterm 2020">
              {({ id }) => (
                <Select id={id} name="incoterm" defaultValue={String(shipment.incoterm ?? '')}>
                  {incoterms.map((term) => (
                    <option key={term || 'none'} value={term}>
                      {term || 'Not set'}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field id="incoterm_place" label="Named place">
              {({ id }) => (
                <Input
                  id={id}
                  name="incoterm_place"
                  defaultValue={String(shipment.incoterm_place ?? '')}
                />
              )}
            </Field>
            <Field id="port_of_loading" label="Port of loading">
              {({ id }) => (
                <Input
                  id={id}
                  name="port_of_loading"
                  defaultValue={String(shipment.port_of_loading ?? '')}
                />
              )}
            </Field>
            <Field id="port_of_discharge" label="Port of discharge">
              {({ id }) => (
                <Input
                  id={id}
                  name="port_of_discharge"
                  defaultValue={String(shipment.port_of_discharge ?? '')}
                />
              )}
            </Field>
            <Field id="country_of_origin" label="Country of origin" hint="Two-letter code.">
              {({ id, describedBy }) => (
                <Input
                  id={id}
                  name="country_of_origin"
                  maxLength={2}
                  aria-describedby={describedBy}
                  defaultValue={String(shipment.country_of_origin ?? '')}
                />
              )}
            </Field>
            <Field id="country_of_destination" label="Country of destination" hint="Two-letter code.">
              {({ id, describedBy }) => (
                <Input
                  id={id}
                  name="country_of_destination"
                  maxLength={2}
                  aria-describedby={describedBy}
                  defaultValue={String(shipment.country_of_destination ?? '')}
                />
              )}
            </Field>
          </div>
          <Field id="marks_and_numbers" label="Marks and numbers">
            {({ id }) => (
              <Input
                id={id}
                name="marks_and_numbers"
                defaultValue={String(shipment.marks_and_numbers ?? '')}
              />
            )}
          </Field>
          <div>
            <Button type="submit" pending={detailPending} pendingLabel="Saving…">
              Save shipment
            </Button>
          </div>
        </form>
      </Panel>

      <Panel title="Line items">
        <div style={{ display: 'grid', gap: 16 }}>
          <Result state={itemState.error || itemState.notice ? itemState : removeState} />
          {items.length > 0 ? (
            <DataTable caption="Goods on this shipment" density="compact">
              <thead>
                <tr>
                  <th scope="col">Description</th>
                  <th scope="col">HS code</th>
                  <th scope="col" className="numeric">
                    Quantity
                  </th>
                  <th scope="col" className="numeric">
                    Unit price
                  </th>
                  <th scope="col" className="numeric">
                    Amount
                  </th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td className="data">{item.hs_code ?? <EmptyValue label="No HS code" />}</td>
                    <NumericCell value={Number(item.quantity).toLocaleString('en-GB')} unit={item.unit} />
                    <NumericCell value={Number(item.unit_price).toFixed(4)} />
                    <NumericCell
                      value={(Number(item.quantity) * Number(item.unit_price)).toLocaleString(
                        'en-GB',
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                      )}
                      unit={currency}
                    />
                    <td>
                      <form action={removeAction}>
                        <input type="hidden" name="org" value={org} />
                        <input type="hidden" name="shipment" value={shipmentId} />
                        <input type="hidden" name="item" value={item.id} />
                        <Button type="submit" tone="quiet" compact aria-label={`Remove ${item.description}`}>
                          <Trash2 size={15} aria-hidden="true" />
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={4}>
                    Total
                  </th>
                  <NumericCell
                    value={totals.value.toLocaleString('en-GB', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    unit={currency}
                  />
                  <td />
                </tr>
              </tfoot>
            </DataTable>
          ) : (
            <p className="muted" style={{ marginBottom: 0 }}>
              No lines yet. A document needs at least one.
            </p>
          )}

          <form action={itemAction} style={{ display: 'grid', gap: 16 }} noValidate>
            <input type="hidden" name="org" value={org} />
            <input type="hidden" name="shipment" value={shipmentId} />
            <Field id="description" label="Description of goods">
              {({ id }) => <Input id={id} name="description" required maxLength={500} />}
            </Field>
            <div
              style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              }}
            >
              <Field id="hs_code" label="HS code" requirement="Optional">
                {({ id }) => <Input id={id} name="hs_code" inputMode="numeric" maxLength={10} />}
              </Field>
              <Field id="item_origin" label="Origin" requirement="Optional">
                {({ id }) => <Input id={id} name="country_of_origin" maxLength={2} />}
              </Field>
              <Field id="quantity" label="Quantity">
                {({ id }) => (
                  <Input id={id} name="quantity" type="number" step="0.001" min="0.001" required />
                )}
              </Field>
              <Field id="unit" label="Unit">
                {({ id }) => <Input id={id} name="unit" defaultValue="pcs" maxLength={12} />}
              </Field>
              <Field id="unit_price" label="Unit price">
                {({ id }) => (
                  <Input id={id} name="unit_price" type="number" step="0.0001" min="0" defaultValue="0" />
                )}
              </Field>
              <Field id="net_weight_kg" label="Net weight (kg)" requirement="Optional">
                {({ id }) => <Input id={id} name="net_weight_kg" type="number" step="0.001" min="0" />}
              </Field>
              <Field id="package_count" label="Packages" requirement="Optional">
                {({ id }) => <Input id={id} name="package_count" type="number" step="1" min="0" />}
              </Field>
            </div>
            <div>
              <Button type="submit" tone="secondary" pending={itemPending} pendingLabel="Adding…">
                Add line
              </Button>
            </div>
          </form>
        </div>
      </Panel>

      <Panel title="Documents">
        <div style={{ display: 'grid', gap: 16 }}>
          <Result state={documentState} />
          <form action={documentAction} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <input type="hidden" name="org" value={org} />
            <input type="hidden" name="shipment" value={shipmentId} />
            <div style={{ minWidth: 220 }}>
              <Field id="kind" label="Document type">
                {({ id }) => (
                  <Select id={id} name="kind" defaultValue="commercial_invoice">
                    {documentTypes.map((type) => (
                      <option key={type.kind} value={type.kind}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            </div>
            <Button type="submit" tone="accent" pending={documentPending} pendingLabel="Generating…">
              Generate document
            </Button>
          </form>

          {documents.length > 0 ? (
            <DataTable caption="Documents generated from this shipment">
              <thead>
                <tr>
                  <th scope="col">Number</th>
                  <th scope="col">Type</th>
                  <th scope="col">State</th>
                  <th scope="col">
                    <span className="sr-only">Download</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td className="data">{document.number}</td>
                    <td>
                      {documentTypes.find((type) => type.kind === document.kind)?.label ?? document.kind}
                    </td>
                    <td>
                      <DocumentStatus
                        state={
                          document.status === 'voided'
                            ? 'voided'
                            : document.stale
                              ? 'stale'
                              : 'final'
                        }
                        describe
                      />
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
                ))}
              </tbody>
            </DataTable>
          ) : (
            <p className="muted" style={{ marginBottom: 0 }}>
              No documents yet. Generate one once the shipment has at least one line.
            </p>
          )}
        </div>
      </Panel>
    </>
  );
}
