import { describe, expect, it } from 'vitest';
import { PALLET_PRESETS, palletLoad, type PalletInput } from '@/lib/trade/pallet';
import { VOLUME_UNIT_KEYS, convertVolume, convertVolumeToAll } from '@/lib/trade/conversions';
import { PAGE_SOURCES, SOURCES } from '@/lib/trade/sources';

const EURO: PalletInput = {
  cartonLength: '40',
  cartonWidth: '30',
  cartonHeight: '30',
  cartonUnit: 'cm',
  cartonWeight: '12',
  weightUnit: 'kg',
  palletLength: '1200',
  palletWidth: '800',
  palletHeight: '144',
  palletUnit: 'mm',
  palletWeight: '25',
  maxHeight: '1800',
  maxLoad: '1500',
};

function load(overrides: Partial<PalletInput> = {}) {
  const outcome = palletLoad({ ...EURO, ...overrides });
  if (!outcome.ok) throw new Error(`refused: ${outcome.reason}`);
  return outcome.result;
}

describe('pallet calculator', () => {
  it('turns the cartons the better way round on the deck', () => {
    // Lengthwise 3 × 2 = 6; crosswise 4 × 2 = 8.
    const result = load();
    expect(result.perLayer).toBe(8);
    expect(result.orientation).toBe('crosswise');
    expect([result.columns, result.rows]).toEqual([4, 2]);
    expect(result.deckUsed).toBe(1);
  });

  it('stacks layers up to the height limit, pallet included', () => {
    // (1800 − 144) / 300 = 5.52, so five layers.
    const result = load();
    expect(result.layersByHeight).toBe(5);
    expect(result.cartonsPerPallet).toBe(40);
    expect(result.limitedBy).toBe('height');
    expect(result.loadedHeightMm).toBe('1644');
  });

  it('works out the load and gross weight with the pallet', () => {
    const result = load();
    expect(result.loadKg).toBe('480');
    expect(result.grossKg).toBe('505');
  });

  it('lets the weight limit bind and leaves the top layer part-filled', () => {
    const result = load({ cartonWeight: '40', maxLoad: '1000' });
    expect(result.cartonsByWeight).toBe(25);
    expect(result.cartonsPerPallet).toBe(25);
    expect(result.limitedBy).toBe('weight');
    expect(result.layersUsed).toBe(4);
    expect(result.loadedHeightMm).toBe('1344');
  });

  it('counts pallets for a quantity, with the remainder on the last one', () => {
    const result = load({ quantity: '130' });
    expect(result.palletsNeeded).toBe(4);
    expect(result.lastPalletCartons).toBe(10);
    expect(load({ quantity: '80' }).lastPalletCartons).toBe(40);
  });

  it('mixes units exactly: inch cartons on a 48 × 40 in pallet', () => {
    const result = load({
      cartonLength: '16',
      cartonWidth: '12',
      cartonHeight: '10',
      cartonUnit: 'in',
      palletLength: '48',
      palletWidth: '40',
      palletHeight: '5',
      palletUnit: 'in',
      maxHeight: '60',
      cartonWeight: '20',
      weightUnit: 'lb',
      palletWeight: '',
      maxLoad: '',
    });
    // 48/16 × 40/12 = 3 × 3 = 9 against 48/12 × 40/16 = 4 × 2 = 8; (60 − 5) / 10 = 5 layers.
    expect(result.perLayer).toBe(9);
    expect(result.cartonsPerPallet).toBe(45);
    expect(result.loadedHeightMm).toBe('1397');
    // 45 × 20 lb = 900 lb = 408.23 kg, and a blank pallet weight is counted as zero and said so.
    expect(result.loadKg).toBe('408.23');
    expect(result.grossKg).toBe('408.23');
    expect(result.assumedZero).toEqual(['palletWeight']);
  });

  it('skips weight when no carton weight is given', () => {
    const result = load({ cartonWeight: '' });
    expect(result.cartonsByWeight).toBeNull();
    expect(result.loadKg).toBeNull();
    expect(result.cartonsPerPallet).toBe(40);
  });

  it('refuses inputs it cannot answer instead of guessing', () => {
    expect(palletLoad({ ...EURO, cartonLength: '' })).toEqual({ ok: false, reason: 'incomplete' });
    expect(palletLoad({ ...EURO, maxHeight: 'abc' }).ok).toBe(false);
    expect(palletLoad({ ...EURO, cartonWeight: '-3' }).ok).toBe(false);
    expect(palletLoad({ ...EURO, quantity: '2.5' }).ok).toBe(false);
    expect(palletLoad({ ...EURO, cartonLength: '130', cartonWidth: '90' })).toEqual({
      ok: false,
      reason: 'carton-too-large',
    });
    expect(palletLoad({ ...EURO, maxHeight: '400' })).toEqual({ ok: false, reason: 'too-tall' });
    expect(palletLoad({ ...EURO, cartonWeight: '2000' })).toEqual({
      ok: false,
      reason: 'too-heavy',
    });
  });

  it('presets the pallets the sources publish, and nothing they do not', () => {
    const byId = new Map(PALLET_PRESETS.map((preset) => [preset.id, preset]));
    expect(byId.get('epal1')).toMatchObject({ length: '1200', width: '800', height: '144' });
    expect(byId.get('epal1')).toMatchObject({ weightKg: '25', safeWorkingLoadKg: '1500' });
    expect(byId.get('epal2')).toMatchObject({ length: '1200', width: '1000', height: '162' });
    expect(byId.get('epal2')).toMatchObject({ weightKg: '35', safeWorkingLoadKg: '1250' });
    expect(byId.get('gma')).toMatchObject({ length: '48', width: '40', unit: 'in', height: '' });
    for (const id of PAGE_SOURCES.palletCalculator) expect(SOURCES[id]).toBeDefined();
  });
});

describe('volume converter', () => {
  it('converts a cubic metre into every unit with exact factors', () => {
    expect(convertVolume('1', 'm3', 'ft3')).toBe('35.3147');
    expect(convertVolume('1', 'm3', 'cm3')).toBe('1000000');
    expect(convertVolume('1', 'm3', 'in3')).toBe('61023.74');
    expect(convertVolume('1', 'm3', 'l')).toBe('1000');
    expect(convertVolume('1', 'ft3', 'm3')).toBe('0.028317');
    expect(convertVolume('1728', 'in3', 'ft3')).toBe('1');
    expect(convertVolume('2900', 'cm3', 'm3')).toBe('0.0029');
  });

  it('accepts a decimal comma and refuses what is not a volume', () => {
    expect(convertVolume('2,5', 'm3', 'l')).toBe('2500');
    expect(convertVolume('', 'm3', 'ft3')).toBeNull();
    expect(convertVolume('-1', 'm3', 'ft3')).toBeNull();
    expect(convertVolume('1e3', 'm3', 'ft3')).toBeNull();
  });

  it('lists the same volume in every unit', () => {
    const rows = convertVolumeToAll('33', 'm3');
    expect(rows?.map((row) => row.unit)).toEqual(VOLUME_UNIT_KEYS);
    expect(rows?.find((row) => row.unit === 'ft3')?.value).toBe('1165.384');
    expect(convertVolumeToAll('x', 'm3')).toBeNull();
  });
});
