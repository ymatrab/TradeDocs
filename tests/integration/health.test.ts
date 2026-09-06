import { afterEach, expect, it, vi } from 'vitest';
import { GET as health } from '@/app/api/health/route';
import { GET as readiness } from '@/app/api/ready/route';

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
  expect(await response.json()).toEqual({ status: 'unavailable' });
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
  expect(await response.json()).toEqual({ status: 'ready' });
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('outage')));
  expect((await readiness()).status).toBe(503);
});
