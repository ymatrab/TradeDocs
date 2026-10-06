import Decimal from 'decimal.js';

/**
 * Why a generated document no longer matches its shipment.
 *
 * A revision number says that something changed; it cannot say what, and it misses changes
 * outside the shipment row (a consignee's address corrected in the address book, new bank
 * details in the organization's settings). Comparing the document's stored snapshot with
 * the snapshot the shipment would produce now answers both, section by section, so the user
 * can decide whether the change matters before re-issuing.
 *
 * Pure: both inputs are snapshots as stored (JSON), and figures are compared as exact
 * decimals so 12.5 and "12.500" are the same quantity.
 */

export const staleReasonLabels = {
  lines: 'Lines changed',
  packing: 'Packing changed',
  terms: 'Shipment terms changed',
  exporter: 'Exporter details changed',
  consignee: 'Consignee details changed',
  notify: 'Notify party changed',
  issuer: 'Payment terms, bank details or signatory changed',
} as const;

export type StaleReason = keyof typeof staleReasonLabels;

type Json = Record<string, unknown>;

function record(value: unknown): Json | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Json)
    : null;
}

function list(value: unknown): unknown[] | null {
  return Array.isArray(value) ? value : null;
}

/** One comparable form per value: decimals normalized, blanks and absence both null. */
function canonical(value: unknown): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'number') return new Decimal(value).toString();
  if (typeof value === 'string') {
    if (/^-?\d+(\.\d+)?$/.test(value)) return new Decimal(value).toString();
    return value;
  }
  if (typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

function sameFields(left: unknown, right: unknown, fields: readonly string[]): boolean {
  const a = record(left);
  const b = record(right);
  if (!a || !b) return !a && !b;
  return fields.every((field) => canonical(a[field]) === canonical(b[field]));
}

function sameList(
  left: unknown,
  right: unknown,
  same: (a: unknown, b: unknown) => boolean,
): boolean {
  const a = list(left) ?? [];
  const b = list(right) ?? [];
  return a.length === b.length && a.every((entry, index) => same(entry, b[index]));
}

const PARTY_FIELDS = [
  'id',
  'name',
  'legal_name',
  'address_line1',
  'address_line2',
  'city',
  'region',
  'postal_code',
  'country_code',
  'tax_number',
] as const;

const TERM_FIELDS = [
  'reference',
  'incoterm',
  'incoterm_place',
  'port_of_loading',
  'port_of_discharge',
  'country_of_origin',
  'country_of_destination',
  'currency',
  'shipped_on',
  'marks_and_numbers',
] as const;

const LINE_FIELDS = [
  'position',
  'description',
  'hs_code',
  'country_of_origin',
  'quantity',
  'unit',
  'unit_price',
  'net_weight_kg',
  'gross_weight_kg',
  'package_count',
  'package_kind',
] as const;

const PACKAGE_FIELDS = [
  'position',
  'kind',
  'package_count',
  'length_cm',
  'width_cm',
  'height_cm',
  'net_weight_kg',
  'gross_weight_kg',
  'marks',
] as const;

const CONTENT_FIELDS = ['position', 'description', 'quantity', 'unit'] as const;

const ISSUER_FIELDS = [
  'payment_terms',
  'bank_details',
  'signatory_name',
  'signatory_title',
  'document_notes',
] as const;

function schemaVersion(snapshot: Json): number {
  const version = snapshot.schema_version;
  return typeof version === 'number' && Number.isInteger(version) ? version : 1;
}

/**
 * The sections in which `issued` differs from `current`, in a stable order. Sections an
 * older snapshot never recorded (packing before it was modelled, issuer settings before
 * schema 4) are not compared: absence there is not a change.
 */
export function staleReasons(issued: unknown, current: unknown): StaleReason[] {
  const before = record(issued);
  const now = record(current);
  if (!before || !now) return [];
  const reasons: StaleReason[] = [];

  if (!sameList(before.items, now.items, (a, b) => sameFields(a, b, LINE_FIELDS))) {
    reasons.push('lines');
  }
  if (
    list(before.packages) &&
    !sameList(
      before.packages,
      now.packages,
      (a, b) =>
        sameFields(a, b, PACKAGE_FIELDS) &&
        sameList(record(a)?.contents, record(b)?.contents, (x, y) =>
          sameFields(x, y, CONTENT_FIELDS),
        ),
    )
  ) {
    reasons.push('packing');
  }
  if (!sameFields(before.shipment, now.shipment, TERM_FIELDS)) reasons.push('terms');
  for (const role of ['exporter', 'consignee', 'notify'] as const) {
    if (!sameFields(before[role], now[role], PARTY_FIELDS)) reasons.push(role);
  }
  if (schemaVersion(before) >= 4 && !sameFields(before.issuer, now.issuer, ISSUER_FIELDS)) {
    reasons.push('issuer');
  }
  return reasons;
}

/** One sentence a person can act on, or null when nothing differs. */
export function describeStaleness(reasons: readonly StaleReason[]): string | null {
  if (reasons.length === 0) return null;
  return `${reasons.map((reason) => staleReasonLabels[reason]).join('; ')} since this was generated.`;
}

export type DocumentFreshness = {
  stale: boolean;
  /** A human sentence saying why, when the document is stale. */
  reason: string | null;
};

/**
 * Whether a final document is current. A document whose shipment revision has moved on is
 * stale even when its content happens to match (the edit was undone), because the set
 * download and the revision shown on the document both key off the revision.
 */
export function freshnessOf(
  document: { status: string; shipment_revision: number; snapshot?: unknown },
  shipmentRevision: number,
  current: unknown,
): DocumentFreshness {
  if (document.status !== 'final') return { stale: false, reason: null };
  const reasons = current === undefined ? [] : staleReasons(document.snapshot, current);
  const described = describeStaleness(reasons);
  if (described) return { stale: true, reason: described };
  if (document.shipment_revision < shipmentRevision) {
    return { stale: true, reason: 'The shipment was edited after this was generated.' };
  }
  return { stale: false, reason: null };
}
