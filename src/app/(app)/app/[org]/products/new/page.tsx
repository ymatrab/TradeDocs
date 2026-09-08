import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel } from '@/components/primitives/feedback';
import { ProductForm } from '../product-form';

export const metadata: Metadata = { title: 'Add product' };

export default async function NewProductPage({ params }: { params: Promise<{ org: string }> }) {
  const { org } = await params;
  const client = await createClient();
  const { data: organization } = await client
    .from('organizations')
    .select('id')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  return (
    <AppShell title="Add product" current="Products" orgId={org}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 900 }}>
        <p>
          <Link className="text-link" href={`/app/${org}/products`}>
            ← Catalog
          </Link>
        </p>
        <Panel title="New product">
          <ProductForm org={org} />
        </Panel>
      </div>
    </AppShell>
  );
}
