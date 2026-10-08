import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "fob vs cfr" 50; "cfr vs fob" 50.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (v2 #47: who books the main
 * carriage).
 */
const article: ContentArticle = {
  slug: 'fob-vs-cfr',
  title: 'FOB vs CFR: who books the ship, and who carries the risk?',
  metaTitle: 'FOB vs CFR: who books the main carriage',
  description:
    'FOB and CFR pass risk at the same moment, once the goods are on board. They differ in who books and pays the ocean freight. What changes for the seller, the price and the documents.',
  lede: 'FOB and CFR are both sea rules, and under both the buyer takes over the risk once the goods are on board at the port of shipment. The question that separates them comes earlier: who calls the shipping line, books the space and pays the ocean freight to the destination port.',
  answer:
    'Under FOB (Free on Board) the buyer books and pays the main sea carriage, and the seller loads the goods on board the buyer’s vessel. Under CFR (Cost and Freight) the seller books and pays the freight to the named destination port. Under both Incoterms® 2020 rules, risk passes to the buyer once the goods are on board.',
  keyFacts: [
    'FOB and CFR are two of the four Incoterms® 2020 rules for sea and inland waterway transport only, published by the International Chamber of Commerce (ICC).',
    'Under FOB the named place is the port of shipment; under CFR it is the port of destination.',
    'HMRC’s customs valuation guidance places the passing of risk under both FOB and CFR at the moment the goods are on board the vessel.',
    'Under CFR the seller pays the costs and freight to the named port of destination, although the risk has already passed at loading.',
    'Neither FOB nor CFR obliges either party to insure the goods; CIF is the sea rule that adds insurance by the seller.',
  ],
  definitions: [
    {
      term: 'FOB (Free on Board)',
      meaning:
        'The seller delivers the goods on board the vessel the buyer has nominated at the named port of shipment.',
    },
    {
      term: 'CFR (Cost and Freight)',
      meaning:
        'The seller delivers the goods on board a vessel it has booked and pays the freight to the named port of destination.',
    },
    {
      term: 'Main carriage',
      meaning:
        'The principal international leg of the journey, here the ocean voyage between the two ports.',
    },
    {
      term: 'Port of shipment',
      meaning: 'The port where the goods are loaded on board the ocean vessel.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between FOB and CFR?',
      paragraphs: [
        'The difference is who contracts for the ocean freight. Under FOB the buyer chooses the shipping line or forwarder, books the space and pays the freight; the seller’s job ends when the goods are on board that vessel. Under CFR the seller makes the booking, pays the freight to the destination port and hands the buyer the transport document.',
        'Risk does not follow the freight. Under both rules the ICC’s Incoterms® 2020 rules place the transfer of risk at the port of shipment, once the goods are on board. So under CFR the seller pays for a voyage during which the goods are already at the buyer’s risk. That split between cost and risk is the part of CFR that surprises people.',
        'Everything else is the same. The seller clears the goods for export under both rules. The buyer clears them for import and pays any duty and import taxes under both. Neither rule requires anyone to insure the cargo.',
      ],
    },
    {
      heading: 'How do FOB and CFR compare side by side?',
      paragraphs: ['The table shows where the two rules agree and where they part.'],
      table: {
        caption: 'FOB and CFR compared under Incoterms® 2020',
        head: ['', 'FOB (Free on Board)', 'CFR (Cost and Freight)'],
        rows: [
          ['Transport modes', 'Sea and inland waterway only', 'Sea and inland waterway only'],
          ['Named place', 'Port of shipment', 'Port of destination'],
          ['Who books the vessel', 'Buyer', 'Seller'],
          ['Ocean freight paid by', 'Buyer', 'Seller'],
          ['Loading on board', 'Seller', 'Seller'],
          ['Risk passes', 'On board at the port of shipment', 'On board at the port of shipment'],
          ['Export clearance', 'Seller', 'Seller'],
          ['Import clearance, duty and taxes', 'Buyer', 'Buyer'],
          ['Insurance', 'Not required of either party', 'Not required of either party'],
        ],
      },
    },
    {
      heading: 'Why does risk pass at loading under CFR?',
      paragraphs: [
        'CFR is a shipment rule, not an arrival rule. The seller’s delivery obligation is complete when the goods are on board at the port of shipment, and the freight it pays is a cost it has agreed to carry, not a promise that the goods will arrive safely. If the cargo is lost at sea, the buyer bears the loss and has to claim against the carrier or its own insurer.',
        'That is why buyers on CFR terms usually arrange their own cargo insurance from the port of shipment. If the buyer wants the seller to buy that insurance, the rule is CIF, which adds a minimum level of cover to everything CFR includes; the CIF vs FOB article compares those two.',
        'Write the destination port precisely, because under CFR it decides how far the seller pays. Write the port of shipment as well, if you can, because it decides where risk passes. A CFR contract that names only the destination leaves the loading port open.',
      ],
    },
    {
      heading: 'Should a seller quote FOB or CFR?',
      paragraphs: [
        'Choose by who can buy the freight better and who wants control of the booking. CFR suits a seller with a forwarder or shipping line it trusts, regular sailings on the route and a buyer who would rather receive one price to its port. FOB suits a buyer that has its own freight contracts, or a seller that does not want to quote or manage ocean freight.',
        'Under FOB, delays on the buyer’s side become your problem in practice. If the buyer’s vessel is late or its forwarder misses the cut-off, your goods wait at the port. Under CFR you control the booking, the sailing and the cut-off, which also means you have to manage them.',
        'Both are sea rules for goods loaded at the ship’s side. If the goods leave you in a container handed over at a depot or terminal, look at the any-mode rules instead: FCA in place of FOB and CPT in place of CFR, which pass risk when the goods are handed to the carrier rather than when they are on board. The comparison between FCA and FOB explains why that matters.',
      ],
    },
    {
      heading: 'How do you build a CFR price from an FOB price?',
      paragraphs: [
        'A CFR price is the FOB price plus the ocean freight to the named destination port, along with any charges the shipping line bills to the shipper on that booking. Get the freight quote before you send the proforma, and check whether the surcharges are included in the rate or listed as separate lines. The article on ocean freight surcharges explains the common ones.',
        'The worked example below uses invented figures. Replace every number with your own quotes.',
      ],
      table: {
        caption: 'Worked example with invented figures: from FOB to CFR',
        head: ['Cost line', 'Amount (invented)', 'In FOB price?', 'In CFR price?'],
        rows: [
          ['Goods at ex-works price', '20,000.00', 'Yes', 'Yes'],
          ['Inland transport to the port', '600.00', 'Yes', 'Yes'],
          ['Export clearance and loading on board', '400.00', 'Yes', 'Yes'],
          ['Ocean freight and carrier charges to the destination port', '2,100.00', 'No', 'Yes'],
          ['Total quoted', '', '21,000.00', '23,100.00'],
        ],
      },
    },
    {
      heading: 'What should the documents say under FOB or CFR?',
      paragraphs: [
        'The rule, the named port and the version belong in the terms of sale on the proforma and on the commercial invoice, written exactly as in the contract: “FOB Felixstowe, Incoterms® 2020” or “CFR Durban, Incoterms® 2020”. A quotation on one rule and an invoice on another leaves both sides arguing over the same cost.',
        'Under CFR the freight is usually marked as prepaid on the bill of lading, because the seller pays it; under FOB it is usually collect. The article on freight prepaid and freight collect covers what those notations mean.',
        'Customs in the importing country reads the rule to understand what the invoice price covers. In the US, the transaction value set out in 19 U.S.C. § 1401a excludes international freight and insurance, so on a CFR invoice the freight should be shown as its own line so the importer can account for it. In the UK, HMRC includes transport costs up to the place of introduction into the UK in the customs value. Check the importing country’s rules.',
      ],
    },
  ],
  faq: [
    {
      q: 'Who loads the goods on board under CFR?',
      a: 'The seller, as under FOB. Under CFR the seller books the vessel, delivers the goods on board at the port of shipment and pays the freight to the named destination port.',
    },
    {
      q: 'Who pays freight under FOB?',
      a: 'The buyer. Under FOB the buyer contracts and pays for the main carriage from the port of shipment. The seller pays the costs up to loading on board, including export clearance.',
    },
    {
      q: 'Does CFR include insurance?',
      a: 'No. CFR includes the freight to the destination port but no insurance obligation. If the seller should insure the goods for the buyer, the rule is CIF.',
    },
    {
      q: 'Can CFR be used for air freight?',
      a: 'No. CFR is one of the four Incoterms® 2020 rules for sea and inland waterway transport only. For air freight the equivalent arrangement is CPT, Carriage Paid To, with the destination airport or place named.',
    },
    {
      q: 'Which is cheaper for the buyer, FOB or CFR?',
      a: 'It depends on who can buy the freight for less. Under CFR the buyer pays the freight through the seller’s price; under FOB it pays the carrier directly. Compare the CFR price with the FOB price plus the buyer’s own freight quote.',
    },
  ],
  sources: [
    'c3-icc-incoterms-2020',
    'c3-hmrc-incoterms',
    'c3-ita-know-your-incoterms',
    'c3-usc-19-1401a',
    'c3-hmrc-delivery-costs',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/export-price-calculator', '/tools/invoice-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/export-price-calculator',
    title: 'Turn an ex-works price into FOB and CFR',
    text: 'The export price calculator adds the inland, clearance, loading and freight costs you enter and shows the FOB and CFR prices side by side. It uses no rates of its own.',
  },
  related: [
    '/blog/cif-vs-fob',
    '/blog/fca-vs-fob',
    '/blog/cif-vs-cip',
    '/blog/freight-prepaid-vs-freight-collect',
    '/blog/exw-vs-fob',
    '/blog/fob-price',
  ],
  cover: {
    id: 'psf4UVSTgCY',
    src: 'https://images.unsplash.com/photo-1601631547344-1b6948ea55c2',
    width: 5472,
    height: 3648,
    alt: 'Container lowered onto a guided vehicle at the Port of Rotterdam, at the quayside where FOB and CFR pass risk',
    caption: 'Container being loaded at the Port of Rotterdam',
    photographer: { name: 'Bernd Dittrich', profile: 'https://unsplash.com/@hdbernd' },
    page: 'https://unsplash.com/photos/blue-and-yellow-plastic-crates-psf4UVSTgCY',
  },
};

export default article;
