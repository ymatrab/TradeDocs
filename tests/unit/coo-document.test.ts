import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateDocument } from '@/app/(app)/shipment-actions';
import { createFontSet } from '@/lib/pdf/fonts';
import type { PlacedText } from '@/lib/pdf/writer';
import { columnHeaders, documentLayout, renderTradeDocument } from '@/lib/pdf/trade-document';
import {
  certificateOfOriginGaps,
  cooWording,
  CURRENT_COO_WORDING,
} from '@/lib/trade/certificate-of-origin';

/**
 * The certificate of origin with its gate on: what the PDF prints, what a shipment needs
 * before one is generated, and that the action reaches the database only through the
 * reviewed, service-role path.
 */

const state = vi.hoisted(() => ({
  enabled: false,
  serviceRole: true,
  queue: [] as { data: unknown; error: unknown }[],
  rpc: vi.fn(),
  serviceRpc: vi.fn(),
  userId: '44444444-4444-4444-8444-444444444444' as string | null,
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('@/lib/config/server', () => ({ regulatedDocumentsEnabled: () => state.enabled }));
vi.mock('@/lib/supabase/admin', () => ({
  hasServiceRole: () => state.serviceRole,
  createServiceClient: () => ({ rpc: state.serviceRpc }),
}));
vi.mock('@/lib/supabase/server', () => {
  const query = (): Record<string, unknown> => {
    const chain: Record<string, unknown> = {};
    for (const method of ['select', 'eq', 'order', 'limit']) chain[method] = () => chain;
    const next = () => state.queue.shift() ?? { data: null, error: null };
    chain.maybeSingle = async () => next();
    chain.then = (resolve: (value: unknown) => unknown) => resolve(next());
    return chain;
  };
  return {
    createClient: async () => ({
      from: () => query(),
      rpc: state.rpc,
      auth: {
        getUser: async () => ({ data: { user: state.userId ? { id: state.userId } : null } }),
      },
    }),
  };
});

const ORG = '11111111-1111-4111-8111-111111111111';
const SHIPMENT = '22222222-2222-4222-8222-222222222222';
const CREATED = '33333333-3333-4333-8333-333333333333';

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

function certificate(overrides: Record<string, unknown> = {}) {
  return {
    schema_version: 5,
    money_places: 2,
    kind: 'certificate_of_origin',
    number: 'CO-2026-0001',
    generated_at: '2026-10-09T10:00:00.000Z',
    supersedes: null,
    certificate: { wording_version: 1, invoice_reference: 'CI-2026-0004' },
    shipment: {
      reference: 'KES-1',
      incoterm: 'FCA',
      incoterm_place: 'Felixstowe',
      port_of_loading: 'Felixstowe',
      port_of_discharge: 'Bergen',
      country_of_origin: 'GB',
      country_of_destination: 'NO',
      currency: 'EUR',
      shipped_on: '2026-10-12',
      marks_and_numbers: null,
      revision: 3,
    },
    exporter: { name: 'Kestrel Exports Ltd', city: 'Ipswich', country_code: 'GB' },
    consignee: { name: 'Haugland AS', city: 'Bergen', country_code: 'NO' },
    notify: null,
    issuer: { signatory_name: 'Olga Owner', signatory_title: 'Director' },
    items: [
      {
        position: 1,
        description: 'Brass hinge',
        hs_code: '830210',
        country_of_origin: 'GB',
        quantity: 100,
        unit: 'pcs',
        unit_price: 2,
        line_total: 200,
        gross_weight_kg: 12,
      },
      {
        position: 2,
        description: 'Steel bracket',
        hs_code: '830250',
        country_of_origin: 'CN',
        quantity: 50,
        unit: 'pcs',
        unit_price: 1,
        line_total: 50,
        gross_weight_kg: 8,
      },
    ],
    totals: { quantity: 150, net_weight_kg: null, gross_weight_kg: 20, packages: 0, value: 250 },
    ...overrides,
  };
}

function texts(pages: PlacedText[][]): string[] {
  return pages.flat().map((placed) => placed.text);
}

const wording = cooWording(CURRENT_COO_WORDING);

describe('certificate of origin PDF', () => {
  const pages = documentLayout(certificate(), createFontSet());
  const all = texts(pages);
  const joined = all.join(' ');

  it('states exporter, consignee, goods with their origin per line, and the invoice', () => {
    expect(all).toContain('CERTIFICATE OF ORIGIN');
    expect(joined).toContain('Kestrel Exports Ltd');
    expect(joined).toContain('Haugland AS');
    expect(columnHeaders(certificate())).toEqual([
      'Description of goods',
      'HS code',
      'Origin',
      'Quantity',
    ]);
    expect(all).toContain('Brass hinge');
    expect(all).toContain('GB');
    expect(all).toContain('CN');
    expect(all).toContain('CI-2026-0004');
    // Transport: ports in the first row of boxes, destination and date in the second.
    expect(all).toContain('Felixstowe');
    expect(all).toContain('Bergen');
    expect(all).toContain('NO');
    expect(all).toContain('2026-10-12');
    expect(all).toContain('20.000 kg');
  });

  it('carries the exporter’s declaration, the signatory and the space to sign', () => {
    expect(all).toContain(wording.declarationCaption);
    expect(joined).toContain('declares that the details above are correct');
    expect(all).toContain('Olga Owner, Director');
    expect(all).toContain(wording.signatureCaption);
  });

  it('says on every page it is the exporter’s preparation, not certified by TradeDocs', () => {
    for (const page of pages) {
      expect(page.map((placed) => placed.text)).toContain(wording.preparationLabel);
    }
    expect(joined).toContain('It is not certified or issued by TradeDocs.');
    expect(all).toContain(wording.certificationCaption);
    // Nothing on it claims a certification or issue by TradeDocs.
    expect(joined).not.toMatch(/(?<!not )certified by TradeDocs/);
    expect(joined).not.toMatch(/(?<!not certified or )issued by TradeDocs/);
    expect(joined).not.toMatch(/TradeDocs (certifies|issues)/);
    expect(joined).toMatch(/not issued, endorsed, certified or cleared/);
  });

  it('prints a dash rather than an invented invoice number when there is none', () => {
    const layout = texts(documentLayout(certificate({ certificate: null }), createFontSet()));
    expect(layout).not.toContain('CI-2026-0004');
    expect(layout).toContain('Invoice No.'.toUpperCase());
  });

  it('renders to a PDF', () => {
    const pdf = renderTradeDocument(certificate());
    expect(Buffer.from(pdf.subarray(0, 5)).toString('latin1')).toBe('%PDF-');
  });

  it('records the wording version the migration writes', () => {
    const migration = readFileSync(
      join(process.cwd(), 'supabase/migrations/20261009000200_certificate_of_origin.sql'),
      'utf8',
    );
    expect(migration).toContain(`'wording_version', ${CURRENT_COO_WORDING}`);
  });
});

describe('certificate of origin readiness', () => {
  const ready = {
    exporter: true,
    consignee: true,
    lineOrigins: ['GB', 'CN'],
    signatoryName: 'Olga Owner',
  };

  it('needs parties, an origin on every line and a signatory', () => {
    expect(certificateOfOriginGaps(ready)).toEqual([]);
    expect(certificateOfOriginGaps({ ...ready, exporter: false })).toEqual([
      'Choose the exporter.',
    ]);
    expect(certificateOfOriginGaps({ ...ready, lineOrigins: ['GB', null, null] })).toEqual([
      'Enter the country of origin on 2 lines.',
    ]);
    expect(certificateOfOriginGaps({ ...ready, signatoryName: ' ' })[0]).toMatch(/signatory/);
  });
});

describe('certificate of origin action', () => {
  beforeEach(() => {
    state.enabled = false;
    state.serviceRole = true;
    state.queue = [];
    state.userId = '44444444-4444-4444-8444-444444444444';
    state.rpc.mockReset().mockResolvedValue({ data: CREATED, error: null });
    state.serviceRpc.mockReset().mockResolvedValue({ data: CREATED, error: null });
  });

  const request = () =>
    generateDocument({}, form({ org: ORG, shipment: SHIPMENT, kind: 'certificate_of_origin' }));

  /** Shipment, lines, settings, then the generated document's number. */
  function readyShipment(lines: (string | null)[] = ['GB']) {
    state.queue = [
      { data: { exporter_id: 'e', consignee_id: 'c' }, error: null },
      { data: lines.map((country_of_origin) => ({ country_of_origin })), error: null },
      { data: { signatory_name: 'Olga Owner' }, error: null },
      { data: { number: 'CO-2026-0001', supersedes_id: null }, error: null },
    ];
  }

  it('is refused while the gate is off, before any database call', async () => {
    readyShipment();
    const result = await request();
    expect(result.error).toMatch(/pending legal and regulatory review/);
    expect(state.rpc).not.toHaveBeenCalled();
    expect(state.serviceRpc).not.toHaveBeenCalled();
  });

  it('is generated through the reviewed path for the signed-in user when on', async () => {
    state.enabled = true;
    readyShipment();
    const result = await request();
    expect(result.notice).toBe('Document CO-2026-0001 generated.');
    expect(state.serviceRpc).toHaveBeenCalledWith('generate_certificate_of_origin', {
      target_shipment: SHIPMENT,
      actor: '44444444-4444-4444-8444-444444444444',
    });
    // Never through the ordinary routine, which the database refuses for this kind.
    expect(state.rpc).not.toHaveBeenCalled();
  });

  it('says what the shipment lacks instead of generating', async () => {
    state.enabled = true;
    readyShipment(['GB', null]);
    const result = await request();
    expect(result.error).toBe(
      'Before a certificate of origin: Enter the country of origin on 1 line.',
    );
    expect(state.serviceRpc).not.toHaveBeenCalled();
  });

  it('fails closed without a signed-in user or the service-role connection', async () => {
    state.enabled = true;
    state.userId = null;
    readyShipment();
    expect((await request()).error).toMatch(/Sign in again/);

    state.userId = '44444444-4444-4444-8444-444444444444';
    state.serviceRole = false;
    readyShipment();
    expect((await request()).error).toMatch(/cannot be generated on this deployment/);
    expect(state.serviceRpc).not.toHaveBeenCalled();
  });

  it('reports a shipment outside the caller’s organizations as unavailable', async () => {
    state.enabled = true;
    state.queue = [{ data: null, error: null }];
    expect((await request()).error).toBe('That shipment is not available to you.');
    expect(state.serviceRpc).not.toHaveBeenCalled();
  });
});
