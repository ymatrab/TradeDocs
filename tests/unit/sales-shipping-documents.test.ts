import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createFontSet } from '@/lib/pdf/fonts';
import type { PlacedText } from '@/lib/pdf/writer';
import {
  columnHeaders,
  documentCommercialTerms,
  documentLayout,
  documentTotals,
  renderTradeDocument,
  titles,
} from '@/lib/pdf/trade-document';
import { DOCUMENT_KINDS, documentKindGroups, documentKindLabels } from '@/lib/labels';
import { containerCheckDigit, containerNumberField } from '@/lib/trade/inputs';
import { staleReasons } from '@/lib/trade/staleness';

/**
 * Renderer 7 (D-025): seven kinds from the same shipment record. Each keeps the preparation
 * disclosure on every page, the drafts say what they are not on every page, and adding the
 * schema 7 fields to a snapshot of an older kind changes nothing it prints.
 */

const TRANSPORT = {
  container_number: 'CSQU3054383',
  container_type: '40HC',
  seal_number: 'SL-889',
  booking_number: 'BK-77',
  vessel_voyage: 'NORDIC STAR 042E',
  vgm_method: 2,
  vgm_kg: 18250.5,
  vgm_weighed_on: '2026-10-08',
  vgm_signatory: 'Cleo Owner',
};

function line(position: number) {
  return {
    position,
    description: `Line ${position}: brass valve, threaded, boxed in tens`,
    hs_code: '848180',
    country_of_origin: 'GB',
    quantity: 10,
    unit: 'pcs',
    unit_price: 3,
    line_total: 30,
    net_weight_kg: 5,
    gross_weight_kg: 6,
    package_count: 1,
    package_kind: 'ctn',
  };
}

function snapshot(kind: string, overrides: Record<string, unknown> = {}, lines = 3) {
  return {
    schema_version: 6,
    money_places: 2,
    kind,
    number: 'X-2026-0001',
    generated_at: '2026-10-09T10:00:00.000Z',
    supersedes: null,
    shipment: {
      reference: 'CRM-1',
      incoterm: 'FOB',
      incoterm_place: 'Felixstowe',
      port_of_loading: 'Felixstowe',
      port_of_discharge: 'Bergen',
      country_of_origin: 'GB',
      country_of_destination: 'NO',
      currency: 'EUR',
      shipped_on: '2026-10-20',
      marks_and_numbers: 'CRM / BERGEN / 1-3',
      buyer_reference: 'PO-4471',
      proforma_valid_until: '2026-11-30',
      revision: 2,
    },
    exporter: { name: 'Cormorant Trading Ltd', city: 'Ipswich', country_code: 'GB' },
    consignee: { name: 'Haugland AS', city: 'Bergen', country_code: 'NO' },
    notify: null,
    issuer: {
      payment_terms: '30 days net',
      bank_details: 'IBAN GB00 TEST 0000',
      signatory_name: 'Cleo Owner',
      signatory_title: 'Director',
      document_notes: null,
    },
    items: Array.from({ length: lines }, (_, index) => line(index + 1)),
    totals: {
      quantity: lines * 10,
      net_weight_kg: lines * 5,
      gross_weight_kg: lines * 6,
      packages: lines,
      value: lines * 30,
    },
    packages: [],
    packing_totals: { packages: 0, gross_weight_kg: null, net_weight_kg: null, volume_m3: 0 },
    ...overrides,
  };
}

function withTransport(kind: string, lines = 3) {
  const base = snapshot(kind, {}, lines);
  return { ...base, schema_version: 7, shipment: { ...base.shipment, ...TRANSPORT } };
}

const texts = (pages: PlacedText[][]) => pages.flat().map((placed) => placed.text);
/** A page's text as one string, so a notice that wraps still reads as written. */
const joined = (page: PlacedText[]) => page.map((placed) => placed.text).join(' ');
const NEW_KINDS = [
  'quotation',
  'purchase_order',
  'sales_confirmation',
  'sales_contract',
  'bill_of_lading_draft',
  'shipper_letter_of_instruction',
  'vgm_declaration',
] as const;

describe('the document kind list', () => {
  it('is the list the database accepts', () => {
    const migration = readFileSync(
      join(process.cwd(), 'supabase/migrations/20261009000100_sales_and_shipping_documents.sql'),
      'utf8',
    );
    const body = migration.slice(migration.indexOf('private.document_kind_known(document_kind'));
    const start = body.indexOf('in (') + 4;
    const list = body.slice(start, body.indexOf(')', start));
    const known = [...list.matchAll(/'([a-z_]+)'/g)].map((match) => match[1]);
    expect(known).toEqual([...DOCUMENT_KINDS]);
  });

  it('labels, titles and groups every kind', () => {
    for (const kind of DOCUMENT_KINDS) {
      expect(documentKindLabels[kind]).toBeTruthy();
      expect(titles[kind]).toBeTruthy();
      expect(documentKindGroups[kind]).toBeTruthy();
    }
  });
});

describe('renderer 7 kinds', () => {
  it.each(NEW_KINDS)('renders a %s with the preparation disclosure on every page', (kind) => {
    const pages = documentLayout(withTransport(kind, 60), createFontSet());
    expect(pages.length).toBeGreaterThan(1);
    for (const page of pages) {
      expect(page.some((placed) => placed.text.startsWith('Prepared with TradeDocs'))).toBe(true);
    }
    expect(renderTradeDocument(withTransport(kind), createFontSet()).byteLength).toBeGreaterThan(
      2_000,
    );
  });

  it('labels the sales contract a draft that is not legal advice, on every page', () => {
    const pages = documentLayout(withTransport('sales_contract', 60), createFontSet());
    for (const page of pages) expect(joined(page)).toContain('NOT LEGAL ADVICE');
    const all = texts(pages);
    expect(all).toContain('SALES CONTRACT (DRAFT)');
    expect(all).toContain('8. GOVERNING LAW AND DISPUTES');
    expect(all.some((text) => text.startsWith('For the seller: Cormorant Trading Ltd'))).toBe(true);
    expect(all.some((text) => text.startsWith('For the buyer: Haugland AS'))).toBe(true);
  });

  it('says on every page of a bill of lading draft that the carrier issues the bill', () => {
    const pages = documentLayout(withTransport('bill_of_lading_draft', 60), createFontSet());
    for (const page of pages) {
      expect(joined(page)).toContain('THE CARRIER ISSUES THE BILL OF LADING');
    }
    expect(columnHeaders(withTransport('bill_of_lading_draft'))).toEqual([
      'Description of goods',
      'HS code',
      'Packages',
      'Gross kg',
    ]);
    expect(documentCommercialTerms(withTransport('bill_of_lading_draft'))).toEqual([
      ['Vessel / voyage', 'NORDIC STAR 042E'],
      ['Booking number', 'BK-77'],
      ['Container / type', 'CSQU3054383 · 40HC'],
      ['Seal number', 'SL-889'],
    ]);
  });

  it('states the VGM facts, the method and the authorized person in capitals', () => {
    const all = texts(documentLayout(withTransport('vgm_declaration'), createFontSet()));
    expect(all).toContain('18,250.500 kg');
    expect(all).toContain('CSQU3054383 · 40HC');
    expect(all.some((text) => text.startsWith('Method No. 2'))).toBe(true);
    expect(all).toContain('CLEO OWNER');
    expect(all.some((text) => text.includes('MSC.1/Circ.1475'))).toBe(true);
    expect(all.join(' ')).toContain('DOES NOT WEIGH OR VERIFY');
    // The VGM declaration carries its own signatory, not the issuer's.
    expect(all).not.toContain('Cleo Owner, Director');
  });

  it('prices the sales documents and the letter of instruction, not the bill of lading', () => {
    expect(documentTotals(snapshot('quotation')).at(-1)).toEqual(['Total amount', '90.00 EUR']);
    expect(documentTotals(snapshot('purchase_order')).at(-1)).toEqual([
      'Total amount',
      '90.00 EUR',
    ]);
    expect(documentTotals(snapshot('shipper_letter_of_instruction')).at(-1)).toEqual([
      'Total amount',
      '90.00 EUR',
    ]);
    expect(documentTotals(snapshot('bill_of_lading_draft'))).toEqual([
      ['Total quantity', '30.000'],
      ['Total packages', '3'],
      ['Total gross weight', '18.000 kg'],
    ]);
  });

  it('prints a quotation’s validity and a confirmation’s buyer reference', () => {
    expect(documentCommercialTerms(snapshot('quotation'))).toEqual([['Valid until', '2026-11-30']]);
    expect(documentCommercialTerms(snapshot('sales_confirmation'))).toEqual([
      ['Buyer reference / PO', 'PO-4471'],
    ]);
    expect(texts(documentLayout(snapshot('quotation'), createFontSet()))).toContain('BUYER');
  });
});

describe('older kinds are unchanged by schema 7', () => {
  it.each(['commercial_invoice', 'proforma_invoice', 'packing_list', 'delivery_note'])(
    'renders a %s byte for byte the same with or without container and VGM fields',
    (kind) => {
      const plain = renderTradeDocument(snapshot(kind), createFontSet());
      const transported = renderTradeDocument(withTransport(kind), createFontSet());
      expect(Buffer.from(transported).equals(Buffer.from(plain))).toBe(true);
    },
  );

  it('keeps the exporter and consignee captions of an invoice', () => {
    const all = texts(documentLayout(snapshot('commercial_invoice'), createFontSet()));
    expect(all).toContain('EXPORTER / CONSIGNOR');
    expect(all).not.toContain('SELLER');
  });
});

describe('container numbers', () => {
  it('computes the ISO 6346 check digit', () => {
    expect(containerCheckDigit('CSQU305438')).toBe(3);
    expect(containerCheckDigit('MSCU123456')).toBe(6);
  });

  it('accepts a valid number in any case and spacing, and refuses a wrong check digit', () => {
    expect(containerNumberField.parse('csqu 305438-3')).toBe('CSQU3054383');
    expect(containerNumberField.parse('')).toBeNull();
    expect(containerNumberField.safeParse('CSQU3054384').success).toBe(false);
    expect(containerNumberField.safeParse('CSQ3054383').success).toBe(false);
  });
});

describe('staleness on schema 7 fields', () => {
  it('marks a shipping document stale when the container or VGM changes', () => {
    const before = withTransport('vgm_declaration');
    const after = {
      ...before,
      shipment: { ...before.shipment, vgm_kg: 18300 },
    };
    expect(staleReasons(before, after)).toEqual(['transport']);
    expect(staleReasons(snapshot('commercial_invoice'), snapshot('commercial_invoice'))).toEqual(
      [],
    );
  });
});
