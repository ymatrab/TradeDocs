import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the wave B posts skid-vs-pallet, what-is-customs-clearance,
 * how-to-calculate-shipping-cost, mawb-vs-hawb, shipping-container-weight-limits and
 * freight-prepaid-vs-freight-collect (one file for the batch, ids `b1-`). Each URL was opened
 * on the retrieval date and checked against the claim in `supports`.
 */
const RETRIEVED = '2026-10-08';
const PENDING = 'pending owner review';

export default {
  'b1-fedex-freight-pallets-skids': {
    authority: 'FedEx Freight',
    title: 'Pallets and skids: the difference (packing guide)',
    url: 'https://www.fedexfreight.com/en-us/fragments/pallets-skids-difference',
    jurisdiction: 'United States (carrier practice, LTL freight)',
    supports:
      'the terms pallet and skid often being used interchangeably, and the difference that a pallet has bottom deck boards and a skid does not',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-cfr-7-319-40-1': {
    authority: 'USDA APHIS, 7 CFR 319.40-1, via Cornell LII',
    title: '7 CFR § 319.40-1 — Definitions (logs, lumber and other wood articles)',
    url: 'https://www.law.cornell.edu/cfr/text/7/319.40-1',
    jurisdiction: 'United States (import)',
    supports:
      'regulated wood packaging material being wood packaging used with cargo to prevent damage, including dunnage, crating, pallets, packing blocks, drums, cases and skids, and excluding manufactured wood, loose wood packing and pieces under 6 mm thick',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'b1-cfr-7-319-40-3': {
    authority: 'USDA APHIS, 7 CFR 319.40-3, via Cornell LII',
    title: '7 CFR § 319.40-3 — General permits; articles that may be imported without a specific permit',
    url: 'https://www.law.cornell.edu/cfr/text/7/319.40-3',
    jurisdiction: 'United States (import)',
    supports:
      'regulated wood packaging material entering the US having to be treated and carry a legible, permanent mark under the IPPC standard (symbol, country code, producer number and treatment code such as HT or MB), and an inspector being able to order the immediate re-export of unmarked material',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
