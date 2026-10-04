import { z } from 'zod';
import { currencyMinorUnits, lineTotal, sumLineTotals, sumStated } from '@/lib/money';

/**
 * The free document tool's request, and the snapshot it becomes.
 *
 * Kept out of the route so the arithmetic can be tested without a request, and so the
 * snapshot the tool renders follows the same schema version as one the workspace stores.
 */

export const MAX_TOOL_LINES = 20;

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null);

/** ISO 3166-1 alpha-2, upper-cased; empty means "not stated". */
const country = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^([A-Z]{2})?$/)
  .transform((value) => value || null);

const party = z.object({
  name: text(300),
  address_line1: text(200),
  city: text(120),
  postal_code: text(40),
  country_code: text(2),
  tax_number: text(100),
});

const line = z.object({
  description: z.string().trim().min(1).max(500),
  hs_code: text(10),
  country_of_origin: country,
  quantity: z.coerce.number().positive().max(1_000_000_000),
  unit: z.string().trim().min(1).max(12).default('pcs'),
  unit_price: z.coerce.number().min(0).max(1_000_000_000),
  net_weight_kg: z.coerce.number().min(0).max(1_000_000_000).optional(),
  gross_weight_kg: z.coerce.number().min(0).max(1_000_000_000).optional(),
  package_count: z.coerce.number().int().min(0).max(1_000_000).optional(),
});

export const toolRequestSchema = z.object({
  kind: z.enum(['commercial_invoice', 'proforma_invoice', 'packing_list']),
  number: z.string().trim().min(1).max(60),
  reference: z.string().trim().max(60).default(''),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/)
    .default('EUR'),
  incoterm: text(4),
  incoterm_place: text(160),
  port_of_loading: text(160),
  port_of_discharge: text(160),
  marks_and_numbers: text(2000),
  /**
   * The shipment's country of origin, when the sender states it. Never inferred from where
   * the seller is registered: a German trader shipping goods made in Vietnam would
   * otherwise be printed as declaring German origin.
   */
  country_of_origin: country.optional(),
  seller: party,
  buyer: party,
  lines: z.array(line).min(1).max(MAX_TOOL_LINES),
});

export type ToolRequest = z.output<typeof toolRequestSchema>;
type ToolLine = ToolRequest['lines'][number];

/**
 * The shipment-level origin: what the sender stated, otherwise the one origin every line
 * shares. Lines of mixed or unstated origin leave it blank rather than pick one.
 */
export function shipmentOrigin(input: Pick<ToolRequest, 'country_of_origin' | 'lines'>) {
  if (input.country_of_origin) return input.country_of_origin;
  const origins = new Set(input.lines.map((entry) => entry.country_of_origin));
  if (origins.size !== 1) return null;
  const [only] = origins;
  return only ?? null;
}

function toItem(entry: ToolLine, index: number, places: number) {
  return {
    position: index + 1,
    description: entry.description,
    hs_code: entry.hs_code,
    country_of_origin: entry.country_of_origin,
    quantity: entry.quantity,
    unit: entry.unit,
    unit_price: entry.unit_price,
    line_total: lineTotal(entry.quantity, entry.unit_price, places).toFixed(places),
    net_weight_kg: entry.net_weight_kg ?? null,
    gross_weight_kg: entry.gross_weight_kg ?? null,
    package_count: entry.package_count ?? null,
    package_kind: null,
  };
}

export function buildToolSnapshot(input: ToolRequest, generatedAt: Date = new Date()) {
  const places = currencyMinorUnits(input.currency);
  const items = input.lines.map((entry, index) => toItem(entry, index, places));
  const gross = sumStated(input.lines.map((entry) => entry.gross_weight_kg));

  return {
    schema_version: 2,
    money_places: places,
    kind: input.kind,
    number: input.number,
    generated_at: generatedAt.toISOString(),
    shipment: {
      reference: input.reference || input.number,
      incoterm: input.incoterm,
      incoterm_place: input.incoterm_place,
      port_of_loading: input.port_of_loading,
      port_of_discharge: input.port_of_discharge,
      country_of_origin: shipmentOrigin(input),
      country_of_destination: input.buyer.country_code,
      currency: input.currency,
      shipped_on: null,
      marks_and_numbers: input.marks_and_numbers,
      // A one-off document has no history to be a revision of.
      revision: 1,
    },
    exporter: input.seller,
    consignee: input.buyer,
    notify: null,
    items,
    totals: {
      quantity: (sumStated(input.lines.map((entry) => entry.quantity)) ?? 0).toString(),
      net_weight_kg: (sumStated(input.lines.map((entry) => entry.net_weight_kg)) ?? 0).toString(),
      // Null when no line states one, so the document omits the figure instead of
      // printing a gross weight of zero.
      gross_weight_kg: gross === null ? null : gross.toString(),
      packages: (sumStated(input.lines.map((entry) => entry.package_count)) ?? 0).toString(),
      value: sumLineTotals(input.lines, places).toFixed(places),
    },
  };
}
