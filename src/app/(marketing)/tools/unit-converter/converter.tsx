'use client';

import { useState } from 'react';
import { Panel } from '@/components/primitives/feedback';
import { Field, Input } from '@/components/primitives/form';
import { convert, type Conversion } from '@/lib/trade/conversions';

type Pair = {
  title: string;
  left: { id: string; label: string };
  right: { id: string; label: string };
  forward: Conversion;
  back: Conversion;
};

const PAIRS: readonly Pair[] = [
  {
    title: 'Volume',
    left: { id: 'cubic-metres', label: 'Cubic metres (m³, CBM)' },
    right: { id: 'cubic-feet', label: 'Cubic feet (ft³)' },
    forward: 'm3_to_ft3',
    back: 'ft3_to_m3',
  },
  {
    title: 'Weight',
    left: { id: 'kilograms', label: 'Kilograms (kg)' },
    right: { id: 'pounds', label: 'Pounds (lb)' },
    forward: 'kg_to_lb',
    back: 'lb_to_kg',
  },
];

/**
 * Two linked fields: typing in either one fills the other. The field being typed in keeps
 * exactly what was typed, so the converter never rewrites a figure under the cursor.
 */
function PairConverter({ pair }: { pair: Pair }) {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [invalid, setInvalid] = useState<'left' | 'right' | null>(null);

  const update = (value: string, from: 'left' | 'right') => {
    const converted = convert(value, from === 'left' ? pair.forward : pair.back);
    const blank = value.trim() === '';
    setInvalid(!blank && converted === null ? from : null);
    if (from === 'left') {
      setLeft(value);
      setRight(converted ?? '');
    } else {
      setRight(value);
      setLeft(converted ?? '');
    }
  };

  const problem = 'Enter a positive number, such as 12.5.';

  return (
    <Panel title={pair.title}>
      <div className="form-row">
        <Field
          id={pair.left.id}
          label={pair.left.label}
          error={invalid === 'left' ? problem : undefined}
        >
          {({ id, describedBy, invalid: wrong }) => (
            <Input
              id={id}
              inputMode="decimal"
              value={left}
              invalid={wrong}
              aria-describedby={describedBy}
              className="input data numeric"
              onChange={(event) => update(event.target.value, 'left')}
            />
          )}
        </Field>
        <Field
          id={pair.right.id}
          label={pair.right.label}
          error={invalid === 'right' ? problem : undefined}
        >
          {({ id, describedBy, invalid: wrong }) => (
            <Input
              id={id}
              inputMode="decimal"
              value={right}
              invalid={wrong}
              aria-describedby={describedBy}
              className="input data numeric"
              onChange={(event) => update(event.target.value, 'right')}
            />
          )}
        </Field>
      </div>
    </Panel>
  );
}

/** CBM and cubic feet, kilograms and pounds, in the browser. */
export function UnitConverter() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {PAIRS.map((pair) => (
        <PairConverter key={pair.title} pair={pair} />
      ))}
    </div>
  );
}
