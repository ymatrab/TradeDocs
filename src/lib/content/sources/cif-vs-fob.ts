import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the write-1 batch: fob-shipping-point-vs-fob-destination, exw-vs-fob,
 * exw-vs-fca, cif-vs-fob, ddp-vs-ddu and fob-vs-ddp. Each URL was opened and the claim checked
 * on the retrieval date.
 */
export default {
  'w1-cornell-ucc-2-319': {
    authority: 'Legal Information Institute, Cornell Law School',
    title: 'UCC § 2-319: F.O.B. and F.A.S. terms',
    url: 'https://www.law.cornell.edu/ucc/2/2-319',
    jurisdiction: 'United States (Uniform Commercial Code, as adopted by each state)',
    supports:
      'F.O.B. the place of shipment and F.O.B. the place of destination as delivery terms, and who bears expense and risk under each',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w1-cornell-ucc-2-401': {
    authority: 'Legal Information Institute, Cornell Law School',
    title: 'UCC § 2-401: Passing of title',
    url: 'https://www.law.cornell.edu/ucc/2/2-401',
    jurisdiction: 'United States (Uniform Commercial Code, as adopted by each state)',
    supports:
      'title passing, unless otherwise agreed, when the seller completes physical delivery: at shipment under a shipment contract, on tender at destination under a destination contract',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w1-cornell-ucc-2-509': {
    authority: 'Legal Information Institute, Cornell Law School',
    title: 'UCC § 2-509: Risk of loss in the absence of breach',
    url: 'https://www.law.cornell.edu/ucc/2/2-509',
    jurisdiction: 'United States (Uniform Commercial Code, as adopted by each state)',
    supports:
      'risk of loss passing on delivery to the carrier under a shipment contract, and on tender at the destination under a destination contract',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w1-icc-incoterms-history': {
    authority: 'International Chamber of Commerce (ICC)',
    title: 'Incoterms® rules history',
    url: 'https://iccwbo.org/business-solutions/incoterms-rules/incoterms-rules-history/',
    jurisdiction: 'International (contractual rules, not law)',
    supports:
      'Incoterms® 2010 removing DAF, DES, DEQ and DDU and adding DAT and DAP; the 2020 revision',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w1-hmrc-incoterms': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Customs valuation: Incoterms',
    url: 'https://www.gov.uk/guidance/customs-valuation/incoterms',
    jurisdiction: 'United Kingdom (customs valuation guidance)',
    supports:
      'what each rule means, including EXW not requiring the seller to load or clear for export, FCA at the seller’s premises, CIF insurance and DDP import clearance and duties; the Incoterm not restricting the valuation method',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w1-ita-know-your-incoterms': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Know Your Incoterms',
    url: 'https://www.trade.gov/know-your-incoterms',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the seven any-mode rules and four sea and inland waterway rules, and parties being able to agree an earlier Incoterms® version if they name it',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w1-ecfr-15-cfr-30-3': {
    authority: 'U.S. Census Bureau, via the Electronic Code of Federal Regulations',
    title:
      '15 CFR 30.3: Electronic Export Information filer requirements, parties to export transactions, and responsibilities',
    url: 'https://www.ecfr.gov/current/title-15/subtitle-B/chapter-I/part-30/subpart-A/section-30.3',
    jurisdiction: 'United States (exports)',
    supports:
      'standard and routed export transactions, trade terms not determining the type of transaction, and the USPPI’s duty to give the FPPI’s agent the export information',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w1-cornell-19-usc-1401a': {
    authority: 'Legal Information Institute, Cornell Law School',
    title: '19 U.S. Code § 1401a: Value',
    url: 'https://www.law.cornell.edu/uscode/text/19/1401a',
    jurisdiction: 'United States (imports)',
    supports:
      'the price actually paid or payable excluding international transportation and insurance costs to the place of importation in the United States',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
  'w1-gov-uk-register-for-vat': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Register for VAT: when to register',
    url: 'https://www.gov.uk/register-for-vat',
    jurisdiction: 'United Kingdom (VAT)',
    supports:
      'businesses based outside the UK that supply goods or services in the UK having to register for VAT regardless of turnover',
    retrieved: '2026-10-06',
    reviewer: 'pending owner review',
  },
} satisfies Record<string, SourceFields>;
