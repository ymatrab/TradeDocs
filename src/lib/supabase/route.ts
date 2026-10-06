import 'server-only';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from '@/lib/config/server';
import type { Database } from '@/lib/database.types';
import { DatabaseUnavailableError, type TradeDocsClient } from './server';

type WrittenCookie = { name: string; value: string; options: CookieOptions };

/**
 * A client for a Route Handler that ends in a redirect (/auth/confirm, /auth/callback).
 *
 * The session cookies a verified link produces must travel on the redirect itself. Relying
 * on next/headers cookies() to merge them into a separately built NextResponse is what left
 * a verified reset link landing on /reset-password/new with no session. Here every cookie
 * Supabase writes is captured and applied to the response explicitly by `bind`.
 */
export function createRouteClient(request: NextRequest): {
  client: TradeDocsClient;
  bind: (response: NextResponse) => NextResponse;
} {
  const env = getServerEnv();
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) throw new DatabaseUnavailableError();
  const written = new Map<string, WrittenCookie>();
  const client = createServerClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookies) {
        for (const cookie of cookies) written.set(cookie.name, cookie);
      },
    },
  });
  return {
    client,
    bind(response) {
      for (const { name, value, options } of written.values()) {
        response.cookies.set(name, value, options);
      }
      return response;
    },
  };
}
