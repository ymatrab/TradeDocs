import { describe, expect, it } from 'vitest';
import {
  packingTotals,
  unreconciledLines,
} from '@/app/(app)/app/[org]/shipments/[shipment]/figures';

const carton = (overrides: Partial<Parameters<typeof packingTotals>[0][number]> = {}) => ({
  package_count: 1,
  net_weight_kg: null,
  gross_weight_kg: null,
  volume_m3: null,
  contents: [],
  ...overrides,
});

describe('packingTotals', () => {
  it('weighs each row as count x per-package weight; unmeasured counts as nothing', () => {
    // Weights are entered per package; volume is already stored for the whole row.
    const totals = packingTotals([
      carton({ package_count: 4, gross_weight_kg: 96, net_weight_kg: 90, volume_m3: 0.48 }),
      carton({ package_count: 2 }),
    ]);
    expect(totals).toEqual({ count: 6, gross: 384, net: 360, volume: 0.48 });
  });

  it('is all zeroes for a shipment with no packages', () => {
    expect(packingTotals([])).toEqual({ count: 0, gross: 0, net: 0, volume: 0 });
  });
});

describe('unreconciledLines', () => {
  const lines = [
    { id: 'a', quantity: 100 },
    { id: 'b', quantity: 20 },
  ];

  it('reports each line whose packed quantity differs, with what is packed', () => {
    const result = unreconciledLines(lines, [
      carton({ contents: [{ item_id: 'a', quantity: 60 }] }),
      carton({ contents: [{ item_id: 'b', quantity: 20 }] }),
    ]);
    expect(result).toEqual([{ item: lines[0], packed: 60 }]);
  });

  it('adds a line packed across several packages before comparing', () => {
    const result = unreconciledLines(lines, [
      carton({ contents: [{ item_id: 'a', quantity: 60 }] }),
      carton({
        contents: [
          { item_id: 'a', quantity: 40 },
          { item_id: 'b', quantity: 20 },
        ],
      }),
    ]);
    expect(result).toEqual([]);
  });

  it('adds decimals exactly, so 0.1 + 0.2 packed reconciles a line of 0.3', () => {
    expect(
      unreconciledLines(
        [{ id: 'a', quantity: 0.3 }],
        [
          carton({
            contents: [
              { item_id: 'a', quantity: 0.1 },
              { item_id: 'a', quantity: 0.2 },
            ],
          }),
        ],
      ),
    ).toEqual([]);
  });
});
