/**
 * CSV reading for catalog imports.
 *
 * Written out rather than taken from a dependency because the failure mode matters more
 * than the feature set: a product description containing a comma, a quoted legal name, or
 * a file saved by Excel with a UTF-8 BOM and CRLF endings must not silently shift every
 * column by one. Splitting on commas gets all three wrong.
 */

/** Column names this importer understands, mapped from the headings people actually type. */
const SYNONYMS: Record<string, string> = {
  sku: 'sku',
  code: 'sku',
  'article number': 'sku',
  'item code': 'sku',
  'product code': 'sku',
  reference: 'sku',
  description: 'description',
  product: 'description',
  'product name': 'description',
  name: 'description',
  goods: 'description',
  'hs code': 'hs_code',
  hs: 'hs_code',
  hscode: 'hs_code',
  'tariff code': 'hs_code',
  'commodity code': 'hs_code',
  origin: 'country_of_origin',
  'country of origin': 'country_of_origin',
  country: 'country_of_origin',
  unit: 'unit',
  uom: 'unit',
  'unit of measure': 'unit',
  price: 'unit_price',
  'unit price': 'unit_price',
  'unit value': 'unit_price',
  value: 'unit_price',
  'net weight': 'net_weight_kg',
  'net weight kg': 'net_weight_kg',
  net: 'net_weight_kg',
  'gross weight': 'gross_weight_kg',
  'gross weight kg': 'gross_weight_kg',
  gross: 'gross_weight_kg',
  package: 'package_kind',
  'package kind': 'package_kind',
  packaging: 'package_kind',
};

export const IMPORT_COLUMNS = [
  'sku',
  'description',
  'hs_code',
  'country_of_origin',
  'unit',
  'unit_price',
  'net_weight_kg',
  'gross_weight_kg',
  'package_kind',
] as const;

export type ImportColumn = (typeof IMPORT_COLUMNS)[number];
export type ImportRow = Partial<Record<ImportColumn, string>>;

/**
 * Splits CSV text into rows of fields, honouring quoted fields, escaped quotes and
 * newlines inside quotes. Accepts CRLF, LF and a leading BOM.
 */
export function parseDelimited(text: string, delimiter = ','): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  // Excel writes a BOM; left in place it becomes part of the first heading and that
  // heading then matches nothing.
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (quoted) {
      if (char === '"') {
        if (source[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"' && field === '') {
      quoted = true;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      // A CRLF is one break, not two.
      if (char === '\r' && source[index + 1] === '\n') index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // A trailing newline is punctuation, not an empty product.
  return rows.filter((entry) => entry.some((value) => value.trim() !== ''));
}

/**
 * Picks the delimiter the file actually uses. Exports from a spreadsheet in a locale that
 * uses the comma as a decimal separator are semicolon-delimited, and guessing wrong turns
 * every row into a single unusable column.
 */
export function detectDelimiter(text: string): string {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const counts = [',', ';', '\t'].map(
    (candidate) => [candidate, firstLine.split(candidate).length - 1] as const,
  );
  const best = counts.reduce((winner, entry) => (entry[1] > winner[1] ? entry : winner));
  return best[1] > 0 ? best[0] : ',';
}

function normalizeHeading(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\-.]+/g, ' ')
    .replace(/\((kg|kgs)\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export type ParsedImport = {
  rows: ImportRow[];
  /** Headings present in the file that this importer does not use. */
  ignored: string[];
  /** True when no column could be matched to a description. */
  missingDescription: boolean;
};

/**
 * Reads a catalog file into rows keyed by the columns the importer understands.
 *
 * Headings are matched leniently — an operator exporting from their own system should not
 * have to rename columns to match ours — but an unmatched heading is reported rather than
 * dropped silently, because a column quietly ignored is data the user believes was imported.
 */
export function parseCatalog(text: string): ParsedImport {
  const table = parseDelimited(text, detectDelimiter(text));
  if (table.length === 0) return { rows: [], ignored: [], missingDescription: true };

  const headings = table[0].map(normalizeHeading);
  const mapped = headings.map((heading) => SYNONYMS[heading]);
  const ignored = headings.filter((heading, index) => heading !== '' && !mapped[index]);

  if (!mapped.includes('description')) {
    return { rows: [], ignored, missingDescription: true };
  }

  const rows = table.slice(1).map((cells) => {
    const row: ImportRow = {};
    mapped.forEach((column, index) => {
      if (!column) return;
      const value = (cells[index] ?? '').trim();
      if (value !== '') row[column as ImportColumn] = value;
    });
    return row;
  });

  return { rows: rows.filter((row) => (row.description ?? '') !== ''), ignored, missingDescription: false };
}

/**
 * Normalizes a number as typed. Accepts "1.234,56" and "1,234.56" by treating whichever
 * separator appears last as the decimal point, and strips spaces and currency symbols.
 * Returns null when the text is not a number at all, so the caller reports the row.
 */
export function readDecimal(value: string | undefined): string | null {
  if (value === undefined) return null;
  const cleaned = value.replace(/[^\d.,-]/g, '').trim();
  if (cleaned === '') return null;

  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');
  let normalized: string;

  if (lastComma === -1 && lastDot === -1) {
    normalized = cleaned;
  } else if (lastComma > lastDot) {
    normalized = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    normalized = cleaned.replace(/,/g, '');
  }

  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;
  return normalized;
}

/** Renders rows back to CSV, quoting only what needs it. */
export function toCsv(headings: readonly string[], rows: readonly (readonly string[])[]): string {
  const cell = (value: string) =>
    /["\n\r,]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  return [headings, ...rows].map((row) => row.map(cell).join(',')).join('\r\n');
}
