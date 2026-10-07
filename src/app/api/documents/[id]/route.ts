import { NextResponse, type NextRequest } from 'next/server';
import {
  createClient,
  DatabaseUnavailableError,
  type TradeDocsClient,
} from '@/lib/supabase/server';
import { renderTradeDocument, type BrandingImages } from '@/lib/pdf/trade-document';
import { loadBrandingImages, needsBranding } from '@/lib/branding/server';
import { safeFileName } from '@/lib/zip';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Serves a generated document as a PDF.
 *
 * Authorization is the row policy's: the query runs as the caller, so a document belonging
 * to another organization simply is not found. The route never widens that.
 *
 * A document issued with branding (snapshot schema 5) is drawn with the exact images it
 * recorded, fetched by hash as the caller. If they cannot be read the route answers 503 and
 * renders nothing: an issued document is reproduced as issued or not at all. Whether the
 * organization is still entitled does not matter here; it was when the document was issued.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let client: TradeDocsClient;
  try {
    client = await createClient();
  } catch (error) {
    // A deployment without a database has no documents to serve. Saying so is a 503 the
    // caller can act on, not an unhandled 500.
    if (error instanceof DatabaseUnavailableError) {
      return NextResponse.json(
        { error: 'Documents are not available on this deployment.' },
        { status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '300' } },
      );
    }
    throw error;
  }
  const { data: document } = await client
    .from('documents')
    .select('org_id, number, kind, snapshot, status')
    .eq('id', id)
    .maybeSingle();

  if (!document) return new NextResponse('Not found', { status: 404 });

  let images: BrandingImages | undefined;
  if (needsBranding(document.snapshot)) {
    const loaded = await loadBrandingImages(client, document.org_id, document.snapshot);
    if (!loaded) {
      console.error('Branding images unavailable for a document.', { document: id });
      return new NextResponse(
        'This document’s logo or signature image could not be loaded. Try again in a moment.',
        { status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '30' } },
      );
    }
    images = loaded;
  }

  let pdf: Uint8Array;
  try {
    pdf = renderTradeDocument(document.snapshot, undefined, images);
  } catch {
    // A snapshot that cannot be rendered is a defect, not a client error, and its content
    // must not be echoed back.
    return new NextResponse('This document could not be rendered.', { status: 500 });
  }

  return new NextResponse(pdf as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      // The number is the organization's own text; it must not be able to break the header.
      'Content-Disposition': `attachment; filename="${safeFileName(document.number)}.pdf"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
