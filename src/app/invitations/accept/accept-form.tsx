'use client';

import { useActionState } from 'react';
import { Button } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { acceptInvitation, type ActionState } from '@/app/(app)/actions';

export function AcceptForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(acceptInvitation, {});
  return (
    <form action={action} style={{ display: 'grid', gap: 16 }}>
      <input type="hidden" name="token" value={token} />
      {state.error ? (
        <Callout tone="danger" title="That invitation cannot be used">
          {state.error}
        </Callout>
      ) : null}
      <p className="muted" style={{ marginBottom: 0 }}>
        Accepting adds you to the organization with the role you were invited for.
      </p>
      <div>
        <Button type="submit" pending={pending} pendingLabel="Joining…">
          Accept invitation
        </Button>
      </div>
    </form>
  );
}
