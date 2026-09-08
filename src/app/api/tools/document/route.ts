import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { renderTradeDocument } from '@/lib/pdf/trade-document';
import { safeFileName } from '@/lib/zip';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Renders a one-off document for a visitor who has no account.
 *
 * Nothing is stored. The submission is turned into a snapshot, rendered, and returned;
 * when the response ends there is no record of the shipment, the parties or the prices,
 * which is what lets the page promise exactly that.
 *
 * The bounds below are the abuse control. This endpoint is unauthenticated, so the work
 * one request can ask for is capped rather than rate-limited against a store this
 * deployment may not have: a bounded render is cheap enough to serve honestly.
 */
const MAX_LINES = 20;
const MAX_BODY_BYTES = 64 * 1024;

const text = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
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
  country_of_origin: text(2),
  quantity: z.coerce.number().positive().max(1_000_000_000),
  unit: z.string().trim().min(1).max(12).default('pcs'),
  unit_price: z.coerce.number().min(0).max(1_000_000_000),
  net_weight_kg: z.coerce.number().min(0).max(1_000_000_000).optional(),
  package_count: z.coerce.number().int().min(0).max(1_000_000).optional(),
});

const requestSchema = z.object({
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
  seller: party,
  buyer: party,
  lines: z.array(line).min(1).max(MAX_LINES),
});

/** Turns one submitted line into the shape the renderer's schema expects. */
function toItem(entry: z.infer<typeof line>, index: number) {
  return {
    position: index + 1,
    description: entry.description,
    hs_code: entry.hs_code,
    country_of_origin: entry.country_of_origin,
    quantity: entry.quantity,
    unit: entry.unit,
    unit_price: entry.unit_price,
    // Rounded here for the same reason the database rounds it: the line total a reader
    // adds up by hand has to be the one printed.
    line_total: Math.round(entry.quantity * entry.unit_price * 100) / 100,
    net_weight_kg: entry.net_weight_kg ?? null,
    gross_weight_kg: null,
    package_count: entry.package_count ?? null,
    package_kind: null,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  if (body.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'That document is too large for this tool.' }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'That request could not be read.' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Check the document details. A number, a buyer and at least one line are needed.' },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const items = input.lines.map(toItem);
  const totals = items.reduce(
    (sum, item) => ({
      quantity: sum.quantity + item.quantity,
      net_weight_kg: sum.net_weight_kg + Number(item.net_weight_kg ?? 0),
      gross_weight_kg: 0,
      packages: sum.packages + Number(item.package_count ?? 0),
      value: sum.value + item.line_total,
    }),
    { quantity: 0, net_weight_kg: 0, gross_weight_kg: 0, packages: 0, value: 0 },
  );

  const snapshot = {
    kind: input.kind,
    number: input.number,
    generated_at: new Date().toISOString(),
    shipment: {
      reference: input.reference || input.number,
      incoterm: input.incoterm,
      incoterm_place: input.incoterm_place,
      port_of_loading: input.port_of_loading,
      port_of_discharge: input.port_of_discharge,
      country_of_origin: input.seller.country_code,
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
    totals,
  };

  let pdf: Uint8Array;
  try {
    pdf = renderTradeDocument(snapshot);
  } catch {
    return NextResponse.json({ error: 'That document could not be rendered.' }, { status: 500 });
  }

  return new NextResponse(pdf as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeFileName(input.number, 'document')}.pdf"`,
      // Never cached anywhere: the content is somebody's commercial terms.
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
