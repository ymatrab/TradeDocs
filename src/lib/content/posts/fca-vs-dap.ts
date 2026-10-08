import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "fca vs dap" 110.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (new in v3, comparison).
 */
const article: ContentArticle = {
  slug: 'fca-vs-dap',
  title: 'FCA vs DAP: who arranges the freight, and where risk passes',
  metaTitle: 'FCA vs DAP: the difference in Incoterms 2020',
  description:
    'FCA hands the goods to the buyer’s carrier near the seller; DAP carries them to the buyer’s door. Freight, risk, clearance and the invoice under each rule, side by side.',
  lede: 'FCA and DAP sit at opposite ends of the journey. Under one the buyer takes over the goods near your premises; under the other you deliver them to the buyer’s door. The choice decides who books the freight, who carries the risk in transit and what your invoice price has to cover.',
  answer:
    'Under FCA (Free Carrier) the seller hands the goods, cleared for export, to the buyer’s carrier at a named place near the start, and risk passes there. Under DAP (Delivered at Place) the seller books and pays the main carriage and carries the risk until the goods arrive at the named destination, ready for the buyer to unload.',
  keyFacts: [
    'FCA and DAP are two of the eleven Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'Both FCA and DAP can be used for any mode of transport, including containers, air freight and road.',
    'Under FCA, risk passes when the goods are handed to the buyer’s nominated carrier at the named place.',
    'Under DAP, the seller bears the risks of bringing the goods to the named place, and does not unload them there.',
    'Under both rules the seller clears the goods for export and the buyer clears them for import.',
  ],
  definitions: [
    {
      term: 'FCA (Free Carrier)',
      meaning:
        'The seller delivers the goods, cleared for export, to the carrier the buyer nominates at a named place.',
    },
    {
      term: 'DAP (Delivered at Place)',
      meaning:
        'The seller delivers when the goods are at the buyer’s disposal on the arriving vehicle at the named destination, ready for unloading.',
    },
    {
      term: 'Main carriage',
      meaning:
        'The international leg of the journey: the sea, air, road or rail transport between the two countries.',
    },
    {
      term: 'Named place',
      meaning:
        'The location written after the rule, which fixes where delivery happens and where risk passes.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What do FCA and DAP mean?',
      paragraphs: [
        'FCA and DAP are both rules in the Incoterms® 2020 set from the ICC, and both work for any mode of transport. They describe the same physical trip from two different ends.',
        'FCA, Free Carrier, is a departure rule. The seller clears the goods for export and hands them to the carrier the buyer has chosen, at a place named in the contract: the seller’s own warehouse, a forwarder’s depot or an airport cargo terminal. From that handover the buyer pays for the freight and carries the risk.',
        'DAP, Delivered at Place, is an arrival rule. The seller contracts and pays for the transport all the way to a named place in the buyer’s country, such as the buyer’s warehouse, and carries the risk until the goods arrive there on the delivering vehicle, ready to be unloaded. The buyer then unloads, clears the goods for import and pays the duties and taxes.',
      ],
    },
    {
      heading: 'What is the difference between FCA and DAP?',
      paragraphs: [
        'The table sets the two rules side by side. Export clearance and import clearance fall the same way under both; almost everything in between changes hands.',
      ],
      table: {
        caption: 'FCA and DAP compared under Incoterms® 2020',
        head: ['', 'FCA (Free Carrier)', 'DAP (Delivered at Place)'],
        rows: [
          ['Transport modes', 'Any', 'Any'],
          [
            'Named place',
            'In the seller’s country: premises, depot or terminal',
            'In the buyer’s country: usually the buyer’s premises',
          ],
          ['Risk passes', 'At handover to the buyer’s carrier', 'On arrival, before unloading'],
          ['Main carriage', 'Buyer contracts and pays', 'Seller contracts and pays'],
          ['Export clearance', 'Seller', 'Seller'],
          ['Import clearance, duties and taxes', 'Buyer', 'Buyer'],
          [
            'Loading and unloading',
            'Seller loads only at its own premises',
            'Buyer unloads at the destination',
          ],
          ['Insurance', 'Not required of either party', 'Not required of either party'],
        ],
      },
    },
    {
      heading: 'Who carries the risk in transit under FCA and DAP?',
      paragraphs: [
        'Under FCA the buyer carries the transit risk; under DAP the seller does. That is the largest practical difference between the rules, because the international leg is where most damage and loss happen.',
        'HMRC’s guidance on Incoterms® puts it plainly for DAP: the seller bears all risks involved in bringing the goods to the named place. If a container is dropped at the port of discharge or a pallet goes missing on the final truck, the loss is the seller’s under DAP and the buyer’s under FCA.',
        'Neither rule obliges anyone to buy cargo insurance. In practice the party carrying the risk usually arranges it, so a seller quoting DAP should price in cover for the whole journey, and a buyer buying FCA should insure from the handover onward. The article on cargo insurance for exporters explains the cover options.',
      ],
    },
    {
      heading: 'Who books and pays the freight?',
      paragraphs: [
        'The buyer books the main carriage under FCA; the seller books it under DAP. Under FCA the seller’s job ends with getting the goods, cleared for export, to the buyer’s carrier on time. The buyer, or its forwarder, chooses the carrier, the route and the schedule.',
        'Under DAP the seller makes those choices and pays for them, including any transhipment, the destination port or airport handling needed to move the goods on, and the final delivery to the named place. Destination terminal charges are a common source of disputes, so state in the contract which charges your DAP price includes.',
      ],
    },
    {
      heading: 'How does the choice change your invoice price?',
      paragraphs: [
        'An FCA price covers the goods, export packing, export clearance and the delivery to the carrier. A DAP price adds the international freight, the delivery to the buyer’s premises and, in practice, the insurance the seller buys for its own risk.',
        'Customs in the importing country may treat that freight differently. In the US, 19 U.S.C. § 1401a excludes the cost of international transport and insurance from the price actually paid or payable, and 19 CFR 141.86 asks the invoice to itemise charges such as freight and insurance by name and amount. In the UK, HMRC includes transport and insurance up to the border in the customs value, and lets the importer deduct delivery costs inside the UK when they are shown separately.',
        'So on a DAP invoice, list the freight and any delivery after arrival as separate lines next to the goods total. The buyer’s broker can then declare the right value without asking you for a breakdown.',
      ],
    },
    {
      heading: 'When should you quote FCA or DAP?',
      paragraphs: [
        'Choose by who has the better freight arrangements and who can deal with problems at the far end. A short decision path:',
      ],
      steps: [
        'If the buyer has its own forwarder or freight contract, quote FCA and name the handover place precisely.',
        'If the buyer wants a delivered price and has no forwarder, quote DAP and name the delivery address.',
        'If you quote DAP, get a freight quotation to the named place before you set the price, and add the cost of insuring the goods in transit.',
        'Under either rule, confirm the buyer can clear the goods for import; DAP does not move import clearance to you.',
        'Write the same rule, named place and version on the quotation, the proforma and the commercial invoice.',
      ],
    },
    {
      heading: 'What should the documents say?',
      paragraphs: [
        'The terms of sale line should read the same on every document: the rule, the named place and the version, for example “FCA Manchester, Example Logistics depot, Incoterms® 2020” or “DAP Rotterdam, buyer’s warehouse, Incoterms® 2020”. Both examples use invented places and companies.',
        'The International Trade Administration notes that parties can use an older version of the rules if they say so, and that the version should be identified on the export documents. Leaving it out invites the question of which rules apply.',
        'Under FCA, the packing list goes to the buyer’s forwarder with the goods. Under DAP, you instruct your own carrier, so the shipping instructions, the bill of lading or air waybill consignee and the delivery address must all agree with the named place on the invoice.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is DAP better than FCA for the seller?',
      a: 'Not by default. DAP lets you sell a delivered price, but you carry the transit risk and the freight cost, and you depend on a carrier you chose. FCA ends your risk earlier. The better rule is the one whose risks you can price and control.',
    },
    {
      q: 'Does DAP include import duty?',
      a: 'No. Under DAP the buyer clears the goods for import and pays the duties and taxes. If the seller is to pay them, the rule is DDP, which is covered in the DAP vs DDP guide.',
    },
    {
      q: 'Who unloads the goods under DAP?',
      a: 'The buyer. Under DAP the seller delivers when the goods are ready for unloading on the arriving vehicle. If the seller should unload, the rule is DPU, Delivered at Place Unloaded.',
    },
    {
      q: 'Can FCA be used for air freight?',
      a: 'Yes. FCA works for any mode. For an air shipment the named place is usually the forwarder’s premises or the airport cargo terminal where the buyer’s carrier takes over.',
    },
    {
      q: 'Can I switch a customer from FCA to DAP?',
      a: 'Yes, if both parties agree and the contract, quotation and invoices change together. You will then need a freight booking, insurance for the transit and a price that covers both.',
    },
  ],
  sources: [
    'c3-icc-incoterms-2020',
    'c3-hmrc-incoterms',
    'c3-ita-know-your-incoterms',
    'c3-usc-19-1401a',
    'c3-cornell-19-cfr-141-86',
    'c3-hmrc-delivery-costs',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/invoice-generator', '/tools/landed-cost-calculator'],
  callout: {
    afterSection: 1,
    tool: '/tools/incoterms',
    title: 'See FCA and DAP on the full chart',
    text: 'The Incoterms® 2020 guide shows where risk passes and who pays what under all eleven rules, with a page for each.',
  },
  related: [
    '/guides/dap-vs-ddp',
    '/blog/fca-vs-fob',
    '/blog/exw-vs-fca',
    '/blog/cargo-insurance-for-exporters',
    '/blog/fob-vs-ddp',
  ],
  cover: {
    id: 'FFaDpgMAJyA',
    src: 'https://images.unsplash.com/photo-1725781535657-29d825bc7824',
    width: 4611,
    height: 3007,
    alt: 'Container truck backed into a warehouse loading dock, the kind of named place a DAP delivery ends at',
    caption: 'A container on a truck at a warehouse loading dock',
    photographer: { name: 'Bernd Dittrich', profile: 'https://unsplash.com/@hdbernd' },
    page: 'https://unsplash.com/photos/a-group-of-people-walking-around-a-building-FFaDpgMAJyA',
  },
};

export default article;
