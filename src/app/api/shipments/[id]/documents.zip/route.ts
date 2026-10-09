import { createHash } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import {
  createClient,
  DatabaseUnavailableError,
  type TradeDocsClient,
} from '@/lib/supabase/server';
import {
  RENDERER_VERSION,
  renderTradeDocument,
  type BrandingImages,
} from '@/lib/pdf/trade-document';
import { loadBrandingImages, needsBranding } from '@/lib/branding/server';
import { createZip, safeFileName, type ZipEntry } from '@/lib/zip';
import { documentKindLabel } from '@/lib/labels';
import { MAX_SET_DOCUMENTS } from '@/lib/limits';
import { freshnessOf } from '@/lib/trade/staleness';
import { COO_TEMPLATE_LABEL } from '@/lib/trade/certificate-of-origin';
import { isRegulatedDocumentKind } from '@/lib/trade/regulated';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Snapshots before versioning carry no schema_version and are schema 1. */
function schemaVersionOf(snapshot: unknown): number {
  if (typeof snapshot === 'object' && snapshot !== null && 'schema_version' in snapshot) {
    const version = (snapshot as { schema_version: unknown }).schema_version;
    if (typeof version === 'number' && Number.isInteger(version)) return version;
  }
  return 1;
}

/** Beyond MAX_SET_DOCUMENTS a set is not a set; it is a report, and should be built as a job. */
const MAX_DOCUMENTS = MAX_SET_DOCUMENTS;

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

  const { data: shipment } = await client
    .from('shipments')
    .select('id, reference, revision')
    .eq('id', id)
    .maybeSingle();
  if (!shipment) return new NextResponse('Not found', { status: 404 });

  const [{ data: documents }, { data: now }] = await Promise.all([
    client
      .from('documents')
      .select('id, org_id, kind, number, status, shipment_revision, snapshot, created_at')
      .eq('shipment_id', id)
      .eq('status', 'final')
      .order('kind'),
    // What the shipment would produce now. A document whose parties or issuer details have
    // changed since is stale even though the shipment revision has not moved. Without this
    // (an older database) the revision alone decides, as it always did.
    client.rpc('preview_document', { target_shipment: id, document_kind: 'commercial_invoice' }),
  ]);

  const finals = documents ?? [];
  const freshness = new Map(
    finals.map((document) => [
      document.id,
      freshnessOf(document, shipment.revision, now ?? undefined),
    ]),
  );
  const current = finals.filter((document) => !freshness.get(document.id)?.stale);
  const excluded = finals.filter((document) => freshness.get(document.id)?.stale);
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
    `Renderer: ${RENDERER_VERSION}`,
    '',
    'Each line in the next block is the SHA-256 of a file as it appears in this archive. Re-render',
    'a document from TradeDocs at any time and it produces these same bytes, because a',
    'document is rendered from the snapshot it was generated with and never from the',
    'live shipment.',
    '',
  ];

  const schemas = new Set<number>();
  // Kept apart from the checksum lines so the manifest still works with `sha256sum -c`.
  const details: string[] = [];
  for (const document of current) {
    // An issued document is drawn with the branding images it recorded, or not at all.
    let images: BrandingImages | undefined;
    if (needsBranding(document.snapshot)) {
      const loaded = await loadBrandingImages(client, document.org_id, document.snapshot);
      if (!loaded) {
        manifest.push(
          `SKIPPED  ${document.number}  (${documentKindLabel(document.kind)}) — its logo or signature image could not be loaded; try again`,
        );
        continue;
      }
      images = loaded;
    }
    let pdf: Uint8Array;
    try {
      pdf = renderTradeDocument(document.snapshot, undefined, images);
    } catch {
      // One unrenderable snapshot is a defect in that document, not grounds to deny the
      // operator the rest of a set they are probably about to send.
      manifest.push(
        `SKIPPED  ${document.number}  (${documentKindLabel(document.kind)}) — could not be rendered`,
      );
      continue;
    }

    const name = `${safeFileName(document.number)}-${safeFileName(document.kind)}.pdf`;
    entries.push({ name, data: pdf, modified: new Date(document.created_at) });
    const digest = createHash('sha256').update(pdf).digest('hex');
    manifest.push(`${digest}  ${name}`);
    details.push(
      `${document.number}  ${documentKindLabel(document.kind)} · shipment revision ${document.shipment_revision} · generated ${new Date(document.created_at).toISOString()}`,
    );
    // The certificate of origin's required label travels with it into the archive's metadata.
    if (isRegulatedDocumentKind(document.kind)) details.push(`  ${COO_TEMPLATE_LABEL}`);
    schemas.add(schemaVersionOf(document.snapshot));
  }

  if (entries.length === 0) {
    return new NextResponse('None of the documents in this set could be rendered.', {
      status: 500,
    });
  }

  const versions = [...schemas].sort((left, right) => left - right).join(', ');
  manifest.push('', `Snapshot schema versions: ${versions}`, '', 'Documents:', ...details);
  if (excluded.length > 0) {
    manifest.push(
      '',
      'Left out because they no longer match the shipment (download them one at a time):',
      ...excluded.map(
        (document) =>
          `${document.number}  ${documentKindLabel(document.kind)} · ${freshness.get(document.id)?.reason ?? 'Out of date.'}`,
      ),
    );
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
