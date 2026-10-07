import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { createClient, getUser } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Callout, Panel } from '@/components/primitives/feedback';
import { BoxGrid, FieldBox } from '@/components/document/field-box';
import { LinkButton } from '@/components/primitives/button';
import { currentPlans, readEntitlement } from '@/lib/billing/server';
import { summarizeEntitlement, type EntitlementSummary } from '@/lib/billing/entitlements';
import { INTERVAL_LABELS, paidOnlySummary, PLAN_NAMES, upgradeUrl } from '@/lib/billing/plans';

export const metadata: Metadata = { title: 'Billing' };

function day(value: string): string {
  return new Date(value).toISOString().slice(0, 10);
}

function planLabel(summary: EntitlementSummary): string {
  return summary.kind === 'free' ? PLAN_NAMES.free : PLAN_NAMES[summary.plan];
}

function statusLabel(summary: EntitlementSummary): string {
  switch (summary.kind) {
    case 'free':
      return 'Free while early';
    case 'active':
      return `Active, renews ${day(summary.until)}`;
    case 'ending':
      return `Ends ${day(summary.until)}`;
    case 'ended':
      return 'Ended';
    case 'revoked':
      return summary.reason === 'dispute'
        ? 'Ended: payment disputed'
        : summary.reason === 'refund'
          ? 'Ended: payment refunded'
          : 'Ended';
  }
}

/**
 * The organization's plan, and the way to a paid one when there is one to buy.
 *
 * The entitlement is read as the signed-in member, so another organization's billing simply
 * is not there. The upgrade button appears only for owners and admins, only when payments
 * are open and the plan has a configured Payment Link; it opens Stripe's hosted page with the
 * organization's id as client_reference_id and nothing personal in the URL. Access changes
 * only when Stripe's verified webhook says so, never because someone returned from checkout.
 */
export default async function BillingPage({ params }: { params: Promise<{ org: string }> }) {
  const { org } = await params;
  const client = await createClient();
  const user = await getUser();

  const { data: organization } = await client
    .from('organizations')
    .select('id, name')
    .eq('id', org)
    .maybeSingle();
  if (!organization) notFound();

  const { data: membership } = user
    ? await client
        .from('memberships')
        .select('role')
        .eq('org_id', org)
        .eq('user_id', user.id)
        .maybeSingle()
    : { data: null };
  const canManage = membership?.role === 'owner' || membership?.role === 'admin';

  const { row, failed } = await readEntitlement(client, org);
  const summary = summarizeEntitlement(row, new Date());
  const offers = currentPlans().flatMap((plan) => {
    if (plan.id === 'free' || plan.offer.state !== 'purchasable') return [];
    const href = upgradeUrl(plan.offer.paymentLinkUrl, organization.id);
    return href ? [{ id: plan.id, name: plan.name, offer: plan.offer, href }] : [];
  });
  const entitled = summary.kind === 'active' || summary.kind === 'ending';
  const extras = paidOnlySummary();

  return (
    <AppShell title={organization.name} current="Billing" orgId={org}>
      <div className="app-page">
        <Panel title="Plan">
          {failed ? (
            <Callout tone="warning" title="The plan could not be loaded">
              Reload the page to try again. Until it loads no paid access is assumed; everything
              free keeps working.
            </Callout>
          ) : (
            <BoxGrid label="Current plan">
              <FieldBox ordinal="1" caption="Plan" value={planLabel(summary)} />
              <FieldBox ordinal="2" caption="Status" value={statusLabel(summary)} />
            </BoxGrid>
          )}
        </Panel>

        <Panel title="Paid plans">
          {offers.length === 0 ? (
            <Callout tone="neutral" title="Paid plans aren’t open yet">
              {extras
                ? `Everything but ${extras} is free while it is early, with no card; Pro and Team add ${extras}.`
                : 'Everything TradeDocs does is free while it is early, with no card.'}{' '}
              When paid plans open, their prices will be on the{' '}
              <Link className="text-link" href="/pricing">
                pricing page
              </Link>{' '}
              first.
            </Callout>
          ) : entitled ? (
            <p className="muted" style={{ marginBottom: 0 }}>
              This organization already has a paid plan. If it is cancelled, it runs to the end of
              the period already paid.
            </p>
          ) : !canManage ? (
            <Callout tone="neutral" title="Ask an owner or administrator">
              Only an owner or an administrator can choose a paid plan for this organization.
            </Callout>
          ) : (
            <div className="cta-row">
              {offers.map((item) => (
                <LinkButton key={item.id} href={item.href} rel="noopener">
                  {item.name} · {item.offer.price} {INTERVAL_LABELS[item.offer.interval]}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </LinkButton>
              ))}
              <p className="muted" style={{ marginBottom: 0 }}>
                Payment is taken on Stripe’s page. The plan starts once Stripe confirms it, which
                can take a minute; reload this page to see it.
              </p>
            </div>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
