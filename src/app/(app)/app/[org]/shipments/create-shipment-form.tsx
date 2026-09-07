'use client';

import { useActionState, useRef } from 'react';
import { Button } from '@/components/primitives/button';
import { Field, Input } from '@/components/primitives/form';
import { Callout } from '@/components/primitives/feedback';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { showsSummary } from '@/lib/form-errors';
import { createShipment } from '../../../shipment-actions';
import type { ActionState } from '../../../actions';

export function CreateShipmentForm({ org }: { org: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(createShipment, {});
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  return (
    <form ref={form} action={action} style={{ display: 'grid', gap: 16, maxWidth: 560 }} noValidate>
      <input type="hidden" name="org" value={org} />
      {showsSummary(state) ? (
        <Callout tone="danger" title="That did not work" live>
          {state.error}
        </Callout>
      ) : null}
      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        }}
      >
        <Field
          id="reference"
          label="Shipment reference"
          hint="Your own reference, unique within this organization."
          error={state.fields?.reference}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="reference"
              required
              maxLength={60}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field
          id="currency"
          label="Currency"
          hint="Three-letter code, such as EUR."
          error={state.fields?.currency}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="currency"
              defaultValue="EUR"
              maxLength={3}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
      </div>
      <div>
        <Button type="submit" pending={pending} pendingLabel="Creating…">
          Create shipment
        </Button>
      </div>
    </form>
  );
}
