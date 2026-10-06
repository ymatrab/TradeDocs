import { Panel } from '@/components/primitives/feedback';
import { AdminAuditRefused, AdminShell, AdminUnavailable } from '@/components/shell/admin';
import { adminContext, recordAdminEvent } from '@/lib/admin/server';
import { PurgeNow, UserSearch } from './search-form';

/** Find an account by email, then manage it. Nothing about any account is read until searched. */
export default async function AdminUsersPage() {
  const context = await adminContext();
  if (context.kind === 'unavailable') return <AdminUnavailable />;
  const audit = await recordAdminEvent(context, { action: 'view_users', targetType: 'user_list' });

  return (
    <AdminShell title="Users" current="Users" adminEmail={context.admin.email}>
      {!audit.ok ? (
        <AdminAuditRefused cause={audit.cause} />
      ) : (
        <div style={{ display: 'grid', gap: 24, maxWidth: 900 }}>
          <Panel title="Find an account">
            <UserSearch />
          </Panel>
          <Panel title="Account purge">
            <p className="muted" style={{ marginTop: 0 }}>
              Accounts whose 30-day deletion grace has ended are removed by the purge. It is not
              scheduled yet: scheduling is an owner decision (RUNBOOK.md, “Account purge”). Until
              then, run it here. It is safe to run any number of times; an account that is the only
              owner of an organization with other members is held back and reported.
            </p>
            <PurgeNow />
          </Panel>
        </div>
      )}
    </AdminShell>
  );
}
