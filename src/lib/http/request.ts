import 'server-only';

import type { z } from 'zod';
import { getServerEnv } from '@/lib/config/server';

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    readonly publicMessage: string,
    readonly headers?: HeadersInit,
  ) {
    super(code);
    this.name = 'HttpError';
  }
}

/** Browser cookie mutations must present the configured canonical Origin. */
export function assertSameOrigin(request: Request, expectedOrigin?: string): void {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method.toUpperCase())) return;
  const canonical = expectedOrigin ?? getServerEnv().APP_URL;
  if (!canonical)
    throw new HttpError(503, 'SERVICE_UNAVAILABLE', 'This service is not configured.');
  const origin = request.headers.get('origin');
  const site = request.headers.get('sec-fetch-site');
  try {
    if (
      !origin ||
      origin === 'null' ||
      origin !== new URL(origin).origin ||
      new URL(origin).origin !== new URL(canonical).origin ||
      (site && site !== 'same-origin' && site !== 'none')
    ) {
      throw new Error('origin_mismatch');
    }
  } catch {
    throw new HttpError(403, 'INVALID_ORIGIN', 'This request could not be verified.');
  }
}

/** Stream limit applies even when Content-Length is absent or intentionally false. */
export async function readJsonBody<T extends z.ZodType>(
  request: Request,
  schema: T,
  maxBytes = 32_768,
): Promise<z.output<T>> {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1 || maxBytes > 1_048_576) {
    throw new Error('Invalid JSON body limit.');
  }
  const contentType = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase();
  if (contentType !== 'application/json') {
    throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Use application/json.');
  }
  const contentEncoding = request.headers.get('content-encoding');
  if (contentEncoding && contentEncoding.toLowerCase() !== 'identity') {
    throw new HttpError(
      415,
      'UNSUPPORTED_ENCODING',
      'Compressed request bodies are not supported.',
    );
  }
  const declaredSize = request.headers.get('content-length');
  if (declaredSize && (!/^\d+$/.test(declaredSize) || Number(declaredSize) > maxBytes)) {
    throw new HttpError(413, 'BODY_TOO_LARGE', 'The request is too large.');
  }
  if (!request.body) throw new HttpError(400, 'INVALID_JSON', 'Provide a JSON request body.');

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    void reader.cancel().catch(() => undefined);
  }, 5_000);
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) {
        break;
      }
      size += chunk.value.byteLength;
      if (size > maxBytes) {
        void reader.cancel().catch(() => undefined);
        throw new HttpError(413, 'BODY_TOO_LARGE', 'The request is too large.');
      }
      chunks.push(chunk.value);
    }
  } finally {
    clearTimeout(timeout);
    reader.releaseLock();
  }
  if (timedOut) throw new HttpError(408, 'REQUEST_TIMEOUT', 'The request timed out.');
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw new HttpError(400, 'INVALID_JSON', 'Provide valid JSON.');
  }
  const result = schema.safeParse(parsed);
  if (!result.success)
    throw new HttpError(422, 'VALIDATION_FAILED', 'Check the submitted fields and try again.');
  return result.data;
}

export function errorResponse(error: unknown): Response {
  if (error instanceof HttpError) {
    return Response.json(
      { error: { code: error.code, message: error.publicMessage } },
      {
        status: error.status,
        headers: { 'Cache-Control': 'no-store', ...Object.fromEntries(new Headers(error.headers)) },
      },
    );
  }
  return Response.json(
    {
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'This service is temporarily unavailable. Please try again.',
      },
    },
    { status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '30' } },
  );
}
