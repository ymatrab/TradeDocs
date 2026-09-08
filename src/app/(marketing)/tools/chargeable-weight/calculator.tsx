'use client';

import { useMemo, useState } from 'react';
import { Callout, Panel } from '@/components/primitives/feedback';
import { Field, Input, Select } from '@/components/primitives/form';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { decimal } from '@/lib/format';
import {
  VOLUMETRIC_RULES,
  WEIGHT_UNITS,
  chargeableWeight,
  toKilograms,
  volumeOf,
  type LengthUnit,
  type VolumetricRule,
  type WeightUnit,
} from '@/lib/trade/calculations';
import { CartonRows, emptyCarton, num, type CartonInput } from '../carton-rows';

/**
 * Chargeable weight, live as it is typed.
 *
 * The comparison is the whole point of the page, so both figures stay on screen beside
 * the one that wins. Showing only the answer teaches nobody why their light consignment
 * costs what a heavy one does.
 */
export function ChargeableWeightCalculator() {
  const [unit, setUnit] = useState<LengthUnit>('cm');
  const [cartons, setCartons] = useState<CartonInput[]>([emptyCarton(1)]);
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [rule, setRule] = useState<VolumetricRule>('air_iata');

  const volume = useMemo(
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

  const actualKg = toKilograms(num(weight), weightUnit);
  const result = chargeableWeight(volume.totalVolumeM3, actualKg, rule);
  const stated = volume.totalVolumeM3 > 0 || actualKg > 0;

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Panel title="Your consignment">
        <div style={{ display: 'grid', gap: 20 }}>
          <CartonRows cartons={cartons} unit={unit} onChange={setCartons} onUnitChange={setUnit} />
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            }}
          >
            <Field id="actual-weight" label="Actual gross weight">
              {({ id }) => (
                <Input
                  id={id}
                  inputMode="decimal"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  className="input data numeric"
                />
              )}
            </Field>
            <Field id="weight-unit" label="Weighed in">
              {({ id }) => (
                <Select
                  id={id}
                  value={weightUnit}
                  onChange={(event) => setWeightUnit(event.target.value as WeightUnit)}
                >
                  {(Object.keys(WEIGHT_UNITS) as WeightUnit[]).map((key) => (
                    <option key={key} value={key}>
                      {WEIGHT_UNITS[key].label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field
              id="rule"
              label="How it ships"
              hint={VOLUMETRIC_RULES[rule].note}
            >
              {({ id, describedBy }) => (
                <Select
                  id={id}
                  value={rule}
                  aria-describedby={describedBy}
                  onChange={(event) => setRule(event.target.value as VolumetricRule)}
                >
                  {(Object.keys(VOLUMETRIC_RULES) as VolumetricRule[]).map((key) => (
                    <option key={key} value={key}>
                      {VOLUMETRIC_RULES[key].label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
        </div>
      </Panel>

      <BoxGrid label="Chargeable weight">
        <FieldBox ordinal="1" caption="Volume">
          <span className="data">
            {volume.totalVolumeM3 > 0 ? `${decimal(volume.totalVolumeM3, 3)} m³` : '—'}
          </span>
        </FieldBox>
        <FieldBox ordinal="2" caption="Actual weight">
          <span className="data">{actualKg > 0 ? `${decimal(actualKg, 2)} kg` : '—'}</span>
        </FieldBox>
        <FieldBox ordinal="3" caption="Volumetric weight">
          <span className="data">
            {volume.totalVolumeM3 > 0 ? `${decimal(result.volumetricWeightKg, 2)} kg` : '—'}
          </span>
        </FieldBox>
        <FieldBox ordinal="4" caption="Chargeable weight">
          <span className="data">
            <strong>{stated ? `${decimal(result.chargeableWeightKg, 2)} kg` : '—'}</strong>
          </span>
        </FieldBox>
      </BoxGrid>

      {stated ? (
        <Callout
          tone={result.billedOn === 'volumetric' ? 'warning' : 'neutral'}
          title={
            result.billedOn === 'volumetric'
              ? 'You will be billed on volume, not weight'
              : result.billedOn === 'actual'
                ? 'You will be billed on actual weight'
                : 'Both figures are the same'
          }
        >
          {result.billedOn === 'volumetric'
            ? `This consignment weighs ${decimal(result.actualWeightKg, 2)} kg but occupies the space of ${decimal(result.volumetricWeightKg, 2)} kg. The carrier bills the larger figure, so you pay for ${decimal(result.chargeableWeightKg - result.actualWeightKg, 2)} kg of air. Denser packing is what reduces this, not lighter goods.`
            : result.billedOn === 'actual'
              ? `This consignment is dense enough that its actual weight exceeds the volumetric figure of ${decimal(result.volumetricWeightKg, 2)} kg, so weight is what you are charged on.`
              : 'Actual and volumetric weight coincide exactly, so either basis gives the same charge.'}{' '}
          Divisors are published conventions and an individual contract can override them — confirm
          the basis with your carrier before quoting.
        </Callout>
      ) : null}
    </div>
  );
}
