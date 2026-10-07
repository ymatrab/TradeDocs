import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the glossary term page waybill. Each URL was opened on the
 * retrieval date and checked against the claim in `supports`.
 */
const RETRIEVED = '2026-10-07';
const PENDING = 'pending owner review';

export default {
  'dcsa-sea-waybill': {
    authority: 'Digital Container Shipping Association (DCSA)',
    title: 'Bill of Lading vs. Sea Waybill (2 April 2025)',
    url: 'https://dcsa.org/newsroom/sea-waybill-vs-bill-of-lading',
    jurisdiction: 'Carrier industry standards body (ocean container shipping)',
    supports:
      'a sea waybill being a transport document used as an alternative to the bill of lading that is non-negotiable, cannot be used to transfer title, is not a document of title, only confirms receipt, and needs no original document for cargo release',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'iata-air-waybill': {
    authority: 'International Air Transport Association (IATA)',
    title: 'e-freight / e-AWB',
    url: 'https://www.iata.org/en/programs/cargo/e/eawb/',
    jurisdiction: 'International air cargo',
    supports:
      'the air waybill (AWB) being the air cargo document that constitutes the contract of carriage between the shipper and the carrier (airline), and the electronic air waybill (Resolution 672) removing the need for a paper one',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
