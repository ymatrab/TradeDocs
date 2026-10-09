'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Field, Input, Select } from '@/components/primitives/form';
import { Panel } from '@/components/primitives/feedback';
import { DataTable, EmptyValue, NumericCell } from '@/components/primitives/table';
import { ConfirmButton } from '@/components/primitives/confirm';
import { ActionResult as Result } from '@/components/primitives/action-result';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { sent, useOutcomeToast } from '@/components/primitives/use-outcome-toast';
import { currencyMinorUnits, lineTotal } from '@/lib/money';
import { addItem, removeItem, updateShipment } from '../../../../shipment-actions';
import type { ActionState } from '../../../../actions';
import { CatalogPicker, type CatalogEntry } from './catalog-picker';

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

const incoterms = ['', 'EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];

/**
 * One formatter for every figure on the screen. A fixed locale rather than the
 * viewer's: a shipment's arithmetic has to read the same to the exporter, the
 * buyer and the bank looking at the same document.
 *
 * Precision varies because a unit price carries more of it than a total, and a
 * quantity of 1,280 should not read 1,280.000. The grouping never varies.
 */
function figure(value: number, max = 2, min = max): string {
  return value.toLocaleString('en-GB', {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  });
}

function removalNotice(description: string): string {
  return (
    `“${description}” comes off this shipment and its totals recalculate. ` +
    'Documents already generated keep the line, because they are locked to the ' +
    'revision they were rendered from.'
  );
}

export function ShipmentEditor({
  org,
  shipmentId,
  shipment,
  items,
  totals,
  catalog,
}: {
  org: string;
  shipmentId: string;
  shipment: Record<string, string | number | null>;
  items: Item[];
  totals: { quantity: number; value: number; net: number };
  catalog: CatalogEntry[];
}) {
  const [detailState, detailAction, detailPending] = useActionState<ActionState, FormData>(
    updateShipment,
    {},
  );
  const [itemState, itemAction, itemPending] = useActionState<ActionState, FormData>(addItem, {});
  const [removeState, removeAction, removePending] = useActionState<ActionState, FormData>(
    removeItem,
    {},
  );
  const currency = String(shipment.currency ?? 'EUR');
  const moneyPlaces = currencyMinorUnits(currency);
  const detailForm = useRef<HTMLFormElement>(null);
  const itemForm = useRef<HTMLFormElement>(null);
  useInvalidFocus(detailForm, detailState.fields);
  useInvalidFocus(itemForm, itemState.fields);

  const rememberDetails = useOutcomeToast(detailState, () => 'Route and terms saved.');
  const rememberLine = useOutcomeToast(itemState, (submitted) => {
    const description = sent(submitted, 'description') ?? 'The line';
    const amount = sent(submitted, 'quantity');
    const unit = sent(submitted, 'unit') ?? '';
    return amount
      ? `“${description}” is on the shipment: ${amount} ${unit}.`.replace(' .', '.')
      : `“${description}” is on the shipment.`;
  });
  const descriptionOf = new Map(items.map((item) => [item.id, item.description]));
  const rememberRemoval = useOutcomeToast(removeState, (submitted) => {
    const item = sent(submitted, 'item');
    return `“${(item && descriptionOf.get(item)) ?? 'The line'}” is off the shipment.`;
  });

  // Entering lines is a run, not a single act: once one is on the shipment, the cursor
  // goes back to the description so the next can be typed straight away.
  const lastLine = useRef(itemState);
  useEffect(() => {
    if (itemState === lastLine.current) return;
    lastLine.current = itemState;
    if (itemState.notice) {
      itemForm.current?.querySelector<HTMLInputElement>('input[name="description"]')?.focus();
    }
  }, [itemState]);

  return (
    <>
      <Panel title="Shipment details" id="terms">
        <form
          ref={detailForm}
          action={detailAction}
          onSubmit={rememberDetails}
          style={{ display: 'grid', gap: 16 }}
          noValidate
        >
          <input type="hidden" name="org" value={org} />
          <input type="hidden" name="shipment" value={shipmentId} />
          {/* The revision this form shows. A save against a newer one is refused rather
              than overwriting someone else's change. */}
          <input type="hidden" name="revision" value={String(shipment.revision ?? '')} />
          <Result state={detailState} />
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            }}
          >
            <Field id="incoterm" label="Incoterm 2020" error={detailState.fields?.incoterm}>
              {({ id, invalid }) => (
                <Select
                  id={id}
                  name="incoterm"
                  invalid={invalid}
                  defaultValue={String(shipment.incoterm ?? '')}
                >
                  {incoterms.map((term) => (
                    <option key={term || 'none'} value={term}>
                      {term || 'Not set'}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field
              id="incoterm_place"
              label="Named place"
              error={detailState.fields?.incoterm_place}
            >
              {({ id, invalid }) => (
                <Input
                  id={id}
                  name="incoterm_place"
                  invalid={invalid}
                  defaultValue={String(shipment.incoterm_place ?? '')}
                />
              )}
            </Field>
            <Field
              id="port_of_loading"
              label="Port of loading"
              error={detailState.fields?.port_of_loading}
            >
              {({ id, invalid }) => (
                <Input
                  id={id}
                  name="port_of_loading"
                  invalid={invalid}
                  defaultValue={String(shipment.port_of_loading ?? '')}
                />
              )}
            </Field>
            <Field
              id="port_of_discharge"
              label="Port of discharge"
              error={detailState.fields?.port_of_discharge}
            >
              {({ id, invalid }) => (
                <Input
                  id={id}
                  name="port_of_discharge"
                  invalid={invalid}
                  defaultValue={String(shipment.port_of_discharge ?? '')}
                />
              )}
            </Field>
            <Field
              id="country_of_origin"
              label="Country of origin"
              hint="Two-letter code."
              error={detailState.fields?.country_of_origin}
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="country_of_origin"
                  maxLength={2}
                  invalid={invalid}
                  aria-describedby={describedBy}
                  defaultValue={String(shipment.country_of_origin ?? '')}
                />
              )}
            </Field>
            <Field
              id="country_of_destination"
              label="Country of destination"
              hint="Two-letter code."
              error={detailState.fields?.country_of_destination}
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="country_of_destination"
                  maxLength={2}
                  invalid={invalid}
                  aria-describedby={describedBy}
                  defaultValue={String(shipment.country_of_destination ?? '')}
                />
              )}
            </Field>
          </div>
          <Field
            id="shipped_on"
            label="Shipping date"
            requirement="Optional"
            hint="The date the goods leave, as stated on the delivery note."
            error={detailState.fields?.shipped_on}
          >
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name="shipped_on"
                type="date"
                invalid={invalid}
                aria-describedby={describedBy}
                defaultValue={String(shipment.shipped_on ?? '')}
              />
            )}
          </Field>
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            }}
          >
            <Field
              id="buyer_reference"
              label="Buyer reference / PO number"
              requirement="Optional"
              hint="Printed on the invoices, the sales confirmation and the sales contract."
              error={detailState.fields?.buyer_reference}
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="buyer_reference"
                  maxLength={60}
                  invalid={invalid}
                  aria-describedby={describedBy}
                  defaultValue={String(shipment.buyer_reference ?? '')}
                />
              )}
            </Field>
            <Field
              id="proforma_valid_until"
              label="Offer valid until"
              requirement="Optional"
              hint="The last day the proforma's or quotation's prices and terms stand."
              error={detailState.fields?.proforma_valid_until}
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  name="proforma_valid_until"
                  type="date"
                  invalid={invalid}
                  aria-describedby={describedBy}
                  defaultValue={String(shipment.proforma_valid_until ?? '')}
                />
              )}
            </Field>
          </div>
          <fieldset style={{ display: 'grid', gap: 16, border: 0, padding: 0, margin: 0 }}>
            <legend className="caption">Container and VGM</legend>
            <p className="muted" style={{ margin: 0 }}>
              For the bill of lading draft, the shipper&rsquo;s letter of instruction and the VGM
              declaration. Under SOLAS the shipper declares the verified gross mass of a packed
              container; TradeDocs prints what you enter and does not weigh or check it.
            </p>
            <div
              style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              }}
            >
              <Field
                id="container_number"
                label="Container number"
                requirement="Optional"
                hint="Four letters and seven digits, such as CSQU3054383."
                error={detailState.fields?.container_number}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="container_number"
                    maxLength={13}
                    autoCapitalize="characters"
                    invalid={invalid}
                    aria-describedby={describedBy}
                    defaultValue={String(shipment.container_number ?? '')}
                  />
                )}
              </Field>
              <Field
                id="container_type"
                label="Container type"
                requirement="Optional"
                hint="Such as 20GP or 40HC."
                error={detailState.fields?.container_type}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="container_type"
                    maxLength={12}
                    invalid={invalid}
                    aria-describedby={describedBy}
                    defaultValue={String(shipment.container_type ?? '')}
                  />
                )}
              </Field>
              <Field
                id="seal_number"
                label="Seal number"
                requirement="Optional"
                hint="The carrier or shipper seal on the doors."
                error={detailState.fields?.seal_number}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="seal_number"
                    maxLength={40}
                    invalid={invalid}
                    aria-describedby={describedBy}
                    defaultValue={String(shipment.seal_number ?? '')}
                  />
                )}
              </Field>
              <Field
                id="booking_number"
                label="Booking number"
                requirement="Optional"
                hint="The carrier’s booking reference."
                error={detailState.fields?.booking_number}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="booking_number"
                    maxLength={40}
                    invalid={invalid}
                    aria-describedby={describedBy}
                    defaultValue={String(shipment.booking_number ?? '')}
                  />
                )}
              </Field>
              <Field
                id="vessel_voyage"
                label="Vessel and voyage"
                requirement="Optional"
                hint="Such as NORDIC STAR 042E."
                error={detailState.fields?.vessel_voyage}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="vessel_voyage"
                    maxLength={80}
                    invalid={invalid}
                    aria-describedby={describedBy}
                    defaultValue={String(shipment.vessel_voyage ?? '')}
                  />
                )}
              </Field>
              <Field
                id="vgm_method"
                label="VGM weighing method"
                requirement="Optional"
                hint="Method 1 weighs the packed container; method 2 adds the weighed contents to the tare."
                error={detailState.fields?.vgm_method}
              >
                {({ id, describedBy, invalid }) => (
                  <Select
                    id={id}
                    name="vgm_method"
                    invalid={invalid}
                    aria-describedby={describedBy}
                    defaultValue={String(shipment.vgm_method ?? '')}
                  >
                    <option value="">Not stated</option>
                    <option value="1">Method 1: packed container weighed</option>
                    <option value="2">Method 2: contents weighed, tare added</option>
                  </Select>
                )}
              </Field>
              <Field
                id="vgm_kg"
                label="Verified gross mass (kg)"
                requirement="Optional"
                hint="Cargo, packing, pallets, dunnage and securing material, plus the container tare."
                error={detailState.fields?.vgm_kg}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="vgm_kg"
                    type="number"
                    step="0.001"
                    min="0.001"
                    invalid={invalid}
                    aria-describedby={describedBy}
                    defaultValue={String(shipment.vgm_kg ?? '')}
                  />
                )}
              </Field>
              <Field
                id="vgm_weighed_on"
                label="Date of weighing"
                requirement="Optional"
                error={detailState.fields?.vgm_weighed_on}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="vgm_weighed_on"
                    type="date"
                    invalid={invalid}
                    aria-describedby={describedBy}
                    defaultValue={String(shipment.vgm_weighed_on ?? '')}
                  />
                )}
              </Field>
              <Field
                id="vgm_signatory"
                label="VGM signatory"
                requirement="Optional"
                hint="The person the shipper authorizes to sign; printed in capitals."
                error={detailState.fields?.vgm_signatory}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="vgm_signatory"
                    maxLength={80}
                    invalid={invalid}
                    aria-describedby={describedBy}
                    defaultValue={String(shipment.vgm_signatory ?? '')}
                  />
                )}
              </Field>
            </div>
          </fieldset>
          <Field
            id="marks_and_numbers"
            label="Marks and numbers"
            error={detailState.fields?.marks_and_numbers}
          >
            {({ id, invalid }) => (
              <Input
                id={id}
                name="marks_and_numbers"
                invalid={invalid}
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

      <Panel title="Line items" id="goods">
        <div style={{ display: 'grid', gap: 16 }}>
          {/* Adding and removing are separate actions; each reports its own outcome
              rather than one masking the other. A failed removal is reported inside
              its confirmation, so only the success reaches the panel. */}
          <Result state={itemState} />
          <Result state={{ notice: removeState.notice }} />
          {items.length > 0 ? (
            <DataTable caption="Goods on this shipment" density="compact" stack>
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
                    <td className="stack-title">{item.description}</td>
                    <td className="data" data-label="HS code">
                      {item.hs_code ?? <EmptyValue label="No HS code" />}
                    </td>
                    <NumericCell
                      label="Quantity"
                      value={figure(Number(item.quantity), 3, 0)}
                      unit={item.unit}
                    />
                    <NumericCell label="Unit price" value={figure(Number(item.unit_price), 4)} />
                    <NumericCell
                      label="Amount"
                      value={figure(
                        lineTotal(item.quantity, item.unit_price, moneyPlaces).toNumber(),
                        moneyPlaces,
                      )}
                      unit={currency}
                    />
                    <td className="stack-actions">
                      <form
                        id={`remove-item-${item.id}`}
                        action={removeAction}
                        onSubmit={rememberRemoval}
                      >
                        <input type="hidden" name="org" value={org} />
                        <input type="hidden" name="shipment" value={shipmentId} />
                        <input type="hidden" name="item" value={item.id} />
                      </form>
                      <ConfirmButton
                        form={`remove-item-${item.id}`}
                        tone="quiet"
                        compact
                        triggerLabel={`Remove ${item.description}`}
                        triggerIcon={<Trash2 size={15} aria-hidden="true" />}
                        title="Remove this line?"
                        description={removalNotice(item.description)}
                        confirm="Remove the line"
                        cancel="Keep it"
                        pending={removePending}
                        error={removeState.error}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" colSpan={4}>
                    Total
                  </th>
                  <NumericCell value={figure(totals.value, moneyPlaces)} unit={currency} />
                  <td className="stack-empty" />
                </tr>
              </tfoot>
            </DataTable>
          ) : (
            <p className="muted" style={{ marginBottom: 0 }}>
              No lines yet. A document needs at least one: pick a product from the catalog below, or
              type a one-off line.
            </p>
          )}

          {/* Two ways in, in the order they are worth reaching for. Anything shipped more
              than once belongs in the catalog, where its HS code and weights are stated
              once and cannot drift between shipments; the form below stays for the line
              that genuinely happens only here. */}
          <div style={{ display: 'grid', gap: 12 }}>
            <h3 className="caption" style={{ margin: 0 }}>
              Add from the catalog
            </h3>
            <CatalogPicker org={org} shipmentId={shipmentId} catalog={catalog} />
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <h3 className="caption" style={{ margin: 0 }}>
              Or enter a one-off line
            </h3>
            <p className="muted" style={{ margin: 0 }}>
              Typed here, these values live on this shipment only.
            </p>
          </div>

          <form
            ref={itemForm}
            action={itemAction}
            onSubmit={rememberLine}
            aria-label="Add a one-off line"
            style={{ display: 'grid', gap: 16 }}
            noValidate
          >
            <input type="hidden" name="org" value={org} />
            <input type="hidden" name="shipment" value={shipmentId} />
            <Field
              id="description"
              label="Description of goods"
              error={itemState.fields?.description}
            >
              {({ id, invalid }) => (
                <Input id={id} name="description" required maxLength={500} invalid={invalid} />
              )}
            </Field>
            <div
              style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              }}
            >
              <Field
                id="hs_code"
                label="HS code"
                requirement="Optional"
                error={itemState.fields?.hs_code}
              >
                {({ id, invalid }) => (
                  <Input
                    id={id}
                    name="hs_code"
                    inputMode="numeric"
                    maxLength={10}
                    invalid={invalid}
                  />
                )}
              </Field>
              <Field
                id="item_origin"
                label="Origin"
                requirement="Optional"
                error={itemState.fields?.country_of_origin}
              >
                {({ id, invalid }) => (
                  <Input id={id} name="country_of_origin" maxLength={2} invalid={invalid} />
                )}
              </Field>
              <Field id="quantity" label="Quantity" error={itemState.fields?.quantity}>
                {({ id, invalid }) => (
                  <Input
                    id={id}
                    name="quantity"
                    type="number"
                    step="0.001"
                    min="0.001"
                    required
                    invalid={invalid}
                  />
                )}
              </Field>
              <Field id="unit" label="Unit" error={itemState.fields?.unit}>
                {({ id, invalid }) => (
                  <Input id={id} name="unit" defaultValue="pcs" maxLength={12} invalid={invalid} />
                )}
              </Field>
              <Field id="unit_price" label="Unit price" error={itemState.fields?.unit_price}>
                {({ id, invalid }) => (
                  <Input
                    id={id}
                    name="unit_price"
                    type="number"
                    step="0.0001"
                    min="0"
                    defaultValue="0"
                    invalid={invalid}
                  />
                )}
              </Field>
              <Field
                id="net_weight_kg"
                label="Net weight (kg)"
                requirement="Optional"
                error={itemState.fields?.net_weight_kg}
              >
                {({ id, invalid }) => (
                  <Input
                    id={id}
                    name="net_weight_kg"
                    type="number"
                    step="0.001"
                    min="0"
                    invalid={invalid}
                  />
                )}
              </Field>
              <Field
                id="package_count"
                label="Packages"
                requirement="Optional"
                error={itemState.fields?.package_count}
              >
                {({ id, invalid }) => (
                  <Input
                    id={id}
                    name="package_count"
                    type="number"
                    step="1"
                    min="0"
                    invalid={invalid}
                  />
                )}
              </Field>
            </div>
            <div className="form-submit-row">
              <Button type="submit" tone="secondary" pending={itemPending} pendingLabel="Adding…">
                Add line
              </Button>
              <p className="hint" style={{ margin: 0 }}>
                Enter in any field adds the line; the cursor returns to the description for the next
                one.
              </p>
            </div>
          </form>
        </div>
      </Panel>
    </>
  );
}
