import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'master-carton',
  term: 'Master carton',
  aliases: ['master case', 'outer carton', 'shipping carton', 'export carton'],
  demand: {
    keyword: 'master carton',
    market: 'US',
    volume: 260,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Master carton: outer cartons, inner packs',
  description:
    'What a master carton is, how it relates to inner packs and pallets, and how to describe master cartons on a packing list so weights, counts and marks line up.',
  shortDefinition:
    'A master carton is the outer shipping carton that holds a set number of smaller units, such as inner packs or retail boxes. It is the package that gets the shipping marks and labels, and usually the unit a packing list counts.',
  definition: [
    'Goods are often packed in layers. A single item sits in its own retail box; several boxes go into an inner pack; and a fixed number of inner packs go into a master carton, the strong outer carton built to survive handling, stacking and transport. Master cartons are then stacked on pallets or loaded loose into a container.',
    'Because it is the outermost package of a shipment unit, the master carton is what carriers, warehouses and customs officers see. The ITA describes the packing list as itemising the contents of each package with weights and measurements, which in practice means one line per master carton or per group of identical cartons.',
    'The carton count also matters at receiving. GS1’s despatch advice guidelines say each delivered unit, pallet or carton, should be uniquely identified so the shipment can be checked against the electronic notice on arrival, and recommend the SSCC for that purpose.',
  ],
  onYourDocuments: [
    'On a packing list, give each master carton or carton range a number (for example cartons 1–40), the quantity of units inside, the net and gross weight and the outside dimensions. The same carton numbers should appear in the shipping marks stencilled or labelled on the cartons and, where the invoice lists marks and numbers, on the commercial invoice.',
    'Origin marking can land on the master carton too. For goods entering the United States, 19 CFR 134.22 requires the outermost container in which an article ordinarily reaches the ultimate purchaser to show the country of origin where the article itself is excepted from marking.',
  ],
  example: {
    caption: 'Worked example with invented parties and figures',
    paragraphs: [
      'Brightwell Kitchenware (invented) packs mugs six to an inner pack and eight inner packs to a master carton, so each master carton holds 48 mugs. An order of 1,920 mugs ships as 40 master cartons.',
    ],
    table: {
      caption: 'Invented example: the packing list line for the order',
      head: ['Cartons', 'Contents per carton', 'Units', 'Gross weight per carton', 'Dimensions'],
      rows: [['1–40', '8 inner packs × 6 mugs', '1,920 mugs', '14.2 kg', '60 × 40 × 35 cm']],
    },
  },
  confusedWith: [
    {
      term: 'Inner pack',
      difference:
        'An inner pack is the smaller box inside the master carton. Buyers may order or sell in inner-pack quantities, but the master carton is the shipping unit.',
    },
    {
      term: 'Pallet',
      difference:
        'A pallet is the platform that carries a stack of master cartons. A packing list can count both: so many pallets, holding so many cartons.',
    },
  ],
  related: [
    'cbm',
    '/blog/shipping-marks',
    '/blog/packing-list-example',
    '/blog/how-to-measure-a-box-for-shipping',
  ],
  tool: '/tools/pallet-calculator',
  toolPitch:
    'The pallet calculator works out how many master cartons fit on a pallet and what the loaded pallet weighs.',
  faq: [
    {
      q: 'What is the difference between a master carton and an inner carton?',
      a: 'The inner carton, or inner pack, holds a few units and sits inside the master carton. The master carton is the outer shipping box that carries the marks and is counted on the packing list.',
    },
    {
      q: 'How do I show master cartons on a packing list?',
      a: 'Number the cartons, state how many units each holds, and give the net and gross weight and outside dimensions per carton or per range of identical cartons, so the totals match the invoice quantity.',
    },
  ],
  sources: ['a2-trade-gov-packing-list', 'c6-gs1-desadv', 'c6-cfr-19-134-22'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
