import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "fob price" 1,300, KD 1; "fob value" 70, KD 8;
 * "export pricing" 40 (section).
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'fob-price',
  title: 'FOB price: what it includes and how to work it out',
  metaTitle: 'FOB price: what it includes and how to calculate',
  description:
    'An FOB price covers the goods up to the moment they are on board the ship. The costs that sit inside it, how to build it from an EXW cost, and how buyers turn it into landed cost.',
  lede: 'Buyers ask for an FOB price because it lets them compare suppliers on the same footing and add their own freight. To quote one you need to know which costs are yours until the goods are loaded, and which stop being yours the moment they are on board.',
  answer:
    'An FOB price is the price of goods delivered on board the vessel at a named port of shipment, under the ICC’s Incoterms® 2020 FOB rule. It includes the goods, export packing, transport to the port, export clearance and loading. It excludes ocean freight, insurance and import duties and taxes, which the buyer pays.',
  keyFacts: [
    'FOB (Free on Board) is one of the eleven Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'Under the ICC’s FOB rule, the seller delivers when the goods are on board the vessel at the named port of shipment, and risk passes there.',
    'FOB is a rule for sea and inland waterway transport only; Incoterms® 2020 offers FCA for containers handed over before loading and for other modes.',
    'Under 19 U.S.C. § 1401a, the price used for US customs value excludes international freight, insurance and related services to the United States.',
    'The WTO Customs Valuation Agreement lets each member decide whether freight and insurance to the place of import are part of customs value.',
  ],
  definitions: [
    {
      term: 'FOB price',
      meaning:
        'A quoted price that covers the goods and all costs until they are loaded on board at the named port.',
    },
    {
      term: 'EXW cost',
      meaning:
        'The price of the goods made available at the seller’s premises, before any export packing, transport or clearance.',
    },
    {
      term: 'Named port of shipment',
      meaning: 'The port written after “FOB”, where the goods are loaded and delivery happens.',
    },
    {
      term: 'Landed cost',
      meaning:
        'What the goods cost the buyer once delivered and cleared: the price plus freight, insurance, duty, taxes and fees.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does an FOB price mean?',
      paragraphs: [
        'An FOB price is a promise about where your costs stop. Under the ICC’s Incoterms® 2020 rules, FOB means the seller delivers the goods on board the vessel the buyer has nominated, at the named port of shipment. Every cost up to that point is in your price; every cost after it belongs to the buyer.',
        'That is why the rule only works with a port. “FOB Ningbo, Incoterms® 2020” is a complete term. “FOB factory” or “FOB our warehouse” is not, because nothing is loaded on board a ship at a factory. If the goods leave your premises in a container or by road, the FCA rule at your premises or the forwarder’s depot describes the handover correctly.',
      ],
    },
    {
      heading: 'Which costs are included in an FOB price?',
      paragraphs: [
        'Everything the seller pays to get the goods made, packed, moved to the port, cleared for export and loaded. The table compares FOB with the two rules buyers most often ask for alongside it.',
        'Charges at the origin terminal deserve a line of their own in the quotation. Who pays which terminal charge can depend on the carrier’s tariff and the forwarder’s invoice as well as on the rule, so state which origin port charges your FOB price includes.',
      ],
      table: {
        caption: 'Who pays each cost under EXW, FOB and CIF (Incoterms® 2020)',
        head: ['Cost', 'EXW price', 'FOB price', 'CIF price'],
        rows: [
          ['Goods at the seller’s premises', 'Included', 'Included', 'Included'],
          ['Export packing', 'Included', 'Included', 'Included'],
          ['Transport to the port of shipment', 'Buyer', 'Included', 'Included'],
          ['Export clearance', 'Buyer', 'Included', 'Included'],
          ['Loading on board', 'Buyer', 'Included', 'Included'],
          ['Ocean freight', 'Buyer', 'Buyer', 'Included'],
          [
            'Insurance for the voyage',
            'Buyer (not required)',
            'Buyer (not required)',
            'Included (minimum cover)',
          ],
          ['Import clearance, duties and taxes', 'Buyer', 'Buyer', 'Buyer'],
        ],
      },
    },
    {
      heading: 'How do you calculate an FOB price from an EXW cost?',
      paragraphs: [
        'Start from your EXW price, the figure at which you would sell the goods at your door, and add each cost you carry until loading. Get the inland and port figures in writing from your haulier and forwarder, because those are the numbers that change between quotes.',
      ],
      steps: [
        'Take your EXW price for the order, including your margin.',
        'Add export packing that the buyer’s order needs beyond your normal packing.',
        'Add transport from your premises to the named port of shipment.',
        'Add export clearance: the forwarder’s or broker’s charge for the export declaration and any licence work.',
        'Add the origin port and loading charges your forwarder quotes for this booking.',
        'Divide the total by the quantity to get a unit FOB price, and round as your price list does.',
        'Write the rule, the named port and the version on the quotation: “FOB Ningbo, Incoterms® 2020”.',
      ],
    },
    {
      heading: 'What does a worked FOB price look like?',
      paragraphs: [
        'Here is the calculation for one order. The supplier, the goods and every figure are invented; use your own quotes.',
      ],
      table: {
        caption: 'Worked example with an invented supplier and invented figures (USD)',
        head: ['Line', 'Amount', 'Running total'],
        rows: [
          ['EXW price: 2,000 ceramic mugs at 8.00', '16,000.00', '16,000.00'],
          ['Export cartons and pallet wrapping', '240.00', '16,240.00'],
          ['Truck from factory to the port of shipment', '450.00', '16,690.00'],
          ['Export declaration by the forwarder', '120.00', '16,810.00'],
          ['Origin port and loading charges', '300.00', '17,110.00'],
          ['FOB price, 2,000 units', '17,110.00', '8.56 per unit (rounded)'],
        ],
      },
    },
    {
      heading: 'Is an FOB price the same as FOB value?',
      paragraphs: [
        'Not quite. The FOB price is the figure in your sale contract. “FOB value” is a valuation basis customs authorities and statistics use: the value of the goods at the point of export, without the international freight and insurance.',
        'Countries choose which basis they use. The WTO Customs Valuation Agreement makes the transaction value the main method and leaves each member to decide whether freight and insurance to the place of import are added. In the United States, 19 U.S.C. § 1401a defines the price actually paid or payable without the costs of transport, insurance and related services from the country of exportation to the United States. Many other countries add those costs, valuing on a CIF basis.',
        'For you as a seller, the practical point is to keep the invoice transparent. Under 19 CFR 141.86, an invoice for a US import itemises charges such as freight, insurance and packing, though packing and inland freight to the port need not be listed by amount if they are included in the price and identified as included.',
      ],
    },
    {
      heading: 'How does a buyer turn your FOB price into landed cost?',
      paragraphs: [
        'The buyer adds everything after loading. The ocean freight and any insurance they arrange, then the import side: customs duty on the importing country’s valuation basis, import taxes, the broker’s fees and delivery from the port of discharge.',
        'This is why a clean FOB quote helps you sell. A buyer comparing three suppliers can add the same freight and duty assumptions to each and see the real difference. A quote that hides origin charges, or names an inland place, makes that comparison harder and invites a dispute later.',
        'If the buyer asks you for CIF instead, you take on the freight and the minimum insurance cover under the ICC’s rule, and your price has to include them. Ask your forwarder for the freight before you convert the price, and keep the FOB figure in your records so you can show what changed.',
      ],
    },
    {
      heading: 'When should you quote FCA instead of FOB?',
      paragraphs: [
        'When the goods are handed over before they reach the ship’s side. Under FOB you carry the risk until the goods are on board, which can be days after you hand a container to a terminal. The Incoterms® 2020 FCA rule moves the risk at the handover instead, and works for any transport.',
        'Many buyers still ask for “FOB prices” out of habit. You can quote the same cost build-up under FCA, at your premises or the forwarder’s depot, and explain that the price covers the same costs up to the handover. The comparison of the two rules is in FCA vs FOB.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does an FOB price include shipping?',
      a: 'It includes transport to the port of shipment and loading on board, but not the ocean freight. The buyer contracts and pays for the main carriage under FOB.',
    },
    {
      q: 'Who pays insurance under FOB?',
      a: 'Neither party is obliged to insure under the Incoterms® 2020 FOB rule. The buyer carries the risk after loading, so the buyer usually decides whether to insure the voyage.',
    },
    {
      q: 'Can I quote an FOB price for air freight?',
      a: 'Not under the Incoterms® rules, where FOB is for sea and inland waterway transport. For air freight, FCA at the airport or the forwarder’s premises fits.',
    },
    {
      q: 'Is the FOB price the figure customs uses for duty?',
      a: 'It depends on the importing country. The US values imports without international freight and insurance; many countries add them. The importer declares the value, so the invoice should show what the price includes.',
    },
    {
      q: 'Should the commercial invoice show the FOB price per unit?',
      a: 'Yes. Show the unit price and the line total for each item, the currency and the term, such as “FOB Ningbo, Incoterms® 2020”, so customs can see what the price covers.',
    },
  ],
  sources: [
    'icc-incoterms-2020',
    'wto-customs-valuation',
    'w2-cornell-19-usc-1401a',
    'us-cbp-invoice-contents',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/proforma-invoice-generator', '/tools/incoterms'],
  callout: {
    afterSection: 3,
    tool: '/tools/proforma-invoice-generator',
    title: 'Put the FOB price on a quotation',
    text: 'Enter the unit price, the rule and the named port, and the proforma generator lays out the quotation your buyer can approve.',
  },
  related: [
    '/blog/fca-vs-fob',
    '/guides/dap-vs-ddp',
    '/blog/proforma-invoice-example',
    '/blog/commercial-invoice-requirements',
    '/guides/proforma-vs-commercial-invoice',
  ],
  cover: {
    id: 'd3766qQNQIY',
    src: 'https://images.unsplash.com/photo-1564035105550-e1f02aa8556b',
    width: 4032,
    height: 3024,
    alt: 'Ship at the quay beside stacked containers in the Port of Colombo, the point where an FOB price stops',
    caption: 'Ship alongside container stacks in the Port of Colombo, Sri Lanka',
    photographer: { name: 'Nilantha Ilangamuwa', profile: 'https://unsplash.com/@ilangamuwa' },
    page: 'https://unsplash.com/photos/ship-on-dock-near-shipping-containers-d3766qQNQIY',
  },
};

export default article;
