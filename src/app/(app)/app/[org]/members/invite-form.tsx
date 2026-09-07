'use client';

import { useActionState } from 'react';
import { Button } from '@/components/primitives/button';
import { Field, Input, Select } from '@/components/primitives/form';
import { Callout } from '@/components/primitives/feedback';
import { inviteMember, type ActionState } from '../../../actions';

export function InviteForm({ org }: { org: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(inviteMember, {});

  return (
    <form action={action} style={{ display: 'grid', gap: 16, maxWidth: 560 }} noValidate>
      <input type="hidden" name="org" value={org} />
      {state.error ? (
        <Callout tone="danger" title="That did not work">
          {state.error}
        </Callout>
      ) : null}
      {state.token ? (
        <Callout tone="warning" title="Send this link yourself">
          {state.notice} Automatic delivery arrives with transactional email. Until then, copy this
          single-use link — it is shown once and cannot be retrieved again:{' '}
          <span className="data" style={{ overflowWrap: 'anywhere' }}>
            /invitations/accept?token={state.token}
          </span>
        </Callout>
      ) : null}

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <Field id="invite-email" label="Email address">
          {({ id, describedBy }) => (
            <Input id={id} name="email" type="email" required aria-describedby={describedBy} />
          )}
        </Field>
        <Field id="invite-role" label="Role" hint="Administrators can invite and change roles.">
          {({ id, describedBy }) => (
            <Select id={id} name="role" defaultValue="member" aria-describedby={describedBy}>
              <option value="member">member</option>
              <option value="admin">admin</option>
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
