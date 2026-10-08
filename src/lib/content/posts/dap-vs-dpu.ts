import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "dap vs dpu" 20, "dpu vs dap" 10; conversion role.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (v2 #46: DPU is the only rule where
 * the seller unloads).
 */
const article: ContentArticle = {
  slug: 'dap-vs-dpu',
  title: 'DAP vs DPU: who unloads the goods at the destination?',
  metaTitle: 'DAP vs DPU: the unloading difference',
  description:
    'DAP and DPU both deliver to the buyer’s named place. The only difference is unloading, and with it where risk passes. What each rule asks of the seller, and when DPU is worth quoting.',
  lede: 'DAP and DPU read almost the same on a quotation, and most of their obligations are identical. One task separates them: getting the goods off the arriving vehicle. That task decides who carries the risk during unloading and who has to arrange the equipment and people to do it.',
  answer:
    'Under DAP (Delivered at Place) the seller delivers when the goods arrive at the named place, ready for unloading; the buyer unloads. Under DPU (Delivered at Place Unloaded) the seller also unloads them there, and risk passes only once they are unloaded. DPU is the only Incoterms® 2020 rule that puts unloading on the seller.',
  keyFacts: [
    'DAP and DPU are two of the eleven Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'The ICC states that the only difference between DAP and DPU is that the seller unloads the goods under DPU and does not under DAP.',
    'DPU replaced the Incoterms® 2010 rule DAT (Delivered at Terminal), and its named place can be any location, not only a terminal.',
    'Both DAP and DPU can be used for any mode of transport, according to the US International Trade Administration.',
    'HMRC’s customs valuation guidance describes the DPU seller as bearing the risks of bringing the goods to the named place and unloading them.',
  ],
  definitions: [
    {
      term: 'DAP (Delivered at Place)',
      meaning:
        'The seller delivers when the goods are at the buyer’s disposal on the arriving transport at the named place, ready for unloading.',
    },
    {
      term: 'DPU (Delivered at Place Unloaded)',
      meaning:
        'The seller delivers when the goods have been unloaded from the arriving transport and placed at the buyer’s disposal at the named place.',
    },
    {
      term: 'DAT (Delivered at Terminal)',
      meaning: 'The Incoterms® 2010 rule that the 2020 revision renamed DPU.',
    },
    {
      term: 'Named place',
      meaning:
        'The location written after the rule, where delivery happens and risk passes to the buyer.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between DAP and DPU?',
      paragraphs: [
        'Unloading is the difference, and the ICC says so in plain terms in its summary of the Incoterms® 2020 changes: under DAP the seller does not unload the goods, and under DPU it does. Everything else in the two rules runs the same way.',
        'In both, the seller contracts and pays for the carriage to a named place in the buyer’s country, clears the goods for export and carries the risk of loss or damage during the whole journey. In both, the buyer clears the goods for import and pays any duty and import taxes. Neither rule obliges either party to insure the goods.',
        'Because unloading is the last step of delivery, it also moves the moment risk passes. Under DAP the buyer takes over the risk while the goods are still on the truck, container or wagon. Under DPU the seller keeps it until the goods are on the ground at the named place.',
      ],
    },
    {
      heading: 'How do DAP and DPU compare side by side?',
      paragraphs: ['The table sets out where the two rules agree and the one place they part.'],
      table: {
        caption: 'DAP and DPU compared under Incoterms® 2020',
        head: ['', 'DAP (Delivered at Place)', 'DPU (Delivered at Place Unloaded)'],
        rows: [
          ['Transport modes', 'Any, including multimodal', 'Any, including multimodal'],
          ['Main carriage', 'Seller contracts and pays', 'Seller contracts and pays'],
          ['Export clearance', 'Seller', 'Seller'],
          [
            'Delivery',
            'On the arriving transport at the named place, ready for unloading',
            'Unloaded at the named place',
          ],
          ['Unloading', 'Buyer', 'Seller'],
          ['Risk passes', 'On arrival, before unloading', 'After unloading'],
          ['Import clearance, duty and taxes', 'Buyer', 'Buyer'],
          ['Insurance', 'Not required of either party', 'Not required of either party'],
        ],
      },
    },
    {
      heading: 'Why was DAT renamed DPU?',
      paragraphs: [
        'DAT, Delivered at Terminal, was the Incoterms® 2010 rule for goods unloaded at a terminal such as a quay, a container yard or an air cargo terminal. Traders wanted the same arrangement at other places, such as the buyer’s own warehouse, so the ICC dropped the word “terminal” in the 2020 revision. The ICC describes DPU as the same rule renamed, not a new one.',
        'The ICC also reordered the rules so that DAP comes before DPU, because DAP delivery happens before unloading and DPU delivery after it. If you still see DAT on a contract, it refers to the 2010 version; parties can use an earlier version if they say so, but the International Trade Administration notes that the ICC recommends Incoterms® 2020.',
      ],
    },
    {
      heading: 'When does DPU make sense for a seller?',
      paragraphs: [
        'DPU fits when you control what happens at the destination and can unload safely there. That usually means one of three things: your own carrier or forwarder has unloading equipment on site, the named place is a terminal or depot that unloads as a matter of course, or the buyer has no way to unload, such as a site without a forklift or a loading dock.',
        'Before you agree DPU, ask who will actually do the unloading and who pays for it. If the terminal or the haulier charges for it, that cost is yours under DPU and belongs in your price. If the goods are heavy, long or fragile, the unloading itself is where damage tends to happen, and under DPU that risk is still yours.',
        'If you cannot unload at the buyer’s premises, do not quote DPU there. Name a place where unloading is possible, such as the forwarder’s depot in the buyer’s city, or quote DAP and let the buyer unload.',
      ],
    },
    {
      heading: 'How should the named place be written under DAP or DPU?',
      paragraphs: [
        'Write the place precisely, because under both rules it is where risk passes. A city name alone leaves room to argue about which warehouse, which gate or which bay. Add the version so nobody reads the contract against 2010 rules.',
        'The examples below use invented places.',
      ],
      list: [
        'DAP: “DAP Lyon, buyer’s warehouse, 4 Example Street, loading bay 2, Incoterms® 2020”. The seller’s truck arrives at the bay; the buyer unloads.',
        'DPU: “DPU Rotterdam, forwarder’s depot, Example Road 10, Incoterms® 2020”. The seller arranges unloading at the depot.',
        'If import clearance happens at a different point from delivery, say where in the contract, because neither rule moves import clearance to the seller.',
      ],
    },
    {
      heading: 'What changes on the invoice and the price under DPU?',
      paragraphs: [
        'The rule, the named place and the version go in the terms of sale on the proforma and on the commercial invoice, written exactly as in the contract. Customs in the importing country reads that line to understand what the invoice price covers.',
        'A DPU price covers everything a DAP price does, plus the unloading. Build it from your ex-works price upwards: inland transport, export clearance, the main freight, any insurance you choose to buy for your own risk, transport to the named place and then the unloading charge. Keep each cost you know as a separate line in your working, so you can show the buyer what changed if they ask for DAP instead.',
        'How the importing country values the goods for duty is set by its own law, not by the Incoterms® rule. HMRC’s guidance, for example, says the rule in the contract does not restrict which valuation method applies. The importer may need the freight and other costs split out, so keep your own breakdown.',
      ],
      steps: [
        'Start from your ex-works price for the goods.',
        'Add inland transport, export clearance and loading at origin.',
        'Add the main freight and any insurance you buy to cover your own risk.',
        'Add on-carriage to the named place in the buyer’s country.',
        'Under DPU, add the unloading charge at the named place.',
        'Write the rule, place and version on the proforma and the commercial invoice.',
      ],
    },
    {
      heading: 'Should you quote DAP or DPU?',
      paragraphs: [
        'Quote DAP when the buyer can unload at the named place and you would rather not carry the risk of unloading. It is the more common arrival rule for deliveries to a buyer’s warehouse, because the buyer’s own staff and forklift are already there.',
        'Quote DPU when you can unload more safely or cheaply than the buyer, when the named place is a terminal that unloads as standard, or when the buyer asks for it and you have confirmed who will do the work. Whichever you choose, write the same rule, place and version on every document, and tell your forwarder before the booking so the delivery instructions match.',
        'If the buyer also wants you to clear the goods for import and pay the duties, neither rule fits; that is DDP, which the DAP vs DDP guide covers.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is DPU the same as DAP?',
      a: 'No. Both deliver to a named place in the buyer’s country, but under DPU the seller also unloads the goods there and carries the risk until they are unloaded. Under DAP the buyer unloads.',
    },
    {
      q: 'Who pays for unloading under DAP?',
      a: 'The buyer. Under DAP the seller delivers the goods on the arriving vehicle, ready for unloading, and unloading is the buyer’s task and cost. If the seller’s carrier charges the buyer for unloading, check what the sale contract says.',
    },
    {
      q: 'Does DPU include import duties?',
      a: 'No. Under DPU the buyer clears the goods for import and pays the duty and import taxes. The rule that puts import clearance on the seller is DDP.',
    },
    {
      q: 'Can DPU be used for air or sea freight?',
      a: 'Yes. DPU is one of the seven Incoterms® 2020 rules for any mode of transport, so it works for air, sea, road, rail and multimodal shipments, as long as the seller can arrange unloading at the named place.',
    },
    {
      q: 'Is DAT still valid?',
      a: 'DAT belongs to Incoterms® 2010. Parties can still agree an earlier version if they name it, but in the 2020 rules the equivalent is DPU, with a named place that need not be a terminal.',
    },
  ],
  sources: [
    'c3-icc-incoterms-2020',
    'c3-hmrc-incoterms',
    'c3-ita-know-your-incoterms',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/export-price-calculator', '/tools/proforma-invoice-generator'],
  callout: {
    afterSection: 1,
    tool: '/tools/incoterms',
    title: 'See all eleven rules on one chart',
    text: 'The Incoterms® 2020 guide shows where risk passes and who pays what under every rule, with a page each for DAP and DPU.',
  },
  related: [
    '/guides/dap-vs-ddp',
    '/blog/fca-vs-dap',
    '/blog/fob-vs-dap',
    '/blog/ddp-vs-ddu',
    '/blog/exw-vs-ddp',
  ],
  cover: {
    id: 'IcB8U3l9Slg',
    src: 'https://images.unsplash.com/photo-1770827730773-cc7848b2ee61',
    width: 5635,
    height: 3757,
    alt: 'Orange forklift outside an industrial building, the kind of equipment DPU leaves to the seller',
    caption: 'Forklift parked outside an industrial building',
    photographer: { name: 'Osmany M Leyva Aldana', profile: 'https://unsplash.com/@ozym' },
    page: 'https://unsplash.com/photos/orange-forklift-parked-outside-industrial-building-IcB8U3l9Slg',
  },
};

export default article;
