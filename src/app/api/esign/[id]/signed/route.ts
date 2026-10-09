import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { ESIGN_BUCKET, serviceConnection, serviceRpc } from '@/lib/esign/server';
import { createClient, DatabaseUnavailableError, type TradeDocsClient } from '@/lib/supabase/server';
import { safeFileName } from '@/lib/zip';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * The signed copy of a document, through a short-lived authorized link.
 *
 * The request row is read as the caller, so row level security decides: a member of another
 * organization gets 404. The signed URL is created as the caller too (the esign-signed
 * bucket's select policy: members of the organization in the path), lives 60 seconds, and
 * is never cached or sent on as a referrer. Every download is audited; if the audit cannot
 * be written the download is refused.
 */

const LINK_SECONDS = 60;

function refuse(status: number, message: string, headers?: Record<string, string>) {
  return NextResponse.json(
    { error: message },
    { status, headers: { 'Cache-Control': 'no-store', ...headers } },
  );
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return refuse(404, 'Not found.');

  let client: TradeDocsClient;
  try {
    client = await createClient();
  } catch (error) {
    if (error instanceof DatabaseUnavailableError) {
      return refuse(503, 'Signed documents are not available on this deployment.', {
        'Retry-After': '300',
      });
    }
    throw error;
  }

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return refuse(401, 'Sign in to download this document.');

  const { data: request } = await client
    .from('esign_requests')
    .select('id, document_number, signed_object_path')
    .eq('id', id)
    .maybeSingle();
  if (!request) return refuse(404, 'Not found.');
  if (!request.signed_object_path) {
    return refuse(409, 'The signed copy is not ready yet.', { 'Retry-After': '60' });
  }

  const connection = serviceConnection();
  if (!connection) return refuse(503, 'Signed documents are not available.', { 'Retry-After': '300' });
  try {
    await serviceRpc(connection, 'esign_record_download', { p_request: request.id, p_actor: user.id });
  } catch {
    console.error('esign: download not audited', { request: request.id });
    return refuse(503, 'Try again in a moment.', { 'Retry-After': '30' });
  }

  const { data: link, error } = await client.storage
    .from(ESIGN_BUCKET)
    .createSignedUrl(request.signed_object_path, LINK_SECONDS, {
      download: `${safeFileName(request.document_number)}-signed.pdf`,
    });
  if (error || !link?.signedUrl) {
    console.error('esign: signed link not created', { request: request.id });
    return refuse(503, 'The signed copy could not be opened. Try again in a moment.', {
      'Retry-After': '30',
    });
  }

  return NextResponse.redirect(link.signedUrl, {
    status: 303,
    headers: { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer' },
  });
}
