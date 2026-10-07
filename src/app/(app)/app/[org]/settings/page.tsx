import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient, getUser } from '@/lib/supabase/server';
import { AppShell } from '@/components/shell/app';
import { Callout, Panel } from '@/components/primitives/feedback';
import { SettingsForm } from './settings-form';
import { BrandingPanel, type BrandingSlotView } from './branding-panel';
import { hasEntitlement } from '@/lib/billing/server';
import {
  BRANDING_BUCKET,
  BRANDING_SLOT_LABELS,
  BRANDING_SLOTS,
  PREVIEW_URL_SECONDS,
} from '@/lib/branding/assets';
import { MAX_BRANDING_BYTES, MAX_BRANDING_SIDE } from '@/lib/limits';
import { LOGO_BOX, SIGNATURE_BOX } from '@/lib/pdf/branding-layout';

/** Points to millimetres, rounded, for the placement note. */
function mm(points: number): number {
  return Math.round((points * 25.4) / 72);
}

const PLACEMENT = {
  logo: `Printed at the top left of every page, scaled to fit ${mm(LOGO_BOX.width)} × ${mm(LOGO_BOX.height)} mm without stretching. A wide logo on a transparent or white background works best.`,
  signature: `Printed above the signatory line at the end of each document, scaled to fit ${mm(SIGNATURE_BOX.width)} × ${mm(SIGNATURE_BOX.height)} mm. The documents still say they are prepared by you, not issued or certified by any authority.`,
} as const;

const REQUIREMENTS = `PNG or JPEG, up to ${MAX_BRANDING_BYTES / 1_048_576} MB and ${MAX_BRANDING_SIDE} × ${MAX_BRANDING_SIDE} pixels. Transparent PNGs keep their transparency.`;

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

  const [{ data: settings }, { data: membership }, branding, entitled] = await Promise.all([
    client.from('organization_settings').select('*').eq('org_id', org).maybeSingle(),
    user
      ? client
          .from('memberships')
          .select('role')
          .eq('org_id', org)
          .eq('user_id', user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    client
      .from('branding_assets')
      .select('slot, object_path, format, width, height, byte_size')
      .eq('org_id', org),
    hasEntitlement(org, 'pdf_branding'),
  ]);
  const canManage = membership?.role === 'owner' || membership?.role === 'admin';

  // Previews through short-lived signed URLs; the bucket itself is private.
  const assets = branding.data ?? [];
  const bucket = client.storage.from(BRANDING_BUCKET);
  const paths = assets.map((asset) => asset.object_path);
  const { data: signed } =
    paths.length > 0 ? await bucket.createSignedUrls(paths, PREVIEW_URL_SECONDS) : { data: [] };
  const urls = new Map(
    (signed ?? []).flatMap((entry) =>
      entry.path && entry.signedUrl && !entry.error ? [[entry.path, entry.signedUrl] as const] : [],
    ),
  );
  const slots = BRANDING_SLOTS.map((slot): BrandingSlotView => {
    const asset = assets.find((row) => row.slot === slot);
    return {
      slot,
      label: BRANDING_SLOT_LABELS[slot],
      placement: PLACEMENT[slot],
      current: asset
        ? {
            previewUrl: urls.get(asset.object_path) ?? null,
            width: asset.width,
            height: asset.height,
            format: asset.format === 'png' ? 'png' : 'jpeg',
            byteSize: asset.byte_size,
          }
        : null,
    };
  });

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
        <Panel title="Branding">
          <BrandingPanel
            org={org}
            slots={slots}
            entitled={entitled}
            canManage={canManage}
            loadFailed={Boolean(branding.error)}
            maxBytes={MAX_BRANDING_BYTES}
            requirements={REQUIREMENTS}
          />
        </Panel>
      </div>
    </AppShell>
  );
}
