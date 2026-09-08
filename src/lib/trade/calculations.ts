/**
 * The arithmetic behind the public calculators.
 *
 * Kept apart from the pages that show it because these figures decide what someone is
 * charged for freight. They are unit-tested against the conventions carriers actually
 * bill on, and a number that is wrong here is wrong in a quotation.
 */

export const LENGTH_UNITS = {
  cm: { label: 'centimetres', toMetres: 0.01 },
  mm: { label: 'millimetres', toMetres: 0.001 },
  m: { label: 'metres', toMetres: 1 },
  in: { label: 'inches', toMetres: 0.0254 },
  ft: { label: 'feet', toMetres: 0.3048 },
} as const;

export type LengthUnit = keyof typeof LENGTH_UNITS;

export const WEIGHT_UNITS = {
  kg: { label: 'kilograms', toKilograms: 1 },
  g: { label: 'grams', toKilograms: 0.001 },
  lb: { label: 'pounds', toKilograms: 0.45359237 },
} as const;

export type WeightUnit = keyof typeof WEIGHT_UNITS;

export type Carton = {
  length: number;
  width: number;
  height: number;
  count: number;
};

export type VolumeResult = {
  /** Volume of one carton, in cubic metres. */
  unitVolumeM3: number;
  /** Volume of every carton together, in cubic metres. */
  totalVolumeM3: number;
  totalCartons: number;
};

export function toMetres(value: number, unit: LengthUnit): number {
  return value * LENGTH_UNITS[unit].toMetres;
}

export function toKilograms(value: number, unit: WeightUnit): number {
  return value * WEIGHT_UNITS[unit].toKilograms;
}

/**
 * Cubic metres for a set of cartons. "CBM" is the term a freight forwarder uses and the
 * figure an LCL quotation is built from.
 */
export function volumeOf(cartons: readonly Carton[], unit: LengthUnit): VolumeResult {
  let total = 0;
  let count = 0;
  let unitVolume = 0;

  for (const carton of cartons) {
    const each =
      toMetres(carton.length, unit) * toMetres(carton.width, unit) * toMetres(carton.height, unit);
    unitVolume = each;
    total += each * carton.count;
    count += carton.count;
  }

  return { unitVolumeM3: unitVolume, totalVolumeM3: total, totalCartons: count };
}

/**
 * Divisors carriers bill volumetric weight on. These are the published conventions, not
 * a quotation: an individual contract can and does override them, which the page says.
 *
 * Air divisors are stated per cubic metre. IATA's 6000 cm³/kg is 167 kg per m³; express
 * carriers commonly use 5000 cm³/kg, which is 200 kg per m³.
 */
export const VOLUMETRIC_RULES = {
  air_iata: {
    label: 'Air freight (IATA, 6000 cm³/kg)',
    kgPerCubicMetre: 1_000_000 / 6000,
    note: 'The general IATA convention for air cargo.',
  },
  air_express: {
    label: 'Air express / courier (5000 cm³/kg)',
    kgPerCubicMetre: 1_000_000 / 5000,
    note: 'Used by most integrators for international express.',
  },
  road_europe: {
    label: 'Road groupage, Europe (333 kg/m³)',
    kgPerCubicMetre: 333,
    note: 'A common European road convention; contracts vary widely.',
  },
  sea_lcl: {
    label: 'Sea LCL (1000 kg/m³)',
    kgPerCubicMetre: 1000,
    note: 'One tonne per cubic metre — LCL bills on whichever is greater, W/M.',
  },
} as const;

export type VolumetricRule = keyof typeof VOLUMETRIC_RULES;

export type ChargeableResult = {
  volumeM3: number;
  actualWeightKg: number;
  volumetricWeightKg: number;
  chargeableWeightKg: number;
  /** Which of the two figures the carrier will bill on. */
  billedOn: 'actual' | 'volumetric' | 'equal';
};

/**
 * Chargeable weight: the greater of actual and volumetric. This is the single figure that
 * surprises people on a first freight invoice, because light bulky goods are billed on
 * the space they occupy rather than what they weigh.
 */
export function chargeableWeight(
  volumeM3: number,
  actualWeightKg: number,
  rule: VolumetricRule,
): ChargeableResult {
  const volumetric = volumeM3 * VOLUMETRIC_RULES[rule].kgPerCubicMetre;
  const difference = volumetric - actualWeightKg;

  return {
    volumeM3,
    actualWeightKg,
    volumetricWeightKg: volumetric,
    chargeableWeightKg: Math.max(volumetric, actualWeightKg),
    // A tolerance rather than an equality test: these are floating-point products of
    // measurements, and reporting "equal" for a 0.4 g difference reads as a bug.
    billedOn: Math.abs(difference) < 0.001 ? 'equal' : difference > 0 ? 'volumetric' : 'actual',
  };
}

/** Interior dimensions in metres, and the usable volume a forwarder plans against. */
export const CONTAINERS = {
  '20ft': { label: "20' standard", volumeM3: 33.2, payloadKg: 28_200 },
  '40ft': { label: "40' standard", volumeM3: 67.7, payloadKg: 28_800 },
  '40hc': { label: "40' high cube", volumeM3: 76.4, payloadKg: 28_600 },
  '45hc': { label: "45' high cube", volumeM3: 86.1, payloadKg: 27_700 },
} as const;

export type ContainerKind = keyof typeof CONTAINERS;

export type ContainerFit = {
  kind: ContainerKind;
  label: string;
  /** Share of the container's volume the goods occupy, as a fraction. */
  volumeUsed: number;
  weightUsed: number;
  /** Whether volume or weight is the binding constraint. */
  limitedBy: 'volume' | 'weight';
  fits: boolean;
};

/**
 * How a consignment sits against standard containers.
 *
 * Deliberately a planning estimate, not a load plan: real stowage depends on whether
 * cartons stack, on pallet footprints and on how the boxes divide into the container's
 * floor. The page says so rather than implying a guarantee.
 */
export function containerFit(volumeM3: number, weightKg: number): ContainerFit[] {
  return (Object.keys(CONTAINERS) as ContainerKind[]).map((kind) => {
    const container = CONTAINERS[kind];
    const volumeUsed = volumeM3 / container.volumeM3;
    const weightUsed = weightKg / container.payloadKg;
    return {
      kind,
      label: container.label,
      volumeUsed,
      weightUsed,
      limitedBy: weightUsed > volumeUsed ? 'weight' : 'volume',
      fits: volumeUsed <= 1 && weightUsed <= 1,
    };
  });
}
