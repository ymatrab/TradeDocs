import { z } from 'zod';
import {
  ApiError,
  IDEMPOTENCY_CONFLICT,
  NOT_FOUND_SHIPMENT,
  RpcFailure,
  apiErrorResponse,
  apiJson,
  authenticateApiRequest,
  callRpc,
  principalHeaders,
  readApiBody,
  readIdempotencyKey,
  rpcErrorToApi,
} from '@/lib/api/server';
import {
  generateDocumentSchema,
  idSchema,
  issuesOf,
  pageOf,
  readPageQuery,
  requestFingerprint,
} from '@/lib/api/schemas';
import { regulatedDocumentsEnabled } from '@/lib/config/server';
import { isRegulatedDocumentKind, REGULATED_DOCUMENT_LIMITATION } from '@/lib/trade/regulated';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const rows = z.union([
  z.null(),
  z.array(z.looseObject({ id: z.string(), created_at: z.string() })),
]);
const generated = z.union([
  z.null(),
  z.object({ conflict: z.literal(true) }),
  z.object({
    status: z.union([z.literal(200), z.literal(201)]),
    body: z.looseObject({ id: z.string() }),
    replayed: z.boolean().optional(),
  }),
]);

type Context = { params: Promise<{ id: string }> };

/** A shipment's documents, newest first, every status (final, superseded, void). */
export async function GET(request: Request, { params }: Context): Promise<Response> {
  try {
    const principal = await authenticateApiRequest(request);
    const id = idSchema.safeParse((await params).id);
    if (!id.success) throw NOT_FOUND_SHIPMENT;
    const page = readPageQuery(new URL(request.url).searchParams);
    if (!page) {
      throw new ApiError(
        400,
        'INVALID_QUERY',
        'Use limit between 1 and 100, and a cursor exactly as a previous page returned it.',
      );
    }
    let data: unknown;
    try {
      data = await callRpc(principal.config, 'api_list_documents', {
        p_key_hash: principal.keyHash,
        p_shipment: id.data,
        p_limit: page.limit,
        p_after_created: page.cursor?.created_at ?? null,
        p_after_id: page.cursor?.id ?? null,
      });
    } catch (error) {
      if (error instanceof RpcFailure) throw rpcErrorToApi(error.failure);
      throw error;
    }
    const parsed = rows.safeParse(data);
    if (!parsed.success) throw new Error('Unexpected document list.');
    if (parsed.data === null) throw NOT_FOUND_SHIPMENT;
    return apiJson(pageOf(parsed.data, page.limit), 200, principalHeaders(principal));
  } catch (error) {
    return apiErrorResponse(error, 'GET /api/v1/shipments/:id/documents');
  }
}

/**
 * Generates a document of one kind from the shipment as it stands, exactly as the app does:
 * the next number, a snapshot of this revision, the earlier final of the kind superseded,
 * and an audit entry. Retry-safe with an Idempotency-Key.
 */
export async function POST(request: Request, { params }: Context): Promise<Response> {
  const route = 'POST /api/v1/shipments/:id/documents';
  try {
    const principal = await authenticateApiRequest(request, { write: true });
    const id = idSchema.safeParse((await params).id);
    if (!id.success) throw NOT_FOUND_SHIPMENT;
    const idempotencyKey = readIdempotencyKey(request);
    const parsed = generateDocumentSchema.safeParse(await readApiBody(request, 4_096));
    if (!parsed.success) {
      throw new ApiError(
        422,
        'VALIDATION_FAILED',
        'Check the submitted fields and try again.',
        issuesOf(parsed.error),
      );
    }
    if (isRegulatedDocumentKind(parsed.data.kind)) {
      // The certificate of origin is accepted by the database only through its reviewed,
      // service-role path with the workspace's readiness checks
      // (20261009000200_certificate_of_origin.sql); the API never takes that path.
      throw new ApiError(
        403,
        'FEATURE_UNAVAILABLE',
        regulatedDocumentsEnabled()
          ? 'Certificates of origin are generated in the TradeDocs workspace, not through the API.'
          : REGULATED_DOCUMENT_LIMITATION,
      );
    }
    let data: unknown;
    try {
      data = await callRpc(principal.config, 'api_generate_document', {
        p_key_hash: principal.keyHash,
        p_idempotency_key: idempotencyKey,
        p_request_hash: requestFingerprint(`POST /api/v1/shipments/${id.data}/documents`, parsed.data),
        p_shipment: id.data,
        p_kind: parsed.data.kind,
      });
    } catch (error) {
      if (error instanceof RpcFailure) {
        if (error.failure.message.includes('at least one line item')) {
          throw new ApiError(
            422,
            'NO_LINES',
            'Add at least one line to the shipment before generating a document.',
          );
        }
        if (error.failure.message.includes('document type is not available')) {
          throw new ApiError(422, 'VALIDATION_FAILED', 'That document type is not available.');
        }
        throw rpcErrorToApi(error.failure);
      }
      throw error;
    }
    const result = generated.safeParse(data);
    if (!result.success) throw new Error('Unexpected generation response.');
    if (result.data === null) throw NOT_FOUND_SHIPMENT;
    if ('conflict' in result.data) throw IDEMPOTENCY_CONFLICT;
    return apiJson({ data: result.data.body }, result.data.status, {
      ...principalHeaders(principal),
      Location: `/api/v1/documents/${result.data.body.id}/pdf`,
      ...(result.data.replayed ? { 'Idempotent-Replayed': 'true' } : {}),
    });
  } catch (error) {
    return apiErrorResponse(error, route);
  }
}
