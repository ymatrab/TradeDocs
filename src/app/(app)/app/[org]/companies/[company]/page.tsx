import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Panel, Callout } from '@/components/primitives/feedback';
import { ArchiveToggle } from '@/components/master-data/archive-toggle';
import { companyKindLabel } from '@/lib/labels';
import { setCompanyArchived } from '@/app/(app)/master-data-actions';
import { CompanyForm } from '../company-form';

export const metadata: Metadata = { title: 'Company' };

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ org: string; company: string }>;
}) {
  const { org, company } = await params;
  const client = await createClient();

  const { data: record } = await client
    .from('companies')
    .select(
      'id, kind, name, legal_name, contact_name, tax_number, registration_number, email, phone, address_line1, address_line2, city, region, postal_code, country_code, notes, archived_at',
    )
    .eq('id', company)
    .eq('org_id', org)
    .maybeSingle();
  if (!record) notFound();

  // How much history depends on this party, so the archive control can say what it
  // will and will not touch rather than asking for trust.
  const { count: shipmentCount } = await client
    .from('shipments')
    .select('id', { count: 'exact', head: true })
    .eq('org_id', org)
    .or(`exporter_id.eq.${company},consignee_id.eq.${company},notify_id.eq.${company}`);

  const archived = record.archived_at !== null;

  return (
    <AppShell title={record.name} current="Companies" orgId={org}>
      <div style={{ display: 'grid', gap: 24, maxWidth: 900 }}>
        <p>
          <Link className="text-link" href={`/app/${org}/companies`}>
            ← All companies
          </Link>
        </p>

        {archived ? (
          <Callout tone="warning" title="Archived">
            This company stays out of the shipment pickers. Documents that already name it are
            unchanged and still readable.
          </Callout>
        ) : null}

        <Panel title={`${companyKindLabel(record.kind)} details`}>
          <CompanyForm org={org} company={record} />
        </Panel>

        <Panel title="Archive">
          <div style={{ display: 'grid', gap: 12 }}>
            <p className="muted">
              {shipmentCount && shipmentCount > 0
                ? `Used by ${shipmentCount} ${shipmentCount === 1 ? 'shipment' : 'shipments'}. Archiving hides it from new shipments and changes nothing that already exists.`
                : 'Not used by any shipment yet. Archiving hides it from new shipments.'}
            </p>
            <ArchiveToggle
              action={setCompanyArchived}
              org={org}
              field="company"
              id={record.id}
              archived={archived}
              archiveLabel="Archive this company"
              restoreLabel="Restore to the active list"
            />
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
