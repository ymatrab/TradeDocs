import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient, getUser } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Callout, Panel } from '@/components/primitives/feedback';
import { SettingsForm } from './settings-form';

export const metadata: Metadata = { title: 'Document settings' };

/**
 * What the organization's documents say about it as issuer. Every member can read the
 * settings, because they appear on the documents everyone generates; only owners and
 * administrators can change them, which the row policy enforces.
 */
export default async function SettingsPage({ params }: { params: Promise<{ org: string }> }) {
  const { org } = await params;
  const client = await createClient();
  const user = await getUser();

  const { data: organization } = await client
    .from('organizations')
    .select('id, name')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  const [{ data: settings }, { data: membership }] = await Promise.all([
    client.from('organization_settings').select('*').eq('org_id', org).maybeSingle(),
    user
      ? client
          .from('memberships')
          .select('role')
          .eq('org_id', org)
          .eq('user_id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const canManage = membership?.role === 'owner' || membership?.role === 'admin';

  return (
    <AppShell title={organization.name} current="Settings" orgId={org}>
      <div className="app-page">
        <Panel title="Document settings">
          <div style={{ display: 'grid', gap: 16 }}>
            {canManage ? null : (
              <Callout tone="neutral" title="Ask an owner or administrator">
                Only an owner or an administrator can change these settings.
              </Callout>
            )}
            <p className="muted" style={{ margin: 0 }}>
              These apply to documents generated from now on. A document already generated keeps
              what it said; it is marked stale so you can re-issue it.
            </p>
            <SettingsForm
              org={org}
              canManage={canManage}
              settings={{
                default_currency: settings?.default_currency ?? 'EUR',
                number_prefix: settings?.number_prefix ?? null,
                payment_terms: settings?.payment_terms ?? null,
                bank_details: settings?.bank_details ?? null,
                signatory_name: settings?.signatory_name ?? null,
                signatory_title: settings?.signatory_title ?? null,
                document_notes: settings?.document_notes ?? null,
              }}
            />
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
