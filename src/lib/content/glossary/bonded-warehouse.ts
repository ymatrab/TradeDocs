import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'bonded-warehouse',
  term: 'Bonded warehouse',
  aliases: [
    'customs bonded warehouse',
    'bonded warehousing',
    'CBW',
    'customs warehouse',
    'warehouse entry',
  ],
  demand: {
    keyword: 'bonded warehouse',
    market: 'US',
    volume: 2400,
    kd: 10,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Bonded warehouse: meaning and how it works',
  description:
    'What a bonded warehouse is, the CBP warehouse classes, how a warehouse entry delays duty until goods are withdrawn, the five-year limit, and the UK customs warehouse equivalent.',
  shortDefinition:
    'A bonded warehouse is a customs-approved facility where imported goods are stored under bond without paying duty yet. Duty becomes due only when the goods are withdrawn for use in the country, and goods exported from the warehouse leave without it.',
  definition: [
    'In the United States the rules are in 19 CFR Part 19 and Part 144. Section 19.1 sorts customs warehouses into classes: a private bonded warehouse stores only the proprietor’s own imports, a public bonded warehouse stores imported goods for others, and further classes cover bonded yards and tanks, grain bins, manufacturing solely for export, cleaning and repacking, duty-free stores and general order goods.',
    'Goods go in on a warehouse entry instead of a consumption entry. Any merchandise subject to duty can be warehoused except perishable goods and explosives, and under 19 CFR 144.5 it may stay up to 5 years from the date of importation unless CBP allows longer. While it waits, the owner can withdraw part of a lot for consumption, paying duty on that part, or withdraw it for export. Cleaning, sorting and repacking need a permit on CBP Form 3499 and must not amount to manufacturing.',
    'The United Kingdom has the same idea under the name customs warehousing: HMRC authorises the warehousekeeper, duty and import VAT are suspended while goods are stored, and they fall due when the goods are released to free circulation.',
  ],
  onYourDocuments: [
    'A bonded warehouse does not change your commercial invoice or packing list. The broker files the warehouse entry from them, so descriptions, quantities and marks have to match what is counted into the warehouse, because the proprietor answers to CBP for those quantities.',
    'When goods leave, each withdrawal is a new filing. If you sell from stock in the warehouse, your invoice for that withdrawal should identify which lot or packages are going, so the quantities on the withdrawal can be matched back to the original warehouse entry.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Kestrel Wines (invented), a U.S. importer, lands 1,200 cases from Portugal ahead of the holiday season. Its broker files a warehouse entry and the cases go into a public bonded warehouse in New Jersey.',
      'Over the next months Kestrel withdraws 200 cases at a time for consumption, paying duty on each withdrawal, and withdraws 100 cases for export to a buyer in Canada, which leave without U.S. duty. Each withdrawal quotes the original entry and the case marks on the packing list.',
    ],
  },
  confusedWith: [
    {
      term: 'Foreign-trade zone',
      difference:
        'A foreign-trade zone is treated as outside U.S. customs territory once activated and can host manufacturing. A bonded warehouse is inside it and allows storage and limited manipulation, for up to 5 years.',
    },
    {
      term: 'In-bond shipment',
      difference:
        'In bond describes goods moving under customs control between ports. A bonded warehouse is where goods are stored under customs control.',
    },
  ],
  related: ['in-bond-shipment', 're-export', '/blog/customs-bond', '/guides/landed-cost'],
  tool: '/tools/landed-cost-calculator',
  toolPitch:
    'The landed cost calculator shows what a lot costs once duty and freight are added, which is the figure a warehouse withdrawal turns into cash out.',
  faq: [
    {
      q: 'Do you pay duty on goods in a bonded warehouse?',
      a: 'Not while they stay there. Duty is paid when goods are withdrawn for consumption, and goods withdrawn for export leave without paying U.S. duty.',
    },
    {
      q: 'How long can goods stay in a U.S. bonded warehouse?',
      a: 'Up to 5 years from the date of importation under 19 CFR 144.5, or longer if CBP grants a request showing good cause.',
    },
  ],
  sources: [
    'e5-usc-19-1557',
    'e5-cfr-19-19-1',
    'e5-cfr-19-144-38',
    'e5-cfr-19-144-1',
    'e5-cfr-19-144-5',
    'e5-cfr-19-19-11',
    'e5-cbp-ftz-about',
    'e5-gov-uk-customs-warehouse',
  ],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
