import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'freight-all-kinds',
  term: 'Freight all kinds (FAK)',
  abbreviation: 'FAK',
  aliases: ['FAK rate', 'freight of all kinds', 'FAK freight'],
  demand: {
    keyword: 'freight all kinds',
    market: 'US',
    volume: 4_400,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Freight all kinds (FAK): what an FAK rate means',
  description:
    'What freight all kinds means, how an FAK rate differs from a commodity rate or freight class, and why your documents must still describe the goods accurately.',
  shortDefinition:
    'Freight all kinds (FAK) is a pricing arrangement in which a carrier charges one rate for a mix of different goods instead of rating each commodity or freight class separately. It simplifies quotes; it does not change how the goods must be described.',
  definition: [
    'Carriers normally price by what the goods are. An ocean carrier’s tariff can carry commodity rates, which U.S. rules describe as rates for a commodity specifically named or described in the tariff between specific places. In U.S. less-than-truckload freight, the National Motor Freight Classification assigns classes based on density, handling, stowability and liability.',
    'An FAK rate sets those differences aside for pricing. The National Motor Freight Traffic Association, which publishes the NMFC, describes FAK as a pricing method in which a carrier charges a single rate for several types of freight grouped together, for example rating items that classify at different classes all at one class. It stresses that FAKs are not part of the NMFC and are not maintained or regulated by NMFTA: they are private agreements between the parties.',
    'Whatever the mode, an FAK agreement covers price only. It binds the carrier and the customer who signed it, and its own terms say which goods, lanes and surcharges it includes.',
  ],
  onYourDocuments: [
    'FAK appears on the freight quote, the rate agreement or the freight invoice, not on your commercial invoice. The commercial invoice and packing list still describe each product precisely, with its quantity, weight and value, because customs classifies and values the goods line by line.',
    'The bill of lading must describe the goods accurately too. NMFTA warns that if freight differs significantly from what was represented, the carrier can reclass it on its true characteristics and add charges, and that describing goods correctly on the bill of lading stays the shipper’s responsibility.',
  ],
  example: {
    caption: 'Worked example with invented parties and invented figures',
    paragraphs: [
      'Brightwater Home Goods (invented) ships lamps, cushions and picture frames to one buyer. Its forwarder quotes one FAK price for the container. The freight is priced once, but every document keeps the three products apart.',
    ],
    table: {
      caption: 'Invented example: one freight price, three described products',
      head: ['Line on the commercial invoice', 'Cartons', 'Gross weight'],
      rows: [
        ['Table lamps, ceramic base', '40', '520 kg'],
        ['Cushions, cotton cover', '60', '300 kg'],
        ['Picture frames, wood', '25', '410 kg'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'Commodity rate',
      difference:
        'A commodity rate applies to a commodity named in the carrier’s tariff; an FAK rate applies one price across mixed goods.',
    },
    {
      term: 'Consolidation',
      difference:
        'Consolidation combines several shippers’ cargo in one container. FAK is about how the freight is priced, whoever owns the goods.',
    },
  ],
  related: ['/guides/landed-cost', '/guides/lcl-vs-fcl', 'cbm', 'nvocc'],
  tool: '/tools/landed-cost-calculator',
  toolPitch:
    'The landed cost calculator adds your FAK freight to the goods value so you can see the delivered cost of each product.',
  faq: [
    {
      q: 'What does FAK mean on a freight quote?',
      a: 'Freight all kinds: the carrier charges one rate for a mix of goods rather than a separate rate for each commodity or freight class. Read the quote for the surcharges and the cargo it excludes, since the FAK agreement sets its own terms.',
    },
    {
      q: 'Can I describe my goods as FAK on the bill of lading?',
      a: 'No. FAK is a pricing term. The bill of lading, commercial invoice and packing list still need an accurate description of the goods, and NMFTA notes that misdescribed freight can be reclassed and charged at its true class.',
    },
  ],
  sources: ['b7-nmfta-fak', 'b7-cfr-46-520-2'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
