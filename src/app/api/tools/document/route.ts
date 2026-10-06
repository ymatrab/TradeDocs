import { NextResponse, type NextRequest } from 'next/server';
import { getServerEnv } from '@/lib/config/server';
import { HttpError, readJsonBody } from '@/lib/http/request';
import { renderTradeDocument } from '@/lib/pdf/trade-document';
import { limitPublicRequest, type RateLimitPolicy } from '@/lib/security/rate-limit';
import {
  buildToolSnapshot,
  toolRequestSchema,
  type ToolRequest,
} from '@/lib/tools/document-snapshot';
import { safeFileName } from '@/lib/zip';
import { TOOL_DOCUMENT_QUOTA } from '@/lib/limits';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Renders a one-off document for a visitor who has no account.
 *
 * Nothing is stored. The submission is turned into a snapshot, rendered, and returned;
 * when the response ends there is no record of the shipment, the parties or the prices,
 * which is what lets the page promise exactly that.
 *
 * Abuse control is two layers. The bounds below cap the work any one request can ask for.
 * Where the deployment has a database, a per-address quota caps how many requests arrive;
 * where it has none, quotas are reported as degraded by /api/ready and the bounds stand
 * alone, because a per-instance counter would only pretend to limit anything.
 */
const MAX_BODY_BYTES = 64 * 1024;

const POLICY: RateLimitPolicy = { namespace: 'tools:document', ...TOOL_DOCUMENT_QUOTA };

/** The generator reads `{ error: string }`; keep that shape for every refusal. */
function refuse(message: string, status: number, headers?: HeadersInit) {
  const merged = new Headers(headers);
  merged.set('Cache-Control', 'no-store');
  return NextResponse.json({ error: message }, { status, headers: merged });
}

const TOO_LARGE = 'That document is too large for this tool.';

export async function POST(request: NextRequest) {
  // Refused before a single byte is read: a declared size over the cap, or one that is not
  // a number, is not worth buffering. The stream is still bounded below for a size that lies.
  const declared = request.headers.get('content-length');
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > MAX_BODY_BYTES)) {
    return refuse(TOO_LARGE, 413);
  }

  try {
    await limitPublicRequest(request, POLICY, getServerEnv());
  } catch (error) {
    if (error instanceof HttpError) return refuse(error.publicMessage, error.status, error.headers);
    return refuse('This tool is temporarily unavailable.', 503, { 'Retry-After': '30' });
  }

  let input: ToolRequest;
  try {
    input = await readJsonBody(request, toolRequestSchema, MAX_BODY_BYTES);
  } catch (error) {
    if (error instanceof HttpError) {
      if (error.status === 413) return refuse(TOO_LARGE, 413);
      if (error.status === 415) return refuse('Send the document as JSON.', 415);
      if (error.status === 422) {
        return refuse(
          'Check the document details. A number and at least one described line are needed, and any country or date must be valid.',
          400,
        );
      }
      if (error.status === 408) return refuse('That request took too long to arrive.', 408);
    }
    return refuse('That request could not be read.', 400);
  }

  let pdf: Uint8Array;
  try {
    pdf = renderTradeDocument(buildToolSnapshot(input));
  } catch {
    return refuse('That document could not be rendered.', 500);
  }

  return new NextResponse(pdf as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeFileName(input.number, 'document')}.pdf"`,
      // Never cached anywhere: the content is somebody's commercial terms.
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
