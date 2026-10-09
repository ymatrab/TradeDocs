import {
  basicAuth,
  failFor,
  parseJson,
  ProviderError,
  request,
  type Fetcher,
} from '@/lib/integrations/http';
import {
  PROVIDER_ENDPOINTS,
  XERO_CONNECTIONS,
  type ProviderConfig,
  type ProviderId,
} from '@/lib/integrations/providers';

/**
 * The OAuth 2.0 authorization code flow for both providers (endpoints and citations in
 * providers.ts): the authorization URL, the code exchange, refresh and revocation. The client
 * authenticates with HTTP Basic (client_secret_basic), which both discovery documents list.
 */

type Ready = Extract<ProviderConfig, { state: 'ready' }>;

export function authorizationUrl(
  config: Ready,
  state: string,
  codeChallenge: string | null,
): string {
  const endpoints = PROVIDER_ENDPOINTS[config.provider];
  const url = new URL(endpoints.authorize);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('redirect_uri', config.redirectUri);
  url.searchParams.set('scope', endpoints.scopes.join(' '));
  url.searchParams.set('state', state);
  if (endpoints.pkce && codeChallenge) {
    url.searchParams.set('code_challenge', codeChallenge);
    url.searchParams.set('code_challenge_method', 'S256');
  }
  return url.toString();
}

export type TokenSet = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: Date;
  /** QuickBooks states it (x_refresh_token_expires_in); Xero does not. */
  refreshExpiresAt: Date | null;
  scope: string | null;
};

/** A token endpoint's answer, or an error when any required part is missing. */
export function readTokenSet(body: unknown, now: Date, previousRefresh?: string): TokenSet {
  if (typeof body !== 'object' || body === null) throw new ProviderError('unreadable');
  const b = body as Record<string, unknown>;
  const access = typeof b.access_token === 'string' ? b.access_token : '';
  // A refresh response may omit the refresh token, which then stays the same (RFC 6749 6).
  const refresh =
    typeof b.refresh_token === 'string' && b.refresh_token ? b.refresh_token : previousRefresh;
  const expiresIn = typeof b.expires_in === 'number' ? b.expires_in : Number(b.expires_in);
  if (!access || !refresh || !Number.isFinite(expiresIn) || expiresIn <= 0) {
    throw new ProviderError('unreadable');
  }
  if (access.length > 8000 || refresh.length > 8000) throw new ProviderError('unreadable');
  const refreshIn =
    typeof b.x_refresh_token_expires_in === 'number'
      ? b.x_refresh_token_expires_in
      : Number(b.x_refresh_token_expires_in);
  return {
    accessToken: access,
    refreshToken: refresh,
    accessExpiresAt: new Date(now.getTime() + expiresIn * 1000),
    refreshExpiresAt:
      Number.isFinite(refreshIn) && refreshIn > 0
        ? new Date(now.getTime() + refreshIn * 1000)
        : null,
    scope: typeof b.scope === 'string' ? b.scope : null,
  };
}

async function tokenCall(
  config: Ready,
  form: Record<string, string>,
  fetcher: Fetcher,
): Promise<unknown> {
  const { status, body } = await request(fetcher, PROVIDER_ENDPOINTS[config.provider].token, {
    method: 'POST',
    headers: {
      Authorization: basicAuth(config.clientId, config.clientSecret),
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams(form).toString(),
  });
  if (status !== 200) throw failFor(status, body);
  return parseJson(body);
}

export async function exchangeCode(
  config: Ready,
  code: string,
  codeVerifier: string | null,
  fetcher: Fetcher,
  now = new Date(),
): Promise<TokenSet> {
  const form: Record<string, string> = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.redirectUri,
  };
  if (PROVIDER_ENDPOINTS[config.provider].pkce) {
    if (!codeVerifier) throw new ProviderError('unreadable');
    form.code_verifier = codeVerifier;
  }
  return readTokenSet(await tokenCall(config, form, fetcher), now);
}

export async function refreshTokens(
  config: Ready,
  refreshToken: string,
  fetcher: Fetcher,
  now = new Date(),
): Promise<TokenSet> {
  const body = await tokenCall(
    config,
    { grant_type: 'refresh_token', refresh_token: refreshToken },
    fetcher,
  );
  return readTokenSet(body, now, refreshToken);
}

/**
 * Revokes the refresh token at the provider, which ends the grant (for Xero, every connection
 * made with it). Intuit takes JSON {token}; Xero takes the RFC 7009 form.
 */
export async function revokeToken(
  config: Ready,
  refreshToken: string,
  fetcher: Fetcher,
): Promise<void> {
  const quickbooks = config.provider === 'quickbooks';
  const { status, body } = await request(fetcher, PROVIDER_ENDPOINTS[config.provider].revoke, {
    method: 'POST',
    headers: {
      Authorization: basicAuth(config.clientId, config.clientSecret),
      'Content-Type': quickbooks ? 'application/json' : 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: quickbooks
      ? JSON.stringify({ token: refreshToken })
      : new URLSearchParams({ token: refreshToken, token_type_hint: 'refresh_token' }).toString(),
  });
  if (status !== 200) throw failFor(status, body);
}

export type Tenant = { id: string; name: string | null };

/** The authentication event a Xero access token was issued for, read (not trusted) from it. */
function xeroAuthEvent(accessToken: string): string | null {
  const part = accessToken.split('.')[1];
  if (!part) return null;
  try {
    const claims: unknown = JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
    const id = (claims as Record<string, unknown>).authentication_event_id;
    return typeof id === 'string' ? id : null;
  } catch {
    return null;
  }
}

/**
 * The Xero organisation this authorization connected: the connection created by this
 * authentication event when it can be told, otherwise the most recently created one.
 */
export async function xeroTenant(accessToken: string, fetcher: Fetcher): Promise<Tenant> {
  const { status, body } = await request(fetcher, XERO_CONNECTIONS, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' },
  });
  if (status !== 200) throw failFor(status, body);
  const parsed = parseJson(body);
  const connections = (Array.isArray(parsed) ? parsed : []).filter(
    (entry): entry is Record<string, unknown> =>
      typeof entry === 'object' &&
      entry !== null &&
      typeof (entry as Record<string, unknown>).tenantId === 'string' &&
      (entry as Record<string, unknown>).tenantType === 'ORGANISATION',
  );
  if (connections.length === 0)
    throw new ProviderError('forbidden', 'No Xero organisation was connected.');
  const event = xeroAuthEvent(accessToken);
  const chosen =
    (event ? connections.find((entry) => entry.authEventId === event) : undefined) ??
    [...connections].sort((a, b) =>
      String(b.createdDateUtc ?? '').localeCompare(String(a.createdDateUtc ?? '')),
    )[0];
  if (!chosen) throw new ProviderError('forbidden', 'No Xero organisation was connected.');
  return {
    id: chosen.tenantId as string,
    name: typeof chosen.tenantName === 'string' ? chosen.tenantName.slice(0, 300) : null,
  };
}

export type ProviderGrant = { provider: ProviderId; tokens: TokenSet; tenant: Tenant };
