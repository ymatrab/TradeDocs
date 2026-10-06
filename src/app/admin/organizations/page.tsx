import type { ReactNode } from 'react';
import Link from 'next/link';
import { Callout, EmptyState } from '@/components/primitives/feedback';
import { DataTable, NumericCell } from '@/components/primitives/table';
import { AdminAuditRefused, AdminShell, AdminUnavailable } from '@/components/shell/admin';
import { adminContext, recordAdminEvent } from '@/lib/admin/server';

const PAGE_SIZE = 50;

function countOf(relation: { count: number }[] | null | undefined): string {
  return String(relation?.[0]?.count ?? 0);
}

/** Every organization with its member, shipment and document counts. No content is read. */
export default async function AdminOrganizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const context = await adminContext();
  if (context.kind === 'unavailable') return <AdminUnavailable />;

  const requested = Number((await searchParams).page ?? '1');
  const page = Number.isInteger(requested) && requested >= 1 && requested <= 10_000 ? requested : 1;

  const audit = await recordAdminEvent(context, {
    action: 'view_organizations',
    targetType: 'organization_list',
    metadata: { page },
  });
  const shell = (body: ReactNode) => (
    <AdminShell title="Organizations" current="Organizations" adminEmail={context.admin.email}>
      {body}
    </AdminShell>
  );
  if (!audit.ok) return shell(<AdminAuditRefused cause={audit.cause} />);

  const from = (page - 1) * PAGE_SIZE;
  const { data, error, count } = await context.client
    .from('organizations')
    .select(
      'id, name, created_at, deleted_at, memberships(count), shipments(count), documents(count)',
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .order('id', { ascending: true })
    .range(from, from + PAGE_SIZE - 1);

  if (error) {
    return shell(
      <Callout tone="danger" title="Organizations could not be read" live>
        {`${error.code ?? 'unknown'}: ${error.message}`}
      </Callout>,
    );
  }
  if (!data || data.length === 0) {
    return shell(
      <EmptyState
        title={page === 1 ? 'No organizations yet' : 'No organizations on this page'}
        description="Organizations appear here as soon as someone creates one in the workspace."
        action={
          page > 1 ? (
            <Link className="btn secondary" href="/admin/organizations">
              Back to the first page
            </Link>
          ) : undefined
        }
      />,
    );
  }

  const total = count ?? data.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return shell(
    <div style={{ display: 'grid', gap: 16 }}>
      <p className="muted" style={{ margin: 0 }}>
        {total} {total === 1 ? 'organization' : 'organizations'} · page {page} of {pages}
      </p>
      <DataTable caption="Organizations" density="compact">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Created</th>
            <th scope="col" className="numeric">
              Members
            </th>
            <th scope="col" className="numeric">
              Shipments
            </th>
            <th scope="col" className="numeric">
              Documents
            </th>
            <th scope="col">State</th>
          </tr>
        </thead>
        <tbody>
          {data.map((org) => (
            <tr key={org.id}>
              <th scope="row">
                <Link className="text-link" href={`/admin/organizations/${org.id}`}>
                  {org.name}
                </Link>
              </th>
              <td className="data">{org.created_at.slice(0, 10)}</td>
              <NumericCell value={countOf(org.memberships)} />
              <NumericCell value={countOf(org.shipments)} />
              <NumericCell value={countOf(org.documents)} />
              <td>{org.deleted_at ? 'Deleted' : 'Active'}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      {pages > 1 ? (
        <nav className="cta-row" aria-label="Pages" style={{ marginTop: 0 }}>
          {page > 1 ? (
            <Link className="btn secondary" href={`/admin/organizations?page=${page - 1}`}>
              Previous
            </Link>
          ) : null}
          {page < pages ? (
            <Link className="btn secondary" href={`/admin/organizations?page=${page + 1}`}>
              Next
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>,
  );
}
