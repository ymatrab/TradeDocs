import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { packingTotals, rowWeight, unreconciledLines } from '@/lib/trade/packing';
import { calendarDateField, decimalField, grossBelowNet, hsCodeField } from '@/lib/trade/inputs';

describe('packing arithmetic', () => {
  it('weighs a row as count x per-package weight, as the volume already was', () => {
    // Four cartons at 12.5 kg each: 50 kg, not 12.5 kg.
    const totals = packingTotals([
      { package_count: 4, net_weight_kg: 10, gross_weight_kg: '12.5', volume_m3: '0.2400' },
      { package_count: 1, net_weight_kg: null, gross_weight_kg: null, volume_m3: null },
    ]);
    expect(totals.packages).toBe(5);
    expect(totals.gross_weight_kg?.toFixed(3)).toBe('50.000');
    expect(totals.net_weight_kg?.toFixed(3)).toBe('40.000');
    expect(totals.volume_m3.toFixed(4)).toBe('0.2400');
  });

  it('states no weight total when no package states a weight', () => {
    const totals = packingTotals([
      { package_count: 3, net_weight_kg: null, gross_weight_kg: null, volume_m3: null },
    ]);
    expect(totals.gross_weight_kg).toBeNull();
    expect(totals.net_weight_kg).toBeNull();
  });

  it('adds exactly, where floating point would not', () => {
    expect(rowWeight(3, '0.1')?.toFixed(3)).toBe('0.300');
  });

  it('reports lines whose packed quantity differs, exactly', () => {
    const items = [
      { id: 'a', quantity: '0.3' },
      { id: 'b', quantity: 10 },
      { id: 'c', quantity: 5 },
    ];
    const result = unreconciledLines(items, [
      { item_id: 'a', quantity: 0.1 },
      { item_id: 'a', quantity: 0.2 },
      { item_id: 'b', quantity: 12 },
    ]);
    expect(result.map(({ item, over }) => [item.id, over])).toEqual([
      ['b', true],
      ['c', false],
    ]);
  });
});

describe('form figures', () => {
  const quantity = z.object({
    value: decimalField({ label: 'quantity', places: 3, required: true, positive: true }),
  });
  const price = z.object({ value: decimalField({ label: 'unit price', places: 4 }) });

  it('reads a European decimal comma as a decimal', () => {
    expect(quantity.parse({ value: '1,5' }).value).toBe('1.5');
    expect(price.parse({ value: '1.234,56' }).value).toBe('1234.56');
  });

  it('keeps blank optional figures as not stated', () => {
    expect(price.parse({ value: '' }).value).toBeNull();
  });

  it('says what is wrong with a figure, in words', () => {
    const messages = (value: string) => {
      const result = quantity.safeParse({ value });
      return result.success ? [] : result.error.issues.map((issue) => issue.message);
    };
    expect(messages('')).toEqual(['Enter the quantity.']);
    expect(messages('lots')).toEqual(['Enter the quantity as a number.']);
    expect(messages('0')).toEqual(['The quantity must be greater than zero.']);
    expect(messages('1.2345')).toEqual(['Use at most 3 decimal places for the quantity.']);
    expect(messages('99999999999')).toEqual(['The quantity is too large.']);
  });

  it('refuses a negative price rather than storing it', () => {
    const result = price.safeParse({ value: '-1' });
    expect(result.success).toBe(false);
  });

  it('accepts an HS code written with dots and spaces', () => {
    expect(hsCodeField.parse('8483.30 10')).toBe('84833010');
    expect(hsCodeField.safeParse('8483').success).toBe(false);
  });

  it('accepts only real calendar dates', () => {
    expect(calendarDateField.parse('2026-02-28')).toBe('2026-02-28');
    expect(calendarDateField.safeParse('2026-02-30').success).toBe(false);
    expect(calendarDateField.parse('')).toBeNull();
  });

  it('compares gross and net weights exactly', () => {
    expect(grossBelowNet('10.001', '10')).toBe(true);
    expect(grossBelowNet('10', '10.000')).toBe(false);
    expect(grossBelowNet(null, '1')).toBe(false);
  });
});
