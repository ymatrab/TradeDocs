import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { Callout, EmptyState, Panel } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { AdminAuditRefused, AdminShell, AdminUnavailable } from '@/components/shell/admin';
import { adminContext, recordAdminEvent } from '@/lib/admin/server';

const MEMBER_LIMIT = 100;

/**
 * One organization: its members and roles and how much it holds. Counts only for trade
 * records; no shipment, party, product or document content is read here.
 */
export default async function AdminOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const context = await adminContext();
  if (context.kind === 'unavailable') return <AdminUnavailable />;

  const parsed = z.uuid().safeParse((await params).id);
  if (!parsed.success) notFound();
  const orgId = parsed.data;
  const { client } = context;

  const { data: org, error: orgError } = await client
    .from('organizations')
    .select('id, name, created_at, deleted_at')
    .eq('id', orgId)
    .maybeSingle();
  if (orgError) {
    return (
      <AdminShell title="Organization" current="Organizations" adminEmail={context.admin.email}>
        <Callout tone="danger" title="The organization could not be read" live>
          {`${orgError.code ?? 'unknown'}: ${orgError.message}`}
        </Callout>
      </AdminShell>
    );
  }
  if (!org) notFound();

  const shell = (body: ReactNode) => (
    <AdminShell title={org.name} current="Organizations" adminEmail={context.admin.email}>
      {body}
    </AdminShell>
  );

  // Recorded against the organization, so its own owners see the look in their history.
  const audit = await recordAdminEvent(context, {
    action: 'view_organization',
    targetType: 'organization',
    targetId: org.id,
    orgId: org.id,
  });
  if (!audit.ok) return shell(<AdminAuditRefused cause={audit.cause} />);

  const head = { count: 'exact', head: true } as const;
  const [members, shipments, documents, companies, products] = await Promise.all([
    client
      .from('memberships')
      .select('user_id, role, created_at')
      .eq('org_id', org.id)
      .order('created_at', { ascending: true })
      .limit(MEMBER_LIMIT),
    client.from('shipments').select('id', head).eq('org_id', org.id),
    client.from('documents').select('id', head).eq('org_id', org.id),
    client.from('companies').select('id', head).eq('org_id', org.id),
    client.from('products').select('id', head).eq('org_id', org.id),
  ]);

  // Addresses come from the auth service, one lookup per member, bounded by MEMBER_LIMIT.
  const people = await Promise.all(
    (members.data ?? []).map(async (member) => {
      const { data, error } = await client.auth.admin.getUserById(member.user_id);
      return { ...member, email: error ? null : (data.user?.email ?? null) };
    }),
  );

  const figure = (result: { count: number | null; error: unknown }) =>
    result.error ? '—' : String(result.count ?? 0);
  const failures = [members, shipments, documents, companies, products].flatMap((result) =>
    result.error ? [`${result.error.code ?? 'unknown'}: ${result.error.message}`] : [],
  );

  return shell(
    <div style={{ display: 'grid', gap: 24, maxWidth: 960 }}>
      <p style={{ margin: 0 }}>
        <Link className="text-link" href="/admin/organizations">
          All organizations
        </Link>
      </p>
      {failures.length > 0 ? (
        <Callout tone="danger" title="Some details could not be read">
          {[...new Set(failures)].join(' · ')}
        </Callout>
      ) : null}

      <BoxGrid label="Organization record">
        <FieldBox ordinal="1" caption="Created">
          <span className="data">{org.created_at.slice(0, 10)}</span>
        </FieldBox>
        <FieldBox ordinal="2" caption="State" value={org.deleted_at ? 'Deleted' : 'Active'} />
        <FieldBox ordinal="3" caption="Shipments" value={figure(shipments)} />
        <FieldBox ordinal="4" caption="Documents" value={figure(documents)} />
        <FieldBox ordinal="5" caption="Companies" value={figure(companies)} />
        <FieldBox ordinal="6" caption="Products" value={figure(products)} />
        <FieldBox ordinal="7" caption="Identifier">
          <span className="data">{org.id}</span>
        </FieldBox>
      </BoxGrid>

      <Panel title="Members">
        {people.length === 0 ? (
          <EmptyState
            title="No members"
            description="An organization normally keeps at least its owner; none could be read."
          />
        ) : (
          <DataTable caption="Members and roles" density="compact">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Joined</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.user_id}>
                  <td>{person.email ?? <span className="muted">Not available</span>}</td>
                  <td>{person.role}</td>
                  <td className="data">{person.created_at.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
        {people.length === MEMBER_LIMIT ? (
          <p className="muted" style={{ marginBottom: 0 }}>
            Showing the first {MEMBER_LIMIT} members.
          </p>
        ) : null}
      </Panel>
    </div>,
  );
}
