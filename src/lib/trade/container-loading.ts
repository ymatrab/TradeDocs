import Decimal from 'decimal.js';
import {
  CONTAINERS,
  LENGTH_UNITS,
  WEIGHT_UNITS,
  type ContainerKind,
  type LengthUnit,
  type WeightUnit,
} from './calculations';

/**
 * How many identical cartons or pallets a container can take, by volume and by weight.
 *
 * An upper bound, never a stow plan: it divides the container's typical internal volume
 * (the Maersk figures in CONTAINERS) by the volume of one unit, and its maximum payload by
 * the weight of one unit, and takes the smaller. It knows nothing about the container's
 * internal length, width and door height, about how the units divide into the floor, or
 * whether they stack, so the real count is lower, often by a good margin. Every surface says
 * so. Exact decimal arithmetic: a unit factor such as 0.0254 m per inch is never rounded
 * through binary floating point on its way into a count.
 */

/** The containers the loading calculator offers: the three that carry most FCL cargo. */
export const LOADING_CONTAINERS: readonly ContainerKind[] = ['20ft', '40ft', '40hc'];

export type LoadUnitInput = {
  /** Outside dimensions of one carton or pallet, in `lengthUnit`. */
  length: string;
  width: string;
  height: string;
  lengthUnit: LengthUnit;
  /** Gross weight of one unit in `weightUnit`. Blank means weight is not checked. */
  weight: string;
  weightUnit: WeightUnit;
  /** How many units the shipment has. Blank means no container count is worked out. */
  quantity?: string;
  /**
   * The share of the internal volume treated as usable, in percent (1–100). Blank or absent
   * is 100: the pure volume bound. Lower it to allow for the gaps real loading leaves.
   */
  usablePercent?: string;
};

export type ContainerLoad = {
  kind: ContainerKind;
  label: string;
  /** Units that fit by volume alone (floor). */
  byVolume: number;
  /** Units that fit by payload alone (floor); null when no weight was given. */
  byWeight: number | null;
  /** The smaller of the two: the estimate. */
  units: number;
  limitedBy: 'volume' | 'weight';
  /** Containers needed for the stated quantity; null without a quantity or if none fit. */
  containersNeeded: number | null;
  /** Share of the container's volume and payload one full load uses, as fractions. */
  volumeUsed: number;
  weightUsed: number | null;
};

export type LoadingResult = {
  /** Volume of one unit in cubic metres, to six places. */
  unitVolumeM3: string;
  /** Weight of one unit in kilograms, to three places; null when not given. */
  unitWeightKg: string | null;
  usablePercent: number;
  containers: ContainerLoad[];
};

/** A typed number, with a decimal comma accepted; null when blank or not a number. */
export function parseDecimal(value: string | undefined): Decimal | null {
  const cleaned = (value ?? '').trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d+)?$|^\.\d+$/.test(cleaned)) return null;
  return new Decimal(cleaned);
}

/** Exact factors, from their decimal spelling rather than a float. */
const metresPer = (unit: LengthUnit) => new Decimal(String(LENGTH_UNITS[unit].toMetres));
const kilogramsPer = (unit: WeightUnit) => new Decimal(String(WEIGHT_UNITS[unit].toKilograms));

/**
 * The estimate per container, or null when the dimensions are missing or not positive, the
 * weight or quantity is not a positive number, or the usable share is outside 1–100.
 */
export function containerLoading(input: LoadUnitInput): LoadingResult | null {
  const length = parseDecimal(input.length);
  const width = parseDecimal(input.width);
  const height = parseDecimal(input.height);
  if (!length || !width || !height || length.lte(0) || width.lte(0) || height.lte(0)) {
    return null;
  }

  const weightText = input.weight.trim();
  const weight = weightText ? parseDecimal(weightText) : null;
  if (weightText && (!weight || weight.lte(0))) return null;

  const quantityText = (input.quantity ?? '').trim();
  const quantity = quantityText ? parseDecimal(quantityText) : null;
  if (quantityText && (!quantity || quantity.lte(0) || !quantity.isInteger())) return null;

  const usableText = (input.usablePercent ?? '').trim();
  const usable = usableText ? parseDecimal(usableText) : new Decimal(100);
  if (!usable || usable.lt(1) || usable.gt(100)) return null;

  const factor = metresPer(input.lengthUnit);
  const unitVolume = length.mul(factor).mul(width.mul(factor)).mul(height.mul(factor));
  const unitWeight = weight ? weight.mul(kilogramsPer(input.weightUnit)) : null;

  const containers = LOADING_CONTAINERS.map((kind): ContainerLoad => {
    const container = CONTAINERS[kind];
    const capacity = new Decimal(container.volumeM3).mul(usable).div(100);
    const byVolume = capacity.div(unitVolume).floor().toNumber();
    const byWeight = unitWeight
      ? new Decimal(container.payloadKg).div(unitWeight).floor().toNumber()
      : null;
    const units = byWeight === null ? byVolume : Math.min(byVolume, byWeight);
    const limitedBy = byWeight !== null && byWeight < byVolume ? 'weight' : 'volume';
    const containersNeeded = quantity && units > 0 ? quantity.div(units).ceil().toNumber() : null;
    return {
      kind,
      label: container.label,
      byVolume,
      byWeight,
      units,
      limitedBy,
      containersNeeded,
      volumeUsed: unitVolume.mul(units).div(container.volumeM3).toNumber(),
      weightUsed: unitWeight ? unitWeight.mul(units).div(container.payloadKg).toNumber() : null,
    };
  });

  return {
    unitVolumeM3: unitVolume.toDecimalPlaces(6).toString(),
    unitWeightKg: unitWeight ? unitWeight.toDecimalPlaces(3).toString() : null,
    usablePercent: usable.toNumber(),
    containers,
  };
}
