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
  it('sums counts, weights and volume, reading an unmeasured package as nothing', () => {
    const totals = packingTotals([
      carton({ package_count: 4, gross_weight_kg: 96, net_weight_kg: 90, volume_m3: 0.48 }),
      carton({ package_count: 2 }),
    ]);
    expect(totals).toEqual({ count: 6, gross: 96, net: 90, volume: 0.48 });
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

  it('treats a sub-gram rounding difference as reconciled', () => {
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
