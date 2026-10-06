'use client';

import { useActionState } from 'react';
import { Button } from '@/components/primitives/button';
import { ConfirmButton } from '@/components/primitives/confirm';
import { roleLabel } from '@/lib/labels';
import { resendInvitation, revokeInvitation, type ActionState } from '../../../actions';
import { DeliveryOutcome } from './invite-form';

/** One pending invitation: resend (a fresh link replaces the old one) or revoke. */
export function InvitationRow({
  org,
  id,
  email,
  role,
  expiresAt,
  expired,
}: {
  org: string;
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  expired: boolean;
}) {
  const [resendState, resendAction, resendPending] = useActionState<ActionState, FormData>(
    resendInvitation,
    {},
  );
  const [revokeState, revokeAction, revokePending] = useActionState<ActionState, FormData>(
    revokeInvitation,
    {},
  );
  const revokeForm = `revoke-invitation-${id}`;

  return (
    <tr>
      <td>
        {email}
        {resendState.error ? (
          <p className="error-text" role="alert" style={{ marginTop: 6, marginBottom: 0 }}>
            {resendState.error}
          </p>
        ) : null}
        {resendState.notice ? (
          <div style={{ marginTop: 8 }}>
            <DeliveryOutcome state={resendState} />
          </div>
        ) : null}
      </td>
      <td>{roleLabel(role)}</td>
      <td className="data">
        {expired ? 'Expired' : new Date(expiresAt).toISOString().slice(0, 10)}
      </td>
      <td>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <form action={resendAction}>
            <input type="hidden" name="org" value={org} />
            <input type="hidden" name="invitation" value={id} />
            <Button
              type="submit"
              tone="secondary"
              compact
              pending={resendPending}
              pendingLabel="Sending…"
              aria-label={`Resend the invitation to ${email}`}
            >
              Resend
            </Button>
          </form>
          <form id={revokeForm} action={revokeAction}>
            <input type="hidden" name="org" value={org} />
            <input type="hidden" name="invitation" value={id} />
          </form>
          <ConfirmButton
            form={revokeForm}
            compact
            trigger="Revoke"
            title={`Revoke the invitation to ${email}?`}
            description="The link stops working immediately. You can invite the same address again later."
            confirm="Revoke the invitation"
            cancel="Keep it"
            pending={revokePending}
            error={revokeState.error}
          />
        </div>
      </td>
    </tr>
  );
}
