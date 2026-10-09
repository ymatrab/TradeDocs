import 'server-only';

import { createServiceClient, hasServiceRole } from '@/lib/supabase/admin';
import type { TradeDocsClient } from '@/lib/supabase/server';
import { certificateOfOriginGaps } from './certificate-of-origin';

export type CertificateResult = { created: string } | { error: string };

/**
 * Finalizes a certificate of origin. The caller has already checked the review gate
 * (regulatedDocumentsEnabled); this checks that the shipment can carry one, then generates
 * it through public.generate_certificate_of_origin, the only path the database accepts for
 * this kind (20261009000200_certificate_of_origin.sql).
 *
 * The shipment, its lines and the signatory are read with the caller's own client, so a
 * shipment outside their organizations reads as absent. The routine is service-role only
 * and is handed the verified user, whose membership it checks again.
 */
export async function generateCertificateOfOrigin(
  client: TradeDocsClient,
  org: string,
  shipment: string,
): Promise<CertificateResult> {
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return { error: 'Sign in again to generate this document.' };

  const { data: row } = await client
    .from('shipments')
    .select('exporter_id, consignee_id')
    .eq('id', shipment)
    .eq('org_id', org)
    .maybeSingle();
  if (!row) return { error: 'That shipment is not available to you.' };

  const { data: lines } = await client
    .from('shipment_items')
    .select('country_of_origin')
    .eq('shipment_id', shipment)
    .eq('org_id', org);
  const { data: settings } = await client
    .from('organization_settings')
    .select('signatory_name')
    .eq('org_id', org)
    .maybeSingle();

  const gaps = certificateOfOriginGaps({
    exporter: Boolean(row.exporter_id),
    consignee: Boolean(row.consignee_id),
    lineOrigins: (lines ?? []).map((line) => line.country_of_origin),
    signatoryName: settings?.signatory_name ?? null,
  });
  if (gaps.length > 0) {
    return { error: `Before a certificate of origin: ${gaps.join(' ')}` };
  }

  // Fails closed: without the service-role connection the reviewed path is unreachable.
  if (!hasServiceRole()) {
    return { error: 'Certificates of origin cannot be generated on this deployment yet.' };
  }
  const service = createServiceClient();
  const { data: created, error } = await service.rpc('generate_certificate_of_origin', {
    target_shipment: shipment,
    actor: user.id,
  });
  if (error || !created) {
    if (error?.message?.includes('at least one line item')) {
      return { error: 'Add at least one line before generating a document.' };
    }
    if (error?.code === '42501') return { error: 'That shipment is not available to you.' };
    return { error: 'That document could not be generated. Try again.' };
  }
  return { created };
}
