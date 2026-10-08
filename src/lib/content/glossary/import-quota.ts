import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'import-quota',
  term: 'Import quota',
  aliases: ['quota on imports', 'trade quota', 'absolute quota', 'quantitative restriction'],
  demand: {
    keyword: 'import quota',
    market: 'US',
    volume: 1_600,
    kd: null,
    dataFile: '../dataforseo-2026-10-08/11-labs-ranked-keywords-us-incodocs-com.json',
  },
  metaTitle: 'Import quota: absolute quota vs tariff quota',
  description:
    'What an import quota is, how an absolute quota differs from a tariff-rate quota, where the WTO allows quotas, and why the paperwork decides when your goods count.',
  shortDefinition:
    'An import quota is a limit set by a government on the quantity or value of a product that may be imported in a given period. Under an absolute quota, nothing more may enter once the limit is reached until the next period opens.',
  definition: [
    'The WTO treats quotas as quantitative restrictions. Article XI of the GATT 1994 covers prohibitions or restrictions other than duties, taxes or other charges, made effective through quotas, import or export licences or other measures, and provides for their general elimination. They are still allowed in specific circumstances, such as the balance-of-payments, general and national-security exceptions, and members notify the ones they keep.',
    'Two kinds are often confused. U.S. Customs and Border Protection administers absolute quotas, which cap the quantity that may be entered in the period, and tariff-rate quotas, which let a set quantity enter at a lower duty rate while larger quantities can still enter at a higher rate. A tariff-rate quota is a tariff measure; an absolute quota is a hard limit.',
    'Which products are under a quota, the quantities and the periods are set by each importing country and change over time. This page names none of them; check the importing country’s tariff or customs authority for the goods you ship.',
  ],
  onYourDocuments: [
    'An invoice never says “quota”. It matters because the quota is counted in the tariff’s own units, so the commercial invoice and packing list should state the quantity in those units and describe the goods precisely enough for the broker to file against the right quota.',
    'Timing is part of the paperwork. CBP fills quotas by the date and time an entry is presented, and an entry summary returned for correction gets a new presentation time, so a document error can cost the goods their place.',
  ],
  example: {
    caption: 'Worked example with invented parties; no real quota is shown',
    paragraphs: [
      'Harbourline Textiles (invented) imports a product that the destination country places under an absolute quota for each calendar quarter. Its first shipment is presented as the quarter opens and is released. A second shipment arrives after the quota has filled; it cannot be entered for consumption until the next quarter, so the importer pays to store it under customs control in the meantime.',
    ],
  },
  confusedWith: [
    {
      term: 'Tariff-rate quota',
      difference:
        'A tariff-rate quota does not stop imports above the quantity; they pay a higher duty rate. An absolute quota stops further entries for the period.',
    },
    {
      term: 'Import licence',
      difference:
        'A licence is permission for a particular importer or shipment. Some countries administer a quota by issuing licences, but a licence can exist without any quota.',
    },
  ],
  related: ['tariff-rate-quota', 'import-license', '/blog/duty-vs-tariff', '/guides/landed-cost'],
  tool: '/tools/landed-cost-calculator',
  toolPitch:
    'The landed cost calculator lets you add storage and other costs you enter, so you can price the case where goods wait for the next quota period.',
  faq: [
    {
      q: 'What is the difference between an import quota and a tariff?',
      a: 'A tariff is a duty charged on imports, so goods can still enter if the duty is paid. A quota limits the quantity or value that may enter at all, or, for a tariff-rate quota, the quantity that gets the lower rate.',
    },
    {
      q: 'Are import quotas allowed under WTO rules?',
      a: 'As a rule, no: GATT Article XI provides for the general elimination of quantitative restrictions. It and other GATT articles allow them in specific circumstances, and tariff-rate quotas are listed in members’ schedules.',
    },
  ],
  sources: [
    'e6-wto-quantitative-restrictions',
    'c6-cbp-quota-faq',
    'c6-wto-agriculture-tariff-quotas',
  ],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
