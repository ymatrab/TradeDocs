import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "how to calculate import duty" 260, KD 46;
 * "import duty calculator" 2,400, KD 43 is served by the landed cost calculator (plan routing).
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'how-to-calculate-import-duty',
  title: 'How to calculate import duty, step by step',
  metaTitle: 'How to calculate import duty: the method',
  description:
    'Import duty is customs value times the tariff rate. How customs value is built on an FOB or CIF basis, where the rate comes from, and a worked example with an invented rate.',
  lede: 'The arithmetic is one multiplication. The work is in the two numbers you multiply: the customs value, which depends on the importing country’s rules and your trade term, and the rate, which only the official tariff can give you.',
  answer:
    'For most goods, import duty is the customs value multiplied by the duty rate in the importing country’s tariff. The customs value usually starts from the price paid for the goods; some countries add freight and insurance to the border, others leave them out. Find the rate in the official tariff, never from a list of averages.',
  keyFacts: [
    'Under the WTO Customs Valuation Agreement, transaction value, the price actually paid or payable, is the main basis of customs value.',
    'WTO members that value on a CIF basis add freight and insurance to the border to the customs value.',
    'In the US, 19 CFR 152.102 excludes international freight and insurance from the price actually paid or payable.',
    'HMRC includes transport, insurance and related costs up to the place where goods enter the UK in the customs value.',
    'CBP states that it makes the final determination of the correct duty rate, and that a binding ruling gives certainty for a specific item.',
  ],
  definitions: [
    {
      term: 'Customs value',
      meaning:
        'The value customs uses to calculate ad valorem duty, built from the transaction value under the importing country’s rules.',
    },
    {
      term: 'Transaction value',
      meaning:
        'The price actually paid or payable for the goods when sold for export, with the adjustments the rules require.',
    },
    {
      term: 'Ad valorem rate',
      meaning: 'A duty rate charged as a percentage of value, in the WTO’s definition.',
    },
    {
      term: 'CIF and FOB basis',
      meaning:
        'Whether a country’s customs value includes freight and insurance to its border (CIF) or excludes them (FOB).',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'How do you calculate import duty?',
      paragraphs: [
        'Multiply the customs value by the duty rate. For a rate expressed as a percentage, which the WTO calls an ad valorem rate, that is the whole formula. The steps below build each number in the order customs does.',
      ],
      steps: [
        'Start from the price actually paid or payable for the goods, as shown on the commercial invoice.',
        'Adjust it to the importing country’s valuation basis: add or remove freight and insurance to the border, and make any other additions its rules require.',
        'Convert it into the importing country’s currency at the rate its customs authority uses.',
        'Find the tariff line for the goods in the official tariff and read the rate, including any preferential rate the importer can claim.',
        'Multiply the customs value by the rate to get the duty.',
        'Add import taxes and fees, if the country charges them, on the base its rules set.',
      ],
    },
    {
      heading: 'What is the customs value of imported goods?',
      paragraphs: [
        'It is the price of the goods, adjusted by rules. The WTO Customs Valuation Agreement makes transaction value, the price actually paid or payable for the goods when sold for export, the main method for WTO members. Other methods apply only when the transaction value cannot be used.',
        'The biggest difference between countries is freight. The WTO notes that members valuing on a CIF basis add freight and insurance to the border. The UK does: HMRC lists transport, insurance, loading and handling, and related charges up to the place where goods enter the UK as part of the customs value, along with inland costs in the country of export.',
        'The US does not. Under 19 CFR 152.102, the price actually paid or payable excludes the costs of transportation, insurance and related services for the international shipment to the place of importation in the United States. The same invoice can therefore produce two different customs values in two countries.',
      ],
    },
    {
      heading: 'How does the Incoterms® rule change the starting number?',
      paragraphs: [
        'The rule decides what your invoice price already includes, so it decides whether freight must be added or taken out. Under the ICC’s Incoterms® 2020 rules, EXW, FCA and FOB leave the main carriage to the buyer, so the invoice price excludes international freight. CPT, CIP, CFR and CIF include carriage to the destination, and CIP and CIF include insurance as well.',
      ],
      table: {
        caption:
          'What the invoice price covers under common rules, and the usual valuation adjustment',
        head: ['Rule on the invoice', 'Invoice price includes', 'CIF-basis country', 'US basis'],
        rows: [
          [
            'EXW',
            'Goods at the seller’s premises',
            'Add inland, main freight and insurance to the border',
            'Ask the importer’s broker how foreign inland costs are treated',
          ],
          [
            'FCA or FOB',
            'Goods delivered to the carrier or on board',
            'Add main freight and insurance to the border',
            'No freight adjustment',
          ],
          [
            'CFR or CPT',
            'Goods plus carriage to destination',
            'Add insurance; deduct carriage beyond the border',
            'Deduct international freight',
          ],
          [
            'CIF or CIP',
            'Goods plus carriage and insurance',
            'Deduct costs beyond the border',
            'Deduct international freight and insurance',
          ],
        ],
      },
    },
    {
      heading: 'Where does the duty rate come from?',
      paragraphs: [
        'From the importing country’s official tariff, and nowhere else. Most tariffs are built on the World Customs Organization’s six-digit Harmonized System, which the WCO says more than 200 countries and economies use, with national digits added. The rate sits against the full national code.',
        'For the US, CBP points to the US International Trade Commission’s tariff database and warns that a rate found there is only as good as the information entered. CBP makes the final determination of the rate, and you can request a binding ruling for a specific item. TradeDocs does not suggest codes or rates; look them up in the official tariff or ask a licensed customs broker.',
        'Not every rate is a percentage. A tariff line may state its rate another way, and the line itself shows how it is applied. Rates also change, so check them when you quote, not when the goods arrive.',
      ],
    },
    {
      heading: 'What does a worked example look like?',
      paragraphs: [
        'The example below follows one shipment through both valuation bases. The seller, goods, figures and the 4% duty rate are all invented; replace the rate with the one in the official tariff for your goods, and the import tax line with the destination’s actual rule.',
      ],
      table: {
        caption: 'Worked example with invented figures and an invented 4% duty rate (FCA invoice)',
        head: ['Line', 'CIF-basis country', 'US basis'],
        rows: [
          ['Invoice price, FCA seller’s warehouse', '12,000.00', '12,000.00'],
          ['Main freight to the border', '1,400.00', 'excluded'],
          ['Insurance to the border', '60.00', 'excluded'],
          ['Customs value', '13,460.00', '12,000.00'],
          ['Duty at the invented 4% rate', '538.40', '480.00'],
          [
            'Invented 20% import tax on value plus duty',
            '2,799.68',
            'not applicable in this example',
          ],
        ],
      },
    },
    {
      heading: 'What else belongs in the landed cost?',
      paragraphs: [
        'Duty is one line of the cost of getting goods to the buyer’s door. A landed cost adds the goods, freight, insurance, duty, any import tax, the customs broker’s or courier’s clearance charge and delivery after import. Who carries each of those lines commercially depends on the Incoterms® rule.',
        'Exchange rates matter more than people expect. Customs authorities set the rate used to convert an invoice currency into theirs; CBP publishes foreign currency exchange rates alongside its guidance on duty rates. A quote made weeks before arrival can move with the currency even when the tariff rate does not.',
        'Keep the inputs honest. A lower declared value or a vaguer description does not reduce duty legitimately; it creates an incorrect entry that the importer of record is responsible for.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is the formula for import duty?',
      a: 'For a percentage rate: duty = customs value × duty rate. The customs value is the transaction value adjusted to the importing country’s basis, and the rate comes from its official tariff.',
    },
    {
      q: 'Is import duty calculated on the FOB or the CIF value?',
      a: 'It depends on the importing country. WTO members valuing on a CIF basis, such as the UK under HMRC’s rules, include freight and insurance to the border; the US excludes international freight and insurance.',
    },
    {
      q: 'Is shipping included in the customs value?',
      a: 'In CIF-basis countries, shipping up to the border is included and shipping after it is not. In the US, international freight is excluded.',
    },
    {
      q: 'Can I use an average duty rate for an estimate?',
      a: 'Averages hide the rate for your goods, which can be far above or below. Use the rate on the tariff line in the official tariff, and label any estimate as an estimate.',
    },
    {
      q: 'Who calculates the duty, the importer or customs?',
      a: 'The importer or its broker calculates and declares it on the entry, and customs checks it. CBP states that it makes the final determination of the correct rate for US imports.',
    },
  ],
  sources: [
    'wto-customs-valuation',
    'w3-cbp-19-cfr-152-102',
    'w3-hmrc-delivery-costs',
    'w3-cbp-duty-rates',
    'w3-wto-tariff-data',
    'w3-wco-hs',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/incoterms', '/tools/proforma-invoice-generator'],
  callout: {
    afterSection: 2,
    tool: '/tools/landed-cost-calculator',
    title: 'Run the numbers for your shipment',
    text: 'Enter the invoice price, freight, insurance and the rate from the official tariff; the landed cost calculator shows duty, tax and the total.',
  },
  related: [
    '/blog/duty-vs-tariff',
    '/blog/brokerage-fees-and-duties-on-courier-shipments',
    '/blog/fca-vs-fob',
    '/guides/dap-vs-ddp',
  ],
  cover: {
    id: 'ySZdYkPGEbs',
    src: 'https://images.unsplash.com/photo-1648201188793-418f2b9b4b32',
    width: 5170,
    height: 3447,
    alt: 'Calculator resting on a sheet of paper, ready to work out customs value and import duty',
    caption: 'A calculator on a sheet of paper',
    photographer: { name: 'Aaron Lefler', profile: 'https://unsplash.com/@alefler' },
    page: 'https://unsplash.com/photos/a-calculator-sitting-on-top-of-a-piece-of-paper-ySZdYkPGEbs',
  },
};

export default article;
