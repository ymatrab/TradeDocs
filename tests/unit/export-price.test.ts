import { describe, expect, it } from 'vitest';
import { EXPORT_PRICE_TERMS, exportPrice } from '@/lib/trade/export-price';

const base = {
  exwValue: '10000',
  inlandTransport: '300',
  exportClearance: '150',
  loading: '250',
  mainFreight: '1800',
  insurance: '41.25',
  destinationCharges: '400',
  dutyRatePercent: '5',
  taxRatePercent: '20',
  dutyBasis: 'cif' as const,
  taxBasis: 'value_plus_duty' as const,
  units: '500',
};

describe('export price ladder', () => {
  it('builds each rung from the one below', () => {
    const { prices } = exportPrice(base);
    expect(prices.exw.toFixed(2)).toBe('10000.00');
    // 10,000 + 300 inland + 150 clearance + 250 loading.
    expect(prices.fob.toFixed(2)).toBe('10700.00');
    expect(prices.cfr.toFixed(2)).toBe('12500.00');
    expect(prices.cif.toFixed(2)).toBe('12541.25');
  });

  it('estimates DDP with duty on the CIF value and tax on value plus duty', () => {
    const result = exportPrice(base);
    // Duty 5% of 12,541.25 = 627.0625 → 627.06; tax 20% of 13,168.31 = 2,633.662 → 2,633.66.
    expect(result.customsValue.toFixed(2)).toBe('12541.25');
    expect(result.duty.toFixed(2)).toBe('627.06');
    expect(result.taxBase.toFixed(2)).toBe('13168.31');
    expect(result.tax.toFixed(2)).toBe('2633.66');
    // 12,541.25 + 400 destination + 627.06 + 2,633.66.
    expect(result.prices.ddp.toFixed(2)).toBe('16201.97');
  });

  it('charges duty on the FOB value and tax on the value alone when chosen', () => {
    const result = exportPrice({ ...base, dutyBasis: 'fob', taxBasis: 'value' });
    expect(result.customsValue.toFixed(2)).toBe('10700.00');
    expect(result.duty.toFixed(2)).toBe('535.00');
    expect(result.tax.toFixed(2)).toBe('2140.00');
    expect(result.prices.ddp.toFixed(2)).toBe('15616.25');
    // The basis changes only the DDP estimate.
    expect(result.prices.cif.toFixed(2)).toBe('12541.25');
  });

  it('gives a price per unit for every rung', () => {
    const { perUnit } = exportPrice(base);
    expect(perUnit?.exw.toFixed(4)).toBe('20.0000');
    expect(perUnit?.fob.toFixed(4)).toBe('21.4000');
    expect(perUnit?.cfr.toFixed(4)).toBe('25.0000');
    expect(perUnit?.cif.toFixed(4)).toBe('25.0825');
    expect(perUnit?.ddp.toFixed(4)).toBe('32.4039');
  });

  it('gives no per-unit figures without a positive unit count', () => {
    expect(exportPrice({ ...base, units: null }).perUnit).toBeNull();
    expect(exportPrice({ ...base, units: '0' }).perUnit).toBeNull();
  });

  it('is exact where binary floating point is not', () => {
    const result = exportPrice({
      ...base,
      exwValue: '0.1',
      inlandTransport: '0.2',
      exportClearance: '0',
      loading: '0',
      mainFreight: '0',
      insurance: '0',
      destinationCharges: '0',
      dutyRatePercent: '0',
      taxRatePercent: '0',
    });
    expect(result.prices.fob.toString()).toBe('0.3');
    expect(result.prices.ddp.toString()).toBe('0.3');
  });

  it('rounds each amount half up to the currency’s minor units', () => {
    const cents = exportPrice({ ...base, exwValue: '10.005', units: null });
    expect(cents.exwValue.toFixed(2)).toBe('10.01');
    const yen = exportPrice({ ...base, exwValue: '1000.5', insurance: '0.4', places: 0 });
    expect(yen.exwValue.toFixed(0)).toBe('1001');
    expect(yen.insurance.toFixed(0)).toBe('0');
  });

  it('never lets a rung fall below the one before it', () => {
    const { prices } = exportPrice(base);
    for (let index = 1; index < EXPORT_PRICE_TERMS.length; index += 1) {
      const lower = EXPORT_PRICE_TERMS[index - 1];
      const higher = EXPORT_PRICE_TERMS[index];
      if (!lower || !higher) throw new Error('unreachable');
      expect(prices[higher].greaterThanOrEqualTo(prices[lower])).toBe(true);
    }
  });

  it('is all zeros on an empty form', () => {
    const result = exportPrice({
      ...base,
      exwValue: 0,
      inlandTransport: 0,
      exportClearance: 0,
      loading: 0,
      mainFreight: 0,
      insurance: 0,
      destinationCharges: 0,
      units: null,
    });
    for (const term of EXPORT_PRICE_TERMS) expect(result.prices[term].isZero()).toBe(true);
  });
});
