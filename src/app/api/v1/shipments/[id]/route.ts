import { z } from 'zod';
import {
  NOT_FOUND_SHIPMENT,
  RpcFailure,
  apiErrorResponse,
  apiJson,
  authenticateApiRequest,
  callRpc,
  principalHeaders,
  rpcErrorToApi,
} from '@/lib/api/server';
import { idSchema } from '@/lib/api/schemas';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const shipment = z.union([z.null(), z.looseObject({ id: z.string() })]);

/** One shipment of the key's organization, with its lines. Another organization's is a 404. */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const principal = await authenticateApiRequest(request);
    const id = idSchema.safeParse((await params).id);
    if (!id.success) throw NOT_FOUND_SHIPMENT;
    let data: unknown;
    try {
      data = await callRpc(principal.config, 'api_get_shipment', {
        p_key_hash: principal.keyHash,
        p_shipment: id.data,
      });
    } catch (error) {
      if (error instanceof RpcFailure) throw rpcErrorToApi(error.failure);
      throw error;
    }
    const parsed = shipment.safeParse(data);
    if (!parsed.success) throw new Error('Unexpected shipment.');
    if (parsed.data === null) throw NOT_FOUND_SHIPMENT;
    return apiJson({ data: parsed.data }, 200, principalHeaders(principal));
  } catch (error) {
    return apiErrorResponse(error, 'GET /api/v1/shipments/:id');
  }
}
