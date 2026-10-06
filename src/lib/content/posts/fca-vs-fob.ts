import { BYLINE, type ContentArticle } from '@/lib/content/article';

const BLOG_ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-05): "fca vs fob" 720, one of the Incoterm pairs the
 * plan lists for the blog.
 */
const article: ContentArticle = {
  slug: 'fca-vs-fob',
  title: 'FCA vs FOB: which Incoterms® 2020 rule fits your shipment?',
  metaTitle: 'FCA vs FOB: the difference in Incoterms 2020',
  description:
    'FCA and FOB both leave the main carriage to the buyer. They differ in where risk passes, which transport they suit and what happens with containers. The ICC positions, compared.',
  lede: 'FOB is the trade term most exporters learned first, and FCA is the one that matches how most goods now travel. They look similar on a quotation. Where they differ is the moment the seller stops carrying the risk.',
  answer:
    'Under FCA (Free Carrier) the seller delivers the goods, cleared for export, to the buyer’s carrier at a named place, and risk passes there. Under FOB (Free on Board) the seller delivers on board the vessel at the named port of shipment. FCA suits any transport, containers included; FOB is a sea and inland waterway rule.',
  keyFacts: [
    'FCA and FOB are two of the eleven Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'Under FCA, risk passes when the goods are handed to the buyer’s nominated carrier at the named place.',
    'Under FOB, risk passes when the goods are on board the vessel at the named port of shipment.',
    'FCA works for any mode of transport; FOB is for sea and inland waterway transport only.',
    'Incoterms® 2020 lets FCA parties agree that the buyer’s carrier will issue an on-board bill of lading to the seller.',
  ],
  definitions: [
    {
      term: 'FCA (Free Carrier)',
      meaning:
        'The seller hands the goods, cleared for export, to the buyer’s carrier at a named place.',
    },
    {
      term: 'FOB (Free on Board)',
      meaning:
        'The seller loads the goods on board the buyer’s vessel at the named port of shipment.',
    },
    {
      term: 'Named place',
      meaning: 'The point written after the rule, where delivery happens and risk passes.',
    },
    {
      term: 'On-board bill of lading',
      meaning:
        'A bill of lading noting that the goods have been loaded on the ship, often required by letters of credit.',
    },
  ],
  published: BLOG_ROUND,
  updated: BLOG_ROUND,
  reviewed: BLOG_ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What do FCA and FOB mean?',
      paragraphs: [
        'Both are rules in the Incoterms® 2020 set, published by the International Chamber of Commerce. In both, the seller clears the goods for export and the buyer contracts and pays for the main carriage, import clearance and everything after delivery. Neither obliges either party to insure.',
        'The difference is the delivery point. FCA, Free Carrier, delivers when the goods are handed to the carrier the buyer has nominated, at a named place such as the seller’s warehouse, a forwarder’s depot or a container terminal. FOB, Free on Board, delivers when the goods are on board the vessel the buyer has nominated, at a named port of shipment.',
      ],
    },
    {
      heading: 'What is the difference between FCA and FOB?',
      paragraphs: ['Most of the obligations are the same. The table shows where they part.'],
      table: {
        caption: 'FCA and FOB compared under Incoterms® 2020',
        head: ['', 'FCA (Free Carrier)', 'FOB (Free on Board)'],
        rows: [
          ['Transport modes', 'Any, including multimodal', 'Sea and inland waterway only'],
          [
            'Delivery point',
            'Handover to the buyer’s carrier at the named place',
            'On board the vessel at the named port',
          ],
          ['Risk passes', 'At that handover', 'Once the goods are on board'],
          ['Export clearance', 'Seller', 'Seller'],
          ['Main carriage', 'Buyer contracts and pays', 'Buyer contracts and pays'],
          [
            'Loading',
            'Seller loads only if the named place is its own premises',
            'Seller loads on board',
          ],
          ['Insurance', 'Not required of either party', 'Not required of either party'],
          [
            'Typical cargo',
            'Containers, air, road, rail, courier',
            'Bulk and break-bulk loaded at the ship’s side',
          ],
        ],
      },
    },
    {
      heading: 'Why is FOB a poor fit for container shipments?',
      paragraphs: [
        'A container is usually handed over at a terminal or depot, often days before it is lifted on board. Under FOB the seller still carries the risk during that wait, for goods it no longer controls and cannot inspect. If the container is damaged in the terminal, the loss sits with the party that had no way to prevent it.',
        'FCA moves the risk at the handover, which is what actually happens. That is why FCA is the usual recommendation for containerised cargo, and why FOB is better kept for cargo the seller can see loaded onto the ship, such as bulk commodities.',
        'Habit keeps FOB in use. Buyers ask for “FOB prices” and sellers quote them, sometimes with an inland place such as “FOB factory” that the rule does not allow. If the goods will leave in a container from your premises or a depot, quote FCA and name that place.',
      ],
    },
    {
      heading: 'Can you get an on-board bill of lading under FCA?',
      paragraphs: [
        'This was the main practical objection to FCA: a letter of credit often asks for a bill of lading marked “on board”, and under FCA the seller delivers before the goods are loaded. Incoterms® 2020 added an option for exactly this case.',
        'If the parties agree it, the buyer must instruct its carrier to issue an on-board bill of lading to the seller after loading. The carrier is not a party to the sale contract, so the rules cannot oblige it to do so; the buyer’s instruction is what makes it happen. Agree the option in the contract and check the letter of credit matches.',
      ],
    },
    {
      heading: 'How should the named place be written?',
      paragraphs: [
        'Under both rules the place decides who pays for what, so write it precisely and add the version.',
      ],
      list: [
        'FCA at the seller’s premises: “FCA Leeds, seller’s warehouse, 12 Example Road, Incoterms® 2020”. The seller loads the buyer’s vehicle.',
        'FCA anywhere else: “FCA Felixstowe, forwarder’s depot, Incoterms® 2020”. The seller delivers ready for unloading.',
        'FOB: “FOB Durban, Incoterms® 2020”. A port of shipment, never an inland place.',
      ],
    },
    {
      heading: 'What should the invoice say under FCA or FOB?',
      paragraphs: [
        'The rule, the named place and the version belong in the terms of sale on the proforma and the commercial invoice, written exactly as in the contract. Customs in the importing country reads that line to understand what the invoice price covers.',
        'Under both FCA and FOB the price normally excludes the main freight and insurance, because the buyer pays for them. Where the importing country values goods on a basis that includes freight and insurance, the importer adds those costs at entry, so a correct rule on the invoice saves questions about missing charges.',
        'If you switch a customer from FOB to FCA, change the wording on every document at the same time, and tell the buyer’s forwarder where the handover now happens. The forwarder’s booking, the bill of lading and the invoice should all describe the same delivery point.',
      ],
    },
    {
      heading: 'Should you quote FCA or FOB?',
      paragraphs: [
        'Choose by how the goods actually leave you. A short decision path:',
        'Whichever you choose, write the same rule, place and version on the proforma, the commercial invoice and the packing list. A quotation that says FOB and an invoice that says FCA leave both sides arguing over the same loss.',
      ],
      steps: [
        'If the goods travel by air, road, rail or courier, use FCA; FOB does not apply.',
        'If they travel in a container handed over at your premises, a depot or a terminal, use FCA and name that place.',
        'If they are bulk or break-bulk cargo loaded at the ship’s side under your supervision, FOB fits.',
        'If a letter of credit requires an on-board bill of lading under FCA, agree the Incoterms® 2020 bill of lading option with the buyer.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is FCA the same as FOB?',
      a: 'No. Under FCA risk passes when the goods are handed to the buyer’s carrier at the named place; under FOB it passes when they are on board the vessel. FCA works for any transport; FOB only for sea and inland waterway.',
    },
    {
      q: 'Who pays freight under FCA and FOB?',
      a: 'The buyer, under both. The seller pays the costs up to delivery, plus export clearance.',
    },
    {
      q: 'Can FOB be used for air freight?',
      a: 'Not under the Incoterms® rules. FOB is a sea and inland waterway rule; for air freight the equivalent is FCA at the airport or the forwarder’s premises.',
    },
    {
      q: 'Which is better for the seller, FCA or FOB?',
      a: 'For container cargo, FCA usually is, because the seller stops carrying the risk when it hands the container over rather than when the ship is loaded days later.',
    },
    {
      q: 'Does FOB mean the seller pays for loading?',
      a: 'Yes. Under FOB the seller delivers on board the vessel, so loading at the port of shipment is the seller’s cost and risk. Under FCA the seller loads only when the named place is its own premises.',
    },
  ],
  sources: ['icc-incoterms-2020', 'trade-gov-commercial-invoice', 'wto-customs-valuation'],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/invoice-generator', '/tools/landed-cost-calculator'],
  callout: {
    afterSection: 1,
    tool: '/tools/incoterms',
    title: 'Compare all eleven rules on one chart',
    text: 'The Incoterms® 2020 guide sets out where risk passes and who pays what for every rule, with a page for FCA and for FOB.',
  },
  cover: {
    id: '4aOhA4ptIY4',
    src: 'https://images.unsplash.com/photo-1597334948330-38795f25d05d',
    width: 5897,
    height: 3931,
    alt: 'Container ship in the port of Hamburg, where the FCA and FOB rules place the handover differently',
    caption: 'Container ship in the port of Hamburg, Germany',
    photographer: { name: 'Dominik Lückmann', profile: 'https://unsplash.com/@exdigy' },
    page: 'https://unsplash.com/photos/blue-and-red-cargo-ship-4aOhA4ptIY4',
  },
};

export default article;
