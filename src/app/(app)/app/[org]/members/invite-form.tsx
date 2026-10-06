'use client';

import { useActionState, useRef } from 'react';
import { Button } from '@/components/primitives/button';
import { Field, Input, Select } from '@/components/primitives/form';
import { Callout } from '@/components/primitives/feedback';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { showsSummary } from '@/lib/form-errors';
import { roleLabels } from '@/lib/labels';
import { inviteMember, type ActionState } from '../../../actions';

/**
 * What happened to an invitation, in words that match what actually happened. Only an
 * email that reached the invitee is called "sent"; every other outcome hands the link over.
 */
export function DeliveryOutcome({ state }: { state: ActionState }) {
  if (state.delivery === 'emailed') {
    return (
      <Callout tone="success" title="Invitation sent" live>
        {state.notice}
      </Callout>
    );
  }
  if (!state.link) return null;
  const why =
    state.delivery === 'email_failed'
      ? 'The invitation email could not be sent just now, so nothing went out.'
      : state.delivery === 'sandbox'
        ? 'This is not the production deployment, so the email went to the test inbox, not to the invitee.'
        : 'Email delivery is not set up on this deployment, so no email was sent.';
  return (
    <Callout tone="warning" title="Send this link yourself" live>
      {state.notice} {why} Copy this single-use link and send it to them — it is shown once and
      cannot be retrieved again:{' '}
      <span className="data" style={{ overflowWrap: 'anywhere' }} data-testid="invitation-link">
        {state.link}
      </span>
    </Callout>
  );
}

export function InviteForm({ org }: { org: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(inviteMember, {});
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
      <DeliveryOutcome state={state} />

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
              maxLength={254}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field
          id="invite-role"
          label="Role"
          hint="Administrators can invite and remove members."
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
