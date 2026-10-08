import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'foreign-trade-zone',
  term: 'Foreign-trade zone (FTZ)',
  abbreviation: 'FTZ',
  aliases: ['foreign trade zone', 'FTZ', 'free trade zone', 'FTZ subzone', 'CBP Form 214'],
  demand: {
    keyword: 'foreign trade zone',
    market: 'US',
    volume: 1300,
    kd: 38,
    // Measured in the 2026-10-06 round; the path is relative to the 2026-10-07 folder.
    dataFile: '../dataforseo-2026-10-06/04-labs-keyword-overview-us-shipping-costs.json',
  },
  metaTitle: 'Foreign-trade zone (FTZ): what it is',
  description:
    'What a U.S. foreign-trade zone is, how goods are admitted on CBP Form 214, the zone statuses, when duty becomes due on entry from the zone, and how an FTZ differs from a bonded warehouse.',
  shortDefinition:
    'A foreign-trade zone is a secure area under CBP supervision, in or near a U.S. port of entry, that is treated as outside U.S. customs territory once activated. Foreign goods in it need no formal entry or duty payment until they enter the U.S. market.',
  definition: [
    'Zones exist under the Foreign-Trade Zones Act of 1934. The Foreign-Trade Zones Board, under Commerce Department regulations in 15 CFR Part 400, grants zone status; CBP supervises what moves in and out under 19 CFR Part 146. A grantee holds the zone, an operator runs it under an agreement with the grantee, and a subzone is a special-purpose site set up for a limited purpose that an existing zone cannot accommodate.',
    'Goods are admitted on CBP Form 214, supported by an examination invoice. Inside the zone, foreign and domestic goods may be stored, assembled, manufactured and processed, provided the activity is lawful; retail trade of foreign merchandise is not allowed. Each lot carries a zone status. Privileged foreign status must be requested before the goods are changed in a way that alters their tariff classification, and it then stays with them even if they change form. Goods in domestic status can return to the U.S. market free of duty.',
    'When foreign goods leave the zone for the U.S. market, the importer files an entry, on CBP Form 3461 or 7501, and duty becomes due then. Goods can also leave for export or move in bond to another port or zone.',
  ],
  onYourDocuments: [
    'The supplier’s commercial invoice is the examination invoice CBP needs for admission, so its descriptions, quantities and values must match what is counted into the zone on Form 214. A packing list with marks and numbers helps the operator record each lot.',
    'Goods leaving the zone for the U.S. market need invoices again. Where finished goods are made in the zone, CBP can allow a weekly entry for the estimated removals, backed by a pro forma invoice or schedule listing the units of each type and their zone and dutiable values.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Halden Cycles (invented) imports frames and wheels from Taiwan into a subzone at its Tennessee assembly plant. Its broker files Form 214 with the supplier’s invoice, and the parts are admitted to the subzone without duty being paid.',
      'Halden assembles bicycles in the subzone. Bicycles sold to U.S. shops leave on a weekly entry backed by a pro forma schedule of units, and duty is paid on those; a batch sold to a dealer in Mexico is exported directly from the zone without a U.S. consumption entry.',
    ],
  },
  confusedWith: [
    {
      term: 'Bonded warehouse',
      difference:
        'A bonded warehouse sits inside U.S. customs territory and allows storage and limited manipulation for up to 5 years. A foreign-trade zone is treated as outside it once activated and can host manufacturing.',
    },
    {
      term: 'Free trade agreement',
      difference:
        'A free trade agreement is a treaty between countries that sets preferential terms. A foreign-trade zone is a physical site in one country and changes when and how entry is made, not the trade terms.',
    },
  ],
  related: [
    'in-bond-shipment',
    '/guides/how-to-import-into-the-us',
    '/blog/cbp-form-3461',
    '/blog/cbp-form-7501',
  ],
  tool: '/tools/landed-cost-calculator',
  toolPitch:
    'The landed cost calculator adds duty and freight to a lot’s value, so you can see the cash a transfer out of the zone will call for.',
  faq: [
    {
      q: 'Is a foreign-trade zone outside the United States?',
      a: 'Not physically. It is inside the country, but for customs purposes an activated zone is treated as outside U.S. customs territory, so foreign goods in it need no formal entry until they enter the U.S. market.',
    },
    {
      q: 'Which form admits goods to a foreign-trade zone?',
      a: 'CBP Form 214, the Application for Foreign Trade Zone Admission and/or Status Designation, with an examination invoice and evidence of the right to make entry. The port director issues the permit.',
    },
  ],
  sources: [
    'e5-cbp-ftz-about',
    'e5-cfr-19-146-1',
    'e5-cfr-19-146-32',
    'e5-cfr-19-146-41',
    'e5-cfr-19-146-43',
    'e5-cfr-19-146-62',
    'e5-cfr-19-146-63',
  ],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
