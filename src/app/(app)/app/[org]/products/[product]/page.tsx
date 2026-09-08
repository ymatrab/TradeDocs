import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, Callout } from '@/components/primitives/feedback';
import { ArchiveToggle } from '@/components/master-data/archive-toggle';
import { setProductArchived } from '@/app/(app)/master-data-actions';
import { ProductForm } from '../product-form';

export const metadata: Metadata = { title: 'Product' };

export default async function ProductPage({
  params,
}: {
  params: Promise<{ org: string; product: string }>;
}) {
  const { org, product } = await params;
  const client = await createClient();

  const { data: record } = await client
    .from('products')
    .select(
      'id, sku, description, hs_code, country_of_origin, unit, unit_price, currency, net_weight_kg, gross_weight_kg, package_kind, notes, archived_at',
    )
    .eq('id', product)
    .eq('org_id', org)
    .maybeSingle();
  if (!record) notFound();

  const { count: lineCount } = await client
    .from('shipment_items')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', product);

  const archived = record.archived_at !== null;

  return (
    <AppShell title={record.description} current="Products" orgId={org}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 900 }}>
        <p>
          <Link className="text-link" href={`/app/${org}/products`}>
            ← Catalog
          </Link>
        </p>

        {archived ? (
          <Callout tone="warning" title="Archived">
            This product no longer appears when adding lines to a shipment. Lines already added
            keep the values they captured.
          </Callout>
        ) : null}

        <Panel title="Product details">
          <ProductForm org={org} product={record} />
        </Panel>

        <Panel title="Archive">
          <div style={{ display: 'grid', gap: 12 }}>
            <p className="muted">
              {lineCount && lineCount > 0
                ? `Used on ${lineCount} shipment ${lineCount === 1 ? 'line' : 'lines'}. Those lines hold their own copy of these values, so archiving — or editing — changes nothing that has already been documented.`
                : 'Not used on any shipment line yet.'}
            </p>
            <ArchiveToggle
              action={setProductArchived}
              org={org}
              field="product"
              id={record.id}
              archived={archived}
              archiveLabel="Archive this product"
              restoreLabel="Restore to the catalog"
            />
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
