import { z } from 'zod';
import {
  ApiError,
  NOT_FOUND_DOCUMENT,
  RpcFailure,
  apiErrorResponse,
  authenticateApiRequest,
  callRpc,
  principalHeaders,
  rpcErrorToApi,
} from '@/lib/api/server';
import { idSchema } from '@/lib/api/schemas';
import { loadBrandingImages, needsBranding } from '@/lib/branding/server';
import { renderTradeDocument, type BrandingImages } from '@/lib/pdf/trade-document';
import { createServiceClient } from '@/lib/supabase/admin';
import { safeFileName } from '@/lib/zip';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const document = z.union([
  z.null(),
  z.looseObject({ id: z.string(), org_id: z.string(), number: z.string(), snapshot: z.unknown() }),
]);

/**
 * A document of the key's organization as a PDF, streamed in the response: the same
 * renderer and the same rule as /api/documents/[id] (an issued document is reproduced as
 * issued, branding images included, or not at all). Another organization's is a 404.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const route = 'GET /api/v1/documents/:id/pdf';
  try {
    const principal = await authenticateApiRequest(request);
    const id = idSchema.safeParse((await params).id);
    if (!id.success) throw NOT_FOUND_DOCUMENT;
    let data: unknown;
    try {
      data = await callRpc(principal.config, 'api_get_document', {
        p_key_hash: principal.keyHash,
        p_document: id.data,
      });
    } catch (error) {
      if (error instanceof RpcFailure) throw rpcErrorToApi(error.failure);
      throw error;
    }
    const parsed = document.safeParse(data);
    if (!parsed.success) throw new Error('Unexpected document.');
    // The routine scopes to the key's organization; this only restates it.
    if (parsed.data === null || parsed.data.org_id !== principal.orgId) throw NOT_FOUND_DOCUMENT;
    const found = parsed.data;

    let images: BrandingImages | undefined;
    if (needsBranding(found.snapshot)) {
      // The service role reads the private bucket; loadBrandingImages only accepts objects
      // named under this organization's own path and matching the recorded hashes.
      const loaded = await loadBrandingImages(createServiceClient(), found.org_id, found.snapshot);
      if (!loaded) {
        throw new ApiError(
          503,
          'BRANDING_UNAVAILABLE',
          'This document’s logo or signature image could not be loaded. Try again shortly.',
          undefined,
          { 'Retry-After': '30' },
        );
      }
      images = loaded;
    }

    let pdf: Uint8Array;
    try {
      pdf = renderTradeDocument(found.snapshot, undefined, images);
    } catch {
      console.error('api: document could not be rendered', { route });
      throw new ApiError(500, 'RENDER_FAILED', 'This document could not be rendered.');
    }

    return new Response(pdf as BodyInit, {
      headers: {
        ...Object.fromEntries(new Headers(principalHeaders(principal))),
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFileName(found.number)}.pdf"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return apiErrorResponse(error, route);
  }
}
