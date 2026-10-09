import { afterEach, expect, it, vi } from 'vitest';
import { GET as health } from '@/app/api/health/route';
import { GET as readiness } from '@/app/api/ready/route';
import { DEGRADED_RATE_LIMIT_REASON } from '@/lib/security/rate-limit';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it('liveness is minimal and uncached', async () => {
  const response = health();
  expect(response.status).toBe(200);
  expect(response.headers.get('cache-control')).toBe('no-store');
  expect(await response.json()).toEqual({ status: 'ok' });
});

it('unconfigured readiness fails without contacting a provider', async () => {
  vi.stubEnv('APP_ENV', 'test');
  vi.stubEnv('SUPABASE_URL', '');
  vi.stubEnv('SUPABASE_ANON_KEY', '');
  const fetcher = vi.fn();
  vi.stubGlobal('fetch', fetcher);
  const response = await readiness();
  expect(response.status).toBe(503);
  expect(await response.json()).toEqual({
    status: 'unavailable',
    rate_limiting: 'degraded',
    reason: DEGRADED_RATE_LIMIT_REASON,
  });
  expect(fetcher).not.toHaveBeenCalled();
});

it('configured readiness reflects the real auth dependency result without revealing its body', async () => {
  vi.stubEnv('APP_ENV', 'test');
  vi.stubEnv('APPLICATION_MODE', 'service');
  vi.stubEnv('SUPABASE_URL', 'http://127.0.0.1:54321');
  vi.stubEnv('SUPABASE_ANON_KEY', 'synthetic-public-test-key');
  vi.stubEnv('SUPABASE_PROJECT_REF', 'syntheticproject');
  vi.stubEnv('SUPABASE_ENVIRONMENT', 'test');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ internalVersion: 'private' })));
  const response = await readiness();
  expect(response.status).toBe(200);
  // No service-role key or quota secret here, so quotas are reported as degraded, and no API
  // key pepper, so the public API reports itself off (that feature alone).
  expect(await response.json()).toEqual({
    status: 'ready',
    rate_limiting: 'degraded',
    reason: DEGRADED_RATE_LIMIT_REASON,
    api: 'unavailable',
    api_reason: 'api_key_pepper_missing',
  });
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('outage')));
  expect((await readiness()).status).toBe(503);
});

it('readiness reports enforced quotas once the store and key are configured', async () => {
  vi.stubEnv('APP_ENV', 'test');
  vi.stubEnv('APPLICATION_MODE', 'service');
  vi.stubEnv('SUPABASE_URL', 'http://127.0.0.1:54321');
  vi.stubEnv('SUPABASE_ANON_KEY', 'synthetic-public-test-key');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'synthetic-service-test-key');
  vi.stubEnv('SUPABASE_PROJECT_REF', 'syntheticproject');
  vi.stubEnv('SUPABASE_ENVIRONMENT', 'test');
  vi.stubEnv('RATE_LIMIT_KEY_SECRET', 'synthetic-rate-test-key-more-than-32-characters');
  vi.stubEnv('API_KEY_PEPPER', 'synthetic-api-pepper-more-than-32-characters');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({})));
  expect(await (await readiness()).json()).toEqual({ status: 'ready', rate_limiting: 'enforced' });
});
