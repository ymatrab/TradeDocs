import { createHash } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { renderTradeDocument } from '@/lib/pdf/trade-document';
import { createZip, safeFileName, type ZipEntry } from '@/lib/zip';
import { documentKindLabel } from '@/lib/labels';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Beyond this a set is not a set; it is a report, and should be built as a job. */
const MAX_DOCUMENTS = 60;

/**
 * Serves the current document set for one shipment as a ZIP with a manifest.
 *
 * Authorization is the row policy's: both queries run as the caller, so a shipment in
 * another organization returns nothing and the route answers 404 without distinguishing
 * "not yours" from "not there".
 *
 * Only current revisions are included. A set is what you send to a counterparty, and
 * quietly bundling a stale or voided revision alongside its replacement is how the wrong
 * invoice reaches a bank. They remain downloadable one at a time.
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await createClient();

  const { data: shipment } = await client
    .from('shipments')
    .select('id, reference, revision')
    .eq('id', id)
    .maybeSingle();
  if (!shipment) return new NextResponse('Not found', { status: 404 });

  const { data: documents } = await client
    .from('documents')
    .select('id, kind, number, status, shipment_revision, snapshot, created_at')
    .eq('shipment_id', id)
    .eq('status', 'final')
    .eq('shipment_revision', shipment.revision)
    .order('kind');

  const current = documents ?? [];
  if (current.length === 0) {
    return new NextResponse(
      'This shipment has no current documents. Generate one, or re-issue the stale revisions.',
      { status: 409 },
    );
  }
  if (current.length > MAX_DOCUMENTS) {
    return new NextResponse('That set is too large to download in one archive.', { status: 413 });
  }

  const entries: ZipEntry[] = [];
  const manifest: string[] = [
    `Shipment: ${shipment.reference}`,
    `Shipment revision: ${shipment.revision}`,
    `Documents: ${current.length}`,
    `Archive built: ${new Date().toISOString()}`,
    '',
    'Each line below is the SHA-256 of the file as it appears in this archive. Re-render',
    'a document from TradeDocs at any time and it produces these same bytes, because a',
    'document is rendered from the snapshot it was generated with and never from the',
    'live shipment.',
    '',
  ];

  for (const document of current) {
    let pdf: Uint8Array;
    try {
      pdf = renderTradeDocument(document.snapshot);
    } catch {
      // One unrenderable snapshot is a defect in that document, not grounds to deny the
      // operator the rest of a set they are probably about to send.
      manifest.push(`SKIPPED  ${document.number}  (${documentKindLabel(document.kind)}) — could not be rendered`);
      continue;
    }

    const name = `${safeFileName(document.number)}-${safeFileName(document.kind)}.pdf`;
    entries.push({ name, data: pdf, modified: new Date(document.created_at) });
    const digest = createHash('sha256').update(pdf).digest('hex');
    manifest.push(`${digest}  ${name}`);
  }

  if (entries.length === 0) {
    return new NextResponse('None of the documents in this set could be rendered.', {
      status: 500,
    });
  }

  entries.push({
    name: 'manifest.txt',
    data: new TextEncoder().encode(`${manifest.join('\n')}\n`),
  });

  const archive = createZip(entries);
  const filename = `${safeFileName(shipment.reference, 'shipment')}-documents.zip`;

  return new NextResponse(archive as BodyInit, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(archive.length),
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
