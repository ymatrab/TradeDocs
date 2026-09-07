'use client';

import { useActionState, useRef } from 'react';
import { Button } from '@/components/primitives/button';
import { Field, Input, Select } from '@/components/primitives/form';
import { Callout } from '@/components/primitives/feedback';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { showsSummary } from '@/lib/form-errors';
import { roleLabels } from '@/lib/labels';
import { inviteMember, type ActionState } from '../../../actions';

export function InviteForm({ org }: { org: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(inviteMember, {});
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  return (
    <form
      ref={form}
      action={action}
      style={{ display: 'grid', gap: 16, maxWidth: 560 }}
      noValidate
    >
      <input type="hidden" name="org" value={org} />
      {showsSummary(state) ? (
        <Callout tone="danger" title="That did not work" live>
          {state.error}
        </Callout>
      ) : null}
      {state.token ? (
        <Callout tone="warning" title="Send this link yourself" live>
          {state.notice} Automatic delivery arrives with transactional email. Until then, copy this
          single-use link — it is shown once and cannot be retrieved again:{' '}
          <span className="data" style={{ overflowWrap: 'anywhere' }}>
            /invitations/accept?token={state.token}
          </span>
        </Callout>
      ) : null}

      <div
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        }}
      >
        <Field id="invite-email" label="Email address" error={state.fields?.email}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="email"
              type="email"
              required
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field
          id="invite-role"
          label="Role"
          hint="Administrators can invite and change roles."
          error={state.fields?.role}
        >
          {({ id, describedBy, invalid }) => (
            <Select
              id={id}
              name="role"
              defaultValue="member"
              invalid={invalid}
              aria-describedby={describedBy}
            >
              <option value="member">{roleLabels.member}</option>
              <option value="admin">{roleLabels.admin}</option>
            </Select>
          )}
        </Field>
      </div>
      <div>
        <Button type="submit" pending={pending} pendingLabel="Creating…">
          Create invitation
        </Button>
      </div>
    </form>
  );
}
