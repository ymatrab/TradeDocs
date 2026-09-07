'use client';

import { useActionState } from 'react';
import { Button } from '@/components/primitives/button';
import { Field, Input } from '@/components/primitives/form';
import { Callout } from '@/components/primitives/feedback';
import { createOrganization, type ActionState } from '../actions';

export function CreateOrganizationForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createOrganization, {});
  return (
    <form action={action} style={{ display: 'grid', gap: 16, maxWidth: 460 }} noValidate>
      {state.error ? (
        <Callout tone="danger" title="That did not work">
          {state.error}
        </Callout>
      ) : null}
      <Field
        id="organization-name"
        label="Organization name"
        hint="Your company as it should appear on prepared documents."
      >
        {({ id, describedBy }) => (
          <Input id={id} name="name" required maxLength={160} aria-describedby={describedBy} />
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
