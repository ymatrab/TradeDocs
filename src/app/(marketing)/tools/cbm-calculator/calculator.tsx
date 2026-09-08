'use client';

import { useMemo, useState } from 'react';
import { Panel } from '@/components/primitives/feedback';
import { Field, Input } from '@/components/primitives/form';
import { DataTable, NumericCell } from '@/components/primitives/table';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { decimal } from '@/lib/format';
import { containerFit, volumeOf, type LengthUnit } from '@/lib/trade/calculations';
import { CartonRows, emptyCarton, num, type CartonInput } from '../carton-rows';

/**
 * Volume, live as it is typed.
 *
 * Everything happens in the browser: no figure a visitor enters about a consignment they
 * have not shipped yet is sent anywhere, which is both the honest default and one less
 * thing to explain on a page whose whole job is to earn trust.
 */
export function CbmCalculator() {
  const [unit, setUnit] = useState<LengthUnit>('cm');
  const [cartons, setCartons] = useState<CartonInput[]>([emptyCarton(1)]);
  const [weight, setWeight] = useState('');

  const result = useMemo(
    () =>
      volumeOf(
        cartons.map((row) => ({
          length: num(row.length),
          width: num(row.width),
          height: num(row.height),
          count: num(row.count),
        })),
        unit,
      ),
    [cartons, unit],
  );

  const grossKg = num(weight);
  const fits = containerFit(result.totalVolumeM3, grossKg);
  const stated = result.totalVolumeM3 > 0;

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Panel title="Your cartons">
        <div style={{ display: 'grid', gap: 20 }}>
          <CartonRows cartons={cartons} unit={unit} onChange={setCartons} onUnitChange={setUnit} />
          <div style={{ maxWidth: 240 }}>
            <Field
              id="gross"
              label="Total gross weight (kg)"
              requirement="Optional"
              hint="Adds the weight side of the container check."
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
          </div>
        </div>
      </Panel>

      <BoxGrid label="Volume">
        <FieldBox ordinal="1" caption="Total volume">
          <span className="data">{stated ? `${decimal(result.totalVolumeM3, 3)} m³` : '—'}</span>
        </FieldBox>
        <FieldBox ordinal="2" caption="Cartons">
          <span className="data">{result.totalCartons || '—'}</span>
        </FieldBox>
        <FieldBox ordinal="3" caption="Per carton">
          <span className="data">{stated ? `${decimal(result.unitVolumeM3, 4)} m³` : '—'}</span>
        </FieldBox>
        <FieldBox ordinal="4" caption="Volume in ft³">
          <span className="data">
            {stated ? decimal(result.totalVolumeM3 * 35.3146667, 2) : '—'}
          </span>
        </FieldBox>
      </BoxGrid>

      {stated ? (
        <Panel title="Against a standard container">
          <div style={{ display: 'grid', gap: 12 }}>
            <DataTable caption="How this consignment sits against standard containers">
              <thead>
                <tr>
                  <th scope="col">Container</th>
                  <th scope="col" className="numeric">
                    Volume used
                  </th>
                  <th scope="col" className="numeric">
                    Payload used
                  </th>
                  <th scope="col">Limited by</th>
                </tr>
              </thead>
              <tbody>
                {fits.map((option) => (
                  <tr key={option.kind}>
                    <td>{option.label}</td>
                    <NumericCell value={`${decimal(option.volumeUsed * 100, 1)}%`} />
                    <NumericCell
                      value={grossKg > 0 ? `${decimal(option.weightUsed * 100, 1)}%` : '—'}
                    />
                    <td>
                      {option.fits ? (grossKg > 0 ? option.limitedBy : 'volume') : 'Does not fit'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <p className="muted" style={{ marginBottom: 0 }}>
              A planning estimate against nominal capacities. Real stowage depends on whether the
              cartons stack, how they divide into the container floor, and the pallets they sit on.
              A forwarder’s load plan is the answer that binds.
            </p>
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
