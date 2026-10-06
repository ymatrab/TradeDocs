import { describe, expect, it } from 'vitest';
import { createFontSet } from '@/lib/pdf/fonts';
import { PAGE_WIDTH, type PlacedText } from '@/lib/pdf/writer';
import { documentLayout, renderTradeDocument } from '@/lib/pdf/trade-document';

/**
 * Layout of schema 4 documents, read from where each piece of text was placed rather than
 * from the PDF's opaque glyph stream: totals never sit alone on a page, nothing runs into
 * the disclosure footer, long party and terms text stays inside its box.
 */

const MARGIN = 42;
/** Footer text (disclosure and page number) sits at or below this baseline. */
const FOOTER_TOP = MARGIN + 26;

function line(position: number, description: string) {
  return {
    position,
    description,
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
  };
}

function snapshot(lineCount: number, overrides: Record<string, unknown> = {}) {
  const items = Array.from({ length: lineCount }, (_, index) =>
    line(
      index + 1,
      index % 3 === 0
        ? `Line ${index + 1}: stainless steel hinge assembly with brass bushings, satin finish, packed in pairs with fixing screws and an instruction leaflet in five languages`
        : `Line ${index + 1} hinge`,
    ),
  );
  return {
    schema_version: 4,
    money_places: 2,
    kind: 'commercial_invoice',
    number: 'CI-2026-0007',
    generated_at: '2026-10-06T10:00:00.000Z',
    supersedes: null,
    shipment: {
      reference: 'KES-1',
      incoterm: 'FCA',
      incoterm_place: 'Felixstowe',
      port_of_loading: 'Felixstowe',
      port_of_discharge: 'Bergen',
      country_of_origin: 'GB',
      country_of_destination: 'NO',
      currency: 'EUR',
      shipped_on: null,
      marks_and_numbers: 'KES / BERGEN / 1-4',
      revision: 2,
    },
    exporter: { name: 'Kestrel Exports Ltd', city: 'Ipswich', country_code: 'GB' },
    consignee: { name: 'Haugland AS', city: 'Bergen', country_code: 'NO' },
    notify: null,
    issuer: {
      payment_terms: '30 days net from the invoice date',
      bank_details: 'Kestrel Bank · IBAN GB00 TEST 0000 0000 · BIC TESTGB00',
      signatory_name: 'Olga Owner',
      signatory_title: 'Director',
      document_notes: null,
    },
    items,
    totals: {
      quantity: lineCount * 10,
      net_weight_kg: lineCount * 5,
      gross_weight_kg: lineCount * 6,
      packages: lineCount,
      value: lineCount * 12.5,
    },
    packages: [],
    packing_totals: { packages: 0, gross_weight_kg: null, net_weight_kg: null, volume_m3: 0 },
    ...overrides,
  };
}

function pageWith(pages: PlacedText[][], text: string): number {
  return pages.findIndex((page) => page.some((placed) => placed.text.includes(text)));
}

describe('schema 4 pagination', () => {
  for (const count of [1, 3, 10, 24, 25, 26, 60]) {
    it(`keeps the totals with the last line and clear of the footer at ${count} lines`, () => {
      const document = snapshot(count);
      const pages = documentLayout(document, createFontSet());
      const totalsPage = pageWith(pages, 'Total amount');
      expect(totalsPage).toBeGreaterThanOrEqual(0);

      // The last line is on the same page as the totals: they are never orphaned.
      const lastLine = `Line ${count}`;
      expect(pages[totalsPage]?.some((placed) => placed.text.startsWith(lastLine))).toBe(true);

      // Nothing but the footer reaches into the footer.
      for (const page of pages) {
        for (const placed of page) {
          if (placed.y <= FOOTER_TOP + 10) {
            expect(placed.size, `"${placed.text}" overlaps the footer`).toBe(6.5);
            expect(placed.y).toBeLessThanOrEqual(FOOTER_TOP);
          }
        }
      }

      // Every page after the first states it continues, and one that carries lines repeats
      // the table header above them.
      pages.slice(1).forEach((page) => {
        expect(page.some((placed) => placed.text === 'continued')).toBe(true);
        if (page.some((placed) => placed.text.startsWith('Line '))) {
          expect(page.some((placed) => placed.text === 'DESCRIPTION OF GOODS')).toBe(true);
        }
      });
      const last = pages.at(-1) ?? [];
      expect(last.some((placed) => placed.text === `Page ${pages.length} of ${pages.length}`)).toBe(
        true,
      );
    });
  }

  it('keeps a packing list total with the last package', () => {
    const packages = Array.from({ length: 40 }, (_, index) => ({
      position: index + 1,
      kind: 'carton',
      package_count: 2,
      length_cm: 50,
      width_cm: 40,
      height_cm: 30,
      net_weight_kg: 10,
      gross_weight_kg: 12.5,
      net_weight_total_kg: 20,
      gross_weight_total_kg: 25,
      volume_m3: 0.12,
      marks: `KES ${index + 1}`,
      contents: [{ position: 1, description: 'Line 1 hinge', quantity: 5, unit: 'pcs' }],
    }));
    const document = snapshot(3, {
      kind: 'packing_list',
      packages,
      packing_totals: { packages: 80, gross_weight_kg: 1000, net_weight_kg: 800, volume_m3: 4.8 },
    });
    const pages = documentLayout(document, createFontSet());
    const totalsPage = pageWith(pages, 'Total gross weight');
    expect(pages[totalsPage]?.some((placed) => placed.text === '40. carton')).toBe(true);
    // The row states its own weight, which is what the total adds up.
    expect(pages[totalsPage]?.some((placed) => placed.text === '25.000')).toBe(true);
    expect(pages[totalsPage]?.some((placed) => placed.text === '1,000.000 kg')).toBe(true);
  });
});

describe('schema 4 content', () => {
  it('wraps a long legal name inside its party box', () => {
    const name =
      'Société Coopérative Agricole et Industrielle des Producteurs Réunis de Haute-Normandie et du Pays de Caux';
    const pages = documentLayout(
      snapshot(1, {
        consignee: {
          legal_name: name,
          address_line1: 'Zone Portuaire, Quai Ouest',
          country_code: 'FR',
        },
      }),
      createFontSet(),
    );
    const boxRight = PAGE_WIDTH - MARGIN;
    const consignee = (pages[0] ?? []).filter(
      (placed) => placed.x > PAGE_WIDTH / 2 && placed.size === 8.5 && placed.y > 600,
    );
    expect(consignee.length).toBeGreaterThan(2);
    for (const placed of consignee) {
      expect(placed.x + placed.width).toBeLessThanOrEqual(boxRight);
    }
  });

  it('keeps a long named place inside its terms box', () => {
    const pages = documentLayout(
      snapshot(1, {
        shipment: {
          ...snapshot(1).shipment,
          incoterm_place: 'Felixstowe Container Terminal, Trinity Berth 8, Suffolk, United Kingdom',
        },
      }),
      createFontSet(),
    );
    const termWidth = (PAGE_WIDTH - MARGIN * 2) / 4;
    const place = (pages[0] ?? []).filter(
      (placed) => placed.text.startsWith('FCA') || placed.text.includes('Berth'),
    );
    expect(place.length).toBeGreaterThan(0);
    for (const placed of place) {
      expect(placed.x + placed.width).toBeLessThanOrEqual(MARGIN + termWidth);
    }
  });

  it('prints payment terms, bank details and the signatory on an invoice', () => {
    const texts = documentLayout(snapshot(2), createFontSet())
      .flat()
      .map((placed) => placed.text);
    expect(texts).toContain('PAYMENT TERMS');
    expect(texts).toContain('BANK DETAILS');
    expect(texts).toContain('Olga Owner, Director');
  });

  it('keeps bank details off a packing list', () => {
    const texts = documentLayout(snapshot(2, { kind: 'packing_list' }), createFontSet())
      .flat()
      .map((placed) => placed.text);
    expect(texts).not.toContain('BANK DETAILS');
    expect(texts).toContain('Olga Owner, Director');
  });

  it('states the number a re-issued document replaces', () => {
    const texts = documentLayout(snapshot(1, { supersedes: 'CI-2026-0003' }), createFontSet())
      .flat()
      .map((placed) => placed.text);
    expect(texts.some((text) => text.endsWith('replaces No. CI-2026-0003'))).toBe(true);
  });

  it('prints the notify party', () => {
    const texts = documentLayout(
      snapshot(1, { notify: { name: 'Bergen Forwarding AS', city: 'Bergen', country_code: 'NO' } }),
      createFontSet(),
    )
      .flat()
      .map((placed) => placed.text);
    expect(texts).toContain('NOTIFY PARTY');
    expect(texts).toContain('Bergen Forwarding AS, Bergen, NO');
  });

  it('labels a preview as not issued, on every page, and prints no number', () => {
    const pages = documentLayout(
      snapshot(60, { number: 'PREVIEW', preview: true }),
      createFontSet(),
    );
    expect(pages.length).toBeGreaterThan(1);
    for (const page of pages) {
      expect(page.some((placed) => placed.text === 'PREVIEW · NOT ISSUED')).toBe(true);
      expect(page.some((placed) => placed.text.startsWith('No. '))).toBe(false);
    }
  });

  it('renders the same bytes every time from the same snapshot', () => {
    const document = snapshot(12);
    const first = renderTradeDocument(document, createFontSet());
    const second = renderTradeDocument(document, createFontSet());
    expect(Buffer.from(first).equals(Buffer.from(second))).toBe(true);
  });
});

describe('older schemas keep their layout', () => {
  it('does not apply schema 4 additions to a schema 3 document', () => {
    const texts = documentLayout(
      snapshot(2, {
        schema_version: 3,
        supersedes: 'CI-2026-0003',
        notify: { name: 'Bergen Forwarding AS' },
      }),
      createFontSet(),
    )
      .flat()
      .map((placed) => placed.text);
    expect(texts).not.toContain('PAYMENT TERMS');
    expect(texts).not.toContain('NOTIFY PARTY');
    expect(texts.some((text) => text.includes('replaces No.'))).toBe(false);
  });
});
