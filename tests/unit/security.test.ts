import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { safeReturnPath } from '@/lib/security/redirect';
import { redact } from '@/lib/security/redact';
import { assertSameOrigin, readJsonBody } from '@/lib/http/request';
import { enforceRateLimit } from '@/lib/security/rate-limit';

describe('security boundaries', () => {
  it.each([
    'https://attacker.invalid',
    '//attacker.invalid',
    '/%2f%2fattacker.invalid',
    '/\\attacker.invalid',
    '/%0aunsafe',
  ])('rejects ambiguous redirect %s', (path) => {
    expect(safeReturnPath(path)).toBe('/dashboard');
  });

  it('preserves a same-origin path and query', () => {
    expect(safeReturnPath('/shipments?page=2')).toBe('/shipments?page=2');
  });

  it('redacts nested identities, credentials and error messages', () => {
    expect(
      redact({
        email: 'person@example.invalid',
        nested: { token: 'private' },
        error: new Error('private detail'),
      }),
    ).toEqual({
      email: '[REDACTED]',
      nested: { token: '[REDACTED]' },
      error: { name: 'Error', message: '[REDACTED]' },
    });
  });

  it('rejects foreign and missing origin on a cookie-authenticated write', () => {
    const foreign = new Request('https://app.example.com/api', {
      method: 'POST',
      headers: { origin: 'https://other.example.com' },
    });
    expect(() => assertSameOrigin(foreign, 'https://app.example.com')).toThrow();
    expect(() =>
      assertSameOrigin(new Request(foreign.url, { method: 'POST' }), 'https://app.example.com'),
    ).toThrow();
  });

  it('bounds streamed request bytes even without a declared content length', async () => {
    const request = new Request('https://app.example.com/api', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ value: 'x'.repeat(100) }),
    });
    await expect(readJsonBody(request, z.object({ value: z.string() }), 40)).rejects.toMatchObject({
      status: 413,
    });
  });

  it('fails closed when the distributed quota provider is unavailable', async () => {
    const provider = {
      consume: async () => {
        throw new Error('outage');
      },
    };
    await expect(
      enforceRateLimit(provider, 'a'.repeat(64), {
        namespace: 'test',
        limit: 10,
        windowSeconds: 60,
      }),
    ).rejects.toMatchObject({ status: 503 });
  });

  it('preserves a usable retry time on exhausted quotas', async () => {
    const provider = {
      consume: async () => ({ allowed: false, remaining: 0, retryAfterSeconds: 17 }),
    };
    await expect(
      enforceRateLimit(provider, 'a'.repeat(64), {
        namespace: 'test',
        limit: 10,
        windowSeconds: 60,
      }),
    ).rejects.toMatchObject({ status: 429, headers: { 'Retry-After': '17' } });
  });
});
