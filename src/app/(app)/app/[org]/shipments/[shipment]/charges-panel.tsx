'use client';

import { useActionState } from 'react';
import { Button } from '@/components/primitives/button';
import { Choice, Field, Input, Select } from '@/components/primitives/form';
import { Panel, EmptyState } from '@/components/primitives/feedback';
import { ActionResult } from '@/components/primitives/action-result';
import { DataTable, NumericCell } from '@/components/primitives/table';
import { addCharge, removeCharge } from '@/app/(app)/charge-actions';
import type { ActionState } from '@/app/(app)/actions';
import { CHARGE_KINDS, CHARGE_LABELS, MAX_CHARGES, type ChargeKind } from '@/lib/trade/charges';

export type ChargeRow = {
  id: string;
  position: number;
  kind: ChargeKind;
  label: string | null;
  /** Formatted to the currency's minor units. */
  amount: string;
  included_in_price: boolean;
};

/**
 * Freight, insurance, packing, commission, other charges and discounts (D-029). A US
 * commercial invoice itemizes every charge by name and amount, or says it is included in the
 * price (19 CFR 141.86(a)(8)), and states every discount (141.86(g)). They print on the
 * commercial and proforma invoices between the goods value and the total.
 */
export function ChargesPanel({
  org,
  shipmentId,
  currency,
  charges,
  goodsValue,
  total,
}: {
  org: string;
  shipmentId: string;
  currency: string;
  charges: ChargeRow[];
  /** Formatted: the sum of the line amounts. */
  goodsValue: string;
  /** Formatted: what the invoice will total, or null when there are no charges. */
  total: string | null;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(addCharge, {});
  const [removeState, remove, removing] = useActionState<ActionState, FormData>(removeCharge, {});
  const full = charges.length >= MAX_CHARGES;

  return (
    <Panel title="Charges and discounts" id="charges">
      <div style={{ display: 'grid', gap: 16 }}>
        <p className="muted" style={{ marginBottom: 0 }}>
          Freight, insurance, packing, commission and discounts print on the commercial and
          proforma invoices, each by name and amount. Tick &ldquo;included in the prices&rdquo;
          for a charge your unit prices already contain: it is shown for the record and not added
          again.
        </p>
        <ActionResult state={removeState} successTitle="Removed" />

        {charges.length === 0 ? (
          <EmptyState
            title="No charges or discounts"
            description="The invoice total is the goods value. Add freight and insurance for CIF, CIP or DAP sales."
          />
        ) : (
          <DataTable caption="Charges and discounts on this shipment" stack density="compact">
            <thead>
              <tr>
                <th scope="col">Charge</th>
                <th scope="col">In prices</th>
                <th scope="col" className="numeric">
                  Amount
                </th>
                <th scope="col">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {charges.map((charge) => {
                const name =
                  charge.kind === 'other' && charge.label ? charge.label : CHARGE_LABELS[charge.kind];
                return (
                  <tr key={charge.id}>
                    <td className="stack-title">{name}</td>
                    <td data-label="In prices">{charge.included_in_price ? 'Yes' : 'No'}</td>
                    <NumericCell
                      label="Amount"
                      value={`${charge.kind === 'discount' && !charge.included_in_price ? '-' : ''}${charge.amount}`}
                      unit={currency}
                    />
                    <td>
                      <form action={remove}>
                        <input type="hidden" name="org" value={org} />
                        <input type="hidden" name="shipment" value={shipmentId} />
                        <input type="hidden" name="charge" value={charge.id} />
                        <Button
                          type="submit"
                          tone="quiet"
                          compact
                          pending={removing}
                          pendingLabel="Removing…"
                          aria-label={`Remove ${name}`}
                        >
                          Remove
                        </Button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        )}

        <dl className="figures" style={{ margin: 0 }}>
          <div>
            <dt>Goods value</dt>
            <dd className="data">
              {goodsValue} {currency}
            </dd>
          </div>
          {total ? (
            <div>
              <dt>Invoice total</dt>
              <dd className="data">
                {total} {currency}
              </dd>
            </div>
          ) : null}
        </dl>

        {full ? (
          <p className="muted" style={{ marginBottom: 0 }}>
            This shipment has the most charges it can hold ({MAX_CHARGES}).
          </p>
        ) : (
          <form
            action={action}
            aria-label="Add a charge or discount"
            style={{ display: 'grid', gap: 12 }}
          >
            <ActionResult state={state} successTitle="Added" />
            <input type="hidden" name="org" value={org} />
            <input type="hidden" name="shipment" value={shipmentId} />
            <div
              style={{
                display: 'grid',
                gap: 12,
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              }}
            >
              <Field id="charge-kind" label="Charge" error={state.fields?.kind}>
                {({ id, describedBy, invalid }) => (
                  <Select
                    id={id}
                    name="kind"
                    defaultValue="freight"
                    aria-describedby={describedBy}
                    invalid={invalid}
                  >
                    {CHARGE_KINDS.map((kind) => (
                      <option key={kind} value={kind}>
                        {CHARGE_LABELS[kind]}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field
                id="charge-label"
                label="Description"
                requirement="For other charges"
                error={state.fields?.label}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="label"
                    maxLength={80}
                    aria-describedby={describedBy}
                    invalid={invalid}
                  />
                )}
              </Field>
              <Field id="charge-amount" label={`Amount (${currency})`} error={state.fields?.amount}>
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="amount"
                    inputMode="decimal"
                    required
                    aria-describedby={describedBy}
                    invalid={invalid}
                  />
                )}
              </Field>
            </div>
            <Choice
              id="charge-included"
              name="included_in_price"
              label="Included in the prices"
              hint="Already part of the unit prices: shown on the invoice and not added to the total."
            />
            <div>
              <Button type="submit" pending={pending} pendingLabel="Adding…">
                Add charge
              </Button>
            </div>
          </form>
        )}
      </div>
    </Panel>
  );
}
