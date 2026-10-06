import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, EmptyState } from '@/components/primitives/feedback';
import { DataTable, EmptyValue } from '@/components/primitives/table';
import { Button } from '@/components/primitives/button';
import { Input } from '@/components/primitives/form';
import { companyKindLabel, companyKindLabels } from '@/lib/labels';

export const metadata: Metadata = { title: 'Companies' };

type Search = { show?: string; q?: string; kind?: string };

export default async function CompaniesPage({
  params,
  searchParams,
}: {
  params: Promise<{ org: string }>;
  searchParams: Promise<Search>;
}) {
  const { org } = await params;
  const { show, q, kind } = await searchParams;
  const showingArchived = show === 'archived';
  const term = (q ?? '').trim();
  const kindFilter = kind && Object.hasOwn(companyKindLabels, kind) ? kind : null;

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
  if (kindFilter) query = query.eq('kind', kindFilter);
  if (term) {
    // Escaped so a comma or a parenthesis in the search box cannot be read as filter
    // syntax and turn a search into a different query.
    const safe = term.replace(/[,()\\%_]/g, ' ').trim();
    if (safe) query = query.or(`name.ilike.%${safe}%,city.ilike.%${safe}%`);
  }
  const { data: companies } = await query.order('kind').order('name');

  const rows = companies ?? [];
  const base = `/app/${org}/companies`;
  const narrowed = Boolean(term || kindFilter);
  // Every filter link keeps the others, so choosing a kind never drops the search.
  const href = (chosenKind: string | null) => {
    const search = new URLSearchParams();
    if (showingArchived) search.set('show', 'archived');
    if (term) search.set('q', term);
    if (chosenKind) search.set('kind', chosenKind);
    const encoded = search.toString();
    return encoded ? `${base}?${encoded}` : base;
  };

  return (
    <AppShell title="Companies" current="Companies" orgId={org}>
      <div className="app-page wide">
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
          <div style={{ display: 'grid', gap: 16 }}>
            <form
              method="get"
              action={base}
              role="search"
              className="list-search"
              aria-label="Search companies"
            >
              {showingArchived ? <input type="hidden" name="show" value="archived" /> : null}
              {kindFilter ? <input type="hidden" name="kind" value={kindFilter} /> : null}
              <div className="field">
                <label htmlFor="company-search">Search companies</label>
                <Input
                  id="company-search"
                  name="q"
                  type="search"
                  defaultValue={term}
                  placeholder="Name or city"
                  autoComplete="off"
                />
              </div>
              <Button type="submit" tone="secondary">
                <SearchIcon size={16} aria-hidden="true" />
                Search
              </Button>
            </form>
            <nav aria-label="Filter by kind" className="filter-chips">
              <Link
                className="filter-chip"
                href={href(null)}
                aria-current={kindFilter ? undefined : 'page'}
              >
                All kinds
              </Link>
              {Object.entries(companyKindLabels).map(([value, label]) => (
                <Link
                  key={value}
                  className="filter-chip"
                  href={href(value)}
                  aria-current={kindFilter === value ? 'page' : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>
            {rows.length > 0 ? (
              <DataTable caption="Companies saved in this organization" stack>
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
                      <td className="stack-title">
                        <Link className="text-link" href={`/app/${org}/companies/${company.id}`}>
                          {company.name}
                        </Link>
                      </td>
                      <td data-label="Kind">{companyKindLabel(company.kind)}</td>
                      <td data-label="Contact">{company.contact_name ?? <EmptyValue />}</td>
                      <td data-label="Location">
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
            ) : narrowed ? (
              <EmptyState
                title="Nothing matched"
                description={
                  term
                    ? `No company here matches “${term}”. Check the spelling, or clear the search.`
                    : 'No company of that kind is saved yet.'
                }
                action={
                  <Link
                    className="btn secondary"
                    href={showingArchived ? `${base}?show=archived` : base}
                  >
                    Clear the filters
                  </Link>
                }
              />
            ) : showingArchived ? (
              <EmptyState
                title="Nothing archived"
                description="Companies you archive are kept here, out of the pickers but still readable on the documents that used them."
                action={
                  <Link className="btn secondary" href={`/app/${org}/companies`}>
                    Back to companies
                  </Link>
                }
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
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
