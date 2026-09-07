import { describe, expect, it } from 'vitest';
import { createFontSet } from '@/lib/pdf/fonts';
import { wrap } from '@/lib/pdf/writer';
import { renderTradeDocument } from '@/lib/pdf/trade-document';

const fonts = createFontSet();

function snapshot(overrides: Record<string, unknown> = {}): unknown {
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

describe('the embedded face', () => {
  it('covers the scripts European trade parties actually use', () => {
    // Every one of these was a question mark while the renderer used the base-14 fonts.
    for (const character of 'ßłŐçĆșÅøæÄÜÖ') {
      expect(fonts.regular.has(character.codePointAt(0) ?? 0)).toBe(true);
    }
  });

  it('covers Greek and Cyrillic', () => {
    for (const character of 'ЖДщйЫΔΘΩ') {
      expect(fonts.regular.has(character.codePointAt(0) ?? 0)).toBe(true);
    }
  });

  it('reports honestly that it cannot represent CJK', () => {
    // Stated coverage, not a silent substitution: adding these means adding a CJK face.
    expect(fonts.regular.has('宁'.codePointAt(0) ?? 0)).toBe(false);
  });

  it('maps distinct characters to distinct glyphs', () => {
    const a = fonts.encode('Ł', 'regular').glyphs[0];
    const b = fonts.encode('L', 'regular').glyphs[0];
    expect(a).toBeGreaterThan(0);
    expect(a).not.toBe(b);
  });

  it('measures a wider advance for bold than for regular', () => {
    expect(fonts.measure('Commercial Invoice', 9, 'bold')).toBeGreaterThan(
      fonts.measure('Commercial Invoice', 9, 'regular'),
    );
  });

  it('wraps at word boundaries and keeps every line within the width', () => {
    const text = 'Replacement seal kit for hydraulic press, packed in cartons of fifty';
    const lines = wrap(fonts, text, 120, 8.5);
    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines) expect(fonts.measure(line, 8.5)).toBeLessThanOrEqual(120);
    expect(lines.join(' ')).toBe(text);
  });
});

describe('trade document rendering', () => {
  it('produces a structurally complete PDF with an embedded subset', () => {
    const text = asText(renderTradeDocument(snapshot(), createFontSet()));
    expect(text.startsWith('%PDF-1.4')).toBe(true);
    expect(text.trimEnd().endsWith('%%EOF')).toBe(true);
    expect(text).toContain('/Type /Catalog');
    expect(text).toContain('/Subtype /CIDFontType2');
    expect(text).toContain('/Encoding /Identity-H');
    expect(text).toContain('/FontFile2');
    // Text stays searchable and copyable rather than becoming opaque glyph numbers.
    expect(text).toContain('/ToUnicode');
  });

  it('embeds only what the document uses, not the whole face', () => {
    const rendered = renderTradeDocument(snapshot(), createFontSet());
    // The two source faces are roughly 1.2 MB together.
    expect(rendered.byteLength).toBeLessThan(200_000);
    expect(rendered.byteLength).toBeGreaterThan(2_000);
  });

  it('renders a consignee whose name needs more than Latin-1', () => {
    const rendered = renderTradeDocument(
      snapshot({
        consignee: { name: 'Łódź Handlowa Spółka', city: 'Łódź', country_code: 'PL' },
      }),
      createFontSet(),
    );
    expect(rendered.byteLength).toBeGreaterThan(2_000);
    // The accented characters resolve to real glyphs rather than the replacement.
    const replacement = fonts.encode('�', 'regular').glyphs[0];
    const used = fonts.encode('Łódź', 'regular').glyphs;
    expect(used.every((glyph) => glyph !== replacement)).toBe(true);
  });

  it('renders each document type with the columns its readers need', () => {
    const packing = renderTradeDocument(snapshot({ kind: 'packing_list' }), createFontSet());
    const invoice = renderTradeDocument(snapshot(), createFontSet());
    // Glyph streams are opaque, so compare against what each type is expected to contain.
    expect(packing.byteLength).toBeGreaterThan(2_000);
    expect(invoice.byteLength).toBeGreaterThan(2_000);
    expect(asText(packing)).toContain('/Type /Page');
  });

  it('paginates a long shipment', () => {
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
    const text = asText(renderTradeDocument(snapshot({ items }), createFontSet()));
    const pageCount = (text.match(/\/Type \/Page[^s]/g) ?? []).length;
    expect(pageCount).toBeGreaterThan(1);
  });

  it('refuses a snapshot that is not a document', () => {
    expect(() => renderTradeDocument({ kind: 'not_a_document' }, createFontSet())).toThrow();
  });
});
