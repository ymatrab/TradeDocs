import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, Callout } from '@/components/primitives/feedback';
import { ImportForm } from './import-form';

export const metadata: Metadata = { title: 'Import catalog' };

export default async function ImportPage({ params }: { params: Promise<{ org: string }> }) {
  const { org } = await params;
  const client = await createClient();
  const { data: organization } = await client
    .from('organizations')
    .select('id')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  return (
    <AppShell title="Import catalog" current="Products" orgId={org}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 900 }}>
        <p>
          <Link className="text-link" href={`/app/${org}/products`}>
            ← Catalog
          </Link>
        </p>

        <Callout tone="neutral" title="How this import behaves">
          Column headings are matched loosely, so <span className="data">HS Code</span>,{' '}
          <span className="data">hs_code</span> and <span className="data">Tariff code</span> all
          land in the same field. A product code that already exists is updated rather than
          duplicated. If any row is unusable, nothing at all is written and every problem is listed
          at once.{' '}
          <Link className="text-link" href="/api/catalog-template">
            Download a template
          </Link>{' '}
          to start from.
        </Callout>

        <Panel title="Import">
          <ImportForm org={org} />
        </Panel>
      </div>
    </AppShell>
  );
}
