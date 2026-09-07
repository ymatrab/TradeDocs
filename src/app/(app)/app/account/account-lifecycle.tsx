'use client';

import { useActionState, useRef } from 'react';
import { Button } from '@/components/primitives/button';
import { ConfirmButton } from '@/components/primitives/confirm';
import { Callout } from '@/components/primitives/feedback';
import { Field, Input } from '@/components/primitives/form';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { updateAccountLifecycle, type ActionState } from '../../actions';

const CONFIRM_FORM = 'confirm-deletion';

const DELETION_NOTICE =
  'Nothing is destroyed today. Your account is queued for removal in 30 days, and you ' +
  'can withdraw the request at any point during that period.';

export function AccountLifecycle({ deletionScheduled }: { deletionScheduled: boolean }) {
  // One action for both outcomes, so the latest result is always the one on screen.
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateAccountLifecycle,
    {},
  );
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, state.fields);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Every way the deletion can fail happens inside the confirmation, so its
          messages stay there, beside the field that has to change. Only the
          withdrawal, which has no dialog, reports out here. */}
      {deletionScheduled && state.error ? (
        <Callout tone="danger" title="That did not work" live>
          {state.error}
        </Callout>
      ) : null}
      {state.notice ? (
        <Callout tone="success" title="Done" live>
          {state.notice}
        </Callout>
      ) : null}

      <p className="muted" style={{ marginBottom: 0 }}>
        Deleting an account is queued for 30 days before anything is destroyed, so a request made in
        error can still be withdrawn. Organizations you own are not removed with you; hand ownership
        over first.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {deletionScheduled ? (
          <form action={action}>
            <input type="hidden" name="intent" value="withdraw" />
            <Button type="submit" tone="secondary" pending={pending} pendingLabel="Withdrawing…">
              Withdraw the deletion request
            </Button>
          </form>
        ) : (
          <ConfirmButton
            form={CONFIRM_FORM}
            trigger="Delete my account"
            title="Delete your account?"
            description={DELETION_NOTICE}
            confirm="Schedule deletion"
            cancel="Keep my account"
            pending={pending}
            failed={Boolean(state.error)}
            error={state.fields?.password ? undefined : state.error}
          >
            <form id={CONFIRM_FORM} ref={form} action={action}>
              <input type="hidden" name="intent" value="schedule" />
              <Field
                id="confirm-password"
                label="Confirm with your password"
                hint="An open session is not enough to queue an account for removal."
                error={state.fields?.password}
              >
                {({ id, describedBy, invalid }) => (
                  <Input
                    id={id}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    invalid={invalid}
                    aria-describedby={describedBy}
                  />
                )}
              </Field>
            </form>
          </ConfirmButton>
        )}
      </div>
    </div>
  );
}
