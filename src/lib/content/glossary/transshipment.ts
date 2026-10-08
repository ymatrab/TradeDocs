import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'transshipment',
  term: 'Transshipment',
  aliases: ['transhipment', 'trans-shipment', 'transshipment meaning', 'transshipment port'],
  demand: {
    keyword: 'transshipment',
    market: 'US',
    volume: 1_900,
    kd: 11,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Transshipment meaning in shipping and customs',
  description:
    'What transshipment means, how customs treats goods moved between ships at a hub port, and why routing through a third country does not change origin.',
  shortDefinition:
    'Transshipment is moving goods from one ship, plane or truck to another at an intermediate port or hub on the way to their destination. Under customs control the goods are not imported there, and the stop does not change their country of origin.',
  definition: [
    'In logistics the word describes a routing: cargo is unloaded at a hub and reloaded onto another vessel or vehicle for the next leg, because no direct service exists or because the hub connects more routes. Containers from a feeder ship are often moved to a larger mainline ship this way.',
    'Customs has a narrower meaning. The World Customs Organization’s Revised Kyoto Convention defines transhipment as the customs procedure under which goods are transferred under customs control from the importing means of transport to the exporting means of transport within the area of one customs office, which is both the office of importation and exportation. Goods admitted to it are not subject to duties and taxes if customs conditions are met, one goods declaration is enough, and a commercial or transport document can serve as that declaration’s description.',
    'What transshipment does not do is change where the goods come from. U.S. rules define the country of origin as the country of manufacture, production or growth, and only a substantial transformation in another country makes that country the origin. Relabelling or repacking goods at a hub to claim a different origin is evasion, not transshipment.',
  ],
  onYourDocuments: [
    'Your commercial invoice still states the true country of origin, whatever ports the goods pass through. The transport document shows the route: the port of loading, the port of discharge, and often the transshipment port or the vessel for each leg.',
    'Payment terms can turn on it too. A letter of credit can set conditions on the shipment, and the banks examine only the documents, so check that the booked routing and the bill of lading match what the credit says about transshipment before the goods sail.',
  ],
  example: {
    caption: 'Worked example with invented parties and an invented routing',
    paragraphs: [
      'Ostrava Valves (invented) sells to a buyer in Lima. The forwarder books a feeder from Hamburg to a hub port, where the container transfers to a South America service. The goods never leave customs control at the hub.',
    ],
    table: {
      caption: 'Invented example: what each document shows',
      head: ['Document', 'What it states'],
      rows: [
        ['Commercial invoice', 'Country of origin: Czech Republic (where the valves were made)'],
        [
          'Bill of lading',
          'Port of loading Hamburg; port of discharge Callao; transshipment at the hub',
        ],
        ['Packing list', 'Same packages, marks and weights as the invoice'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'Customs transit',
      difference:
        'Transit moves goods under customs control from one customs office to another, often across a territory; transshipment transfers them between means of transport within one office.',
    },
    {
      term: 'Re-export',
      difference:
        'A re-export sends out goods that were imported first. Transshipped goods are never imported at the hub.',
    },
  ],
  related: ['/guides/what-is-a-bill-of-lading', '/guides/export-payment-terms', 'consignor', 'teu'],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The invoice generator keeps the country of origin on every line, so a multi-leg route never changes what the invoice declares.',
  faq: [
    {
      q: 'Does transshipment change the country of origin?',
      a: 'No. Origin is where the goods were made, produced or grown. Under U.S. rules only a substantial transformation in another country changes it, so a stop at a hub port, or repacking there, leaves the origin on your invoice as it was.',
    },
    {
      q: 'Do I pay duty in the transshipment country?',
      a: 'Not when the goods stay under customs control. The WCO’s Revised Kyoto Convention provides that goods admitted to transhipment are not subject to duties and taxes, provided the customs conditions are met.',
    },
  ],
  sources: ['b7-wco-rkc-transhipment', 'b7-cfr-19-134-1', 'a4-icc-documentary-credits'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
