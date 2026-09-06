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
    expect(() => parseServerEnv({ APP_ENV: 'production', APPLICATION_MODE: 'service' })).toThrow(
      ConfigurationError,
    );
  });

  it('allows Vercel to build the closed foundation without service credentials', () => {
    const env = validateDeploymentEnv({ APP_ENV: '', VERCEL_ENV: 'production' }, true);
    expect(env.APP_ENV).toBe('production');
    expect(env.APPLICATION_MODE).toBe('foundation');
    expect(env.LAUNCH_APPROVED).toBe(false);
  });

  it('trusts Vercel deployment identity over a stale application environment', () => {
    const env = validateDeploymentEnv({ APP_ENV: 'test', VERCEL_ENV: 'production' }, true);
    expect(env.APP_ENV).toBe('production');
  });

  it('builds the Vercel foundation despite database variables left by another application', () => {
    const env = validateDeploymentEnv(
      {
        APP_ENV: '',
        APP_URL: '',
        VERCEL_ENV: 'production',
        SUPABASE_URL: 'https://leftoverproject.supabase.co',
        SUPABASE_ANON_KEY: 'synthetic-public-test-key',
        SUPABASE_SERVICE_ROLE_KEY: 'synthetic-service-test-key',
      },
      true,
    );
    expect(env.APP_ENV).toBe('production');
    expect(env.APPLICATION_MODE).toBe('foundation');
  });

  it('never hands a foundation deployment the database credentials of another application', () => {
    const env = parseServerEnv({
      APP_ENV: 'test',
      SUPABASE_URL: 'https://leftoverproject.supabase.co',
      SUPABASE_ANON_KEY: 'synthetic-public-test-key',
      SUPABASE_SERVICE_ROLE_KEY: 'synthetic-service-test-key',
      SUPABASE_PROJECT_REF: 'leftoverproject',
      SUPABASE_ENVIRONMENT: 'test',
    });
    expect(env.SUPABASE_URL).toBeUndefined();
    expect(env.SUPABASE_ANON_KEY).toBeUndefined();
    expect(env.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
  });

  it('still requires complete database configuration from a service deployment', () => {
    expect(() =>
      parseServerEnv({
        APP_ENV: 'test',
        APPLICATION_MODE: 'service',
        SUPABASE_ANON_KEY: 'synthetic-public-test-key',
      }),
    ).toThrow(ConfigurationError);
  });

  it('does not allow a foundation deployment to enable customer capabilities', () => {
    expect(() =>
      parseServerEnv({
        APP_ENV: 'test',
        APPLICATION_MODE: 'foundation',
        ENABLE_REGULATED_DOCUMENTS: 'true',
        REGULATED_DOCUMENTS_APPROVED: 'true',
      }),
    ).toThrow(ConfigurationError);
  });

  it('does not include invalid secret-bearing URLs in configuration errors', () => {
    const value = 'private-account-secret-invalid-url';
    let message = '';
    try {
      parseServerEnv({
        APP_ENV: 'test',
        APPLICATION_MODE: 'service',
        APP_URL: value,
        SUPABASE_URL: value,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigurationError);
      message = (error as Error).message;
    }
    expect(message).toContain('APP_URL');
    expect(message).not.toContain(value);
  });

  it('rejects a preview configured with the production project', () => {
    expect(() =>
      parseServerEnv({
        APP_ENV: 'preview',
        APPLICATION_MODE: 'service',
        APP_URL: 'https://preview.example.com',
        SUPABASE_URL: 'https://productionproject.supabase.co',
        SUPABASE_PROJECT_REF: 'productionproject',
        PRODUCTION_SUPABASE_PROJECT_REF: 'productionproject',
        SUPABASE_ENVIRONMENT: 'preview',
        SUPABASE_ANON_KEY: 'synthetic-public-test-key',
        SUPABASE_SERVICE_ROLE_KEY: 'synthetic-service-test-key',
        RATE_LIMIT_KEY_SECRET: 'synthetic-rate-test-key-more-than-32-characters',
      }),
    ).toThrow(ConfigurationError);
  });

  it('does not enable payment or regulated capabilities from a feature flag alone', () => {
    expect(() => parseServerEnv({ APP_ENV: 'test', ENABLE_PAYMENTS: 'true' })).toThrow();
    expect(() => parseServerEnv({ APP_ENV: 'test', ENABLE_REGULATED_DOCUMENTS: 'true' })).toThrow();
  });
});
