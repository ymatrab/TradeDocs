import 'server-only';

import {
  TariffResponseError,
  UK_TARIFF_ACCEPT,
  parseUkDetail,
  parseUkSearch,
  parseUsSearch,
  ukDetailRequest,
  ukExactFallback,
  ukSearchPage,
  ukSearchRequest,
  usSearchPage,
  usSearchRequest,
  type TariffEntry,
  type TariffId,
  type TariffOutcome,
} from '@/lib/tariff/hs-lookup';

/**
 * Live lookups against the official tariffs, server-side only.
 *
 * Each call is bounded (a timeout, no redirects, a response size cap) and cached for a day,
 * as the UK Trade Tariff documentation asks of unauthenticated callers; the schedules
 * change at most daily. A failure of one publisher never hides the other's results: each
 * outcome is reported on its own, and an unavailable service is shown as exactly that.
 *
 * Nothing about the query is logged. A failure is logged by tariff and status only.
 */

const TIMEOUT_MS = 6_000;
const CACHE_SECONDS = 86_400;
const MAX_RESPONSE_BYTES = 3_000_000;
const USER_AGENT = 'TradeDocs-HS-code-lookup/1.0';

class UpstreamError extends Error {
  constructor(
    readonly tariff: TariffId,
    readonly status: number | 'timeout' | 'network' | 'too_large' | 'invalid_json',
  ) {
    super(`${tariff} tariff unavailable (${status}).`);
    this.name = 'UpstreamError';
  }
}

async function getJson(
  tariff: TariffId,
  url: URL,
  accept: string,
  fetcher: typeof fetch,
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetcher(url, {
      headers: { Accept: accept, 'User-Agent': USER_AGENT },
      redirect: 'error',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: CACHE_SECONDS },
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    throw new UpstreamError(tariff, timedOut ? 'timeout' : 'network');
  }
  if (!response.ok) throw new UpstreamError(tariff, response.status);
  const declared = Number(response.headers.get('content-length') ?? '0');
  if (declared > MAX_RESPONSE_BYTES) throw new UpstreamError(tariff, 'too_large');
  const text = await response.text();
  if (text.length > MAX_RESPONSE_BYTES) throw new UpstreamError(tariff, 'too_large');
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new UpstreamError(tariff, 'invalid_json');
  }
}

function report(error: unknown, tariff: TariffId): void {
  // Operators need the cause; the query stays out of the log.
  const cause =
    error instanceof UpstreamError
      ? String(error.status)
      : error instanceof TariffResponseError
        ? 'unexpected_shape'
        : 'error';
  console.warn(`hs-lookup: ${tariff} tariff unavailable (${cause})`);
}

export async function lookupUs(
  query: string,
  fetcher: typeof fetch = fetch,
): Promise<TariffOutcome> {
  const searchUrl = usSearchPage(query);
  try {
    const data = await getJson('us', usSearchRequest(query), 'application/json', fetcher);
    return { status: 'ok', results: parseUsSearch(data), searchUrl };
  } catch (error) {
    report(error, 'us');
    return { status: 'unavailable', searchUrl };
  }
}

export async function lookupUk(
  query: string,
  fetcher: typeof fetch = fetch,
): Promise<TariffOutcome> {
  const searchUrl = ukSearchPage(query);
  try {
    const found = parseUkSearch(
      await getJson('uk', ukSearchRequest(query), UK_TARIFF_ACCEPT, fetcher),
    );
    if (found.kind === 'results') {
      return { status: 'ok', results: found.results, searchUrl };
    }
    // An exact code: one more bounded read for the line's own description.
    let entry: TariffEntry;
    try {
      const detail = await getJson(
        'uk',
        ukDetailRequest(found.endpoint, found.id),
        UK_TARIFF_ACCEPT,
        fetcher,
      );
      entry = parseUkDetail(found.endpoint, found.id, detail);
    } catch (error) {
      report(error, 'uk');
      entry = ukExactFallback(found.endpoint, found.id);
    }
    return { status: 'ok', results: [entry], searchUrl };
  } catch (error) {
    report(error, 'uk');
    return { status: 'unavailable', searchUrl };
  }
}

export async function lookupTariffs(
  query: string,
  fetcher: typeof fetch = fetch,
): Promise<Record<TariffId, TariffOutcome>> {
  const [us, uk] = await Promise.all([lookupUs(query, fetcher), lookupUk(query, fetcher)]);
  return { us, uk };
}
