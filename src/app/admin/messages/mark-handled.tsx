'use client';

import { useActionState } from 'react';
import { Button } from '@/components/primitives/button';
import { markMessageHandled, type AdminActionState } from '../actions';

export function MarkHandled({ id }: { id: string }) {
  const [state, action, pending] = useActionState<AdminActionState, FormData>(
    markMessageHandled,
    {},
  );
  return (
    <form action={action} className="admin-inline-form">
      <input type="hidden" name="id" value={id} />
      <Button type="submit" tone="secondary" compact pending={pending} pendingLabel="Saving…">
        Mark handled
      </Button>
      {state.error ? (
        <p className="error-text" role="alert" style={{ margin: 0 }}>
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
