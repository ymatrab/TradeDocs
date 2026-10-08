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
} satisfies Record<string, SourceFields>;
