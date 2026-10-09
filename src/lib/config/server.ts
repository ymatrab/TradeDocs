import 'server-only';

import { certificateOfOriginGate, type CooGate } from '@/lib/trade/regulated';
import { validateDeploymentEnv, type ServerEnv } from './schema';

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
    return certificateOfOriginGate(process.env);
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
