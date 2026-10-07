import Decimal from 'decimal.js';
import { parseDecimal } from './container-loading';

/**
 * Volume and weight conversions for the unit converter, in exact decimal arithmetic.
 *
 * Both factors are exact by definition, so the only rounding is the one applied to the
 * printed result. One foot is 0.3048 m, so one cubic foot is 0.028 316 846 592 m³; one
 * pound (avoirdupois) is 0.453 592 37 kg. NIST lists them as 2.831 685 E-02 and
 * 4.535 924 E-01 ('nist-si-volume' and 'nist-si-mass' in lib/trade/sources).
 */

export const CUBIC_METRES_PER_CUBIC_FOOT = new Decimal('0.3048').pow(3);
export const KILOGRAMS_PER_POUND = new Decimal('0.45359237');

export const CONVERSIONS = {
  m3_to_ft3: { from: 'm³', to: 'ft³', places: 4 },
  ft3_to_m3: { from: 'ft³', to: 'm³', places: 6 },
  kg_to_lb: { from: 'kg', to: 'lb', places: 4 },
  lb_to_kg: { from: 'lb', to: 'kg', places: 4 },
} as const;

export type Conversion = keyof typeof CONVERSIONS;

function apply(value: Decimal, conversion: Conversion): Decimal {
  switch (conversion) {
    case 'm3_to_ft3':
      return value.div(CUBIC_METRES_PER_CUBIC_FOOT);
    case 'ft3_to_m3':
      return value.mul(CUBIC_METRES_PER_CUBIC_FOOT);
    case 'kg_to_lb':
      return value.div(KILOGRAMS_PER_POUND);
    case 'lb_to_kg':
      return value.mul(KILOGRAMS_PER_POUND);
  }
}

/**
 * A typed figure converted and rounded half-up to the conversion's places, with trailing
 * zeros removed and never in exponent notation; null when the input is blank, negative or
 * not a number.
 */
export function convert(input: string, conversion: Conversion): string | null {
  const value = parseDecimal(input);
  if (!value) return null;
  return apply(value, conversion)
    .toDecimalPlaces(CONVERSIONS[conversion].places, Decimal.ROUND_HALF_UP)
    .toFixed();
}
