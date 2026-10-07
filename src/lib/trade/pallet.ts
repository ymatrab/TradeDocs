import Decimal from 'decimal.js';
import { LENGTH_UNITS, WEIGHT_UNITS, type LengthUnit, type WeightUnit } from './calculations';
import { parseDecimal } from './container-loading';

/**
 * How many identical cartons fit on one pallet: per layer, how many layers, and the loaded
 * height and gross weight that result.
 *
 * Deliberately simple and stated as such on the page. Every carton stands upright (its height
 * vertical) and every carton in a layer faces the same way; the calculator tries both ways
 * round on the deck and keeps the better. Mixed or pinwheel patterns, overhang, crushing
 * strength and the carrier's own limits are outside it, so a real load can differ either way.
 * Exact decimal arithmetic, so a unit factor such as 0.0254 m per inch never rounds a count.
 */

export type PalletPreset = {
  id: string;
  label: string;
  /** Deck footprint and own height, in the preset's unit. Blank where no source states it. */
  length: string;
  width: string;
  height: string;
  unit: LengthUnit;
  /** Own weight in kilograms, blank where no source states it. */
  weightKg: string;
  /** Safe working load in kilograms as the specification states it, or blank. */
  safeWorkingLoadKg: string;
  note: string;
};

/**
 * The pallets the pallet sizes guide covers, with the figures its sources publish: EPAL for
 * the EPAL 1 and EPAL 2 ('w4-epal-euro-pallet', 'w4-epal-2-pallet'), and the USDA Forest
 * Service for the 48 × 40 in footprint ('w4-usda-gma-pallet'), whose height and weight vary by
 * build and so are left for the user. ISO 6780 sets the principal dimensions ('w4-iso-6780').
 */
export const PALLET_PRESETS: readonly PalletPreset[] = [
  {
    id: 'gma',
    label: '48 × 40 in (US, GMA-style)',
    length: '48',
    width: '40',
    height: '',
    unit: 'in',
    weightKg: '',
    safeWorkingLoadKg: '',
    note: 'Height, own weight and rated load vary by build: enter your pallet’s figures.',
  },
  {
    id: 'epal1',
    label: '1,200 × 800 mm (EPAL 1 euro pallet)',
    length: '1200',
    width: '800',
    height: '144',
    unit: 'mm',
    weightKg: '25',
    safeWorkingLoadKg: '1500',
    note: 'EPAL: 144 mm high, about 25 kg, safe working load 1,500 kg.',
  },
  {
    id: 'epal2',
    label: '1,200 × 1,000 mm (EPAL 2)',
    length: '1200',
    width: '1000',
    height: '162',
    unit: 'mm',
    weightKg: '35',
    safeWorkingLoadKg: '1250',
    note: 'EPAL: 162 mm high, about 35 kg, safe working load 1,250 kg.',
  },
];

export type PalletInput = {
  cartonLength: string;
  cartonWidth: string;
  cartonHeight: string;
  cartonUnit: LengthUnit;
  /** Gross weight of one carton in `weightUnit`. Blank means weight is not worked out. */
  cartonWeight: string;
  weightUnit: WeightUnit;
  palletLength: string;
  palletWidth: string;
  /** The pallet's own height in `palletUnit`; blank counts as zero and the page says so. */
  palletHeight: string;
  palletUnit: LengthUnit;
  /** The pallet's own weight in `weightUnit`; blank counts as zero. */
  palletWeight: string;
  /** Maximum loaded height, pallet included, in `palletUnit`. */
  maxHeight: string;
  /** Maximum weight of the goods on the pallet in `weightUnit`. Blank means no weight limit. */
  maxLoad: string;
  /** Cartons in the shipment. Blank means no pallet count is worked out. */
  quantity?: string;
};

export type PalletResult = {
  /** Cartons in one layer and which way round they sit on the deck. */
  perLayer: number;
  orientation: 'lengthwise' | 'crosswise';
  /** Columns along the pallet length and rows along its width, in that orientation. */
  columns: number;
  rows: number;
  /** Layers the height limit allows. */
  layersByHeight: number;
  /** Cartons the weight limit allows; null without a limit or a carton weight. */
  cartonsByWeight: number | null;
  /** Cartons on one full pallet: the smaller of the height and weight bounds. */
  cartonsPerPallet: number;
  limitedBy: 'height' | 'weight';
  /** Layers a full pallet uses (the top one may be part-filled when weight binds). */
  layersUsed: number;
  /** Loaded height of a full pallet in millimetres, pallet included, to one place. */
  loadedHeightMm: string;
  /** Weight of the goods and the gross weight with the pallet, in kg to two places. */
  loadKg: string | null;
  grossKg: string | null;
  /** Share of the deck area the cartons cover, as a fraction. */
  deckUsed: number;
  palletsNeeded: number | null;
  /** Cartons on the last pallet when the quantity does not divide evenly. */
  lastPalletCartons: number | null;
  /** Inputs counted as zero, for the page to point out. */
  assumedZero: readonly ('palletHeight' | 'palletWeight')[];
};

export type PalletOutcome =
  | { ok: true; result: PalletResult }
  | { ok: false; reason: 'incomplete' | 'carton-too-large' | 'too-tall' | 'too-heavy' };

const MM_PER_METRE = new Decimal(1000);
const mm = (value: Decimal, unit: LengthUnit) =>
  value.mul(new Decimal(String(LENGTH_UNITS[unit].toMetres))).mul(MM_PER_METRE);
const kg = (value: Decimal, unit: WeightUnit) =>
  value.mul(new Decimal(String(WEIGHT_UNITS[unit].toKilograms)));

/** A blank optional figure is zero; a typed one must parse. Undefined means it did not. */
function optional(value: string): Decimal | undefined {
  if (value.trim() === '') return new Decimal(0);
  return parseDecimal(value) ?? undefined;
}

function fits(deck: Decimal, side: Decimal): number {
  return deck.div(side).floor().toNumber();
}

export function palletLoad(input: PalletInput): PalletOutcome {
  const cl = parseDecimal(input.cartonLength);
  const cw = parseDecimal(input.cartonWidth);
  const ch = parseDecimal(input.cartonHeight);
  const pl = parseDecimal(input.palletLength);
  const pw = parseDecimal(input.palletWidth);
  const limit = parseDecimal(input.maxHeight);
  const ph = optional(input.palletHeight);
  const pWeight = optional(input.palletWeight);
  const weightGiven = input.cartonWeight.trim() !== '';
  const limitGiven = input.maxLoad.trim() !== '';
  const quantityGiven = (input.quantity ?? '').trim() !== '';
  const cartonWeight = weightGiven ? parseDecimal(input.cartonWeight) : null;
  const maxLoad = limitGiven ? parseDecimal(input.maxLoad) : null;
  const quantity = quantityGiven ? parseDecimal(input.quantity) : null;

  if (!cl || !cw || !ch || !pl || !pw || !limit || ph === undefined || pWeight === undefined) {
    return { ok: false, reason: 'incomplete' };
  }
  if (cl.isZero() || cw.isZero() || ch.isZero() || pl.isZero() || pw.isZero()) {
    return { ok: false, reason: 'incomplete' };
  }
  // A typed but unreadable weight, limit or count is an input error, not "not given".
  if ((weightGiven && !cartonWeight) || (limitGiven && !maxLoad)) {
    return { ok: false, reason: 'incomplete' };
  }
  if (quantityGiven && (!quantity || !quantity.isInteger() || quantity.isZero())) {
    return { ok: false, reason: 'incomplete' };
  }

  const cartonL = mm(cl, input.cartonUnit);
  const cartonW = mm(cw, input.cartonUnit);
  const cartonH = mm(ch, input.cartonUnit);
  const deckL = mm(pl, input.palletUnit);
  const deckW = mm(pw, input.palletUnit);
  const palletH = mm(ph, input.palletUnit);
  const maxH = mm(limit, input.palletUnit);

  const lengthwise = { columns: fits(deckL, cartonL), rows: fits(deckW, cartonW) };
  const crosswise = { columns: fits(deckL, cartonW), rows: fits(deckW, cartonL) };
  const layerOf = (pattern: { columns: number; rows: number }) => pattern.columns * pattern.rows;
  const orientation = layerOf(crosswise) > layerOf(lengthwise) ? 'crosswise' : 'lengthwise';
  const pattern = orientation === 'crosswise' ? crosswise : lengthwise;
  const perLayer = layerOf(pattern);
  if (perLayer === 0) return { ok: false, reason: 'carton-too-large' };

  const layersByHeight = maxH.minus(palletH).div(cartonH).floor().toNumber();
  if (layersByHeight <= 0) return { ok: false, reason: 'too-tall' };
  const byHeight = perLayer * layersByHeight;

  const cartonKg = cartonWeight ? kg(cartonWeight, input.weightUnit) : null;
  const loadLimitKg = maxLoad ? kg(maxLoad, input.weightUnit) : null;
  let cartonsByWeight: number | null = null;
  if (cartonKg && loadLimitKg && !cartonKg.isZero()) {
    cartonsByWeight = loadLimitKg.div(cartonKg).floor().toNumber();
    if (cartonsByWeight === 0) return { ok: false, reason: 'too-heavy' };
  }

  const cartonsPerPallet =
    cartonsByWeight !== null && cartonsByWeight < byHeight ? cartonsByWeight : byHeight;
  const limitedBy = cartonsPerPallet < byHeight ? 'weight' : 'height';
  const layersUsed = Math.ceil(cartonsPerPallet / perLayer);
  const loadedHeight = palletH.plus(cartonH.mul(layersUsed));
  const palletKg = kg(pWeight, input.weightUnit);
  const loadKg = cartonKg ? cartonKg.mul(cartonsPerPallet) : null;

  let palletsNeeded: number | null = null;
  let lastPalletCartons: number | null = null;
  if (quantity) {
    const count = quantity.toNumber();
    palletsNeeded = Math.ceil(count / cartonsPerPallet);
    const remainder = count % cartonsPerPallet;
    lastPalletCartons = remainder === 0 ? cartonsPerPallet : remainder;
  }

  const assumedZero: ('palletHeight' | 'palletWeight')[] = [];
  if (input.palletHeight.trim() === '') assumedZero.push('palletHeight');
  if (input.palletWeight.trim() === '') assumedZero.push('palletWeight');

  return {
    ok: true,
    result: {
      perLayer,
      orientation,
      columns: pattern.columns,
      rows: pattern.rows,
      layersByHeight,
      cartonsByWeight,
      cartonsPerPallet,
      limitedBy,
      layersUsed,
      loadedHeightMm: loadedHeight.toDecimalPlaces(1, Decimal.ROUND_HALF_UP).toFixed(),
      loadKg: loadKg ? loadKg.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed() : null,
      grossKg: loadKg
        ? loadKg.plus(palletKg).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed()
        : null,
      deckUsed: cartonL
        .mul(cartonW)
        .mul(perLayer)
        .div(deckL.mul(deckW))
        .toDecimalPlaces(4, Decimal.ROUND_HALF_UP)
        .toNumber(),
      palletsNeeded,
      lastPalletCartons,
      assumedZero,
    },
  };
}
