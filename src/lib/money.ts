import Decimal from 'decimal.js';

/**
 * Money arithmetic.
 *
 * Exact decimals, never binary floating point: 0.1 + 0.2 is a discrepancy on an invoice,
 * and the product exists so that two documents cannot disagree by a cent. Rounding is
 * half away from zero, which is what PostgreSQL's round(numeric) does, so a total computed
 * here matches the one generate_document stores.
 */

/**
 * Minor units of an ISO 4217 currency as Intl states them: JPY 0, EUR 2, KWD 3. An unknown
 * code falls back to two places rather than throwing, because the code is validated
 * elsewhere and a formatter must not take a page down.
 */
export function currencyMinorUnits(currency: string): number {
  try {
    const format = new Intl.NumberFormat('en', { style: 'currency', currency });
    const digits = format.resolvedOptions().maximumFractionDigits;
    return typeof digits === 'number' && digits >= 0 && digits <= 4 ? digits : 2;
  } catch {
    return 2;
  }
}

/** Quantity × unit price, rounded once to the currency's minor units. */
export function lineTotal(
  quantity: Decimal.Value,
  unitPrice: Decimal.Value,
  places: number,
): Decimal {
  return new Decimal(quantity).times(unitPrice).toDecimalPlaces(places, Decimal.ROUND_HALF_UP);
}

/**
 * The sum of rounded line totals. Rounding each line and then adding is deliberate: it is
 * the figure a reader gets by adding the printed lines, and the one the database stores.
 */
export function sumLineTotals(
  lines: readonly { quantity: Decimal.Value; unit_price: Decimal.Value }[],
  places: number,
): Decimal {
  return lines.reduce(
    (total, line) => total.plus(lineTotal(line.quantity, line.unit_price, places)),
    new Decimal(0),
  );
}

/** An exact sum of optional figures; null only when none of them is stated. */
export function sumStated(values: readonly (Decimal.Value | null | undefined)[]): Decimal | null {
  const stated = values.filter((value): value is Decimal.Value => value != null);
  if (stated.length === 0) return null;
  return stated.reduce<Decimal>((total, value) => total.plus(value), new Decimal(0));
}
