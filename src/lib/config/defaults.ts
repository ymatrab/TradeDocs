import { createHmac } from 'node:crypto';
import type { EnvironmentInput } from './schema';

/**
 * Configuration defaults (D-026). The one place a value the owner did not set is filled in.
 *
 * The owner approved running production without setting PRICES_APPROVED, APPLICATION_MODE,
 * APP_ENV, APP_URL, RATE_LIMIT_KEY_SECRET, LAUNCH_APPROVED or the WAIVE_* values. Every
 * default below applies only while its variable is unset or blank: an explicit value,
 * including "false", always wins.
 *
 * Scope:
 *   - Supabase integration aliases and the project reference: every environment (they only
 *     rename what the Supabase–Vercel integration already sets).
 *   - APP_URL, PRICES_APPROVED, WAIVE_*: deployed environments (preview, staging, production).
 *   - LAUNCH_APPROVED, SUPABASE_ENVIRONMENT, PRODUCTION_SUPABASE_PROJECT_REF and the
 *     service-mode default: production only. Previews carry no database (D-011).
 *   - Derived secrets: deployed environments in service mode.
 * Local and test environments resolve only what they set, so CI keeps proving both states.
 *
 * Pure apart from node:crypto's HMAC: nothing here reads process.env, and it never throws.
 */

const DEPLOYED = new Set(['preview', 'staging', 'production']);

/** Names the Supabase–Vercel integration sets, in order of preference, per name the app reads. */
export const SUPABASE_ALIASES = {
  SUPABASE_URL: ['NEXT_PUBLIC_SUPABASE_URL'],
  SUPABASE_ANON_KEY: [
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  ],
  SUPABASE_SERVICE_ROLE_KEY: ['SUPABASE_SECRET_KEY'],
} as const;

/**
 * Server secrets derived from the service-role key when unset: HMAC-SHA-256(key, label) as
 * 64 hex characters (32 bytes). Rotating the service-role key rotates every one of them;
 * setting the variable pins it. Each label is distinct, so no two derived values match.
 */
export const DERIVED_SECRETS = {
  RATE_LIMIT_KEY_SECRET: 'tradedocs:rate-limit:v1',
  API_KEY_PEPPER: 'tradedocs:api-key-pepper:v1',
  INTEGRATION_TOKEN_KEY: 'tradedocs:integration-token-key:v1',
} as const;
export type DerivedSecret = keyof typeof DERIVED_SECRETS;

/** Deployed-environment approvals recorded by the owner (D-017, D-024). */
const DEPLOYED_APPROVALS = [
  'PRICES_APPROVED',
  'WAIVE_TURNSTILE',
  'WAIVE_SENTRY',
  'WAIVE_ANALYTICS',
  'WAIVE_INDEXNOW',
] as const;

/** What a defaulted service mode needs that has no default of its own. */
const SERVICE_REQUIREMENTS = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_PROJECT_REF',
  'APP_URL',
  'RESEND_API_KEY',
  'EMAIL_FROM',
] as const;

export type ResolvedEnvironment = {
  /** The input with every applicable default filled in. */
  values: EnvironmentInput;
  /** Names whose value came from a default or an integration alias. Never values. */
  defaulted: string[];
  /** Names whose value was derived from the service-role key. Never values. */
  derived: DerivedSecret[];
  /**
   * Production with a Supabase connection that stayed in foundation mode: the names still
   * missing before service mode can default on. Empty otherwise.
   */
  servicePending: string[];
};

function present(value: string | undefined): value is string {
  return value !== undefined && value.trim() !== '';
}

export function deriveSecret(serviceRoleKey: string, label: string): string {
  return createHmac('sha256', serviceRoleKey).update(label, 'utf8').digest('hex');
}

/** The project reference of a hosted Supabase origin (`<ref>.supabase.co`), if it is one. */
export function hostedProjectRef(url: string | undefined): string | undefined {
  if (!present(url)) return undefined;
  try {
    return /^([a-z0-9]{8,32})\.supabase\.co$/.exec(new URL(url.trim()).hostname)?.[1];
  } catch {
    return undefined;
  }
}

/** `https://<host>` from a bare platform host, or undefined when it is not a bare host. */
function originFromHost(host: string | undefined): string | undefined {
  if (!present(host)) return undefined;
  const bare = host
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');
  return /^[A-Za-z0-9.-]+(:\d+)?$/.test(bare) ? `https://${bare.toLowerCase()}` : undefined;
}

/** Applies D-026's defaults. `input.APP_ENV` must already be resolved (see schema.ts). */
export function resolveEnvironmentDefaults(input: EnvironmentInput): ResolvedEnvironment {
  const values: EnvironmentInput = { ...input };
  const defaulted: string[] = [];
  const derived: DerivedSecret[] = [];
  const servicePending: string[] = [];
  const appEnv = values.APP_ENV?.trim();
  const deployed = appEnv !== undefined && DEPLOYED.has(appEnv);
  const production = appEnv === 'production';

  const fill = (name: string, value: string | undefined) => {
    if (present(values[name]) || !present(value)) return;
    values[name] = value;
    defaulted.push(name);
  };

  for (const [name, aliases] of Object.entries(SUPABASE_ALIASES)) {
    fill(name, aliases.map((alias) => values[alias]).find(present));
  }
  fill('SUPABASE_PROJECT_REF', hostedProjectRef(values.SUPABASE_URL));

  if (deployed) {
    // Vercel's production alias is the shortest attached custom domain once there is one,
    // else the vercel.app name; a preview is reached on its own deployment host.
    const platformHost = production ? values.VERCEL_PROJECT_PRODUCTION_URL : values.VERCEL_URL;
    fill('APP_URL', originFromHost(platformHost));
    for (const name of DEPLOYED_APPROVALS) fill(name, 'true');
  }

  if (production) {
    // Recorded by the owner on 2026-10-11 (D-026). An explicit "false" still holds a release.
    fill('LAUNCH_APPROVED', 'true');
    if (present(values.SUPABASE_URL)) fill('SUPABASE_ENVIRONMENT', 'production');
    fill('PRODUCTION_SUPABASE_PROJECT_REF', values.SUPABASE_PROJECT_REF);

    const connected =
      present(values.SUPABASE_URL) &&
      present(values.SUPABASE_ANON_KEY) &&
      present(values.SUPABASE_SERVICE_ROLE_KEY);
    if (connected && !present(values.APPLICATION_MODE)) {
      const missing = SERVICE_REQUIREMENTS.filter((name) => !present(values[name]));
      // Service mode only when it would validate: a missing email sender keeps the site up
      // in foundation mode and is named by /api/ready, rather than failing the deployment.
      if (missing.length === 0) fill('APPLICATION_MODE', 'service');
      else servicePending.push(...missing);
    }
  }

  const serviceRoleKey = values.SUPABASE_SERVICE_ROLE_KEY;
  if (deployed && values.APPLICATION_MODE?.trim() === 'service' && present(serviceRoleKey)) {
    for (const [name, label] of Object.entries(DERIVED_SECRETS) as [DerivedSecret, string][]) {
      if (present(values[name])) continue;
      values[name] = deriveSecret(serviceRoleKey.trim(), label);
      derived.push(name);
    }
  }

  return { values, defaulted, derived, servicePending };
}
