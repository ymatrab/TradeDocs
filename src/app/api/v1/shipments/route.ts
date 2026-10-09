import { z } from 'zod';
import {
  ApiError,
  IDEMPOTENCY_CONFLICT,
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
  createShipmentSchema,
  issuesOf,
  pageOf,
  readPageQuery,
  requestFingerprint,
} from '@/lib/api/schemas';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ROUTE = 'GET /api/v1/shipments';
const rows = z.array(z.looseObject({ id: z.string(), created_at: z.string() }));
const created = z.union([
  z.object({ conflict: z.literal(true) }),
  z.object({
    status: z.union([z.literal(200), z.literal(201)]),
    body: z.looseObject({ id: z.string() }),
    replayed: z.boolean().optional(),
  }),
]);

/** The shipments of the key's organization, newest first, a page at a time. */
export async function GET(request: Request): Promise<Response> {
  try {
    const principal = await authenticateApiRequest(request);
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
      data = await callRpc(principal.config, 'api_list_shipments', {
        p_key_hash: principal.keyHash,
        p_limit: page.limit,
        p_after_created: page.cursor?.created_at ?? null,
        p_after_id: page.cursor?.id ?? null,
      });
    } catch (error) {
      if (error instanceof RpcFailure) throw rpcErrorToApi(error.failure);
      throw error;
    }
    const parsed = rows.safeParse(data);
    if (!parsed.success) throw new Error('Unexpected shipment list.');
    return apiJson(pageOf(parsed.data, page.limit), 200, principalHeaders(principal));
  } catch (error) {
    return apiErrorResponse(error, ROUTE);
  }
}

/**
 * Creates a shipment, optionally with its lines, in the key's organization. Retry-safe with
 * an Idempotency-Key: the same key and body answer the first response again (200, with
 * Idempotent-Replayed: true); the same key with another body is a 409.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const principal = await authenticateApiRequest(request, { write: true });
    const idempotencyKey = readIdempotencyKey(request);
    const parsed = createShipmentSchema.safeParse(await readApiBody(request, 262_144));
    if (!parsed.success) {
      throw new ApiError(
        422,
        'VALIDATION_FAILED',
        'Check the submitted fields and try again.',
        issuesOf(parsed.error),
      );
    }
    const { items, ...shipment } = parsed.data;
    let data: unknown;
    try {
      data = await callRpc(principal.config, 'api_create_shipment', {
        p_key_hash: principal.keyHash,
        p_idempotency_key: idempotencyKey,
        p_request_hash: requestFingerprint('POST /api/v1/shipments', parsed.data),
        p_shipment: shipment,
        p_items: items,
      });
    } catch (error) {
      if (error instanceof RpcFailure) throw rpcErrorToApi(error.failure);
      throw error;
    }
    const result = created.safeParse(data);
    if (!result.success) throw new Error('Unexpected shipment creation response.');
    if ('conflict' in result.data) throw IDEMPOTENCY_CONFLICT;
    return apiJson({ data: result.data.body }, result.data.status, {
      ...principalHeaders(principal),
      Location: `/api/v1/shipments/${result.data.body.id}`,
      ...(result.data.replayed ? { 'Idempotent-Replayed': 'true' } : {}),
    });
  } catch (error) {
    return apiErrorResponse(error, 'POST /api/v1/shipments');
  }
}
