import { describe, expect, it } from 'vitest';
import { describeStaleness, freshnessOf, staleReasons } from '@/lib/trade/staleness';

const consignee = {
  id: 'c0000000-0000-4000-8000-000000000001',
  name: 'Haugland AS',
  city: 'Bergen',
  country_code: 'NO',
  notes: 'internal',
  updated_at: '2026-10-01T00:00:00Z',
};

function snapshot(overrides: Record<string, unknown> = {}) {
  return {
    schema_version: 4,
    kind: 'commercial_invoice',
    number: 'CI-2026-0001',
    generated_at: '2026-10-06T10:00:00Z',
    shipment: {
      reference: 'KES-1',
      incoterm: 'FCA',
      incoterm_place: 'Felixstowe',
      currency: 'GBP',
      revision: 3,
    },
    exporter: null,
    consignee,
    notify: null,
    issuer: { payment_terms: '30 days net', bank_details: null },
    items: [
      { position: 1, description: 'Hinge', quantity: '100.000', unit: 'pcs', unit_price: '2.5000' },
    ],
    packages: [],
    ...overrides,
  };
}

describe('why a document is stale', () => {
  it('finds nothing when the shipment would produce the same document', () => {
    // Number formatting differs between stored JSON and a fresh preview; the figures do not.
    const now = snapshot({
      number: 'PREVIEW',
      items: [{ position: 1, description: 'Hinge', quantity: 100, unit: 'pcs', unit_price: 2.5 }],
    });
    expect(staleReasons(snapshot(), now)).toEqual([]);
  });

  it('names a changed line', () => {
    const now = snapshot({
      items: [{ position: 1, description: 'Hinge', quantity: 90, unit: 'pcs', unit_price: 2.5 }],
    });
    expect(staleReasons(snapshot(), now)).toEqual(['lines']);
  });

  it('names a consignee whose address changed in the address book', () => {
    const now = snapshot({ consignee: { ...consignee, city: 'Stavanger' } });
    expect(staleReasons(snapshot(), now)).toEqual(['consignee']);
  });

  it('ignores bookkeeping on a party that is not printed', () => {
    const now = snapshot({
      consignee: { ...consignee, notes: 'changed', updated_at: '2026-10-05T00:00:00Z' },
    });
    expect(staleReasons(snapshot(), now)).toEqual([]);
  });

  it('names a party that was swapped for another', () => {
    const now = snapshot({
      consignee: { ...consignee, id: 'c0000000-0000-4000-8000-000000000002' },
    });
    expect(staleReasons(snapshot(), now)).toEqual(['consignee']);
  });

  it('names changed terms and changed issuer settings together, in a stable order', () => {
    const now = snapshot({
      shipment: { ...snapshot().shipment, incoterm: 'DAP', incoterm_place: 'Bergen' },
      issuer: { payment_terms: '60 days net', bank_details: null },
    });
    expect(staleReasons(snapshot(), now)).toEqual(['terms', 'issuer']);
    expect(describeStaleness(['terms', 'issuer'])).toBe(
      'Shipment terms changed; Payment terms, bank details or signatory changed since this was generated.',
    );
  });

  it('does not compare sections an older snapshot never recorded', () => {
    const issued = snapshot({ schema_version: 2, issuer: undefined, packages: undefined });
    const now = snapshot({
      issuer: { payment_terms: 'New terms' },
      packages: [{ position: 1, kind: 'carton', package_count: 2 }],
    });
    expect(staleReasons(issued, now)).toEqual([]);
  });

  it('names changed packing, including what is inside a package', () => {
    const packed = [
      {
        position: 1,
        kind: 'carton',
        package_count: 2,
        contents: [{ position: 1, description: 'Hinge', quantity: '50.000', unit: 'pcs' }],
      },
    ];
    const repacked = [
      {
        position: 1,
        kind: 'carton',
        package_count: 2,
        contents: [{ position: 1, description: 'Hinge', quantity: 60, unit: 'pcs' }],
      },
    ];
    expect(staleReasons(snapshot({ packages: packed }), snapshot({ packages: repacked }))).toEqual([
      'packing',
    ]);
  });
});

describe('document freshness', () => {
  it('reports a document whose content no longer matches as stale, with the reason', () => {
    const now = snapshot({ consignee: { ...consignee, city: 'Stavanger' } });
    const issued = { status: 'final', shipment_revision: 3, snapshot: snapshot() };
    const result = freshnessOf(issued, 3, now);
    expect(result).toEqual({
      stale: true,
      reason: 'Consignee details changed since this was generated.',
    });
  });

  it('falls back to the revision when there is no current snapshot to compare', () => {
    expect(freshnessOf({ status: 'final', shipment_revision: 2 }, 3, undefined)).toEqual({
      stale: true,
      reason: 'The shipment was edited after this was generated.',
    });
    expect(freshnessOf({ status: 'final', shipment_revision: 3 }, 3, undefined).stale).toBe(false);
  });

  it('never calls a superseded or voided document stale', () => {
    expect(freshnessOf({ status: 'voided', shipment_revision: 1 }, 9, snapshot()).stale).toBe(
      false,
    );
  });
});

describe('schema 6 commercial terms', () => {
  const base = snapshot();
  const withTerms = (terms: Record<string, unknown>) =>
    snapshot({ schema_version: 6, shipment: { ...base.shipment, ...terms } });

  it('treats a schema 4 document as current while the shipment states no terms', () => {
    expect(staleReasons(base, snapshot())).toEqual([]);
  });

  it('marks a document stale once a buyer reference is set or changed', () => {
    expect(staleReasons(base, withTerms({ buyer_reference: 'PO-1' }))).toEqual(['terms']);
    expect(
      staleReasons(withTerms({ buyer_reference: 'PO-1' }), withTerms({ buyer_reference: 'PO-2' })),
    ).toEqual(['terms']);
  });

  it('marks a proforma stale when its validity date moves', () => {
    expect(
      staleReasons(
        withTerms({ proforma_valid_until: '2026-11-30' }),
        withTerms({ proforma_valid_until: '2026-12-15' }),
      ),
    ).toEqual(['terms']);
  });
});
