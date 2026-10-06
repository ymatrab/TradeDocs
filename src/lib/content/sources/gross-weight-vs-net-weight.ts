import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the write-4 articles: how-to-find-hs-code,
 * how-to-ship-internationally-small-business, what-is-a-bill-of-lading,
 * shipping-container-sizes, pallet-sizes and gross-weight-vs-net-weight.
 * Each URL was opened on the retrieval date and checked against the claim in `supports`.
 */
const RETRIEVED = '2026-10-06';
const PENDING = 'pending owner review';

export default {
  'w4-wco-hs': {
    authority: 'World Customs Organization (WCO)',
    title: 'What is the Harmonized System (HS)?',
    url: 'https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx',
    jurisdiction: 'International (HS Convention)',
    supports:
      'the HS as more than 5,000 commodity groups identified by six-digit codes, used by over 200 countries and economies as the basis of their customs tariffs, maintained by the WCO and updated every 5–6 years, with Explanatory Notes as its official interpretation',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-gov-uk-commodity-codes': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Finding commodity codes for imports into or exports out of the UK',
    url: 'https://www.gov.uk/guidance/finding-commodity-codes-for-imports-or-exports',
    jurisdiction: 'United Kingdom',
    supports:
      'using the Trade Tariff tool to find a commodity code, the code setting the duty and import VAT, and only the first six digits being used worldwide with product decisions particular to each country',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-usitc-hts-search': {
    authority: 'U.S. International Trade Commission (USITC)',
    title: 'Harmonized Tariff Schedule search',
    url: 'https://hts.usitc.gov/',
    jurisdiction: 'United States (imports)',
    supports: 'the official online search of the Harmonized Tariff Schedule of the United States',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-census-schedule-b': {
    authority: 'U.S. Census Bureau',
    title: 'Schedule B',
    url: 'https://www.census.gov/foreign-trade/schedules/b/index.html',
    jurisdiction: 'United States (exports)',
    supports:
      'the Schedule B Commodity Search Tool for finding an export commodity code (Schedule B number) and the yearly Schedule B files',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-ecfr-15-cfr-30-6': {
    authority: 'U.S. Census Bureau, via the Electronic Code of Federal Regulations',
    title: '15 CFR 30.6 — Electronic Export Information data elements',
    url: 'https://www.ecfr.gov/current/title-15/section-30.6',
    jurisdiction: 'United States (exports)',
    supports:
      'the EEI reporting the 10-digit Schedule B number, or the 10-digit HTSUSA number except where its headnotes say otherwise, and a commodity description detailed enough to verify it',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-cbp-importer-tips': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Tips for New Importers and Exporters',
    url: 'https://www.cbp.gov/trade/basic-import-export/importer-exporter-tips',
    jurisdiction: 'United States (imports)',
    supports:
      'the HTS as the source of classification numbers and guidelines, written binding rulings under 19 CFR Part 177, and searching earlier rulings in the Customs Rulings Online Search System (CROSS)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-ecfr-19-cfr-177-1': {
    authority: 'U.S. Customs and Border Protection, via the Electronic Code of Federal Regulations',
    title: '19 CFR 177.1 — General ruling practice and definitions',
    url: 'https://www.ecfr.gov/current/title-19/section-177.1',
    jurisdiction: 'United States (imports)',
    supports:
      'rulings being requested in writing for prospective transactions, and oral advice not being binding on CBP',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-trade-gov-export-transaction': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Documents in an Export Transaction',
    url: 'https://www.trade.gov/documents-export-transaction',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the documents varying by destination and shipment, asking the importer what is required, discrepancies causing delays, nonpayment or seizure, and the exporter remaining responsible for the accuracy of documents a forwarder prepares',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-cornell-ucc-1-201': {
    authority: 'Legal Information Institute, Cornell Law School (Uniform Commercial Code)',
    title: 'UCC § 1-201 — General definitions',
    url: 'https://www.law.cornell.edu/ucc/1/1-201',
    jurisdiction: 'United States (state commercial law, uniform text)',
    supports:
      'a bill of lading being a document evidencing the receipt of goods for shipment, and bills of lading being documents of title',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-cornell-49-usc-80103': {
    authority: 'Legal Information Institute, Cornell Law School (U.S. Code)',
    title: '49 U.S.C. § 80103 — Negotiable and nonnegotiable bills',
    url: 'https://www.law.cornell.edu/uscode/text/49/80103',
    jurisdiction: 'United States (bills issued by common carriers, including exports)',
    supports:
      'an order bill being negotiable, a straight bill being nonnegotiable and marked so, and a notify party not limiting negotiability',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-iso-668': {
    authority: 'International Organization for Standardization (ISO)',
    title: 'ISO 668:2020 — Series 1 freight containers: classification, dimensions and ratings',
    url: 'https://www.iso.org/standard/76912.html',
    jurisdiction: 'International standard',
    supports:
      'ISO 668 classifying series 1 containers by external dimensions and ratings, with ISO 1496 as the authority for internal dimensions',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-iso-6780': {
    authority: 'International Organization for Standardization (ISO)',
    title: 'ISO 6780:2003 — Flat pallets for intercontinental materials handling',
    url: 'https://www.iso.org/standard/30524.html',
    jurisdiction: 'International standard',
    supports:
      'ISO 6780 setting the principal dimensions and tolerances of flat pallets for intercontinental handling, confirmed as current in 2026',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-epal-euro-pallet': {
    authority: 'European Pallet Association (EPAL)',
    title: 'EPAL Euro Pallet (EPAL 1)',
    url: 'https://www.epal-pallets.org/eu-en/load-carriers/epal-euro-pallet',
    jurisdiction: 'Industry specification (EPAL licensed pallets)',
    supports:
      'the EPAL 1 pallet measuring 1,200 × 800 × 144 mm, weighing about 25 kg, with a 1,500 kg safe working load and an IPPC heat-treatment mark',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-epal-2-pallet': {
    authority: 'European Pallet Association (EPAL)',
    title: 'EPAL 2 Pallet',
    url: 'https://www.epal-pallets.org/eu-en/load-carriers/epal-2-pallet',
    jurisdiction: 'Industry specification (EPAL licensed pallets)',
    supports:
      'the EPAL 2 pallet measuring 1,200 × 1,000 × 162 mm, weighing about 35 kg, with a 1,250 kg safe working load',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-usda-gma-pallet': {
    authority: 'USDA Forest Service, Research and Development (Treesearch)',
    title:
      'Comparative performance of new, repaired, and remanufactured 48- by 40-inch GMA-style wood pallets',
    url: 'https://research.fs.usda.gov/treesearch/21517',
    jurisdiction: 'United States (research)',
    supports:
      'the 48 × 40 inch GMA-type pallet being the most common wood pallet repaired and remanufactured in the United States',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-ippc-ispm-15': {
    authority: 'International Plant Protection Convention (IPPC), FAO',
    title: 'ISPM 15: Regulation of wood packaging material in international trade',
    url: 'https://www.ippc.int/en/core-activities/standards-setting/ispms/',
    jurisdiction: 'International (phytosanitary standard)',
    supports:
      'ISPM 15 covering wood packaging made from raw wood, including dunnage, and excluding processed wood such as plywood',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w4-imo-solas-vgm': {
    authority: 'International Maritime Organization (IMO)',
    title: 'Verification of the gross mass of a packed container',
    url: 'https://www.imo.org/en/OurWork/Safety/Pages/Verification-of-the-gross-mass.aspx',
    jurisdiction: 'International (SOLAS)',
    supports:
      'SOLAS regulation VI/2 making the shipper responsible for the verified gross mass, the two methods of obtaining it, VGM being a condition for loading, and entry into force on 1 July 2016',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
