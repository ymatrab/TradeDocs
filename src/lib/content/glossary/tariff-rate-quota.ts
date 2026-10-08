import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'tariff-rate-quota',
  term: 'Tariff-rate quota (TRQ)',
  abbreviation: 'TRQ',
  aliases: ['tariff quota', 'TRQ', 'in-quota rate', 'over-quota rate'],
  demand: {
    keyword: 'tariff rate quota',
    market: 'US',
    volume: 14_800,
    kd: 8,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Tariff-rate quota (TRQ) explained',
  description:
    'How a tariff-rate quota works: a set quantity enters at a lower duty rate, the rest at a higher one, and how U.S. customs decides which entries count against the quota.',
  shortDefinition:
    'A tariff-rate quota (TRQ) lets a specified quantity of a product enter at a lower duty rate during a set period; imports above that quantity are still allowed but pay a higher rate. It limits the cheaper access, not the trade itself.',
  definition: [
    'A TRQ combines two rates and one quantity. The WTO describes tariff quotas as lower tariff rates for specified quantities and higher, sometimes much higher, rates for quantities that exceed the quota. They became common in agriculture when the Uruguay Round converted import quotas into tariffs, and the commitments sit in each WTO member’s schedule.',
    'A TRQ differs from an absolute quota. U.S. Customs and Border Protection administers both: under an absolute quota, nothing more of the product may enter once the quantity is reached, while under a tariff-rate quota, quantities above the quota can still be entered in unlimited amounts during the period, but at the higher duty rate.',
    'Who gets the lower rate depends on how the quota is administered. CBP fills its quotas by the date and time an entry is presented, first come first served, and may prorate the last entry when a quota fills. Which products are under a quota, the quantities and the two rates are set in each country’s tariff and change from period to period; this page states none of them.',
  ],
  onYourDocuments: [
    'A TRQ does not appear on a commercial invoice as such. What the invoice must do is describe the goods precisely and give the quantity in the units the tariff uses, because the quota is counted in those units and the broker needs them to claim in-quota treatment.',
    'Timing matters for the importer. CBP’s quota guidance says that an entry summary returned for correction gets a new presentation time when it is resubmitted, so an error in the paperwork can push goods past the moment the quota fills.',
  ],
  example: {
    caption: 'Worked example with invented parties; no real quota or rate is shown',
    paragraphs: [
      'Valley Dairy Imports (invented) brings in a product that falls under a tariff-rate quota. Its broker presents the entry as the quota period opens. The entry is accepted within the quota, so the goods pay the in-quota rate. A second shipment arrives after the quota has filled; it can still be entered, but at the over-quota rate, which the importer had priced into its contract as a risk.',
    ],
  },
  confusedWith: [
    {
      term: 'Absolute quota',
      difference:
        'An absolute quota caps the quantity that may enter in the period. A tariff-rate quota lets more enter, at a higher duty rate.',
    },
    {
      term: 'Tariff preference level',
      difference:
        'A TPL is a quantity limit on preferential treatment under a trade agreement, mainly for textiles; CBP administers TPLs like tariff-rate quotas.',
    },
  ],
  related: [
    '/blog/duty-vs-tariff',
    '/blog/how-to-calculate-import-duty',
    '/guides/landed-cost',
    'importing',
  ],
  tool: '/tools/landed-cost-calculator',
  toolPitch:
    'The landed cost calculator lets you compare a shipment’s total cost under the duty rate you enter, so you can see the in-quota and over-quota cases side by side.',
  faq: [
    {
      q: 'What is the difference between in-quota and over-quota rates?',
      a: 'The in-quota rate is the lower duty rate that applies to the specified quantity. The over-quota rate is the higher rate for imports above that quantity in the same period.',
    },
    {
      q: 'How does CBP decide which entries get the in-quota rate?',
      a: 'By the date and time each entry is presented, first come first served. When a quota fills, the last entry may be prorated, and the remainder pays the over-quota rate or goes into a bonded warehouse or foreign-trade zone.',
    },
  ],
  sources: ['c6-wto-agriculture-tariff-quotas', 'c6-cbp-quota-faq'],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
