import 'server-only';

import { certificateOfOriginGate, type CooGate } from '@/lib/trade/regulated';
import type { ResolvedEnvironment } from './defaults';
import {
  resolveDeploymentInput,
  validateDeploymentEnv,
  type EnvironmentInput,
  type ServerEnv,
} from './schema';

function resolvedProcessEnv(): ResolvedEnvironment {
  return resolveDeploymentInput(process.env, process.env.NODE_ENV === 'production');
}

/**
 * The raw environment with D-026's defaults applied (config/defaults.ts), for the feature
 * modules that read variables outside the strict schema (prices, API pepper, integration
 * key, certificate gate). Server-only: it carries the derived secrets.
 */
export function serverEnvironment(): EnvironmentInput {
  return resolvedProcessEnv().values;
}

/** Which values were defaulted or derived, for /api/ready. Names only, never values. */
export function environmentDefaults(): Omit<ResolvedEnvironment, 'values'> {
  const { defaulted, derived, servicePending } = resolvedProcessEnv();
  return { defaulted, derived, servicePending };
}

/**
 * Secrets remain in server-only modules; return an explicit public projection if needed.
 *
 * The environment is resolved by the same function the build and the startup guard use, so
 * a request cannot disagree with them about which environment it is running in. Resolving it
 * separately here meant a host that supplies VERCEL_ENV but no APP_ENV parsed at build and
 * then threw on every request.
 */
export function getServerEnv(): ServerEnv {
  return validateDeploymentEnv(process.env, process.env.NODE_ENV === 'production');
}

export function hasSupabaseConfiguration(): boolean {
  try {
    const env = getServerEnv();
    return Boolean(
      env.SUPABASE_URL &&
      env.SUPABASE_ANON_KEY &&
      env.SUPABASE_PROJECT_REF &&
      env.SUPABASE_ENVIRONMENT,
    );
  } catch {
    return false;
  }
}

/**
 * The certificate of origin's gate (src/lib/trade/regulated.ts): the flag, its approval,
 * service mode and a recorded legal review. Any configuration problem answers "off": this
 * gate fails closed, so a broken environment withholds the claim rather than making it
 * without approval.
 */
export function certificateOfOriginState(): CooGate {
  try {
    const env = getServerEnv();
    if (!env.ENABLE_REGULATED_DOCUMENTS) return { state: 'off' };
    // The flag combination is validated by the schema above; the review record is read
    // outside it, so a missing or mistyped record fails this feature alone.
    return certificateOfOriginGate(serverEnvironment());
  } catch {
    return { state: 'off' };
  }
}

/**
 * Whether regulated document types may be generated, and claimed on public pages. True only
 * when the certificate of origin's gate is fully on.
 */
export function regulatedDocumentsEnabled(): boolean {
  return certificateOfOriginState().state === 'on';
}
