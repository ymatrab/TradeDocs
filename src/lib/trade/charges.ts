/**
 * The charges and discounts an invoice itemizes (D-029, 19 CFR 141.86(a)(8) and (g)), as
 * public.shipment_charges stores them. Client-safe: the shipment screen, the server actions
 * and the PDF renderer all read these names from here.
 */
export const CHARGE_KINDS = [
  'freight',
  'insurance',
  'packing',
  'commission',
  'other',
  'discount',
] as const;
export type ChargeKind = (typeof CHARGE_KINDS)[number];

export const CHARGE_LABELS: Record<ChargeKind, string> = {
  freight: 'Freight',
  insurance: 'Insurance',
  packing: 'Packing',
  commission: 'Commission',
  other: 'Other charge',
  discount: 'Discount',
};

/** public.shipment_charges.position is checked to 20. */
export const MAX_CHARGES = 20;
