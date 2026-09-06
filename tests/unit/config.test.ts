import { describe, expect, it } from 'vitest';
import { ConfigurationError, parseServerEnv, validateDeploymentEnv } from '@/lib/config/schema';

describe('environment configuration', () => {
  it('allows explicit isolated tests with all commercial features disabled', () => {
    const env = validateDeploymentEnv({ APP_ENV: 'test' }, true);
    expect(env.ENABLE_PAYMENTS).toBe(false);
    expect(env.ENABLE_REGULATED_DOCUMENTS).toBe(false);
    expect(env.ENABLE_TRANSACTIONAL_EMAIL).toBe(false);
  });

  it('rejects missing build environment and local production startup', () => {
    expect(() => validateDeploymentEnv({}, true)).toThrow(ConfigurationError);
    expect(() => validateDeploymentEnv({ APP_ENV: 'local' }, true)).toThrow(ConfigurationError);
  });

  it('rejects production without credentials and a release approval', () => {
    expect(() => parseServerEnv({ APP_ENV: 'production' })).toThrow(ConfigurationError);
  });

  it('does not include invalid secret-bearing URLs in configuration errors', () => {
    const value = 'private-account-secret-invalid-url';
    let message = '';
    try {
      parseServerEnv({ APP_ENV: 'test', APP_URL: value, SUPABASE_URL: value });
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigurationError);
      message = (error as Error).message;
    }
    expect(message).toContain('APP_URL');
    expect(message).not.toContain(value);
  });

  it('rejects a preview configured with the production project', () => {
    expect(() => parseServerEnv({
      APP_ENV: 'preview', APP_URL: 'https://preview.example.com',
      SUPABASE_URL: 'https://productionproject.supabase.co',
      SUPABASE_PROJECT_REF: 'productionproject',
      PRODUCTION_SUPABASE_PROJECT_REF: 'productionproject',
      SUPABASE_ENVIRONMENT: 'preview',
      SUPABASE_ANON_KEY: 'synthetic-public-test-key',
      SUPABASE_SERVICE_ROLE_KEY: 'synthetic-service-test-key',
      RATE_LIMIT_KEY_SECRET: 'synthetic-rate-test-key-more-than-32-characters',
    })).toThrow(ConfigurationError);
  });

  it('does not enable payment or regulated capabilities from a feature flag alone', () => {
    expect(() => parseServerEnv({ APP_ENV: 'test', ENABLE_PAYMENTS: 'true' })).toThrow();
    expect(() => parseServerEnv({ APP_ENV: 'test', ENABLE_REGULATED_DOCUMENTS: 'true' })).toThrow();
  });
});
