import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the glossary term page consignor. Each URL was opened on the
 * retrieval date and checked against the claim in `supports`.
 */
const RETRIEVED = '2026-10-07';
const OWNER_ACCEPTED = 'accepted by the owner on 29 October 2026 (AI-assisted review, D-028)';

export default {
  'cornell-ucc-7-102': {
    authority: 'Legal Information Institute, Cornell Law School (Uniform Commercial Code)',
    title: 'UCC § 7-102 — Definitions and index of definitions',
    url: 'https://www.law.cornell.edu/ucc/7/7-102',
    jurisdiction: 'United States (state commercial law, uniform text)',
    supports:
      'a consignor being a person named in a bill of lading as the person from which the goods have been received for shipment, a consignee being a person named in a bill of lading to which or to whose order the bill promises delivery, and a carrier being a person that issues a bill of lading',
    retrieved: RETRIEVED,
    reviewer: OWNER_ACCEPTED,
  },
} satisfies Record<string, SourceFields>;
