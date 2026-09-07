import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient, getUser } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, Callout } from '@/components/primitives/feedback';
import { DataTable, EmptyValue } from '@/components/primitives/table';
import { roleLabel } from '@/lib/labels';
import { MemberRow } from './member-row';
import { InviteForm } from './invite-form';

export const metadata: Metadata = { title: 'Members' };

export default async function MembersPage({ params }: { params: Promise<{ org: string }> }) {
  const { org } = await params;
  const client = await createClient();
  const user = await getUser();

  // A row policy decides this, not the page: a caller outside the organization simply
  // reads nothing, and the page reports a missing resource rather than its existence.
  const { data: organization } = await client
    .from('organizations')
    .select('id, name')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  const { data: memberships } = await client
    .from('memberships')
    .select('user_id, role, created_at')
    .eq('org_id', org)
    .order('created_at', { ascending: true });
  const { data: profiles } = await client.from('profiles').select('id, display_name');
  const nameFor = new Map((profiles ?? []).map((row) => [row.id, row.display_name]));

  const viewerRole = (memberships ?? []).find((row) => row.user_id === user?.id)?.role ?? 'member';
  const canAdminister = viewerRole === 'owner' || viewerRole === 'admin';

  const { data: invitations } = canAdminister
    ? await client
        .from('invitations')
        .select('id, email, role, expires_at, accepted_at, revoked_at')
        .eq('org_id', org)
        .is('accepted_at', null)
        .is('revoked_at', null)
        .order('created_at', { ascending: false })
    : { data: null };

  return (
    <AppShell title={organization.name} current="Members" orgId={org}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 940 }}>
        <Panel title="Members">
          <DataTable caption={`People in ${organization.name}`}>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Role</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {(memberships ?? []).map((membership) => (
                <MemberRow
                  key={membership.user_id}
                  org={org}
                  userId={membership.user_id}
                  name={nameFor.get(membership.user_id) ?? null}
                  role={membership.role}
                  isSelf={membership.user_id === user?.id}
                  canAdminister={canAdminister}
                  canChangeRole={viewerRole === 'owner'}
                />
              ))}
            </tbody>
          </DataTable>
        </Panel>

        {canAdminister ? (
          <>
            <Panel title="Invite someone">
              <InviteForm org={org} />
            </Panel>
            <Panel title="Pending invitations">
              {invitations && invitations.length > 0 ? (
                <DataTable caption="Invitations awaiting acceptance">
                  <thead>
                    <tr>
                      <th scope="col">Email</th>
                      <th scope="col">Role</th>
                      <th scope="col">Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((invitation) => (
                      <tr key={invitation.id}>
                        <td>{invitation.email}</td>
                        <td>{roleLabel(invitation.role)}</td>
                        <td className="data">
                          {new Date(invitation.expires_at).toISOString().slice(0, 10)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
              ) : (
                <p className="muted" style={{ marginBottom: 0 }}>
                  <EmptyValue label="No invitations are waiting" /> No invitations are waiting.
                </p>
              )}
            </Panel>
          </>
        ) : (
          <Callout tone="neutral" title="Member access">
            Only an owner or an administrator can invite people or change roles here.
          </Callout>
        )}
      </div>
    </AppShell>
  );
}
