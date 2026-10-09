import { NextResponse, type NextRequest } from 'next/server';
import { getServerEnv } from '@/lib/config/server';
import { HttpError } from '@/lib/http/request';
import { HS_LOOKUP_QUOTA } from '@/lib/limits';
import { limitPublicRequest, type RateLimitPolicy } from '@/lib/security/rate-limit';
import { hsQuerySchema } from '@/lib/tariff/hs-lookup';
import { lookupTariffs } from '@/lib/tariff/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Searches the US and UK tariffs for a code or a description of goods.
 *
 * A lookup, never a classification: the response carries codes, descriptions and links to
 * the publishers' own pages, and no duty rate (D-019, D-025). The query is a description of
 * goods, not personal data, but it is still neither stored nor logged.
 *
 * Bounded by the query schema, the per-address quota (where the deployment enforces quotas)
 * and the upstream timeouts in lib/tariff/server.
 */
const POLICY: RateLimitPolicy = { namespace: 'tools:hs-lookup', ...HS_LOOKUP_QUOTA };

function refuse(message: string, status: number, headers?: HeadersInit) {
  const merged = new Headers(headers);
  merged.set('Cache-Control', 'no-store');
  return NextResponse.json({ error: message }, { status, headers: merged });
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('q') ?? '';
  const parsed = hsQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return refuse(parsed.error.issues[0]?.message ?? 'Check the search.', 400);
  }

  try {
    await limitPublicRequest(request, POLICY, getServerEnv());
  } catch (error) {
    if (error instanceof HttpError) return refuse(error.publicMessage, error.status, error.headers);
    return refuse('This tool is temporarily unavailable.', 503, { 'Retry-After': '30' });
  }

  const outcome = await lookupTariffs(parsed.data);
  const complete = outcome.us.status === 'ok' && outcome.uk.status === 'ok';
  return NextResponse.json(
    { query: parsed.data, ...outcome },
    {
      headers: {
        // A complete answer is the same for everyone and the tariffs change daily; a partial
        // one is not cached, so a recovered service shows on the next search.
        'Cache-Control': complete ? 'public, max-age=300, s-maxage=3600' : 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  );
}
