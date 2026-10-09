import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import {
  createClient,
  DatabaseUnavailableError,
  type TradeDocsClient,
} from '@/lib/supabase/server';
import {
  renderTradeDocument,
  withoutBranding,
  type BrandingImages,
} from '@/lib/pdf/trade-document';
import { hasEntitlement } from '@/lib/billing/server';
import { loadBrandingImages, needsBranding } from '@/lib/branding/server';
import { safeFileName } from '@/lib/zip';
import { regulatedDocumentsEnabled } from '@/lib/config/server';
import { isRegulatedDocumentKind, REGULATED_DOCUMENT_LIMITATION } from '@/lib/trade/regulated';
import { CURRENT_COO_WORDING } from '@/lib/trade/certificate-of-origin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const kinds = z.enum([
  'commercial_invoice',
  'proforma_invoice',
  'packing_list',
  'delivery_note',
  'certificate_of_origin',
]);

/**
 * Renders the document a shipment would produce right now, without finalizing it: no number
 * is allocated and nothing is stored. Every page says PREVIEW · NOT ISSUED, so a preview
 * cannot be mistaken for, or sent as, the document itself.
 *
 * Authorization is the routine's: preview_document runs as the caller and refuses a
 * shipment outside their organizations, which this route reports as not found.
 *
 * Branding is the organization's current logo and signature, and is a paid feature checked
 * twice: the database adds it to the snapshot only for an entitled organization, and this
 * route checks the entitlement again before drawing it. Either check failing, or an image
 * that cannot be read, renders the preview without branding (fail closed).
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shipment = z.uuid().safeParse(id);
  const kind = kinds.safeParse(request.nextUrl.searchParams.get('kind') ?? 'commercial_invoice');
  if (!shipment.success) return new NextResponse('Not found', { status: 404 });
  if (!kind.success) return new NextResponse('Unknown document type.', { status: 400 });
  if (isRegulatedDocumentKind(kind.data) && !regulatedDocumentsEnabled()) {
    return new NextResponse(REGULATED_DOCUMENT_LIMITATION, { status: 403 });
  }

  let client: TradeDocsClient;
  try {
    client = await createClient();
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      return NextResponse.json(
        { error: 'Documents are not available on this deployment.' },
        { status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '300' } },
      );
    }
    throw error;
  }

  const { data: snapshot, error } = await client.rpc('preview_document', {
    target_shipment: shipment.data,
    document_kind: kind.data,
  });
  if (error || !snapshot) return new NextResponse('Not found', { status: 404 });

  const items = (snapshot as { items?: unknown }).items;
  if (!Array.isArray(items) || items.length === 0) {
    return new NextResponse('Add at least one line before previewing a document.', {
      status: 409,
    });
  }

  let rendered: unknown = snapshot;
  if (kind.data === 'certificate_of_origin') {
    // What generation records in the database (20261009000200_certificate_of_origin.sql):
    // the current wording and the shipment's current final commercial invoice, read under
    // the caller's own access.
    const { data: invoice } = await client
      .from('documents')
      .select('number')
      .eq('shipment_id', shipment.data)
      .eq('kind', 'commercial_invoice')
      .eq('status', 'final')
      .order('created_at', { ascending: false })
      .order('number', { ascending: false })
      .limit(1)
      .maybeSingle();
    rendered = {
      ...(snapshot as Record<string, unknown>),
      certificate: {
        wording_version: CURRENT_COO_WORDING,
        invoice_reference: invoice?.number ?? null,
      },
    };
  }
  let images: BrandingImages | undefined;
  if (needsBranding(snapshot)) {
    const { data: owner } = await client
      .from('shipments')
      .select('org_id')
      .eq('id', shipment.data)
      .maybeSingle();
    const loaded =
      owner && (await hasEntitlement(owner.org_id, 'pdf_branding'))
        ? await loadBrandingImages(client, owner.org_id, snapshot)
        : null;
    if (loaded) images = loaded;
    else rendered = withoutBranding(rendered);
  }

  let pdf: Uint8Array;
  try {
    pdf = renderTradeDocument(rendered, undefined, images);
  } catch {
    return new NextResponse('This preview could not be rendered.', { status: 500 });
  }

  const reference = (snapshot as { shipment?: { reference?: unknown } }).shipment?.reference;
  const name = safeFileName(typeof reference === 'string' ? reference : 'shipment', 'shipment');
  return new NextResponse(pdf as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      // Opened in the browser rather than saved: a preview is for looking at.
      'Content-Disposition': `inline; filename="preview-${name}-${kind.data}.pdf"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
