import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getServerEnv } from '@/lib/config/server';
import type { Database } from '@/lib/database.types';

export type TradeDocsClient = SupabaseClient<Database>;

export class DatabaseUnavailableError extends Error {
  constructor() {
    super('The database is not configured for this deployment.');
    this.name = 'DatabaseUnavailableError';
  }
}

/**
 * Request-scoped client carrying the caller's session. Every query it issues is subject to
 * row level security, so this is the only client application code should reach for.
 */
export async function createClient(): Promise<TradeDocsClient> {
  const env = getServerEnv();
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) throw new DatabaseUnavailableError();
  const store = await cookies();
  return createServerClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(written) {
        try {
          for (const { name, value, options } of written) store.set(name, value, options);
        } catch {
          // A Server Component cannot write cookies. The proxy refreshes the session
          // instead, so a read-only render is expected here rather than an error.
        }
      },
    },
  });
}

/**
 * The signed-in user, verified against the auth server rather than read from the cookie.
 * Never trust a session decoded locally for an authorization decision.
 */
export async function getUser() {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  return user;
}

/**
 * Whether this deployment has a database at all. A foundation deployment does not, so the
 * surfaces that need one report a missing route rather than failing with a server error.
 */
export function isDatabaseConfigured(): boolean {
  const env = getServerEnv();
  return Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
}
