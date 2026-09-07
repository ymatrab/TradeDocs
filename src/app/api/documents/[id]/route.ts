import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderTradeDocument } from '@/lib/pdf/trade-document';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Serves a generated document as a PDF.
 *
 * Authorization is the row policy's: the query runs as the caller, so a document belonging
 * to another organization simply is not found. The route never widens that.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await createClient();
  const { data: document } = await client
    .from('documents')
    .select('number, kind, snapshot, status')
    .eq('id', id)
    .maybeSingle();

  if (!document) return new NextResponse('Not found', { status: 404 });

  let pdf: Uint8Array;
  try {
    pdf = renderTradeDocument(document.snapshot);
  } catch {
    // A snapshot that cannot be rendered is a defect, not a client error, and its content
    // must not be echoed back.
    return new NextResponse('This document could not be rendered.', { status: 500 });
  }

  return new NextResponse(pdf as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${document.number}.pdf"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
