import { describe, expect, it } from 'vitest';
import { landedCost, parseAmount, parseRate } from '@/lib/trade/landed-cost';

const base = {
  goodsValue: '10000',
  freight: '1200',
  insurance: '50',
  otherCosts: '300',
  dutyRatePercent: '5',
  taxRatePercent: '20',
  dutyBasis: 'cif' as const,
  taxBasis: 'value_plus_duty' as const,
  units: '500',
};

describe('landed cost', () => {
  it('charges duty on the CIF value and tax on value plus duty', () => {
    const result = landedCost(base);
    // CIF 11,250.00; duty 5% = 562.50; tax 20% of 11,812.50 = 2,362.50.
    expect(result.customsValue.toFixed(2)).toBe('11250.00');
    expect(result.duty.toFixed(2)).toBe('562.50');
    expect(result.taxBase.toFixed(2)).toBe('11812.50');
    expect(result.tax.toFixed(2)).toBe('2362.50');
    // 10,000 + 1,200 + 50 + 562.50 + 2,362.50 + 300.
    expect(result.total.toFixed(2)).toBe('14475.00');
    expect(result.addedCost.toFixed(2)).toBe('4475.00');
    expect(result.perUnit?.toFixed(4)).toBe('28.9500');
  });

  it('charges duty on the goods value alone when that basis is chosen', () => {
    const result = landedCost({ ...base, dutyBasis: 'goods', taxBasis: 'value' });
    expect(result.customsValue.toFixed(2)).toBe('10000.00');
    expect(result.duty.toFixed(2)).toBe('500.00');
    expect(result.tax.toFixed(2)).toBe('2000.00');
    expect(result.total.toFixed(2)).toBe('14050.00');
  });

  it('is exact where binary floating point is not', () => {
    const result = landedCost({
      ...base,
      goodsValue: '0.1',
      freight: '0.2',
      insurance: '0',
      otherCosts: '0',
      dutyRatePercent: '0',
      taxRatePercent: '0',
      units: null,
    });
    expect(result.total.toString()).toBe('0.3');
    expect(result.perUnit).toBeNull();
  });

  it('rounds duty and tax half up, once each, so the lines add to the total', () => {
    const result = landedCost({
      ...base,
      goodsValue: '10.05',
      freight: '0',
      insurance: '0',
      otherCosts: '0',
      dutyRatePercent: '10',
      taxRatePercent: '0',
    });
    // 10% of 10.05 is 1.005, which rounds to 1.01.
    expect(result.duty.toFixed(2)).toBe('1.01');
    expect(result.total.toFixed(2)).toBe('11.06');
  });

  it('respects a currency with no minor units', () => {
    const result = landedCost({ ...base, goodsValue: '1005', dutyRatePercent: '3.3', places: 0 });
    // CIF 2,255 × 3.3% = 74.415, rounded to 74.
    expect(result.duty.toString()).toBe('74');
  });

  it('gives no per-unit figure for zero units', () => {
    expect(landedCost({ ...base, units: '0' }).perUnit).toBeNull();
  });
});

describe('form input', () => {
  it('reads plain and comma decimals and refuses everything else', () => {
    expect(parseAmount('1250.5')?.toString()).toBe('1250.5');
    expect(parseAmount(' 12,75 ')?.toString()).toBe('12.75');
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('-5')).toBeNull();
    expect(parseAmount('1,250.00')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
  });

  it('refuses rates outside 0 to 1000 percent', () => {
    expect(parseRate('0')?.toString()).toBe('0');
    expect(parseRate('1000')?.toString()).toBe('1000');
    expect(parseRate('1000.01')).toBeNull();
  });
});
