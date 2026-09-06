import 'server-only';

import { parseServerEnv, type ServerEnv } from './schema';

/** Secrets remain in server-only modules; return an explicit public projection if needed. */
export function getServerEnv(): ServerEnv {
  return parseServerEnv({
    ...process.env,
    APP_ENV: process.env.APP_ENV ?? (process.env.NODE_ENV === 'production' ? undefined : 'local'),
  });
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
