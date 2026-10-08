import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, Google US, 2026-10-08, file 12): "fca vs ddp" 90; "ddp vs fca" 70;
 * "fca vs ddp incoterms" 30.
 * Plan: docs/research/content-plan-v4-2026-10-08.md, wave E, group 2 (comparison).
 */
const article: ContentArticle = {
  slug: 'fca-vs-ddp',
  title: 'FCA vs DDP: handing over at your door or delivering to theirs',
  metaTitle: 'FCA vs DDP: the difference in Incoterms 2020',
  description:
    'FCA ends at the buyer’s carrier near you; DDP ends at the buyer’s door, cleared and duty paid. Who controls the shipment, who clears customs and how an FCA price becomes DDP.',
  lede: 'A buyer who sends you FCA wants to run the shipment. A buyer who asks for DDP wants you to run all of it, customs in their country included. The two rules sit at opposite ends of what an exporter can promise, and the gap between them is mostly work you do in someone else’s country.',
  answer:
    'Under FCA (Free Carrier) the seller clears the goods for export and hands them to the buyer’s carrier at a named place, usually near the seller, where risk passes. Under DDP (Delivered Duty Paid) the seller carries the goods to the buyer’s named place, clears them for import and pays the duties and taxes, bearing all risk until then.',
  keyFacts: [
    'FCA and DDP are two of the eleven Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'The International Trade Administration lists both FCA and DDP among the seven rules for any mode of transport.',
    'HMRC describes FCA risk as passing at the handover point, which the parties should define precisely.',
    'Under DDP, HMRC notes, the seller clears the goods for export and import and pays the duties for both.',
    'HMRC says the Incoterm does not restrict the customs valuation method, so goods sold DDP can still be valued under method 1.',
  ],
  definitions: [
    {
      term: 'FCA (Free Carrier)',
      meaning:
        'The seller delivers the goods, cleared for export, to the carrier or person the buyer nominates at a named place.',
    },
    {
      term: 'DDP (Delivered Duty Paid)',
      meaning:
        'The seller delivers the goods cleared for import, on the arriving vehicle ready for unloading, at the named destination.',
    },
    {
      term: 'Importer of record',
      meaning:
        'The party responsible to the importing country’s customs for the entry, its accuracy and the duties and taxes owed.',
    },
    {
      term: 'Named place',
      meaning:
        'The location written after the rule, which fixes where delivery happens and where risk passes to the buyer.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between FCA and DDP?',
      paragraphs: [
        'FCA ends the seller’s duties near its own premises; DDP puts more work on the seller than any other of the eleven rules. Both come from the ICC’s Incoterms® 2020 rules and both work for sea, air, road, rail or a mix of them, so the choice is never forced by the transport mode.',
        'The table shows how far apart they are. Only one line is the same under both rules: the seller clears the goods for export.',
      ],
      table: {
        caption: 'FCA and DDP compared under Incoterms® 2020',
        head: ['', 'FCA (Free Carrier)', 'DDP (Delivered Duty Paid)'],
        rows: [
          ['Named place', 'Seller’s country: premises, depot or terminal', 'Buyer’s country: usually the buyer’s premises'],
          ['Who books the main carriage', 'Buyer', 'Seller'],
          ['Risk passes', 'At handover to the buyer’s carrier', 'At the named destination, ready for unloading'],
          ['Export clearance', 'Seller', 'Seller'],
          ['Import clearance', 'Buyer', 'Seller'],
          ['Import duties and taxes', 'Buyer', 'Seller'],
          ['Unloading at destination', 'Not the seller’s concern', 'Buyer'],
          ['Insurance', 'Not required of either party', 'Not required of either party'],
        ],
      },
    },
    {
      heading: 'Who controls the shipment under FCA and under DDP?',
      paragraphs: [
        'Under FCA the buyer controls the shipment; under DDP the seller does, from your door to theirs. That control decides who chooses the carrier, who receives the tracking updates and who takes the phone call when a container is held at the destination port.',
        'With FCA, the buyer or its forwarder books the freight and tells you where and when to hand the goods over. Your job is to have them packed, marked, cleared for export and at the named place on time. HMRC’s guidance stresses that the handover point should be defined precisely, because that is where your risk stops. If the place is your own warehouse, you also load the goods onto the buyer’s vehicle.',
        'With DDP, you choose the carrier and the route, pay for them, and carry the risk the whole way. You also deal with the customs authority in the buyer’s country, either yourself or through a customs broker there. Any delay at the border is yours to resolve, and any cost it creates, such as storage while documents are corrected, comes out of your margin.',
      ],
    },
    {
      heading: 'What does DDP ask of you that FCA leaves to the buyer?',
      paragraphs: [
        'DDP adds every task between the export border and the buyer’s door. Before you agree to it, walk through the list below; if you cannot do one of these steps, DDP is the wrong promise.',
      ],
      steps: [
        'Book and pay the international freight to the named place, including the destination port or airport handling needed to move the goods on.',
        'Decide who acts as importer in the buyer’s country. You need a way to make the import declaration there, usually a customs broker acting for you, and some countries also expect a local registration.',
        'Find the commodity code and the duty and tax that apply at the destination, from the importing country’s official tariff, and build them into the price.',
        'Check whether the goods need an import licence or permit in that country, and who can apply for it.',
        'Arrange cargo insurance if you want cover, because you carry the risk until delivery but no rule obliges you to insure.',
        'Plan the final delivery to the buyer’s address and agree who unloads; under DDP that is the buyer.',
      ],
    },
    {
      heading: 'How does an FCA price become a DDP price?',
      paragraphs: [
        'Start from your FCA price and add each cost the buyer would otherwise pay: the main freight, insurance if you buy it, destination handling, the broker’s fee, the import duty and tax, and the delivery to the buyer’s door. The example uses invented figures; replace every line with your own quotes and the importing country’s published rates.',
      ],
      table: {
        caption: 'Worked example with invented parties and figures: one pallet sold FCA, then DDP',
        head: ['Line', 'FCA price', 'DDP price'],
        rows: [
          ['Goods, export packing and export clearance', 'USD 8,000', 'USD 8,000'],
          ['Delivery to the named FCA place', 'USD 150', 'USD 150'],
          ['Main freight to the destination', 'Buyer pays', 'USD 1,100'],
          ['Cargo insurance (seller’s choice)', 'Buyer decides', 'USD 60'],
          ['Destination handling and broker’s fee', 'Buyer pays', 'USD 280'],
          ['Import duty and tax (invented placeholder)', 'Buyer pays', 'USD 900'],
          ['Final delivery to the buyer', 'Buyer pays', 'USD 190'],
          ['Price quoted', 'USD 8,150', 'USD 10,680'],
        ],
      },
    },
    {
      heading: 'What changes on the invoice and the shipping documents?',
      paragraphs: [
        'The terms of sale line changes first. Write the rule, the named place and the version on the quotation, the proforma and the commercial invoice, for example “FCA Leeds, Example Freight depot, Incoterms® 2020” or “DDP Lyon, buyer’s warehouse, Incoterms® 2020”. Both use invented places and companies. The International Trade Administration notes that the version should be identified on the export documents.',
        'Under FCA, your packing list and invoice travel to the buyer’s forwarder, who prepares the transport document. If the sale is paid by letter of credit and the bank wants an on-board bill of lading, the Incoterms® 2020 version of FCA lets the parties agree that the buyer instructs its carrier to issue one to you after loading.',
        'Under DDP, you instruct the carrier, so the consignee and delivery address on the bill of lading or air waybill, your shipping instructions and the named place on the invoice must all agree. Show the freight, insurance and duty as separate lines rather than one delivered total, so the broker in the buyer’s country can declare the customs value from the invoice.',
      ],
    },
    {
      heading: 'Does a DDP price change the customs value?',
      paragraphs: [
        'Not by itself. HMRC says the Incoterm does not restrict the valuation method, and that goods sold DDP can still be valued under method 1, the transaction value. What changes is how much of your price is something other than the goods.',
        'In the US, 19 U.S.C. § 1401a excludes international transport and insurance from the price actually paid or payable, and excludes US duties and federal taxes on importation when they are identified separately from the price. A DDP invoice with one undivided total makes those deductions hard to show. Itemise the charges, and let the broker apply the importing country’s own valuation rules.',
      ],
    },
    {
      heading: 'When should you offer FCA, and when DDP?',
      paragraphs: [
        'Offer FCA when the buyer has its own forwarder or freight contract and is set up to import. It keeps your work and risk inside your own country and your price simple. It is also the usual replacement for FOB when goods are handed over in a container at a depot or at an airport rather than loaded on board a ship.',
        'Offer DDP only when you can name the broker who will clear the goods, you have priced the duty and tax from the official tariff, and you are willing to own every problem until delivery. It suits sample shipments and buyers who want one landed price. Between the two, DAP is often the middle ground: you deliver to the door, and the buyer clears the goods and pays the import charges. The DAP vs DDP guide covers that choice.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is FCA cheaper than DDP for the buyer?',
      a: 'The FCA price is lower, but the buyer then pays the freight, insurance, import duty, taxes and broker separately. Compare the FCA price plus those costs with the DDP price; the landed cost calculator adds them up from figures you enter.',
    },
    {
      q: 'Can DDP be used for air freight?',
      a: 'Yes. DDP is one of the seven Incoterms® 2020 rules for any mode of transport, so it works for air, sea, road, rail and courier shipments. The named place is usually the buyer’s address.',
    },
    {
      q: 'Who pays import VAT under DDP?',
      a: 'The seller pays the import taxes as well as the duty, because DDP means duty paid. Whether the seller can recover it is a question for a tax adviser in the importing country, so ask before quoting.',
    },
    {
      q: 'Does the seller load the goods under FCA?',
      a: 'Only when the named place is the seller’s own premises. If the handover happens elsewhere, such as a forwarder’s depot, the seller delivers the goods on its own vehicle and the buyer’s carrier unloads them.',
    },
    {
      q: 'Can a buyer change an order from FCA to DDP?',
      a: 'Yes, if you both agree and the quotation, proforma and invoice change together. Requote from the start: DDP adds freight, insurance, import clearance, duty and delivery, and each needs a real figure before you confirm.',
    },
  ],
  sources: [
    'e2-icc-incoterms-2020',
    'e2-ita-know-your-incoterms',
    'e2-hmrc-incoterms',
    'e2-usc-19-1401a',
  ],
  primaryTool: '/tools/incoterms',
  tools: [
    '/tools/incoterms',
    '/tools/export-price-calculator',
    '/tools/proforma-invoice-generator',
    '/tools/landed-cost-calculator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/export-price-calculator',
    title: 'Build the DDP price from your FCA price',
    text: 'Enter your ex-works price and the freight, insurance, clearance and duty figures you have, and the export price calculator shows FCA, CPT and CIP prices with a DDP estimate.',
  },
  related: [
    '/guides/dap-vs-ddp',
    '/blog/fca-vs-dap',
    '/blog/fob-vs-ddp',
    '/blog/exw-vs-ddp',
    '/guides/importer-of-record',
    '/blog/fca-vs-fob',
  ],
  cover: {
    id: '9zlj0JnBxHw',
    src: 'https://images.unsplash.com/photo-1701849473471-666bf2b0158e',
    width: 6000,
    height: 4000,
    alt: 'Forklift carrying a stack of cartons, the moment an FCA seller hands the goods to the buyer’s carrier',
    caption: 'A forklift moving a stack of boxed goods',
    photographer: { name: 'Solømen', profile: 'https://unsplash.com/@solomen' },
    page: 'https://unsplash.com/photos/a-forklift-with-a-stack-of-boxes-on-top-of-it-9zlj0JnBxHw',
  },
};

export default article;
