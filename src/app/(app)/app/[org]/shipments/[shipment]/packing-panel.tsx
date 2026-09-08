'use client';

import { useActionState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Combobox, Field, Input, Select } from '@/components/primitives/form';
import { Callout, Panel } from '@/components/primitives/feedback';
import { DataTable, EmptyValue, NumericCell } from '@/components/primitives/table';
import { ConfirmButton } from '@/components/primitives/confirm';
import { ActionResult } from '@/components/primitives/action-result';
import { decimal, quantity as showQuantity } from '@/lib/format';
import {
  addPackage,
  allocateToPackage,
  removeAllocation,
  removePackage,
} from '@/app/(app)/master-data-actions';
import type { ActionState } from '@/app/(app)/actions';

export type PackageContent = {
  id: string;
  item_id: string;
  quantity: number;
};

export type PackageRow = {
  id: string;
  position: number;
  kind: string;
  package_count: number;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  net_weight_kg: number | null;
  gross_weight_kg: number | null;
  volume_m3: number | null;
  marks: string | null;
  contents: PackageContent[];
};

export type PackableItem = {
  id: string;
  position: number;
  description: string;
  quantity: number;
  unit: string;
};

const PACKAGE_KINDS = ['carton', 'pallet', 'crate', 'drum', 'bag', 'roll', 'bundle', 'case'];

function dimensions(row: PackageRow): string | null {
  if (row.length_cm === null || row.width_cm === null || row.height_cm === null) return null;
  return (
    `${decimal(row.length_cm, 1)} × ${decimal(row.width_cm, 1)} × ` +
    `${decimal(row.height_cm, 1)} cm`
  );
}

/**
 * How the goods are physically packed, and whether that story adds up.
 *
 * The reconciliation below is the point of the panel. A packing list whose quantities do
 * not match the invoice it travels with is the single most common reason a consignment is
 * held, and it is always arithmetic nobody re-checked. Here the difference is stated while
 * it can still be fixed, per line, rather than discovered at a border.
 */
export function PackingPanel({
  org,
  shipmentId,
  packages,
  items,
}: {
  org: string;
  shipmentId: string;
  packages: PackageRow[];
  items: PackableItem[];
}) {
  const [addState, addAction, addPending] = useActionState<ActionState, FormData>(addPackage, {});
  const [removeState, removeAction, removePending] = useActionState<ActionState, FormData>(
    removePackage,
    {},
  );
  const [allocateState, allocateAction, allocatePending] = useActionState<ActionState, FormData>(
    allocateToPackage,
    {},
  );
  const [dropState, dropAction, dropPending] = useActionState<ActionState, FormData>(
    removeAllocation,
    {},
  );

  const byItem = new Map(items.map((item) => [item.id, item]));
  const allocated = new Map<string, number>();
  for (const row of packages) {
    for (const content of row.contents) {
      allocated.set(content.item_id, (allocated.get(content.item_id) ?? 0) + content.quantity);
    }
  }

  const unreconciled = items
    .map((item) => ({ item, packed: allocated.get(item.id) ?? 0 }))
    .filter(({ item, packed }) => Math.abs(packed - item.quantity) > 0.0005);

  const totals = packages.reduce(
    (sum, row) => ({
      count: sum.count + row.package_count,
      gross: sum.gross + Number(row.gross_weight_kg ?? 0),
      net: sum.net + Number(row.net_weight_kg ?? 0),
      volume: sum.volume + Number(row.volume_m3 ?? 0),
    }),
    { count: 0, gross: 0, net: 0, volume: 0 },
  );

  return (
    <Panel title="Packing">
      <div style={{ display: 'grid', gap: 20 }}>
        <ActionResult state={addState} successTitle="Added" />
        {/* The removal error is reported inside its confirmation, so only the success
            reaches the panel; the allocation actions have no dialog and report both. */}
        <ActionResult state={{ notice: removeState.notice }} />
        <ActionResult state={allocateState} successTitle="Saved" />
        <ActionResult state={{ notice: dropState.notice, error: dropState.error }} />

        {packages.length > 0 ? (
          <>
            <DataTable caption="Packages on this shipment" density="compact">
              <thead>
                <tr>
                  <th scope="col">Package</th>
                  <th scope="col" className="numeric">
                    Count
                  </th>
                  <th scope="col">Dimensions</th>
                  <th scope="col" className="numeric">
                    Volume
                  </th>
                  <th scope="col" className="numeric">
                    Gross
                  </th>
                  <th scope="col">Contents</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {packages.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {row.kind}
                      {row.marks ? (
                        <>
                          <br />
                          <span className="muted data">{row.marks}</span>
                        </>
                      ) : null}
                    </td>
                    <NumericCell value={String(row.package_count)} />
                    <td className="data">
                      {dimensions(row) ?? <EmptyValue label="Not measured" />}
                    </td>
                    <NumericCell
                      value={row.volume_m3 === null ? '—' : decimal(row.volume_m3, 3)}
                      unit={row.volume_m3 === null ? undefined : 'm³'}
                    />
                    <NumericCell
                      value={row.gross_weight_kg === null ? '—' : decimal(row.gross_weight_kg, 3)}
                      unit={row.gross_weight_kg === null ? undefined : 'kg'}
                    />
                    <td>
                      {row.contents.length === 0 ? (
                        <EmptyValue label="Nothing allocated" />
                      ) : (
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          {row.contents.map((content) => {
                            const item = byItem.get(content.item_id);
                            return (
                              <li key={content.id}>
                                {showQuantity(content.quantity)} {item?.unit ?? ''} —{' '}
                                {item?.description ?? 'Removed line'}{' '}
                                <form
                                  action={dropAction}
                                  style={{ display: 'inline' }}
                                  aria-label={`Remove ${item?.description ?? 'this line'} from ${row.kind} ${row.position}`}
                                >
                                  <input type="hidden" name="org" value={org} />
                                  <input type="hidden" name="shipment" value={shipmentId} />
                                  <input type="hidden" name="allocation" value={content.id} />
                                  <Button
                                    type="submit"
                                    tone="quiet"
                                    compact
                                    pending={dropPending}
                                    pendingLabel="…"
                                  >
                                    Remove
                                  </Button>
                                </form>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </td>
                    <td>
                      <form id={`remove-package-${row.id}`} action={removeAction}>
                        <input type="hidden" name="org" value={org} />
                        <input type="hidden" name="shipment" value={shipmentId} />
                        <input type="hidden" name="package" value={row.id} />
                      </form>
                      <ConfirmButton
                        form={`remove-package-${row.id}`}
                        tone="quiet"
                        compact
                        triggerLabel={`Remove ${row.kind} ${row.position}`}
                        triggerIcon={<Trash2 size={15} aria-hidden="true" />}
                        title="Remove this package?"
                        description={`The ${row.kind} and everything allocated to it come off the packing list. Documents already generated keep it, because they are locked to the revision they were rendered from.`}
                        confirm="Remove the package"
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
                  <th scope="row">Total</th>
                  <NumericCell value={String(totals.count)} />
                  <td />
                  <NumericCell value={decimal(totals.volume, 3)} unit="m³" />
                  <NumericCell value={decimal(totals.gross, 3)} unit="kg" />
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </DataTable>

            {unreconciled.length > 0 ? (
              <Callout tone="warning" title="The packing does not match the lines">
                <span style={{ display: 'block' }}>
                  A packing list and an invoice that disagree on quantity is the usual reason a
                  consignment is held. These lines differ:
                </span>
                <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 18 }}>
                  {unreconciled.map(({ item, packed }) => (
                    <li key={item.id}>
                      {item.description}: {showQuantity(packed)} of {showQuantity(item.quantity)}{' '}
                      {item.unit} allocated
                      {packed > item.quantity ? ' — more packed than invoiced' : ''}
                    </li>
                  ))}
                </ul>
              </Callout>
            ) : (
              <Callout tone="success" title="Packing reconciles">
                Every line is fully allocated to a package. The packing list and the invoice will
                state the same quantities.
              </Callout>
            )}
          </>
        ) : (
          <p className="muted" style={{ marginBottom: 0 }}>
            No packages described yet. Add them to state dimensions, marks and volume on the packing
            list, and to check that what is packed matches what is invoiced. A shipment can be
            documented without this.
          </p>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          <h3 className="caption" style={{ margin: 0 }}>
            Add a package
          </h3>
          <form
            action={addAction}
            aria-label="Add a package"
            style={{ display: 'grid', gap: 16 }}
            noValidate
          >
            <input type="hidden" name="org" value={org} />
            <input type="hidden" name="shipment" value={shipmentId} />
            <div
              style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              }}
            >
              <Field id="package_kind_new" label="Type" error={addState.fields?.kind}>
                {({ id, invalid }) => (
                  <Combobox
                    id={id}
                    name="kind"
                    options={PACKAGE_KINDS}
                    defaultValue="carton"
                    maxLength={40}
                    invalid={invalid}
                  />
                )}
              </Field>
              <Field id="package_count_new" label="How many" error={addState.fields?.package_count}>
                {({ id, invalid }) => (
                  <Input
                    id={id}
                    name="package_count"
                    type="number"
                    step="1"
                    min="1"
                    defaultValue="1"
                    required
                    invalid={invalid}
                  />
                )}
              </Field>
              <Field
                id="length_cm"
                label="Length (cm)"
                requirement="Optional"
                error={addState.fields?.length_cm}
              >
                {({ id, invalid }) => (
                  <Input id={id} name="length_cm" inputMode="decimal" invalid={invalid} />
                )}
              </Field>
              <Field
                id="width_cm"
                label="Width (cm)"
                requirement="Optional"
                error={addState.fields?.width_cm}
              >
                {({ id, invalid }) => (
                  <Input id={id} name="width_cm" inputMode="decimal" invalid={invalid} />
                )}
              </Field>
              <Field
                id="height_cm"
                label="Height (cm)"
                requirement="Optional"
                error={addState.fields?.height_cm}
              >
                {({ id, invalid }) => (
                  <Input id={id} name="height_cm" inputMode="decimal" invalid={invalid} />
                )}
              </Field>
              <Field
                id="package_net"
                label="Package net weight (kg)"
                requirement="Optional"
                error={addState.fields?.net_weight_kg}
              >
                {({ id, invalid }) => (
                  <Input id={id} name="net_weight_kg" inputMode="decimal" invalid={invalid} />
                )}
              </Field>
              <Field
                id="package_gross"
                label="Package gross weight (kg)"
                requirement="Optional"
                error={addState.fields?.gross_weight_kg}
              >
                {({ id, invalid }) => (
                  <Input id={id} name="gross_weight_kg" inputMode="decimal" invalid={invalid} />
                )}
              </Field>
              <Field
                id="package_marks"
                label="Marks"
                requirement="Optional"
                error={addState.fields?.marks}
              >
                {({ id, invalid }) => (
                  <Input id={id} name="marks" maxLength={500} invalid={invalid} />
                )}
              </Field>
            </div>
            <div>
              <Button type="submit" tone="secondary" pending={addPending} pendingLabel="Adding…">
                Add package
              </Button>
            </div>
          </form>
        </div>

        {packages.length > 0 && items.length > 0 ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <h3 className="caption" style={{ margin: 0 }}>
              Allocate goods to a package
            </h3>
            <form
              action={allocateAction}
              aria-label="Allocate goods to a package"
              style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                alignItems: 'end',
              }}
              noValidate
            >
              <input type="hidden" name="org" value={org} />
              <input type="hidden" name="shipment" value={shipmentId} />
              <Field id="allocate_package" label="Package">
                {({ id }) => (
                  <Select id={id} name="package" required>
                    {packages.map((row) => (
                      <option key={row.id} value={row.id}>
                        {row.position}. {row.kind}
                        {row.marks ? ` — ${row.marks}` : ''}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field id="allocate_item" label="Line">
                {({ id }) => (
                  <Select id={id} name="item" required>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.position}. {item.description}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field
                id="allocate_quantity"
                label="Quantity in this package"
                hint="Replaces any earlier amount for this line in this package."
                error={allocateState.fields?.quantity}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="quantity"
                    type="number"
                    step="0.001"
                    min="0.001"
                    required
                    invalid={invalid}
                    aria-describedby={describedBy}
                  />
                )}
              </Field>
              <div>
                <Button
                  type="submit"
                  tone="secondary"
                  pending={allocatePending}
                  pendingLabel="Saving…"
                >
                  Allocate
                </Button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}
