import { describe, expect, it } from 'vitest';
import { CONTAINERS } from '@/lib/trade/calculations';
import {
  containerLoading,
  LOADING_CONTAINERS,
  parseDecimal,
  type LoadUnitInput,
} from '@/lib/trade/container-loading';
import {
  convert,
  CUBIC_METRES_PER_CUBIC_FOOT,
  KILOGRAMS_PER_POUND,
} from '@/lib/trade/conversions';
import { PAGE_SOURCES } from '@/lib/trade/sources';

function load(overrides: Partial<LoadUnitInput> = {}) {
  return containerLoading({
    length: '60',
    width: '40',
    height: '40',
    lengthUnit: 'cm',
    weight: '15',
    weightUnit: 'kg',
    ...overrides,
  });
}

function row(result: ReturnType<typeof containerLoading>, kind: string) {
  const found = result?.containers.find((entry) => entry.kind === kind);
  if (!found) throw new Error(`no ${kind} row`);
  return found;
}

describe('container loading estimate', () => {
  it('offers the 20ft, 40ft and 40ft high-cube containers, with the Maersk figures', () => {
    expect(LOADING_CONTAINERS).toEqual(['20ft', '40ft', '40hc']);
    const result = load();
    expect(result?.containers.map((entry) => entry.label)).toEqual(
      LOADING_CONTAINERS.map((kind) => CONTAINERS[kind].label),
    );
  });

  it('takes the smaller of the volume and weight bounds', () => {
    const result = load();
    expect(result?.unitVolumeM3).toBe('0.096');
    // 33 / 0.096 = 343.75 and 28,200 / 15 = 1,880.
    expect(row(result, '20ft')).toMatchObject({
      byVolume: 343,
      byWeight: 1880,
      units: 343,
      limitedBy: 'volume',
    });
    // 67 / 0.096 = 697.9; 76 / 0.096 = 791.6.
    expect(row(result, '40ft').units).toBe(697);
    expect(row(result, '40hc').units).toBe(791);
  });

  it('is limited by weight when one unit is heavy', () => {
    // 28,800 / 500 = 57.6, far below the 697 the volume allows.
    expect(row(load({ weight: '500' }), '40ft')).toMatchObject({
      byWeight: 57,
      units: 57,
      limitedBy: 'weight',
    });
  });

  it('skips the weight bound when no weight is given', () => {
    const entry = row(load({ weight: '' }), '20ft');
    expect(entry.byWeight).toBeNull();
    expect(entry.weightUsed).toBeNull();
    expect(entry.units).toBe(343);
  });

  it('counts the containers a quantity needs, rounding up', () => {
    expect(row(load({ quantity: '1000' }), '20ft').containersNeeded).toBe(3);
    expect(row(load({ quantity: '343' }), '20ft').containersNeeded).toBe(1);
    expect(row(load({ quantity: '344' }), '20ft').containersNeeded).toBe(2);
    expect(row(load(), '20ft').containersNeeded).toBeNull();
  });

  it('applies a usable-volume share to the volume bound only', () => {
    const entry = row(load({ usablePercent: '80' }), '20ft');
    // 33 × 0.8 / 0.096 = 275.
    expect(entry.byVolume).toBe(275);
    expect(entry.byWeight).toBe(1880);
  });

  it('works in exact decimals across units', () => {
    // 10 in = 0.254 m exactly, so a 10 in cube is 0.016387064 m³, never 0.016387063999….
    const result = load({ length: '10', width: '10', height: '10', lengthUnit: 'in' });
    expect(result?.unitVolumeM3).toBe('0.016387');
    // A 33 lb unit is 14.968548 kg (33 × 0.45359237).
    expect(load({ weight: '33', weightUnit: 'lb' })?.unitWeightKg).toBe('14.969');
  });

  it('reports a unit too large for a container as fitting none, with no container count', () => {
    const entry = row(
      load({ length: '6', width: '3', height: '3', lengthUnit: 'm', quantity: '5' }),
      '20ft',
    );
    expect(entry.units).toBe(0);
    expect(entry.containersNeeded).toBeNull();
  });

  it('accepts a decimal comma and refuses what is not a positive figure', () => {
    expect(load({ length: '60,5' })?.unitVolumeM3).toBe('0.0968');
    expect(load({ length: '' })).toBeNull();
    expect(load({ height: '0' })).toBeNull();
    expect(load({ width: '-4' })).toBeNull();
    expect(load({ weight: 'heavy' })).toBeNull();
    expect(load({ quantity: '2.5' })).toBeNull();
    expect(load({ usablePercent: '0' })).toBeNull();
    expect(load({ usablePercent: '120' })).toBeNull();
    expect(parseDecimal(' 1 200,5 ')?.toString()).toBe('1200.5');
    expect(parseDecimal('1e3')).toBeNull();
  });
});

describe('unit conversions', () => {
  it('uses the exact defined factors', () => {
    expect(CUBIC_METRES_PER_CUBIC_FOOT.toString()).toBe('0.028316846592');
    expect(KILOGRAMS_PER_POUND.toString()).toBe('0.45359237');
  });

  it('converts CBM and cubic feet both ways', () => {
    expect(convert('1', 'm3_to_ft3')).toBe('35.3147');
    expect(convert('2', 'm3_to_ft3')).toBe('70.6293');
    expect(convert('1000', 'ft3_to_m3')).toBe('28.316847');
    expect(convert('1', 'ft3_to_m3')).toBe('0.028317');
  });

  it('converts kilograms and pounds both ways', () => {
    expect(convert('1', 'kg_to_lb')).toBe('2.2046');
    expect(convert('25', 'kg_to_lb')).toBe('55.1156');
    expect(convert('100', 'lb_to_kg')).toBe('45.3592');
    expect(convert('1', 'lb_to_kg')).toBe('0.4536');
  });

  it('never prints exponent notation and refuses non-numbers', () => {
    expect(convert('0.0000001', 'kg_to_lb')).toBe('0');
    expect(convert('1000000000000000000000000', 'lb_to_kg')).toBe('453592370000000000000000');
    expect(convert('', 'kg_to_lb')).toBeNull();
    expect(convert('-1', 'kg_to_lb')).toBeNull();
    expect(convert('ten', 'kg_to_lb')).toBeNull();
  });

  it('cites NIST for both factors and Maersk for the container figures', () => {
    expect(PAGE_SOURCES.unitConverter).toEqual(['nist-si-volume', 'nist-si-mass']);
    expect(PAGE_SOURCES.containerLoading).toEqual(['maersk-dry-containers']);
  });
});
