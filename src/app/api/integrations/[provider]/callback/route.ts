import { NextResponse, type NextRequest } from 'next/server';
import { hasEntitlement } from '@/lib/billing/server';
import { quickbooksCompanyName } from '@/lib/integrations/api';
import { verifyState } from '@/lib/integrations/crypto';
import { ProviderError } from '@/lib/integrations/http';
import { exchangeCode, xeroTenant, type Tenant } from '@/lib/integrations/oauth';
import { isProviderId, PROVIDER_FEATURES } from '@/lib/integrations/providers';
import { consumeState, currentProviderConfig, saveConnection } from '@/lib/integrations/server';
import { createClient, getUser } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * The OAuth redirect from QuickBooks Online or Xero.
 *
 * Order of checks, each ending the flow with a redirect and a non-personal result code:
 *   1. the provider is configured;
 *   2. the state's signature and expiry (signed with a key derived from INTEGRATION_TOKEN_KEY);
 *   3. the signed-in user is the user who started the flow (no session swap or login CSRF);
 *   4. the state's server row is consumed exactly once. A replayed or refreshed callback finds
 *      it consumed and changes nothing: the code is never exchanged twice (idempotent);
 *   5. the user is still an owner or admin and the organization still entitled;
 *   6. only then is the code exchanged, the tenant read and the tokens sealed and stored.
 * Nothing about the person or the tokens is written into the redirect URL.
 */

type Result =
  | 'connected'
  | 'declined'
  | 'invalid'
  | 'already_used'
  | 'wrong_user'
  | 'not_allowed'
  | 'plan_required'
  | 'unavailable'
  | 'provider_error';

function back(request: NextRequest, org: string | null, provider: string, result: Result) {
  const path = org ? `/app/${org}/settings/integrations` : '/app';
  const url = new URL(path, request.nextUrl.origin);
  url.searchParams.set('integration', provider);
  url.searchParams.set('result', result);
  const response = NextResponse.redirect(url, { status: 303 });
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
): Promise<Response> {
  const { provider } = await params;
  if (!isProviderId(provider)) return new Response('Not found', { status: 404 });
  const config = currentProviderConfig(provider);
  if (config.state !== 'ready') return back(request, null, provider, 'unavailable');

  const query = request.nextUrl.searchParams;
  const check = verifyState(config.tokenKey, query.get('state') ?? '', new Date());
  if (!check.ok || check.payload.p !== provider) return back(request, null, provider, 'invalid');
  const { o: org, u: startedBy, n: nonce } = check.payload;

  let user: Awaited<ReturnType<typeof getUser>>;
  try {
    user = await getUser();
  } catch {
    return back(request, null, provider, 'unavailable');
  }
  if (!user || user.id !== startedBy) return back(request, org, provider, 'wrong_user');

  let consumed: Awaited<ReturnType<typeof consumeState>>;
  try {
    consumed = await consumeState(config, nonce, org, user.id);
  } catch (error) {
    console.error('integration callback state failed', {
      provider,
      message: error instanceof Error ? error.message : 'unknown',
    });
    return back(request, org, provider, 'unavailable');
  }
  if (!consumed.ok) return back(request, org, provider, 'already_used');

  // The person declined at the provider, or the provider refused the request.
  if (query.get('error')) return back(request, org, provider, 'declined');

  const client = await createClient();
  const { data: membership } = await client
    .from('memberships')
    .select('role')
    .eq('org_id', org)
    .eq('user_id', user.id)
    .maybeSingle();
  if (membership?.role !== 'owner' && membership?.role !== 'admin') {
    return back(request, org, provider, 'not_allowed');
  }
  if (!(await hasEntitlement(org, PROVIDER_FEATURES[provider]))) {
    return back(request, org, provider, 'plan_required');
  }

  const code = query.get('code') ?? '';
  if (!code || code.length > 2000) return back(request, org, provider, 'invalid');
  const realm = query.get('realmId') ?? '';
  if (provider === 'quickbooks' && !/^[0-9]{1,30}$/.test(realm)) {
    return back(request, org, provider, 'invalid');
  }

  try {
    const tokens = await exchangeCode(config, code, consumed.codeVerifier, fetch);
    let tenant: Tenant;
    if (provider === 'quickbooks') {
      const name = await quickbooksCompanyName(
        { accessToken: tokens.accessToken, tenantId: realm },
        config.quickbooksEnvironment,
        fetch,
      );
      tenant = { id: realm, name };
    } else {
      tenant = await xeroTenant(tokens.accessToken, fetch);
    }
    await saveConnection(config, org, user.id, tokens, tenant);
  } catch (error) {
    console.error('integration callback failed', {
      provider,
      code: error instanceof ProviderError ? error.code : 'other',
      status: error instanceof ProviderError ? error.status : null,
      detail: error instanceof ProviderError ? error.detail : null,
    });
    return back(request, org, provider, 'provider_error');
  }
  return back(request, org, provider, 'connected');
}
