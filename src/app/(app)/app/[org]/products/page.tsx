import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, EmptyState } from '@/components/primitives/feedback';
import { DataTable, EmptyValue, NumericCell } from '@/components/primitives/table';
import { decimal } from '@/lib/format';
import { CatalogSearch } from './catalog-search';

export const metadata: Metadata = { title: 'Products' };

type Search = { q?: string; show?: string };

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ org: string }>;
  searchParams: Promise<Search>;
}) {
  const { org } = await params;
  const { q, show } = await searchParams;
  const term = (q ?? '').trim();
  const showingArchived = show === 'archived';

  const client = await createClient();
  const { data: organization } = await client
    .from('organizations')
    .select('id')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  let query = client
    .from('products')
    .select('id, sku, description, hs_code, country_of_origin, unit, unit_price, currency')
    .eq('org_id', org);
  query = showingArchived ? query.not('archived_at', 'is', null) : query.is('archived_at', null);
  if (term) {
    // Escaped so a comma or a parenthesis in the search box cannot be read as filter
    // syntax and turn a search into a different query.
    const safe = term.replace(/[,()\\]/g, ' ').trim();
    if (safe) query = query.or(`description.ilike.%${safe}%,sku.ilike.%${safe}%`);
  }
  const { data: products } = await query.order('description').limit(500);

  const rows = products ?? [];

  return (
    <AppShell title="Products" current="Products" orgId={org}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 1040 }}>
        <Panel
          title={showingArchived ? 'Archived products' : 'Catalog'}
          actions={
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link
                className="text-link"
                href={
                  showingArchived
                    ? `/app/${org}/products`
                    : `/app/${org}/products?show=archived`
                }
              >
                {showingArchived ? 'Show active' : 'Show archived'}
              </Link>
              <Link className="text-link" href={`/app/${org}/products/import`}>
                Import CSV
              </Link>
              <Link className="btn compact" href={`/app/${org}/products/new`}>
                Add product
              </Link>
            </div>
          }
        >
          <div style={{ display: 'grid', gap: 16 }}>
            <CatalogSearch org={org} term={term} archived={showingArchived} />

            {rows.length > 0 ? (
              <>
                <DataTable caption="Products in this catalog">
                  <thead>
                    <tr>
                      <th scope="col">Code</th>
                      <th scope="col">Description</th>
                      <th scope="col">HS code</th>
                      <th scope="col">Origin</th>
                      <th scope="col">Unit</th>
                      <th scope="col" className="numeric">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((product) => (
                      <tr key={product.id}>
                        <td className="data">{product.sku ?? <EmptyValue />}</td>
                        <td>
                          <Link className="text-link" href={`/app/${org}/products/${product.id}`}>
                            {product.description}
                          </Link>
                        </td>
                        <td className="data">{product.hs_code ?? <EmptyValue />}</td>
                        <td className="data">{product.country_of_origin ?? <EmptyValue />}</td>
                        <td>{product.unit}</td>
                        <NumericCell
                          value={decimal(product.unit_price)}
                          unit={product.currency ?? undefined}
                        />
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
                {rows.length === 500 ? (
                  <p className="muted">
                    Showing the first 500. Narrow the search to reach the rest.
                  </p>
                ) : null}
              </>
            ) : term ? (
              <EmptyState
                title="Nothing matched"
                description={`No product here matches “${term}”. Check the spelling, or clear the search to see the whole catalog.`}
              />
            ) : showingArchived ? (
              <EmptyState
                title="Nothing archived"
                description="Products you retire are kept here, out of the shipment picker but still readable on the documents that used them."
              />
            ) : (
              <EmptyState
                title="The catalog is empty"
                description="Save the goods you ship — description, HS code, origin, weight and price — once. Adding them to a shipment then takes a quantity instead of a form, and every document in the set quotes the same figures."
                action={
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <Link className="btn" href={`/app/${org}/products/new`}>
                      Add the first product
                    </Link>
                    <Link className="btn secondary" href={`/app/${org}/products/import`}>
                      Import a spreadsheet
                    </Link>
                  </div>
                }
              />
            )}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
