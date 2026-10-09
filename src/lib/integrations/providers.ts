import { parseTokenKey } from '@/lib/integrations/crypto';

/**
 * Accounting providers TradeDocs imports from (D-025): their OAuth 2.0 endpoints, scopes and
 * API bases, and whether this deployment is configured for each.
 *
 * Pure: it never reads process.env; the server module passes the environment in. A provider
 * is "ready" only when its client id and secret, the shared token key and APP_URL are all
 * present and valid; anything else answers "disabled" for that provider alone, so the page
 * shows it as not available and no button can start a broken flow.
 *
 * Sources, retrieved 2026-10-09:
 *   QuickBooks Online (Intuit)
 *   - OpenID discovery, production: https://developer.api.intuit.com/.well-known/openid_configuration
 *     authorization_endpoint https://appcenter.intuit.com/connect/oauth2
 *     token_endpoint         https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer
 *     revocation_endpoint    https://developer.api.intuit.com/v2/oauth2/tokens/revoke
 *     token_endpoint_auth_methods_supported: client_secret_basic, client_secret_post.
 *     No code_challenge_methods_supported is published, so no PKCE for Intuit; the signed,
 *     single-use state is the CSRF defence.
 *   - Sandbox discovery: https://developer.intuit.com/.well-known/openid_sandbox_configuration
 *     (same authorize/token/revoke endpoints).
 *   - OAuth 2.0 guide (scope com.intuit.quickbooks.accounting; realmId returned on the
 *     redirect): https://developer.intuit.com/app/developer/qbo/docs/develop/authentication-and-authorization/oauth-2.0
 *   - Query API (STARTPOSITION/MAXRESULTS, maximum 1000 per page, default 100):
 *     https://developer.intuit.com/app/developer/qbo/docs/learn/explore-the-quickbooks-online-api/data-queries
 *     Base URLs https://quickbooks.api.intuit.com and https://sandbox-quickbooks.api.intuit.com,
 *     path /v3/company/{realmId}/query.
 *   Xero
 *   - OpenID discovery: https://identity.xero.com/.well-known/openid-configuration
 *     authorization_endpoint https://login.xero.com/identity/connect/authorize
 *     token_endpoint         https://identity.xero.com/connect/token
 *     revocation_endpoint    https://identity.xero.com/connect/revocation
 *     code_challenge_methods_supported: S256 (PKCE used).
 *   - Auth flow and scopes: https://developer.xero.com/documentation/guides/oauth2/auth-flow
 *     and https://developer.xero.com/documentation/guides/oauth2/scopes (offline_access for a
 *     refresh token; contacts and settings scopes are not part of the 2026 granular-scope
 *     change).
 *   - Accounting API OpenAPI (official): https://github.com/XeroAPI/Xero-OpenAPI
 *     xero_accounting.yaml: GET /Contacts needs accounting.contacts.read (page, pageSize,
 *     up to 100 per page by default); GET /Items needs accounting.settings.read (unpaged);
 *     server https://api.xero.com/api.xro/2.0; every call carries the xero-tenant-id header.
 *     xero-identity.yaml: GET https://api.xero.com/connections lists the tenants a token
 *     reaches; DELETE /connections/{id} removes one.
 */

export const PROVIDER_IDS = ['quickbooks', 'xero'] as const;
export type ProviderId = (typeof PROVIDER_IDS)[number];

export function isProviderId(value: string): value is ProviderId {
  return (PROVIDER_IDS as readonly string[]).includes(value);
}

export const PROVIDER_NAMES: Record<ProviderId, string> = {
  quickbooks: 'QuickBooks Online',
  xero: 'Xero',
};

/** The feature key in src/lib/billing/plans.ts that gates each provider. */
export const PROVIDER_FEATURES = {
  quickbooks: 'integrations.quickbooks',
  xero: 'integrations.xero',
} as const satisfies Record<ProviderId, string>;

export type ProviderEndpoints = {
  authorize: string;
  token: string;
  revoke: string;
  scopes: readonly string[];
  /** Whether the authorization request carries an S256 PKCE challenge. */
  pkce: boolean;
};

export const PROVIDER_ENDPOINTS: Record<ProviderId, ProviderEndpoints> = {
  quickbooks: {
    authorize: 'https://appcenter.intuit.com/connect/oauth2',
    token: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    revoke: 'https://developer.api.intuit.com/v2/oauth2/tokens/revoke',
    scopes: ['com.intuit.quickbooks.accounting'],
    pkce: false,
  },
  xero: {
    authorize: 'https://login.xero.com/identity/connect/authorize',
    token: 'https://identity.xero.com/connect/token',
    revoke: 'https://identity.xero.com/connect/revocation',
    scopes: ['offline_access', 'accounting.contacts.read', 'accounting.settings.read'],
    pkce: true,
  },
};

export const QUICKBOOKS_API = {
  production: 'https://quickbooks.api.intuit.com',
  sandbox: 'https://sandbox-quickbooks.api.intuit.com',
} as const;
export type QuickBooksEnvironment = keyof typeof QUICKBOOKS_API;
/**
 * Intuit's current base minor version of the Accounting API; older minor versions were
 * retired in 2025, so requests state it explicitly.
 */
export const QUICKBOOKS_MINOR_VERSION = '75';

export const XERO_API = 'https://api.xero.com/api.xro/2.0';
export const XERO_CONNECTIONS = 'https://api.xero.com/connections';

/** Environment names, listed in .env.example and RUNBOOK.md ("Accounting integrations"). */
export const PROVIDER_ENV = {
  quickbooks: { clientId: 'QUICKBOOKS_CLIENT_ID', clientSecret: 'QUICKBOOKS_CLIENT_SECRET' },
  xero: { clientId: 'XERO_CLIENT_ID', clientSecret: 'XERO_CLIENT_SECRET' },
} as const satisfies Record<ProviderId, { clientId: string; clientSecret: string }>;
export const TOKEN_KEY_ENV = 'INTEGRATION_TOKEN_KEY';
/** sandbox or production. Blank: production when APP_ENV is production, otherwise sandbox. */
export const QUICKBOOKS_ENVIRONMENT_ENV = 'QUICKBOOKS_ENVIRONMENT';

export type ProviderConfig =
  | { state: 'disabled'; missing: string[] }
  | {
      state: 'ready';
      provider: ProviderId;
      clientId: string;
      clientSecret: string;
      tokenKey: Buffer;
      redirectUri: string;
      /** QuickBooks only: which API base the company files live on. */
      quickbooksEnvironment: QuickBooksEnvironment;
    };

type Environment = Record<string, string | undefined>;

function present(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** The canonical origin, or undefined when APP_URL is absent or not an origin. */
function appOrigin(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    if (url.username || url.password || url.search || url.hash) return undefined;
    if (url.pathname !== '/' && url.pathname !== '') return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export function callbackPath(provider: ProviderId): string {
  return `/api/integrations/${provider}/callback`;
}

/**
 * A provider's configuration. Client ids are opaque strings issued by the provider; they are
 * checked only for presence and a sane length, never invented or defaulted.
 */
export function providerConfig(provider: ProviderId, env: Environment): ProviderConfig {
  const names = PROVIDER_ENV[provider];
  const missing: string[] = [];
  const clientId = present(env[names.clientId]);
  const clientSecret = present(env[names.clientSecret]);
  if (!clientId || clientId.length > 200) missing.push(names.clientId);
  if (!clientSecret || clientSecret.length < 16 || clientSecret.length > 500) {
    missing.push(names.clientSecret);
  }
  const tokenKey = parseTokenKey(env[TOKEN_KEY_ENV]);
  if (!tokenKey) missing.push(TOKEN_KEY_ENV);
  const origin = appOrigin(present(env.APP_URL));
  if (!origin) missing.push('APP_URL');
  if (!clientId || !clientSecret || missing.length > 0 || !tokenKey || !origin) {
    return { state: 'disabled', missing };
  }
  const chosen = present(env[QUICKBOOKS_ENVIRONMENT_ENV]);
  const quickbooksEnvironment: QuickBooksEnvironment =
    chosen === 'production' || chosen === 'sandbox'
      ? chosen
      : env.APP_ENV === 'production' || env.VERCEL_ENV === 'production'
        ? 'production'
        : 'sandbox';
  return {
    state: 'ready',
    provider,
    clientId,
    clientSecret,
    tokenKey,
    redirectUri: `${origin}${callbackPath(provider)}`,
    quickbooksEnvironment,
  };
}

/** Which providers this deployment can offer, for capability-dependent copy. */
export function providerCapabilities(env: Environment): Record<ProviderId, boolean> {
  return {
    quickbooks: providerConfig('quickbooks', env).state === 'ready',
    xero: providerConfig('xero', env).state === 'ready',
  };
}

/**
 * Providers the owner started configuring but left incomplete, with the missing variable
 * names (never values), for /api/ready. An untouched provider is the normal "off" state.
 */
export function incompleteProviders(env: Environment): Partial<Record<ProviderId, string[]>> {
  const report: Partial<Record<ProviderId, string[]>> = {};
  for (const provider of PROVIDER_IDS) {
    const names = PROVIDER_ENV[provider];
    const started = Boolean(present(env[names.clientId]) || present(env[names.clientSecret]));
    const config = providerConfig(provider, env);
    if (started && config.state === 'disabled') report[provider] = config.missing;
  }
  return report;
}
