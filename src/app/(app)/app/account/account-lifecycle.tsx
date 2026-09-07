'use client';

import { useActionState, useState, useTransition } from 'react';
import { Button } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { Dialog } from '@/components/primitives/dialog';
import { Field, Input } from '@/components/primitives/form';
import { cancelAccountDeletion, requestAccountDeletion, type ActionState } from '../../actions';

export function AccountLifecycle({ deletionScheduled }: { deletionScheduled: boolean }) {
  const [deleteState, deleteAction, deletePending] = useActionState<ActionState, FormData>(
    requestAccountDeletion,
    {},
  );
  const [cancelState, setCancelState] = useState<ActionState>({});
  const [cancelPending, startCancel] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const state = deleteState.error || deleteState.notice ? deleteState : cancelState;

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
          <Button
            tone="secondary"
            pending={cancelPending}
            pendingLabel="Withdrawing…"
            onClick={() =>
              startCancel(async () => {
                setCancelState(await cancelAccountDeletion());
              })
            }
          >
            Withdraw the deletion request
          </Button>
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
              pending={deletePending}
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
            deleteAction(formData);
          }}
        >
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
