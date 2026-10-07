'use client';

import { useMemo, useState } from 'react';
import { Callout, Panel } from '@/components/primitives/feedback';
import { Field, Input, Select } from '@/components/primitives/form';
import { DataTable, NumericCell } from '@/components/primitives/table';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { decimal } from '@/lib/format';
import {
  LENGTH_UNITS,
  WEIGHT_UNITS,
  type LengthUnit,
  type WeightUnit,
} from '@/lib/trade/calculations';
import { containerLoading } from '@/lib/trade/container-loading';

/**
 * Cartons or pallets per container, live as it is typed, entirely in the browser.
 *
 * One unit size at a time: a mixed load is a stow-planning problem, which this tool says it
 * does not solve rather than pretending to with an average.
 */
export function ContainerLoadingCalculator() {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>('cm');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [quantity, setQuantity] = useState('');
  const [usable, setUsable] = useState('100');

  const result = useMemo(
    () =>
      containerLoading({
        length,
        width,
        height,
        lengthUnit,
        weight,
        weightUnit,
        quantity,
        usablePercent: usable,
      }),
    [length, width, height, lengthUnit, weight, weightUnit, quantity, usable],
  );
  const started = Boolean(length || width || height);

  const dimension = (id: string, label: string, value: string, set: (next: string) => void) => (
    <Field id={id} label={`${label} (${lengthUnit})`}>
      {({ id: fieldId }) => (
        <Input
          id={fieldId}
          inputMode="decimal"
          value={value}
          className="input data numeric"
          onChange={(event) => set(event.target.value)}
        />
      )}
    </Field>
  );

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Panel title="One carton or pallet">
        <div style={{ display: 'grid', gap: 14 }}>
          <div className="form-row">
            {dimension('load-length', 'Length', length, setLength)}
            {dimension('load-width', 'Width', width, setWidth)}
            {dimension('load-height', 'Height', height, setHeight)}
            <Field id="load-length-unit" label="Unit">
              {({ id }) => (
                <Select
                  id={id}
                  value={lengthUnit}
                  onChange={(event) => setLengthUnit(event.target.value as LengthUnit)}
                >
                  {(Object.keys(LENGTH_UNITS) as LengthUnit[]).map((unit) => (
                    <option key={unit} value={unit}>
                      {LENGTH_UNITS[unit].label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <div className="form-row">
            <Field
              id="load-weight"
              label="Gross weight of one unit"
              requirement="Optional"
              hint="Adds the payload limit to the check."
            >
              {({ id, describedBy }) => (
                <Input
                  id={id}
                  inputMode="decimal"
                  value={weight}
                  aria-describedby={describedBy}
                  className="input data numeric"
                  onChange={(event) => setWeight(event.target.value)}
                />
              )}
            </Field>
            <Field id="load-weight-unit" label="Weight unit">
              {({ id }) => (
                <Select
                  id={id}
                  value={weightUnit}
                  onChange={(event) => setWeightUnit(event.target.value as WeightUnit)}
                >
                  {(Object.keys(WEIGHT_UNITS) as WeightUnit[]).map((unit) => (
                    <option key={unit} value={unit}>
                      {WEIGHT_UNITS[unit].label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field
              id="load-quantity"
              label="Units to ship"
              requirement="Optional"
              hint="A whole number; adds how many containers it takes."
            >
              {({ id, describedBy }) => (
                <Input
                  id={id}
                  inputMode="numeric"
                  value={quantity}
                  aria-describedby={describedBy}
                  className="input data numeric"
                  onChange={(event) => setQuantity(event.target.value)}
                />
              )}
            </Field>
            <Field
              id="load-usable"
              label="Usable volume (%)"
              hint="100 is the pure volume bound. Lower it for the gaps real loading leaves."
            >
              {({ id, describedBy }) => (
                <Input
                  id={id}
                  inputMode="decimal"
                  value={usable}
                  aria-describedby={describedBy}
                  className="input data numeric"
                  onChange={(event) => setUsable(event.target.value)}
                />
              )}
            </Field>
          </div>
        </div>
      </Panel>

      {result ? (
        <>
          <BoxGrid label="One unit">
            <FieldBox ordinal="1" caption="Volume per unit">
              <span className="data">{decimal(Number(result.unitVolumeM3), 4)} m³</span>
            </FieldBox>
            <FieldBox ordinal="2" caption="Weight per unit">
              <span className="data">
                {result.unitWeightKg === null
                  ? '—'
                  : `${decimal(Number(result.unitWeightKg), 2)} kg`}
              </span>
            </FieldBox>
            <FieldBox ordinal="3" caption="Usable volume">
              <span className="data">{decimal(result.usablePercent, 0)}%</span>
            </FieldBox>
          </BoxGrid>

          <Panel title="Estimated units per container">
            <div style={{ display: 'grid', gap: 12 }}>
              <DataTable caption="Most units that fit each container by volume and by weight">
                <thead>
                  <tr>
                    <th scope="col">Container</th>
                    <th scope="col" className="numeric">
                      By volume
                    </th>
                    <th scope="col" className="numeric">
                      By weight
                    </th>
                    <th scope="col" className="numeric">
                      Estimate
                    </th>
                    <th scope="col">Limited by</th>
                    <th scope="col" className="numeric">
                      Containers needed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.containers.map((option) => (
                    <tr key={option.kind}>
                      <td>{option.label}</td>
                      <NumericCell value={decimal(option.byVolume, 0)} />
                      <NumericCell
                        value={option.byWeight === null ? '—' : decimal(option.byWeight, 0)}
                      />
                      <NumericCell value={decimal(option.units, 0)} />
                      <td>{option.units === 0 ? 'Does not fit' : option.limitedBy}</td>
                      <NumericCell
                        value={
                          option.containersNeeded === null
                            ? '—'
                            : decimal(option.containersNeeded, 0)
                        }
                      />
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </div>
          </Panel>
        </>
      ) : started ? (
        <Callout tone="warning" title="Enter one unit's outside size" live>
          Length, width and height as positive numbers; any weight or quantity as a positive number,
          the quantity whole; usable volume between 1 and 100.
        </Callout>
      ) : null}

      <Callout tone="legal" title="An estimate, not a stow plan">
        These figures divide typical internal volumes and payloads by one unit. They ignore the
        container&apos;s internal dimensions and door height, how the units divide into the floor
        and whether they stack, so fewer will fit in practice. Containers vary by series and
        carrier. Your forwarder&apos;s load plan is the answer that binds.
      </Callout>
    </div>
  );
}
