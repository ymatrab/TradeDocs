import Decimal from 'decimal.js';

/**
 * A landed cost estimate, from figures the visitor supplies.
 *
 * Exact decimals, as everywhere money is handled: a duty line that is off by a cent
 * because of binary floating point is a wrong number on a quotation. Nothing here knows a
 * tariff, a tax rate or a country's valuation rule. The duty rate, the tax rate and the
 * basis each is charged on are inputs, because those are regulated facts that change by
 * product and destination and must come from the visitor's broker or customs authority.
 *
 * The two bases are the ones the WTO Customs Valuation Agreement describes: customs value
 * starts from the price of the goods, and a member that values on a CIF basis adds the
 * freight and insurance to the place of importation ('wto-customs-valuation' in
 * lib/trade/sources). Which one applies is the visitor's choice, never our default claim.
 */

/** What the duty rate is applied to. */
export type DutyBasis = 'goods' | 'cif';

/** What the tax rate (import VAT, GST or a similar charge) is applied to. */
export type TaxBasis = 'value_plus_duty' | 'value';

export const DUTY_BASES: Record<DutyBasis, string> = {
  goods: 'Goods value only',
  cif: 'Goods + freight + insurance (CIF value)',
};

export const TAX_BASES: Record<TaxBasis, string> = {
  value_plus_duty: 'Customs value + duty',
  value: 'Customs value only',
};

/** Rates above this are almost certainly a typing error; they are refused, not capped. */
export const MAX_RATE_PERCENT = 1000;

export type LandedCostInput = {
  goodsValue: Decimal.Value;
  freight: Decimal.Value;
  insurance: Decimal.Value;
  /** Broker fees, port charges, inland delivery: anything else the importer pays. */
  otherCosts: Decimal.Value;
  dutyRatePercent: Decimal.Value;
  taxRatePercent: Decimal.Value;
  dutyBasis: DutyBasis;
  taxBasis: TaxBasis;
  /** Units in the consignment, for a cost per unit. Null or zero gives no per-unit figure. */
  units?: Decimal.Value | null;
  /** Minor units of the currency; amounts are rounded to this once, per line. */
  places?: number;
  /** Decimal places of the per-unit figure, which is often below a cent. */
  unitPlaces?: number;
};

export type LandedCostResult = {
  /** The four entered amounts, rounded to the currency as they are added. */
  goodsValue: Decimal;
  freight: Decimal;
  insurance: Decimal;
  otherCosts: Decimal;
  /** The value the duty rate was applied to. */
  customsValue: Decimal;
  duty: Decimal;
  taxBase: Decimal;
  tax: Decimal;
  /** Goods + freight + insurance + duty + tax + other costs. */
  total: Decimal;
  /** Everything except the goods themselves: what landing them costs. */
  addedCost: Decimal;
  perUnit: Decimal | null;
};

function round(value: Decimal, places: number): Decimal {
  return value.toDecimalPlaces(places, Decimal.ROUND_HALF_UP);
}

/**
 * The estimate. Duty and tax are rounded once each to the currency's minor units, and the
 * total is the sum of the rounded lines, so the figures shown add up to the total shown.
 */
export function landedCost(input: LandedCostInput): LandedCostResult {
  const places = input.places ?? 2;
  const unitPlaces = input.unitPlaces ?? 4;
  const goods = round(new Decimal(input.goodsValue), places);
  const freight = round(new Decimal(input.freight), places);
  const insurance = round(new Decimal(input.insurance), places);
  const other = round(new Decimal(input.otherCosts), places);

  const customsValue = input.dutyBasis === 'cif' ? goods.plus(freight).plus(insurance) : goods;
  const duty = round(customsValue.times(input.dutyRatePercent).dividedBy(100), places);
  const taxBase = input.taxBasis === 'value_plus_duty' ? customsValue.plus(duty) : customsValue;
  const tax = round(taxBase.times(input.taxRatePercent).dividedBy(100), places);

  const total = goods.plus(freight).plus(insurance).plus(duty).plus(tax).plus(other);
  const units = input.units == null ? null : new Decimal(input.units);
  const perUnit =
    units !== null && units.greaterThan(0) ? round(total.dividedBy(units), unitPlaces) : null;

  return {
    goodsValue: goods,
    freight,
    insurance,
    otherCosts: other,
    customsValue,
    duty,
    taxBase,
    tax,
    total,
    addedCost: total.minus(goods),
    perUnit,
  };
}

/**
 * A non-negative amount typed into a form, or null for blank or invalid input. A comma is
 * accepted as the decimal separator; thousands separators are not, because "1,250" is
 * ambiguous and guessing would be worse than asking.
 */
export function parseAmount(raw: string): Decimal | null {
  const text = raw.trim().replace(/\s/g, '');
  if (text === '') return null;
  if (!/^\d+([.,]\d+)?$/.test(text)) return null;
  return new Decimal(text.replace(',', '.'));
}

/** A rate in percent, between 0 and MAX_RATE_PERCENT, or null. */
export function parseRate(raw: string): Decimal | null {
  const value = parseAmount(raw);
  if (value === null || value.greaterThan(MAX_RATE_PERCENT)) return null;
  return value;
}
