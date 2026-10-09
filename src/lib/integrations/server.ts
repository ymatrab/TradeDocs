import 'server-only';

import type { Capabilities } from '@/lib/billing/plans';
import {
  newNonce,
  nonceHash,
  openToken,
  pkcePair,
  sealToken,
  signState,
  STATE_TTL_SECONDS,
  tokenContext,
} from '@/lib/integrations/crypto';
import { ProviderError, type Fetcher } from '@/lib/integrations/http';
import {
  authorizationUrl,
  refreshTokens,
  revokeToken,
  type TokenSet,
} from '@/lib/integrations/oauth';
import {
  PROVIDER_ENDPOINTS,
  providerCapabilities,
  providerConfig,
  type ProviderConfig,
  type ProviderId,
} from '@/lib/integrations/providers';
import { createServiceClient } from '@/lib/supabase/admin';

/**
 * Accounting connections on the server. The tables holding tokens and OAuth states are
 * reachable by the service role only (20261009000500_accounting_integrations.sql); every
 * function here is called after the caller has been authorized as an owner or administrator
 * of the organization, by the action or route that calls it.
 *
 * Credentials are read per feature, outside the strict configuration schema: a missing or
 * malformed value disables that provider and never the deployment.
 */

export type ReadyConfig = Extract<ProviderConfig, { state: 'ready' }>;

export function currentProviderConfig(provider: ProviderId): ProviderConfig {
  return providerConfig(provider, process.env);
}

/** Capability flags for public copy (plans.ts offeredFeatures). Never throws. */
export function currentCapabilities(): Capabilities {
  try {
    const ready = providerCapabilities(process.env);
    return { quickbooks_import: ready.quickbooks, xero_import: ready.xero };
  } catch {
    return {};
  }
}

// --- Starting a connection --------------------------------------------------------------

/**
 * Records a single-use state and returns the provider's authorization URL. Expired states of
 * any organization are cleared on the way, so the table stays small without a job.
 */
export async function beginAuthorization(
  config: ReadyConfig,
  org: string,
  user: string,
  now = new Date(),
): Promise<string> {
  const client = createServiceClient();
  await client
    .from('integration_oauth_states')
    .delete()
    .lt('expires_at', new Date(now.getTime() - 3_600_000).toISOString());

  const nonce = newNonce();
  const pkce = PROVIDER_ENDPOINTS[config.provider].pkce ? pkcePair() : null;
  const expires = new Date(now.getTime() + STATE_TTL_SECONDS * 1000);
  const { error } = await client.from('integration_oauth_states').insert({
    nonce_hash: nonceHash(nonce),
    org_id: org,
    provider: config.provider,
    user_id: user,
    code_verifier_ciphertext: pkce
      ? sealToken(config.tokenKey, pkce.verifier, tokenContext(org, config.provider, 'verifier'))
      : null,
    created_at: now.toISOString(),
    expires_at: expires.toISOString(),
  });
  if (error)
    throw new Error(`Could not record the authorization state (${error.code ?? 'unknown'}).`);

  const state = signState(config.tokenKey, {
    n: nonce,
    o: org,
    p: config.provider,
    u: user,
    e: Math.floor(expires.getTime() / 1000),
  });
  return authorizationUrl(config, state, pkce?.challenge ?? null);
}

export type ConsumedState =
  { ok: true; codeVerifier: string | null } | { ok: false; reason: 'used_or_expired' | 'mismatch' };

/**
 * Marks a state used, exactly once: the update matches only an unconsumed, unexpired row for
 * this organization, provider and user, so a replayed or raced callback gets nothing.
 */
export async function consumeState(
  config: ReadyConfig,
  nonce: string,
  org: string,
  user: string,
  now = new Date(),
): Promise<ConsumedState> {
  const client = createServiceClient();
  const { data, error } = await client
    .from('integration_oauth_states')
    .update({ consumed_at: now.toISOString() })
    .eq('nonce_hash', nonceHash(nonce))
    .eq('org_id', org)
    .eq('provider', config.provider)
    .eq('user_id', user)
    .is('consumed_at', null)
    .gt('expires_at', now.toISOString())
    .select('code_verifier_ciphertext');
  if (error)
    throw new Error(`Could not read the authorization state (${error.code ?? 'unknown'}).`);
  const row = data?.[0];
  if (!row) return { ok: false, reason: 'used_or_expired' };
  if (!row.code_verifier_ciphertext) return { ok: true, codeVerifier: null };
  const verifier = openToken(
    config.tokenKey,
    row.code_verifier_ciphertext,
    tokenContext(org, config.provider, 'verifier'),
  );
  if (!verifier) return { ok: false, reason: 'mismatch' };
  return { ok: true, codeVerifier: verifier };
}

// --- Stored connections -----------------------------------------------------------------

function sealed(config: ReadyConfig, org: string, tokens: TokenSet) {
  return {
    access_token_ciphertext: sealToken(
      config.tokenKey,
      tokens.accessToken,
      tokenContext(org, config.provider, 'access'),
    ),
    refresh_token_ciphertext: sealToken(
      config.tokenKey,
      tokens.refreshToken,
      tokenContext(org, config.provider, 'refresh'),
    ),
    access_expires_at: tokens.accessExpiresAt.toISOString(),
    refresh_expires_at: tokens.refreshExpiresAt?.toISOString() ?? null,
  };
}

/** Saves (or replaces) the organization's connection and audits it. */
export async function saveConnection(
  config: ReadyConfig,
  org: string,
  user: string,
  tokens: TokenSet,
  tenant: { id: string; name: string | null },
): Promise<void> {
  const client = createServiceClient();
  const { error } = await client.from('integration_connections').upsert(
    {
      org_id: org,
      provider: config.provider,
      external_tenant_id: tenant.id,
      tenant_name: tenant.name,
      scopes: (tokens.scope ?? PROVIDER_ENDPOINTS[config.provider].scopes.join(' ')).slice(0, 1000),
      ...sealed(config, org, tokens),
      status: 'active',
      connected_by: user,
      connected_at: new Date().toISOString(),
    },
    { onConflict: 'org_id,provider' },
  );
  if (error) throw new Error(`Could not save the connection (${error.code ?? 'unknown'}).`);
  await audit(org, user, 'integration.connected', config.provider, {});
}

export type OpenConnection = {
  tenantId: string;
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: Date;
  status: 'active' | 'needs_reconnect';
};

/** The organization's connection with its tokens opened, or null when there is none. */
export async function loadConnection(
  config: ReadyConfig,
  org: string,
): Promise<OpenConnection | null> {
  const client = createServiceClient();
  const { data, error } = await client
    .from('integration_connections')
    .select(
      'external_tenant_id, access_token_ciphertext, refresh_token_ciphertext, access_expires_at, status',
    )
    .eq('org_id', org)
    .eq('provider', config.provider)
    .maybeSingle();
  if (error) throw new Error(`Could not read the connection (${error.code ?? 'unknown'}).`);
  if (!data) return null;
  const accessToken = openToken(
    config.tokenKey,
    data.access_token_ciphertext,
    tokenContext(org, config.provider, 'access'),
  );
  const refreshToken = openToken(
    config.tokenKey,
    data.refresh_token_ciphertext,
    tokenContext(org, config.provider, 'refresh'),
  );
  // A rotated or wrong INTEGRATION_TOKEN_KEY: the stored tokens cannot be used again.
  if (!accessToken || !refreshToken) {
    await markNeedsReconnect(config, org);
    throw new ProviderError('invalid_grant', 'Stored credentials could not be opened. Reconnect.');
  }
  return {
    tenantId: data.external_tenant_id,
    accessToken,
    refreshToken,
    accessExpiresAt: new Date(data.access_expires_at),
    status: data.status === 'active' ? 'active' : 'needs_reconnect',
  };
}

async function markNeedsReconnect(config: ReadyConfig, org: string): Promise<void> {
  const client = createServiceClient();
  await client
    .from('integration_connections')
    .update({ status: 'needs_reconnect' })
    .eq('org_id', org)
    .eq('provider', config.provider);
}

/**
 * An access token valid for at least another minute, refreshing (and storing the rotated
 * refresh token) when needed. A refused refresh marks the connection for reconnecting.
 */
export async function usableAccessToken(
  config: ReadyConfig,
  org: string,
  connection: OpenConnection,
  fetcher: Fetcher = fetch,
  now = new Date(),
): Promise<string> {
  if (connection.accessExpiresAt.getTime() - now.getTime() > 60_000) return connection.accessToken;
  let tokens: TokenSet;
  try {
    tokens = await refreshTokens(config, connection.refreshToken, fetcher, now);
  } catch (error) {
    if (
      error instanceof ProviderError &&
      (error.code === 'invalid_grant' || error.code === 'unauthorized')
    ) {
      await markNeedsReconnect(config, org);
    }
    throw error;
  }
  const client = createServiceClient();
  const { error } = await client
    .from('integration_connections')
    .update({ ...sealed(config, org, tokens), status: 'active' })
    .eq('org_id', org)
    .eq('provider', config.provider);
  if (error) throw new Error(`Could not store refreshed credentials (${error.code ?? 'unknown'}).`);
  return tokens.accessToken;
}

/**
 * Disconnects: revokes the grant at the provider, then deletes the stored tokens whatever the
 * provider answered, so TradeDocs never keeps a credential the owner asked it to drop. Returns
 * whether the provider confirmed the revocation, for the message and the audit record.
 */
export async function removeConnection(
  config: ReadyConfig,
  org: string,
  user: string,
  fetcher: Fetcher = fetch,
): Promise<{ removed: boolean; revoked: boolean }> {
  let connection: OpenConnection | null = null;
  try {
    connection = await loadConnection(config, org);
  } catch {
    connection = null;
  }
  let revoked = false;
  if (connection) {
    try {
      await revokeToken(config, connection.refreshToken, fetcher);
      revoked = true;
    } catch {
      revoked = false;
    }
  }
  const client = createServiceClient();
  const { data, error } = await client
    .from('integration_connections')
    .delete()
    .eq('org_id', org)
    .eq('provider', config.provider)
    .select('id');
  if (error) throw new Error(`Could not remove the connection (${error.code ?? 'unknown'}).`);
  const removed = Boolean(data?.length);
  if (removed) await audit(org, user, 'integration.disconnected', config.provider, { revoked });
  return { removed, revoked };
}

async function audit(
  org: string,
  user: string,
  action: string,
  provider: ProviderId,
  extra: Record<string, boolean | string>,
): Promise<void> {
  const client = createServiceClient();
  const { error } = await client.from('audit_events').insert({
    org_id: org,
    actor_id: user,
    action,
    target_type: 'integration',
    target_id: provider,
    metadata: { provider, ...extra },
  });
  if (error)
    console.error('integration audit write failed', { action, provider, code: error.code });
}
