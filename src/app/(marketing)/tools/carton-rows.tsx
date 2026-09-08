'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Field, Input, Select } from '@/components/primitives/form';
import { LENGTH_UNITS, type LengthUnit } from '@/lib/trade/calculations';

export type CartonInput = {
  key: number;
  length: string;
  width: string;
  height: string;
  count: string;
};

export function emptyCarton(key: number): CartonInput {
  return { key, length: '', width: '', height: '', count: '1' };
}

/** A blank field means "not stated yet", which is zero for arithmetic but not an error. */
export function num(value: string): number {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

/**
 * The carton table both calculators are driven from.
 *
 * Rows rather than a single box because a real consignment is rarely one size, and a
 * calculator that only takes one forces the user to do the addition it exists to do.
 */
export function CartonRows({
  cartons,
  unit,
  onChange,
  onUnitChange,
}: {
  cartons: CartonInput[];
  unit: LengthUnit;
  onChange: (cartons: CartonInput[]) => void;
  onUnitChange: (unit: LengthUnit) => void;
}) {
  const update = (key: number, field: keyof CartonInput, value: string) => {
    onChange(cartons.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  };

  const nextKey = cartons.reduce((highest, row) => Math.max(highest, row.key), 0) + 1;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ maxWidth: 220 }}>
        <Field id="length-unit" label="Measured in">
          {({ id }) => (
            <Select
              id={id}
              value={unit}
              onChange={(event) => onUnitChange(event.target.value as LengthUnit)}
            >
              {(Object.keys(LENGTH_UNITS) as LengthUnit[]).map((key) => (
                <option key={key} value={key}>
                  {LENGTH_UNITS[key].label}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      {cartons.map((row, index) => (
        <div
          key={row.key}
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            alignItems: 'end',
          }}
        >
          <Field id={`length-${row.key}`} label={index === 0 ? 'Length' : `Length ${index + 1}`}>
            {({ id }) => (
              <Input
                id={id}
                inputMode="decimal"
                value={row.length}
                onChange={(event) => update(row.key, 'length', event.target.value)}
                className="input data numeric"
              />
            )}
          </Field>
          <Field id={`width-${row.key}`} label={index === 0 ? 'Width' : `Width ${index + 1}`}>
            {({ id }) => (
              <Input
                id={id}
                inputMode="decimal"
                value={row.width}
                onChange={(event) => update(row.key, 'width', event.target.value)}
                className="input data numeric"
              />
            )}
          </Field>
          <Field id={`height-${row.key}`} label={index === 0 ? 'Height' : `Height ${index + 1}`}>
            {({ id }) => (
              <Input
                id={id}
                inputMode="decimal"
                value={row.height}
                onChange={(event) => update(row.key, 'height', event.target.value)}
                className="input data numeric"
              />
            )}
          </Field>
          <Field id={`count-${row.key}`} label={index === 0 ? 'How many' : `How many ${index + 1}`}>
            {({ id }) => (
              <Input
                id={id}
                inputMode="numeric"
                value={row.count}
                onChange={(event) => update(row.key, 'count', event.target.value)}
                className="input data numeric"
              />
            )}
          </Field>
          <div>
            {cartons.length > 1 ? (
              <Button
                type="button"
                tone="quiet"
                compact
                onClick={() => onChange(cartons.filter((entry) => entry.key !== row.key))}
              >
                <Trash2 size={15} aria-hidden="true" />
                <span className="sr-only">Remove carton size {index + 1}</span>
              </Button>
            ) : null}
          </div>
        </div>
      ))}

      <div>
        <Button
          type="button"
          tone="secondary"
          compact
          onClick={() => onChange([...cartons, emptyCarton(nextKey)])}
        >
          <Plus size={15} aria-hidden="true" />
          Another carton size
        </Button>
      </div>
    </div>
  );
}
