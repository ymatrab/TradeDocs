import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the wave A invoice and packing list posts: commercial-invoice-example,
 * packing-list-example, how-to-fill-out-a-commercial-invoice,
 * how-to-make-a-packing-list-from-your-invoice and
 * commercial-invoice-and-packing-list-must-match. Each page was opened and the cited claim
 * checked on the retrieval date.
 */
const RETRIEVED = '2026-10-07';
const PENDING = 'pending owner review';

export default {
  'a2-cornell-19-cfr-141-86': {
    authority: 'Legal Information Institute, Cornell Law School (Code of Federal Regulations)',
    title: '19 CFR § 141.86 — Contents of invoices and general requirements',
    url: 'https://www.law.cornell.edu/cfr/text/19/141.86',
    jurisdiction: 'United States (imports)',
    supports:
      'the port of entry, the detailed description with the marks and numbers of the packages, quantities in weights and measures, the English-language rule, each invoice stating what merchandise is in each individual package, and invoice information being allowed on an attachment',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a2-trade-gov-commercial-invoice': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Commercial Invoice',
    url: 'https://www.trade.gov/commercial-invoice',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the commercial invoice being used by the importing country’s customs to assess duties and taxes, carrying the proforma details plus HS codes and, where required, the destination control statement, and the seller’s own format being accepted in most countries',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a2-trade-gov-packing-list': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Packing List',
    url: 'https://www.trade.gov/packing-list',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the packing list itemising the contents of each package with weights and measurements, forwarders using it to determine weights and freight costs, and customs using it to check a specific package',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a2-trade-gov-letter-of-credit': {
    authority: 'International Trade Administration, U.S. Department of Commerce',
    title: 'Letter of Credit',
    url: 'https://www.trade.gov/letter-credit',
    jurisdiction: 'United States (export guidance)',
    supports:
      'the exporter’s bank checking documents for compliance with the letter of credit, and errors and discrepancies having to be amended and resubmitted',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a2-cbsa-d1-4-1': {
    authority: 'Canada Border Services Agency (CBSA)',
    title: 'Memorandum D1-4-1: CBSA Invoice Requirements',
    url: 'https://www.cbsa-asfc.gc.ca/publications/dm-md/d1/d1-4-1-eng.html',
    jurisdiction: 'Canada (imports)',
    supports:
      'a commercial invoice giving the Appendix A information being accepted, in English or French, with the number of packages and both net and gross weight among its fields',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'a2-cornell-15-cfr-758-6': {
    authority: 'Legal Information Institute, Cornell Law School (Code of Federal Regulations)',
    title: '15 CFR § 758.6 — Destination control statement and other information',
    url: 'https://www.law.cornell.edu/cfr/text/15/758.6',
    jurisdiction: 'United States (exports, Export Administration Regulations)',
    supports:
      'the destination control statement being an integral part of the commercial invoice when items on the Commerce Control List are shipped, with stated exceptions',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
