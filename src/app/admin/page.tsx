import Link from 'next/link';
import { Callout, Panel } from '@/components/primitives/feedback';
import { DataTable, NumericCell } from '@/components/primitives/table';
import { AdminAuditRefused, AdminShell, AdminUnavailable } from '@/components/shell/admin';
import { adminContext, recordAdminEvent } from '@/lib/admin/server';

type Count = { count: number | null; error: { message: string } | null };

function figure(result: Count): string {
  return result.error ? '—' : String(result.count ?? 0);
}

/** Platform totals and the last seven days. Counts only: no tenant content is read. */
export default async function AdminOverviewPage() {
  const context = await adminContext();
  if (context.kind === 'unavailable') return <AdminUnavailable />;
  const audit = await recordAdminEvent(context, {
    action: 'view_overview',
    targetType: 'platform',
  });

  if (!audit.ok) {
    return (
      <AdminShell title="Overview" current="Overview" adminEmail={context.admin.email}>
        <AdminAuditRefused cause={audit.cause} />
      </AdminShell>
    );
  }

  const since = sevenDaysAgo();
  const { client } = context;
  const head = { count: 'exact', head: true } as const;

  const results = await Promise.all([
    client.from('organizations').select('id', head).is('deleted_at', null),
    client.from('organizations').select('id', head).gte('created_at', since),
    client.from('profiles').select('id', head),
    client.from('profiles').select('id', head).gte('created_at', since),
    client.from('shipments').select('id', head),
    client.from('shipments').select('id', head).gte('created_at', since),
    client.from('documents').select('id', head),
    client.from('documents').select('id', head).gte('created_at', since),
    client.from('contact_messages').select('id', head).is('handled_at', null),
  ]);
  const [orgs, orgsWeek, users, usersWeek, shipments, shipmentsWeek, docs, docsWeek, open] =
    results;

  const rows: { label: string; total: Count; week: Count; href?: string }[] = [
    { label: 'Organizations', total: orgs, week: orgsWeek, href: '/admin/organizations' },
    { label: 'Users', total: users, week: usersWeek },
    { label: 'Shipments', total: shipments, week: shipmentsWeek },
    { label: 'Documents generated', total: docs, week: docsWeek },
  ];
  // The cause goes to the admin, who is the person able to act on it.
  const failures = [
    ...new Set(results.flatMap((result) => (result.error ? [result.error.message] : []))),
  ];

  return (
    <AdminShell title="Overview" current="Overview" adminEmail={context.admin.email}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 820 }}>
        {failures.length > 0 ? (
          <Callout tone="danger" title="Some figures could not be read">
            {failures.join(' · ')}
          </Callout>
        ) : null}
        <Panel title="Platform totals">
          <DataTable caption="Platform totals and the last seven days">
            <thead>
              <tr>
                <th scope="col">Record</th>
                <th scope="col" className="numeric">
                  Total
                </th>
                <th scope="col" className="numeric">
                  Last 7 days
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">
                    {row.href ? (
                      <Link className="text-link" href={row.href}>
                        {row.label}
                      </Link>
                    ) : (
                      row.label
                    )}
                  </th>
                  <NumericCell value={figure(row.total)} />
                  <NumericCell value={figure(row.week)} />
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Panel>
        <Panel title="Contact inbox">
          <p style={{ margin: 0 }}>
            {figure(open)} open {open.count === 1 ? 'message' : 'messages'}.{' '}
            <Link className="text-link" href="/admin/messages">
              Open the inbox
            </Link>
          </p>
        </Panel>
        <p className="muted" style={{ margin: 0, fontSize: 14 }}>
          Users counts accounts with a profile, which every account has. Organizations excludes
          deleted ones in the total. Every admin page view is recorded in the audit log.
        </p>
      </div>
    </AdminShell>
  );
}

/** The start of the overview window. Kept out of the component so rendering stays pure. */
function sevenDaysAgo(): string {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
}
