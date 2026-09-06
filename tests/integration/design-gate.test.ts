import { afterEach, expect, it, vi } from 'vitest';
import DesignSystemPage from '@/app/_design/page';

afterEach(() => {
  vi.unstubAllEnvs();
});

it('the design showcase is unreachable in production', () => {
  vi.stubEnv('APP_ENV', 'production');
  // notFound() signals the 404 boundary by throwing; rendering must not return markup.
  expect(() => DesignSystemPage()).toThrow();
});

it('the design showcase renders outside production', () => {
  vi.stubEnv('APP_ENV', 'test');
  expect(() => DesignSystemPage()).not.toThrow();
});
