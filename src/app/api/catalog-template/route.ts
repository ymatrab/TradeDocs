import { toCsv } from '@/lib/csv';

/**
 * A starting file for a catalog import, generated from the columns the importer actually
 * reads so the two cannot drift apart. The example row is filled in because an empty
 * template leaves the operator guessing at the format of an HS code or a weight.
 */
const HEADINGS = [
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

const EXAMPLES = [
  [
    'A-100',
    'Cotton tea towel, 50 x 70 cm',
    '630260',
    'IN',
    'pcs',
    '2.40',
    '0.12',
    '0.14',
    'carton',
  ],
  [
    'A-101',
    'Cotton tea towel, 40 x 60 cm',
    '630260',
    'IN',
    'pcs',
    '1.95',
    '0.09',
    '0.11',
    'carton',
  ],
  [
    'B-220',
    'Ceramic mug, 350 ml, printed',
    '691200',
    'PT',
    'pcs',
    '3.10',
    '0.31',
    '0.38',
    'carton',
  ],
] as const;

export function GET() {
  const body = toCsv(
    HEADINGS,
    EXAMPLES.map((row) => [...row]),
  );

  // U+FEFF: without it Excel reads the file as its local codepage and mangles accents.
  return new Response(`\uFEFF${body}`, {
    headers: {
      // The BOM above makes Excel open a UTF-8 file without mangling accented names.
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="tradedocs-catalog-template.csv"',
      'cache-control': 'public, max-age=3600',
    },
  });
}
