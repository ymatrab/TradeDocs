import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "cif vs dap" 50.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (new in v3, comparison).
 */
const article: ContentArticle = {
  slug: 'cif-vs-dap',
  title: 'CIF vs DAP: both pay freight to the destination, but risk differs',
  metaTitle: 'CIF vs DAP: risk, cost and the named place',
  description:
    'Under CIF and DAP the seller pays freight to the buyer’s country, yet risk passes at opposite ends of the voyage. Where each rule ends, what it costs and what to invoice.',
  lede: 'A CIF price and a DAP price can look alike on a quotation: both include the freight to the buyer’s country. The similarity stops there. One rule hands the risk to the buyer before the ship sails; the other keeps it with you until the goods reach the buyer’s door.',
  answer:
    'Under CIF (Cost, Insurance and Freight) the seller pays sea freight and minimum insurance to the destination port, but risk passes to the buyer once the goods are on board at the port of shipment. Under DAP (Delivered at Place) the seller pays and carries the risk all the way to the named place, usually the buyer’s premises.',
  keyFacts: [
    'CIF and DAP are two of the eleven Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'The ICC reserves CIF for maritime trade; DAP can be used for any mode of transport.',
    'Under CIF, HMRC’s guidance says risk passes when the goods are on the ship at the port of shipment.',
    'Under DAP, HMRC’s guidance says the seller bears all risks of bringing the goods to the named place.',
    'Only CIF obliges the seller to insure; the ICC keeps Institute Cargo Clauses (C) as its default level of cover.',
  ],
  definitions: [
    {
      term: 'CIF (Cost, Insurance and Freight)',
      meaning:
        'The seller delivers on board the vessel at the port of shipment, pays freight to the named port of destination and buys minimum insurance for the buyer.',
    },
    {
      term: 'DAP (Delivered at Place)',
      meaning:
        'The seller delivers when the goods arrive at the named destination on the delivering vehicle, ready for the buyer to unload.',
    },
    {
      term: 'Port of destination',
      meaning:
        'The port named after CIF, where the freight the seller pays for ends; the goods still have to be moved inland from there.',
    },
    {
      term: 'On-carriage',
      meaning:
        'Transport from the arrival port or airport to the final place, such as a truck from the quay to the buyer’s warehouse.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between CIF and DAP?',
      paragraphs: [
        'The difference is where risk passes and where the seller’s costs stop. Both rules are part of the Incoterms® 2020 set from the ICC, and under both the seller books and pays the main carriage. Under CIF the seller’s costs stop at the destination port but its risk stops much earlier, on board at the port of shipment. Under DAP cost and risk travel together to the named place.',
        'That split is why CIF is called a “shipment” rule even though the seller pays the freight. The seller has done its delivery once the goods are loaded at origin; the voyage is at the buyer’s risk, which is why CIF requires the seller to buy insurance that protects the buyer. DAP is an “arrival” rule: the seller has not delivered until the goods are at the named place.',
      ],
    },
    {
      heading: 'How do CIF and DAP compare, line by line?',
      paragraphs: [
        'Export and import clearance fall the same way under both rules. Nearly everything else in the table differs.',
      ],
      table: {
        caption: 'CIF and DAP compared under Incoterms® 2020',
        head: ['', 'CIF (Cost, Insurance and Freight)', 'DAP (Delivered at Place)'],
        rows: [
          ['Transport modes', 'Sea and inland waterway only', 'Any mode'],
          ['Named place', 'Port of destination', 'Any place, usually the buyer’s premises'],
          ['Risk passes', 'On board at the port of shipment', 'On arrival at the named place'],
          ['Seller pays freight to', 'Destination port', 'Named place, including on-carriage'],
          ['Insurance', 'Seller must buy minimum cover', 'Not required of either party'],
          ['Export clearance', 'Seller', 'Seller'],
          ['Import clearance, duties and taxes', 'Buyer', 'Buyer'],
          [
            'Unloading at destination',
            'Buyer, unless the freight contract includes it',
            'Buyer, at the named place',
          ],
        ],
      },
    },
    {
      heading: 'Who carries the risk during the voyage?',
      paragraphs: [
        'Under CIF the buyer carries the voyage risk; under DAP the seller does. If a container is lost or damaged at sea, the CIF buyer claims on the insurance the seller bought, while the DAP seller bears the loss itself and has to replace or refund the goods.',
        'The ICC keeps Institute Cargo Clauses (C) as the default cover under CIF, which is a minimum level; the parties can agree more. Under DAP no insurance is required, but a seller who carries the risk to the buyer’s door normally insures the whole trip, including the truck leg after the port. The cargo insurance for exporters article explains the levels of cover.',
      ],
    },
    {
      heading: 'Who pays for what happens after the ship arrives?',
      paragraphs: [
        'Under CIF the buyer pays for almost everything after arrival; under DAP the seller pays until the goods reach the named place. The CIF freight ends at the destination port. From there the buyer arranges unloading, any port or terminal handling not covered by the freight contract, import clearance and the truck to its warehouse.',
        'Under DAP the seller’s price must cover the voyage, any handling needed to move the goods through the arrival port and the on-carriage to the named address. Destination charges are where DAP disputes start, so the contract should say which arrival charges the price includes. The buyer still unloads at the address and still clears and pays for import.',
      ],
    },
    {
      heading: 'How does the same shipment price under CIF and DAP?',
      paragraphs: [
        'The DAP price is the CIF price plus the costs and the risk of the last leg. The table below builds both prices for one container.',
      ],
      table: {
        caption:
          'Worked example with invented parties and figures: Example Ceramics Ltd sells one container of tiles to a buyer near Rotterdam',
        head: ['Cost line', 'CIF Rotterdam', 'DAP buyer’s warehouse'],
        rows: [
          ['Goods, packed for export', '20,000', '20,000'],
          ['Inland transport and export clearance at origin', '650', '650'],
          ['Sea freight to Rotterdam', '2,400', '2,400'],
          ['Insurance', '90 (minimum cover)', '110 (whole journey, chosen by the seller)'],
          ['Arrival handling at Rotterdam', 'Buyer pays', '600'],
          ['Truck from the port to the buyer’s warehouse', 'Buyer pays', '450'],
          ['Invoice total', '23,140', '24,210'],
        ],
      },
    },
    {
      heading: 'Does customs value a CIF or a DAP invoice differently?',
      paragraphs: [
        'Customs value comes from the transaction and the importing country’s rules, not from the Incoterms® rule. HMRC states that the Incoterm used does not restrict the valuation method.',
        'In the UK, HMRC includes transport and insurance up to the place where goods enter the UK and lets the importer deduct transport after that point if it is shown separately. A CIF invoice already stops near that point; a DAP invoice also carries the inland leg, so show the on-carriage as its own line. In the US, 19 U.S.C. § 1401a excludes international freight and insurance from the price actually paid or payable, and 19 CFR 141.86 asks the invoice to itemise those charges by name and amount.',
      ],
    },
    {
      heading: 'When should you quote CIF or DAP?',
      paragraphs: ['Decide by the mode, the buyer’s reach and the risk you are willing to carry:'],
      steps: [
        'If the goods do not travel by sea from port to port, CIF does not fit; look at CIP or DAP instead.',
        'If the buyer has a forwarder or broker at the arrival port who can take over the goods, CIF keeps your risk short.',
        'If the buyer wants one delivered price and has nobody at the port, quote DAP and name the full delivery address.',
        'For DAP, get quotes for the freight, arrival handling and on-carriage before you set the price, and insure the whole journey.',
        'Under either rule, confirm the buyer can clear the goods for import and pay the duties and taxes.',
        'Write the same rule, named place and version on the quotation, proforma and commercial invoice.',
      ],
    },
    {
      heading: 'What should the documents say?',
      paragraphs: [
        'The terms of sale line should be identical on every document: the rule, the named place and the version, such as “CIF Rotterdam, Incoterms® 2020” or “DAP Tilburg, buyer’s warehouse, Incoterms® 2020”. Both are invented examples. The International Trade Administration notes that parties may use an older version if they say so, so always name the version.',
        'Under CIF the buyer needs the transport document and evidence of the insurance to take over the goods and claim if they arrive damaged. Under DAP the consignee and delivery address on the bill of lading or delivery order must match the named place on the invoice, so the carrier can complete the last leg without new instructions.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is CIF cheaper than DAP for the buyer?',
      a: 'The CIF invoice is usually lower, but the buyer then pays arrival handling, on-carriage and any extra insurance itself. Compare the landed cost at the warehouse, not the invoice totals.',
    },
    {
      q: 'Can DAP be used for sea freight?',
      a: 'Yes. DAP works for any mode, including sea. The named place can be a port, a terminal or an inland address, and the seller carries the risk until the goods arrive there.',
    },
    {
      q: 'Does the seller have to insure under DAP?',
      a: 'No. DAP places no insurance obligation on either party. Because the seller carries the transit risk, it usually insures the goods for its own protection.',
    },
    {
      q: 'Under CIF, who claims if the goods arrive damaged?',
      a: 'The buyer, because the risk passed to it when the goods were loaded at origin. The seller’s CIF insurance is bought for the buyer’s benefit, so the buyer claims on it.',
    },
    {
      q: 'Does DAP include import duty?',
      a: 'No. Under DAP the buyer clears the goods for import and pays the duties and taxes. If the seller should pay them, the rule is DDP, compared in the DAP vs DDP guide.',
    },
  ],
  sources: [
    'c3-icc-incoterms-2020',
    'c3-hmrc-incoterms',
    'c3-ita-know-your-incoterms',
    'c3-hmrc-delivery-costs',
    'c3-usc-19-1401a',
    'c3-cornell-19-cfr-141-86',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/export-price-calculator', '/tools/invoice-generator'],
  callout: {
    afterSection: 4,
    tool: '/tools/export-price-calculator',
    title: 'Build your own CIF price',
    text: 'Enter your ex-works price and the costs you were quoted to see FOB, CFR, CIF and a DDP estimate side by side.',
  },
  related: [
    '/blog/cif-vs-fob',
    '/blog/fca-vs-dap',
    '/blog/cif-vs-cip',
    '/guides/dap-vs-ddp',
    '/blog/fob-vs-dap',
    '/blog/cargo-insurance-for-exporters',
  ],
  cover: {
    id: 'QE7wBnrqyGg',
    src: 'https://images.unsplash.com/photo-1784910629562-27f1d0952320',
    width: 6003,
    height: 4002,
    alt: 'Container ship alongside port cranes, the point where risk passes under CIF once the goods are on board',
    caption: 'A container ship and cranes at an industrial port',
    photographer: { name: 'Julia Taubitz', profile: 'https://unsplash.com/@justmejuliee' },
    page: 'https://unsplash.com/photos/container-ship-and-cranes-at-an-industrial-port-QE7wBnrqyGg',
  },
};

export default article;
