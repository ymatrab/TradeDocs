import type { ReactNode } from 'react';
import Link from 'next/link';
import { Callout, EmptyState } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { AdminAuditRefused, AdminShell, AdminUnavailable } from '@/components/shell/admin';
import { adminContext, recordAdminEvent } from '@/lib/admin/server';

const LIMIT = 200;

/**
 * The latest audit events across the platform, including the admin panel's own. Action,
 * target and actor only: the metadata column can describe tenant records, so it stays out
 * of this view.
 */
export default async function AdminAuditPage() {
  const context = await adminContext();
  if (context.kind === 'unavailable') return <AdminUnavailable />;

  const shell = (body: ReactNode) => (
    <AdminShell title="Audit log" current="Audit log" adminEmail={context.admin.email}>
      {body}
    </AdminShell>
  );
  const audit = await recordAdminEvent(context, {
    action: 'view_audit_log',
    targetType: 'audit_log',
  });
  if (!audit.ok) return shell(<AdminAuditRefused cause={audit.cause} />);

  const { data, error } = await context.client
    .from('audit_events')
    .select('id, created_at, action, target_type, target_id, org_id, actor_id')
    .order('created_at', { ascending: false })
    .order('id', { ascending: true })
    .limit(LIMIT);

  if (error) {
    return shell(
      <Callout tone="danger" title="The audit log could not be read" live>
        {`${error.code ?? 'unknown'}: ${error.message}`}
      </Callout>,
    );
  }
  if (!data || data.length === 0) {
    return shell(
      <EmptyState
        title="No events yet"
        description="Recorded actions appear here, newest first."
      />,
    );
  }

  return shell(
    <div style={{ display: 'grid', gap: 16 }}>
      <p className="muted" style={{ margin: 0 }}>
        The latest {data.length} events, newest first. Times are UTC.
      </p>
      <DataTable caption="Audit events" density="compact">
        <thead>
          <tr>
            <th scope="col">When</th>
            <th scope="col">Action</th>
            <th scope="col">Target</th>
            <th scope="col">Organization</th>
            <th scope="col">Actor</th>
          </tr>
        </thead>
        <tbody>
          {data.map((event) => (
            <tr key={event.id}>
              <td className="data">{event.created_at.slice(0, 19).replace('T', ' ')}</td>
              <td className="data">{event.action}</td>
              <td>
                {event.target_type}
                {event.target_id ? <span className="data"> {event.target_id}</span> : null}
              </td>
              <td>
                {event.org_id ? (
                  <Link className="text-link data" href={`/admin/organizations/${event.org_id}`}>
                    {event.org_id.slice(0, 8)}
                  </Link>
                ) : (
                  <span className="muted">Platform</span>
                )}
              </td>
              <td className="data">
                {event.actor_id ? (
                  event.actor_id === context.admin.id ? (
                    'You'
                  ) : (
                    event.actor_id.slice(0, 8)
                  )
                ) : (
                  <span className="muted">System or removed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </div>,
  );
}
