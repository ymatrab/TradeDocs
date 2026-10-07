import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources for the wave A guides (writer a4): what-is-a-proforma-invoice, how-to-import-into-the-us,
 * cmr-note, air-waybill and export-payment-terms. One file for the five guides, ids prefixed `a4-`.
 */
const RETRIEVED = '2026-10-07';
const PENDING = 'pending owner review';

export default {
  'a4-cbp-importer-tips': {
    authority: 'U.S. Customs and Border Protection (CBP)',
    title: 'Tips for New Importers and Exporters',
    url: 'https://www.cbp.gov/trade/basic-import-export/importer-exporter-tips',
    jurisdiction: 'United States (imports)',
    supports:
      'CBP not requiring an import licence while other agencies may, the importer number being an IRS business registration number or a social security number, and the Importer Security Filing for vessel cargo',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a4-cfr-19-142-3': {
    authority: 'U.S. Customs and Border Protection, via the Legal Information Institute (Cornell)',
    title: '19 CFR 142.3 — Entry documentation required',
    url: 'https://www.law.cornell.edu/cfr/text/19/142.3',
    jurisdiction: 'United States (imports)',
    supports:
      'the entry documents: CBP Form 3461 or its electronic equivalent, evidence of the right to make entry, a commercial invoice (or a pro forma invoice where 141.83(d) allows), a packing list where appropriate, and other agencies’ documents',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a4-cfr-19-142-4': {
    authority: 'U.S. Customs and Border Protection, via the Legal Information Institute (Cornell)',
    title: '19 CFR 142.4 — Bond requirements at the time of entry',
    url: 'https://www.law.cornell.edu/cfr/text/19/142.4',
    jurisdiction: 'United States (imports)',
    supports:
      'goods not being released at entry unless a single entry or continuous bond on CBP Form 301 has been filed, with stated exceptions',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a4-cfr-19-142-12': {
    authority: 'U.S. Customs and Border Protection, via the Legal Information Institute (Cornell)',
    title: '19 CFR 142.12 — Entry summary documentation',
    url: 'https://www.law.cornell.edu/cfr/text/19/142.12',
    jurisdiction: 'United States (imports)',
    supports:
      'the entry summary being filed, with estimated duties attached, within 10 working days after the time of entry',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a4-cfr-19-149-2': {
    authority: 'U.S. Customs and Border Protection, via the Legal Information Institute (Cornell)',
    title: '19 CFR 149.2 — Importer Security Filing requirement',
    url: 'https://www.law.cornell.edu/cfr/text/19/149.2',
    jurisdiction: 'United States (imports by vessel)',
    supports:
      'the ISF importer or its agent submitting the Importer Security Filing no later than 24 hours before the cargo is laden aboard the vessel at the foreign port',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a4-cmr-convention': {
    authority:
      'UN Economic Commission for Europe CMR Convention, as scheduled to the UK Carriage of Goods by Road Act 1965 (legislation.gov.uk)',
    title: 'Convention on the Contract for the International Carriage of Goods by Road (CMR)',
    url: 'https://www.legislation.gov.uk/ukpga/1965/37/schedule',
    jurisdiction: 'International road carriage between contracting countries',
    supports:
      'the Convention’s scope and exclusions, the consignment note being made out in three signed originals, its required particulars (Article 6), its evidential value (Article 9), the sender’s responsibility for inaccurate particulars (Article 7), the per-kilogram liability limit and higher declared value (Articles 23 and 24), notice periods for damage and delay (Article 30) and the limitation period (Article 32)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a4-gov-uk-e-cmr-protocol': {
    authority: 'Foreign & Commonwealth Office (GOV.UK)',
    title:
      'Additional Protocol to the CMR Convention concerning the Electronic Consignment Note [MS No.26/2019]',
    url: 'https://www.gov.uk/government/publications/additional-protocol-to-the-convention-on-the-contract-for-the-international-carriage-of-goods-by-road-cmr-concerning-the-electronic-consignment-note',
    jurisdiction: 'International road carriage (UK treaty publication)',
    supports:
      'the existence of an Additional Protocol to the CMR Convention for an electronic consignment note, laid before the UK Parliament in July 2019',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a4-iata-e-awb': {
    authority: 'International Air Transport Association (IATA)',
    title: 'Electronic air waybill (e-AWB)',
    url: 'https://www.iata.org/en/programs/cargo/e/eawb/',
    jurisdiction: 'International air cargo (industry practice)',
    supports:
      'the air waybill being the contract of carriage between shipper and airline, and the Multilateral e-AWB Agreement (IATA Resolution 672) removing the need for a paper air waybill',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a4-montreal-convention': {
    authority:
      'Montreal Convention 1999, as scheduled to the UK Carriage by Air Act 1961 (legislation.gov.uk)',
    title: 'Convention for the Unification of Certain Rules for International Carriage by Air',
    url: 'https://www.legislation.gov.uk/ukpga/Eliz2/9-10/27/schedule/1B',
    jurisdiction: 'International carriage by air between states party to the Convention',
    supports:
      'an air waybill being delivered for cargo or replaced by another record (Article 4), its minimum contents (Article 5), the three original parts (Article 7), its evidential value (Article 11) and the per-kilogram liability limit (Article 22)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a4-trade-gov-methods-of-payment': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Trade Finance Guide: Methods of Payment',
    url: 'https://www.trade.gov/methods-payment',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the five methods of payment (cash in advance, letter of credit, documentary collection, open account, consignment) and the risk each puts on the exporter and the importer, and open account terms of typically 30, 60 or 90 days',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a4-trade-gov-letter-of-credit': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Letter of Credit',
    url: 'https://www.trade.gov/letter-credit',
    jurisdiction: 'United States (export guidance)',
    supports:
      'a letter of credit as the buyer’s bank’s commitment to pay against the required documents, the documents being detailed and prone to discrepancies, bank fees, and when an LC is recommended',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a4-trade-gov-documentary-collections': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Documentary Collections',
    url: 'https://www.trade.gov/documentary-collections',
    jurisdiction: 'United States (export guidance)',
    supports:
      'banks exchanging shipping documents for payment, D/P and D/A, banks not verifying documents or guaranteeing payment, and the exporter’s options if the buyer does not pay',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a4-icc-documentary-credits': {
    authority: 'International Chamber of Commerce (ICC Academy)',
    title: 'Documentary credits: rules, guidelines and terminology',
    url: 'https://academy.iccwbo.org/documentary-credits-rules-guidelines-terminology',
    jurisdiction: 'International (ICC rules, applied when incorporated into the credit)',
    supports:
      'UCP 600 as the ICC rules for documentary credits, banks examining documents only, a maximum of five banking days to examine a presentation, ISBP 821, eUCP and URC 522 for collections',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
