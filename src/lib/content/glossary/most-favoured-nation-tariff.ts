import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'most-favoured-nation-tariff',
  term: 'Most-favoured-nation (MFN) tariff',
  abbreviation: 'MFN',
  aliases: [
    'MFN tariff',
    'MFN rate',
    'most favored nation tariff',
    'MFN duty',
    'normal trade relations rate',
  ],
  demand: {
    keyword: 'mfn tariff',
    market: 'US',
    volume: 210,
    kd: 14,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'MFN tariff: most-favoured-nation duty rate',
  description:
    'What an MFN tariff is: the WTO most-favoured-nation principle, the general duty column it fills in a national tariff, bound vs applied rates, and when another rate applies.',
  shortDefinition:
    'An MFN tariff is the standard duty rate a WTO member charges on imports from other WTO members, under the most-favoured-nation principle that a lower rate granted to one member must be granted to all. Preferential and penalty rates are exceptions to it.',
  definition: [
    'Most-favoured-nation treatment is the first article of the GATT. The WTO explains it plainly: grant one trading partner a special favour, such as a lower customs duty rate for one of its products, and you have to do the same for all other WTO members. The name sounds like special treatment, but in practice it means equal treatment, and the MFN rate is the ordinary rate most imports pay.',
    'Countries publish the MFN rate in their tariff as the general column. In the Harmonized Tariff Schedule of the United States it is the General subcolumn of rate of duty column 1, also called normal trade relations; column 2 applies to a short list of countries named in the General Notes. The WTO separates bound rates, the ceilings in each member’s schedule, from applied rates, what the member actually charges, which can be lower.',
    'Exceptions are allowed under strict conditions: free trade agreements, special access for developing countries, and measures such as anti-dumping duties against goods considered to be traded unfairly. This page states no rate; look up the importing country’s tariff for your goods.',
  ],
  onYourDocuments: [
    'No document says “MFN”. The rate follows from two things the invoice states: the classification of the goods and their country of origin. A clear description and the country of origin on the commercial invoice let the broker apply the general rate, or a different one where the goods qualify for it.',
    'If you expect a preferential rate under a trade agreement, that is a separate claim with its own conditions and evidence. Without a valid claim, goods from a WTO member normally pay the MFN rate.',
  ],
  example: {
    caption: 'Worked example with invented parties; no real rate is shown',
    paragraphs: [
      'Copperleaf Home (invented) in the United States buys the same product from two suppliers in two different WTO member countries, neither covered by a U.S. trade agreement for these goods. Both shipments are classified in the same tariff line, so both pay the same rate from the General column. If one country later signs an agreement with the United States, goods that meet its terms may claim the agreement’s rate instead; goods from the other keep paying the MFN rate.',
    ],
  },
  confusedWith: [
    {
      term: 'Preferential tariff',
      difference:
        'A preferential rate is a lower rate for goods that qualify under a trade agreement or scheme. The MFN rate is the default when no preference is claimed.',
    },
    {
      term: 'Most favoured nation status (news sense)',
      difference:
        'In the news, “MFN status” describes a country’s overall trading relationship. On a shipment, the MFN tariff is the duty rate in the tariff line.',
    },
  ],
  related: [
    '/blog/how-to-read-the-harmonized-tariff-schedule',
    '/blog/how-to-calculate-import-duty',
    '/blog/duty-vs-tariff',
    'tariff-rate-quota',
    'anti-dumping-duty',
  ],
  tool: '/tools/landed-cost-calculator',
  toolPitch:
    'The landed cost calculator applies the duty rate you enter to your goods, freight and insurance, so you can compare the general rate with any other rate you look up.',
  faq: [
    {
      q: 'Does most-favoured nation mean better treatment?',
      a: 'No. Under WTO rules it means non-discrimination: a member gives every other member the same treatment as its most-favoured trading partner. The MFN rate is the ordinary rate, and preferential rates under trade agreements can be lower.',
    },
    {
      q: 'Where do I find the MFN rate for my goods?',
      a: 'In the importing country’s tariff, in the general or MFN column for your tariff line. In the U.S. schedule it is the General subcolumn of column 1. Confirm the classification first, because the rate follows the line.',
    },
  ],
  sources: [
    'e6-wto-principles-mfn',
    'e6-wto-tariffs',
    'a3-usitc-hts-general-notes',
    'c6-wto-trade-remedies',
  ],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
