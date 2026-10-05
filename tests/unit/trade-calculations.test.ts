import { describe, expect, it } from 'vitest';
import {
  CONTAINERS,
  chargeableWeight,
  containerFit,
  cubicFeetToCubicMetres,
  cubicMetresToCubicFeet,
  toKilograms,
  toMetres,
  volumeOf,
} from '@/lib/trade/calculations';
import { INCOTERMS, findIncoterm, incotermFaq } from '@/lib/trade/incoterms';
import { PAGE_SOURCES, SOURCES, lastReviewed, sourcesFor } from '@/lib/trade/sources';

describe('unit conversion', () => {
  it('converts the length units a packing list is measured in', () => {
    expect(toMetres(100, 'cm')).toBeCloseTo(1, 10);
    expect(toMetres(1000, 'mm')).toBeCloseTo(1, 10);
    expect(toMetres(12, 'in')).toBeCloseTo(0.3048, 10);
    expect(toMetres(1, 'ft')).toBeCloseTo(0.3048, 10);
  });

  it('converts pounds by the international definition, not an approximation', () => {
    expect(toKilograms(1, 'lb')).toBeCloseTo(0.45359237, 10);
    expect(toKilograms(2500, 'g')).toBeCloseTo(2.5, 10);
  });
});

describe('cubic feet', () => {
  it('uses the exact SI factor, so one cubic metre is about 35.3147 cubic feet', () => {
    expect(cubicMetresToCubicFeet(1)).toBeCloseTo(35.3146667, 6);
    expect(cubicFeetToCubicMetres(1)).toBeCloseTo(0.028316846592, 12);
    expect(cubicFeetToCubicMetres(cubicMetresToCubicFeet(33.2))).toBeCloseTo(33.2, 10);
  });
});

describe('volume', () => {
  it('computes CBM for a carton in centimetres', () => {
    const result = volumeOf([{ length: 40, width: 30, height: 20, count: 1 }], 'cm');
    expect(result.unitVolumeM3).toBeCloseTo(0.024, 10);
    expect(result.totalVolumeM3).toBeCloseTo(0.024, 10);
  });

  it('multiplies by the carton count', () => {
    const result = volumeOf([{ length: 40, width: 30, height: 20, count: 50 }], 'cm');
    expect(result.totalVolumeM3).toBeCloseTo(1.2, 10);
    expect(result.totalCartons).toBe(50);
  });

  it('adds up cartons of different sizes', () => {
    const result = volumeOf(
      [
        { length: 100, width: 100, height: 100, count: 1 },
        { length: 50, width: 50, height: 50, count: 8 },
      ],
      'cm',
    );
    expect(result.totalVolumeM3).toBeCloseTo(2, 10);
    expect(result.totalCartons).toBe(9);
  });

  it('gives a cubic metre for a metre cube whatever unit states it', () => {
    expect(volumeOf([{ length: 1, width: 1, height: 1, count: 1 }], 'm').totalVolumeM3).toBeCloseTo(
      1,
      10,
    );
    expect(
      volumeOf([{ length: 1000, width: 1000, height: 1000, count: 1 }], 'mm').totalVolumeM3,
    ).toBeCloseTo(1, 10);
  });
});

describe('chargeable weight', () => {
  it('bills light bulky cargo on its volume', () => {
    // One cubic metre at 50 kg: IATA volumetric is about 167 kg, so the space is billed.
    const result = chargeableWeight(1, 50, 'air_iata');
    expect(result.volumetricWeightKg).toBeCloseTo(166.667, 3);
    expect(result.chargeableWeightKg).toBeCloseTo(166.667, 3);
    expect(result.billedOn).toBe('volumetric');
  });

  it('bills dense cargo on what it actually weighs', () => {
    const result = chargeableWeight(1, 400, 'air_iata');
    expect(result.chargeableWeightKg).toBe(400);
    expect(result.billedOn).toBe('actual');
  });

  it('applies the express divisor as 200 kg per cubic metre', () => {
    expect(chargeableWeight(1, 0, 'air_express').volumetricWeightKg).toBeCloseTo(200, 6);
  });

  it('treats sea LCL as one tonne per cubic metre, billing on whichever is greater', () => {
    expect(chargeableWeight(2, 1500, 'sea_lcl').chargeableWeightKg).toBe(2000);
    expect(chargeableWeight(2, 2500, 'sea_lcl').chargeableWeightKg).toBe(2500);
  });

  it('reports the two as equal only when they genuinely are', () => {
    expect(chargeableWeight(1, 1000, 'sea_lcl').billedOn).toBe('equal');
    expect(chargeableWeight(1, 1000.5, 'sea_lcl').billedOn).toBe('actual');
  });

  it('handles a consignment with no volume without dividing by nothing', () => {
    const result = chargeableWeight(0, 10, 'air_iata');
    expect(result.volumetricWeightKg).toBe(0);
    expect(result.chargeableWeightKg).toBe(10);
  });
});

describe('container fit', () => {
  it('says a small consignment fits every standard container', () => {
    expect(containerFit(10, 2000).every((option) => option.fits)).toBe(true);
  });

  it('reports weight as the constraint for dense cargo', () => {
    const twenty = containerFit(5, 27_000).find((option) => option.kind === '20ft');
    expect(twenty?.limitedBy).toBe('weight');
    expect(twenty?.fits).toBe(true);
  });

  it('reports volume as the constraint for bulky cargo, and that it does not fit', () => {
    const twenty = containerFit(40, 1000).find((option) => option.kind === '20ft');
    expect(twenty?.limitedBy).toBe('volume');
    expect(twenty?.fits).toBe(false);
  });

  it('keeps the container list in ascending capacity, which is how it is read', () => {
    const volumes = Object.values(CONTAINERS).map((container) => container.volumeM3);
    expect([...volumes].sort((a, b) => a - b)).toEqual(volumes);
  });
});

describe('incoterms reference', () => {
  it('carries all eleven rules of the 2020 revision', () => {
    expect(INCOTERMS).toHaveLength(11);
  });

  it('restricts exactly the four maritime-only rules to sea transport', () => {
    const sea = INCOTERMS.filter((term) => term.mode === 'sea').map((term) => term.code);
    expect(sea).toEqual(['FAS', 'FOB', 'CFR', 'CIF']);
  });

  it('names DPU rather than the DAT it replaced', () => {
    expect(findIncoterm('DPU')).toBeDefined();
    expect(findIncoterm('DAT')).toBeUndefined();
  });

  it('makes only DDP a rule where the seller clears the import', () => {
    const sellerClears = INCOTERMS.filter((term) => term.importClearance === 'seller');
    expect(sellerClears.map((term) => term.code)).toEqual(['DDP']);
  });

  it('makes EXW the only rule where the buyer clears the export', () => {
    const buyerClears = INCOTERMS.filter((term) => term.exportClearance === 'buyer');
    expect(buyerClears.map((term) => term.code)).toEqual(['EXW']);
  });

  it('finds a rule whatever case it is asked for', () => {
    expect(findIncoterm('fob')?.name).toBe('Free on Board');
  });

  it('gives every rule page the same complete set of sections', () => {
    for (const term of INCOTERMS) {
      expect(term.faq.length, term.code).toBeGreaterThanOrEqual(3);
      expect(term.faq.length, term.code).toBeLessThanOrEqual(4);
      expect(term.mistakes.length, term.code).toBeGreaterThanOrEqual(2);
      expect(term.example, term.code).not.toBe('');
      expect(term.carriageNote, term.code).not.toBe('');
    }
    expect(incotermFaq('fca')).toBe(findIncoterm('FCA')?.faq);
    expect(incotermFaq('dat')).toEqual([]);
  });

  it('leaves the main carriage with the buyer under exactly the E and F rules', () => {
    const buyerCarries = INCOTERMS.filter((term) => term.mainCarriage === 'buyer');
    expect(buyerCarries.map((term) => term.code)).toEqual(['EXW', 'FCA', 'FAS', 'FOB']);
  });

  it('never says the rules can oblige a carrier to issue a bill of lading', () => {
    const fca = JSON.stringify(findIncoterm('FCA'));
    expect(fca).not.toMatch(/obliges the carrier|oblige the carrier to issue/i);
  });

  it('puts the cost of a DAP import-clearance delay on the buyer', () => {
    expect(findIncoterm('DAP')?.watchOut).toMatch(/fall on the buyer, not the seller/);
  });
});

describe('source registry', () => {
  it('cites only records that exist, over https, with a retrieval date and reviewer', () => {
    for (const ids of Object.values(PAGE_SOURCES)) {
      for (const record of sourcesFor(ids)) {
        expect(record.url).toMatch(/^https:\/\//);
        expect(record.retrieved).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(record.reviewer).not.toBe('');
      }
    }
    expect(Object.values(SOURCES).every((record) => record.id in SOURCES)).toBe(true);
  });

  it('reports the latest retrieval among the sources a page cites', () => {
    expect(lastReviewed(sourcesFor(PAGE_SOURCES.invoice))).toBe('2026-10-05');
  });
});
