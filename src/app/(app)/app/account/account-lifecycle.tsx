'use client';

import { useActionState, useState } from 'react';
import { Button } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { Dialog } from '@/components/primitives/dialog';
import { Field, Input } from '@/components/primitives/form';
import { updateAccountLifecycle, type ActionState } from '../../actions';

export function AccountLifecycle({ deletionScheduled }: { deletionScheduled: boolean }) {
  // One action for both outcomes, so the latest result is always the one on screen.
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateAccountLifecycle,
    {},
  );
  const [confirming, setConfirming] = useState(false);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {state.error ? (
        <Callout tone="danger" title="That did not work">
          {state.error}
        </Callout>
      ) : null}
      {state.notice ? (
        <Callout tone="success" title="Done">
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
          <Button tone="danger" onClick={() => setConfirming(true)}>
            Delete my account
          </Button>
        )}
      </div>

      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Delete your account?"
        description="Nothing is destroyed today. Your account is queued for removal in 30 days, and you can withdraw the request at any point during that period."
        footer={
          <>
            <Button tone="secondary" onClick={() => setConfirming(false)}>
              Keep my account
            </Button>
            <Button
              type="submit"
              form="confirm-deletion"
              tone="danger"
              pending={pending}
              pendingLabel="Scheduling…"
            >
              Schedule deletion
            </Button>
          </>
        }
      >
        <form
          id="confirm-deletion"
          action={(formData) => {
            setConfirming(false);
            action(formData);
          }}
        >
          <input type="hidden" name="intent" value="schedule" />
          <Field
            id="confirm-password"
            label="Confirm with your password"
            hint="An open session is not enough to queue an account for removal."
          >
            {({ id, describedBy }) => (
              <Input
                id={id}
                name="password"
                type="password"
                autoComplete="current-password"
                required
                aria-describedby={describedBy}
              />
            )}
          </Field>
        </form>
      </Dialog>
    </div>
  );
}
