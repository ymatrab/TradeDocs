'use client';

import { useState } from 'react';
import { Panel } from '@/components/primitives/feedback';
import { Field, Input, Select } from '@/components/primitives/form';
import { DataTable, NumericCell } from '@/components/primitives/table';
import {
  VOLUME_UNITS,
  VOLUME_UNIT_KEYS,
  convertVolumeToAll,
  type VolumeUnit,
} from '@/lib/trade/conversions';

/**
 * One volume, typed in any unit, shown in all five. The figure being typed is never rewritten;
 * the table below it carries the conversions, worked out in exact decimal in the browser.
 */
export function VolumeConverter() {
  const [value, setValue] = useState('1');
  const [unit, setUnit] = useState<VolumeUnit>('m3');
  const rows = convertVolumeToAll(value, unit);
  const blank = value.trim() === '';
  const invalid = !blank && rows === null;

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Panel title="Your volume">
        <div className="form-row">
          <Field
            id="volume-value"
            label="Volume"
            error={invalid ? 'Enter a positive number, such as 2.5.' : undefined}
          >
            {({ id, describedBy, invalid: wrong }) => (
              <Input
                id={id}
                inputMode="decimal"
                value={value}
                invalid={wrong}
                aria-describedby={describedBy}
                className="input data numeric"
                onChange={(event) => setValue(event.target.value)}
              />
            )}
          </Field>
          <Field id="volume-unit" label="In">
            {({ id }) => (
              <Select
                id={id}
                value={unit}
                onChange={(event) => setUnit(event.target.value as VolumeUnit)}
              >
                {VOLUME_UNIT_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {VOLUME_UNITS[key].label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>
      </Panel>

      <div aria-live="polite">
        {rows ? (
          <DataTable caption={`${value} ${VOLUME_UNITS[unit].symbol} in every unit`}>
            <thead>
              <tr>
                <th scope="col">Unit</th>
                <th scope="col" className="numeric">
                  Volume
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.unit}>
                  <th scope="row">{VOLUME_UNITS[row.unit].label}</th>
                  <NumericCell value={row.value} unit={VOLUME_UNITS[row.unit].symbol} />
                </tr>
              ))}
            </tbody>
          </DataTable>
        ) : (
          <p className="muted">
            {invalid
              ? 'That is not a volume the converter can read.'
              : 'Type a volume to see it in every unit.'}
          </p>
        )}
      </div>
    </div>
  );
}
