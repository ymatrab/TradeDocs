import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/tools/document/route';
import { currencyMinorUnits, lineTotal, sumLineTotals } from '@/lib/money';
import {
  documentCommercialTerms,
  documentLayout,
  renderTradeDocument,
} from '@/lib/pdf/trade-document';
import { buildToolSnapshot, toolRequestSchema } from '@/lib/tools/document-snapshot';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function request(overrides: Record<string, unknown> = {}) {
  return {
    kind: 'commercial_invoice',
    number: 'INV-1',
    currency: 'EUR',
    incoterm: 'FOB',
    incoterm_place: 'Rotterdam',
    port_of_loading: '',
    port_of_discharge: '',
    marks_and_numbers: '',
    reference: '',
    seller: { name: 'Meridian Components Ltd', country_code: 'GB' },
    buyer: { name: 'Nordwind Handels GmbH', country_code: 'DE' },
    lines: [
      { description: 'Bearing housing', quantity: 3, unit_price: 0.1, country_of_origin: '' },
    ],
    ...overrides,
  };
}

function snapshotOf(overrides: Record<string, unknown> = {}) {
  return buildToolSnapshot(toolRequestSchema.parse(request(overrides)), new Date(0));
}

function post(body: string) {
  return new NextRequest('http://127.0.0.1:3000/api/tools/document', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
}

function configureDatabase() {
  vi.stubEnv('APP_ENV', 'test');
  vi.stubEnv('APPLICATION_MODE', 'service');
  vi.stubEnv('SUPABASE_URL', 'http://127.0.0.1:54321');
  vi.stubEnv('SUPABASE_ANON_KEY', 'synthetic-public-test-key');
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'synthetic-service-test-key');
  vi.stubEnv('SUPABASE_PROJECT_REF', 'syntheticproject');
  vi.stubEnv('SUPABASE_ENVIRONMENT', 'test');
  vi.stubEnv('RATE_LIMIT_KEY_SECRET', 'synthetic-rate-test-key-more-than-32-characters');
}

describe('money', () => {
  it('takes minor units from the currency', () => {
    expect(currencyMinorUnits('EUR')).toBe(2);
    expect(currencyMinorUnits('JPY')).toBe(0);
    expect(currencyMinorUnits('KWD')).toBe(3);
    expect(currencyMinorUnits('not a code')).toBe(2);
  });

  it('rounds exactly where binary floating point does not', () => {
    // 1.005 * 100 is 100.49999999999999 in floating point, which rounds down to 1.00.
    expect(lineTotal(1, 1.005, 2).toFixed(2)).toBe('1.01');
    expect(lineTotal(3, 0.1, 2).toFixed(2)).toBe('0.30');
    expect(lineTotal(1, '1.2345', 3).toFixed(3)).toBe('1.235');
  });

  it('totals the rounded lines, as a reader adding the printed figures would', () => {
    const lines = [
      { quantity: 1, unit_price: '0.005' },
      { quantity: 1, unit_price: '0.005' },
    ];
    expect(sumLineTotals(lines, 2).toFixed(2)).toBe('0.02');
  });
});

describe('free document snapshot', () => {
  it('records its schema and the currency places it was rounded to', () => {
    const snapshot = snapshotOf();
    expect(snapshot.schema_version).toBe(4);
    expect(snapshot.money_places).toBe(2);
    expect(snapshot.items[0]?.line_total).toBe('0.30');
    expect(snapshot.totals.value).toBe('0.30');
  });

  it('rounds a yen invoice to whole yen and a dinar invoice to fils', () => {
    const yen = snapshotOf({
      currency: 'JPY',
      lines: [{ description: 'Valve', quantity: 3, unit_price: 33.5 }],
    });
    expect(yen.money_places).toBe(0);
    expect(yen.totals.value).toBe('101');

    const dinar = snapshotOf({
      currency: 'KWD',
      lines: [{ description: 'Valve', quantity: 1, unit_price: 1.2345 }],
    });
    expect(dinar.money_places).toBe(3);
    expect(dinar.totals.value).toBe('1.235');
  });

  it('never takes the country of origin from where the seller is registered', () => {
    expect(snapshotOf().shipment.country_of_origin).toBeNull();
    expect(
      snapshotOf({
        lines: [
          { description: 'A', quantity: 1, unit_price: 1, country_of_origin: 'vn' },
          { description: 'B', quantity: 1, unit_price: 1, country_of_origin: 'VN' },
        ],
      }).shipment.country_of_origin,
    ).toBe('VN');
    expect(
      snapshotOf({
        lines: [
          { description: 'A', quantity: 1, unit_price: 1, country_of_origin: 'VN' },
          { description: 'B', quantity: 1, unit_price: 1, country_of_origin: 'CN' },
        ],
      }).shipment.country_of_origin,
    ).toBeNull();
    expect(snapshotOf({ country_of_origin: 'it' }).shipment.country_of_origin).toBe('IT');
  });

  it('states net and gross weights only when a line does', () => {
    const without = snapshotOf({ kind: 'packing_list' });
    expect(without.totals.gross_weight_kg).toBeNull();
    expect(without.totals.net_weight_kg).toBeNull();
    expect(renderTradeDocument(without).byteLength).toBeGreaterThan(2_000);

    const stated = snapshotOf({
      kind: 'packing_list',
      lines: [
        { description: 'A', quantity: 1, unit_price: 1, net_weight_kg: 4, gross_weight_kg: 4.25 },
        { description: 'B', quantity: 1, unit_price: 1, gross_weight_kg: 0.75 },
      ],
    });
    expect(stated.totals.gross_weight_kg).toBe('5');
    expect(stated.totals.net_weight_kg).toBe('4');
    expect(stated.items[1]?.gross_weight_kg).toBe(0.75);
  });

  it('prints a stated issue date, and only a real one', () => {
    expect(snapshotOf().issued_on).toBeNull();
    expect(snapshotOf({ issued_on: '' }).issued_on).toBeNull();
    const dated = snapshotOf({ issued_on: '2026-09-30' });
    expect(dated.issued_on).toBe('2026-09-30');
    expect(renderTradeDocument(dated).byteLength).toBeGreaterThan(2_000);
    expect(toolRequestSchema.safeParse(request({ issued_on: '2026-02-31' })).success).toBe(false);
    expect(toolRequestSchema.safeParse(request({ issued_on: '30/09/2026' })).success).toBe(false);
  });
});

describe('free document commercial terms (schema 6)', () => {
  const terms = { buyer_reference: 'PO-4471', valid_until: '2026-11-30' };

  it('stays schema 4, without the new keys, when no buyer reference or validity is stated', () => {
    const plain = snapshotOf({ kind: 'proforma_invoice', buyer_reference: '', valid_until: '' });
    expect(plain.schema_version).toBe(4);
    expect(plain.shipment).not.toHaveProperty('buyer_reference');
    expect(documentCommercialTerms(plain)).toEqual([]);
  });

  it('moves a proforma to schema 6 and prints the buyer reference and validity date', () => {
    const proforma = snapshotOf({ kind: 'proforma_invoice', ...terms });
    expect(proforma.schema_version).toBe(6);
    expect(proforma.shipment).toMatchObject({
      buyer_reference: 'PO-4471',
      proforma_valid_until: '2026-11-30',
    });
    expect(documentCommercialTerms(proforma)).toEqual([
      ['Buyer reference / PO', 'PO-4471'],
      ['Valid until', '2026-11-30'],
    ]);
    const printed = documentLayout(proforma)
      .flat()
      .map((entry) => entry.text);
    expect(printed).toContain('PO-4471');
    expect(printed).toContain('2026-11-30');
  });

  it('prints the buyer reference but no validity date on a commercial invoice', () => {
    const invoice = snapshotOf({ kind: 'commercial_invoice', ...terms });
    expect(invoice.schema_version).toBe(6);
    expect(documentCommercialTerms(invoice)).toEqual([['Buyer reference / PO', 'PO-4471']]);
  });

  it('keeps a packing list and a delivery note at schema 4 whatever terms are sent', () => {
    for (const kind of ['packing_list', 'delivery_note'] as const) {
      const built = snapshotOf({ kind, ...terms, payment_terms: '30 days net' });
      expect(built.schema_version).toBe(4);
      expect(built).not.toHaveProperty('issuer');
      expect(renderTradeDocument(built).byteLength).toBeGreaterThan(2_000);
    }
  });

  it('prints payment terms on an invoice through the schema 4 issuer block', () => {
    const invoice = snapshotOf({ payment_terms: '30% deposit, balance against B/L copy' });
    expect(invoice.schema_version).toBe(4);
    expect(invoice).toMatchObject({
      issuer: { payment_terms: '30% deposit, balance against B/L copy' },
    });
    const printed = documentLayout(invoice)
      .flat()
      .map((entry) => entry.text);
    expect(printed).toContain('PAYMENT TERMS');
  });

  it('refuses an impossible validity date and an over-long buyer reference', () => {
    expect(toolRequestSchema.safeParse(request({ valid_until: '2026-02-30' })).success).toBe(false);
    expect(toolRequestSchema.safeParse(request({ buyer_reference: 'P'.repeat(61) })).success).toBe(
      false,
    );
  });

  it('renders an older snapshot exactly as before: no schema 6 terms below schema 6', () => {
    const proforma = snapshotOf({ kind: 'proforma_invoice', ...terms });
    const downgraded = { ...proforma, schema_version: 5 };
    expect(documentCommercialTerms(downgraded)).toEqual([]);
  });
});

describe('free document route', () => {
  it('refuses an oversized body', async () => {
    const response = await POST(post(JSON.stringify(request({ reference: 'x'.repeat(70_000) }))));
    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({ error: 'That document is too large for this tool.' });
  });

  it('renders without quotas when the deployment has no database', async () => {
    vi.stubEnv('APP_ENV', 'test');
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    const response = await POST(post(JSON.stringify(request())));
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/pdf');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('refuses a caller over quota with the time to retry', async () => {
    configureDatabase();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          Response.json([{ allowed: false, remaining: 0, retry_after_seconds: 17 }]),
        ),
    );
    const response = await POST(post(JSON.stringify(request())));
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('17');
    expect((await response.json()).error).toMatch(/too many requests/i);
  });

  it('fails closed when a configured quota store is unreachable', async () => {
    configureDatabase();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('outage')));
    const response = await POST(post(JSON.stringify(request())));
    expect(response.status).toBe(503);
    expect(response.headers.get('retry-after')).toBe('30');
  });

  it('rejects a document without lines as a client error', async () => {
    vi.stubEnv('APP_ENV', 'test');
    const response = await POST(post(JSON.stringify(request({ lines: [] }))));
    expect(response.status).toBe(400);
  });
});
