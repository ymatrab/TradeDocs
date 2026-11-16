import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the glossary term page dunnage. Each URL was opened on the
 * retrieval date and checked against the claim in `supports`.
 */
const RETRIEVED = '2026-10-07';
const OWNER_ACCEPTED = 'accepted by the owner on 29 October 2026 (AI-assisted review, D-028)';

export default {
  'ippc-ispm-15-implementation': {
    authority: 'International Plant Protection Convention (IPPC), FAO',
    title: 'ISPM 15 implementation',
    url: 'https://www.ippc.int/en/archive-old-pages/phytosanitary-system/ispm-15-implementation/',
    jurisdiction: 'International (phytosanitary standard)',
    supports:
      'the ISPM 5 definition of dunnage as wood packaging material used to secure or support a commodity but which does not remain associated with the commodity, and wood packaging material (wood or wood products, excluding paper products, used in supporting, protecting or carrying a commodity) including dunnage',
    retrieved: RETRIEVED,
    reviewer: OWNER_ACCEPTED,
  },
} satisfies Record<string, SourceFields>;
