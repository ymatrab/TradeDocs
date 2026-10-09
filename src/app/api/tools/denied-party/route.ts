import { NextResponse, type NextRequest } from 'next/server';
import { getServerEnv } from '@/lib/config/server';
import { HttpError, readJsonBody } from '@/lib/http/request';
import { SCREENING_QUOTA } from '@/lib/limits';
import { cslApiKey } from '@/lib/screening/config';
import { screeningRequestSchema, type ScreeningRequest } from '@/lib/screening/csl';
import { screenName } from '@/lib/screening/server';
import { limitPublicRequest, type RateLimitPolicy } from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Screens one name against the trade.gov Consolidated Screening List (D-025).
 *
 * A POST so the name never sits in a URL, a referrer or an access log. Nothing is stored:
 * the name goes to the CSL API and the matches come back to the visitor, and the response
 * is marked uncacheable. Without CSL_API_KEY the endpoint answers 503 "not configured" and
 * the page offers the official search instead.
 */
const MAX_BODY_BYTES = 2_048;
const POLICY: RateLimitPolicy = { namespace: 'tools:denied-party', ...SCREENING_QUOTA };

function refuse(message: string, status: number, code: string, headers?: HeadersInit) {
  const merged = new Headers(headers);
  merged.set('Cache-Control', 'no-store');
  return NextResponse.json({ error: message, code }, { status, headers: merged });
}

export async function POST(request: NextRequest) {
  const key = cslApiKey();
  if (!key) {
    return refuse('Screening is not available on this deployment yet.', 503, 'not_configured');
  }

  try {
    await limitPublicRequest(request, POLICY, getServerEnv());
  } catch (error) {
    if (error instanceof HttpError) {
      return refuse(error.publicMessage, error.status, error.code, error.headers);
    }
    return refuse('This tool is temporarily unavailable.', 503, 'unavailable', {
      'Retry-After': '30',
    });
  }

  let input: ScreeningRequest;
  try {
    input = await readJsonBody(request, screeningRequestSchema, MAX_BODY_BYTES);
  } catch (error) {
    if (error instanceof HttpError && error.status === 413) {
      return refuse('That request is too large.', 413, 'too_large');
    }
    if (error instanceof HttpError && error.status === 415) {
      return refuse('Send the search as JSON.', 415, 'unsupported');
    }
    return refuse('Enter a name of 2 to 100 characters.', 400, 'invalid');
  }

  const outcome = await screenName(input, key);
  if (outcome.status === 'unavailable') {
    return refuse(
      'The Consolidated Screening List did not answer. Try again shortly, or use the official search.',
      503,
      outcome.reason === 'rejected_key' ? 'unavailable' : 'upstream',
      { 'Retry-After': '30' },
    );
  }
  return NextResponse.json(
    { total: outcome.total, results: outcome.results },
    { headers: { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } },
  );
}
