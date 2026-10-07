import type { SourceFields } from '@/lib/trade/sources';

/**
 * Sources first cited by the glossary term pages teu and feu. Each URL was opened on the
 * retrieval date and checked against the claim in `supports`.
 */
const RETRIEVED = '2026-10-07';
const PENDING = 'pending owner review';

export default {
  'era-eurostat-teu': {
    authority:
      'European Union Agency for Railways, quoting the Eurostat Glossary for transport statistics (6th edition, 2026)',
    title: 'Twenty-foot equivalent unit (TEU)',
    url: 'https://www.era.europa.eu/era-railway-terminology-collection/twenty-footequivalentunit%28teu%29/term_1/eu_policy',
    jurisdiction: 'European Union (transport statistics)',
    supports:
      'the TEU as a statistical unit based on a 20-foot-long (6.10 m) ISO container, used to describe the capacity of container ships and terminals, with a 20-foot container counted as 1 TEU, a 40-foot container as 2 TEU, a container between 20 and 40 feet as 1.50 TEU and one over 40 feet as 2.25 TEU',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
  'unctad-containerised-transport': {
    authority: 'UN Trade and Development (UNCTAD), SDG Pulse glossary',
    title: 'Containerised transport',
    url: 'https://sdgpulse.unctad.org/glossary/containerised-transport/index.html',
    jurisdiction: 'International (statistics)',
    supports:
      'containerised transport using intermodal containers of standard dimensions that move between ships, trucks and trains, with the TEU and the FEU (forty-foot equivalent unit), based on 20-foot and 40-foot containers, as the main units of measure',
    retrieved: RETRIEVED,
    reviewer: PENDING,
  },
} satisfies Record<string, SourceFields>;
