import { z } from 'zod';
import { FontSet, Page, PAGE_HEIGHT, PAGE_WIDTH, renderPdf, wrap } from './writer';
import { createFontSet } from './fonts';

/**
 * Renders a stored document snapshot as a PDF.
 *
 * The snapshot is the only input. Nothing is read from the live shipment, so a document
 * produced today and re-rendered next year is identical, which is what makes it usable as
 * evidence rather than a report.
 */

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
  })
  .nullable()
  .optional();

export const snapshotSchema = z.object({
  kind: z.enum([
    'commercial_invoice',
    'proforma_invoice',
    'packing_list',
    'delivery_note',
    'certificate_of_origin',
  ]),
  number: z.string(),
  generated_at: z.string(),
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
    net_weight_kg: numeric,
    gross_weight_kg: numeric,
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
      gross_weight_kg: numeric,
      net_weight_kg: numeric,
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
};

/**
 * The statement of what this document is, and is not. It is rendered on every page of every
 * document type and is deliberately not configurable.
 */
const DISCLOSURE =
  'Prepared with TradeDocs from the shipper’s own data. This document is not issued, ' +
  'endorsed, certified or cleared by any customs authority, carrier or chamber of commerce.';

const MARGIN = 42;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

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

/** Each document type shows the columns its readers need, from one shared set of figures. */
function columnsFor(kind: DocumentSnapshot['kind']): Column[] {
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
  return [
    description,
    hs,
    quantity,
    {
      header: 'Unit price',
      width: 72,
      align: 'right',
      value: (item) => decimal(item.unit_price, 4),
    },
    { header: 'Amount', width: 84, align: 'right', value: (item) => decimal(item.line_total) },
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

export function renderTradeDocument(input: unknown, fonts: FontSet = createFontSet()): Uint8Array {
  const snapshot = snapshotSchema.parse(input);
  const columns = columnsFor(snapshot.kind);
  const fixed = columns.reduce((total, column) => total + column.width, 0);
  const layout = columns.map((column) =>
    column.width === 0 ? { ...column, width: CONTENT_WIDTH - fixed - 24 } : column,
  );

  const pages: Page[] = [];
  let page = new Page(fonts);
  let cursor = 0;

  const startPage = (continued: boolean): void => {
    page = new Page(fonts);
    pages.push(page);
    cursor = PAGE_HEIGHT - MARGIN;

    page.text(titles[snapshot.kind].toUpperCase(), MARGIN, cursor, { size: 16, font: 'bold' });
    page.text(`No. ${snapshot.number}`, PAGE_WIDTH - MARGIN, cursor, { size: 10, align: 'right' });
    cursor -= 14;
    page.text(
      `Shipment ${snapshot.shipment.reference} · revision ${snapshot.shipment.revision} · issued ${snapshot.generated_at.slice(0, 10)}`,
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
  const parties: [string, DocumentSnapshot['exporter']][] = [
    ['Exporter / Consignor', snapshot.exporter],
    ['Consignee', snapshot.consignee],
  ];
  const boxHeight = 78;
  parties.forEach(([caption, party], index) => {
    const x = MARGIN + index * (boxWidth + 10);
    drawBox(page, x, cursor, boxWidth, boxHeight, caption);
    if (party) {
      let lineY = cursor - 24;
      for (const line of partyLines(party)) {
        page.text(line, x + 6, lineY, { size: 8.5 });
        lineY -= 10;
      }
    } else {
      page.text('Not provided', x + 6, cursor - 24, { size: 8.5 });
    }
  });
  cursor -= boxHeight + 10;

  // Shipment terms.
  const terms: [string, string][] = [
    [
      'Incoterm 2020',
      [snapshot.shipment.incoterm, snapshot.shipment.incoterm_place].filter(Boolean).join(' ') ||
        '—',
    ],
    ['Port of loading', snapshot.shipment.port_of_loading || '—'],
    ['Port of discharge', snapshot.shipment.port_of_discharge || '—'],
    ['Country of origin', snapshot.shipment.country_of_origin || '—'],
  ];
  const termWidth = CONTENT_WIDTH / terms.length;
  terms.forEach(([caption, value], index) => {
    const x = MARGIN + index * termWidth;
    drawBox(page, x, cursor, termWidth, 34, caption);
    page.text(value, x + 6, cursor - 24, { size: 8.5 });
  });
  cursor -= 44;

  drawTableHeader();

  for (const item of snapshot.items) {
    const descriptionColumn = layout[0];
    if (!descriptionColumn) break;
    const lines = wrap(fonts, item.description, descriptionColumn.width - 12, 8.5);
    const rowHeight = Math.max(lines.length * 10 + 6, 18);

    // Keep room for the totals block and the disclosure.
    if (cursor - rowHeight < MARGIN + 80) {
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
  }

  // How the goods are packed, on the documents whose readers load and check the truck.
  // Drawn from explicitly described packages; when none were described the document falls
  // back to the per-line carton counts, which is all it ever had.
  const packedOn = snapshot.kind === 'packing_list' || snapshot.kind === 'delivery_note';
  const packing = packedOn ? (snapshot.packages ?? []) : [];

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
      ['Net kg', 45, true],
      ['Gross kg', 50, true],
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

    for (const box of packing) {
      const contents = box.contents ?? [];
      const rowHeight = 14 + contents.length * 9 + (box.marks ? 9 : 0);
      if (cursor - rowHeight < MARGIN + 80) {
        startPage(true);
        packHeader();
      }

      const size =
        box.length_cm != null && box.width_cm != null && box.height_cm != null
          ? `${decimal(box.length_cm, 1)} × ${decimal(box.width_cm, 1)} × ${decimal(box.height_cm, 1)}`
          : '—';
      const values: string[] = [
        `${box.position}. ${box.kind}`,
        decimal(box.package_count, 0),
        size,
        box.volume_m3 == null ? '—' : decimal(box.volume_m3, 3),
        box.net_weight_kg == null ? '—' : decimal(box.net_weight_kg, 3),
        box.gross_weight_kg == null ? '—' : decimal(box.gross_weight_kg, 3),
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
    }
  }

  // Totals. Every document type states the figures its readers reconcile against.
  cursor -= 6;
  const totals: [string, string][] = [['Total quantity', decimal(snapshot.totals.quantity, 3)]];
  if (snapshot.kind === 'packing_list') {
    // Described packages are the measured truth and take precedence; the per-line counts
    // are an estimate that only stands in when nothing was described.
    const packed = packing.length > 0 ? snapshot.packing_totals : undefined;
    totals.push(['Total packages', decimal(packed?.packages ?? snapshot.totals.packages, 0)]);
    totals.push([
      'Total net weight',
      `${decimal(packed?.net_weight_kg ?? snapshot.totals.net_weight_kg, 3)} kg`,
    ]);
    totals.push([
      'Total gross weight',
      `${decimal(packed?.gross_weight_kg ?? snapshot.totals.gross_weight_kg, 3)} kg`,
    ]);
    if (packed && Number(packed.volume_m3) > 0) {
      totals.push(['Total volume', `${decimal(packed.volume_m3, 3)} m³`]);
    }
  }
  if (snapshot.kind === 'commercial_invoice' || snapshot.kind === 'proforma_invoice') {
    totals.push([
      'Total amount',
      `${decimal(snapshot.totals.value)} ${snapshot.shipment.currency}`,
    ]);
  }
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

  if (snapshot.shipment.marks_and_numbers) {
    cursor -= 8;
    page.text('MARKS AND NUMBERS', MARGIN, cursor, { size: 6.5, font: 'bold' });
    cursor -= 10;
    for (const line of wrap(fonts, snapshot.shipment.marks_and_numbers, CONTENT_WIDTH, 8.5)) {
      page.text(line, MARGIN, cursor, { size: 8.5 });
      cursor -= 10;
    }
  }

  // The disclosure and page numbers go on every page, added once the count is known.
  pages.forEach((rendered, index) => {
    let y = MARGIN + 26;
    rendered.line(MARGIN, y + 12, PAGE_WIDTH - MARGIN, y + 12, 0.5, 0.72);
    for (const line of wrap(fonts, DISCLOSURE, CONTENT_WIDTH - 90, 6.5)) {
      rendered.text(line, MARGIN, y, { size: 6.5 });
      y -= 8;
    }
    rendered.text(`Page ${index + 1} of ${pages.length}`, PAGE_WIDTH - MARGIN, MARGIN + 26, {
      size: 6.5,
      align: 'right',
    });
  });

  return renderPdf(pages, fonts);
}

/** Exported for tests: the width a description column receives for a given document type. */
export function descriptionWidth(kind: DocumentSnapshot['kind']): number {
  const columns = columnsFor(kind);
  const fixed = columns.reduce((total, column) => total + column.width, 0);
  return CONTENT_WIDTH - fixed - 24;
}

export { titles };
