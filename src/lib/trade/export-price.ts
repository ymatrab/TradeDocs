import Decimal from 'decimal.js';

/**
 * An export price ladder: what the seller's price comes to under each group of Incoterms®
 * 2020 rules, built up from the ex-works cost and the costs the visitor enters.
 *
 * Exact decimals, as in the landed cost calculator: each entered amount is rounded once to
 * the currency's minor units and every rung is a sum of rounded figures, so the ladder shown
 * adds up. Nothing here knows a freight rate, an insurance premium, a duty or a tax rate.
 * Every cost is an input, because those are quotes and regulated facts that change by
 * shipment, carrier, product and destination ('icc-incoterms-2020' and
 * 'wto-customs-valuation' in lib/trade/sources).
 *
 * The rungs follow which costs each rule puts on the seller (lib/trade/incoterms):
 * - EXW: the goods made available at the seller's premises.
 * - FCA / FOB: plus pre-carriage to the carrier or port, export clearance and the origin
 *   loading or terminal charges, so the goods are delivered to the main carrier.
 * - CFR / CPT: plus the main freight to the named destination.
 * - CIF / CIP: plus the cargo insurance.
 * - DDP (an estimate): plus the destination charges, the import duty and the import taxes.
 */

/** What the import duty rate is applied to in the DDP estimate. */
export type ExportDutyBasis = 'fob' | 'cif';

/** What the import tax rate is applied to in the DDP estimate. */
export type ExportTaxBasis = 'value_plus_duty' | 'value';

export const EXPORT_DUTY_BASES: Record<ExportDutyBasis, string> = {
  cif: 'CIF / CIP value (goods + freight + insurance)',
  fob: 'FCA / FOB value (goods delivered for export)',
};

export const EXPORT_TAX_BASES: Record<ExportTaxBasis, string> = {
  value_plus_duty: 'Customs value + duty',
  value: 'Customs value only',
};

export type ExportPriceInput = {
  /** The goods at the seller's premises: cost plus whatever margin the seller adds. */
  exwValue: Decimal.Value;
  /** Pre-carriage from the premises to the carrier, terminal or port of loading. */
  inlandTransport: Decimal.Value;
  exportClearance: Decimal.Value;
  /** Origin terminal handling and loading on board or onto the main carrier. */
  loading: Decimal.Value;
  mainFreight: Decimal.Value;
  insurance: Decimal.Value;
  /** Unloading, destination terminal charges and delivery to the buyer, for the DDP estimate. */
  destinationCharges: Decimal.Value;
  dutyRatePercent: Decimal.Value;
  taxRatePercent: Decimal.Value;
  dutyBasis: ExportDutyBasis;
  taxBasis: ExportTaxBasis;
  /** Units in the consignment, for a price per unit. Null or zero gives no per-unit figure. */
  units?: Decimal.Value | null;
  /** Minor units of the currency; amounts are rounded to this once each. */
  places?: number;
  /** Decimal places of the per-unit figures, which are often below a cent. */
  unitPlaces?: number;
};

/** The rungs of the ladder, in the order a seller's responsibility grows. */
export const EXPORT_PRICE_TERMS = ['exw', 'fob', 'cfr', 'cif', 'ddp'] as const;
export type ExportPriceTerm = (typeof EXPORT_PRICE_TERMS)[number];

/** The Incoterms® 2020 rules each rung prices. */
export const EXPORT_PRICE_RULES: Record<ExportPriceTerm, string> = {
  exw: 'EXW',
  fob: 'FCA / FOB',
  cfr: 'CFR / CPT',
  cif: 'CIF / CIP',
  ddp: 'DDP',
};

export type ExportPriceResult = {
  /** The entered amounts, each rounded to the currency. */
  exwValue: Decimal;
  inlandTransport: Decimal;
  exportClearance: Decimal;
  loading: Decimal;
  mainFreight: Decimal;
  insurance: Decimal;
  destinationCharges: Decimal;
  /** The value the duty rate was applied to. */
  customsValue: Decimal;
  duty: Decimal;
  taxBase: Decimal;
  tax: Decimal;
  /** The price under each group of rules. */
  prices: Record<ExportPriceTerm, Decimal>;
  /** Each price divided by the units, or null when no units were given. */
  perUnit: Record<ExportPriceTerm, Decimal> | null;
};

function round(value: Decimal, places: number): Decimal {
  return value.toDecimalPlaces(places, Decimal.ROUND_HALF_UP);
}

/**
 * The ladder. Duty and tax are rounded once each, and each rung is the one below plus the
 * rounded costs the next rule adds, so every figure shown is the sum of figures shown.
 */
export function exportPrice(input: ExportPriceInput): ExportPriceResult {
  const places = input.places ?? 2;
  const unitPlaces = input.unitPlaces ?? 4;
  const amount = (value: Decimal.Value) => round(new Decimal(value), places);

  const exwValue = amount(input.exwValue);
  const inlandTransport = amount(input.inlandTransport);
  const exportClearance = amount(input.exportClearance);
  const loading = amount(input.loading);
  const mainFreight = amount(input.mainFreight);
  const insurance = amount(input.insurance);
  const destinationCharges = amount(input.destinationCharges);

  const exw = exwValue;
  const fob = exw.plus(inlandTransport).plus(exportClearance).plus(loading);
  const cfr = fob.plus(mainFreight);
  const cif = cfr.plus(insurance);

  const customsValue = input.dutyBasis === 'cif' ? cif : fob;
  const duty = round(customsValue.times(input.dutyRatePercent).dividedBy(100), places);
  const taxBase = input.taxBasis === 'value_plus_duty' ? customsValue.plus(duty) : customsValue;
  const tax = round(taxBase.times(input.taxRatePercent).dividedBy(100), places);
  const ddp = cif.plus(destinationCharges).plus(duty).plus(tax);

  const prices: Record<ExportPriceTerm, Decimal> = { exw, fob, cfr, cif, ddp };
  const units = input.units == null ? null : new Decimal(input.units);
  const perUnit =
    units !== null && units.greaterThan(0)
      ? {
          exw: round(exw.dividedBy(units), unitPlaces),
          fob: round(fob.dividedBy(units), unitPlaces),
          cfr: round(cfr.dividedBy(units), unitPlaces),
          cif: round(cif.dividedBy(units), unitPlaces),
          ddp: round(ddp.dividedBy(units), unitPlaces),
        }
      : null;

  return {
    exwValue,
    inlandTransport,
    exportClearance,
    loading,
    mainFreight,
    insurance,
    destinationCharges,
    customsValue,
    duty,
    taxBase,
    tax,
    prices,
    perUnit,
  };
}
