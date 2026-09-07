'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { Dialog } from '@/components/primitives/dialog';
import { cancelAccountDeletion, requestAccountDeletion, type ActionState } from '../../actions';

export function AccountLifecycle({ deletionScheduled }: { deletionScheduled: boolean }) {
  const [state, setState] = useState<ActionState>({});
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const run = (action: () => Promise<ActionState>) => {
    startTransition(async () => {
      setState(await action());
    });
  };

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
            pending={pending}
            pendingLabel="Withdrawing…"
            onClick={() => run(cancelAccountDeletion)}
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
              tone="danger"
              pending={pending}
              pendingLabel="Scheduling…"
              onClick={() => {
                setConfirming(false);
                run(requestAccountDeletion);
              }}
            >
              Schedule deletion
            </Button>
          </>
        }
      />
    </div>
  );
}
