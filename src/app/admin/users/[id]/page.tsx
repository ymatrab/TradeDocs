import type { ReactNode } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import { Callout, EmptyState, ErrorState, Panel } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { AdminAuditRefused, AdminShell, AdminUnavailable } from '@/components/shell/admin';
import { adminContext, recordAdminEvent } from '@/lib/admin/server';
import { getUserDetail } from '@/lib/admin/users';
import { roleLabel } from '@/lib/labels';
import { UserActions } from './user-actions';

function day(value: string | null): string {
  return value ? value.slice(0, 10) : '—';
}

/** One account: identity, organizations and roles, sign-in and deletion state, actions. */
export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const context = await adminContext();
  if (context.kind === 'unavailable') return <AdminUnavailable />;
  const shell = (body: ReactNode) => (
    <AdminShell title="Account" current="Users" adminEmail={context.admin.email}>
      {body}
    </AdminShell>
  );

  const id = z.uuid().safeParse((await params).id);
  if (!id.success) {
    return shell(
      <EmptyState
        title="No such account"
        description="That account reference is not valid."
        action={
          <Link className="btn secondary" href="/admin/users">
            Back to search
          </Link>
        }
      />,
    );
  }

  const audit = await recordAdminEvent(context, {
    action: 'view_user',
    targetType: 'account',
    targetId: id.data,
  });
  if (!audit.ok) return shell(<AdminAuditRefused cause={audit.cause} />);

  const detail = await getUserDetail(context.client, id.data);
  if (!detail.ok) {
    return shell(
      detail.missing ? (
        <EmptyState
          title="No such account"
          description="It may have been deleted."
          action={
            <Link className="btn secondary" href="/admin/users">
              Back to search
            </Link>
          }
        />
      ) : (
        <ErrorState title="The account could not be read" description={detail.cause} />
      ),
    );
  }
  const { user } = detail;
  const deletionPending = Boolean(user.deletion && !user.deletion.cancelledAt);

  return shell(
    <div style={{ display: 'grid', gap: 24, maxWidth: 900 }}>
      <p style={{ margin: 0 }}>
        <Link className="text-link" href="/admin/users">
          Back to search
        </Link>
      </p>
      {deletionPending && user.deletion ? (
        <Callout tone="danger" title="Deletion is scheduled">
          {`Due ${day(user.deletion.purgeAfter)}. `}
          {user.deletion.lastOutcome === 'blocked_sole_owner'
            ? 'The last purge held it back: this account is the only owner of an organization with other members.'
            : 'The next purge after that date removes it.'}
        </Callout>
      ) : null}
      <Panel title="Account">
        <DataTable caption="Account record" density="compact">
          <tbody>
            <tr>
              <th scope="row">Email</th>
              <td className="data">{user.email ?? '—'}</td>
            </tr>
            <tr>
              <th scope="row">Created</th>
              <td className="data">{day(user.createdAt)}</td>
            </tr>
            <tr>
              <th scope="row">Last sign-in</th>
              <td className="data">{day(user.lastSignInAt)}</td>
            </tr>
            <tr>
              <th scope="row">Address confirmed</th>
              <td>{user.emailConfirmedAt ? `Yes, ${day(user.emailConfirmedAt)}` : 'Not yet'}</td>
            </tr>
            <tr>
              <th scope="row">Sign-in</th>
              <td>{user.banned ? 'Disabled' : 'Enabled'}</td>
            </tr>
            <tr>
              <th scope="row">Deletion</th>
              <td>
                {deletionPending && user.deletion
                  ? `Scheduled for ${day(user.deletion.purgeAfter)}`
                  : user.deletion?.cancelledAt
                    ? `Withdrawn ${day(user.deletion.cancelledAt)}`
                    : 'None requested'}
              </td>
            </tr>
          </tbody>
        </DataTable>
      </Panel>
      <Panel title="Organizations">
        {user.memberships.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            Not a member of any organization.
          </p>
        ) : (
          <DataTable caption="Organizations and roles" density="compact">
            <thead>
              <tr>
                <th scope="col">Organization</th>
                <th scope="col">Role</th>
              </tr>
            </thead>
            <tbody>
              {user.memberships.map((membership) => (
                <tr key={membership.orgId}>
                  <td>
                    <Link className="text-link" href={`/admin/organizations/${membership.orgId}`}>
                      {membership.organization}
                    </Link>
                    {membership.deleted ? <span className="muted"> · deleted</span> : null}
                  </td>
                  <td>{roleLabel(membership.role)}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </Panel>
      <Panel title="Actions">
        <p className="muted" style={{ marginTop: 0 }}>
          Every action is recorded in the audit log under your account.
        </p>
        <UserActions
          userId={user.id}
          isSelf={user.id === context.admin.id}
          banned={user.banned}
          confirmed={Boolean(user.emailConfirmedAt)}
          deletionPending={deletionPending}
        />
      </Panel>
    </div>,
  );
}
