import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'anti-dumping-duty',
  term: 'Anti-dumping duty (AD)',
  abbreviation: 'AD',
  aliases: ['antidumping duty', 'anti dumping duty', 'dumping duty', 'AD/CVD'],
  demand: {
    keyword: 'anti dumping duty',
    market: 'US',
    volume: 590,
    kd: 29,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Anti-dumping duty: what dumping is and how the duty works',
  description:
    'What dumping means in trade law, how an anti-dumping investigation leads to an extra import duty, who collects it in the United States, and what it changes for an importer.',
  shortDefinition:
    'An anti-dumping duty is an extra import duty charged on a product from a particular country when an investigation finds it is exported below its normal value, usually the price in the exporter’s home market, and that this is injuring the importing country’s industry.',
  definition: [
    'The WTO describes dumping as a company exporting a product at a price lower than it normally charges on its own home market. The WTO agreement does not judge the company; it disciplines how governments may react. Broadly, it allows action against dumping where there is genuine, material injury to the competing domestic industry, and the government must show that dumping is taking place, calculate how far the export price falls below normal value, and show that the dumping is causing or threatening injury.',
    'The usual response is extra import duty on the particular product from the particular exporting country, to bring its price closer to normal value or remove the injury. The agreement sets out how normal value may be calculated, how investigations are opened and run so that interested parties can give evidence, and that measures expire five years after they are imposed unless a review shows ending them would lead to injury. An exporter may instead undertake to raise its price.',
    'In the United States, Commerce investigates the dumping, the U.S. International Trade Commission decides on injury, and CBP collects the duties, beginning with cash deposits after affirmative preliminary determinations.',
  ],
  onYourDocuments: [
    'An anti-dumping duty has no field on the commercial invoice, but the invoice is what the broker checks it against. Orders are defined by product and by country, so a precise description, the producer’s and exporter’s names and the country of origin decide whether a shipment falls within an order’s scope.',
    'Do not change a description to move goods out of an order. Getting the scope wrong can leave the importer owing the duty later; ask the broker, and where the scope is unclear, CBP’s AD/CVD pages point to Commerce’s process for requesting a scope ruling.',
  ],
  example: {
    caption: 'Worked example with invented parties; no real case or rate is shown',
    paragraphs: [
      'Meadowbrook Hardware (invented) sources fasteners from a new supplier. Before placing the order, its broker compares the supplier’s product description and country of origin with the anti-dumping orders in effect and finds one that covers the product. Meadowbrook asks for a quote from a supplier in another country as well and compares the two landed costs.',
    ],
  },
  confusedWith: [
    {
      term: 'Countervailing duty',
      difference:
        'A countervailing duty offsets a subsidy from the exporting country’s government. An anti-dumping duty offsets an export price below normal value. One product can be subject to both.',
    },
    {
      term: 'Customs duty',
      difference:
        'Ordinary customs duty applies to every import of a product under the tariff. An anti-dumping duty is an additional charge on that product from the countries an order names.',
    },
  ],
  related: ['/blog/duty-vs-tariff', '/blog/how-to-calculate-import-duty', '/guides/landed-cost', 'importing'],
  tool: '/tools/landed-cost-calculator',
  toolPitch:
    'The landed cost calculator lets you add a duty rate your broker confirms and see the total cost of a shipment before you commit.',
  faq: [
    {
      q: 'What counts as dumping?',
      a: 'Exporting a product at a price lower than its normal value, which the WTO agreement mainly measures by the price the exporter charges in its own home market. Dumping alone is not enough for a duty: it must also be shown to injure the importing country’s industry.',
    },
    {
      q: 'Who decides on an anti-dumping duty in the United States?',
      a: 'The Department of Commerce determines whether dumping occurs and by how much, the U.S. International Trade Commission determines whether the domestic industry is injured, and CBP collects the duty on imports.',
    },
  ],
  sources: ['c6-wto-trade-remedies', 'c6-trade-gov-adcvd-faq', 'c6-cbp-adcvd'],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
