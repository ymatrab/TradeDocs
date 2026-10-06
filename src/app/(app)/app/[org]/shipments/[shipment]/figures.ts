/**
 * Display arithmetic shared by the shipment screen's server page (summary, step states)
 * and its client panels (packing table, reconciliation), so the figure in the sticky
 * summary and the figure under the packing table are one calculation, not two.
 *
 * Presentation only. Generated documents compute their own totals from the snapshot.
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
  return packages.reduce(
    (sum, row) => ({
      count: sum.count + row.package_count,
      gross: sum.gross + Number(row.gross_weight_kg ?? 0),
      net: sum.net + Number(row.net_weight_kg ?? 0),
      volume: sum.volume + Number(row.volume_m3 ?? 0),
    }),
    { count: 0, gross: 0, net: 0, volume: 0 },
  );
}

/** Lines whose packed quantity differs from the invoiced quantity, with what is packed. */
export function unreconciledLines<T extends LineFigures>(
  items: readonly T[],
  packages: readonly PackageFigures[],
): { item: T; packed: number }[] {
  const allocated = new Map<string, number>();
  for (const row of packages) {
    for (const content of row.contents) {
      allocated.set(content.item_id, (allocated.get(content.item_id) ?? 0) + content.quantity);
    }
  }
  return items
    .map((item) => ({ item, packed: allocated.get(item.id) ?? 0 }))
    .filter(({ item, packed }) => Math.abs(packed - item.quantity) > 0.0005);
}
