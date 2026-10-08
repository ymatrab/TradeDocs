import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "fob vs dap" 70.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (new in v3, comparison).
 */
const article: ContentArticle = {
  slug: 'fob-vs-dap',
  title: 'FOB vs DAP: port of loading or the buyer’s door?',
  metaTitle: 'FOB vs DAP: the difference in Incoterms 2020',
  description:
    'FOB ends the seller’s job on board the ship at the port of loading; DAP runs to the buyer’s named place. Risk, freight, transport mode and the invoice under each rule.',
  lede: 'A buyer asks for an FOB price; another wants the goods delivered. The two quotes describe very different jobs. Under FOB you are done once the goods are on the ship. Under DAP you arrange the voyage and carry the goods to the buyer’s address.',
  answer:
    'Under FOB (Free on Board) the seller loads the goods on board the buyer’s vessel at the named port of shipment, and risk passes once they are on board. Under DAP (Delivered at Place) the seller arranges and pays the carriage to a named place in the buyer’s country and carries the risk until arrival, before unloading.',
  keyFacts: [
    'FOB and DAP are two of the eleven Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'FOB is a sea and inland waterway rule; DAP can be used for any mode of transport.',
    'Under FOB, risk passes when the goods are on board the vessel at the named port of shipment.',
    'Under DAP, the seller bears the risks of bringing the goods to the named place, ready for unloading.',
    'Under both rules the seller clears the goods for export and the buyer clears them for import.',
  ],
  definitions: [
    {
      term: 'FOB (Free on Board)',
      meaning:
        'The seller delivers the goods on board the vessel the buyer nominates, at the named port of shipment.',
    },
    {
      term: 'DAP (Delivered at Place)',
      meaning:
        'The seller delivers when the goods are at the buyer’s disposal on the arriving vehicle at the named place, ready for unloading.',
    },
    {
      term: 'Port of shipment',
      meaning: 'The port where the goods are loaded on the ship; the named place under FOB.',
    },
    {
      term: 'Delivered rule',
      meaning:
        'One of the Incoterms® rules in which the seller carries the goods to the destination: DAP, DPU and DDP.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What do FOB and DAP mean?',
      paragraphs: [
        'FOB and DAP are rules in the ICC’s Incoterms® 2020 set. FOB belongs to the group where the buyer pays the main carriage; DAP belongs to the delivered group, where the seller does.',
        'FOB, Free on Board, means the seller clears the goods for export and loads them on board the vessel the buyer has booked, at a named port of shipment such as “FOB Felixstowe”. Once the goods are on board, HMRC’s summary of the rules notes, the risk of loss or damage passes to the buyer, and the buyer bears the costs from then on.',
        'DAP, Delivered at Place, means the seller books and pays the transport to a named place in the buyer’s country and delivers when the goods are placed at the buyer’s disposal on the arriving vehicle, ready for unloading. The buyer unloads, clears the goods for import and pays the duties and taxes.',
      ],
    },
    {
      heading: 'What is the difference between FOB and DAP?',
      paragraphs: [
        'Only the clearance obligations fall the same way. Risk, freight and transport mode all change.',
      ],
      table: {
        caption: 'FOB and DAP compared under Incoterms® 2020',
        head: ['', 'FOB (Free on Board)', 'DAP (Delivered at Place)'],
        rows: [
          ['Transport modes', 'Sea and inland waterway only', 'Any, including multimodal'],
          [
            'Named place',
            'Port of shipment in the seller’s country',
            'Destination in the buyer’s country',
          ],
          ['Risk passes', 'Once the goods are on board', 'On arrival, before unloading'],
          ['Main carriage', 'Buyer contracts and pays', 'Seller contracts and pays'],
          ['Loading at origin', 'Seller loads on board', 'Seller, as part of its carriage'],
          ['Unloading at destination', 'Buyer', 'Buyer'],
          ['Export clearance', 'Seller', 'Seller'],
          ['Import clearance, duties and taxes', 'Buyer', 'Buyer'],
          ['Insurance', 'Not required of either party', 'Not required of either party'],
        ],
      },
    },
    {
      heading: 'Can FOB and DAP be used for air freight or containers?',
      paragraphs: [
        'DAP can; FOB is limited. The International Trade Administration lists FOB among the four rules for sea and inland waterway transport only, while DAP is one of the seven rules for any mode. An air shipment quoted FOB is outside the rule’s scope.',
        'Containers raise a different problem. A container is usually handed over at a terminal days before it is loaded on board, and under FOB the seller still carries the risk while it waits. For container cargo the departure rule that matches the handover is FCA, compared in the FCA vs FOB article. DAP has no such gap, because the seller carries the risk throughout anyway.',
      ],
    },
    {
      heading: 'Who carries the risk at sea under FOB and DAP?',
      paragraphs: [
        'The buyer carries the ocean risk under FOB; the seller carries it under DAP. Under FOB, damage after loading is the buyer’s loss. Under DAP, HMRC’s guidance says the seller bears all risks involved in bringing the goods to the named place, which covers the voyage, any transhipment and the final delivery.',
        'Neither rule requires anyone to insure. A seller quoting DAP is exposed for the whole journey and usually buys cover for it; a buyer buying FOB usually insures from loading onward. The cargo insurance article sets out the cover options.',
      ],
    },
    {
      heading: 'How does an FOB price differ from a DAP price?',
      paragraphs: [
        'An FOB price covers the goods, export packing, export clearance, delivery to the port and loading on board. A DAP price adds the ocean or air freight, any destination terminal handling needed to move the goods on, the on-carriage to the named place and, in practice, the insurance for the seller’s own risk.',
        'Import customs may value those costs differently. Under 19 U.S.C. § 1401a, US customs value excludes international freight and insurance from the price actually paid, and 19 CFR 141.86 asks the invoice to itemise charges such as freight and insurance. HMRC includes freight and insurance up to the UK border in the customs value, and allows delivery costs inside the UK to be deducted when they are shown separately.',
        'On a DAP invoice, then, show the goods value, the international freight and any delivery after arrival as separate lines. On an FOB invoice there is no main freight to show, because the buyer pays it.',
      ],
    },
    {
      heading: 'When should you quote FOB or DAP?',
      paragraphs: ['Decide by mode, cargo and who controls the freight:'],
      steps: [
        'If the goods go by air, road or rail, FOB does not apply; quote FCA or a delivered rule such as DAP.',
        'If they go in a container, prefer FCA over FOB, or DAP if the buyer wants a delivered price.',
        'If they are bulk or break-bulk cargo loaded under your supervision and the buyer books the ship, FOB fits.',
        'If you quote DAP, get freight and insurance quotations to the named place before setting the price.',
        'Check that the buyer can clear the goods for import; neither rule moves that to you.',
      ],
    },
    {
      heading: 'What should the terms of sale line say?',
      paragraphs: [
        'Write the rule, the named place and the version, the same way on the quotation, proforma and commercial invoice: “FOB Durban, Incoterms® 2020” names a port; “DAP Lyon, buyer’s warehouse, Incoterms® 2020” names a destination address. Both are invented examples.',
        'FOB with an inland place, such as “FOB factory”, does not match the Incoterms® rule, which names a port of shipment. In US domestic sales the same letters can also mean a Uniform Commercial Code term, which the FOB shipping point vs FOB destination article explains. Adding “Incoterms® 2020” removes the doubt.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is FOB or DAP better for the buyer?',
      a: 'It depends on the buyer’s freight arrangements. A buyer with its own forwarder and freight rates often prefers FOB or FCA. A buyer without them may prefer DAP, which gives a delivered price and leaves the transit risk with the seller.',
    },
    {
      q: 'Does DAP include ocean freight?',
      a: 'Yes. Under DAP the seller contracts and pays for the carriage to the named place, which includes the ocean or air freight and the delivery to the destination address.',
    },
    {
      q: 'Who pays import duty under FOB and DAP?',
      a: 'The buyer, under both. If the seller is to pay the import duties and taxes, the rule is DDP.',
    },
    {
      q: 'Can I quote FOB with a destination port?',
      a: 'No. Under the Incoterms® rules FOB always names the port of shipment. A price that includes freight to a destination port is CFR or CIF; to an inland destination it is CPT, CIP or a delivered rule.',
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
    title: 'Check FOB and DAP against all eleven rules',
    text: 'The Incoterms® 2020 guide shows the delivery point, risk transfer and cost split for every rule, with its own page for FOB and DAP.',
  },
  related: [
    '/blog/fca-vs-fob',
    '/guides/dap-vs-ddp',
    '/blog/fob-vs-ddp',
    '/blog/cif-vs-fob',
    '/blog/fob-shipping-point-vs-fob-destination',
  ],
  cover: {
    id: 'HqYPlDuAyBE',
    src: 'https://images.unsplash.com/photo-1759216373387-8c9fcbcfd75b',
    width: 4000,
    height: 2250,
    alt: 'Cargo ships being loaded at a busy port, the point where risk passes to the buyer under FOB',
    caption: 'Cargo ships being loaded at a port',
    photographer: { name: 'Haris Illahi', profile: 'https://unsplash.com/@harisillahi' },
    page: 'https://unsplash.com/photos/cargo-ships-being-loaded-at-a-busy-port-HqYPlDuAyBE',
  },
};

export default article;
