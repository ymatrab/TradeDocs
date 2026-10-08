import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "exw vs dap" 50.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (new in v3, comparison).
 */
const article: ContentArticle = {
  slug: 'exw-vs-dap',
  title: 'EXW vs DAP: collection at your door or delivery to theirs',
  metaTitle: 'EXW vs DAP: who does what in Incoterms 2020',
  description:
    'EXW leaves the goods at your premises for the buyer to collect; DAP carries them to the buyer’s address. Freight, risk, export proof and the price under each, side by side.',
  lede: 'EXW and DAP are the two rules small exporters reach for when a buyer asks for “your price”. One means the buyer collects from your premises and handles everything after that. The other means you deliver to the buyer’s address and handle everything before import. The gap between them is the whole journey.',
  answer:
    'Under EXW (Ex Works) the seller makes the goods available at its own premises, not loaded and not cleared for export, and the buyer takes over all transport and risk from there. Under DAP (Delivered at Place) the seller clears the goods for export, pays the carriage and carries the risk to the named place in the buyer’s country.',
  keyFacts: [
    'EXW and DAP are two of the eleven Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'Both EXW and DAP can be used for any mode of transport, according to the International Trade Administration.',
    'HMRC’s guidance says that under EXW the seller does not have to load the goods or clear them for export.',
    'Under DAP the seller bears the risks of bringing the goods to the named place, where they are delivered ready for unloading.',
    'Under 15 CFR 30.3, terms of sale do not decide who the parties to a US export transaction are.',
  ],
  definitions: [
    {
      term: 'EXW (Ex Works)',
      meaning:
        'The seller delivers by placing the goods at the buyer’s disposal at the seller’s premises or another named place, not loaded and not cleared for export.',
    },
    {
      term: 'DAP (Delivered at Place)',
      meaning:
        'The seller delivers when the goods arrive at the named destination on the delivering vehicle, ready for the buyer to unload.',
    },
    {
      term: 'Indirect export',
      meaning:
        'HMRC’s term for an export in which the overseas customer or its agent collects the goods in the UK and arranges the export, as in an ex-works sale.',
    },
    {
      term: 'Evidence of export',
      meaning:
        'Proof that goods left the country, such as a departure-confirmed export declaration or authenticated transport documents.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between EXW and DAP?',
      paragraphs: [
        'EXW puts almost every task on the buyer; DAP puts almost every task on the seller, except import. Both are Incoterms® 2020 rules from the ICC and both work for any mode of transport.',
        'Under EXW your job is to have the goods packed and ready at your premises on the agreed date. The buyer, or its forwarder, loads them, clears them for export, books the international freight, clears them for import and pays the duties. Risk passes when the goods are placed at the buyer’s disposal, before they are even on a truck.',
        'Under DAP you do the export clearance, book and pay the main carriage and any onward transport, and carry the risk until the goods arrive at the named place in the buyer’s country. The buyer then unloads, clears the goods for import and pays the duties and taxes.',
      ],
    },
    {
      heading: 'How do EXW and DAP compare, task by task?',
      paragraphs: ['Only one line falls the same way under both rules: import clearance.'],
      table: {
        caption: 'EXW and DAP compared under Incoterms® 2020',
        head: ['Task', 'EXW (Ex Works)', 'DAP (Delivered at Place)'],
        rows: [
          [
            'Named place',
            'Seller’s premises or another place of collection',
            'In the buyer’s country',
          ],
          ['Loading at the seller’s premises', 'Buyer', 'Seller'],
          ['Export clearance', 'Buyer', 'Seller'],
          ['Main carriage', 'Buyer contracts and pays', 'Seller contracts and pays'],
          [
            'Risk passes',
            'When the goods are placed at the buyer’s disposal',
            'On arrival at the named place',
          ],
          ['Insurance', 'Not required of either party', 'Not required of either party'],
          ['Unloading at destination', 'Buyer', 'Buyer'],
          ['Import clearance, duties and taxes', 'Buyer', 'Buyer'],
        ],
      },
    },
    {
      heading: 'Why is EXW not as simple as it looks?',
      paragraphs: [
        'EXW looks like the least work for the seller, but the export still happens from your country and some of its paperwork can still land on you. The rule allocates tasks between buyer and seller; it does not change what your own customs and tax authorities expect.',
        'In the US, 15 CFR 30.3 states that Incoterms® rules and other terms of sale do not determine the type of, or the parties to, an export transaction. In a routed export the foreign buyer authorises a US agent to file the Electronic Export Information, but the US seller must still give that agent complete, accurate and timely export information and keep records that support it. The EXW vs FOB article covers the routed export in more detail.',
        'There is also a practical gap. Your premises are the collection point, so the buyer’s truck arrives at your dock and someone has to put the goods on it. Under EXW that someone is the buyer. If your staff load anyway, agree in writing who carries the risk while they do it.',
      ],
    },
    {
      heading: 'How does EXW affect VAT on a UK export?',
      paragraphs: [
        'In the UK an ex-works sale is usually an indirect export, and you only zero-rate it for VAT if you hold the right evidence. HMRC’s VAT Notice 703 describes an indirect export as one in which an overseas customer or its agent collects the goods from the supplier in the UK and arranges the export.',
        'For direct and ex-works exports alike, Notice 703 sets a limit of three months from the time of supply both to export the goods and to obtain the evidence. For an indirect export it warns that copies of transport documents alone are not enough: the evidence has to show that the goods left the UK, with the date, route and mode. If the evidence is missing or unsatisfactory, the supplier becomes liable for the VAT.',
        'Notice 703 recommends that the contract requires the buyer to send the export evidence, and that the seller takes a deposit equal to the VAT that could become due. Under DAP you arrange the export yourself, so the departure-confirmed declaration comes to you or your agent directly.',
      ],
    },
    {
      heading: 'How does each rule change the price you quote?',
      paragraphs: [
        'An EXW price covers the goods and their packing, ready at your door. A DAP price adds everything between your door and the buyer’s: loading, inland transport, export clearance, the international freight, arrival handling that the carriage needs, the delivery leg and, usually, insurance for the risk you now carry.',
        'Build the DAP price from real quotations, not estimates, and confirm how long the freight quote is valid. On the commercial invoice, list the freight and the delivery leg as separate lines next to the goods total, so the buyer’s customs broker can see what each amount covers. The export price calculator starts from your ex-works figure and adds the cost lines you enter.',
      ],
    },
    {
      heading: 'When should you choose EXW or DAP?',
      paragraphs: ['A short way to decide:'],
      steps: [
        'If the buyer has an experienced forwarder in your country that will handle export clearance, EXW can work; agree loading and export evidence in writing.',
        'If you sell from the UK and want to zero-rate the sale, check you can obtain the export evidence Notice 703 asks for before you accept EXW.',
        'If the buyer wants a delivered price and has no forwarder, quote DAP with the full delivery address as the named place.',
        'If you quote DAP, price the freight, the delivery leg and insurance for the journey before you commit to a figure.',
        'Under either rule, confirm the buyer can clear the goods for import; neither rule moves that task to you.',
        'Put the same rule, named place and version on the quotation, the proforma and the commercial invoice.',
      ],
    },
    {
      heading: 'Is FCA a middle ground between EXW and DAP?',
      paragraphs: [
        'Often, yes. Under FCA the seller clears the goods for export and hands them to the buyer’s carrier, so you control the export filing while the buyer still books and pays the freight. Many sellers asked for EXW offer FCA at their own premises instead. The EXW vs FCA and FCA vs DAP articles compare those pairs.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is EXW or DAP better for a first export order?',
      a: 'Neither by default. EXW suits a buyer with its own forwarder in your country; DAP suits a buyer who wants a delivered price. Choose the rule whose costs and risks you can price and control.',
    },
    {
      q: 'Who loads the truck under EXW?',
      a: 'The buyer. The Incoterms® 2020 rules do not oblige an EXW seller to load the goods. If your staff load them anyway, agree in writing who bears the risk during loading.',
    },
    {
      q: 'Does DAP make the seller pay import duty?',
      a: 'No. Under DAP the buyer clears the goods for import and pays the duties and taxes. If the seller pays them, the rule is DDP, covered in the DAP vs DDP guide.',
    },
    {
      q: 'What should the terms of sale line say?',
      a: 'The rule, the named place and the version, for example “EXW Leeds, seller’s warehouse, Incoterms® 2020” or “DAP Lyon, buyer’s premises, Incoterms® 2020”. Both are invented examples.',
    },
    {
      q: 'Can EXW be used for air or sea freight?',
      a: 'Yes. EXW and DAP both work for any mode of transport. With EXW the buyer chooses the mode and the carrier; with DAP the seller does.',
    },
  ],
  sources: [
    'c3-icc-incoterms-2020',
    'c3-hmrc-incoterms',
    'c3-ita-know-your-incoterms',
    'w5-ftr-30-3',
    'c4-hmrc-vat-notice-703',
  ],
  primaryTool: '/tools/export-price-calculator',
  tools: ['/tools/export-price-calculator', '/tools/incoterms', '/tools/invoice-generator'],
  callout: {
    afterSection: 1,
    tool: '/tools/incoterms',
    title: 'See all eleven rules on one chart',
    text: 'The Incoterms® 2020 guide shows where risk passes and who pays what under each rule, from EXW to DDP.',
  },
  related: [
    '/blog/exw-vs-fob',
    '/blog/exw-vs-fca',
    '/blog/fca-vs-dap',
    '/blog/exw-vs-ddp',
    '/blog/zero-rating-exports-vat-uk',
    '/guides/dap-vs-ddp',
  ],
  cover: {
    id: 'IcB8U3l9Slg',
    src: 'https://images.unsplash.com/photo-1770827730773-cc7848b2ee61',
    width: 5635,
    height: 3757,
    alt: 'Forklift parked outside an industrial building, the seller’s premises where goods sold EXW are collected',
    caption: 'An orange forklift outside an industrial building',
    photographer: { name: 'Osmany M Leyva Aldana', profile: 'https://unsplash.com/@ozym' },
    page: 'https://unsplash.com/photos/orange-forklift-parked-outside-industrial-building-IcB8U3l9Slg',
  },
};

export default article;
