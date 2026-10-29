import { describe, expect, it } from 'vitest';
import { createFontSet } from '@/lib/pdf/fonts';
import { documentLayout, documentTotals } from '@/lib/pdf/trade-document';
import { buildToolSnapshot, toolRequestSchema } from '@/lib/tools/document-snapshot';
import {
  chargeableWeight,
  cubicMetresToCubicFeet,
  toKilograms,
  volumeOf,
} from '@/lib/trade/calculations';
import { landedCost } from '@/lib/trade/landed-cost';

/**
 * Verification pack (owner request 2026-10-29): worked examples whose every figure was
 * calculated by hand and is written out below, then produced through the same code a
 * customer's document goes through, down to the text printed on the PDF page.
 *
 * If one of these fails, a document or a calculator would show a customer a different number
 * from the one a person with a calculator gets. Change the expectation only after redoing
 * the arithmetic by hand.
 */

const GENERATED_AT = new Date('2026-10-29T09:00:00Z');

/** Every text drawn on every page of the document, in drawing order. */
function printed(snapshot: unknown): string[] {
  return documentLayout(snapshot, createFontSet()).flatMap((page) =>
    page.map((placed) => placed.text),
  );
}

const seller = {
  name: 'Atlas Textiles SARL',
  address_line1: '12 Rue du Port',
  city: 'Casablanca',
  postal_code: '20250',
  country_code: 'MA',
  tax_number: 'MA-ICE-0000000000000',
};
const buyer = {
  name: 'Harbor Retail Inc.',
  address_line1: '400 Pier Avenue',
  city: 'Newark',
  postal_code: '07114',
  country_code: 'US',
};

/**
 * Example A: a three-line EUR shipment.
 *
 *   Line 1  1,200 pcs × 3.45      = 4,140.00
 *   Line 2    350 pcs × 2.199     =   769.65
 *   Line 3   25.5 kg  × 12.3333   =   314.49915 → 314.50 (rounded once, half up)
 *   Total                         = 5,224.15 EUR   (the sum of the printed lines)
 *
 *   Quantity   1,200 + 350 + 25.5            = 1,575.5
 *   Net kg     180 + 122.5 + 25.5            =   328.000
 *   Gross kg   195.5 + 140.25 + 27           =   362.750
 *   Packages   24 + 14 + 1                   =    39
 */
const rawExampleA = (kind: 'commercial_invoice' | 'packing_list') => ({
    kind,
    number: 'INV-2026-0042',
    issued_on: '2026-10-29',
    currency: 'EUR',
    incoterm: 'FOB',
    incoterm_place: 'Casablanca',
    port_of_loading: 'Casablanca',
    port_of_discharge: 'Newark',
    seller,
    buyer,
    lines: [
      {
        description: 'Cotton T-shirts, 100% cotton, knitted',
        hs_code: '6109.10',
        country_of_origin: 'MA',
        quantity: '1200',
        unit: 'pcs',
        unit_price: '3.45',
        net_weight_kg: '180',
        gross_weight_kg: '195.5',
        package_count: '24',
      },
      {
        description: 'Ceramic mugs, stoneware',
        hs_code: '6912.00',
        country_of_origin: 'MA',
        quantity: '350',
        unit: 'pcs',
        unit_price: '2.199',
        net_weight_kg: '122.5',
        gross_weight_kg: '140.25',
        package_count: '14',
      },
      {
        description: 'Steel bolts, zinc plated',
        hs_code: '7318.15',
        country_of_origin: 'MA',
        quantity: '25.5',
        unit: 'kg',
        unit_price: '12.3333',
        net_weight_kg: '25.5',
        gross_weight_kg: '27',
        package_count: '1',
      },
    ],
  });
const exampleA = (kind: 'commercial_invoice' | 'packing_list') =>
  toolRequestSchema.parse(rawExampleA(kind));

describe('verification pack: example A, a three-line EUR shipment', () => {
  const invoice = buildToolSnapshot(exampleA('commercial_invoice'), GENERATED_AT);

  it('computes every line and the total exactly as by hand', () => {
    expect(invoice.items.map((item) => item.line_total)).toEqual(['4140.00', '769.65', '314.50']);
    expect(invoice.totals).toEqual({
      quantity: '1575.5',
      net_weight_kg: '328',
      gross_weight_kg: '362.75',
      packages: '39',
      value: '5224.15',
    });
  });

  it('prints those figures on the commercial invoice', () => {
    const text = printed(invoice);
    for (const figure of ['4,140.00', '769.65', '314.50', '12.3333', '25.500 kg']) {
      expect(text).toContain(figure);
    }
    expect(documentTotals(invoice)).toEqual([
      ['Total quantity', '1,575.500'],
      ['Total amount', '5,224.15 EUR'],
    ]);
  });

  it('carries the parties, terms, HS codes and origin onto the page unchanged', () => {
    const text = printed(invoice).join('\n');
    for (const fact of [
      'Atlas Textiles SARL',
      'Harbor Retail Inc.',
      'FOB Casablanca',
      'Newark',
      '6109.10',
      '6912.00',
      '7318.15',
      'MA',
      'INV-2026-0042',
    ]) {
      expect(text).toContain(fact);
    }
  });

  it('prints the same totals on the packing list', () => {
    const packing = buildToolSnapshot(exampleA('packing_list'), GENERATED_AT);
    expect(documentTotals(packing)).toEqual([
      ['Total quantity', '1,575.500'],
      ['Total packages', '39'],
      ['Total net weight', '328.000 kg'],
      ['Total gross weight', '362.750 kg'],
    ]);
  });
});

describe('verification pack: example D, charges, discount, EORI and signatory (D-029)', () => {
  /**
   *   Goods value (example A)                 5,224.15
   *   Freight                               +   450.00
   *   Insurance  25.505 → 25.51 (half up)   +    25.51
   *   Discount                              -   100.00
   *   Total amount                          = 5,599.66 EUR
   */
  const request = {
    ...rawExampleA('commercial_invoice'),
    freight: 450,
    insurance: 25.505,
    discount: 100,
    signatory_name: 'Amina Berrada',
    seller: { ...seller, eori_number: 'GB123456789000' },
  };
  const invoice = buildToolSnapshot(toolRequestSchema.parse(request), GENERATED_AT);

  it('itemizes each charge and the discount and totals them as by hand', () => {
    expect(invoice.schema_version).toBe(8);
    expect(documentTotals(invoice)).toEqual([
      ['Total quantity', '1,575.500'],
      ['Goods value', '5,224.15 EUR'],
      ['Freight', '450.00 EUR'],
      ['Insurance', '25.51 EUR'],
      ['Discount', '-100.00 EUR'],
      ['Total amount', '5,599.66 EUR'],
    ]);
  });

  it('prints the EORI and the responsible person', () => {
    const text = printed(invoice);
    expect(text).toContain('EORI GB123456789000');
    expect(text).toContain('Amina Berrada');
  });

  it('leaves a packing list of the same shipment without charges', () => {
    const packing = buildToolSnapshot(
      toolRequestSchema.parse({ ...request, kind: 'packing_list' }),
      GENERATED_AT,
    );
    expect('charges' in packing).toBe(false);
    expect(packing.schema_version).toBe(4);
  });
});

describe('verification pack: example B, currencies and rounding', () => {
  /**
   *   JPY has no minor unit:   3 × 333.3 = 999.9 → 1,000     7 × 0.5 = 3.5 → 4
   *   Total 1,004 JPY
   */
  it('rounds yen to whole units, half away from zero', () => {
    const snapshot = buildToolSnapshot(
      toolRequestSchema.parse({
        kind: 'commercial_invoice',
        number: 'JP-1',
        currency: 'JPY',
        seller,
        buyer,
        lines: [
          { description: 'Sample A', quantity: '3', unit_price: '333.3' },
          { description: 'Sample B', quantity: '7', unit_price: '0.5' },
        ],
      }),
      GENERATED_AT,
    );
    expect(snapshot.money_places).toBe(0);
    expect(snapshot.items.map((item) => item.line_total)).toEqual(['1000', '4']);
    expect(documentTotals(snapshot)).toContainEqual(['Total amount', '1,004 JPY']);
  });

  /**
   *   1 × 0.125 = 0.125 → 0.13 (half up; banker's rounding would print 0.12)
   *   3 × 0.335 = 1.005 → 1.01 (binary floating point would print 1.00)
   *   Total 1.14 USD
   */
  it('never loses a cent to floating point or banker’s rounding', () => {
    const snapshot = buildToolSnapshot(
      toolRequestSchema.parse({
        kind: 'commercial_invoice',
        number: 'US-1',
        currency: 'USD',
        seller,
        buyer,
        lines: [
          { description: 'Washer', quantity: '1', unit_price: '0.125' },
          { description: 'Spacer', quantity: '3', unit_price: '0.335' },
        ],
      }),
      GENERATED_AT,
    );
    expect(snapshot.items.map((item) => item.line_total)).toEqual(['0.13', '1.01']);
    expect(snapshot.totals.value).toBe('1.14');
  });
});

describe('verification pack: example C, the calculators', () => {
  /**
   *   10 cartons of 120 × 80 × 100 cm = 0.96 m³ each, 9.6 m³ in all; actual weight 1,200 kg.
   *   Air, IATA 6000 cm³/kg:   9.6 × 1,000,000 / 6000 = 1,600 kg → billed on 1,600 kg
   *   Express, 5000 cm³/kg:    9.6 × 200              = 1,920 kg
   *   Sea LCL, 1000 kg/m³:     9.6 × 1000             = 9,600 kg (W/M: 9.6 revenue tonnes)
   */
  it('volume and chargeable weight', () => {
    const volume = volumeOf([{ length: 120, width: 80, height: 100, count: 10 }], 'cm');
    expect(volume.unitVolumeM3).toBeCloseTo(0.96, 9);
    expect(volume.totalVolumeM3).toBeCloseTo(9.6, 9);
    expect(volume.totalCartons).toBe(10);

    const air = chargeableWeight(9.6, 1200, 'air_iata');
    expect(air.volumetricWeightKg).toBeCloseTo(1600, 6);
    expect(air.chargeableWeightKg).toBeCloseTo(1600, 6);
    expect(air.billedOn).toBe('volumetric');
    expect(chargeableWeight(9.6, 1200, 'air_express').chargeableWeightKg).toBeCloseTo(1920, 6);
    expect(chargeableWeight(9.6, 1200, 'sea_lcl').chargeableWeightKg).toBeCloseTo(9600, 6);
    // Dense goods: 2,000 kg in 1 m³ by air is billed on what it weighs.
    expect(chargeableWeight(1, 2000, 'air_iata').billedOn).toBe('actual');
  });

  it('unit conversions match the exact definitions', () => {
    // 1 ft = 0.3048 m exactly, so 1 m³ = 1 / 0.3048³ = 35.3147 ft³.
    expect(cubicMetresToCubicFeet(1)).toBeCloseTo(35.314667, 5);
    // 1 lb = 0.45359237 kg exactly.
    expect(toKilograms(100, 'lb')).toBeCloseTo(45.359237, 9);
  });

  /**
   * EU-style import: duty on the CIF value, VAT on value plus duty.
   *   Goods 10,000.00 + freight 800.00 + insurance 50.00 = customs value 10,850.00
   *   Duty 5%  of 10,850.00              =    542.50
   *   VAT 20%  of 10,850.00 + 542.50     =  2,278.50
   *   Other costs                        =    150.00
   *   Landed total                       = 13,821.00   per unit (500) = 27.6420
   */
  it('landed cost, duty on CIF and VAT on value plus duty', () => {
    const result = landedCost({
      goodsValue: '10000',
      freight: '800',
      insurance: '50',
      otherCosts: '150',
      dutyRatePercent: '5',
      taxRatePercent: '20',
      dutyBasis: 'cif',
      taxBasis: 'value_plus_duty',
      units: '500',
    });
    expect(result.customsValue.toFixed(2)).toBe('10850.00');
    expect(result.duty.toFixed(2)).toBe('542.50');
    expect(result.tax.toFixed(2)).toBe('2278.50');
    expect(result.total.toFixed(2)).toBe('13821.00');
    expect(result.perUnit?.toFixed(4)).toBe('27.6420');
  });

  /**
   * US-style import: duty on the goods value only (freight and insurance excluded).
   *   Duty 3.5% of 10,000.00 = 350.00; no import VAT.
   *   Landed total 10,000 + 800 + 50 + 350 + 150 = 11,350.00
   */
  it('landed cost, duty on the goods value only', () => {
    const result = landedCost({
      goodsValue: '10000',
      freight: '800',
      insurance: '50',
      otherCosts: '150',
      dutyRatePercent: '3.5',
      taxRatePercent: '0',
      dutyBasis: 'goods',
      taxBasis: 'value',
    });
    expect(result.customsValue.toFixed(2)).toBe('10000.00');
    expect(result.duty.toFixed(2)).toBe('350.00');
    expect(result.total.toFixed(2)).toBe('11350.00');
  });
});
