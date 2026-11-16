import { describe, expect, it } from 'vitest';
import {
  featurePlans,
  offeredFeatures,
  paidAdditions,
  paidOnlyFeatures,
  shipmentsLimited,
} from '@/lib/billing/plans';
import { FREE_SHIPMENTS_PER_MONTH } from '@/lib/limits';

/**
 * The Free saved-shipment limit (D-027) in the public claims. The limit itself is enforced by
 * the database (supabase/tests/free_shipment_limit.test.sql); these pin that the copy says
 * so exactly while it applies, and never while it does not.
 */
describe('Free shipment limit claims', () => {
  const shipments = (capabilities: Parameters<typeof offeredFeatures>[0]) =>
    offeredFeatures(capabilities).find((feature) => feature.key === 'workspace.shipments');

  it('is 3 new shipments a month', () => {
    expect(FREE_SHIPMENTS_PER_MONTH).toBe(3);
    expect(featurePlans('workspace.unlimited_shipments')).toEqual(['pro', 'team']);
  });

  it('claims no limit while it does not apply', () => {
    expect(shipments({})?.limit).toBe('No cap on the number of shipments');
    expect(
      offeredFeatures({}).some((feature) => feature.key === 'workspace.unlimited_shipments'),
    ).toBe(false);
    expect(paidAdditions({})).toBe('Pro and Team add PDF branding');
  });

  it('states the limit and the paid plans’ unlimited shipments while it applies', () => {
    const on = { free_shipment_limit: true } as const;
    expect(shipments(on)?.limit).toBe(shipmentsLimited());
    expect(shipmentsLimited()).toContain('Free: 3 new shipments a month');
    expect(paidOnlyFeatures('pro', on).map((feature) => feature.key)).toEqual([
      'workspace.unlimited_shipments',
      'pdf_branding',
    ]);
    expect(paidAdditions(on)).toBe('Pro and Team add unlimited saved shipments and PDF branding');
  });
});
