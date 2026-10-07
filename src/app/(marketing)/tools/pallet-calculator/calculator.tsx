'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { Callout, Panel } from '@/components/primitives/feedback';
import { Field, Input, Select } from '@/components/primitives/form';
import { decimal } from '@/lib/format';
import {
  LENGTH_UNITS,
  WEIGHT_UNITS,
  type LengthUnit,
  type WeightUnit,
} from '@/lib/trade/calculations';
import { convert } from '@/lib/trade/conversions';
import { PALLET_PRESETS, palletLoad, type PalletPreset } from '@/lib/trade/pallet';

const REFUSALS = {
  incomplete:
    'Enter the carton’s three dimensions, the pallet’s length and width and the maximum height, each as a positive number. A carton count must be a whole number.',
  'carton-too-large': 'One carton is larger than the pallet deck either way round.',
  'too-tall': 'Not even one layer fits under the maximum height once the pallet is counted.',
  'too-heavy': 'One carton is heavier than the maximum load.',
} as const;

/** A preset's kilogram figure in the weight unit the form is using. */
function inUnit(kilograms: string, unit: WeightUnit): string {
  if (kilograms === '') return '';
  if (unit === 'kg') return kilograms;
  if (unit === 'g') return String(Number(kilograms) * 1000);
  return convert(kilograms, 'kg_to_lb') ?? '';
}

function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  hint?: string;
}) {
  return (
    <Field id={id} label={label} hint={hint}>
      {({ id: fieldId, describedBy }) => (
        <Input
          id={fieldId}
          inputMode="decimal"
          value={value}
          aria-describedby={describedBy}
          className="input data numeric"
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </Field>
  );
}

function Grid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Cartons per pallet, live as it is typed, entirely in the browser. One carton size at a
 * time, upright, every carton in a layer facing the same way.
 */
export function PalletCalculator() {
  const euro = PALLET_PRESETS.find((preset) => preset.id === 'epal1') ?? PALLET_PRESETS[0]!;
  const [presetId, setPresetId] = useState(euro.id);
  const [palletLength, setPalletLength] = useState(euro.length);
  const [palletWidth, setPalletWidth] = useState(euro.width);
  const [palletHeight, setPalletHeight] = useState(euro.height);
  const [palletUnit, setPalletUnit] = useState<LengthUnit>(euro.unit);
  const [palletWeight, setPalletWeight] = useState(euro.weightKg);
  const [maxLoad, setMaxLoad] = useState(euro.safeWorkingLoadKg);
  const [maxHeight, setMaxHeight] = useState('');
  const [cartonLength, setCartonLength] = useState('');
  const [cartonWidth, setCartonWidth] = useState('');
  const [cartonHeight, setCartonHeight] = useState('');
  const [cartonUnit, setCartonUnit] = useState<LengthUnit>('cm');
  const [cartonWeight, setCartonWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [quantity, setQuantity] = useState('');

  const preset: PalletPreset | undefined = PALLET_PRESETS.find((entry) => entry.id === presetId);

  const choosePreset = (id: string) => {
    setPresetId(id);
    const chosen = PALLET_PRESETS.find((entry) => entry.id === id);
    if (!chosen) return;
    setPalletLength(chosen.length);
    setPalletWidth(chosen.width);
    setPalletHeight(chosen.height);
    setPalletUnit(chosen.unit);
    setPalletWeight(inUnit(chosen.weightKg, weightUnit));
    setMaxLoad(inUnit(chosen.safeWorkingLoadKg, weightUnit));
  };

  const outcome = useMemo(
    () =>
      palletLoad({
        cartonLength,
        cartonWidth,
        cartonHeight,
        cartonUnit,
        cartonWeight,
        weightUnit,
        palletLength,
        palletWidth,
        palletHeight,
        palletUnit,
        palletWeight,
        maxHeight,
        maxLoad,
        quantity,
      }),
    [
      cartonLength,
      cartonWidth,
      cartonHeight,
      cartonUnit,
      cartonWeight,
      weightUnit,
      palletLength,
      palletWidth,
      palletHeight,
      palletUnit,
      palletWeight,
      maxHeight,
      maxLoad,
      quantity,
    ],
  );
  const started = Boolean(cartonLength || cartonWidth || cartonHeight || maxHeight);
  const result = outcome.ok ? outcome.result : null;

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Panel title="The pallet">
        <div style={{ display: 'grid', gap: 16 }}>
          <Field id="pallet-preset" label="Pallet" hint={preset?.note ?? 'Enter your pallet.'}>
            {({ id, describedBy }) => (
              <Select
                id={id}
                value={presetId}
                aria-describedby={describedBy}
                onChange={(event) => choosePreset(event.target.value)}
              >
                {PALLET_PRESETS.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.label}
                  </option>
                ))}
                <option value="custom">Another size</option>
              </Select>
            )}
          </Field>
          <Grid>
            <NumberField
              id="pallet-length"
              label={`Deck length (${palletUnit})`}
              value={palletLength}
              onChange={setPalletLength}
            />
            <NumberField
              id="pallet-width"
              label={`Deck width (${palletUnit})`}
              value={palletWidth}
              onChange={setPalletWidth}
            />
            <NumberField
              id="pallet-height"
              label={`Pallet height (${palletUnit})`}
              value={palletHeight}
              onChange={setPalletHeight}
            />
            <Field id="pallet-unit" label="Pallet measured in">
              {({ id }) => (
                <Select
                  id={id}
                  value={palletUnit}
                  onChange={(event) => setPalletUnit(event.target.value as LengthUnit)}
                >
                  {(Object.keys(LENGTH_UNITS) as LengthUnit[]).map((key) => (
                    <option key={key} value={key}>
                      {LENGTH_UNITS[key].label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <NumberField
              id="max-height"
              label={`Maximum loaded height (${palletUnit})`}
              hint="Pallet included: the lowest of your carrier’s, the door’s and the racking’s limit."
              value={maxHeight}
              onChange={setMaxHeight}
            />
            <NumberField
              id="pallet-weight"
              label={`Pallet’s own weight (${weightUnit})`}
              value={palletWeight}
              onChange={setPalletWeight}
            />
            <NumberField
              id="max-load"
              label={`Maximum load on the pallet (${weightUnit})`}
              hint="Optional. The goods only; leave blank for no weight limit."
              value={maxLoad}
              onChange={setMaxLoad}
            />
          </Grid>
        </div>
      </Panel>

      <Panel title="The carton">
        <Grid>
          <NumberField
            id="carton-length"
            label={`Length (${cartonUnit})`}
            value={cartonLength}
            onChange={setCartonLength}
          />
          <NumberField
            id="carton-width"
            label={`Width (${cartonUnit})`}
            value={cartonWidth}
            onChange={setCartonWidth}
          />
          <NumberField
            id="carton-height"
            label={`Height (${cartonUnit})`}
            value={cartonHeight}
            onChange={setCartonHeight}
          />
          <Field id="carton-unit" label="Carton measured in">
            {({ id }) => (
              <Select
                id={id}
                value={cartonUnit}
                onChange={(event) => setCartonUnit(event.target.value as LengthUnit)}
              >
                {(Object.keys(LENGTH_UNITS) as LengthUnit[]).map((key) => (
                  <option key={key} value={key}>
                    {LENGTH_UNITS[key].label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <NumberField
            id="carton-weight"
            label={`Gross weight per carton (${weightUnit})`}
            hint="Optional."
            value={cartonWeight}
            onChange={setCartonWeight}
          />
          <Field id="weight-unit" label="Weights in">
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
          <NumberField
            id="quantity"
            label="Cartons in the shipment"
            hint="Optional, for the number of pallets."
            value={quantity}
            onChange={setQuantity}
          />
        </Grid>
      </Panel>

      <div aria-live="polite">
        {result ? (
          <div style={{ display: 'grid', gap: 16 }}>
            <BoxGrid label="Cartons per pallet">
              <FieldBox ordinal="1" caption="Per layer">
                <span className="data">
                  {result.perLayer} ({result.columns} × {result.rows})
                </span>
              </FieldBox>
              <FieldBox ordinal="2" caption="Layers">
                <span className="data">{result.layersUsed}</span>
              </FieldBox>
              <FieldBox ordinal="3" caption="Cartons per pallet">
                <span className="data">
                  <strong>{result.cartonsPerPallet}</strong>
                </span>
              </FieldBox>
              <FieldBox ordinal="4" caption="Loaded height">
                <span className="data">{decimal(Number(result.loadedHeightMm), 0)} mm</span>
              </FieldBox>
              <FieldBox ordinal="5" caption="Pallet gross weight">
                <span className="data">
                  {result.grossKg ? `${decimal(Number(result.grossKg), 2)} kg` : '—'}
                </span>
              </FieldBox>
              <FieldBox ordinal="6" caption="Pallets needed">
                <span className="data">{result.palletsNeeded ?? '—'}</span>
              </FieldBox>
            </BoxGrid>
            <Callout
              title={
                result.limitedBy === 'weight'
                  ? 'The weight limit decides this pallet'
                  : 'The height limit decides this pallet'
              }
            >
              {result.perLayer} cartons cover {decimal(result.deckUsed * 100, 0)}% of the deck,{' '}
              {result.orientation === 'crosswise' ? 'turned across the pallet' : 'lengthwise'}.{' '}
              {result.limitedBy === 'weight'
                ? `The height allows ${result.layersByHeight} layers, but the load limit stops at ${result.cartonsByWeight} cartons.`
                : `${result.layersByHeight} layers fit under the maximum height.`}{' '}
              {result.lastPalletCartons !== null && result.palletsNeeded !== null
                ? `The last of ${result.palletsNeeded} pallets carries ${result.lastPalletCartons} cartons. `
                : ''}
              {result.assumedZero.includes('palletHeight')
                ? 'The pallet’s own height is not entered, so it is counted as zero. '
                : ''}
              {result.assumedZero.includes('palletWeight') && result.grossKg
                ? 'The pallet’s own weight is not entered, so the gross weight leaves it out. '
                : ''}
              This is before overhang, crushing strength and carrier limits: check those before you
              build the load.
            </Callout>
          </div>
        ) : started && !outcome.ok ? (
          <Callout tone="warning" title="Nothing to show yet">
            {REFUSALS[outcome.reason]}
          </Callout>
        ) : (
          <p className="muted">
            Enter a carton and the maximum height to see how many fit on the pallet.
          </p>
        )}
      </div>
    </div>
  );
}
