import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel } from '@/components/primitives/feedback';
import { companyKindLabels } from '@/lib/labels';
import { CompanyForm } from '../company-form';

export const metadata: Metadata = { title: 'Add company' };

export default async function NewCompanyPage({
  params,
  searchParams,
}: {
  params: Promise<{ org: string }>;
  searchParams: Promise<{ kind?: string }>;
}) {
  const { org } = await params;
  const { kind } = await searchParams;
  // Only a kind the form offers is passed on; anything else falls back to its default.
  const initialKind = kind && Object.hasOwn(companyKindLabels, kind) ? kind : undefined;
  const client = await createClient();
  const { data: organization } = await client
    .from('organizations')
    .select('id')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  return (
    <AppShell
      title={initialKind === 'own' ? 'Add your company' : 'Add company'}
      current="Companies"
      orgId={org}
      parent={{ href: `/app/${org}/companies`, label: 'Companies' }}
    >
      <div className="app-page">
        {initialKind === 'own' ? (
          <p className="muted" style={{ margin: 0 }}>
            Your own company is the exporter on every document. Enter it exactly as it should print.
          </p>
        ) : null}
        <Panel title="New company">
          <CompanyForm org={org} initialKind={initialKind} />
        </Panel>
      </div>
    </AppShell>
  );
}
