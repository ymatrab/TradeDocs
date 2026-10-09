import { describe, expect, it } from 'vitest';
import {
  apiKeyMatches,
  apiKeyPepper,
  generateApiKey,
  hashApiKey,
  isWellFormedApiKey,
  readBearer,
} from '@/lib/api/keys';
import {
  API_DOCUMENT_KINDS,
  createShipmentSchema,
  decodeCursor,
  encodeCursor,
  generateDocumentSchema,
  issuesOf,
  pageOf,
  readPageQuery,
  requestFingerprint,
} from '@/lib/api/schemas';
import { featurePlans, paidAdditions, paidOnlySummary } from '@/lib/billing/plans';
import { hasEntitlement, type EntitlementRead } from '@/lib/billing/server';
import { documentKindLabels } from '@/lib/labels';
import { API_MAX_LINES } from '@/lib/limits';

// Synthetic values only; none of these is, or resembles, a configured secret.
const PEPPER = 'synthetic-api-pepper-for-unit-tests-0001';
const OTHER_PEPPER = 'synthetic-api-pepper-for-unit-tests-0002';
const ORG = '11111111-1111-4111-8111-111111111111';

describe('API keys', () => {
  it('generates a well-formed key with a 12-character visible prefix and its hash', () => {
    const created = generateApiKey(PEPPER);
    expect(created.key).toMatch(/^tdk_[A-Za-z0-9]{48}$/);
    expect(isWellFormedApiKey(created.key)).toBe(true);
    expect(created.prefix).toBe(created.key.slice(0, 12));
    expect(created.prefix).toMatch(/^tdk_[A-Za-z0-9]{8}$/);
    expect(created.hash).toBe(hashApiKey(created.key, PEPPER));
    expect(created.hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('never repeats a key', () => {
    const keys = new Set(Array.from({ length: 200 }, () => generateApiKey(PEPPER).key));
    expect(keys.size).toBe(200);
  });

  it('draws characters without modulo bias (bytes of 248 and above are discarded)', () => {
    const bytes = [255, 248, 0, 61, 62, 247];
    const created = generateApiKey(PEPPER, (size) => {
      const out = new Uint8Array(size);
      for (let index = 0; index < size; index += 1) out[index] = bytes[index % bytes.length]!;
      return out;
    });
    // 0 → A, 61 → 9, 62 → A, 247 → 247 % 62 = 61 → 9; 255 and 248 never appear.
    expect(created.key.slice(4, 8)).toBe('A9A9');
  });

  it('hashes with the pepper, so the same key under another pepper does not match', () => {
    const { key, hash } = generateApiKey(PEPPER);
    expect(apiKeyMatches(key, hash, PEPPER)).toBe(true);
    expect(apiKeyMatches(key, hash, OTHER_PEPPER)).toBe(false);
    expect(apiKeyMatches(`${key.slice(0, -1)}x`, hash, PEPPER)).toBe(false);
    expect(apiKeyMatches(key, 'not-a-hash', PEPPER)).toBe(false);
    expect(hashApiKey(key, PEPPER)).not.toBe(hashApiKey(key, OTHER_PEPPER));
  });

  it('turns the feature off without a pepper of at least 32 characters', () => {
    expect(apiKeyPepper(undefined)).toBeNull();
    expect(apiKeyPepper('')).toBeNull();
    expect(apiKeyPepper('   ')).toBeNull();
    expect(apiKeyPepper('short-pepper')).toBeNull();
    expect(apiKeyPepper(`  ${PEPPER}  `)).toBe(PEPPER);
  });

  it('reads only a bearer key in the documented format', () => {
    const { key } = generateApiKey(PEPPER);
    expect(readBearer(null)).toEqual({ kind: 'missing' });
    expect(readBearer('')).toEqual({ kind: 'missing' });
    expect(readBearer(`Bearer ${key}`)).toEqual({ kind: 'key', key });
    expect(readBearer(`bearer ${key}`)).toEqual({ kind: 'key', key });
    expect(readBearer(`Basic ${key}`)).toEqual({ kind: 'malformed' });
    expect(readBearer(`Bearer ${key} extra`)).toEqual({ kind: 'malformed' });
    expect(readBearer('Bearer tdk_short')).toEqual({ kind: 'malformed' });
    expect(readBearer(`Bearer sk_${key.slice(4)}`)).toEqual({ kind: 'malformed' });
  });
});

describe('request validation', () => {
  it('accepts a shipment with only a reference, filling every optional field with null', () => {
    const parsed = createShipmentSchema.parse({ reference: '  PO-1  ' });
    expect(parsed.reference).toBe('PO-1');
    expect(parsed.currency).toBeNull();
    expect(parsed.incoterm).toBeNull();
    expect(parsed.exporter_id).toBeNull();
    expect(parsed.items).toEqual([]);
  });

  it('keeps decimals exact whether they arrive as strings or numbers', () => {
    const parsed = createShipmentSchema.parse({
      reference: 'PO-2',
      currency: 'usd',
      incoterm: 'fca',
      incoterm_place: 'Rotterdam',
      country_of_destination: 'us',
      items: [
        { description: 'Valves', quantity: '120', unit_price: '14.50', hs_code: '8481.80' },
        { description: 'Seals', quantity: 2.5, net_weight_kg: 1, gross_weight_kg: '1.250' },
      ],
    });
    expect(parsed.currency).toBe('USD');
    expect(parsed.incoterm).toBe('FCA');
    expect(parsed.country_of_destination).toBe('US');
    expect(parsed.items[0]).toMatchObject({
      quantity: '120',
      unit_price: '14.5',
      hs_code: '848180',
      unit: 'pcs',
    });
    expect(parsed.items[1]).toMatchObject({
      quantity: '2.5',
      unit_price: null,
      net_weight_kg: '1',
      gross_weight_kg: '1.25',
    });
  });

  it('reports each invalid field by its path', () => {
    const result = createShipmentSchema.safeParse({
      reference: '',
      incoterm: 'FOB',
      items: [
        { description: 'Valves', quantity: '0' },
        { description: 'Seals', quantity: '1', net_weight_kg: '5', gross_weight_kg: '4' },
      ],
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    const fields = issuesOf(result.error).map((issue) => issue.field);
    expect(fields).toEqual(
      expect.arrayContaining(['reference', 'items.0.quantity', 'items.1.gross_weight_kg']),
    );
  });

  it('requires the named place with an Incoterms rule', () => {
    const result = createShipmentSchema.safeParse({ reference: 'PO-3', incoterm: 'FOB' });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(issuesOf(result.error)).toContainEqual({
      field: 'incoterm_place',
      message: 'Name the place that goes with FOB, such as a port or town.',
    });
  });

  it('refuses unknown fields instead of dropping them, including org_id', () => {
    expect(createShipmentSchema.safeParse({ reference: 'PO-4', refrence: 'x' }).success).toBe(false);
    expect(createShipmentSchema.safeParse({ reference: 'PO-4', org_id: ORG }).success).toBe(false);
    expect(
      createShipmentSchema.safeParse({
        reference: 'PO-4',
        items: [{ description: 'x', quantity: '1', org_id: ORG }],
      }).success,
    ).toBe(false);
  });

  it('caps the lines one request may carry', () => {
    const items = Array.from({ length: API_MAX_LINES + 1 }, () => ({
      description: 'x',
      quantity: '1',
    }));
    expect(createShipmentSchema.safeParse({ reference: 'PO-5', items }).success).toBe(false);
    expect(
      createShipmentSchema.safeParse({ reference: 'PO-5', items: items.slice(1) }).success,
    ).toBe(true);
  });

  it('accepts every document kind the labels know, and nothing else', () => {
    expect(API_DOCUMENT_KINDS).toEqual(Object.keys(documentKindLabels));
    for (const kind of API_DOCUMENT_KINDS) {
      expect(generateDocumentSchema.safeParse({ kind }).success).toBe(true);
    }
    expect(generateDocumentSchema.safeParse({ kind: 'bill_of_exchange' }).success).toBe(false);
    expect(generateDocumentSchema.safeParse({}).success).toBe(false);
  });

  it('binds an idempotency fingerprint to the route and the exact request', () => {
    const body = createShipmentSchema.parse({ reference: 'PO-6' });
    const same = createShipmentSchema.parse({ reference: ' PO-6 ' });
    expect(requestFingerprint('POST /a', body)).toBe(requestFingerprint('POST /a', same));
    expect(requestFingerprint('POST /a', body)).not.toBe(requestFingerprint('POST /b', body));
    expect(requestFingerprint('POST /a', body)).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe('pagination', () => {
  const row = (n: number) => ({
    id: `00000000-0000-4000-8000-00000000000${n}`,
    created_at: `2026-10-09T10:00:0${n}.123456+00:00`,
  });

  it('round-trips an opaque cursor and refuses a tampered one', () => {
    const cursor = { created_at: row(1).created_at, id: row(1).id };
    expect(decodeCursor(encodeCursor(cursor))).toEqual(cursor);
    expect(decodeCursor('not base64 at all!')).toBeNull();
    expect(decodeCursor(Buffer.from('["yesterday","x"]').toString('base64url'))).toBeNull();
  });

  it('reads limit and cursor, refusing values out of range', () => {
    expect(readPageQuery(new URLSearchParams())).toEqual({ limit: 25, cursor: null });
    expect(readPageQuery(new URLSearchParams('limit=100'))?.limit).toBe(100);
    expect(readPageQuery(new URLSearchParams('limit=0'))).toBeNull();
    expect(readPageQuery(new URLSearchParams('limit=101'))).toBeNull();
    expect(readPageQuery(new URLSearchParams('limit=ten'))).toBeNull();
    expect(readPageQuery(new URLSearchParams('cursor=@@'))).toBeNull();
  });

  it('turns the extra row into a next cursor, and gives none on the last page', () => {
    const full = pageOf([row(3), row(2), row(1)], 2);
    expect(full.data).toHaveLength(2);
    expect(decodeCursor(full.next_cursor ?? '')).toEqual(row(2));
    expect(pageOf([row(1)], 2).next_cursor).toBeNull();
  });
});

describe('the API is a Team feature, gated fail closed', () => {
  const current = (plan: string) => ({
    org_id: ORG,
    plan,
    status: 'active',
    paid_through: new Date(Date.now() + 86_400_000).toISOString(),
    cancel_at_period_end: false,
    revoked_at: null,
    revoke_reason: null,
    updated_at: new Date().toISOString(),
  });
  const reader =
    (result: Awaited<ReturnType<EntitlementRead>>): EntitlementRead =>
    async () =>
      result;

  it('belongs to Team only', () => {
    expect(featurePlans('api')).toEqual(['team']);
  });

  it('is granted to a current Team plan and refused to Pro, Free, a lapsed plan or a failed read', async () => {
    await expect(hasEntitlement(ORG, 'api', reader({ row: current('team'), failed: false }))).resolves.toBe(true);
    await expect(hasEntitlement(ORG, 'api', reader({ row: current('pro'), failed: false }))).resolves.toBe(false);
    await expect(hasEntitlement(ORG, 'api', reader({ row: null, failed: false }))).resolves.toBe(false);
    await expect(
      hasEntitlement(
        ORG,
        'api',
        reader({ row: { ...current('team'), paid_through: new Date(Date.now() - 1000).toISOString() }, failed: false }),
      ),
    ).resolves.toBe(false);
    await expect(
      hasEntitlement(ORG, 'api', reader({ row: current('team'), failed: true })),
    ).resolves.toBe(false);
    await expect(
      hasEntitlement(ORG, 'api', async () => {
        throw new Error('unreachable');
      }),
    ).resolves.toBe(false);
  });

  it('is credited to Team alone in the pricing copy', () => {
    expect(paidAdditions()).toBe('Pro and Team add PDF branding; Team also adds the REST API');
    expect(paidOnlySummary()).toBe('PDF branding and the REST API');
  });
});
