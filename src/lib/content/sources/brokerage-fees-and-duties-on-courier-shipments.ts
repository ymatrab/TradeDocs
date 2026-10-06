import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the third writing round (posts: shippers-letter-of-instruction,
 * how-long-does-customs-clearance-take, brokerage-fees-and-duties-on-courier-shipments,
 * duty-vs-tariff, how-to-calculate-import-duty, how-many-pallets-fit-in-a-container).
 * Each URL was opened on the retrieval date and the cited sentence checked.
 */

const RETRIEVED = '2026-10-06';
const PENDING = 'pending owner review';

export default {
  'w3-census-ftr-30-3': {
    authority: 'U.S. Census Bureau, via the Electronic Code of Federal Regulations',
    title:
      '15 CFR 30.3 — EEI filer requirements, parties to export transactions, and their responsibilities',
    url: 'https://www.ecfr.gov/current/title-15/section-30.3',
    jurisdiction: 'United States (exports)',
    supports:
      'the USPPI or its authorized agent filing EEI, the agent needing a power of attorney or written authorization, routed export transactions, and trade terms not deciding the parties to the export',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-census-ftr-30-4': {
    authority: 'U.S. Census Bureau, via the Electronic Code of Federal Regulations',
    title: '15 CFR 30.4 — EEI filing procedures, deadlines, and certification statements',
    url: 'https://www.ecfr.gov/current/title-15/section-30.4',
    jurisdiction: 'United States (exports)',
    supports:
      'predeparture EEI deadlines: 24 hours before loading for vessel cargo and 2 hours before departure for air cargo',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-census-ftr-30-6': {
    authority: 'U.S. Census Bureau, via the Electronic Code of Federal Regulations',
    title: '15 CFR 30.6 — Electronic Export Information data elements',
    url: 'https://www.ecfr.gov/current/title-15/section-30.6',
    jurisdiction: 'United States (exports)',
    supports:
      'the EEI data elements, including ultimate consignee, commodity description, quantity, shipping weight in kilograms and value at the U.S. port of export',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-cbp-19-cfr-142-2': {
    authority: 'U.S. Customs and Border Protection, via the Electronic Code of Federal Regulations',
    title: '19 CFR 142.2 — Time for filing entry',
    url: 'https://www.ecfr.gov/current/title-19/section-142.2',
    jurisdiction: 'United States (imports)',
    supports:
      'entry being made within 15 calendar days after arrival, and entry documents being allowed before arrival',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-cbp-19-cfr-127-1': {
    authority: 'U.S. Customs and Border Protection, via the Electronic Code of Federal Regulations',
    title: '19 CFR 127.1 — Merchandise considered general order merchandise',
    url: 'https://www.ecfr.gov/current/title-19/section-127.1',
    jurisdiction: 'United States (imports)',
    supports:
      'goods going to a general order warehouse at the consignee’s risk and expense when entry is late, duties are unpaid, documents are missing or goods are not correctly invoiced',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-cbp-19-cfr-143-21': {
    authority: 'U.S. Customs and Border Protection, via the Electronic Code of Federal Regulations',
    title: '19 CFR 143.21 — Merchandise eligible for informal entry',
    url: 'https://www.ecfr.gov/current/title-19/section-143.21',
    jurisdiction: 'United States (imports)',
    supports:
      'shipments not exceeding $2,500 in value being eligible for informal entry, with exceptions for certain Chapter 99 articles',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-cbp-19-cfr-152-102': {
    authority: 'U.S. Customs and Border Protection, via the Electronic Code of Federal Regulations',
    title: '19 CFR 152.102 — Definitions (customs valuation)',
    url: 'https://www.ecfr.gov/current/title-19/section-152.102',
    jurisdiction: 'United States (imports)',
    supports:
      'the price actually paid or payable excluding international transportation and insurance to the place of importation in the United States',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-cbp-importer-tips': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Importer/Exporter Tips',
    url: 'https://www.cbp.gov/trade/basic-import-export/importer-exporter-tips',
    jurisdiction: 'United States (imports)',
    supports:
      'CBP’s right to examine shipments, the importer bearing exam-related costs, customs brokers being licensed by CBP, the importer of record staying responsible for the entry and duties, and the Importer Security Filing for vessel cargo',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-cbp-duty-rates': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Determining Duty Rates',
    url: 'https://www.cbp.gov/trade/programs-administration/determining-duty-rates',
    jurisdiction: 'United States (imports)',
    supports:
      'the HTS giving duty rates, the USITC tariff database giving an approximate rate, CBP making the final determination, and binding rulings',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-wto-tariffs': {
    authority: 'World Trade Organization (WTO)',
    title: 'Tariffs',
    url: 'https://www.wto.org/english/tratop_e/tariffs_e/tariffs_e.htm',
    jurisdiction: 'International (WTO members)',
    supports:
      'customs duties on merchandise imports being called tariffs, and bound rates versus applied rates',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-wto-tariff-data': {
    authority: 'World Trade Organization (WTO)',
    title: 'Tariff and trade data',
    url: 'https://www.wto.org/english/tratop_e/tariffs_e/tariff_data_e.htm',
    jurisdiction: 'International (WTO members)',
    supports:
      'the WTO’s definitions of ad valorem, applied, bound and MFN tariffs and of a tariff line',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-wco-hs': {
    authority: 'World Customs Organization (WCO)',
    title: 'What is the Harmonized System (HS)?',
    url: 'https://www.wcoomd.org/en/topics/nomenclature/overview/what-is-the-harmonized-system.aspx',
    jurisdiction: 'International (HS Convention)',
    supports:
      'the HS six-digit codes and more than 200 countries and economies using it as the basis of their customs tariffs',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-hmrc-delivery-costs': {
    authority: 'HM Revenue & Customs (GOV.UK)',
    title: 'Delivery costs to include in the customs value',
    url: 'https://www.gov.uk/guidance/delivery-costs-to-include-in-the-customs-value',
    jurisdiction: 'United Kingdom (imports)',
    supports:
      'transport, insurance and related costs up to the place of introduction into the UK being included in the customs value',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-epal-euro-pallet': {
    authority: 'European Pallet Association (EPAL)',
    title: 'EPAL Euro Pallet',
    url: 'https://www.epal-pallets.org/eu-en/load-carriers/epal-euro-pallet',
    jurisdiction: 'Pallet standard (EPAL licensed pallets)',
    supports:
      'the EPAL Euro pallet measuring 1,200 × 800 × 144 mm with a 1,500 kg safe working load',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'w3-epal-2-pallet': {
    authority: 'European Pallet Association (EPAL)',
    title: 'EPAL 2 Pallet',
    url: 'https://www.epal-pallets.org/eu-en/load-carriers/epal-2-pallet',
    jurisdiction: 'Pallet standard (EPAL licensed pallets)',
    supports:
      'the EPAL 2 pallet measuring 1,200 × 1,000 × 162 mm with a 1,250 kg safe working load',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
