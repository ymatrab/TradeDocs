import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the batch 1 guides hs-vs-hts-vs-schedule-b, landed-cost,
 * shipper-consignee-notify-party, eei-aes-filing-itn, eori-number and how-to-export-from-the-us.
 * Each URL was opened on 2026-10-06 and the cited sentence checked.
 */
export default {
  'w5-ftr-30-1': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.1), via Cornell LII',
    title: '15 CFR § 30.1 — Purpose and definitions',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.1',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the definitions of EEI, the Internal Transaction Number, the ultimate and intermediate consignee, the routed export transaction, the 10-digit Schedule B administered by the Census Bureau and the HTSUSA developed by the USITC for imports',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-ftr-30-3': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.3), via Cornell LII',
    title:
      '15 CFR § 30.3 — Electronic Export Information filer requirements, parties to export transactions, and responsibilities of parties',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.3',
    jurisdiction: 'United States (export reporting)',
    supports:
      'who the USPPI is, that the USPPI or its authorized agent files the EEI, that the filer must be in the United States, and that invoices may not contain everything needed for the EEI',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-ftr-30-4': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.4), via Cornell LII',
    title:
      '15 CFR § 30.4 — Electronic Export Information filing procedures, deadlines, and certification statements',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.4',
    jurisdiction: 'United States (export reporting)',
    supports: 'the predeparture filing deadlines for vessel, air, truck, rail and mail exports',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-ftr-30-6': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.6), via Cornell LII',
    title: '15 CFR § 30.6 — Electronic Export Information data elements',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.6',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the mandatory EEI data elements, including the USPPI, ultimate consignee, country of ultimate destination, commodity classification number, description, quantity, shipping weight, value and licence code',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-ftr-30-7': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.7), via Cornell LII',
    title:
      '15 CFR § 30.7 — Annotating the bill of lading, air waybill, or other commercial loading documents with proof of filing citations, and exemption legends',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.7',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the ITN as the AES confirmation number, given to the exporting carrier and shown on the bill of lading, air waybill or other loading document',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-ftr-30-10': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.10), via Cornell LII',
    title:
      '15 CFR § 30.10 — Retention of export information and the authority to require production of documents',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.10',
    jurisdiction: 'United States (export reporting)',
    supports: 'keeping export shipment documents for five years from the date of export',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-ftr-30-36': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.36), via Cornell LII',
    title: '15 CFR § 30.36 — Exemption for shipments destined to Canada',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.36',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the EEI exemption for exports whose ultimate destination is Canada, and its exceptions for goods stored in or moving through Canada to a third country',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-ftr-30-37': {
    authority: 'U.S. Census Bureau, Foreign Trade Regulations (15 CFR 30.37), via Cornell LII',
    title: '15 CFR § 30.37 — Miscellaneous exemptions',
    url: 'https://www.law.cornell.edu/cfr/text/15/30.37',
    jurisdiction: 'United States (export reporting)',
    supports:
      'the exemption for a Schedule B or HTSUSA line valued at $2,500 or less, applied line by line regardless of the total shipment value',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-census-aes': {
    authority: 'U.S. Census Bureau',
    title: 'Export Filing AES',
    url: 'https://www.census.gov/foreign-trade/aes/index.html',
    jurisdiction: 'United States (export reporting)',
    supports:
      'AES being the export component of ACE, and the ACE AESDirect portal being the primary, free filing tool for EEI',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-census-schedule-b': {
    authority: 'U.S. Census Bureau',
    title: 'Schedule B Search',
    url: 'https://www.census.gov/foreign-trade/schedules/b/index.html',
    jurisdiction: 'United States (export classification)',
    supports: 'the Census Bureau’s Schedule B search tool for finding an export commodity code',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-ita-hs-codes': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Harmonized System (HS) Codes',
    url: 'https://www.trade.gov/harmonized-system-hs-codes',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the six-digit HS administered by the WCO, the 10-digit US numbers (Schedule B for exports, HTS for imports), the first six digits matching, and the uses of the Schedule B number',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-wco-hs': {
    authority: 'World Customs Organization (WCO)',
    title: 'What is the Harmonized System (HS)?',
    url: 'https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx',
    jurisdiction: 'International (HS Convention)',
    supports:
      'the HS as a six-digit nomenclature of more than 5,000 commodity groups, used by more than 200 countries and economies for tariffs and trade statistics',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-bis-classify': {
    authority: 'Bureau of Industry and Security (BIS), U.S. Department of Commerce',
    title: 'Classify your item',
    url: 'https://www.bis.gov/licensing/classify-your-item',
    jurisdiction: 'United States (export controls, EAR)',
    supports:
      'the ECCN as a five-character export control classification unrelated to Schedule B and HTS, and EAR99 items needing a licence only for restricted end users, end uses or destinations',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-ita-csl': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Consolidated Screening List',
    url: 'https://www.trade.gov/consolidated-screening-list',
    jurisdiction: 'United States (export controls)',
    supports:
      'the Consolidated Screening List of parties under US export restrictions, combining Commerce, State and Treasury lists',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-cbp-19-cfr-4-7a': {
    authority: 'U.S. Customs and Border Protection (19 CFR 4.7a), via Cornell LII',
    title: '19 CFR § 4.7a — Inward manifest; information required; alternative forms',
    url: 'https://www.law.cornell.edu/cfr/text/19/4.7a',
    jurisdiction: 'United States (import, vessel cargo)',
    supports:
      'the consignee on a bill of lading as the party the cargo is delivered to, the named party on a to-order bill, and other delivery contacts reported as the notify party',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-usc-19-1401a': {
    authority: 'U.S. Code (19 U.S.C. § 1401a), via Cornell LII',
    title: '19 U.S. Code § 1401a — Value',
    url: 'https://www.law.cornell.edu/uscode/text/19/1401a',
    jurisdiction: 'United States (import valuation)',
    supports:
      'US transaction value as the price paid plus listed additions, with international transportation and insurance excluded from the price actually paid or payable',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-gov-uk-eori': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'EORI number: Who needs an EORI',
    url: 'https://www.gov.uk/eori',
    jurisdiction: 'United Kingdom (customs)',
    supports:
      'who may need a UK EORI number, the personal-goods exception, being established, and appointing someone to deal with customs when not eligible',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-gov-uk-eori-apply': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'EORI number: Apply for an EORI number',
    url: 'https://www.gov.uk/eori/apply-for-eori',
    jurisdiction: 'United Kingdom (customs)',
    supports:
      'what a GB EORI application needs, the number usually issued immediately or within 5 working days, and the XI number for Northern Ireland requiring a GB number first',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w5-ec-eori': {
    authority: 'European Commission, Taxation and Customs Union',
    title: 'Economic operators registration and identification (EORI) number',
    url: 'https://taxation-customs.ec.europa.eu/customs/customs-procedures-import-and-export/customs-operations/economic-operators-registration-and-identification-number-eori_en',
    jurisdiction: 'European Union (customs)',
    supports:
      'the EORI being mandatory for EU customs operations, who needs one, which member state assigns it, its format and no expiry date, and the EU validation service',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
} satisfies Record<string, SourceFields>;
