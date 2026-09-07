'use client';

import { useActionState } from 'react';
import { Button } from '@/components/primitives/button';
import { ConfirmButton } from '@/components/primitives/confirm';
import { roleLabel, roleLabels } from '@/lib/labels';
import { changeRole, removeMember, type ActionState } from '../../../actions';

export function MemberRow({
  org,
  userId,
  name,
  role,
  isSelf,
  canAdminister,
  canChangeRole,
}: {
  org: string;
  userId: string;
  name: string | null;
  role: string;
  isSelf: boolean;
  canAdminister: boolean;
  canChangeRole: boolean;
}) {
  const [roleState, roleAction, rolePending] = useActionState<ActionState, FormData>(
    changeRole,
    {},
  );
  const [removeState, removeAction, removePending] = useActionState<ActionState, FormData>(
    removeMember,
    {},
  );
  const person = name ?? 'this member';
  const removeForm = `remove-member-${userId}`;

  const leaving = {
    title: 'Leave this organization?',
    description:
      'You lose access to its shipments and documents immediately. Someone who is ' +
      'still a member has to invite you back.',
    trigger: 'Leave',
    confirm: 'Leave the organization',
    cancel: 'Stay',
  };
  const removing = {
    title: `Remove ${person}?`,
    description:
      `${person} loses access to this organization's shipments and documents ` +
      'immediately. Documents they have already generated are unaffected.',
    trigger: 'Remove',
    confirm: 'Remove the member',
    cancel: 'Keep them',
  };
  const confirmation = isSelf ? leaving : removing;

  return (
    <tr>
      <td>
        {name ?? <span className="empty-value">Name not set</span>}
        {isSelf ? <span className="muted"> · you</span> : null}
        {roleState.error ? (
          <p className="error-text" role="alert" style={{ marginTop: 6, marginBottom: 0 }}>
            {roleState.error}
          </p>
        ) : null}
      </td>
      <td>
        {canChangeRole ? (
          <form action={roleAction} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="hidden" name="org" value={org} />
            <input type="hidden" name="user" value={userId} />
            <label className="sr-only" htmlFor={`role-${userId}`}>
              Role for {person}
            </label>
            <select id={`role-${userId}`} name="role" className="select" defaultValue={role}>
              <option value="owner">{roleLabels.owner}</option>
              <option value="admin">{roleLabels.admin}</option>
              <option value="member">{roleLabels.member}</option>
            </select>
            <Button
              type="submit"
              tone="secondary"
              compact
              pending={rolePending}
              pendingLabel="Saving…"
            >
              Save
            </Button>
          </form>
        ) : (
          roleLabel(role)
        )}
      </td>
      <td>
        {canAdminister || isSelf ? (
          <>
            {/* The form holds the action and its fields; the confirmation submits it
                by id, so the click that starts a removal is not the click that
                completes one. */}
            <form id={removeForm} action={removeAction}>
              <input type="hidden" name="org" value={org} />
              <input type="hidden" name="user" value={userId} />
            </form>
            <ConfirmButton
              form={removeForm}
              compact
              trigger={confirmation.trigger}
              title={confirmation.title}
              description={confirmation.description}
              confirm={confirmation.confirm}
              cancel={confirmation.cancel}
              pending={removePending}
              error={removeState.error}
            />
          </>
        ) : null}
      </td>
    </tr>
  );
}
