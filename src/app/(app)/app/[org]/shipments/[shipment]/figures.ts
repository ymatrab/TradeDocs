import {
  packingTotals as exactPackingTotals,
  unreconciledLines as exactUnreconciledLines,
} from '@/lib/trade/packing';

/**
 * Display arithmetic shared by the shipment screen's server page (summary, step states)
 * and its client panels (packing table, reconciliation), so the figure in the sticky
 * summary and the figure under the packing table are one calculation, not two.
 *
 * The arithmetic itself is src/lib/trade/packing.ts, in exact decimals and with weights per
 * row (count x per-package weight), as a schema 4 packing list prints them. This module only
 * turns the results into plain numbers for display.
 */

type PackageFigures = {
  package_count: number;
  net_weight_kg: number | null;
  gross_weight_kg: number | null;
  volume_m3: number | null;
  contents: { item_id: string; quantity: number }[];
};

type LineFigures = { id: string; quantity: number };

export function packingTotals(packages: readonly PackageFigures[]) {
  const totals = exactPackingTotals(packages);
  return {
    count: totals.packages,
    gross: totals.gross_weight_kg?.toNumber() ?? 0,
    net: totals.net_weight_kg?.toNumber() ?? 0,
    volume: totals.volume_m3.toNumber(),
  };
}

/** Lines whose packed quantity differs from the invoiced quantity, with what is packed. */
export function unreconciledLines<T extends LineFigures>(
  items: readonly T[],
  packages: readonly PackageFigures[],
): { item: T; packed: number }[] {
  return exactUnreconciledLines(
    items,
    packages.flatMap((row) => row.contents),
  ).map(({ item, packed }) => ({ item, packed: packed.toNumber() }));
}
