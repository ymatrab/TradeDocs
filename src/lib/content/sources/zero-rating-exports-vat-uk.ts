import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources for wave C writer 4 (wc-4): zero-rating-exports-vat-uk, uk-export-declaration,
 * shipping-to-the-uk-and-eu-documents, ioss and ata-carnet. Every page opened 2026-10-08.
 */
export default {
  'c4-hmrc-vat-notice-703': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'VAT on goods exported from the UK (VAT Notice 703)',
    url: 'https://www.gov.uk/guidance/vat-on-goods-exported-from-the-uk-notice-703',
    jurisdiction: 'United Kingdom (VAT on exports)',
    supports:
      'zero rating of exports, direct and indirect exports, the 3-month and 6-month time limits, official and commercial evidence of export, chain sales, postal and courier evidence and the 6-year record rule (page last updated 4 March 2026)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-full-export-declaration': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Making a full export declaration',
    url: 'https://www.gov.uk/guidance/making-a-full-export-declaration',
    jurisdiction: 'United Kingdom (export)',
    supports:
      'who submits an export declaration, the data it needs, the DUCR, arrived declarations, minimum lodging times, departure messages, C1602 and amendments (page last updated 13 May 2025)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-export-customs-declaration': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Make an export declaration and get your goods through customs',
    url: 'https://www.gov.uk/export-customs-declaration',
    jurisdiction: 'United Kingdom (export)',
    supports:
      'the GB EORI requirement, systems and software, hiring an agent, and what the transporter needs at the border, including the master reference number and invoice',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-cds-access': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Get access to the Customs Declaration Service',
    url: 'https://www.gov.uk/guidance/get-access-to-the-customs-declaration-service',
    jurisdiction: 'United Kingdom (customs)',
    supports:
      'subscribing to the Customs Declaration Service to submit export declarations with software, one subscription covering imports and exports, and what you need to subscribe (page last updated 6 July 2026)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-simplified-export-declarations': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Using simplified declarations for exports',
    url: 'https://www.gov.uk/guidance/using-simplified-declarations-for-exports',
    jurisdiction: 'United Kingdom (export)',
    supports:
      'the simplified declaration procedure, supplementary declaration deadlines, authorisation by form C&E48, and entry in the declarant’s records (page last updated 6 February 2025)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-appoint-customs-agent': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Appoint someone to deal with customs on your behalf',
    url: 'https://www.gov.uk/guidance/appoint-someone-to-deal-with-customs-on-your-behalf',
    jurisdiction: 'United Kingdom (customs)',
    supports:
      'written instructions to a customs representative, direct or indirect representation, and the trader’s continuing due diligence for declarations (page last updated 6 February 2025)',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
  'c4-gov-uk-export-goods': {
    authority: 'HM Revenue & Customs (HMRC), GOV.UK',
    title: 'Export goods from the UK: step by step',
    url: 'https://www.gov.uk/export-goods',
    jurisdiction: 'United Kingdom (export)',
    supports:
      'the order of steps for exporting from Great Britain, including deciding who makes export declarations, classifying goods and preparing the invoice',
    retrieved: '2026-10-08',
    reviewer: 'pending owner review',
  },
} satisfies Record<string, SourceFields>;
