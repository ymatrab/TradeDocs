import 'server-only';

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
