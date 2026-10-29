import { describe, expect, it } from 'vitest';
import { staleReasons } from '@/lib/trade/staleness';
import { CHARGE_KINDS, CHARGE_LABELS } from '@/lib/trade/charges';

/** D-029: charges and EORI mark an issued document stale only where they print. */
describe('staleness for charges and EORI', () => {
  const base = {
    schema_version: 8,
    kind: 'commercial_invoice',
    items: [],
    shipment: { reference: 'CH-1', currency: 'EUR' },
    exporter: { id: 'a', name: 'Charges Exports Ltd', tax_number: 'GB1' },
    consignee: null,
    notify: null,
    charges: [
      { position: 1, kind: 'freight', label: null, amount: '180.00', included_in_price: false },
    ],
  };

  it('flags an invoice whose charges changed', () => {
    const now = {
      ...base,
      charges: [
        { position: 1, kind: 'freight', label: null, amount: '200.00', included_in_price: false },
      ],
    };
    expect(staleReasons(base, now)).toEqual(['charges']);
  });

  it('flags an invoice whose charges were all removed', () => {
    expect(staleReasons(base, { ...base, charges: undefined })).toEqual(['charges']);
  });

  it('treats 180 and "180.00" as the same amount', () => {
    const now = {
      ...base,
      charges: [{ position: 1, kind: 'freight', label: null, amount: 180, included_in_price: false }],
    };
    expect(staleReasons(base, now)).toEqual([]);
  });

  it('ignores charges on a packing list, which does not print them', () => {
    const packing = { ...base, kind: 'packing_list' };
    expect(staleReasons(packing, { ...packing, charges: [] })).toEqual([]);
  });

  it('flags the exporter when its EORI is added, and not when it stays absent', () => {
    const withEori = { ...base, exporter: { ...base.exporter, eori_number: 'GB123456789000' } };
    expect(staleReasons(base, withEori)).toEqual(['exporter']);
    expect(staleReasons(base, { ...base })).toEqual([]);
  });

  it('names every charge kind', () => {
    for (const kind of CHARGE_KINDS) expect(CHARGE_LABELS[kind]).toMatch(/^[A-Z]/);
  });
});
