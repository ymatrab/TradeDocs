/**
 * The sources behind the public trade tools and references.
 *
 * One registry, so every page that states a rule, a divisor or a capacity cites the same
 * record, and a review updates every page at once. Each URL was opened and checked against
 * the claim it supports on the retrieval date. `reviewer` stays "pending owner review" until
 * a named person has checked the record; that is not an approval and must not be shown as one.
 *
 * Pages render these through the tools' SourcesBlock; nothing here is fetched at runtime.
 *
 * Two parts, merged into one SOURCES map: the core records below (tools and the first
 * articles), and the per-article files in lib/content/sources/<slug>.ts, so writers adding
 * sources in parallel never edit this file. An id may be defined only once across both.
 */

import { ARTICLE_SOURCE_FILES, type ArticleSourceId } from '@/lib/content/sources';

export type CoreSourceId =
  | 'icc-incoterms-2020'
  | 'iata-volumetric'
  | 'dhl-express-volumetric'
  | 'fedex-dimensional'
  | 'ups-dimensional'
  | 'maersk-dry-containers'
  | 'us-cbp-invoice-contents'
  | 'eu-union-customs-code'
  | 'us-cbp-proforma-invoice'
  | 'trade-gov-proforma-invoice'
  | 'trade-gov-commercial-invoice'
  | 'trade-gov-packing-list'
  | 'nist-si-volume'
  | 'nist-si-mass'
  | 'nist-si-volume-units'
  | 'maersk-fcl-lcl'
  | 'wto-customs-valuation'
  | 'trade-gov-export-documents'
  | 'usitc-hts-search'
  | 'uk-trade-tariff-api'
  | 'gov-uk-finding-commodity-codes'
  | 'cbp-rulings'
  | 'trade-gov-csl'
  | 'trade-gov-csl-api'
  | 'imo-msc1-circ1475';

export type SourceId = CoreSourceId | ArticleSourceId;

/** A source as a per-article file writes it; the map key becomes its id. */
export type SourceFields = {
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

export type SourceRecord = SourceFields & { id: SourceId };

const RETRIEVED = '2026-10-05';
/** The blog round: sources first cited by the blog posts. */
const RETRIEVED_BLOG = '2026-10-06';
/**
 * The tools rounds: the unit converter, container loading calculator and delivery note, then
 * the CBM-to-cubic-feet converter and the pallet calculator.
 */
const RETRIEVED_TOOLS = '2026-10-07';
/** The HS code lookup and denied-party screening round (D-025). */
const RETRIEVED_LOOKUPS = '2026-10-09';
/** The VGM declaration (D-025): the IMO guidelines it prints. */
const RETRIEVED_VGM = '2026-10-09';
const PENDING = 'pending owner review';

const CORE_SOURCES: Record<CoreSourceId, SourceRecord> = {
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
  'us-cbp-proforma-invoice': {
    id: 'us-cbp-proforma-invoice',
    authority: 'U.S. Customs and Border Protection, via the Electronic Code of Federal Regulations',
    title: '19 CFR 141.85 — Pro forma invoice',
    url: 'https://www.ecfr.gov/current/title-19/chapter-I/part-141/subpart-F/section-141.85',
    jurisdiction: 'United States (imports)',
    supports:
      'the importer’s pro forma invoice filed when the commercial invoice is not available at entry',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'trade-gov-proforma-invoice': {
    id: 'trade-gov-proforma-invoice',
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Pro Forma Invoice',
    url: 'https://www.trade.gov/pro-forma-invoice',
    jurisdiction: 'United States (export guidance)',
    supports: 'what a proforma invoice is for and the details it usually carries',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'trade-gov-commercial-invoice': {
    id: 'trade-gov-commercial-invoice',
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Export Documentation: Commercial Invoice',
    url: 'https://www.trade.gov/commercial-invoice',
    jurisdiction: 'United States (export guidance)',
    supports: 'the commercial invoice as the document customs assesses duties and taxes from',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'trade-gov-packing-list': {
    id: 'trade-gov-packing-list',
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Export Documentation: Packing List',
    url: 'https://www.trade.gov/packing-list',
    jurisdiction: 'United States (export guidance)',
    supports: 'what a packing list itemises and who relies on it',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'nist-si-volume': {
    id: 'nist-si-volume',
    authority: 'National Institute of Standards and Technology (NIST)',
    title: 'NIST Guide to the SI, Appendix B.9: factors for units listed by kind of quantity',
    url: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9',
    jurisdiction: 'International (SI unit conversion)',
    supports: 'one cubic foot being 0.028 316 85 cubic metres',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'nist-si-mass': {
    id: 'nist-si-mass',
    authority: 'National Institute of Standards and Technology (NIST)',
    title: 'NIST Guide to the SI, Appendix B.9: factors for units listed by kind of quantity',
    url: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9',
    jurisdiction: 'International (SI unit conversion)',
    supports: 'one pound (avoirdupois) being 0.453 592 4 kilograms',
    retrieved: RETRIEVED_TOOLS,
    reviewer: PENDING,
  },
  'nist-si-volume-units': {
    id: 'nist-si-volume-units',
    authority: 'National Institute of Standards and Technology (NIST)',
    title: 'NIST Guide to the SI, Appendix B.9: factors for units listed by kind of quantity',
    url: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9',
    jurisdiction: 'International (SI unit conversion)',
    supports:
      'one cubic inch being 1.638 706 E-05 cubic metres and one litre being exactly 1.0 E-03 cubic metres',
    retrieved: RETRIEVED_TOOLS,
    reviewer: PENDING,
  },
  'maersk-fcl-lcl': {
    id: 'maersk-fcl-lcl',
    authority: 'Maersk',
    title: 'FCL vs LCL shipping: deciding the best fit for your shipment',
    url: 'https://www.maersk.com/logistics-explained/transportation-and-freight/2023/12/15/understanding-ocean-freight',
    jurisdiction: 'Carrier practice (one carrier; others differ)',
    supports: 'how LCL and FCL bookings differ and LCL being charged on the cubic metres used',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'wto-customs-valuation': {
    id: 'wto-customs-valuation',
    authority: 'World Trade Organization (WTO)',
    title: 'Customs valuation — technical information',
    url: 'https://www.wto.org/english/tratop_e/cusval_e/cusval_info_e.htm',
    jurisdiction: 'International (WTO Customs Valuation Agreement)',
    supports:
      'transaction value as the main basis of customs value, and freight and insurance being added where a member values on a CIF basis',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'trade-gov-export-documents': {
    id: 'trade-gov-export-documents',
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Common Export Documents',
    url: 'https://www.trade.gov/common-export-documents',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the documents a typical export uses, the bill of lading as the carrier contract, and Electronic Export Information being filed in AES when a Schedule B line is over $2,500 or another mandatory filing requirement applies',
    retrieved: RETRIEVED_BLOG,
    reviewer: PENDING,
  },
  'usitc-hts-search': {
    id: 'usitc-hts-search',
    authority: 'U.S. International Trade Commission (USITC)',
    title: 'Harmonized Tariff Schedule of the United States — HTS search',
    url: 'https://hts.usitc.gov/',
    jurisdiction: 'United States (imports)',
    supports:
      'the HTS numbers and article descriptions the lookup searches live through the public REST search at hts.usitc.gov/reststop/search',
    retrieved: RETRIEVED_LOOKUPS,
    reviewer: PENDING,
  },
  'uk-trade-tariff-api': {
    id: 'uk-trade-tariff-api',
    authority: 'HM Revenue & Customs, GOV.UK Trade Tariff',
    title: 'Using the Trade Tariff API',
    url: 'https://docs.trade-tariff.service.gov.uk/the-trade-tariff-api.html',
    jurisdiction: 'United Kingdom (imports and exports)',
    supports:
      'the public read endpoints the lookup calls without credentials, with the v2 Accept header, and caching responses because the data changes daily',
    retrieved: RETRIEVED_LOOKUPS,
    reviewer: PENDING,
  },
  'gov-uk-finding-commodity-codes': {
    id: 'gov-uk-finding-commodity-codes',
    authority: 'HM Revenue & Customs, GOV.UK',
    title: 'Finding commodity codes for imports or exports',
    url: 'https://www.gov.uk/guidance/finding-commodity-codes-for-imports-or-exports',
    jurisdiction: 'United Kingdom',
    supports: 'the trader being the one who must find the right commodity code for the goods',
    retrieved: RETRIEVED_LOOKUPS,
    reviewer: PENDING,
  },
  'cbp-rulings': {
    id: 'cbp-rulings',
    authority: 'U.S. Customs and Border Protection',
    title: 'Rulings',
    url: 'https://www.cbp.gov/trade/rulings',
    jurisdiction: 'United States (imports)',
    supports: 'binding advance rulings on the tariff classification of merchandise',
    retrieved: RETRIEVED_LOOKUPS,
    reviewer: PENDING,
  },
  'trade-gov-csl': {
    id: 'trade-gov-csl',
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Consolidated Screening List',
    url: 'https://www.trade.gov/consolidated-screening-list',
    jurisdiction: 'United States (export controls and sanctions)',
    supports:
      'the CSL consolidating the Commerce, State and Treasury screening lists, its use as an aid to screening, and further due diligence and the official lists being needed when a party appears to match',
    retrieved: RETRIEVED_LOOKUPS,
    reviewer: PENDING,
  },
  'trade-gov-csl-api': {
    id: 'trade-gov-csl-api',
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'ITA developer portal — Consolidated Screening List API',
    url: 'https://developer.trade.gov/',
    jurisdiction: 'United States (export controls and sanctions)',
    supports:
      'the CSL search API at data.trade.gov/consolidated_screening_list/v1/search, which needs a subscription key from a registered application',
    retrieved: RETRIEVED_LOOKUPS,
    reviewer: PENDING,
  },
  'imo-msc1-circ1475': {
    id: 'imo-msc1-circ1475',
    authority: 'International Maritime Organization (IMO)',
    title:
      'MSC.1/Circ.1475: Guidelines regarding the verified gross mass of a container carrying cargo (PDF)',
    url: 'https://wwwcdn.imo.org/localresources/en/OurWork/Safety/Documents/MSC.1%20Circ.1475.pdf',
    jurisdiction: 'International (SOLAS chapter VI, regulation 2)',
    supports:
      'the VGM declaration: Method No. 1 (weighing the packed and sealed container) and Method No. 2 (weighing all packages and cargo items with pallets, dunnage and securing material and adding the container tare, under a certified method) in paragraph 5.1, the verified gross mass communicated in a shipping document that may be part of the shipping instructions (6.1), and the document signed by a person duly authorized by the shipper, by electronic signature or the name in capitals (6.2)',
    retrieved: RETRIEVED_VGM,
    reviewer: PENDING,
  },
};

/**
 * Merges per-article source files into the core records. A repeated id would silently
 * replace another record's URL on every page that cites it, so it stops the build instead.
 */
export function mergeSourceFiles(
  core: Readonly<Record<string, SourceRecord>>,
  files: readonly Readonly<Record<string, SourceFields>>[],
): Record<string, SourceRecord> {
  const merged: Record<string, SourceRecord> = { ...core };
  for (const file of files) {
    for (const [id, fields] of Object.entries(file)) {
      if (id in merged) throw new Error(`Source id "${id}" is defined more than once.`);
      merged[id] = { ...fields, id: id as SourceId };
    }
  }
  return merged;
}

const MERGED_SOURCES = mergeSourceFiles(CORE_SOURCES, ARTICLE_SOURCE_FILES);

export const SOURCES = MERGED_SOURCES as Record<SourceId, SourceRecord>;

/** Ids of the core records, for the registry checks. */
export const CORE_SOURCE_IDS = Object.keys(CORE_SOURCES) as CoreSourceId[];

/** Sources cited on each public page, in the order they are listed. */
export const PAGE_SOURCES = {
  incoterms: ['icc-incoterms-2020'],
  cbm: ['maersk-dry-containers', 'nist-si-volume'],
  chargeableWeight: [
    'iata-volumetric',
    'dhl-express-volumetric',
    'fedex-dimensional',
    'ups-dimensional',
  ],
  invoice: [
    'us-cbp-invoice-contents',
    'trade-gov-commercial-invoice',
    'eu-union-customs-code',
    'icc-incoterms-2020',
  ],
  proforma: ['trade-gov-proforma-invoice', 'us-cbp-proforma-invoice', 'icc-incoterms-2020'],
  packingList: ['trade-gov-packing-list', 'trade-gov-commercial-invoice'],
  landedCost: ['wto-customs-valuation', 'icc-incoterms-2020'],
  exportPrice: ['icc-incoterms-2020', 'wto-customs-valuation'],
  containerLoading: ['maersk-dry-containers'],
  unitConverter: ['nist-si-volume', 'nist-si-mass'],
  deliveryNote: ['trade-gov-export-documents', 'trade-gov-packing-list'],
  cbmToCubicFeet: ['nist-si-volume', 'nist-si-volume-units', 'maersk-dry-containers'],
  hsCodeLookup: [
    'usitc-hts-search',
    'uk-trade-tariff-api',
    'gov-uk-finding-commodity-codes',
    'cbp-rulings',
  ],
  deniedPartyScreening: ['trade-gov-csl', 'trade-gov-csl-api'],
  palletCalculator: [
    'w4-iso-6780',
    'w4-epal-euro-pallet',
    'w4-epal-2-pallet',
    'w4-usda-gma-pallet',
    'w4-ippc-ispm-15',
  ],
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
