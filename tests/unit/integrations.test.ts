import { randomBytes } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { fetchQuickBooks, fetchXero, PAGE_SIZE } from '@/lib/integrations/api';
import {
  nonceHash,
  openToken,
  parseTokenKey,
  pkceChallenge,
  pkcePair,
  sealToken,
  signState,
  tokenContext,
  verifyState,
  type StatePayload,
} from '@/lib/integrations/crypto';
import { errorDetail, ProviderError, readBounded } from '@/lib/integrations/http';
import {
  countryCode,
  mapQuickBooksCustomers,
  mapQuickBooksItems,
  mapXeroContacts,
  mapXeroItems,
} from '@/lib/integrations/mapping';
import {
  authorizationUrl,
  exchangeCode,
  readTokenSet,
  refreshTokens,
  revokeToken,
  xeroTenant,
} from '@/lib/integrations/oauth';
import {
  providerCapabilities,
  providerConfig,
  type ProviderConfig,
} from '@/lib/integrations/providers';
import {
  featureOffered,
  featurePlans,
  FEATURES,
  offeredFeatures,
  paidAdditions,
  paidOnlyFeatures,
  paidOnlySummary,
  type Feature,
} from '@/lib/billing/plans';

/**
 * QuickBooks Online and Xero import (D-025), without the network: token sealing, signed
 * single-use state, PKCE, provider configuration, the OAuth calls and API paging against a
 * recording fetch, response mapping on fixtures shaped like the providers' documented
 * schemas, and the plan gate in plans.ts.
 */

const ORG = '11111111-1111-4111-8111-111111111111';
const USER = '22222222-2222-4222-8222-222222222222';
const KEY_HEX = 'a3'.repeat(16) + '5c'.repeat(16);
const key = parseTokenKey(KEY_HEX) as Buffer;

const ENV = {
  APP_URL: 'https://tradedocs.example',
  QUICKBOOKS_CLIENT_ID: 'ABsyntheticQuickBooksClientId',
  QUICKBOOKS_CLIENT_SECRET: 'synthetic-quickbooks-secret-value',
  XERO_CLIENT_ID: 'SYNTHETICXEROCLIENTID',
  XERO_CLIENT_SECRET: 'synthetic-xero-secret-value-1234',
  INTEGRATION_TOKEN_KEY: KEY_HEX,
};

function ready(provider: 'quickbooks' | 'xero'): Extract<ProviderConfig, { state: 'ready' }> {
  const config = providerConfig(provider, ENV);
  if (config.state !== 'ready') throw new Error('fixture config not ready');
  return config;
}

type Call = { url: string; init: RequestInit };

/** A fetch that records each call and answers from the queue, in order. */
function recorder(responses: (() => Response)[]) {
  const calls: Call[] = [];
  const fetcher = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} });
    const next = responses.shift();
    if (!next) throw new Error('unexpected request');
    return next();
  }) as typeof fetch;
  return { calls, fetcher };
}

const json =
  (body: unknown, status = 200) =>
  () =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

// --- Encryption -------------------------------------------------------------------------

describe('stored tokens are sealed with AES-256-GCM', () => {
  it('reads a 32-byte key as hex or base64 and refuses anything else', () => {
    expect(parseTokenKey(KEY_HEX)?.length).toBe(32);
    expect(parseTokenKey(randomBytes(32).toString('base64'))?.length).toBe(32);
    expect(parseTokenKey(randomBytes(32).toString('base64url'))?.length).toBe(32);
    expect(parseTokenKey(undefined)).toBeNull();
    expect(parseTokenKey('')).toBeNull();
    expect(parseTokenKey('short')).toBeNull();
    expect(parseTokenKey(randomBytes(16).toString('hex'))).toBeNull();
    expect(parseTokenKey('00'.repeat(32))).toBeNull();
  });

  it('round-trips a token and never stores it in the clear', () => {
    const context = tokenContext(ORG, 'xero', 'refresh');
    const sealed = sealToken(key, 'refresh-token-value', context);
    expect(sealed).not.toContain('refresh-token-value');
    expect(sealed.startsWith('v1.')).toBe(true);
    expect(openToken(key, sealed, context)).toBe('refresh-token-value');
  });

  it('uses a fresh IV, so the same token seals differently each time', () => {
    const context = tokenContext(ORG, 'xero', 'access');
    expect(sealToken(key, 'same', context)).not.toBe(sealToken(key, 'same', context));
  });

  it('refuses a ciphertext moved to another organization, provider or column', () => {
    const sealed = sealToken(key, 'value', tokenContext(ORG, 'xero', 'refresh'));
    expect(openToken(key, sealed, tokenContext(USER, 'xero', 'refresh'))).toBeNull();
    expect(openToken(key, sealed, tokenContext(ORG, 'quickbooks', 'refresh'))).toBeNull();
    expect(openToken(key, sealed, tokenContext(ORG, 'xero', 'access'))).toBeNull();
  });

  it('refuses a tampered ciphertext or another key', () => {
    const context = tokenContext(ORG, 'quickbooks', 'access');
    const sealed = sealToken(key, 'value', context);
    const parts = sealed.split('.');
    const body = Buffer.from(parts[3] as string, 'base64url');
    body[0] = (body[0] as number) ^ 1;
    parts[3] = body.toString('base64url');
    expect(openToken(key, parts.join('.'), context)).toBeNull();
    expect(openToken(randomBytes(32), sealed, context)).toBeNull();
    expect(openToken(key, 'not-a-sealed-value', context)).toBeNull();
  });
});

// --- State and PKCE ---------------------------------------------------------------------

describe('OAuth state is signed, expiring and bound to its flow', () => {
  const now = new Date('2026-10-09T12:00:00Z');
  const payload: StatePayload = {
    n: 'n'.repeat(43),
    o: ORG,
    p: 'xero',
    u: USER,
    e: Math.floor(now.getTime() / 1000) + 600,
  };

  it('verifies what it signed', () => {
    const check = verifyState(key, signState(key, payload), now);
    expect(check).toEqual({ ok: true, payload });
  });

  it('refuses an altered payload', () => {
    const [version, , mac] = signState(key, payload).split('.');
    const forged = Buffer.from(JSON.stringify({ ...payload, o: USER })).toString('base64url');
    expect(verifyState(key, `${version}.${forged}.${mac}`, now)).toEqual({
      ok: false,
      reason: 'signature',
    });
  });

  it('refuses a state signed with another key', () => {
    expect(verifyState(key, signState(randomBytes(32), payload), now)).toEqual({
      ok: false,
      reason: 'signature',
    });
  });

  it('refuses an expired state', () => {
    const later = new Date(now.getTime() + 601_000);
    expect(verifyState(key, signState(key, payload), later)).toEqual({
      ok: false,
      reason: 'expired',
    });
  });

  it('refuses malformed input without throwing', () => {
    for (const token of ['', 'x', 's1.a', 's2.a.b', 's1.a.b.c', 'x'.repeat(3000)]) {
      expect(verifyState(key, token, now).ok).toBe(false);
    }
  });

  it('keys the single-use row by a hash of the nonce, never the nonce itself', () => {
    expect(nonceHash('abc')).toMatch(/^[0-9a-f]{64}$/);
    expect(nonceHash('abc')).not.toContain('abc');
  });

  it('derives the PKCE challenge as RFC 7636 appendix B does', () => {
    expect(pkceChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    );
    const pair = pkcePair();
    expect(pair.verifier).toMatch(/^[A-Za-z0-9_-]{43,128}$/);
    expect(pkceChallenge(pair.verifier)).toBe(pair.challenge);
  });
});

// --- Configuration ----------------------------------------------------------------------

describe('a provider is available only with complete configuration', () => {
  it('is disabled, naming what is missing, with no credentials', () => {
    const config = providerConfig('quickbooks', {});
    expect(config.state).toBe('disabled');
    if (config.state === 'disabled') {
      expect(config.missing).toEqual([
        'QUICKBOOKS_CLIENT_ID',
        'QUICKBOOKS_CLIENT_SECRET',
        'INTEGRATION_TOKEN_KEY',
        'APP_URL',
      ]);
    }
  });

  it('treats blank values as unset and a bad token key as missing', () => {
    expect(providerConfig('xero', { ...ENV, XERO_CLIENT_ID: '   ' }).state).toBe('disabled');
    expect(providerConfig('xero', { ...ENV, INTEGRATION_TOKEN_KEY: 'not-a-key' }).state).toBe(
      'disabled',
    );
    expect(providerConfig('xero', { ...ENV, APP_URL: 'https://x.example/path' }).state).toBe(
      'disabled',
    );
  });

  it('builds the registered redirect URI from APP_URL', () => {
    expect(ready('quickbooks').redirectUri).toBe(
      'https://tradedocs.example/api/integrations/quickbooks/callback',
    );
    expect(ready('xero').redirectUri).toBe(
      'https://tradedocs.example/api/integrations/xero/callback',
    );
  });

  it('uses the QuickBooks sandbox outside production unless told otherwise', () => {
    expect(ready('quickbooks').quickbooksEnvironment).toBe('sandbox');
    const production = providerConfig('quickbooks', { ...ENV, APP_ENV: 'production' });
    expect(production.state === 'ready' && production.quickbooksEnvironment).toBe('production');
    const chosen = providerConfig('quickbooks', { ...ENV, QUICKBOOKS_ENVIRONMENT: 'production' });
    expect(chosen.state === 'ready' && chosen.quickbooksEnvironment).toBe('production');
  });

  it('reports each provider independently', () => {
    const withoutXero = { ...ENV, XERO_CLIENT_SECRET: '' };
    expect(providerCapabilities(withoutXero)).toEqual({ quickbooks: true, xero: false });
    expect(providerCapabilities({})).toEqual({ quickbooks: false, xero: false });
  });
});

// --- OAuth calls ------------------------------------------------------------------------

describe('the authorization code flow', () => {
  it('asks QuickBooks for the accounting scope, without PKCE', () => {
    const url = new URL(authorizationUrl(ready('quickbooks'), 'STATE', 'CHALLENGE'));
    expect(url.origin + url.pathname).toBe('https://appcenter.intuit.com/connect/oauth2');
    expect(url.searchParams.get('scope')).toBe('com.intuit.quickbooks.accounting');
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('state')).toBe('STATE');
    expect(url.searchParams.get('code_challenge')).toBeNull();
  });

  it('asks Xero for read scopes and offline access, with an S256 challenge', () => {
    const url = new URL(authorizationUrl(ready('xero'), 'STATE', 'CHALLENGE'));
    expect(url.origin + url.pathname).toBe('https://login.xero.com/identity/connect/authorize');
    expect(url.searchParams.get('scope')).toBe(
      'offline_access accounting.contacts.read accounting.settings.read',
    );
    expect(url.searchParams.get('code_challenge')).toBe('CHALLENGE');
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('redirect_uri')).toBe(ready('xero').redirectUri);
  });

  it('exchanges a code with HTTP Basic client authentication and the verifier', async () => {
    const now = new Date('2026-10-09T12:00:00Z');
    const { calls, fetcher } = recorder([
      json({ access_token: 'AT', refresh_token: 'RT', expires_in: 1800, token_type: 'Bearer' }),
    ]);
    const tokens = await exchangeCode(ready('xero'), 'CODE', 'VERIFIER', fetcher, now);
    expect(tokens.accessToken).toBe('AT');
    expect(tokens.accessExpiresAt.toISOString()).toBe('2026-10-09T12:30:00.000Z');
    const call = calls[0] as Call;
    expect(call.url).toBe('https://identity.xero.com/connect/token');
    expect(call.init.redirect).toBe('error');
    const headers = call.init.headers as Record<string, string>;
    expect(headers.Authorization).toBe(
      `Basic ${Buffer.from(`${ENV.XERO_CLIENT_ID}:${ENV.XERO_CLIENT_SECRET}`).toString('base64')}`,
    );
    const form = new URLSearchParams(call.init.body as string);
    expect(form.get('grant_type')).toBe('authorization_code');
    expect(form.get('code_verifier')).toBe('VERIFIER');
    expect(form.get('client_secret')).toBeNull();
  });

  it('records the QuickBooks refresh token lifetime it states', () => {
    const now = new Date('2026-10-09T12:00:00Z');
    const set = readTokenSet(
      {
        access_token: 'a',
        refresh_token: 'r',
        expires_in: 3600,
        x_refresh_token_expires_in: 8_726_400,
      },
      now,
    );
    expect(set.refreshExpiresAt?.toISOString()).toBe('2027-01-18T12:00:00.000Z');
    expect(() => readTokenSet({ access_token: 'a', expires_in: 3600 }, now)).toThrow(ProviderError);
    expect(() => readTokenSet({ refresh_token: 'r', expires_in: 3600 }, now)).toThrow(
      ProviderError,
    );
  });

  it('keeps the old refresh token when a refresh does not rotate it', async () => {
    const { fetcher } = recorder([json({ access_token: 'AT2', expires_in: 3600 })]);
    const set = await refreshTokens(ready('quickbooks'), 'RT1', fetcher);
    expect(set.refreshToken).toBe('RT1');
  });

  it('reports a refused refresh as invalid_grant', async () => {
    const { fetcher } = recorder([json({ error: 'invalid_grant' }, 400)]);
    await expect(refreshTokens(ready('xero'), 'RT', fetcher)).rejects.toMatchObject({
      code: 'invalid_grant',
    });
  });

  it('revokes at each provider in the form it documents', async () => {
    const quickbooks = recorder([() => new Response(null, { status: 200 })]);
    await revokeToken(ready('quickbooks'), 'RT', quickbooks.fetcher);
    expect(quickbooks.calls[0]?.url).toBe(
      'https://developer.api.intuit.com/v2/oauth2/tokens/revoke',
    );
    expect(JSON.parse(quickbooks.calls[0]?.init.body as string)).toEqual({ token: 'RT' });

    const xero = recorder([() => new Response(null, { status: 200 })]);
    await revokeToken(ready('xero'), 'RT', xero.fetcher);
    expect(xero.calls[0]?.url).toBe('https://identity.xero.com/connect/revocation');
    expect(new URLSearchParams(xero.calls[0]?.init.body as string).get('token')).toBe('RT');
  });

  it('picks the Xero organisation this authorization connected', async () => {
    const claims = Buffer.from(JSON.stringify({ authentication_event_id: 'evt-2' })).toString(
      'base64url',
    );
    const token = `header.${claims}.signature`;
    const { calls, fetcher } = recorder([
      json([
        {
          id: 'c1',
          authEventId: 'evt-1',
          tenantId: 't-old',
          tenantType: 'ORGANISATION',
          tenantName: 'Old Ltd',
          createdDateUtc: '2026-10-09T12:00:00',
        },
        {
          id: 'c2',
          authEventId: 'evt-2',
          tenantId: 't-new',
          tenantType: 'ORGANISATION',
          tenantName: 'New Ltd',
          createdDateUtc: '2026-01-01T00:00:00',
        },
        { id: 'c3', authEventId: 'evt-2', tenantId: 't-practice', tenantType: 'PRACTICEMANAGER' },
      ]),
    ]);
    await expect(xeroTenant(token, fetcher)).resolves.toEqual({ id: 't-new', name: 'New Ltd' });
    expect(calls[0]?.url).toBe('https://api.xero.com/connections');
  });
});

// --- API reads --------------------------------------------------------------------------

describe('provider reads are paged and bounded', () => {
  const page = (count: number, offset = 0) =>
    Array.from({ length: count }, (_, index) => ({ Id: String(offset + index + 1) }));

  it('pages QuickBooks with STARTPOSITION and MAXRESULTS until a short page', async () => {
    const { calls, fetcher } = recorder([
      json({ QueryResponse: { Customer: page(PAGE_SIZE) } }),
      json({ QueryResponse: { Customer: page(40, PAGE_SIZE) } }),
    ]);
    const result = await fetchQuickBooks(
      'company',
      { accessToken: 'AT', tenantId: '9130000000000001' },
      'sandbox',
      2000,
      fetcher,
    );
    expect(result.entries).toHaveLength(140);
    expect(result.truncated).toBe(false);
    const first = new URL(calls[0]?.url as string);
    expect(first.origin).toBe('https://sandbox-quickbooks.api.intuit.com');
    expect(first.pathname).toBe('/v3/company/9130000000000001/query');
    expect(first.searchParams.get('query')).toBe(
      'select * from Customer STARTPOSITION 1 MAXRESULTS 100',
    );
    expect(new URL(calls[1]?.url as string).searchParams.get('query')).toContain(
      'STARTPOSITION 101',
    );
    expect((calls[0]?.init.headers as Record<string, string>).Authorization).toBe('Bearer AT');
  });

  it('stops at the import limit and says there were more', async () => {
    const { calls, fetcher } = recorder([
      json({ QueryResponse: { Item: page(PAGE_SIZE) } }),
      json({ QueryResponse: { Item: page(PAGE_SIZE, PAGE_SIZE) } }),
    ]);
    const result = await fetchQuickBooks(
      'product',
      { accessToken: 'AT', tenantId: '1' },
      'production',
      150,
      fetcher,
    );
    expect(result.entries).toHaveLength(150);
    expect(result.truncated).toBe(true);
    expect(calls).toHaveLength(2);
  });

  it('refuses a QuickBooks company id that is not a realm id', async () => {
    const { fetcher } = recorder([]);
    await expect(
      fetchQuickBooks('company', { accessToken: 'AT', tenantId: '../x' }, 'sandbox', 10, fetcher),
    ).rejects.toBeInstanceOf(ProviderError);
  });

  it('pages Xero contacts and names the tenant on every call', async () => {
    const { calls, fetcher } = recorder([
      json({ Contacts: page(PAGE_SIZE) }),
      json({ Contacts: [] }),
    ]);
    const result = await fetchXero(
      'company',
      { accessToken: 'AT', tenantId: 'tenant-1' },
      2000,
      fetcher,
    );
    expect(result.entries).toHaveLength(PAGE_SIZE);
    expect(calls).toHaveLength(2);
    const url = new URL(calls[1]?.url as string);
    expect(url.pathname).toBe('/api.xro/2.0/Contacts');
    expect(url.searchParams.get('page')).toBe('2');
    expect((calls[0]?.init.headers as Record<string, string>)['xero-tenant-id']).toBe('tenant-1');
  });

  it('classifies provider failures', async () => {
    for (const [status, code] of [
      [401, 'unauthorized'],
      [403, 'forbidden'],
      [429, 'rate_limited'],
      [500, 'unavailable'],
    ] as const) {
      const { fetcher } = recorder([json({ Title: 'Nope', Detail: 'Reason' }, status)]);
      await expect(
        fetchXero('product', { accessToken: 'AT', tenantId: 't' }, 10, fetcher),
      ).rejects.toMatchObject({ code, status, detail: 'Nope: Reason' });
    }
  });

  it('refuses an oversized body rather than reading it whole', async () => {
    const response = new Response('x'.repeat(2000));
    await expect(readBounded(response, 1000)).rejects.toMatchObject({ code: 'too_large' });
  });

  it('never repeats a token in an error detail', () => {
    // Built at runtime so the secret scanner does not read a synthetic token as a leak.
    const part = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
    const jwt = [part({ alg: 'RS256' }), part({ sub: 'synthetic' }), 'c2lnbmF0dXJl'].join('.');
    expect(errorDetail(JSON.stringify({ error: 'invalid_token', error_description: jwt }))).toBe(
      'invalid_token: [redacted]',
    );
  });
});

// --- Mapping ----------------------------------------------------------------------------

describe('QuickBooks records map onto the directory and catalog', () => {
  const customer = {
    Id: '58',
    DisplayName: 'Harbour Imports',
    CompanyName: 'Harbour Imports B.V.',
    GivenName: 'Anna',
    FamilyName: 'de Vries',
    Active: true,
    PrimaryEmailAddr: { Address: 'orders@harbour.example' },
    PrimaryPhone: { FreeFormNumber: '+31 10 123 4567' },
    BillAddr: {
      Line1: 'Wilhelminakade 1',
      Line2: 'Unit 4',
      City: 'Rotterdam',
      CountrySubDivisionCode: 'ZH',
      PostalCode: '3072 AP',
      Country: 'Netherlands',
    },
  };

  it('maps a customer', () => {
    const { records, ignored } = mapQuickBooksCustomers([customer]);
    expect(ignored).toBe(0);
    expect(records[0]).toEqual({
      external_id: '58',
      line: 1,
      label: 'Harbour Imports B.V.',
      notes: [],
      values: {
        kind: 'customer',
        name: 'Harbour Imports B.V.',
        legal_name: 'Harbour Imports B.V.',
        contact_name: 'Anna de Vries',
        tax_number: null,
        registration_number: null,
        email: 'orders@harbour.example',
        phone: '+31 10 123 4567',
        address_line1: 'Wilhelminakade 1',
        address_line2: 'Unit 4',
        city: 'Rotterdam',
        region: 'ZH',
        postal_code: '3072 AP',
        country_code: 'NL',
      },
    });
  });

  it('skips inactive customers and leaves unusable values blank with a note', () => {
    const { records, ignored } = mapQuickBooksCustomers([
      { ...customer, Id: '1', Active: false },
      {
        Id: '2',
        DisplayName: 'Narnia Co',
        PrimaryEmailAddr: { Address: 'not an email' },
        BillAddr: { Country: 'Narnia' },
      },
      'not an object',
    ]);
    expect(ignored).toBe(1);
    expect(records).toHaveLength(1);
    expect(records[0]?.values.email).toBeNull();
    expect(records[0]?.values.country_code).toBeNull();
    expect(records[0]?.notes).toEqual([
      'The email address was not valid and was left blank.',
      'Country “Narnia” was not recognised and was left blank.',
    ]);
  });

  it('maps items, skipping categories, with exact prices', () => {
    const { records, ignored } = mapQuickBooksItems([
      {
        Id: '1',
        Name: 'Tea towel',
        Sku: 'TT-50',
        Description: 'Cotton tea towel, 50 x 70 cm',
        UnitPrice: 2.4,
        Type: 'Inventory',
        Active: true,
      },
      { Id: '2', Name: 'Mug', UnitPrice: 3, Type: 'NonInventory' },
      { Id: '3', Name: 'Kitchen', Type: 'Category' },
      { Id: '4', Name: 'Old', Active: false },
    ]);
    expect(ignored).toBe(2);
    expect(records.map((record) => record.values)).toEqual([
      { sku: 'TT-50', description: 'Cotton tea towel, 50 x 70 cm', unit_price: '2.4', unit: 'pcs' },
      { sku: null, description: 'Mug', unit_price: '3', unit: 'pcs' },
    ]);
  });
});

describe('Xero records map onto the directory and catalog', () => {
  it('maps a contact, preferring the street address and the default phone', () => {
    const { records } = mapXeroContacts([
      {
        ContactID: 'bd2270c3-8706-4c11-9cfb-000b551c3f51',
        ContactStatus: 'ACTIVE',
        Name: 'Quayside Trading GmbH',
        FirstName: 'Jonas',
        LastName: 'Becker',
        EmailAddress: 'jonas@quayside.example',
        TaxNumber: 'DE123456789',
        CompanyNumber: 'HRB 1234',
        IsSupplier: true,
        IsCustomer: false,
        Addresses: [
          {
            AddressType: 'POBOX',
            AddressLine1: 'Postfach 10',
            City: 'Hamburg',
            Country: 'Germany',
          },
          {
            AddressType: 'STREET',
            AddressLine1: 'Kehrwieder 2',
            AddressLine2: 'Block D',
            City: 'Hamburg',
            Region: 'HH',
            PostalCode: '20457',
            Country: 'DE',
          },
        ],
        Phones: [
          { PhoneType: 'MOBILE', PhoneNumber: '1700000' },
          {
            PhoneType: 'DEFAULT',
            PhoneCountryCode: '49',
            PhoneAreaCode: '40',
            PhoneNumber: '1234567',
          },
        ],
      },
    ]);
    expect(records[0]?.values).toEqual({
      kind: 'supplier',
      name: 'Quayside Trading GmbH',
      legal_name: null,
      contact_name: 'Jonas Becker',
      tax_number: 'DE123456789',
      registration_number: 'HRB 1234',
      email: 'jonas@quayside.example',
      phone: '+49 40 1234567',
      address_line1: 'Kehrwieder 2',
      address_line2: 'Block D',
      city: 'Hamburg',
      region: 'HH',
      postal_code: '20457',
      country_code: 'DE',
    });
  });

  it('skips archived contacts and keeps customers as customers', () => {
    const { records, ignored } = mapXeroContacts([
      { ContactID: 'a', ContactStatus: 'ARCHIVED', Name: 'Gone' },
      { ContactID: 'b', ContactStatus: 'ACTIVE', Name: 'Both', IsSupplier: true, IsCustomer: true },
    ]);
    expect(ignored).toBe(1);
    expect(records[0]?.values.kind).toBe('customer');
  });

  it('maps items with their code and sales price', () => {
    const { records } = mapXeroItems([
      {
        ItemID: 'c8c54d65',
        Code: '123',
        Name: 'Strat',
        Description: 'Guitars Fender Strat',
        SalesDetails: { UnitPrice: 5000.0 },
      },
      { ItemID: 'd1', Code: 'NOPRICE', Name: 'Sample' },
    ]);
    expect(records.map((record) => record.values)).toEqual([
      { sku: '123', description: 'Guitars Fender Strat', unit_price: '5000', unit: 'pcs' },
      { sku: 'NOPRICE', description: 'Sample', unit_price: null, unit: 'pcs' },
    ]);
  });

  it('reads countries as files write them', () => {
    expect(countryCode('USA')).toBe('US');
    expect(countryCode('United States')).toBe('US');
    expect(countryCode('united kingdom')).toBe('GB');
    expect(countryCode('UK')).toBe('GB');
    expect(countryCode('nz')).toBe('NZ');
    expect(countryCode('New Zealand')).toBe('NZ');
    expect(countryCode('Atlantis')).toBeNull();
    expect(countryCode('')).toBeNull();
  });
});

// --- Plan gate --------------------------------------------------------------------------

describe('the imports are paid features claimed only where configured', () => {
  const find = (key: string) => (FEATURES as readonly Feature[]).find((entry) => entry.key === key);

  it('belong to Pro and Team only', () => {
    expect(featurePlans('integrations.quickbooks')).toEqual(['pro', 'team']);
    expect(featurePlans('integrations.xero')).toEqual(['pro', 'team']);
  });

  it('are not offered without their capability', () => {
    const quickbooks = find('integrations.quickbooks') as Feature;
    expect(featureOffered(quickbooks)).toBe(false);
    expect(featureOffered(quickbooks, { xero_import: true })).toBe(false);
    expect(featureOffered(quickbooks, { quickbooks_import: true })).toBe(true);
    expect(offeredFeatures().some((feature) => feature.key.startsWith('integrations.'))).toBe(
      false,
    );
    expect(paidOnlySummary()).toBe('PDF branding and the REST API');
  });

  it('are listed per provider once configured', () => {
    expect(paidOnlyFeatures('pro', { xero_import: true }).map((feature) => feature.key)).toEqual([
      'pdf_branding',
      'integrations.xero',
    ]);
    expect(paidOnlySummary({ quickbooks_import: true, xero_import: true })).toBe(
      'PDF branding, QuickBooks import, Xero import and the REST API',
    );
    expect(paidAdditions({ quickbooks_import: true, xero_import: true })).toBe(
      'Pro and Team add PDF branding, QuickBooks import and Xero import; Team also adds the REST API',
    );
  });
});
