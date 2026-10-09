import { createHash } from 'node:crypto';
import { z } from 'zod';
import { documentKindLabels, type DocumentKind } from '@/lib/labels';
import { API_MAX_LINES, API_PAGE_SIZE } from '@/lib/limits';
import {
  calendarDateField,
  countryField,
  currencyField,
  decimalField,
  grossBelowNet,
  hsCodeField,
  INCOTERMS,
} from '@/lib/trade/inputs';

/**
 * Request shapes of the public REST API, v1. Field rules come from src/lib/trade/inputs.ts,
 * the same rules the workspace forms use, so a shipment typed in the app and one created
 * through the API are held to the same limits. Unknown fields are refused rather than
 * ignored, so a misspelt field is reported instead of silently dropped.
 */

/**
 * Every document kind the product knows, in label order. Read from the labels, so a kind
 * added there is accepted here without a change; whether it can be generated right now is
 * the database's and the regulated-document flag's decision.
 */
export const API_DOCUMENT_KINDS = Object.keys(documentKindLabels) as [
  DocumentKind,
  ...DocumentKind[],
];

/** Optional text: absent, null or blank all mean "not stated". */
const optionalText = (max: number) =>
  z
    .union([z.string(), z.null()])
    .optional()
    .transform((value) => (typeof value === 'string' ? value.trim() : ''))
    .pipe(z.string().max(max, `Use ${max} characters or fewer.`))
    .transform((value) => value || null);

/** A string field from inputs.ts that also accepts absence or null as "". */
const optionalString = <T extends z.ZodType<unknown, string>>(field: T) =>
  z
    .union([z.string(), z.null()])
    .optional()
    .transform((value) => value ?? '')
    .pipe(field);

/** A decimal sent as a JSON string ("12.50", preferred) or number (12.5). */
const decimal = (options: Parameters<typeof decimalField>[0]) =>
  z
    .union([z.string(), z.number(), z.null()])
    .optional()
    .transform((value) => (value === null || value === undefined ? '' : String(value)))
    .pipe(decimalField(options));

const partyId = z
  .union([z.uuid('Use the id of a company in your directory.'), z.null()])
  .optional();

export const apiItemSchema = z
  .strictObject({
    description: z
      .string('Describe the goods.')
      .trim()
      .min(1, 'Describe the goods.')
      .max(500, 'Use 500 characters or fewer.'),
    hs_code: optionalString(hsCodeField),
    country_of_origin: optionalString(countryField),
    quantity: decimal({ label: 'quantity', places: 3, required: true, positive: true }),
    unit: z
      .string()
      .trim()
      .min(1, 'Enter a unit.')
      .max(12, 'Use 12 characters or fewer.')
      .optional()
      .transform((value) => value ?? 'pcs'),
    unit_price: decimal({ label: 'unit price', places: 4 }),
    net_weight_kg: decimal({ label: 'net weight', places: 3 }),
    gross_weight_kg: decimal({ label: 'gross weight', places: 3 }),
    package_count: z
      .union([z.number().int().min(0).max(999_999), z.null()])
      .optional()
      .transform((value) => value ?? null),
  })
  .superRefine((item, context) => {
    if (grossBelowNet(item.net_weight_kg, item.gross_weight_kg)) {
      context.addIssue({
        code: 'custom',
        path: ['gross_weight_kg'],
        message: 'Gross weight cannot be less than net weight.',
      });
    }
  });

export const createShipmentSchema = z
  .strictObject({
    reference: z
      .string('Enter a shipment reference.')
      .trim()
      .min(1, 'Enter a shipment reference.')
      .max(60, 'Use 60 characters or fewer.'),
    currency: z
      .union([currencyField, z.null()])
      .optional()
      .transform((value) => value ?? null),
    incoterm: z
      .union([z.string(), z.null()])
      .optional()
      .transform((value) => value?.trim().toUpperCase() || null)
      .pipe(z.union([z.enum(INCOTERMS), z.null()])),
    incoterm_place: optionalText(160),
    port_of_loading: optionalText(160),
    port_of_discharge: optionalText(160),
    country_of_origin: optionalString(countryField),
    country_of_destination: optionalString(countryField),
    shipped_on: optionalString(calendarDateField),
    buyer_reference: optionalText(60),
    proforma_valid_until: optionalString(calendarDateField),
    marks_and_numbers: optionalText(2000),
    exporter_id: partyId.transform((value) => value ?? null),
    consignee_id: partyId.transform((value) => value ?? null),
    notify_id: partyId.transform((value) => value ?? null),
    items: z
      .array(apiItemSchema)
      .max(API_MAX_LINES, `Send at most ${API_MAX_LINES} lines; add more in the app.`)
      .optional()
      .transform((value) => value ?? []),
  })
  .superRefine((value, context) => {
    // An Incoterms rule without its named place does not say where risk passes.
    if (value.incoterm && !value.incoterm_place) {
      context.addIssue({
        code: 'custom',
        path: ['incoterm_place'],
        message: `Name the place that goes with ${value.incoterm}, such as a port or town.`,
      });
    }
  });

export type CreateShipmentInput = z.output<typeof createShipmentSchema>;

export const generateDocumentSchema = z.strictObject({
  kind: z.enum(API_DOCUMENT_KINDS, {
    error: `Use one of: ${API_DOCUMENT_KINDS.join(', ')}.`,
  }),
});

export const idSchema = z.uuid();

/** Idempotency-Key: letters, digits and . _ : - only, up to 255 characters. */
export const idempotencyKeySchema = z.string().regex(/^[A-Za-z0-9._:-]{1,255}$/);

// --- Pagination ---------------------------------------------------------------------------

export type Cursor = { created_at: string; id: string };

const cursorSchema = z.tuple([z.iso.datetime({ offset: true }), z.uuid()]);

/** An opaque cursor: the last row's (created_at, id), as base64url JSON. */
export function encodeCursor(cursor: Cursor): string {
  return Buffer.from(JSON.stringify([cursor.created_at, cursor.id]), 'utf8').toString('base64url');
}

export function decodeCursor(value: string): Cursor | null {
  if (!/^[A-Za-z0-9_-]{1,200}$/.test(value)) return null;
  try {
    const parsed = cursorSchema.safeParse(
      JSON.parse(Buffer.from(value, 'base64url').toString('utf8')),
    );
    return parsed.success ? { created_at: parsed.data[0], id: parsed.data[1] } : null;
  } catch {
    return null;
  }
}

export type PageQuery = { limit: number; cursor: Cursor | null };

/** `?limit=1..100&cursor=…`; null when either is malformed. */
export function readPageQuery(params: URLSearchParams): PageQuery | null {
  const rawLimit = params.get('limit');
  let limit: number = API_PAGE_SIZE.default;
  if (rawLimit !== null) {
    if (!/^\d{1,3}$/.test(rawLimit)) return null;
    limit = Number(rawLimit);
    if (limit < 1 || limit > API_PAGE_SIZE.max) return null;
  }
  const rawCursor = params.get('cursor');
  if (rawCursor === null || rawCursor === '') return { limit, cursor: null };
  const cursor = decodeCursor(rawCursor);
  return cursor ? { limit, cursor } : null;
}

/**
 * One page from the up-to-limit+1 rows the database returned: the extra row only says
 * whether there is a next page.
 */
export function pageOf<T extends { created_at: string; id: string }>(
  rows: T[],
  limit: number,
): { data: T[]; next_cursor: string | null } {
  const data = rows.slice(0, limit);
  const last = data.at(-1);
  return {
    data,
    next_cursor: rows.length > limit && last ? encodeCursor(last) : null,
  };
}

// --- Validation errors --------------------------------------------------------------------

export type FieldIssue = { field: string; message: string };

/** Zod issues as { field: "items.0.quantity", message } for the error response. */
export function issuesOf(error: z.ZodError): FieldIssue[] {
  return error.issues.slice(0, 50).map((issue) => ({
    field: issue.path.map(String).join('.') || '(body)',
    message: issue.message,
  }));
}

/** What an Idempotency-Key is bound to: the route and the validated request. */
export function requestFingerprint(route: string, body: unknown): string {
  return createHash('sha256')
    .update(`${route}\u0000${JSON.stringify(body)}`)
    .digest('hex');
}
