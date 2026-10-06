'use client';

import { useActionState, useRef } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/primitives/button';
import { Field, Input } from '@/components/primitives/form';
import { Panel } from '@/components/primitives/feedback';
import { ActionResult } from '@/components/primitives/action-result';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { duplicateShipment } from '@/app/(app)/shipment-actions';
import type { ActionState } from '@/app/(app)/actions';

/**
 * "New shipment from this one": the parties, terms, lines and packing carry over into a new
 * draft. This shipment and every document generated from it stay exactly as they are.
 */
export function DuplicateShipmentForm({
  org,
  shipmentId,
  reference,
}: {
  org: string;
  shipmentId: string;
  reference: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(duplicateShipment, {});
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  return (
    <Panel title="Reuse for a new shipment">
      <form
        ref={form}
        action={action}
        style={{ display: 'grid', gap: 16, maxWidth: 560 }}
        noValidate
      >
        <input type="hidden" name="org" value={org} />
        <input type="hidden" name="shipment" value={shipmentId} />
        <ActionResult state={state} />
        <p className="muted" style={{ margin: 0 }}>
          Starts a new draft with the same parties, terms, lines and packing. Line values are
          copied as they are here, so check prices and quantities before generating.{' '}
          {reference} and its documents are not changed.
        </p>
        <Field
          id="duplicate_reference"
          label="New shipment reference"
          hint="Unique within this organization."
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
        <div>
          <Button type="submit" tone="secondary" pending={pending} pendingLabel="Copying…">
            <Copy size={15} aria-hidden="true" /> Create the new shipment
          </Button>
        </div>
      </form>
    </Panel>
  );
}
