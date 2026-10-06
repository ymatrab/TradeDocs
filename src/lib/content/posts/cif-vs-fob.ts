import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "cif vs fob" 320; "fob vs cif" 320.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'cif-vs-fob',
  title: 'CIF vs FOB: who books the ship, and what customs values',
  metaTitle: 'CIF vs FOB: freight, insurance and customs value',
  description:
    'CIF and FOB pass risk at the same moment, on board at the port of shipment. They differ in who pays freight and insurance, and that changes the invoice and the customs value.',
  lede: 'CIF and FOB are often presented as opposites, one where the seller pays the freight and one where the buyer does. The less obvious part is that the risk moves at exactly the same point under both. What CIF adds is a freight contract and an insurance policy that the seller arranges for a voyage it no longer carries the risk of.',
  answer:
    'Under both CIF and FOB the risk passes to the buyer once the goods are on board the vessel at the port of shipment. Under CIF the seller also contracts and pays for the sea freight to the named destination port and buys minimum cargo insurance for the buyer. Under FOB the buyer arranges and pays both.',
  keyFacts: [
    'CIF (Cost, Insurance and Freight) and FOB (Free on Board) are ICC Incoterms® 2020 rules for sea and inland waterway transport only.',
    'Under both rules, risk of loss or damage passes when the goods are on board the vessel at the port of shipment.',
    'Under CIF, the ICC keeps Institute Cargo Clauses (C) as the default insurance cover, with the option to agree more.',
    'The WTO Customs Valuation Agreement lets a member include transport and insurance to the place of importation in customs value.',
    'Under 19 U.S.C. § 1401a, the US price actually paid or payable excludes international freight and insurance to the United States.',
  ],
  definitions: [
    {
      term: 'CIF (Cost, Insurance and Freight)',
      meaning:
        'The seller delivers on board, pays the freight to the named port of destination and insures the goods for the buyer.',
    },
    {
      term: 'FOB (Free on Board)',
      meaning:
        'The seller delivers on board the buyer’s vessel at the named port of shipment; the buyer pays freight and any insurance.',
    },
    {
      term: 'Customs value',
      meaning:
        'The value the importing country charges ad valorem duty on, usually built from the transaction value.',
    },
    {
      term: 'Institute Cargo Clauses (C)',
      meaning:
        'A standard set of marine cargo insurance terms with a narrower range of covered risks than clauses (A).',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between CIF and FOB?',
      paragraphs: [
        'The difference is who contracts for the voyage and the insurance. HMRC’s customs valuation guidance describes both rules the same way up to loading: the seller delivers the goods on board the vessel, and the risk of loss or damage passes when they are on the ship. Under CIF the seller must also contract for and pay the costs and freight to the named port of destination and contract for insurance against the buyer’s risk during the carriage.',
        'That is why CIF is written with a destination port (“CIF Rotterdam”) and FOB with a shipment port (“FOB Shanghai”). The International Trade Administration lists both among the four Incoterms® 2020 rules for sea and inland waterway transport, so neither fits air, road or courier shipments.',
      ],
      table: {
        caption: 'CIF and FOB compared under the Incoterms® 2020 rules',
        head: ['', 'CIF', 'FOB'],
        rows: [
          ['Named place', 'Port of destination', 'Port of shipment'],
          ['Risk passes', 'On board at the port of shipment', 'On board at the port of shipment'],
          ['Export clearance', 'Seller', 'Seller'],
          ['Sea freight contract and cost', 'Seller', 'Buyer'],
          [
            'Cargo insurance',
            'Seller, minimum Institute Cargo Clauses (C)',
            'Not required of either party',
          ],
          ['Unloading at destination and import clearance', 'Buyer', 'Buyer'],
          ['Transport modes', 'Sea and inland waterway', 'Sea and inland waterway'],
        ],
      },
    },
    {
      heading: 'If the seller pays freight under CIF, who carries the risk at sea?',
      paragraphs: [
        'The buyer does. Under CIF the seller pays for the voyage, but the risk passed when the goods went on board at the port of shipment. If the cargo is damaged at sea, the buyer bears the loss and claims on the insurance the seller bought for it.',
        'This is easy to misread. A CIF price includes freight to the destination, so it can feel like the seller is responsible until arrival. It is not. The seller’s cost obligation runs to the destination port; its risk ends at loading. Keep the policy and the transport document flowing to the buyer quickly, because the buyer is the one who will need them.',
      ],
    },
    {
      heading: 'How much insurance does CIF require?',
      paragraphs: [
        'Under the ICC’s Incoterms® 2020 rules, CIF keeps Institute Cargo Clauses (C) as the default level of cover, and the parties may agree a higher level. CIP, the multimodal counterpart, now requires the broader Institute Cargo Clauses (A).',
        'Clauses (C) cover a narrower list of risks than clauses (A). A buyer of goods that are easily damaged in handling may want more, and under CIF it has to ask for it in the contract or buy extra cover itself. Under FOB neither party is obliged to insure, so the buyer decides whether and how to cover the voyage.',
      ],
    },
    {
      heading: 'Does customs value goods on a CIF or FOB basis?',
      paragraphs: [
        'It depends on the importing country, not on the Incoterms® rule in the contract. The WTO’s technical note on the Customs Valuation Agreement explains that the cost of transport, insurance and related charges up to the place of importation is added to the price where the member bases valuation on a C.I.F. basis. Members that do not, value on a basis that leaves those costs out.',
        'The United States is an example of the second approach. Under 19 U.S.C. § 1401a, the price actually paid or payable excludes costs for transportation, insurance and related services incident to the international shipment from the country of exportation to the place of importation in the United States. HMRC’s guidance adds a related point for the UK: the Incoterm used does not restrict which valuation method applies.',
        'For the invoice, this means the freight and insurance should be visible. 19 CFR 141.86 asks a US import invoice to itemise all charges upon the merchandise by name and amount, including freight and insurance. A CIF invoice that shows one lump sum leaves the importer working backwards.',
      ],
    },
    {
      heading: 'How does the same sale look on a CIF and an FOB invoice?',
      paragraphs: [
        'The table uses invented figures for one container of goods. The duty rate is not shown because it depends on the goods and the importing country; the point is which amount it would apply to.',
      ],
      table: {
        caption: 'Worked example with invented parties and figures, in US dollars',
        head: ['Line', 'FOB invoice', 'CIF invoice'],
        rows: [
          ['Goods, delivered on board at the port of shipment', '20,000.00', '20,000.00'],
          ['Sea freight to the destination port', 'Not invoiced (buyer pays carrier)', '1,800.00'],
          ['Cargo insurance', 'Not invoiced', '120.00'],
          ['Invoice total', '20,000.00', '21,920.00'],
          [
            'Starting point on a CIF valuation basis',
            '20,000.00 plus the buyer’s freight and insurance',
            '21,920.00',
          ],
          [
            'Starting point on a US basis',
            '20,000.00',
            '20,000.00 after deducting itemised freight and insurance',
          ],
        ],
      },
    },
    {
      heading: 'Should you quote CIF or FOB?',
      paragraphs: [
        'Choose by who can buy freight and insurance on better terms, and by what the buyer’s bank or market expects. A short check:',
      ],
      steps: [
        'Confirm the goods travel by sea or inland waterway. For containers handed over at a terminal, look at FCA or CIP instead, as our FCA vs FOB article explains.',
        'If the buyer has its own forwarder and freight contract, FOB lets it use them.',
        'If the buyer wants a delivered-to-port price and you can book the freight, quote CIF and name the destination port.',
        'Under CIF, agree the insurance level in writing if Institute Cargo Clauses (C) are not enough for the goods.',
        'Itemise freight and insurance on the commercial invoice so the importer can apply its country’s valuation basis.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is CIF more expensive than FOB?',
      a: 'The CIF price is higher because it includes freight and insurance, but the buyer pays those costs separately under FOB. The total cost of getting the goods to the destination port can be similar either way.',
    },
    {
      q: 'Can CIF be used for air freight?',
      a: 'No. CIF is a sea and inland waterway rule under Incoterms® 2020. For air freight the comparable rule with insurance is CIP, Carriage and Insurance Paid To.',
    },
    {
      q: 'Who pays destination port charges under CIF?',
      a: 'The buyer pays unloading and import clearance unless the seller’s freight contract already covers some destination charges. Check what the carrier’s freight quote includes and say so in the sales contract.',
    },
    {
      q: 'Does the US charge duty on the CIF value?',
      a: 'US customs value starts from the price excluding international freight and insurance, under 19 U.S.C. § 1401a. Other countries add those costs. Check the importing country’s rule.',
    },
    {
      q: 'Who is the insured party under CIF?',
      a: 'The seller buys the policy, but the cover is against the buyer’s risk during carriage, so the buyer needs to be able to claim under it. Agree how the policy or certificate reaches the buyer.',
    },
  ],
  sources: [
    'icc-incoterms-2020',
    'w1-hmrc-incoterms',
    'w1-ita-know-your-incoterms',
    'wto-customs-valuation',
    'w1-cornell-19-usc-1401a',
    'us-cbp-invoice-contents',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/landed-cost-calculator', '/tools/invoice-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/landed-cost-calculator',
    title: 'Try both valuation bases on one shipment',
    text: 'The landed cost calculator applies the duty rate you enter to the goods value alone or to the CIF value, so you can see what each basis does to the total.',
  },
  related: ['/blog/fca-vs-fob', '/blog/fob-vs-ddp', '/blog/commercial-invoice-requirements'],
  cover: {
    id: '9VmKFc_c748',
    src: 'https://images.unsplash.com/photo-1759272548457-12b8580bfca7',
    width: 5177,
    height: 3449,
    alt: 'Cargo ship being loaded by port cranes, the on-board moment when risk passes under both CIF and FOB',
    caption: 'A cargo ship being loaded at a port with cranes',
    photographer: { name: 'Haris Illahi', profile: 'https://unsplash.com/@harisillahi' },
    page: 'https://unsplash.com/photos/cargo-ship-being-loaded-at-a-port-with-cranes-9VmKFc_c748',
  },
};

export default article;
