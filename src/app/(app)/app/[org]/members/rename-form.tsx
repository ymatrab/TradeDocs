'use client';

import { useActionState, useRef } from 'react';
import { Button } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { Field, Input } from '@/components/primitives/form';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { renameOrganization, type ActionState } from '../../../actions';

export function RenameForm({ org, name }: { org: string; name: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(renameOrganization, {});
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  return (
    <form ref={form} action={action} style={{ display: 'grid', gap: 16, maxWidth: 480 }} noValidate>
      <input type="hidden" name="org" value={org} />
      {state.error && !state.fields ? (
        <Callout tone="danger" title="That did not work" live>
          {state.error}
        </Callout>
      ) : null}
      {state.notice ? (
        <Callout tone="success" title="Saved" live>
          {state.notice}
        </Callout>
      ) : null}
      <Field id="organization-name" label="Organization name" error={state.fields?.name}>
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            name="name"
            required
            maxLength={160}
            defaultValue={name}
            invalid={invalid}
            aria-describedby={describedBy}
          />
        )}
      </Field>
      <div>
        <Button type="submit" tone="secondary" pending={pending} pendingLabel="Saving…">
          Rename
        </Button>
      </div>
    </form>
  );
}
