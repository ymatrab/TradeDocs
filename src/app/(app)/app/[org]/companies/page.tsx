import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, EmptyState } from '@/components/primitives/feedback';
import { DataTable, EmptyValue } from '@/components/primitives/table';
import { companyKindLabel } from '@/lib/labels';

export const metadata: Metadata = { title: 'Companies' };

type Search = { show?: string };

export default async function CompaniesPage({
  params,
  searchParams,
}: {
  params: Promise<{ org: string }>;
  searchParams: Promise<Search>;
}) {
  const { org } = await params;
  const { show } = await searchParams;
  const showingArchived = show === 'archived';

  const client = await createClient();
  const { data: organization } = await client
    .from('organizations')
    .select('id, name')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  let query = client
    .from('companies')
    .select('id, kind, name, city, country_code, contact_name, archived_at')
    .eq('org_id', org);
  query = showingArchived ? query.not('archived_at', 'is', null) : query.is('archived_at', null);
  const { data: companies } = await query.order('kind').order('name');

  const rows = companies ?? [];

  return (
    <AppShell title="Companies" current="Companies" orgId={org}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 1040 }}>
        <Panel
          title={showingArchived ? 'Archived companies' : 'Companies'}
          actions={
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Link
                className="text-link"
                href={
                  showingArchived ? `/app/${org}/companies` : `/app/${org}/companies?show=archived`
                }
              >
                {showingArchived ? 'Show active' : 'Show archived'}
              </Link>
              <Link className="btn compact" href={`/app/${org}/companies/new`}>
                Add company
              </Link>
            </div>
          }
        >
          {rows.length > 0 ? (
            <DataTable caption="Companies saved in this organization">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Kind</th>
                  <th scope="col">Contact</th>
                  <th scope="col">Location</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((company) => (
                  <tr key={company.id}>
                    <td>
                      <Link className="text-link" href={`/app/${org}/companies/${company.id}`}>
                        {company.name}
                      </Link>
                    </td>
                    <td>{companyKindLabel(company.kind)}</td>
                    <td>{company.contact_name ?? <EmptyValue />}</td>
                    <td>
                      {company.city || company.country_code ? (
                        [company.city, company.country_code].filter(Boolean).join(', ')
                      ) : (
                        <EmptyValue />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          ) : showingArchived ? (
            <EmptyState
              title="Nothing archived"
              description="Companies you archive are kept here, out of the pickers but still readable on the documents that used them."
            />
          ) : (
            <EmptyState
              title="No companies yet"
              description="Save an exporter, a buyer and anyone to be notified once. Every shipment then picks them from a list instead of retyping an address that has to match across a document set."
              action={
                <Link className="btn" href={`/app/${org}/companies/new`}>
                  Add the first company
                </Link>
              }
            />
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
