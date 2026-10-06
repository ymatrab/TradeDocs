import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "fob vs ddp" 260; "ddp vs fob" 210.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'fob-vs-ddp',
  title: 'FOB vs DDP: what changes when you quote delivered, duty paid',
  metaTitle: 'FOB vs DDP: quoting an overseas buyer',
  description:
    'FOB ends your job at the port of shipment; DDP runs it to the buyer’s door, through import customs and the duty bill. What DDP adds to a quote, with a worked example.',
  lede: 'A buyer who asks for an FOB price and a buyer who asks for DDP are asking for very different amounts of work. FOB stops when the goods are loaded in your country. DDP makes you the party that gets them through the buyer’s customs and pays the import charges there, often in a tax system you have never dealt with.',
  answer:
    'Under FOB the seller clears the goods for export and loads them on board at the named port of shipment, and the buyer pays everything after that. Under DDP the seller delivers to the named destination, clears the goods for import and pays the import duties and taxes.',
  keyFacts: [
    'FOB and DDP are both Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
    'Under FOB, risk passes when the goods are on board the vessel at the named port of shipment; FOB is for sea and inland waterway transport.',
    'Under DDP, HMRC’s guidance says the seller clears the goods for export and import, pays the duty for both and bears all costs and risks to the destination.',
    'DDP works for any mode of transport, according to the International Trade Administration.',
    'The WTO Customs Valuation Agreement excludes costs incurred after importation, such as duties and onward transport, from customs value.',
  ],
  definitions: [
    {
      term: 'FOB (Free on Board)',
      meaning:
        'The seller delivers on board the buyer’s vessel at the named port of shipment, cleared for export.',
    },
    {
      term: 'DDP (Delivered Duty Paid)',
      meaning:
        'The seller delivers at the named destination, cleared for import, with import duties and taxes paid.',
    },
    {
      term: 'Import taxes',
      meaning:
        'Taxes such as VAT or sales tax that the importing country charges at the border on top of customs duty.',
    },
    {
      term: 'Landed cost',
      meaning:
        'The total cost of goods once they are at the destination: price, freight, insurance, duty, taxes and fees.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between FOB and DDP?',
      paragraphs: [
        'The difference is where the seller’s job ends. Under FOB the seller delivers the goods on board the vessel the buyer nominated, at the named port of shipment, and the buyer bears all costs and risks from then on. Under DDP, HMRC’s customs valuation guidance describes the seller delivering the goods cleared for import, on the arriving means of transport ready for unloading, at the named destination, after bearing all the costs and risks of getting them there.',
        'Under FOB your obligations end in your own country. DDP is the only one of the eleven Incoterms® 2020 rules in which the seller also clears the goods for import, so it is the one that takes you furthest into the buyer’s country.',
      ],
      table: {
        caption: 'FOB and DDP compared under the Incoterms® 2020 rules',
        head: ['', 'FOB (Free on Board)', 'DDP (Delivered Duty Paid)'],
        rows: [
          ['Transport modes', 'Sea and inland waterway only', 'Any'],
          ['Named place', 'Port of shipment', 'Destination in the buyer’s country'],
          ['Export clearance', 'Seller', 'Seller'],
          ['Main carriage', 'Buyer', 'Seller'],
          [
            'Risk passes',
            'On board at the port of shipment',
            'At the destination, ready for unloading',
          ],
          ['Import clearance', 'Buyer', 'Seller'],
          ['Import duties and taxes', 'Buyer', 'Seller'],
          ['Unloading at destination', 'Buyer', 'Buyer'],
        ],
      },
    },
    {
      heading: 'What does a DDP quote have to cover?',
      paragraphs: [
        'A DDP quote has to cover everything an FOB quote does plus the freight, any insurance you choose to buy, the destination handling, the import clearance and the import charges. The rule does not oblige you to insure, but under DDP the goods are at your risk until they arrive, so going without cover is a decision you take for your own goods.',
        'The import charges are the part you cannot estimate from your own country. The duty rate depends on how the goods are classified in the importing country’s tariff and where they originate; the import taxes depend on that country’s tax law. Look them up in the importing country’s official tariff, or ask a customs broker there, before you price.',
      ],
    },
    {
      heading: 'Do you need to register in the buyer’s country to sell DDP?',
      paragraphs: [
        'You may. Paying another country’s import taxes as the seller can bring registration duties with it. In the UK, HMRC says a business based outside the UK that supplies goods there must register for VAT regardless of its turnover. Other countries apply their own rules, and some require a local representative.',
        'Check this before quoting DDP, not after the first shipment. If you cannot or do not want to register, DAP keeps the delivery to the buyer’s door but leaves import clearance and the import charges with the buyer; our guide to DAP vs DDP compares the two.',
      ],
    },
    {
      heading: 'How does an FOB price become a DDP price?',
      paragraphs: [
        'Build it up line by line from the FOB price. The figures and rates below are invented; replace them with your freight quote, the importing country’s duty rate for your goods and its import tax rate. The duty here is applied to the goods plus freight and insurance, which is how a country valuing on a CIF basis would start; a country valuing on the goods price alone would apply it to the first line only.',
      ],
      table: {
        caption: 'Worked example with invented parties, figures and rates, in euros',
        head: ['Line', 'Basis', 'Amount'],
        rows: [
          ['FOB price, goods on board at the port of shipment', 'Your price', '10,000.00'],
          ['Sea freight and cargo insurance to the destination port', 'Invented quote', '900.00'],
          ['Customs value on a CIF basis', '10,000.00 + 900.00', '10,900.00'],
          ['Import duty', 'Invented 5% placeholder rate', '545.00'],
          ['Import tax', 'Invented 20% placeholder rate on value plus duty', '2,289.00'],
          ['Customs broker and delivery to the buyer’s address', 'Invented quote', '450.00'],
          [
            'DDP cost before your margin',
            'Sum of the lines above, excluding the value line',
            '14,184.00',
          ],
        ],
      },
    },
    {
      heading: 'What should a DDP invoice show?',
      paragraphs: [
        'It should show the price for the goods separately from the freight, the duty and the import charges. The WTO’s technical note on customs valuation says costs incurred after importation, including duties and onward transport, are not part of the customs value. A single all-in DDP figure makes the importing customs authority work backwards to find the value of the goods; separate lines let it see it.',
        'HMRC’s guidance makes a related point: the Incoterm does not restrict the valuation method, and goods delivered duty paid can still be valued on their transaction value. The invoice is what customs reads to find that value, so write the rule, the named place and the version, for example “DDP Lyon, buyer’s warehouse, Incoterms® 2020”, and itemise the charges.',
      ],
    },
    {
      heading: 'Should you quote FOB or DDP?',
      paragraphs: [
        'Quote by what you can deliver reliably. A short check before you send the price:',
      ],
      steps: [
        'If the buyer has its own forwarder and importer set-up, FOB, or FCA for containers and air freight, keeps your job simple.',
        'If the buyer wants a door-delivered price, decide whether you can act on the import side or only deliver; DAP covers delivery without import charges.',
        'Before quoting DDP, confirm the duty rate, the import tax rate and any registration the importing country requires.',
        'Build the DDP price from the FOB price, line by line, and keep the lines on the invoice.',
        'Write the same rule, place and version on the quotation, proforma and commercial invoice.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is DDP better for the buyer than FOB?',
      a: 'It is simpler for the buyer, who pays one price and receives the goods cleared. The buyer pays for that convenience in the price, and gives up control of the freight and the import.',
    },
    {
      q: 'Who is the importer under DDP?',
      a: 'The seller takes on import clearance under the rule. Whether the seller can be the importer, and what registration that needs, depends on the importing country’s law.',
    },
    {
      q: 'Can FOB be used for air freight?',
      a: 'No. FOB is a sea and inland waterway rule under Incoterms® 2020. DDP, like FCA, works for any mode of transport.',
    },
    {
      q: 'Who unloads the goods under DDP?',
      a: 'The buyer. Under DDP the seller delivers on the arriving means of transport, ready for unloading; if you want the seller to unload too, that is not what the rule says, so agree it in the contract.',
    },
    {
      q: 'Does a DDP price include the buyer’s local sales tax?',
      a: 'Import taxes charged at the border are part of DDP. Taxes on the buyer’s own later sales are not. Agree in the contract which taxes the seller pays.',
    },
  ],
  sources: [
    'icc-incoterms-2020',
    'w1-hmrc-incoterms',
    'w1-ita-know-your-incoterms',
    'wto-customs-valuation',
    'w1-gov-uk-register-for-vat',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/incoterms', '/tools/proforma-invoice-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/landed-cost-calculator',
    title: 'Build your DDP price from the FOB price',
    text: 'Enter the goods value, freight, insurance and the duty and tax rates for the importing country, and the landed cost calculator shows the total and the cost per unit.',
  },
  related: ['/guides/dap-vs-ddp', '/blog/ddp-vs-ddu', '/blog/cif-vs-fob', '/blog/fca-vs-fob'],
  cover: {
    id: 'duKI9Bhd2zc',
    src: 'https://images.unsplash.com/photo-1759389003674-bbc78848a532',
    width: 7093,
    height: 3990,
    alt: 'Cranes loading containers onto a large vessel, the point where an FOB seller’s delivery ends',
    caption: 'Cargo cranes loading shipping containers onto a large vessel',
    photographer: {
      name: 'Wolfgang Weiser',
      profile: 'https://unsplash.com/@hamburgmeinefreundin',
    },
    page: 'https://unsplash.com/photos/cargo-cranes-loading-shipping-containers-onto-a-large-vessel-duKI9Bhd2zc',
  },
};

export default article;
