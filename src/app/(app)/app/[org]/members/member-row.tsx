'use client';

import { useActionState } from 'react';
import { Button } from '@/components/primitives/button';
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
  const problem = roleState.error ?? removeState.error;

  return (
    <tr>
      <td>
        {name ?? <span className="empty-value">Name not set</span>}
        {isSelf ? <span className="muted"> · you</span> : null}
        {problem ? (
          <p className="error-text" style={{ marginTop: 6, marginBottom: 0 }}>
            {problem}
          </p>
        ) : null}
      </td>
      <td>
        {canChangeRole ? (
          <form action={roleAction} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="hidden" name="org" value={org} />
            <input type="hidden" name="user" value={userId} />
            <label className="sr-only" htmlFor={`role-${userId}`}>
              Role
            </label>
            <select id={`role-${userId}`} name="role" className="select" defaultValue={role}>
              <option value="owner">owner</option>
              <option value="admin">admin</option>
              <option value="member">member</option>
            </select>
            <Button type="submit" tone="secondary" compact pending={rolePending} pendingLabel="Saving…">
              Save
            </Button>
          </form>
        ) : (
          role
        )}
      </td>
      <td>
        {canAdminister || isSelf ? (
          <form action={removeAction}>
            <input type="hidden" name="org" value={org} />
            <input type="hidden" name="user" value={userId} />
            <Button
              type="submit"
              tone="danger"
              compact
              pending={removePending}
              pendingLabel="Removing…"
            >
              {isSelf ? 'Leave' : 'Remove'}
            </Button>
          </form>
        ) : null}
      </td>
    </tr>
  );
}
