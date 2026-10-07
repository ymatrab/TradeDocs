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

type VolumeUnitSpec = {
  label: string;
  symbol: string;
  /** The unit's exact size in cubic metres. */
  cubicMetres: Decimal;
  /** Decimal places a result in this unit is rounded to. */
  places: number;
};

/**
 * Volume units for the CBM-to-cubic-feet converter, each as its exact size in cubic metres.
 * The inch is exactly 0.0254 m and the foot 0.3048 m, so both cubes are exact; the litre is
 * exactly 0.001 m³. NIST lists them as 1.638 706 E-05, 2.831 685 E-02 and 1.0 E-03
 * ('nist-si-volume' and 'nist-si-volume-units' in lib/trade/sources).
 */
export const VOLUME_UNITS = {
  m3: { label: 'Cubic metres (m³, CBM)', symbol: 'm³', cubicMetres: new Decimal(1), places: 6 },
  ft3: {
    label: 'Cubic feet (ft³, CFT)',
    symbol: 'ft³',
    cubicMetres: CUBIC_METRES_PER_CUBIC_FOOT,
    places: 4,
  },
  cm3: {
    label: 'Cubic centimetres (cm³)',
    symbol: 'cm³',
    cubicMetres: new Decimal('0.000001'),
    places: 2,
  },
  in3: {
    label: 'Cubic inches (in³)',
    symbol: 'in³',
    cubicMetres: new Decimal('0.0254').pow(3),
    places: 2,
  },
  l: { label: 'Litres (L)', symbol: 'L', cubicMetres: new Decimal('0.001'), places: 3 },
} as const satisfies Record<string, VolumeUnitSpec>;

export type VolumeUnit = keyof typeof VOLUME_UNITS;

export const VOLUME_UNIT_KEYS = Object.keys(VOLUME_UNITS) as VolumeUnit[];

/**
 * A typed volume in `from` expressed in `to`, rounded half-up to the target unit's places
 * with trailing zeros removed and never in exponent notation; null when the input is blank,
 * negative or not a number. One conversion through cubic metres, in exact decimal.
 */
export function convertVolume(input: string, from: VolumeUnit, to: VolumeUnit): string | null {
  const value = parseDecimal(input);
  if (!value) return null;
  return value
    .mul(VOLUME_UNITS[from].cubicMetres)
    .div(VOLUME_UNITS[to].cubicMetres)
    .toDecimalPlaces(VOLUME_UNITS[to].places, Decimal.ROUND_HALF_UP)
    .toFixed();
}

/** The same volume in every unit, for the converter's result table; null on bad input. */
export function convertVolumeToAll(
  input: string,
  from: VolumeUnit,
): { unit: VolumeUnit; value: string }[] | null {
  if (!parseDecimal(input)) return null;
  return VOLUME_UNIT_KEYS.flatMap((unit) => {
    const value = convertVolume(input, from, unit);
    return value === null ? [] : [{ unit, value }];
  });
}
