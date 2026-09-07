import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, EmptyState, Callout } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { CreateOrganizationForm } from './create-organization-form';

export const metadata: Metadata = { title: 'Organizations' };

export default async function OrganizationsPage() {
  const client = await createClient();
  const { data: organizations } = await client
    .from('organizations')
    .select('id, name, created_at')
    .order('created_at', { ascending: true });
  const { data: memberships } = await client.from('memberships').select('org_id, role');
  const roleFor = new Map((memberships ?? []).map((row) => [row.org_id, row.role]));

  return (
    <AppShell title="Organizations" current="Organizations">
      <div style={{ display: 'grid', gap: 24, maxWidth: 900 }}>
        <Callout tone="legal" title="Preparation only">
          TradeDocs prepares documents. It does not issue, endorse or clear them.
        </Callout>

        {organizations && organizations.length > 0 ? (
          <Panel title="Your organizations">
            <DataTable caption="Organizations you belong to">
              <thead>
                <tr>
                  <th scope="col">Organization</th>
                  <th scope="col">Your role</th>
                  <th scope="col">Members</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((organization) => (
                  <tr key={organization.id}>
                    <td>
                      <Link className="text-link" href={`/app/${organization.id}/members`}>
                        {organization.name}
                      </Link>
                    </td>
                    <td>{roleFor.get(organization.id) ?? 'member'}</td>
                    <td>
                      <Link className="text-link" href={`/app/${organization.id}/members`}>
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </Panel>
        ) : (
          <Panel title="Your organizations">
            <EmptyState
              title="No organization yet"
              description="Create one to capture your company, customer and product data once and reuse it on every document."
            />
          </Panel>
        )}

        <Panel title="Create an organization">
          <CreateOrganizationForm />
        </Panel>
      </div>
    </AppShell>
  );
}
