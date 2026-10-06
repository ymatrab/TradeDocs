'use client';

import { useActionState } from 'react';
import { Button } from '@/components/primitives/button';
import { ConfirmButton } from '@/components/primitives/confirm';
import { Callout } from '@/components/primitives/feedback';
import { userAction, type UserActionState } from '../actions';

type Intent =
  | 'disable'
  | 'enable'
  | 'resend_confirmation'
  | 'password_reset'
  | 'cancel_deletion'
  | 'force_deletion';

/**
 * The actions available for one account. They share one action state, so the latest
 * outcome is the one on screen. Destructive ones ask first.
 */
export function UserActions({
  userId,
  isSelf,
  banned,
  confirmed,
  deletionPending,
}: {
  userId: string;
  isSelf: boolean;
  banned: boolean;
  confirmed: boolean;
  deletionPending: boolean;
}) {
  const [state, action, pending] = useActionState<UserActionState, FormData>(userAction, {});

  const form = (intent: Intent) => (
    <form id={`user-${intent}`} action={action}>
      <input type="hidden" name="user" value={userId} />
      <input type="hidden" name="intent" value={intent} />
    </form>
  );
  const plain = (intent: Intent, label: string) => (
    <>
      {form(intent)}
      <Button type="submit" form={`user-${intent}`} tone="secondary" pending={pending}>
        {label}
      </Button>
    </>
  );

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {state.error ? (
        <Callout tone="danger" title="That did not work" live>
          {state.error}
        </Callout>
      ) : null}
      {state.notice ? (
        <Callout tone="success" title="Done" live>
          {state.notice}
        </Callout>
      ) : null}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {banned ? plain('enable', 'Enable sign-in') : null}
        {!banned && !isSelf ? (
          <>
            {form('disable')}
            <ConfirmButton
              form="user-disable"
              trigger="Disable sign-in"
              title="Disable sign-in for this account?"
              description="Every open session ends now and the account cannot sign in until you enable it again. Its data and memberships are untouched."
              confirm="Disable sign-in"
              cancel="Keep it enabled"
              pending={pending}
              error={state.error}
            />
          </>
        ) : null}
        {!confirmed ? plain('resend_confirmation', 'Resend confirmation email') : null}
        {plain('password_reset', 'Send password reset email')}
        {deletionPending ? plain('cancel_deletion', 'Cancel the deletion') : null}
        {!isSelf ? (
          <>
            {form('force_deletion')}
            <ConfirmButton
              form="user-force_deletion"
              trigger="Delete now"
              title="Delete this account now?"
              description="The account, its profile and its memberships are removed permanently, without the 30-day grace. Organizations it was the only member of are closed. This cannot be undone."
              confirm="Delete permanently"
              cancel="Keep the account"
              pending={pending}
              error={state.error}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
