import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "landed cost" 1,000, KD 5; "what is landed cost" 720,
 * KD 7; "landed cost formula" 50; "landed cost calculator" 320, KD 10.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'landed-cost',
  title: 'What is landed cost? The formula, with a worked example',
  metaTitle: 'Landed cost: formula and worked example',
  description:
    'Landed cost is the full cost of getting goods to the buyer’s door: price, freight, insurance, duty, import taxes and fees. The formula, the valuation base and a worked example.',
  lede: 'The price on the invoice is only the start. By the time goods are cleared and delivered, freight, insurance, duty, import taxes and handling fees have been added, and the order of those additions changes the total. This guide sets out the formula and works through one shipment.',
  answer:
    'Landed cost is the total cost of a shipment once it has arrived and been cleared: the price of the goods plus freight, insurance, import duty, import taxes and any other charges such as brokerage and delivery. Divided by the number of units, it gives the real cost of each unit you sell or buy.',
  keyFacts: [
    'Under the WTO Customs Valuation Agreement, the transaction value, the price actually paid or payable, is the main basis of customs value.',
    'Where a WTO member values on a CIF basis, freight and insurance to the place of import are added to the customs value.',
    'Under 19 U.S.C. 1401a, international freight and insurance are excluded from the price used for US transaction value.',
    'The ICC’s Incoterms® 2020 rules decide which of these costs the seller has already included in its price.',
    'The ITA describes the commercial invoice as the document customs uses to assess duties and taxes, so it is where the goods value starts.',
  ],
  definitions: [
    {
      term: 'Landed cost',
      meaning:
        'The goods price plus every cost of transport, clearance and delivery to the named destination.',
    },
    {
      term: 'Customs value',
      meaning: 'The value customs applies the duty rate to, set by the importing country’s rules.',
    },
    {
      term: 'CIF value',
      meaning:
        'Cost, insurance and freight: the goods value plus freight and insurance to the port of import.',
    },
    {
      term: 'Ad valorem duty',
      meaning: 'A duty expressed as a percentage of the customs value.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the landed cost formula?',
      paragraphs: [
        'Landed cost = goods value + freight + insurance + duty + import taxes + other costs. Each term is simple; the work is in knowing what each one is charged on. Duty is a rate applied to a customs value, and import taxes are a rate applied to a base that, depending on the country, can already include the duty, so the order of the calculation matters.',
        'Other costs is everything else the importer pays to get the goods to its door: the customs broker’s fee, terminal or airport handling, storage, inland delivery and any fees the importing country charges on clearance. Ask your broker and forwarder for these in writing; they are easy to forget and they can be a large share of a small shipment.',
      ],
    },
    {
      heading: 'What value is duty charged on?',
      paragraphs: [
        'The importing country decides. The WTO’s Customs Valuation Agreement makes the transaction value, the price actually paid or payable for the goods, the main basis of customs value, and members then differ on freight and insurance. Where a member values on a CIF basis, the WTO notes, freight and insurance to the place of import are added to the value.',
        'The United States is an example of the other approach. Under 19 U.S.C. 1401a, the price actually paid or payable excludes the costs of transportation, insurance and related services for the international shipment, so US duty is generally charged on a value without the ocean or air freight. Check which base the destination uses before you estimate, because the same rate gives a different duty on each.',
      ],
    },
    {
      heading: 'How does the Incoterms® rule change the landed cost?',
      paragraphs: [
        'The Incoterms® 2020 rule on the contract tells you which costs are already inside the price and which the buyer pays on top. Under EXW or FCA the buyer adds almost every cost after the seller’s premises. Under CIF or CIP the seller’s price already covers main carriage and insurance to the named place. Under DDP the seller pays the duty and import taxes too, so the buyer’s landed cost is close to the agreed price.',
        'Whoever pays them, the costs still exist. A seller quoting DDP needs the full landed cost before it sets the price; a buyer comparing an FCA offer with a DAP offer needs to add the missing costs to the FCA price before the two can be compared.',
      ],
    },
    {
      heading: 'How do you calculate landed cost step by step?',
      paragraphs: [
        'Work in one currency, and convert the supplier’s invoice at the rate the destination’s customs will use if you know it.',
      ],
      steps: [
        'Take the goods value from the commercial invoice.',
        'Add freight and insurance to the place of import, or leave them out of the duty base if the destination values goods without them.',
        'Apply the duty rate your broker or the destination’s tariff gives you to that customs value.',
        'Add the duty to the customs value and apply the import tax rate, if the destination charges tax on that combined base.',
        'Add the broker’s fee, handling, storage and delivery to the destination.',
        'Divide the total by the number of units for a cost per unit.',
      ],
    },
    {
      heading: 'What does a worked example look like?',
      paragraphs: [
        'Here is one shipment with invented parties and figures. A buyer imports 500 units into a country that charges duty on the CIF value and import tax on the CIF value plus duty. The 5% duty rate and 20% tax rate are placeholders; replace them with the rates for your goods and destination.',
      ],
      table: {
        caption: 'Worked example with invented figures and placeholder rates',
        head: ['Line', 'How it is worked out', 'Amount (USD)'],
        rows: [
          ['Goods value', 'From the commercial invoice', '10,000.00'],
          ['Freight', 'Quoted by the forwarder', '1,200.00'],
          ['Insurance', 'Quoted by the insurer', '50.00'],
          ['CIF value', '10,000 + 1,200 + 50', '11,250.00'],
          ['Duty at 5%', '5% of 11,250', '562.50'],
          ['Import tax at 20%', '20% of (11,250 + 562.50)', '2,362.50'],
          ['Broker, handling and delivery', 'Quoted by the broker', '400.00'],
          ['Landed cost', 'Sum of the lines above, CIF value once', '14,575.00'],
          ['Per unit', '14,575 ÷ 500', '29.15'],
        ],
      },
    },
    {
      heading: 'What changes if duty is charged on the goods value only?',
      paragraphs: [
        'In a country that leaves freight and insurance out of the customs value, the same 5% placeholder rate is charged on 10,000.00 instead of 11,250.00, so the duty is 500.00 instead of 562.50. If import tax is charged on the customs value plus duty, the tax base falls too. The freight and insurance are still part of the landed cost; they are simply not part of the duty base.',
        'That is why a landed cost estimate should state its assumptions: the duty base, the tax base, the rates and where each figure came from. An estimate that says how it was built can be corrected when the broker’s figures arrive.',
      ],
    },
    {
      heading: 'Where do the duty and tax rates come from?',
      paragraphs: [
        'From the importing country’s tariff, applied to the product’s classification there, and from its tax rules. TradeDocs holds no tariff data and does not look up rates; the landed cost calculator works with the rates you enter. Your buyer’s customs broker, or the destination’s official tariff, is the place to get them, together with any trade agreement preference the goods may qualify for.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is landed cost the same as the CIF price?',
      a: 'No. CIF covers the goods, freight and insurance to the port of import. Landed cost adds the duty, import taxes and the costs of clearing and delivering the goods.',
    },
    {
      q: 'Can import VAT be recovered and left out of landed cost?',
      a: 'Some registered businesses can recover import VAT under the destination’s rules, and then often leave it out of their product cost. Check with an adviser in that country before you assume it.',
    },
    {
      q: 'Should currency conversion costs be included?',
      a: 'If you pay in a different currency, the conversion cost is part of what the goods cost you. Many importers add a line for it, or for the bank’s fee, under other costs.',
    },
    {
      q: 'Who should calculate the landed cost, the seller or the buyer?',
      a: 'Whoever sets a price on it. A seller quoting DDP needs it to price the offer; a buyer needs it to compare offers on different Incoterms® rules and to set its own selling price.',
    },
  ],
  sources: [
    'wto-customs-valuation',
    'w5-usc-19-1401a',
    'icc-incoterms-2020',
    'trade-gov-commercial-invoice',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/incoterms', '/tools/invoice-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/landed-cost-calculator',
    title: 'Run your own figures',
    text: 'Enter the goods value, freight, insurance, other costs and the rates your broker gives you, choose whether duty is charged on the goods or the CIF value, and the landed cost calculator shows the total and the cost per unit.',
  },
  related: [
    '/guides/dap-vs-ddp',
    '/guides/hs-vs-hts-vs-schedule-b',
    '/blog/fca-vs-fob',
    '/blog/commercial-invoice-requirements',
  ],
  cover: {
    id: 't800tFf-tZA',
    src: 'https://images.unsplash.com/photo-1672552226604-4ab36b7e5ca6',
    width: 6000,
    height: 4000,
    alt: 'Warehouse aisle stacked with cartons, the goods whose full landed cost the importer adds up',
    caption: 'Warehouse filled with stacked cartons',
    photographer: { name: 'Arum Visuals', profile: 'https://unsplash.com/@arumvisuals' },
    page: 'https://unsplash.com/photos/a-warehouse-filled-with-lots-of-boxes-and-boxes-t800tFf-tZA',
  },
};

export default article;
