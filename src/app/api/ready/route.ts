import { getServerEnv, hasSupabaseConfiguration } from '@/lib/config/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
  let ready = false;
  try {
    if (hasSupabaseConfiguration()) {
      const env = getServerEnv();
      if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
        const response = await fetch(new URL('/auth/v1/health', env.SUPABASE_URL), {
          headers: { apikey: env.SUPABASE_ANON_KEY },
          cache: 'no-store',
          redirect: 'error',
          signal: AbortSignal.timeout(2_000),
        });
        ready = response.ok;
        // The dependency's response may contain internal version details; do not expose it.
        void response.body?.cancel().catch(() => undefined);
      }
    }
  } catch {
    ready = false;
  }
  return Response.json(
    { status: ready ? 'ready' : 'unavailable' },
    {
      status: ready ? 200 : 503,
      headers: { 'Cache-Control': 'no-store', ...(ready ? {} : { 'Retry-After': '30' }) },
    },
  );
}
