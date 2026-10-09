/**
 * Talking to the providers with fetch alone: OAuth token calls, revocation and bounded reads
 * of their APIs. The fetch function is injected so every call is tested without the network.
 *
 * Every request has a timeout, refuses redirects and never sends a token anywhere but the
 * fixed provider hosts in providers.ts. Errors carry the provider's own explanation, trimmed,
 * for the owner or administrator who triggered them; they never carry a token.
 */

export type Fetcher = typeof fetch;

/** Largest provider response read, in bytes. Xero's Items list is not paged. */
export const MAX_RESPONSE_BYTES = 5_000_000;
const TIMEOUT_MS = 15_000;

export type ProviderErrorCode =
  | 'unauthorized'
  | 'forbidden'
  | 'rate_limited'
  | 'invalid_grant'
  | 'too_large'
  | 'unreadable'
  | 'unavailable';

export class ProviderError extends Error {
  constructor(
    readonly code: ProviderErrorCode,
    /** What the provider said, trimmed, never containing a token. */
    readonly detail: string | null = null,
    readonly status: number | null = null,
  ) {
    super(`Provider request failed: ${code}${status ? ` (HTTP ${status})` : ''}.`);
    this.name = 'ProviderError';
  }
}

/** Reads at most `limit` bytes of a body; more is an error, never a silent cut. */
export async function readBounded(response: Response, limit = MAX_RESPONSE_BYTES): Promise<string> {
  const declared = Number(response.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > limit) {
    void response.body?.cancel().catch(() => undefined);
    throw new ProviderError('too_large', null, response.status);
  }
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      void reader.cancel().catch(() => undefined);
      throw new ProviderError('too_large', null, response.status);
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

/** A short, token-free summary of a provider error body, for the admin who sees it. */
export function errorDetail(body: string): string | null {
  let message: string | null = null;
  try {
    const parsed: unknown = JSON.parse(body);
    if (typeof parsed === 'object' && parsed !== null) {
      const p = parsed as Record<string, unknown>;
      const fault = p.Fault as { Error?: { Message?: unknown; Detail?: unknown }[] } | undefined;
      const first = fault?.Error?.[0];
      message =
        [p.error, p.error_description, p.Title, p.Message, p.Detail, first?.Message, first?.Detail]
          .filter((part): part is string => typeof part === 'string' && part.length > 0)
          .join(': ') || null;
    }
  } catch {
    message = body.trim() || null;
  }
  if (!message) return null;
  // Defence in depth: nothing that looks like a bearer token or JWT survives.
  return message
    .replace(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[redacted]')
    .replace(/[A-Za-z0-9_-]{40,}/g, '[redacted]')
    .slice(0, 300);
}

export async function request(
  fetcher: Fetcher,
  url: string,
  init: RequestInit,
): Promise<{ status: number; body: string; headers: Headers }> {
  let response: Response;
  try {
    response = await fetcher(url, {
      ...init,
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new ProviderError('unavailable');
  }
  const body = await readBounded(response);
  return { status: response.status, body, headers: response.headers };
}

export function failFor(status: number, body: string): ProviderError {
  const detail = errorDetail(body);
  if (status === 401) return new ProviderError('unauthorized', detail, status);
  if (status === 403) return new ProviderError('forbidden', detail, status);
  if (status === 429) return new ProviderError('rate_limited', detail, status);
  if (status === 400 && /invalid_grant/.test(body)) {
    return new ProviderError('invalid_grant', detail, status);
  }
  return new ProviderError('unavailable', detail, status);
}

export function parseJson(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    throw new ProviderError('unreadable');
  }
}

export function basicAuth(clientId: string, clientSecret: string): string {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64')}`;
}
