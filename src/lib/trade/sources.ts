/**
 * The sources behind the public trade tools and references.
 *
 * One registry, so every page that states a rule, a divisor or a capacity cites the same
 * record, and a review updates every page at once. Each URL was opened and checked against
 * the claim it supports on the retrieval date. `reviewer` stays "pending owner review" until
 * a named person has checked the record; that is not an approval and must not be shown as one.
 *
 * Pages render these through the tools' SourcesBlock; nothing here is fetched at runtime.
 */

export type SourceId =
  | 'icc-incoterms-2020'
  | 'iata-volumetric'
  | 'dhl-express-volumetric'
  | 'fedex-dimensional'
  | 'ups-dimensional'
  | 'maersk-dry-containers'
  | 'us-cbp-invoice-contents'
  | 'eu-union-customs-code';

export type SourceRecord = {
  id: SourceId;
  authority: string;
  title: string;
  url: string;
  jurisdiction: string;
  /** What this source is cited for, in a phrase. */
  supports: string;
  /** ISO date the URL was opened and checked against the claim. */
  retrieved: string;
  reviewer: string;
};

const RETRIEVED = '2026-10-05';
const PENDING = 'pending owner review';

export const SOURCES: Record<SourceId, SourceRecord> = {
  'icc-incoterms-2020': {
    id: 'icc-incoterms-2020',
    authority: 'International Chamber of Commerce (ICC)',
    title: 'Incoterms® 2020',
    url: 'https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/',
    jurisdiction: 'International (contractual rules, not law)',
    supports: 'the eleven rules, their delivery points and the 2020 changes',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'iata-volumetric': {
    id: 'iata-volumetric',
    authority: 'International Air Transport Association (IATA)',
    title: 'Air cargo tariffs and rules: what you need to know',
    url: 'https://www.iata.org/en/publications/newsletters/iata-knowledge-hub/air-cargo-tariffs-and-rules-what-you-need-to-know/',
    jurisdiction: 'International air cargo',
    supports: 'the general 6,000 cm³ per kilogram volumetric rule for air freight',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'dhl-express-volumetric': {
    id: 'dhl-express-volumetric',
    authority: 'DHL',
    title: 'Actual weight vs volumetric weight explained',
    url: 'https://www.dhl.com/discover/en-id/logistics-advice/logistics-insights/decoding-shipping-costs-actual-weight-vs-volumetric-weight',
    jurisdiction: 'Carrier practice (DHL Express)',
    supports: 'DHL Express dividing by 5,000 for volumetric weight',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'fedex-dimensional': {
    id: 'fedex-dimensional',
    authority: 'FedEx',
    title: 'How do I calculate dimensional weight of a package?',
    url: 'https://www.fedex.com/en-jp/customer-support/faq/invoices-and-payments/fees-and-charges/calculate-dimensional-weight.html',
    jurisdiction: 'Carrier practice (FedEx international)',
    supports: 'FedEx dividing by 5,000 for dimensional weight in centimetres',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'ups-dimensional': {
    id: 'ups-dimensional',
    authority: 'UPS',
    title: 'Shipping dimensions and weight',
    url: 'https://www.ups.com/gb/en/support/shipping-support/shipping-dimensions-weight',
    jurisdiction: 'Carrier practice (UPS, United Kingdom site)',
    supports: 'UPS dividing by 5,000 for dimensional weight in centimetres',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'maersk-dry-containers': {
    id: 'maersk-dry-containers',
    authority: 'Maersk',
    title: 'Our fleet — dry container equipment specifications (PDF)',
    url: 'https://www.maersk.com/~/media_sc9/maersk/local-information/files/africa/south-africa/important-information/container-type-and-sizes/dry-equipment-specifications-updated.pdf',
    jurisdiction: 'Carrier equipment (one carrier’s fleet; other carriers differ)',
    supports: 'typical internal volumes and maximum payloads of dry containers',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'us-cbp-invoice-contents': {
    id: 'us-cbp-invoice-contents',
    authority: 'U.S. Customs and Border Protection, via the Electronic Code of Federal Regulations',
    title: '19 CFR 141.86 — Contents of invoices and general requirements',
    url: 'https://www.ecfr.gov/current/title-19/chapter-I/part-141/subpart-F/section-141.86',
    jurisdiction: 'United States (imports)',
    supports: 'the information a commercial invoice for a U.S. import must state',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'eu-union-customs-code': {
    id: 'eu-union-customs-code',
    authority: 'European Commission, Taxation and Customs Union',
    title: 'Union Customs Code (UCC)',
    url: 'https://taxation-customs.ec.europa.eu/customs-4/union-customs-code_en',
    jurisdiction: 'European Union',
    supports: 'the EU customs framework and its guidance documents',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
};

/** Sources cited on each public page, in the order they are listed. */
export const PAGE_SOURCES = {
  incoterms: ['icc-incoterms-2020'],
  cbm: ['maersk-dry-containers'],
  chargeableWeight: [
    'iata-volumetric',
    'dhl-express-volumetric',
    'fedex-dimensional',
    'ups-dimensional',
  ],
  invoice: ['us-cbp-invoice-contents', 'eu-union-customs-code', 'icc-incoterms-2020'],
} as const satisfies Record<string, readonly SourceId[]>;

export function sourcesFor(ids: readonly SourceId[]): SourceRecord[] {
  return ids.map((id) => SOURCES[id]);
}

/** The latest retrieval date among a set of sources, for the "last reviewed" line. */
export function lastReviewed(records: readonly SourceRecord[]): string {
  return records.reduce(
    (latest, record) => (record.retrieved > latest ? record.retrieved : latest),
    '',
  );
}
