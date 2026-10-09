import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/shell/app';
import { Callout, Panel } from '@/components/primitives/feedback';
import { hasEntitlement } from '@/lib/billing/server';
import { FEATURES, type Feature } from '@/lib/billing/plans';
import {
  PROVIDER_FEATURES,
  PROVIDER_IDS,
  PROVIDER_NAMES,
  type ProviderId,
} from '@/lib/integrations/providers';
import { currentProviderConfig } from '@/lib/integrations/server';
import { createClient, getUser } from '@/lib/supabase/server';
import { shortDate } from '@/lib/format';
import { ConnectForm, DisconnectForm, ImportForm } from './integration-forms';

export const metadata: Metadata = { title: 'Integrations' };

/** What the redirect back from a provider means, by result code. */
const RESULTS: Record<string, { tone: 'success' | 'warning' | 'danger'; title: string; text: string }> = {
  connected: {
    tone: 'success',
    title: 'Connected',
    text: 'Check your customers or items below, then import them.',
  },
  declined: {
    tone: 'warning',
    title: 'Not connected',
    text: 'Access was not granted at the provider. Nothing was stored.',
  },
  already_used: {
    tone: 'warning',
    title: 'That link was already used',
    text: 'The connection request was already completed or has expired. The status below is current.',
  },
  wrong_user: {
    tone: 'danger',
    title: 'Not connected',
    text: 'The connection was started by a different signed-in account. Start it again from this page.',
  },
  not_allowed: {
    tone: 'danger',
    title: 'Not connected',
    text: 'Only an owner or administrator can connect accounting software.',
  },
  plan_required: {
    tone: 'danger',
    title: 'Not connected',
    text: 'Importing from accounting software is part of Pro and Team.',
  },
  invalid: {
    tone: 'danger',
    title: 'Not connected',
    text: 'The answer from the provider could not be verified. Start the connection again.',
  },
  provider_error: {
    tone: 'danger',
    title: 'Not connected',
    text: 'The provider did not complete the connection. Try again; if it keeps failing, check the app registration in RUNBOOK.md.',
  },
  unavailable: {
    tone: 'danger',
    title: 'Not connected',
    text: 'The connection could not be completed right now. Try again.',
  },
};

/** What each provider's permission covers, stated plainly (scopes in providers.ts). */
const ACCESS: Record<ProviderId, string> = {
  quickbooks:
    'QuickBooks grants accounting access as a single permission; TradeDocs uses it only to read customers and items.',
  xero: 'TradeDocs asks Xero for read-only access to contacts and to settings, where Xero keeps items.',
};

type Status = { provider: string; tenant_name: string | null; status: string; connected_at: string };

/**
 * QuickBooks Online and Xero (D-025). A provider without complete credentials on this
 * deployment reads "Not connected — not available yet" with no buttons; the feature copy comes
 * from FEATURES in plans.ts. Tokens never reach this page: status comes from
 * public.integration_status, which returns none.
 */
export default async function IntegrationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ org: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { org } = await params;
  const query = await searchParams;
  const client = await createClient();
  const user = await getUser();

  const { data: organization } = await client
    .from('organizations')
    .select('id, name')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  const [{ data: membership }, statuses, quickbooksPaid, xeroPaid] = await Promise.all([
    user
      ? client
          .from('memberships')
          .select('role')
          .eq('org_id', org)
          .eq('user_id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    client.rpc('integration_status', { target_org: org }),
    hasEntitlement(org, PROVIDER_FEATURES.quickbooks),
    hasEntitlement(org, PROVIDER_FEATURES.xero),
  ]);
  const canManage = membership?.role === 'owner' || membership?.role === 'admin';
  const paid: Record<ProviderId, boolean> = { quickbooks: quickbooksPaid, xero: xeroPaid };
  const connections = new Map(
    ((statuses.data ?? []) as Status[]).map((row) => [row.provider, row] as const),
  );

  const resultCode = typeof query.result === 'string' ? query.result : null;
  const resultProvider = typeof query.integration === 'string' ? query.integration : null;
  const result = resultCode ? RESULTS[resultCode] : undefined;

  return (
    <AppShell
      title="Integrations"
      current="Settings"
      orgId={org}
      parent={{ href: `/app/${org}/settings`, label: 'Settings' }}
    >
      <div className="app-page">
        {statuses.error ? (
          <Callout tone="warning" title="Connection status could not be loaded">
            Reload the page to try again.
          </Callout>
        ) : null}
        {PROVIDER_IDS.map((provider) => {
          const name = PROVIDER_NAMES[provider];
          const feature = (FEATURES as readonly Feature[]).find(
            (entry) => entry.key === PROVIDER_FEATURES[provider],
          );
          const configured = currentProviderConfig(provider).state === 'ready';
          const connection = connections.get(provider);
          const showResult = result && resultProvider === provider;
          return (
            <Panel key={provider} title={name}>
              <div style={{ display: 'grid', gap: 16 }}>
                {showResult ? (
                  <Callout tone={result.tone} title={result.title} live>
                    {result.text}
                  </Callout>
                ) : null}
                <p className="muted" style={{ margin: 0 }}>
                  {feature?.label}. {feature?.limit}.
                </p>

                {!configured ? (
                  <Callout tone="neutral" title="Not connected — not available yet">
                    {name} import is not switched on for this site yet.
                    {connection ? ' A connection made earlier is kept but cannot be used.' : ''}
                  </Callout>
                ) : connection ? (
                  <>
                    <Callout
                      tone={connection.status === 'active' ? 'success' : 'warning'}
                      title={
                        connection.status === 'active'
                          ? `Connected${connection.tenant_name ? ` to ${connection.tenant_name}` : ''}`
                          : 'Needs reconnecting'
                      }
                    >
                      {connection.status === 'active'
                        ? `Since ${shortDate(connection.connected_at)}.`
                        : `${name} no longer accepts the stored connection. Reconnect it to import again.`}
                    </Callout>
                    {canManage && paid[provider] ? (
                      connection.status === 'active' ? (
                        <>
                          <ImportForm org={org} provider={provider} name={name} entity="company" />
                          <ImportForm org={org} provider={provider} name={name} entity="product" />
                        </>
                      ) : (
                        <ConnectForm org={org} provider={provider} name={name} reconnect />
                      )
                    ) : null}
                    {canManage && !paid[provider] ? (
                      <Callout tone="neutral" title="Part of Pro and Team">
                        Importing needs a paid plan.{' '}
                        <Link className="text-link" href={`/app/${org}/billing`}>
                          See billing
                        </Link>
                        . You can still disconnect.
                      </Callout>
                    ) : null}
                    {canManage ? <DisconnectForm org={org} provider={provider} name={name} /> : null}
                  </>
                ) : !canManage ? (
                  <Callout tone="neutral" title="Not connected">
                    Ask an owner or administrator to connect {name}.
                  </Callout>
                ) : !paid[provider] ? (
                  <Callout tone="neutral" title="Not connected — part of Pro and Team">
                    Connecting {name} needs a paid plan.{' '}
                    <Link className="text-link" href={`/app/${org}/billing`}>
                      See billing
                    </Link>
                    .
                  </Callout>
                ) : (
                  <>
                    <p style={{ margin: 0 }}>
                      You sign in at {name} and choose the company to connect. {ACCESS[provider]}{' '}
                      The credentials are stored encrypted and deleted when you disconnect.
                    </p>
                    <ConnectForm org={org} provider={provider} name={name} />
                  </>
                )}
              </div>
            </Panel>
          );
        })}
      </div>
    </AppShell>
  );
}
