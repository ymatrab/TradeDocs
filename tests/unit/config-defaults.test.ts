import { describe, expect, it } from 'vitest';
import { controlActive, degradedControls } from '@/lib/config/controls';
import {
  COO_OWNER_APPROVAL,
  DERIVED_SECRETS,
  deriveSecret,
  hostedProjectRef,
  resolveEnvironmentDefaults,
} from '@/lib/config/defaults';
import {
  ConfigurationError,
  resolveDeploymentInput,
  validateDeploymentEnv,
  type EnvironmentInput,
} from '@/lib/config/schema';
import { isCustomDomainUrl } from '@/lib/http/indexing';
import { parseTokenKey } from '@/lib/integrations/crypto';
import { pricesApproved } from '@/lib/billing/plans';
import { certificateOfOriginGate } from '@/lib/trade/regulated';

/**
 * D-026: production runs without the owner setting PRICES_APPROVED, APPLICATION_MODE,
 * APP_ENV, APP_URL, RATE_LIMIT_KEY_SECRET, LAUNCH_APPROVED or WAIVE_*. Synthetic values only.
 */

/** What the Supabase–Vercel integration and Vercel itself set on the production target. */
const integration: EnvironmentInput = {
  VERCEL_ENV: 'production',
  VERCEL_PROJECT_PRODUCTION_URL: 'tradedocs-synthetic.vercel.app',
  VERCEL_URL: 'tradedocs-synthetic-abc123.vercel.app',
  NEXT_PUBLIC_SUPABASE_URL: 'https://syntheticproject.supabase.co',
  SUPABASE_URL: 'https://syntheticproject.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'synthetic-public-test-key',
  SUPABASE_ANON_KEY: 'synthetic-public-test-key',
  SUPABASE_SERVICE_ROLE_KEY: 'synthetic-service-test-key',
};
/** The owner's one remaining step for service mode: the email sender. */
const email: EnvironmentInput = {
  RESEND_API_KEY: 'synthetic-email-test-key',
  EMAIL_FROM: 'TradeDocs <no-reply@example.com>',
};

const resolve = (input: EnvironmentInput) => resolveDeploymentInput(input, true);

describe('deployment identity', () => {
  it('takes APP_ENV from VERCEL_ENV when it is unset', () => {
    expect(validateDeploymentEnv({ VERCEL_ENV: 'production' }, true).APP_ENV).toBe('production');
    expect(validateDeploymentEnv({ VERCEL_ENV: 'preview' }, true).APP_ENV).toBe('preview');
    expect(validateDeploymentEnv({ VERCEL_ENV: 'development' }, false).APP_ENV).toBe('local');
  });
});

describe('canonical origin', () => {
  it('defaults to the production alias in production and the deployment host in preview', () => {
    const production = resolve(integration).values;
    const preview = resolve({ ...integration, VERCEL_ENV: 'preview' }).values;
    expect(production.APP_URL).toBe('https://tradedocs-synthetic.vercel.app');
    expect(preview.APP_URL).toBe('https://tradedocs-synthetic-abc123.vercel.app');
  });

  it('keeps an explicit APP_URL, so the custom domain wins once the owner sets it', () => {
    const resolved = resolve({ ...integration, APP_URL: 'https://tradedocs.example' });
    expect(resolved.values.APP_URL).toBe('https://tradedocs.example');
    expect(resolved.defaulted).not.toContain('APP_URL');
  });

  it('keeps indexing closed on the defaulted vercel.app origin', () => {
    expect(isCustomDomainUrl(resolve(integration).values.APP_URL)).toBe(false);
    expect(isCustomDomainUrl('https://tradedocs.example')).toBe(true);
  });

  it('leaves local and test environments without a defaulted origin', () => {
    const test = resolveDeploymentInput({ APP_ENV: 'test', VERCEL_URL: 'x.vercel.app' }, false);
    expect(test.values.APP_URL).toBeUndefined();
  });
});

describe('recorded approvals', () => {
  it('shows the approved prices on deployments unless PRICES_APPROVED is "false"', () => {
    const declined = resolve({ VERCEL_ENV: 'production', PRICES_APPROVED: 'false' });
    expect(pricesApproved(resolve({ VERCEL_ENV: 'production' }).values)).toBe(true);
    expect(pricesApproved(resolve({ VERCEL_ENV: 'preview' }).values)).toBe(true);
    expect(pricesApproved(declined.values)).toBe(false);
    expect(pricesApproved(resolveDeploymentInput({ APP_ENV: 'test' }, false).values)).toBe(false);
  });

  it('waives the deferred services by default, and a configured key re-enables its control', () => {
    const env = validateDeploymentEnv(
      { VERCEL_ENV: 'production', TURNSTILE_SITE_KEY: 'synthetic-site-key' },
      true,
    );
    expect(env.WAIVE_TURNSTILE).toBe(true);
    expect(controlActive(env, 'turnstile')).toBe(true);
    expect(degradedControls(env)).toEqual(['sentry', 'analytics', 'indexnow']);
    const kept = validateDeploymentEnv({ VERCEL_ENV: 'production', WAIVE_SENTRY: 'false' }, true);
    expect(kept.WAIVE_SENTRY).toBe(false);
  });

  it('approves the launch in production only', () => {
    expect(validateDeploymentEnv({ VERCEL_ENV: 'production' }, true).LAUNCH_APPROVED).toBe(true);
    expect(validateDeploymentEnv({ VERCEL_ENV: 'preview' }, true).LAUNCH_APPROVED).toBe(false);
  });
});

describe('service mode', () => {
  it('turns on in production with the integration variables and the email sender', () => {
    const resolved = resolve({ ...integration, ...email });
    const env = validateDeploymentEnv({ ...integration, ...email }, true);
    expect(env.APPLICATION_MODE).toBe('service');
    expect(env.SUPABASE_PROJECT_REF).toBe('syntheticproject');
    expect(env.PRODUCTION_SUPABASE_PROJECT_REF).toBe('syntheticproject');
    expect(env.SUPABASE_ENVIRONMENT).toBe('production');
    expect(env.RATE_LIMIT_KEY_SECRET).toMatch(/^[0-9a-f]{64}$/);
    expect(resolved.derived).toEqual([
      'RATE_LIMIT_KEY_SECRET',
      'API_KEY_PEPPER',
      'INTEGRATION_TOKEN_KEY',
    ]);
    expect(resolved.servicePending).toEqual([]);
    expect(JSON.stringify([resolved.defaulted, resolved.derived])).not.toContain('synthetic');
  });

  it('accepts the newer publishable and secret key names', () => {
    const env = validateDeploymentEnv(
      {
        VERCEL_ENV: 'production',
        VERCEL_PROJECT_PRODUCTION_URL: 'tradedocs-synthetic.vercel.app',
        NEXT_PUBLIC_SUPABASE_URL: 'https://syntheticproject.supabase.co',
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'synthetic-publishable-test-key',
        SUPABASE_SECRET_KEY: 'synthetic-secret-test-key',
        ...email,
      },
      true,
    );
    expect(env.APPLICATION_MODE).toBe('service');
    expect(env.SUPABASE_URL).toBe('https://syntheticproject.supabase.co');
    expect(env.SUPABASE_ANON_KEY).toBe('synthetic-publishable-test-key');
    expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe('synthetic-secret-test-key');
  });

  it('stays in foundation mode, naming what is missing, while the email sender is unset', () => {
    const resolved = resolve(integration);
    expect(resolved.values.APPLICATION_MODE).toBeUndefined();
    expect(resolved.servicePending).toEqual(['RESEND_API_KEY', 'EMAIL_FROM']);
    expect(resolved.derived).toEqual([]);
    const env = validateDeploymentEnv(integration, true);
    expect(env.APPLICATION_MODE).toBe('foundation');
    expect(env.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
  });

  it('keeps previews in foundation mode (D-011) and honours an explicit mode', () => {
    const preview = { ...integration, ...email, VERCEL_ENV: 'preview' };
    const explicit = { ...integration, ...email, APPLICATION_MODE: 'foundation' };
    expect(validateDeploymentEnv(preview, true).APPLICATION_MODE).toBe('foundation');
    expect(validateDeploymentEnv(explicit, true).APPLICATION_MODE).toBe('foundation');
  });

  it('switches the certificate of origin on in production service mode only (D-028)', () => {
    const on = resolve({ ...integration, ...email }).values;
    expect(certificateOfOriginGate(on)).toEqual({
      state: 'on',
      review: {
        reviewedBy: COO_OWNER_APPROVAL.reviewedBy,
        reviewedAt: COO_OWNER_APPROVAL.reviewedAt,
      },
    });
    expect(
      validateDeploymentEnv({ ...integration, ...email }, true).ENABLE_REGULATED_DOCUMENTS,
    ).toBe(true);
    // Foundation mode, a preview, or an explicit "false" keep it off.
    expect(certificateOfOriginGate(resolve(integration).values).state).toBe('off');
    expect(
      certificateOfOriginGate(resolve({ ...integration, ...email, VERCEL_ENV: 'preview' }).values)
        .state,
    ).toBe('off');
    expect(
      certificateOfOriginGate(
        resolve({ ...integration, ...email, ENABLE_REGULATED_DOCUMENTS: 'false' }).values,
      ).state,
    ).toBe('off');
  });

  it('fails the deployment when the owner explicitly holds the launch in service mode', () => {
    expect(() =>
      validateDeploymentEnv({ ...integration, ...email, LAUNCH_APPROVED: 'false' }, true),
    ).toThrow(ConfigurationError);
  });
});

describe('derived secrets', () => {
  const key = 'synthetic-service-test-key';

  it('are deterministic, distinct per label and usable as a 32-byte key', () => {
    const labels = Object.values(DERIVED_SECRETS);
    const values = labels.map((label) => deriveSecret(key, label));
    expect(labels.map((label) => deriveSecret(key, label))).toEqual(values);
    expect(new Set(values).size).toBe(values.length);
    for (const value of values) expect(value).toMatch(/^[0-9a-f]{64}$/);
    const tokenKey = deriveSecret(key, DERIVED_SECRETS.INTEGRATION_TOKEN_KEY);
    expect(parseTokenKey(tokenKey)).not.toBeNull();
    const rotated = deriveSecret(`${key}-rotated`, DERIVED_SECRETS.API_KEY_PEPPER);
    expect(rotated).not.toBe(deriveSecret(key, DERIVED_SECRETS.API_KEY_PEPPER));
  });

  it('never replace a value the owner set', () => {
    const pinned = 'synthetic-pinned-pepper-more-than-32-characters';
    const resolved = resolve({ ...integration, ...email, API_KEY_PEPPER: pinned });
    expect(resolved.values.API_KEY_PEPPER).toBe(pinned);
    expect(resolved.derived).not.toContain('API_KEY_PEPPER');
    expect(resolved.values.RATE_LIMIT_KEY_SECRET).toBe(
      deriveSecret(key, DERIVED_SECRETS.RATE_LIMIT_KEY_SECRET),
    );
  });

  it('are not derived for local or test environments', () => {
    const resolved = resolveEnvironmentDefaults({
      APP_ENV: 'test',
      APPLICATION_MODE: 'service',
      SUPABASE_SERVICE_ROLE_KEY: key,
    });
    expect(resolved.derived).toEqual([]);
    expect(resolved.values.RATE_LIMIT_KEY_SECRET).toBeUndefined();
  });
});

describe('project reference', () => {
  it('is read from a hosted Supabase origin only', () => {
    expect(hostedProjectRef('https://syntheticproject.supabase.co')).toBe('syntheticproject');
    expect(hostedProjectRef('http://127.0.0.1:54321')).toBeUndefined();
    expect(hostedProjectRef('https://db.example.com')).toBeUndefined();
    expect(hostedProjectRef('not a url')).toBeUndefined();
  });
});
