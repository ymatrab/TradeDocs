import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET as readiness } from '@/app/api/ready/route';
import { controlActive, degradedControls, turnstileEnforced } from '@/lib/config/controls';
import { ConfigurationError, parseServerEnv, type EnvironmentInput } from '@/lib/config/schema';

/** Synthetic production service configuration with every deferred service absent. */
const production: EnvironmentInput = {
  APP_ENV: 'production',
  APPLICATION_MODE: 'service',
  APP_URL: 'https://app.example.com',
  SUPABASE_URL: 'https://syntheticproject.supabase.co',
  SUPABASE_ANON_KEY: 'synthetic-public-test-key',
  SUPABASE_SERVICE_ROLE_KEY: 'synthetic-service-test-key',
  SUPABASE_PROJECT_REF: 'syntheticproject',
  SUPABASE_ENVIRONMENT: 'production',
  PRODUCTION_SUPABASE_PROJECT_REF: 'syntheticproject',
  RATE_LIMIT_KEY_SECRET: 'synthetic-rate-test-key-more-than-32-characters',
  RESEND_API_KEY: 'synthetic-email-test-key',
  EMAIL_FROM: 'TradeDocs <no-reply@example.com>',
  LAUNCH_APPROVED: 'true',
};

const allWaived: EnvironmentInput = {
  WAIVE_TURNSTILE: 'true',
  WAIVE_SENTRY: 'true',
  WAIVE_ANALYTICS: 'true',
  WAIVE_INDEXNOW: 'true',
};

/** Feature-level variables read outside the strict schema; cleared so CI's env cannot leak in. */
const FEATURE_ENV = [
  'API_KEY_PEPPER',
  'DROPBOX_SIGN_API_KEY',
  'DROPBOX_SIGN_CLIENT_ID',
  'QUICKBOOKS_CLIENT_ID',
  'QUICKBOOKS_CLIENT_SECRET',
  'XERO_CLIENT_ID',
  'XERO_CLIENT_SECRET',
  'INTEGRATION_TOKEN_KEY',
] as const;

function rejectedFields(input: EnvironmentInput): readonly string[] {
  try {
    parseServerEnv(input);
  } catch (error) {
    expect(error).toBeInstanceOf(ConfigurationError);
    return (error as ConfigurationError).fields;
  }
  return [];
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('deferred service waivers (D-017)', () => {
  it('accepts production service mode when every deferred service is waived', () => {
    const env = parseServerEnv({ ...production, ...allWaived });
    expect(degradedControls(env)).toEqual(['turnstile', 'sentry', 'analytics', 'indexnow']);
    expect(turnstileEnforced(env)).toBe(false);
  });

  it('rejects each missing key whose control is not waived', () => {
    expect(rejectedFields(production)).toEqual([
      'ANALYTICS_SITE_ID',
      'INDEXNOW_KEY',
      'SENTRY_DSN',
      'TURNSTILE_SECRET_KEY',
      'TURNSTILE_SITE_KEY',
    ]);
    expect(rejectedFields({ ...production, ...allWaived, WAIVE_SENTRY: '' })).toEqual([
      'SENTRY_DSN',
    ]);
  });

  it('never waives email delivery', () => {
    expect(rejectedFields({ ...production, ...allWaived, RESEND_API_KEY: '' })).toEqual([
      'RESEND_API_KEY',
    ]);
  });

  it('keeps a configured control active whatever its waiver says', () => {
    const env = parseServerEnv({
      ...production,
      ...allWaived,
      TURNSTILE_SITE_KEY: 'synthetic-site-key',
      TURNSTILE_SECRET_KEY: 'synthetic-turnstile-secret',
      SENTRY_DSN: 'https://public@sentry.example.com/1',
    });
    expect(turnstileEnforced(env)).toBe(true);
    expect(controlActive(env, 'sentry')).toBe(true);
    expect(degradedControls(env)).toEqual(['analytics', 'indexnow']);
  });

  it('requires the full configuration of a partly configured waived control', () => {
    const partial = { ...production, ...allWaived, TURNSTILE_SITE_KEY: 'synthetic-site-key' };
    expect(rejectedFields(partial)).toEqual(['TURNSTILE_SECRET_KEY']);
  });

  it('lists waived controls by name in readiness without revealing values', async () => {
    for (const [name, value] of Object.entries({ ...production, ...allWaived })) {
      vi.stubEnv(name, value ?? '');
    }
    vi.stubEnv('INDEXNOW_KEY', 'synthetic-indexnow-key');
    // Per-feature providers left off, so only the waivers and the API (no pepper) report.
    for (const name of FEATURE_ENV) vi.stubEnv(name, '');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({})));
    const response = await readiness();
    expect(response.status).toBe(200);
    const body = await response.text();
    expect(JSON.parse(body)).toEqual({
      status: 'ready',
      rate_limiting: 'enforced',
      degraded: ['turnstile', 'sentry', 'analytics'],
      api: 'unavailable',
      api_reason: 'api_key_pepper_missing',
    });
    expect(body).not.toContain('synthetic');
  });

  it('reports each misconfigured feature by reason or variable name, never by value', async () => {
    for (const [name, value] of Object.entries({ ...production, ...allWaived })) {
      vi.stubEnv(name, value ?? '');
    }
    vi.stubEnv('INDEXNOW_KEY', 'synthetic-indexnow-key');
    for (const name of FEATURE_ENV) vi.stubEnv(name, '');
    vi.stubEnv('API_KEY_PEPPER', 'synthetic-pepper-value-more-than-32-characters');
    vi.stubEnv('DROPBOX_SIGN_API_KEY', 'synthetic-malformed-esign-key');
    vi.stubEnv('QUICKBOOKS_CLIENT_ID', 'synthetic-quickbooks-client');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({})));
    const response = await readiness();
    expect(response.status).toBe(200);
    const body = await response.text();
    expect(JSON.parse(body)).toEqual({
      status: 'ready',
      rate_limiting: 'enforced',
      degraded: ['turnstile', 'sentry', 'analytics'],
      esign: 'misconfigured',
      esign_reason: 'api_key_malformed',
      integrations_incomplete: {
        quickbooks: ['QUICKBOOKS_CLIENT_SECRET', 'INTEGRATION_TOKEN_KEY'],
      },
    });
    expect(body).not.toContain('synthetic');
  });
});
