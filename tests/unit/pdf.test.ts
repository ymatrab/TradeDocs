import { describe, expect, it } from 'vitest';
import { measure, toWinAnsi, wrap } from '@/lib/pdf/writer';
import { renderTradeDocument, type DocumentSnapshot } from '@/lib/pdf/trade-document';

function snapshot(overrides: Partial<DocumentSnapshot> = {}): unknown {
  return {
    kind: 'commercial_invoice',
    number: 'CI-2026-0001',
    generated_at: '2026-09-07T10:00:00.000Z',
    shipment: {
      reference: 'SHP-0001',
      incoterm: 'FOB',
      incoterm_place: 'Rotterdam',
      port_of_loading: 'Rotterdam',
      port_of_discharge: 'Hamburg',
      country_of_origin: 'GB',
      country_of_destination: 'DE',
      currency: 'EUR',
      shipped_on: '2026-09-10',
      marks_and_numbers: 'MERIDIAN / ROTTERDAM / 1-80',
      revision: 3,
    },
    exporter: { name: 'Meridian Components Ltd', city: 'Sheffield', country_code: 'GB' },
    consignee: { name: 'Nordwind Handels GmbH', city: 'Hamburg', country_code: 'DE' },
    notify: null,
    items: [
      {
        position: 1,
        description: 'Industrial bearing housing, cast iron, painted',
        hs_code: '848330',
        country_of_origin: 'GB',
        quantity: 1200,
        unit: 'pcs',
        unit_price: 15.5,
        line_total: 18600,
        net_weight_kg: 4380,
        gross_weight_kg: 4500,
        package_count: 60,
        package_kind: 'ctn',
      },
    ],
    totals: {
      quantity: 1200,
      net_weight_kg: 4380,
      gross_weight_kg: 4500,
      packages: 60,
      value: 18600,
    },
    ...overrides,
  };
}

function asText(bytes: Uint8Array): string {
  return new TextDecoder('latin1').decode(bytes);
}

describe('WinAnsi reduction', () => {
  it('transliterates typographic characters rather than dropping them', () => {
    expect(toWinAnsi('the shipper’s “goods” — packed')).toBe('the shipper\'s "goods" - packed');
  });

  it('replaces characters the base fonts cannot represent', () => {
    // Stated behaviour, not silent corruption: an unrenderable glyph becomes a question mark.
    expect(toWinAnsi('宁波 Ningbo')).toBe('?? Ningbo');
  });

  it('keeps Latin-1 accents, which trade parties routinely use', () => {
    expect(toWinAnsi('Société Générale, Málaga')).toBe('Société Générale, Málaga');
  });
});

describe('text measurement', () => {
  it('measures a wider advance for bold than for regular', () => {
    expect(measure('Commercial Invoice', 9, 'bold')).toBeGreaterThan(
      measure('Commercial Invoice', 9, 'regular'),
    );
  });

  it('scales linearly with size', () => {
    expect(measure('1,280.000', 18)).toBeCloseTo(measure('1,280.000', 9) * 2, 5);
  });

  it('wraps at word boundaries and keeps every line within the width', () => {
    const text = 'Replacement seal kit for hydraulic press, packed in cartons of fifty';
    const lines = wrap(text, 120, 8.5);
    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines) expect(measure(line, 8.5)).toBeLessThanOrEqual(120);
    expect(lines.join(' ')).toBe(text);
  });
});

describe('trade document rendering', () => {
  it('produces a structurally complete PDF', () => {
    const text = asText(renderTradeDocument(snapshot()));
    expect(text.startsWith('%PDF-1.4')).toBe(true);
    expect(text.trimEnd().endsWith('%%EOF')).toBe(true);
    expect(text).toContain('/Type /Catalog');
    expect(text).toContain('/BaseFont /Helvetica-Bold');
    expect(text).toContain('startxref');
  });

  it('carries the document number and the parties onto the page', () => {
    const text = asText(renderTradeDocument(snapshot()));
    expect(text).toContain('CI-2026-0001');
    expect(text).toContain('Meridian Components Ltd');
    expect(text).toContain('Nordwind Handels GmbH');
  });

  it('states on every page that the document is not issued or certified', () => {
    const text = asText(renderTradeDocument(snapshot()));
    // The wording is split across wrapped lines, so assert the load-bearing clause.
    expect(text).toContain('not issued,');
    expect(text).toContain('endorsed, certified or cleared by any customs');
  });

  it('renders each document type with the columns its readers need', () => {
    const packing = asText(renderTradeDocument(snapshot({ kind: 'packing_list' } as never)));
    expect(packing).toContain('PACKING LIST');
    expect(packing).toContain('GROSS KG');
    // A packing list must not quote prices; that is the invoice's job.
    expect(packing).not.toContain('UNIT PRICE');

    const invoice = asText(renderTradeDocument(snapshot()));
    expect(invoice).toContain('UNIT PRICE');
    expect(invoice).toContain('AMOUNT');
  });

  it('paginates a long shipment and numbers every page', () => {
    const items = Array.from({ length: 60 }, (_, index) => ({
      position: index + 1,
      description: `Line item ${index + 1} with a description long enough to wrap onto a second line`,
      hs_code: '848330',
      country_of_origin: 'GB',
      quantity: 10,
      unit: 'pcs',
      unit_price: 1.25,
      line_total: 12.5,
      net_weight_kg: 5,
      gross_weight_kg: 6,
      package_count: 1,
      package_kind: 'ctn',
    }));
    const text = asText(renderTradeDocument(snapshot({ items } as never)));
    expect(text).toContain('Page 1 of ');
    expect(text).toContain('continued');
    const pageCount = (text.match(/\/Type \/Page[^s]/g) ?? []).length;
    expect(pageCount).toBeGreaterThan(1);
  });

  it('refuses a snapshot that is not a document', () => {
    expect(() => renderTradeDocument({ kind: 'not_a_document' })).toThrow();
  });
});
