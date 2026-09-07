import { afterEach, expect, it, vi } from 'vitest';
import { getServerEnv } from '@/lib/config/server';

afterEach(() => {
  vi.unstubAllEnvs();
});

it('resolves a deployment that supplies only the platform environment', () => {
  // A Vercel project need not set APP_ENV: VERCEL_ENV is the platform-owned identity. The
  // request path must agree with the build, which already trusted it.
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('APP_ENV', '');
  vi.stubEnv('APP_URL', '');
  vi.stubEnv('VERCEL_ENV', 'production');
  expect(getServerEnv().APP_ENV).toBe('production');
});

it('resolves a preview deployment the same way', () => {
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('APP_ENV', '');
  vi.stubEnv('APP_URL', '');
  vi.stubEnv('VERCEL_ENV', 'preview');
  expect(getServerEnv().APP_ENV).toBe('preview');
});

it('still treats a local process as local', () => {
  vi.stubEnv('NODE_ENV', 'development');
  vi.stubEnv('APP_ENV', '');
  expect(getServerEnv().APP_ENV).toBe('local');
});

it('refuses a deployed environment whose canonical origin is not HTTPS', () => {
  // Worth pinning: a project that carries APP_URL over from local development fails every
  // request once the environment resolves as deployed, and the message names the field.
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('APP_ENV', '');
  vi.stubEnv('VERCEL_ENV', 'production');
  vi.stubEnv('APP_URL', 'http://tradedocs.example');
  expect(() => getServerEnv()).toThrow(/APP_URL/);
});
