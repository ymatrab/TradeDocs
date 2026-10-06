import Decimal from 'decimal.js';

/**
 * Packing arithmetic, in one place and in exact decimals, so the packing panel and the
 * packing list a document prints add up the same way.
 *
 * A package row is `package_count` identical packages. Dimensions and weights are entered
 * per package; volume is stored for the whole row (generated column volume_m3). The row's
 * weight is therefore count x per-package weight, and that is what the totals add.
 */

export type PackageFigures = {
  package_count: number;
  net_weight_kg: number | string | null;
  gross_weight_kg: number | string | null;
  volume_m3: number | string | null;
};

export type PackingTotals = {
  packages: number;
  /** Null when no package states one: a total of zero would be a false figure. */
  net_weight_kg: Decimal | null;
  gross_weight_kg: Decimal | null;
  volume_m3: Decimal;
};

/** count x per-package weight, rounded to the gram as the database rounds it. */
export function rowWeight(count: number, each: number | string | null): Decimal | null {
  if (each === null || each === '') return null;
  return new Decimal(each).times(count).toDecimalPlaces(3, Decimal.ROUND_HALF_UP);
}

export function packingTotals(rows: readonly PackageFigures[]): PackingTotals {
  let net: Decimal | null = null;
  let gross: Decimal | null = null;
  let volume = new Decimal(0);
  let packages = 0;
  for (const row of rows) {
    packages += row.package_count;
    const rowNet = rowWeight(row.package_count, row.net_weight_kg);
    const rowGross = rowWeight(row.package_count, row.gross_weight_kg);
    if (rowNet) net = (net ?? new Decimal(0)).plus(rowNet);
    if (rowGross) gross = (gross ?? new Decimal(0)).plus(rowGross);
    if (row.volume_m3 !== null && row.volume_m3 !== '') volume = volume.plus(row.volume_m3);
  }
  return { packages, net_weight_kg: net, gross_weight_kg: gross, volume_m3: volume };
}

export type Reconciliation<Item> = { item: Item; packed: Decimal; over: boolean };

/**
 * Lines whose allocated quantity differs from the line quantity, exactly. An allocation is
 * the total of that line across all packages of a row, so the packing list and the invoice
 * state one quantity per line only when this list is empty.
 */
export function unreconciledLines<Item extends { id: string; quantity: number | string }>(
  items: readonly Item[],
  allocations: readonly { item_id: string; quantity: number | string }[],
): Reconciliation<Item>[] {
  const packed = new Map<string, Decimal>();
  for (const allocation of allocations) {
    packed.set(
      allocation.item_id,
      (packed.get(allocation.item_id) ?? new Decimal(0)).plus(allocation.quantity),
    );
  }
  return items.flatMap((item) => {
    const amount = packed.get(item.id) ?? new Decimal(0);
    const quantity = new Decimal(item.quantity);
    return amount.equals(quantity)
      ? []
      : [{ item, packed: amount, over: amount.greaterThan(quantity) }];
  });
}
