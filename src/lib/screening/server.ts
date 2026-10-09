import 'server-only';

import {
  ScreeningResponseError,
  cslHeaders,
  cslSearchRequest,
  parseCslSearch,
  type ScreeningAnswer,
  type ScreeningRequest,
} from '@/lib/screening/csl';

const TIMEOUT_MS = 8_000;
const MAX_RESPONSE_BYTES = 2_000_000;

export type ScreeningOutcome =
  | ({ status: 'ok' } & ScreeningAnswer)
  /** `rejected_key` means the subscription key was refused: an operator problem. */
  | { status: 'unavailable'; reason: 'rejected_key' | 'upstream' };

/**
 * One live search of the Consolidated Screening List.
 *
 * Never cached: a list can change between two searches and the answer concerns a named
 * party. The name is not logged; a failure is logged by status alone, and a refused key is
 * named as such so an operator can tell configuration from an outage.
 */
export async function screenName(
  request: ScreeningRequest,
  key: string,
  fetcher: typeof fetch = fetch,
): Promise<ScreeningOutcome> {
  let response: Response;
  try {
    response = await fetcher(cslSearchRequest(request), {
      headers: cslHeaders(key),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    const cause = error instanceof Error && error.name === 'TimeoutError' ? 'timeout' : 'network';
    console.warn(`denied-party: CSL unavailable (${cause})`);
    return { status: 'unavailable', reason: 'upstream' };
  }
  if (response.status === 401 || response.status === 403) {
    console.error(`denied-party: CSL refused the subscription key (${response.status})`);
    return { status: 'unavailable', reason: 'rejected_key' };
  }
  if (!response.ok) {
    console.warn(`denied-party: CSL unavailable (${response.status})`);
    return { status: 'unavailable', reason: 'upstream' };
  }
  try {
    const text = await response.text();
    if (text.length > MAX_RESPONSE_BYTES) throw new ScreeningResponseError();
    return { status: 'ok', ...parseCslSearch(JSON.parse(text) as unknown) };
  } catch {
    console.warn('denied-party: CSL unavailable (unexpected_shape)');
    return { status: 'unavailable', reason: 'upstream' };
  }
}
