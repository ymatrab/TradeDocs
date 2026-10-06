import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { getServerEnv } from '@/lib/config/server';
import type { Database } from '@/lib/database.types';
import { DatabaseUnavailableError, type TradeDocsClient } from './server';

/**
 * The service-role client. It bypasses row level security, so it is reached for in exactly
 * two places: the contact form's insert (anonymous visitors hold no grant on that table) and
 * the platform admin pages, after `requirePlatformAdmin` has verified the caller. It carries
 * no user session and persists nothing.
 */
export function createServiceClient(): TradeDocsClient {
  const env = getServerEnv();
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new DatabaseUnavailableError();
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
  });
}

/** Whether the service-role connection exists. Never throws. */
export function hasServiceRole(): boolean {
  try {
    const env = getServerEnv();
    return Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
  } catch {
    return false;
  }
}
