'use client';

import { useActionState, useRef } from 'react';
import { Button } from '@/components/primitives/button';
import { Field, Input } from '@/components/primitives/form';
import { Callout } from '@/components/primitives/feedback';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { showsSummary } from '@/lib/form-errors';
import { createOrganization, type ActionState } from '../actions';

export function CreateOrganizationForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createOrganization, {});
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  return (
    <form ref={form} action={action} style={{ display: 'grid', gap: 16, maxWidth: 460 }} noValidate>
      {showsSummary(state) ? (
        <Callout tone="danger" title="That did not work" live>
          {state.error}
        </Callout>
      ) : null}
      <Field
        id="organization-name"
        label="Organization name"
        hint="Your company as it should appear on prepared documents."
        error={state.fields?.name}
      >
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            name="name"
            required
            maxLength={160}
            invalid={invalid}
            aria-describedby={describedBy}
          />
        )}
      </Field>
      <div>
        <Button type="submit" pending={pending} pendingLabel="Creating…">
          Create organization
        </Button>
      </div>
    </form>
  );
}
