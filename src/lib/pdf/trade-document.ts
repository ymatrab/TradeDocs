import { createHash } from 'node:crypto';
import { z } from 'zod';
import {
  FontSet,
  Page,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  renderPdf,
  wrap,
  type FontName,
  type PlacedImage,
  type PlacedText,
} from './writer';
import { createFontSet } from './fonts';
import { embedImage, fitWithin, type PdfImage } from './image';
import { LOGO_BOX, SIGNATURE_BOX } from './branding-layout';
import { DOCUMENT_KINDS } from '@/lib/labels';

/**
 * Renders a stored document snapshot as a PDF.
 *
 * The snapshot is the only input. Nothing is read from the live shipment, so a document
 * produced today and re-rendered next year is identical, which is what makes it usable as
 * evidence rather than a report.
 */

/**
 * Identifies this renderer in a set's manifest. Bump it whenever the output for an existing
 * snapshot would change; a change that only affects snapshots of a newer schema version
 * keeps older documents byte-identical and still warrants a bump.
 */
export const RENDERER_VERSION = 'tradedocs-pdf/7';

const numeric = z.union([z.number(), z.string()]).transform((value) => Number(value));

const partySchema = z
  .object({
    name: z.string().nullable().optional(),
    legal_name: z.string().nullable().optional(),
    address_line1: z.string().nullable().optional(),
    address_line2: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    region: z.string().nullable().optional(),
    postal_code: z.string().nullable().optional(),
    country_code: z.string().nullable().optional(),
    tax_number: z.string().nullable().optional(),
    contact_name: z.string().nullable().optional(),
    registration_number: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

/** One branding image a snapshot refers to: where it is stored and the hash of its bytes. */
export const brandingAssetSchema = z.object({
  object_path: z.string(),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  format: z.enum(['png', 'jpeg']),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export type BrandingAssetRef = z.infer<typeof brandingAssetSchema>;

export const snapshotSchema = z.object({
  /**
   * Absent on snapshots taken before versioning, which are schema 1. Schema 2 adds
   * money_places, and a stated-or-absent gross weight total. Schema 3 adds a
   * stated-or-absent net weight total, a per-line origin column on invoices whose lines
   * state one, and the registered "Incoterms® 2020" caption. Schema 4 adds `supersedes`,
   * `issuer`, per-package row weights and count-weighted packing totals, and lays out
   * long party/terms text inside its box, the notify party, and totals that always share a
   * page with the last row of their table. Schema 5 adds `branding`: the organization's
   * logo, drawn at the top left of every page, and its signature or stamp image, drawn above
   * the signatory line. Schema 6 adds the shipment's `buyer_reference` (printed on
   * commercial and proforma invoices) and `proforma_valid_until` (on proforma invoices), in
   * a second row of term boxes. Schema 7 adds the container, seal, booking, vessel and VGM
   * fields to `shipment`. Renderer 7 adds seven kinds (quotation to VGM declaration) whose
   * layout is new and touches no older kind. Each change applies only from the schema that
   * introduced it, so a document issued under an older schema re-renders exactly as it was
   * issued.
   */
  schema_version: z.number().int().min(1).optional(),
  /**
   * Decimal places of the currency's minor unit, fixed when the document was generated so a
   * re-render never depends on today's currency tables. Schema 1 documents used two.
   */
  money_places: z.number().int().min(0).max(4).optional(),
  kind: z.enum(DOCUMENT_KINDS),
  number: z.string(),
  generated_at: z.string(),
  /**
   * The date the issuer states for the document (YYYY-MM-DD), when it differs from the day
   * it was generated. Absent on every workspace snapshot so far, which print generated_at.
   */
  issued_on: z.string().nullable().optional(),
  /** Schema 4: the number of the document this one replaces, printed under the header. */
  supersedes: z.string().nullable().optional(),
  /** Set only on a preview, which is never stored and is labelled as not issued. */
  preview: z.boolean().optional(),
  /** Schema 4: the issuer's own terms, from the organization's document settings. */
  issuer: z
    .object({
      payment_terms: z.string().nullable().optional(),
      bank_details: z.string().nullable().optional(),
      signatory_name: z.string().nullable().optional(),
      signatory_title: z.string().nullable().optional(),
      document_notes: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  /**
   * Schema 5: the branding images this document was issued with, by content hash. Captured
   * only for an organization entitled to PDF branding when the document was generated; the
   * bytes are fetched by hash at render time, so a later logo change cannot alter it.
   */
  branding: z
    .object({
      logo: brandingAssetSchema.nullable().optional(),
      signature: brandingAssetSchema.nullable().optional(),
    })
    .nullable()
    .optional(),
  shipment: z.object({
    reference: z.string(),
    incoterm: z.string().nullable().optional(),
    incoterm_place: z.string().nullable().optional(),
    port_of_loading: z.string().nullable().optional(),
    port_of_discharge: z.string().nullable().optional(),
    country_of_origin: z.string().nullable().optional(),
    country_of_destination: z.string().nullable().optional(),
    currency: z.string(),
    shipped_on: z.string().nullable().optional(),
    marks_and_numbers: z.string().nullable().optional(),
    /** Schema 6: the buyer's own reference for the order, usually a purchase order number. */
    buyer_reference: z.string().nullable().optional(),
    /** Schema 6: the last day a proforma's offer stands, YYYY-MM-DD. */
    proforma_valid_until: z.string().nullable().optional(),
    /** Schema 7: the container and booking the goods travel under, and the VGM facts. */
    container_number: z.string().nullable().optional(),
    container_type: z.string().nullable().optional(),
    seal_number: z.string().nullable().optional(),
    booking_number: z.string().nullable().optional(),
    vessel_voyage: z.string().nullable().optional(),
    /** SOLAS VI/2 weighing method, 1 or 2 (IMO MSC.1/Circ.1475 paragraph 5.1). */
    vgm_method: z.number().int().min(1).max(2).nullable().optional(),
    vgm_kg: numeric.nullable().optional(),
    vgm_weighed_on: z.string().nullable().optional(),
    vgm_signatory: z.string().nullable().optional(),
    revision: z.number(),
  }),
  exporter: partySchema,
  consignee: partySchema,
  notify: partySchema,
  items: z.array(
    z.object({
      position: z.number(),
      description: z.string(),
      hs_code: z.string().nullable().optional(),
      country_of_origin: z.string().nullable().optional(),
      quantity: numeric,
      unit: z.string(),
      unit_price: numeric,
      line_total: numeric,
      net_weight_kg: numeric.nullable().optional(),
      gross_weight_kg: numeric.nullable().optional(),
      package_count: z.number().nullable().optional(),
      package_kind: z.string().nullable().optional(),
    }),
  ),
  totals: z.object({
    quantity: numeric,
    /** Null (schema 3) when no line states a net weight: a total of zero would be false. */
    net_weight_kg: numeric.nullable(),
    /** Null when no line states a gross weight: a total of zero would be a false figure. */
    gross_weight_kg: numeric.nullable(),
    packages: numeric,
    value: numeric,
  }),
  /**
   * Present only on snapshots taken after packing was modelled. An older document must
   * still render exactly as it did, so this is optional rather than defaulted.
   */
  packages: z
    .array(
      z.object({
        position: z.number(),
        kind: z.string(),
        package_count: z.number(),
        length_cm: numeric.nullable().optional(),
        width_cm: numeric.nullable().optional(),
        height_cm: numeric.nullable().optional(),
        net_weight_kg: numeric.nullable().optional(),
        gross_weight_kg: numeric.nullable().optional(),
        volume_m3: numeric.nullable().optional(),
        /** Schema 4: package_count x per-package weight, the figure the totals add up. */
        net_weight_total_kg: numeric.nullable().optional(),
        gross_weight_total_kg: numeric.nullable().optional(),
        marks: z.string().nullable().optional(),
        contents: z
          .array(
            z.object({
              position: z.number(),
              description: z.string(),
              quantity: numeric,
              unit: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
  packing_totals: z
    .object({
      packages: numeric,
      /** Null from schema 4 when no package states one; count-weighted from schema 4. */
      gross_weight_kg: numeric.nullable(),
      net_weight_kg: numeric.nullable(),
      volume_m3: numeric,
    })
    .optional(),
});

export type DocumentSnapshot = z.infer<typeof snapshotSchema>;

const titles: Record<DocumentSnapshot['kind'], string> = {
  commercial_invoice: 'Commercial Invoice',
  proforma_invoice: 'Proforma Invoice',
  packing_list: 'Packing List',
  delivery_note: 'Delivery Note',
  certificate_of_origin: 'Certificate of Origin',
  quotation: 'Quotation',
  purchase_order: 'Purchase Order',
  sales_confirmation: 'Sales Confirmation',
  sales_contract: 'Sales Contract (Draft)',
  bill_of_lading_draft: 'Bill of Lading Draft',
  shipper_letter_of_instruction: 'Shipper’s Letter of Instruction',
  vgm_declaration: 'Verified Gross Mass Declaration',
};

type Kind = DocumentSnapshot['kind'];

/**
 * The kinds renderer 6 and earlier drew. Their layout is evidence and does not change; every
 * branch for a newer kind below is taken only when the kind is not one of these.
 */
const LEGACY_KINDS: ReadonlySet<Kind> = new Set<Kind>([
  'commercial_invoice',
  'proforma_invoice',
  'packing_list',
  'delivery_note',
  'certificate_of_origin',
]);

function isLegacyKind(kind: Kind): boolean {
  return LEGACY_KINDS.has(kind);
}

/** Renderer 7 kinds that price the goods, and so print a total amount. */
const PRICED_KINDS: ReadonlySet<Kind> = new Set<Kind>([
  'quotation',
  'purchase_order',
  'sales_confirmation',
  'sales_contract',
  'shipper_letter_of_instruction',
]);

/** Renderer 7 kinds a carrier or forwarder reads: container, booking and weights. */
const SHIPPING_KINDS: ReadonlySet<Kind> = new Set<Kind>([
  'bill_of_lading_draft',
  'shipper_letter_of_instruction',
  'vgm_declaration',
]);

/** The two party boxes' captions: who the exporter and the consignee are on this document. */
const partyCaptions: Partial<Record<Kind, [string, string]>> = {
  quotation: ['Seller', 'Buyer'],
  purchase_order: ['Supplier / Seller', 'Buyer'],
  sales_confirmation: ['Seller', 'Buyer'],
  sales_contract: ['Seller', 'Buyer'],
  bill_of_lading_draft: ['Shipper', 'Consignee'],
  shipper_letter_of_instruction: ['Shipper / Exporter', 'Ultimate consignee'],
  vgm_declaration: ['Shipper (responsible for the VGM)', 'Consignee'],
};

/**
 * What a renderer 7 document is not, printed under the header of every page. Not
 * configurable: a draft contract must never read as advice, a draft bill of lading never as
 * the carrier's, and a declared mass never as one TradeDocs verified.
 */
const kindNotices: Partial<Record<Kind, string>> = {
  sales_contract: 'DRAFT — NOT LEGAL ADVICE. BOTH PARTIES SHOULD REVIEW EVERY TERM BEFORE SIGNING.',
  bill_of_lading_draft:
    'DRAFT SHIPPING INSTRUCTIONS FOR YOUR CARRIER — THE CARRIER ISSUES THE BILL OF LADING.',
  shipper_letter_of_instruction:
    'INSTRUCTIONS FROM THE SHIPPER TO ITS FORWARDER. NOT A CUSTOMS OR EXPORT FILING.',
  vgm_declaration:
    'DECLARED BY THE SHIPPER. TRADEDOCS DOES NOT WEIGH OR VERIFY THE MASS STATED HERE.',
};

/** A line to write on: what a draft prints where the record states nothing. */
const BLANK = '________________________________________';

/**
 * The sales contract's headings, each filled from the record where it can be and otherwise
 * left blank for the parties. Neutral by design: headings and the parties' own data, never
 * contract wording TradeDocs proposes.
 */
function contractClauses(snapshot: DocumentSnapshot): [string, string][] {
  const { shipment, issuer } = snapshot;
  const moneyPlaces = snapshot.money_places ?? 2;
  const term = [shipment.incoterm, shipment.incoterm_place].filter(Boolean).join(' ');
  const total = `${decimal(snapshot.totals.value, moneyPlaces)} ${shipment.currency}`;
  return [
    ['1. GOODS AND QUANTITY', 'As listed above.'],
    [
      '2. PRICE AND DELIVERY TERM',
      term
        ? `Total ${total}, ${term} (Incoterms® 2020).`
        : `Total ${total}. Delivery term: ${BLANK}`,
    ],
    ['3. PAYMENT', issuer?.payment_terms || BLANK],
    ['4. TIME OF SHIPMENT', shipment.shipped_on || BLANK],
    ['5. PACKING AND MARKING', shipment.marks_and_numbers || BLANK],
    ['6. INSPECTION AND ACCEPTANCE', BLANK],
    ['7. INSURANCE', BLANK],
    ['8. GOVERNING LAW AND DISPUTES', `To be agreed by the parties: ${BLANK}`],
    ['9. OTHER TERMS', BLANK],
  ];
}

/** The fill-in lines a draft bill of lading or letter of instruction leaves to the shipper. */
function shippingInstructions(kind: Kind): [string, string][] {
  if (kind === 'bill_of_lading_draft') {
    return [
      ['FREIGHT PAYABLE AT', BLANK],
      ['NUMBER OF ORIGINAL BILLS REQUESTED', BLANK],
      ['PLACE AND DATE OF ISSUE', 'Stated by the carrier on the bill of lading it issues.'],
    ];
  }
  if (kind === 'shipper_letter_of_instruction') {
    return [
      ['FORWARDER', BLANK],
      ['FREIGHT (PREPAID OR COLLECT)', BLANK],
      ['INSURANCE', BLANK],
      ['EXPORT FILING, IF ANY, BY', BLANK],
      ['SPECIAL INSTRUCTIONS', BLANK],
    ];
  }
  return [];
}

/** IMO MSC.1/Circ.1475 paragraphs 5.1.1 and 5.1.2, in a phrase each. */
const VGM_METHODS: Record<1 | 2, string> = {
  1: 'Method No. 1: the packed and sealed container was weighed',
  2:
    'Method No. 2: all packages and cargo items, with pallets, dunnage and securing ' +
    'material, were weighed and the container tare added (certified method)',
};

/** The VGM declaration's facts, as caption and value, in the order it prints them. */
function vgmFacts(snapshot: DocumentSnapshot): [string, string][] {
  const { shipment } = snapshot;
  const container = [shipment.container_number, shipment.container_type]
    .filter(Boolean)
    .join(' · ');
  const method = shipment.vgm_method === 1 || shipment.vgm_method === 2 ? shipment.vgm_method : 0;
  return [
    ['Container number / type', container || '—'],
    ['Seal number', shipment.seal_number || '—'],
    ['Booking number', shipment.booking_number || '—'],
    ['Weighing method', method ? VGM_METHODS[method] : '—'],
    ['VERIFIED GROSS MASS', shipment.vgm_kg == null ? '—' : `${decimal(shipment.vgm_kg, 3)} kg`],
    ['Date of weighing', shipment.vgm_weighed_on || '—'],
    ['Authorized person (name in capitals)', (shipment.vgm_signatory ?? '—').toUpperCase()],
  ];
}

/** The SOLAS basis a VGM declaration states, as the IMO guidelines set it out. */
const VGM_BASIS =
  'The shipper provides the verified gross mass of the packed container under SOLAS chapter ' +
  'VI, regulation 2, as set out in IMO MSC.1/Circ.1475. It is signed by a person duly ' +
  'authorized by the shipper; the name in capitals may stand in place of a signature ' +
  '(paragraph 6.2).';

/**
 * The statement of what this document is, and is not. It is rendered on every page of every
 * document type and is deliberately not configurable.
 */
const DISCLOSURE =
  'Prepared with TradeDocs from the shipper’s own data. This document is not issued, ' +
  'endorsed, certified or cleared by any customs authority, carrier or chamber of commerce.';

const MARGIN = 42;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

export { LOGO_BOX, SIGNATURE_BOX };

/**
 * Branding image bytes by SHA-256 (hex). The renderer checks every image against the hash
 * its snapshot recorded, so only the exact bytes a document was issued with are drawn.
 */
export type BrandingImages = ReadonlyMap<string, Uint8Array>;

/** A branded snapshot whose images were not supplied, or not the bytes it recorded. */
export class BrandingUnavailableError extends Error {
  constructor() {
    super('A branding image this document needs is not available.');
    this.name = 'BrandingUnavailableError';
  }
}

/** The branding images a snapshot needs, so the caller can fetch exactly those. */
export function brandingAssetsOf(input: unknown): BrandingAssetRef[] {
  const parsed = snapshotSchema.safeParse(input);
  if (!parsed.success || (parsed.data.schema_version ?? 1) < 5) return [];
  const { branding } = parsed.data;
  return [branding?.logo, branding?.signature].filter(
    (asset): asset is BrandingAssetRef => asset != null,
  );
}

/**
 * The same snapshot without its branding: what a preview falls back to when the
 * organization is not entitled, or an image cannot be read. Never used on an issued
 * document, which renders as issued or not at all.
 */
export function withoutBranding(input: unknown): unknown {
  if (typeof input !== 'object' || input === null || !('branding' in input)) return input;
  const rest: Record<string, unknown> = { ...(input as Record<string, unknown>) };
  delete rest.branding;
  return rest;
}

function resolveBranding(
  snapshot: DocumentSnapshot,
  images: BrandingImages | undefined,
): { logo?: PdfImage; signature?: PdfImage } {
  if ((snapshot.schema_version ?? 1) < 5 || !snapshot.branding) return {};
  const embedded = new Map<string, PdfImage>();
  const load = (asset: BrandingAssetRef | null | undefined): PdfImage | undefined => {
    if (!asset) return undefined;
    const cached = embedded.get(asset.sha256);
    if (cached) return cached;
    const bytes = images?.get(asset.sha256);
    if (!bytes || createHash('sha256').update(bytes).digest('hex') !== asset.sha256) {
      throw new BrandingUnavailableError();
    }
    const image = embedImage(bytes);
    embedded.set(asset.sha256, image);
    return image;
  };
  return { logo: load(snapshot.branding.logo), signature: load(snapshot.branding.signature) };
}

type Column = {
  header: string;
  width: number;
  align?: 'left' | 'right';
  value: (item: DocumentSnapshot['items'][number], currency: string) => string;
};

function decimal(value: number, places = 2): string {
  return value.toLocaleString('en-GB', {
    minimumFractionDigits: places,
    maximumFractionDigits: places,
  });
}

/** Snapshots before versioning carry no schema_version and are schema 1. */
function schemaOf(snapshot: DocumentSnapshot): number {
  return snapshot.schema_version ?? 1;
}

/**
 * Whether an invoice prints a per-line origin column: from schema 3, whenever any line
 * states an origin, so lines of different origin are not reduced to one shipment field.
 */
function showsLineOrigin(snapshot: DocumentSnapshot): boolean {
  return (
    schemaOf(snapshot) >= 3 &&
    (snapshot.kind === 'commercial_invoice' || snapshot.kind === 'proforma_invoice') &&
    snapshot.items.some((item) => Boolean(item.country_of_origin))
  );
}

/** Each document type shows the columns its readers need, from one shared set of figures. */
function columnsFor(
  kind: DocumentSnapshot['kind'],
  moneyPlaces: number,
  lineOrigin = false,
): Column[] {
  const description: Column = {
    header: 'Description of goods',
    width: 0,
    value: (item) => item.description,
  };
  const quantity: Column = {
    header: 'Quantity',
    width: 76,
    align: 'right',
    value: (item) => `${decimal(item.quantity, 3)} ${item.unit}`,
  };
  const hs: Column = { header: 'HS code', width: 62, value: (item) => item.hs_code ?? '—' };
  const origin: Column = {
    header: 'Origin',
    width: 46,
    value: (item) => item.country_of_origin ?? '—',
  };
  // Narrower on an invoice, which already carries five columns; an alpha-2 code fits.
  const lineOriginColumn: Column = { ...origin, width: 40 };

  if (kind === 'packing_list') {
    return [
      description,
      {
        header: 'Packages',
        width: 66,
        align: 'right',
        value: (item) =>
          item.package_count ? `${item.package_count} ${item.package_kind ?? ''}`.trim() : '—',
      },
      quantity,
      {
        header: 'Net kg',
        width: 62,
        align: 'right',
        value: (item) => (item.net_weight_kg == null ? '—' : decimal(item.net_weight_kg, 3)),
      },
      {
        header: 'Gross kg',
        width: 62,
        align: 'right',
        value: (item) => (item.gross_weight_kg == null ? '—' : decimal(item.gross_weight_kg, 3)),
      },
    ];
  }
  if (kind === 'delivery_note') {
    return [description, hs, quantity];
  }
  if (kind === 'certificate_of_origin') {
    return [description, hs, origin, quantity];
  }
  // Renderer 7 kinds. A carrier reads packages and gross weight, not prices.
  const packages: Column = {
    header: 'Packages',
    width: 66,
    align: 'right',
    value: (item) =>
      item.package_count ? `${item.package_count} ${item.package_kind ?? ''}`.trim() : '—',
  };
  const gross: Column = {
    header: 'Gross kg',
    width: 62,
    align: 'right',
    value: (item) => (item.gross_weight_kg == null ? '—' : decimal(item.gross_weight_kg, 3)),
  };
  if (kind === 'bill_of_lading_draft') {
    return [description, hs, packages, gross];
  }
  if (kind === 'vgm_declaration') {
    return [description, packages, gross];
  }
  if (kind === 'shipper_letter_of_instruction') {
    return [
      description,
      hs,
      quantity,
      gross,
      {
        header: 'Value',
        width: 84,
        align: 'right',
        value: (item) => decimal(item.line_total, moneyPlaces),
      },
    ];
  }
  return [
    description,
    hs,
    ...(lineOrigin ? [lineOriginColumn] : []),
    quantity,
    {
      header: 'Unit price',
      width: 72,
      align: 'right',
      value: (item) => decimal(item.unit_price, 4),
    },
    {
      header: 'Amount',
      width: 84,
      align: 'right',
      value: (item) => decimal(item.line_total, moneyPlaces),
    },
  ];
}

function partyLines(party: NonNullable<DocumentSnapshot['exporter']>): string[] {
  const lines = [
    party.legal_name || party.name || '',
    party.address_line1 ?? '',
    party.address_line2 ?? '',
    [party.postal_code, party.city].filter(Boolean).join(' '),
    [party.region, party.country_code].filter(Boolean).join(', '),
    party.tax_number ? `Tax ID ${party.tax_number}` : '',
  ];
  return lines.filter((line) => line.trim().length > 0);
}

function drawBox(page: Page, x: number, y: number, width: number, height: number, caption: string) {
  page.line(x, y, x + width, y);
  page.line(x, y - height, x + width, y - height);
  page.line(x, y, x, y - height);
  page.line(x + width, y, x + width, y - height);
  page.text(caption.toUpperCase(), x + 6, y - 11, { size: 6, font: 'bold' });
}

/** The totals block, as label and printed value, in the order the document prints them. */
function totalsFor(snapshot: DocumentSnapshot): [string, string][] {
  if (!isLegacyKind(snapshot.kind)) return renderer7TotalsFor(snapshot);
  const schema = schemaOf(snapshot);
  const moneyPlaces = snapshot.money_places ?? 2;
  const packing = snapshot.kind === 'packing_list' ? (snapshot.packages ?? []) : [];
  const totals: [string, string][] = [['Total quantity', decimal(snapshot.totals.quantity, 3)]];
  if (snapshot.kind === 'packing_list') {
    // Described packages are the measured truth and take precedence; the per-line counts
    // are an estimate that only stands in when nothing was described.
    const packed = packing.length > 0 ? snapshot.packing_totals : undefined;
    totals.push(['Total packages', decimal(packed?.packages ?? snapshot.totals.packages, 0)]);
    // Omitted rather than printed as zero when nothing states a net weight (schema 3); an
    // older document prints the zero it was issued with.
    const net = packed?.net_weight_kg ?? snapshot.totals.net_weight_kg;
    if (net != null || schema < 3) {
      totals.push(['Total net weight', `${decimal(net ?? 0, 3)} kg`]);
    }
    // Omitted rather than printed as zero when nothing states a gross weight.
    const gross = packed?.gross_weight_kg ?? snapshot.totals.gross_weight_kg;
    if (gross != null) totals.push(['Total gross weight', `${decimal(gross, 3)} kg`]);
    if (packed && Number(packed.volume_m3) > 0) {
      totals.push(['Total volume', `${decimal(packed.volume_m3, 3)} m³`]);
    }
  }
  if (snapshot.kind === 'commercial_invoice' || snapshot.kind === 'proforma_invoice') {
    totals.push([
      'Total amount',
      `${decimal(snapshot.totals.value, moneyPlaces)} ${snapshot.shipment.currency}`,
    ]);
  }
  return totals;
}

/**
 * Totals for the renderer 7 kinds: the amount on those that price the goods, and packages
 * and gross weight on those a carrier reads. Described packages take precedence over the
 * per-line counts, as on the packing list; a weight nothing states is left out, not zero.
 */
function renderer7TotalsFor(snapshot: DocumentSnapshot): [string, string][] {
  const moneyPlaces = snapshot.money_places ?? 2;
  const totals: [string, string][] = [['Total quantity', decimal(snapshot.totals.quantity, 3)]];
  if (SHIPPING_KINDS.has(snapshot.kind)) {
    const packed = (snapshot.packages ?? []).length > 0 ? snapshot.packing_totals : undefined;
    totals.push(['Total packages', decimal(packed?.packages ?? snapshot.totals.packages, 0)]);
    const gross = packed?.gross_weight_kg ?? snapshot.totals.gross_weight_kg;
    if (gross != null) totals.push(['Total gross weight', `${decimal(gross, 3)} kg`]);
    if (packed && Number(packed.volume_m3) > 0) {
      totals.push(['Total volume', `${decimal(packed.volume_m3, 3)} m³`]);
    }
  }
  if (PRICED_KINDS.has(snapshot.kind)) {
    totals.push([
      'Total amount',
      `${decimal(snapshot.totals.value, moneyPlaces)} ${snapshot.shipment.currency}`,
    ]);
  }
  return totals;
}

/**
 * Lines of text cut to a width and a count. A line that had to be cut ends in an ellipsis,
 * so a reader can see something was left out rather than read a truncated value as whole.
 */
function fitLines(
  fonts: FontSet,
  lines: readonly string[],
  width: number,
  size: number,
  max: number,
  font: FontName = 'regular',
): string[] {
  const wrapped = lines.flatMap((line) => wrap(fonts, line, width, size, font));
  if (wrapped.length <= max) return wrapped;
  const kept = wrapped.slice(0, max);
  let last = kept[max - 1] ?? '';
  while (last.length > 1 && fonts.measure(`${last}…`, size, font) > width) {
    last = last.slice(0, -1).trimEnd();
  }
  kept[max - 1] = `${last}…`;
  return kept;
}

/**
 * Schema 6: the commercial terms an invoice prints in a second row of term boxes, as caption
 * and value. Empty for every older snapshot and for documents that are not invoices.
 */
function commercialTermsFor(snapshot: DocumentSnapshot): [string, string][] {
  if (!isLegacyKind(snapshot.kind)) return renderer7TermsFor(snapshot);
  if (schemaOf(snapshot) < 6) return [];
  const invoice = snapshot.kind === 'commercial_invoice' || snapshot.kind === 'proforma_invoice';
  if (!invoice) return [];
  const terms: [string, string][] = [];
  const { buyer_reference: buyerReference, proforma_valid_until: validUntil } = snapshot.shipment;
  if (buyerReference) terms.push(['Buyer reference / PO', buyerReference]);
  if (snapshot.kind === 'proforma_invoice' && validUntil) terms.push(['Valid until', validUntil]);
  return terms;
}

/**
 * The second row of term boxes on a renderer 7 kind: the offer's validity on a quotation,
 * the buyer's reference on a confirmation or contract, and the container and booking on a
 * shipping document. A box whose value the record does not state is left out.
 */
function renderer7TermsFor(snapshot: DocumentSnapshot): [string, string][] {
  const { shipment, kind } = snapshot;
  const terms: [string, string][] = [];
  if (kind === 'quotation' && shipment.proforma_valid_until) {
    terms.push(['Valid until', shipment.proforma_valid_until]);
  }
  if ((kind === 'sales_confirmation' || kind === 'sales_contract') && shipment.buyer_reference) {
    terms.push(['Buyer reference / PO', shipment.buyer_reference]);
  }
  if (SHIPPING_KINDS.has(kind) && kind !== 'vgm_declaration') {
    const container = [shipment.container_number, shipment.container_type]
      .filter(Boolean)
      .join(' · ');
    terms.push(['Vessel / voyage', shipment.vessel_voyage || '—']);
    terms.push(['Booking number', shipment.booking_number || '—']);
    terms.push(['Container / type', container || '—']);
    terms.push(['Seal number', shipment.seal_number || '—']);
  }
  return terms;
}

/** The lowest a schema 4 page's content may reach: the disclosure rule sits just below. */
const CONTENT_BOTTOM = MARGIN + 44;

/** Lays a stored snapshot out as pages. */
function layoutTradeDocument(input: unknown, fonts: FontSet, images?: BrandingImages): Page[] {
  const snapshot = snapshotSchema.parse(input);
  const moneyPlaces = snapshot.money_places ?? 2;
  const schema = schemaOf(snapshot);
  // Schema 5 branding; empty for every older document, which therefore lays out as before.
  const branding = resolveBranding(snapshot, images);
  const logo = branding.logo
    ? { image: branding.logo, ...fitWithin(branding.logo, LOGO_BOX) }
    : null;
  // Layout fixes from schema 4 apply only to documents issued under it, so an older document
  // re-renders exactly as it was issued.
  const v4 = schema >= 4;
  const columns = columnsFor(snapshot.kind, moneyPlaces, showsLineOrigin(snapshot));
  const fixed = columns.reduce((total, column) => total + column.width, 0);
  const layout = columns.map((column) =>
    column.width === 0 ? { ...column, width: CONTENT_WIDTH - fixed - 24 } : column,
  );

  const notice = isLegacyKind(snapshot.kind) ? undefined : kindNotices[snapshot.kind];

  const pages: Page[] = [];
  let page = new Page(fonts);
  let cursor = 0;

  const startPage = (continued: boolean): void => {
    page = new Page(fonts);
    pages.push(page);
    cursor = PAGE_HEIGHT - MARGIN;

    if (logo) {
      // Top-aligned in its box, which starts where the title's capitals would; the title row
      // moves down below the box.
      const top = PAGE_HEIGHT - MARGIN + 12;
      page.image(logo.image, MARGIN, top - logo.height, logo.width, logo.height);
      cursor = top - LOGO_BOX.height - 20;
    }

    page.text(titles[snapshot.kind].toUpperCase(), MARGIN, cursor, { size: 16, font: 'bold' });
    if (snapshot.preview) {
      page.text('PREVIEW · NOT ISSUED', PAGE_WIDTH - MARGIN, cursor, {
        size: 10,
        align: 'right',
        font: 'bold',
      });
    } else {
      page.text(`No. ${snapshot.number}`, PAGE_WIDTH - MARGIN, cursor, {
        size: 10,
        align: 'right',
      });
    }
    cursor -= 14;
    const replaces = v4 && snapshot.supersedes ? ` · replaces No. ${snapshot.supersedes}` : '';
    page.text(
      `Shipment ${snapshot.shipment.reference} · revision ${snapshot.shipment.revision} · issued ${snapshot.issued_on ?? snapshot.generated_at.slice(0, 10)}${replaces}`,
      MARGIN,
      cursor,
      { size: 7.5 },
    );
    if (continued) {
      page.text('continued', PAGE_WIDTH - MARGIN, cursor, { size: 7.5, align: 'right' });
    }
    cursor -= 10;
    page.line(MARGIN, cursor, PAGE_WIDTH - MARGIN, cursor, 1, 0.15);
    cursor -= 16;
    // Renderer 7: what this kind is not, on every page, before anything else is read.
    if (notice) {
      for (const line of wrap(fonts, notice, CONTENT_WIDTH, 7.5, 'bold')) {
        page.text(line, MARGIN, cursor, { size: 7.5, font: 'bold' });
        cursor -= 10;
      }
      cursor -= 8;
    }
  };

  const drawTableHeader = (): void => {
    page.rect(MARGIN, cursor - 13, CONTENT_WIDTH, 16);
    let x = MARGIN;
    for (const column of layout) {
      const isRight = column.align === 'right';
      page.text(column.header.toUpperCase(), isRight ? x + column.width - 6 : x + 6, cursor - 8, {
        size: 6.5,
        font: 'bold',
        align: isRight ? 'right' : 'left',
      });
      x += column.width;
    }
    cursor -= 17;
    page.line(MARGIN, cursor, PAGE_WIDTH - MARGIN, cursor, 0.8, 0.35);
    cursor -= 4;
  };

  startPage(false);

  // Parties, in the boxed arrangement trade paperwork uses.
  const boxWidth = (CONTENT_WIDTH - 10) / 2;
  const [exporterCaption, consigneeCaption] = partyCaptions[snapshot.kind] ?? [
    'Exporter / Consignor',
    'Consignee',
  ];
  const parties: [string, DocumentSnapshot['exporter']][] = [
    [exporterCaption, snapshot.exporter],
    [consigneeCaption, snapshot.consignee],
  ];
  const boxHeight = 78;
  parties.forEach(([caption, party], index) => {
    const x = MARGIN + index * (boxWidth + 10);
    drawBox(page, x, cursor, boxWidth, boxHeight, caption);
    if (party) {
      let lineY = cursor - 24;
      // From schema 4 a long legal name or address wraps inside its box, and what cannot fit
      // ends in an ellipsis, instead of running into the neighbouring box.
      const lines = v4
        ? fitLines(fonts, partyLines(party), boxWidth - 12, 8.5, 6)
        : partyLines(party);
      for (const line of lines) {
        page.text(line, x + 6, lineY, { size: 8.5 });
        lineY -= 10;
      }
    } else {
      page.text('Not provided', x + 6, cursor - 24, { size: 8.5 });
    }
  });
  cursor -= boxHeight + 10;

  // Schema 4 prints the notify party the snapshot always carried.
  if (v4 && snapshot.notify) {
    const notify = snapshot.notify;
    const summary = [
      notify.legal_name || notify.name || '',
      [notify.postal_code, notify.city].filter(Boolean).join(' '),
      notify.country_code ?? '',
    ]
      .filter((part) => part.trim().length > 0)
      .join(', ');
    drawBox(page, MARGIN, cursor, CONTENT_WIDTH, 34, 'Notify party');
    const [line] = fitLines(fonts, [summary], CONTENT_WIDTH - 12, 8.5, 1);
    page.text(line ?? '', MARGIN + 6, cursor - 24, { size: 8.5 });
    cursor -= 44;
  }

  // Shipment terms.
  const terms: [string, string][] = [
    [
      schema >= 3 ? 'Incoterms® 2020' : 'Incoterm 2020',
      [snapshot.shipment.incoterm, snapshot.shipment.incoterm_place].filter(Boolean).join(' ') ||
        '—',
    ],
    ['Port of loading', snapshot.shipment.port_of_loading || '—'],
    ['Port of discharge', snapshot.shipment.port_of_discharge || '—'],
    ['Country of origin', snapshot.shipment.country_of_origin || '—'],
  ];
  const termWidth = CONTENT_WIDTH / terms.length;
  const drawTerms = (row: readonly [string, string][]): void => {
    row.forEach(([caption, value], index) => {
      const x = MARGIN + index * termWidth;
      drawBox(page, x, cursor, termWidth, 34, caption);
      if (v4 && fonts.measure(value, 8.5) > termWidth - 12) {
        // A long named place or port takes a second, smaller line rather than overflowing.
        fitLines(fonts, [value], termWidth - 12, 7.5, 2).forEach((line, lineIndex) => {
          page.text(line, x + 6, cursor - 21 - lineIndex * 8.5, { size: 7.5 });
        });
      } else {
        page.text(value, x + 6, cursor - 24, { size: 8.5 });
      }
    });
    cursor -= 44;
  };
  drawTerms(terms);
  // Schema 6: buyer reference and validity, in boxes the width of those above.
  const commercial = commercialTermsFor(snapshot);
  if (commercial.length > 0) drawTerms(commercial);

  // Measured before the tables are drawn, so the last row of the final table can take the
  // totals with it (schema 4): a totals block is never alone at the top of a page.
  const totals = totalsFor(snapshot);
  const totalsHeight = 6 + totals.length * 12;
  const packedOn =
    snapshot.kind === 'packing_list' ||
    snapshot.kind === 'delivery_note' ||
    snapshot.kind === 'bill_of_lading_draft';
  const packing = packedOn ? (snapshot.packages ?? []) : [];

  drawTableHeader();

  snapshot.items.forEach((item, itemIndex) => {
    const descriptionColumn = layout[0];
    if (!descriptionColumn) return;
    const lines = wrap(fonts, item.description, descriptionColumn.width - 12, 8.5);
    const rowHeight = Math.max(lines.length * 10 + 6, 18);

    if (v4) {
      const last = itemIndex === snapshot.items.length - 1 && packing.length === 0;
      if (cursor - rowHeight - (last ? totalsHeight : 0) < CONTENT_BOTTOM) {
        startPage(true);
        drawTableHeader();
      }
    } else if (cursor - rowHeight < MARGIN + 80) {
      // Keep room for the totals block and the disclosure.
      startPage(true);
      drawTableHeader();
    }

    let x = MARGIN;
    layout.forEach((column, index) => {
      const isRight = column.align === 'right';
      if (index === 0) {
        lines.forEach((line, lineIndex) => {
          page.text(line, x + 6, cursor - 10 - lineIndex * 10, { size: 8.5 });
        });
      } else {
        page.text(
          column.value(item, snapshot.shipment.currency),
          isRight ? x + column.width - 6 : x + 6,
          cursor - 10,
          {
            size: 8.5,
            align: isRight ? 'right' : 'left',
          },
        );
      }
      x += column.width;
    });
    cursor -= rowHeight;
    page.line(MARGIN, cursor, PAGE_WIDTH - MARGIN, cursor, 0.4, 0.82);
  });

  // How the goods are packed, on the documents whose readers load and check the truck.
  // Drawn from explicitly described packages; when none were described the document falls
  // back to the per-line carton counts, which is all it ever had.
  if (packing.length > 0) {
    if (cursor < MARGIN + 150) startPage(true);
    cursor -= 14;
    page.text('PACKING', MARGIN, cursor, { size: 6.5, font: 'bold' });
    cursor -= 12;

    const packColumns: [string, number, boolean][] = [
      ['Package', CONTENT_WIDTH - 300, false],
      ['Qty', 40, true],
      ['Dimensions (cm)', 110, false],
      ['Volume m³', 55, true],
      // From schema 4 the weights are the row's: count x per-package weight.
      [v4 ? 'Net kg row' : 'Net kg', 45, true],
      [v4 ? 'Gross kg row' : 'Gross kg', 50, true],
    ];

    const packHeader = (): void => {
      page.rect(MARGIN, cursor - 13, CONTENT_WIDTH, 16);
      let x = MARGIN;
      for (const [header, width, right] of packColumns) {
        page.text(header.toUpperCase(), right ? x + width - 6 : x + 6, cursor - 8, {
          size: 6.5,
          font: 'bold',
          align: right ? 'right' : 'left',
        });
        x += width;
      }
      cursor -= 17;
      page.line(MARGIN, cursor, PAGE_WIDTH - MARGIN, cursor, 0.8, 0.35);
    };
    packHeader();

    packing.forEach((box, boxIndex) => {
      const contents = box.contents ?? [];
      const rowHeight = 14 + contents.length * 9 + (box.marks ? 9 : 0);
      if (v4) {
        const last = boxIndex === packing.length - 1;
        if (cursor - rowHeight - (last ? totalsHeight : 0) < CONTENT_BOTTOM) {
          startPage(true);
          packHeader();
        }
      } else if (cursor - rowHeight < MARGIN + 80) {
        startPage(true);
        packHeader();
      }

      const size =
        box.length_cm != null && box.width_cm != null && box.height_cm != null
          ? `${decimal(box.length_cm, 1)} × ${decimal(box.width_cm, 1)} × ${decimal(box.height_cm, 1)}`
          : '—';
      const net = v4 ? box.net_weight_total_kg : box.net_weight_kg;
      const gross = v4 ? box.gross_weight_total_kg : box.gross_weight_kg;
      const values: string[] = [
        `${box.position}. ${box.kind}`,
        decimal(box.package_count, 0),
        size,
        box.volume_m3 == null ? '—' : decimal(box.volume_m3, 3),
        net == null ? '—' : decimal(net, 3),
        gross == null ? '—' : decimal(gross, 3),
      ];

      let x = MARGIN;
      packColumns.forEach(([, width, right], index) => {
        page.text(values[index] ?? '', right ? x + width - 6 : x + 6, cursor - 10, {
          size: 8.5,
          align: right ? 'right' : 'left',
        });
        x += width;
      });
      let detail = cursor - 20;
      if (box.marks) {
        page.text(box.marks, MARGIN + 12, detail, { size: 7 });
        detail -= 9;
      }
      // Contents are what makes this a packing list rather than a dimension table.
      for (const content of contents) {
        page.text(
          `${decimal(content.quantity, 3)} ${content.unit} · ${content.description}`,
          MARGIN + 12,
          detail,
          { size: 7 },
        );
        detail -= 9;
      }
      cursor -= rowHeight;
      page.line(MARGIN, cursor, PAGE_WIDTH - MARGIN, cursor, 0.4, 0.82);
    });
  }

  // Totals. Every document type states the figures its readers reconcile against.
  cursor -= 6;
  for (const [label, value] of totals) {
    const bold = label.startsWith('Total amount') || totals.length === 1;
    page.text(label, PAGE_WIDTH - MARGIN - 130, cursor - 10, { size: 8.5, align: 'right' });
    page.text(value, PAGE_WIDTH - MARGIN, cursor - 10, {
      size: 8.5,
      align: 'right',
      font: bold ? 'bold' : 'regular',
    });
    cursor -= 12;
  }

  /** A captioned block of wrapped text; from schema 4 it moves to a new page whole. */
  const block = (caption: string, text: string): void => {
    const lines = wrap(fonts, text, CONTENT_WIDTH, 8.5);
    if (v4 && cursor - (18 + lines.length * 10) < CONTENT_BOTTOM) startPage(true);
    cursor -= 8;
    page.text(caption, MARGIN, cursor, { size: 6.5, font: 'bold' });
    cursor -= 10;
    for (const line of lines) {
      page.text(line, MARGIN, cursor, { size: 8.5 });
      cursor -= 10;
    }
  };

  const legacy = isLegacyKind(snapshot.kind);
  // The contract states its marks in its own packing clause.
  if (snapshot.shipment.marks_and_numbers && snapshot.kind !== 'sales_contract') {
    block('MARKS AND NUMBERS', snapshot.shipment.marks_and_numbers);
  }

  /** Renderer 7: the VGM facts, the SOLAS basis, and the authorized person's line. */
  const drawVgm = (): void => {
    const labelWidth = 200;
    const rows = vgmFacts(snapshot).map(([caption, value]) => ({
      caption,
      strong: caption === 'VERIFIED GROSS MASS',
      lines: fitLines(fonts, [value], CONTENT_WIDTH - labelWidth - 6, 8.5, 3),
    }));
    const height = rows.reduce((sum, row) => sum + row.lines.length * 10 + 8, 0);
    if (cursor - 24 - height < CONTENT_BOTTOM) startPage(true);
    cursor -= 14;
    page.text('VERIFIED GROSS MASS OF THE PACKED CONTAINER', MARGIN, cursor, {
      size: 6.5,
      font: 'bold',
    });
    cursor -= 6;
    page.line(MARGIN, cursor, PAGE_WIDTH - MARGIN, cursor, 0.8, 0.35);
    for (const row of rows) {
      page.text(row.caption.toUpperCase(), MARGIN + 6, cursor - 12, { size: 6.5, font: 'bold' });
      row.lines.forEach((line, index) => {
        page.text(line, MARGIN + labelWidth, cursor - 12 - index * 10, {
          size: row.strong ? 10 : 8.5,
          font: row.strong ? 'bold' : 'regular',
        });
      });
      cursor -= row.lines.length * 10 + 8;
      page.line(MARGIN, cursor, PAGE_WIDTH - MARGIN, cursor, 0.4, 0.82);
    }
    block('BASIS', VGM_BASIS);
    if (cursor - 48 < CONTENT_BOTTOM) startPage(true);
    cursor -= 30;
    page.line(MARGIN, cursor, MARGIN + 200, cursor, 0.5, 0.35);
    cursor -= 10;
    const name = (snapshot.shipment.vgm_signatory ?? '').toUpperCase();
    page.text(`Signature of the authorized person${name ? `: ${name}` : ''}`, MARGIN, cursor, {
      size: 8.5,
    });
    cursor -= 8;
  };

  /** Renderer 7: a line for each party of a contract to sign on, side by side. */
  const drawPartySignatures = (): void => {
    const nameOf = (party: DocumentSnapshot['exporter']): string =>
      party?.legal_name || party?.name || '';
    const sides: [string, string][] = [
      ['For the seller', nameOf(snapshot.exporter)],
      ['For the buyer', nameOf(snapshot.consignee)],
    ];
    if (cursor - 64 < CONTENT_BOTTOM) startPage(true);
    cursor -= 40;
    sides.forEach(([caption, name], index) => {
      const x = MARGIN + index * (boxWidth + 10);
      page.line(x, cursor, x + 200, cursor, 0.5, 0.35);
      const [line] = fitLines(fonts, [name ? `${caption}: ${name}` : caption], boxWidth, 8.5, 1);
      page.text(line ?? caption, x, cursor - 10, { size: 8.5 });
      page.text('Name, title and date', x, cursor - 20, { size: 7 });
    });
    cursor -= 28;
  };

  if (!legacy) {
    if (snapshot.kind === 'sales_contract') {
      for (const [caption, text] of contractClauses(snapshot)) block(caption, text);
    }
    for (const [caption, text] of shippingInstructions(snapshot.kind)) block(caption, text);
    if (snapshot.kind === 'vgm_declaration') drawVgm();
  }
  // The contract and the VGM declaration carry their own signature lines.
  const ownSignatures = snapshot.kind === 'sales_contract' || snapshot.kind === 'vgm_declaration';

  const signature = branding.signature
    ? { image: branding.signature, ...fitWithin(branding.signature, SIGNATURE_BOX) }
    : null;
  if (v4 && (snapshot.issuer || signature)) {
    const issuer: NonNullable<DocumentSnapshot['issuer']> = snapshot.issuer ?? {};
    const invoice = snapshot.kind === 'commercial_invoice' || snapshot.kind === 'proforma_invoice';
    // Renderer 7: the offer, the order and its confirmation state the issuer's payment terms.
    const offer =
      snapshot.kind === 'quotation' ||
      snapshot.kind === 'purchase_order' ||
      snapshot.kind === 'sales_confirmation';
    if ((invoice || offer) && issuer.payment_terms) block('PAYMENT TERMS', issuer.payment_terms);
    if (invoice && issuer.bank_details) block('BANK DETAILS', issuer.bank_details);
    if (issuer.document_notes) block('NOTES', issuer.document_notes);
    if (!ownSignatures && (issuer.signatory_name || signature)) {
      // A place to sign and the name it is signed for. Without an uploaded signature image
      // it is not a signature: the document stays a preparation until a person signs it.
      // Schema 5 draws the organization's own signature or stamp image above the line.
      const imageHeight = signature ? signature.height + 4 : 0;
      if (cursor - 48 - imageHeight < CONTENT_BOTTOM) startPage(true);
      cursor -= 30;
      if (signature) {
        cursor -= imageHeight;
        page.image(signature.image, MARGIN, cursor + 3, signature.width, signature.height);
      }
      page.line(MARGIN, cursor, MARGIN + 200, cursor, 0.5, 0.35);
      cursor -= 10;
      page.text(
        [issuer.signatory_name, issuer.signatory_title].filter(Boolean).join(', '),
        MARGIN,
        cursor,
        { size: 8.5 },
      );
      cursor -= 8;
    }
  }
  if (snapshot.kind === 'sales_contract') drawPartySignatures();

  // The disclosure and page numbers go on every page, added once the count is known.
  const disclosure = snapshot.preview
    ? `Preview only: not finalized and without a document number. ${DISCLOSURE}`
    : DISCLOSURE;
  pages.forEach((rendered, index) => {
    let y = MARGIN + 26;
    rendered.line(MARGIN, y + 12, PAGE_WIDTH - MARGIN, y + 12, 0.5, 0.72);
    for (const line of wrap(fonts, disclosure, CONTENT_WIDTH - 90, 6.5)) {
      rendered.text(line, MARGIN, y, { size: 6.5 });
      y -= 8;
    }
    rendered.text(`Page ${index + 1} of ${pages.length}`, PAGE_WIDTH - MARGIN, MARGIN + 26, {
      size: 6.5,
      align: 'right',
    });
  });

  return pages;
}

/**
 * Renders a snapshot. A schema 5 snapshot with branding needs `images` holding the exact
 * bytes it recorded; without them it throws BrandingUnavailableError rather than render a
 * document that differs from the one issued.
 */
export function renderTradeDocument(
  input: unknown,
  fonts: FontSet = createFontSet(),
  images?: BrandingImages,
): Uint8Array {
  return renderPdf(layoutTradeDocument(input, fonts, images), fonts);
}

/** Exported for tests: the text each page carries and where, in drawing order. */
export function documentLayout(
  input: unknown,
  fonts: FontSet = createFontSet(),
  images?: BrandingImages,
): PlacedText[][] {
  return layoutTradeDocument(input, fonts, images).map((page) => [...page.texts]);
}

/** Exported for tests: the images each page draws and where, in drawing order. */
export function documentImages(
  input: unknown,
  images: BrandingImages,
  fonts: FontSet = createFontSet(),
): PlacedImage[][] {
  return layoutTradeDocument(input, fonts, images).map((page) => [...page.images]);
}

/** Exported for tests: the width a description column receives for a given document type. */
export function descriptionWidth(
  kind: DocumentSnapshot['kind'],
  moneyPlaces = 2,
  lineOrigin = false,
): number {
  const columns = columnsFor(kind, moneyPlaces, lineOrigin);
  const fixed = columns.reduce((total, column) => total + column.width, 0);
  return CONTENT_WIDTH - fixed - 24;
}

/** Exported for tests: the column headers a snapshot's line table prints, in order. */
export function columnHeaders(input: unknown): string[] {
  const snapshot = snapshotSchema.parse(input);
  const columns = columnsFor(snapshot.kind, snapshot.money_places ?? 2, showsLineOrigin(snapshot));
  return columns.map((column) => column.header);
}

export { titles };

/** Exported for tests: the schema 6 commercial terms a snapshot prints, as caption and value. */
export function documentCommercialTerms(input: unknown): [string, string][] {
  return commercialTermsFor(snapshotSchema.parse(input));
}

/** Exported for tests: the totals a snapshot prints, as label and value. */
export function documentTotals(input: unknown): [string, string][] {
  return totalsFor(snapshotSchema.parse(input));
}
