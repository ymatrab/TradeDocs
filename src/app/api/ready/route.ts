import { degradedControls } from '@/lib/config/controls';
import type { WaivableControl } from '@/lib/config/schema';
import {
  certificateOfOriginState,
  getServerEnv,
  hasSupabaseConfiguration,
} from '@/lib/config/server';
import { billingConfig, type BillingConfig } from '@/lib/billing/server';
import {
  DEGRADED_RATE_LIMIT_REASON,
  rateLimitMode,
  type RateLimitMode,
} from '@/lib/security/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
  let ready = false;
  // Reported whether or not the deployment is ready, so a foundation deployment that serves
  // public tools without quotas says so instead of looking merely "unavailable".
  let rateLimiting: RateLimitMode = { mode: 'degraded', reason: DEGRADED_RATE_LIMIT_REASON };
  // Controls the owner waived by name (D-017); names only, never configuration values.
  let degraded: WaivableControl[] = [];
  // Payments switched on but unusable fail the billing feature alone; the reason names the gap,
  // never a value. Closed payments are the normal state and are not reported.
  let billing: BillingConfig = { state: 'disabled' };
  // The certificate of origin switched on without its approval or review record is refused
  // (fail closed) and reported here by reason, never by value. Off is normal and silent.
  const certificate = certificateOfOriginState();
  try {
    const configuration = getServerEnv();
    rateLimiting = rateLimitMode(configuration);
    degraded = degradedControls(configuration);
    billing = billingConfig(configuration);
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
    {
      status: ready ? 'ready' : 'unavailable',
      rate_limiting: rateLimiting.mode,
      ...(rateLimiting.mode === 'degraded' ? { reason: rateLimiting.reason } : {}),
      ...(degraded.length > 0 ? { degraded } : {}),
      ...(billing.state === 'misconfigured'
        ? { payments: 'misconfigured', payments_reason: billing.reason }
        : {}),
      ...(certificate.state === 'misconfigured'
        ? {
            regulated_documents: 'misconfigured',
            regulated_documents_reason: certificate.reason,
          }
        : {}),
    },
    {
      status: ready ? 200 : 503,
      headers: { 'Cache-Control': 'no-store', ...(ready ? {} : { 'Retry-After': '30' }) },
    },
  );
}
