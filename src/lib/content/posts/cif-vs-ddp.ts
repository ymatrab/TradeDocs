import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "cif vs ddp" 90.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (v2 #29: where risk passes vs where
 * cost ends; import duties).
 */
const article: ContentArticle = {
  slug: 'cif-vs-ddp',
  title: 'CIF vs DDP: where risk passes, where cost ends, who pays duty',
  metaTitle: 'CIF vs DDP: risk, cost and import duty',
  description:
    'CIF ends the seller’s risk at the port of loading and its costs at the arrival port. DDP carries both to the buyer’s door, with import duty and clearance on the seller.',
  lede: 'CIF and DDP both have the seller paying to move goods into the buyer’s country, so they get compared. They sit far apart. Under CIF the buyer owns the voyage risk and the whole import. Under DDP the seller becomes, in effect, the importer.',
  answer:
    'Under CIF the seller pays sea freight and minimum insurance to the destination port, but risk passes when the goods are on board at origin, and the buyer handles import. Under DDP (Delivered Duty Paid) the seller carries cost and risk to the named place and also clears the goods for import and pays the duties and taxes.',
  keyFacts: [
    'CIF and DDP are Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'The ICC reserves CIF for maritime trade; DDP can be used for any mode of transport.',
    'HMRC’s guidance says that under DDP the seller clears the goods for export and import, pays the duty and carries out all customs formalities.',
    'Under CIF, risk passes to the buyer when the goods are on board the ship at the port of shipment.',
    'Under 19 CFR 141.18, a corporation not incorporated in the US needs a resident agent and a bond to enter goods for consumption.',
  ],
  definitions: [
    {
      term: 'CIF (Cost, Insurance and Freight)',
      meaning:
        'The seller delivers on board at the port of shipment, pays freight to the named destination port and buys minimum insurance for the buyer.',
    },
    {
      term: 'DDP (Delivered Duty Paid)',
      meaning:
        'The seller delivers at the named place in the buyer’s country, cleared for import with duties and taxes paid, ready for unloading.',
    },
    {
      term: 'Importer of record',
      meaning:
        'The party responsible to the importing country’s customs for the entry, its accuracy and the duties owed.',
    },
    {
      term: 'EORI number',
      meaning:
        'The customs identifier HMRC asks for when goods move between Great Britain and other countries.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between CIF and DDP?',
      paragraphs: [
        'The difference is how far the seller’s risk, costs and customs duties reach. Under CIF they stop early and at two different points: risk passes on board at the port of shipment, and the seller’s costs end at the destination port. Under DDP risk and cost run together to the named place, usually the buyer’s premises, and the seller also takes on the import.',
        'Both are rules in the ICC’s Incoterms® 2020 set. CIF is for sea and inland waterway transport only. DDP works for any mode, so the same rule can cover a container, an air shipment or a courier parcel.',
      ],
    },
    {
      heading: 'Where does the seller’s risk end, and where does its cost end?',
      paragraphs: [
        'Under CIF those are two places; under DDP they are one. The table follows a shipment from the seller’s warehouse to the buyer’s and marks who carries each stretch.',
      ],
      table: {
        caption: 'CIF and DDP compared under Incoterms® 2020',
        head: ['', 'CIF (Cost, Insurance and Freight)', 'DDP (Delivered Duty Paid)'],
        rows: [
          ['Transport modes', 'Sea and inland waterway only', 'Any mode'],
          ['Named place', 'Port of destination', 'Usually the buyer’s premises'],
          ['Risk passes', 'On board at the port of shipment', 'On arrival at the named place'],
          ['Seller’s costs end', 'At the destination port', 'At the named place'],
          ['Insurance', 'Seller must buy minimum cover', 'Not required of either party'],
          ['Export clearance', 'Seller', 'Seller'],
          ['Import clearance', 'Buyer', 'Seller'],
          ['Import duties and taxes', 'Buyer', 'Seller'],
          ['Unloading at the named place', 'Buyer', 'Buyer'],
        ],
      },
    },
    {
      heading: 'Who pays import duty under CIF and DDP?',
      paragraphs: [
        'The buyer pays under CIF; the seller pays under DDP. HMRC’s guidance describes DDP as the rule under which the seller clears the goods for both export and import, pays the duty and carries out all the customs formalities. Import taxes collected at the border, such as VAT, normally sit with the same party, but check the importing country’s rules on who may pay and reclaim them.',
        'Under CIF the seller has no part in the import. Its invoice gives the buyer’s customs broker the goods value, the freight and the insurance, and the buyer pays whatever duty and tax the import attracts.',
      ],
    },
    {
      heading: 'What does DDP ask of the seller at the border?',
      paragraphs: [
        'DDP makes the seller answerable to a foreign customs authority, which takes registrations, money and a local contact. CBP reminds importers that the importer of record is ultimately responsible for the correctness of the entry documents, even when a broker prepares them.',
        'In the US, 19 CFR 141.18 lets a corporation that is not incorporated in the US enter goods for consumption only if it has a resident agent authorised to accept legal papers in the state of the port of entry and files a bond with a resident corporate surety. In the UK, HMRC says businesses not established in the country usually cannot apply for an EORI number themselves and need to appoint someone to deal with customs on their behalf.',
        'So before you quote DDP, confirm you can be the importer in that country, or have a representative who will act for you, and that you can pay or reclaim the import taxes.',
      ],
    },
    {
      heading: 'How does the same order price under CIF and DDP?',
      paragraphs: [
        'A DDP price is a CIF price plus the costs and risks of the arrival side: port handling, import clearance, duty, tax, delivery and insurance for the extra legs. The duty and tax lines below are invented placeholders; you would replace them with the amounts that apply to your goods and destination.',
      ],
      table: {
        caption:
          'Worked example with invented parties and figures: Example Tools Ltd ships one container of hand tools to a buyer’s warehouse',
        head: ['Cost line', 'CIF destination port', 'DDP buyer’s warehouse'],
        rows: [
          ['Goods, packed for export', '30,000', '30,000'],
          ['Inland transport and export clearance', '800', '800'],
          ['Sea freight', '2,600', '2,600'],
          ['Insurance', '120 (minimum cover)', '140 (to the warehouse)'],
          ['Arrival handling and import clearance', 'Buyer pays', '900'],
          ['Import duty (invented placeholder)', 'Buyer pays', '1,500'],
          ['Import tax (invented placeholder)', 'Buyer pays', '7,200'],
          ['Delivery from the port', 'Buyer pays', '500'],
          ['Invoice total', '33,520', '43,640'],
        ],
      },
    },
    {
      heading: 'Does a DDP price change the customs value?',
      paragraphs: [
        'Duty is charged on the customs value, not on your DDP invoice total, so the declaration needs the value of the goods kept apart from the duty and tax you built into the price. HMRC states that the Incoterm used does not restrict the valuation method and gives goods delivered duty paid as an example that can still be valued on the transaction value method.',
        'In the US, 19 U.S.C. § 1401a leaves out of transaction value the customs duties and federal taxes payable because of importation, and transport after importation, when they are identified separately from the price. International freight and insurance are excluded from the price actually paid or payable. In the UK, HMRC includes transport and insurance up to the border and lets the importer deduct transport within the UK when it is shown separately. In both cases a DDP invoice that lists freight, insurance, duty, tax and delivery as separate lines lets the declaration start from the right figure.',
      ],
    },
    {
      heading: 'When should you choose CIF or DDP?',
      paragraphs: ['A short decision path:'],
      steps: [
        'If the goods go by sea to a buyer that can clear imports and has a forwarder at the port, CIF keeps your risk and paperwork short.',
        'If the buyer wants a door-to-door price with no import work, consider DDP only after confirming you can act as importer or appoint a representative.',
        'If you cannot be the importer, quote DAP: delivered to the door, with the buyer clearing and paying for import.',
        'For DDP, get the duty and tax position from the official tariff and a broker in the importing country before you set the price.',
        'Write the rule, the named place and the version on every document, for example “DDP Chicago, buyer’s warehouse, Incoterms® 2020” (an invented example).',
      ],
    },
  ],
  faq: [
    {
      q: 'Is DDP always more expensive than CIF?',
      a: 'The DDP invoice is higher because it includes the arrival costs, duty and taxes. The buyer’s total cost may be similar, since a CIF buyer pays those amounts separately. Compare landed costs, not invoice totals.',
    },
    {
      q: 'Who carries the risk if goods are lost at sea under CIF?',
      a: 'The buyer. Under CIF risk passes when the goods are on board at the port of shipment, so the buyer claims on the insurance the seller bought for it.',
    },
    {
      q: 'Can I use DDP for a shipment by sea?',
      a: 'Yes. DDP works for any mode of transport, including sea freight. The named place is usually the buyer’s premises rather than a port.',
    },
    {
      q: 'What if the duty turns out higher than I priced?',
      a: 'Under DDP the seller pays the duty, so a higher assessment reduces your margin. Check the tariff classification and rate with official sources and a broker before quoting.',
    },
    {
      q: 'Is DAP a middle ground between CIF and DDP?',
      a: 'Yes. Under DAP the seller pays and carries the risk to the named place, as under DDP, but the buyer clears and pays for import. The CIF vs DAP article compares that pair.',
    },
  ],
  sources: [
    'c3-icc-incoterms-2020',
    'c3-hmrc-incoterms',
    'c3-ita-know-your-incoterms',
    'c3-hmrc-delivery-costs',
    'd2-usc-19-1401a-duties',
    'd2-cfr-19-141-18',
    'd2-cbp-importer-exporter-tips',
    'd2-gov-uk-eori',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/export-price-calculator', '/tools/incoterms'],
  callout: {
    afterSection: 3,
    tool: '/tools/export-price-calculator',
    title: 'Compare a CIF price with a DDP estimate',
    text: 'Start from your ex-works price and add the freight, insurance and import costs you were quoted, with no rates of our own.',
  },
  related: [
    '/blog/exw-vs-ddp',
    '/blog/fob-vs-ddp',
    '/blog/cif-vs-dap',
    '/guides/dap-vs-ddp',
    '/blog/who-pays-import-duties',
    '/guides/importer-of-record',
  ],
  cover: {
    id: 'wjQPCInHcog',
    src: 'https://images.unsplash.com/photo-1770710000589-de8d2babad65',
    width: 8044,
    height: 4525,
    alt: 'Large container ships docked under cranes at a busy port, where CIF ends and a DDP import begins',
    caption: 'Large container ships docked at a busy port with cranes',
    photographer: {
      name: 'Wolfgang Weiser',
      profile: 'https://unsplash.com/@hamburgmeinefreundin',
    },
    page: 'https://unsplash.com/photos/large-container-ships-docked-at-a-busy-port-with-cranes-wjQPCInHcog',
  },
};

export default article;
