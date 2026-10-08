import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'single-administrative-document',
  term: 'Single Administrative Document (SAD)',
  abbreviation: 'SAD',
  aliases: ['SAD', 'C88', 'EU customs declaration form'],
  demand: {
    keyword: 'single administrative document',
    market: 'US',
    volume: 210,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Single Administrative Document (SAD) explained',
  description:
    'What the Single Administrative Document is, how its copies split between export, transit and import, how it relates to today’s electronic EU declarations, and what your invoice feeds into it.',
  shortDefinition:
    'The Single Administrative Document (SAD) is the standard customs declaration format of the European Union, used to place goods under export, transit, import and other customs procedures. It was designed as a paper set of eight copies, one for each party and stage.',
  definition: [
    'Before the SAD, each country had its own forms. The SAD gave the EU one layout for every customs procedure, drawn up to the United Nations layout key so the same box means the same thing everywhere.',
    'The European Commission’s description of the form explains its design: a set of eight copies, each with a job. Copies 1, 2 and 3 serve export, kept by the country of export, used for its statistics and returned to the exporter. Copies 1, 4 and 5 serve transit, and copies 6, 7 and 8 serve import, kept by the country of destination, used for its statistics and returned to the consignee. The copies are defined in an annex to Delegated Regulation (EU) 2016/341.',
    'Declarations are now lodged electronically, as Ireland’s Revenue requires for example, but the SAD remains the shorthand for them. The U.S. International Trade Administration still describes the SAD as the EU importer’s declaration, covering customs duties and VAT, valid in all Member States and filed by the importer or its agent.',
  ],
  onYourDocuments: [
    'You do not complete the SAD as an exporter shipping to the EU; the importer’s broker does. But most of what goes into it comes from your commercial invoice and packing list: the consignor and consignee, the description and commodity code of each item, its country of origin, the number and kind of packages, gross and net weights, the invoice value and currency, and the Incoterms® rule.',
    'Quote the importer’s EORI number on the invoice too, because the declarant is identified by it, and keep invoice and packing list figures identical so the declaration does not need correcting.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Redwood Audio (invented) of California sells speakers to a retailer in Vienna, DAP. The retailer’s Austrian broker lodges the import declaration electronically, using Redwood’s invoice for the value, origin and commodity codes and its packing list for the package count and weights.',
      'Redwood’s only extra task was to add the retailer’s EORI number and the Incoterms® rule to the invoice before shipping.',
    ],
  },
  confusedWith: [
    {
      term: 'Entry summary declaration (ENS)',
      difference:
        'The ENS is a security filing made before goods reach the EU. The SAD-format customs declaration places the goods under a procedure and settles duty and VAT.',
    },
  ],
  related: [
    'customs-declaration',
    '/guides/eori-number',
    '/blog/shipping-to-the-uk-and-eu-documents',
    '/guides/transit-declarations-t1-ncts',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator lays out the parties, codes, origin, weights and value per line, the data an EU broker transfers into the SAD-format declaration.',
  faq: [
    {
      q: 'Is the Single Administrative Document still used?',
      a: 'The paper set is now uncommon, because declarations are lodged electronically, but the name lives on. The ITA still describes the SAD as the EU importer’s declaration for customs duties and VAT.',
    },
    {
      q: 'Who fills in the SAD for goods imported into the EU?',
      a: 'The declarant, which is the importer or an agent acting for it, usually a customs broker established in the EU. The exporter supplies the invoice and packing list the declaration is built from.',
    },
  ],
  sources: [
    'd5-ec-sad-form',
    'trade-gov-ccg-eu',
    'c6-zoll-release-free-circulation',
    'c4-ec-eori',
    'd5-revenue-new-to-customs',
  ],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
