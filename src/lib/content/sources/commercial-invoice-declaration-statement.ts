import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the wave C writer set wc-5 (content plan v3, 2026-10-07):
 * commercial-invoice-declaration-statement, air-freight-vs-sea-freight, export-packing,
 * cbm-and-weight-or-measure, reuse-shipment-data-for-repeat-orders and
 * add-logo-and-signature-to-export-documents. Each page was opened and the claim checked on
 * the retrieval date. Carrier pages that refused the request on that date are not cited.
 */
const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

export default {
  'c5-cornell-19-cfr-141-86': {
    authority: 'Legal Information Institute, Cornell Law School (19 CFR, CBP)',
    title: '19 CFR § 141.86 — Contents of invoices and general requirements',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.86',
    jurisdiction: 'United States (imports)',
    supports:
      'the invoice contents in paragraph (a), including itemised charges and rebates and the country of origin; every discount set out in detail (g); invoice information allowed on an attachment (i); and each invoice naming a responsible employee of the exporter who has or can readily obtain knowledge of the transaction (j)',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c5-cornell-19-usc-1592': {
    authority: 'Legal Information Institute, Cornell Law School (19 U.S.C.)',
    title: '19 U.S. Code § 1592 — Penalties for fraud, gross negligence, and negligence',
    url: 'https://www.law.cornell.edu/uscode/text/19/1592',
    jurisdiction: 'United States (imports)',
    supports:
      'penalties for entering merchandise by means of a material and false document, statement or omission, through fraud, gross negligence or negligence, whether or not duty is lost',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c5-cornell-15-cfr-758-6': {
    authority: 'Legal Information Institute, Cornell Law School (15 CFR, BIS)',
    title: '15 CFR § 758.6 — Destination control statement and other information',
    url: 'https://www.law.cornell.edu/cfr/text/15/758.6',
    jurisdiction: 'United States (exports, Export Administration Regulations)',
    supports:
      'the destination control statement being an integral part of the commercial invoice for Commerce Control List items shipped in tangible form, excluding EAR99 items and License Exceptions BAG and GFT, its prescribed wording, and the ECCN being stated for listed ECCNs',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c5-cbsa-d1-4-1': {
    authority: 'Canada Border Services Agency (CBSA)',
    title: 'Memorandum D1-4-1: CBSA Invoice Requirements',
    url: 'https://www.cbsa-asfc.gc.ca/publications/dm-md/d1/d1-4-1-eng.html',
    jurisdiction: 'Canada (imports)',
    supports:
      'a commercial invoice prepared by any means being accepted when it gives the Appendix A information, and the Originator field asking for the company’s name and address when the invoice is completed on a company’s behalf',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'c5-gov-uk-proof-of-origin': {
    authority: 'GOV.UK (HM Revenue & Customs)',
    title: 'Get proof of origin for your goods',
    url: 'https://www.gov.uk/guidance/get-proof-of-origin-for-your-goods',
    jurisdiction: 'United Kingdom (preferential trade)',
    supports:
      'an origin declaration, also called an invoice declaration or statement on origin, being made on a commercial document such as an invoice, packing list or delivery note, with the relevant trade agreement deciding conditions such as approved exporter status, and a declaration having to be signed unless a signature waiver applies',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
