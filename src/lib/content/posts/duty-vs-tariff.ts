import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "duty vs tariff" 880, KD 11.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'duty-vs-tariff',
  title: 'Duty vs tariff: what is the difference on an import?',
  metaTitle: 'Duty vs tariff: the difference on imports',
  description:
    'Duty and tariff are used as synonyms, but they name different things: the schedule and rate versus the amount you pay. Where the rate comes from, and how it enters landed cost.',
  lede: 'A supplier quotes “duty-free”, a news report talks about a new tariff, and your broker’s invoice says “customs duty”. They are talking about the same money from different ends: the rule that sets it and the amount that gets paid.',
  answer:
    'A tariff is the importing country’s schedule of rates for imported goods, or the rate on one line of it; a duty is the amount actually charged on a shipment under that rate. The World Trade Organization uses the words almost interchangeably: customs duties on merchandise imports are called tariffs. The rate always comes from the importing country.',
  keyFacts: [
    'The WTO states that customs duties on merchandise imports are called tariffs.',
    'The WTO distinguishes bound rates, the ceilings a member has committed to, from applied rates, the rates it actually charges.',
    'The WTO defines an ad valorem tariff as a rate charged as a percentage of the price.',
    'According to the WCO, more than 200 countries and economies use the Harmonized System as the basis of their customs tariffs.',
    'CBP states that it, not the importer, makes the final determination of the correct rate of duty for a US import.',
  ],
  definitions: [
    {
      term: 'Tariff',
      meaning:
        'The importing country’s schedule of duty rates for imported goods, or the rate set on one line of it.',
    },
    {
      term: 'Duty',
      meaning:
        'The amount charged on a particular import, worked out by applying the tariff rate to the goods.',
    },
    {
      term: 'Tariff line',
      meaning: 'In the WTO’s words, a product as defined by a system of code numbers for tariffs.',
    },
    {
      term: 'MFN rate',
      meaning:
        'The normal non-discriminatory tariff a WTO member charges, excluding preferential rates under trade agreements.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between a duty and a tariff?',
      paragraphs: [
        'In everyday trade use, the tariff is the rule and the duty is the bill. The tariff is the published schedule that says what rate applies to which goods; the duty is what one shipment owes when that rate is applied to it.',
        'In official language the line is thin. The World Trade Organization’s own page on the subject opens by saying that customs duties on merchandise imports are called tariffs, so a WTO document may say “tariff” where a customs invoice says “duty”. Neither is wrong.',
        'For your paperwork, the useful distinction is this: you look up a tariff, and you pay a duty. When someone says “the tariff on this product went up”, they mean the rate in the schedule changed, and every future duty on that product changes with it.',
      ],
    },
    {
      heading: 'How do duty and tariff compare?',
      paragraphs: [
        'The table sets the two words side by side, with the related terms that turn up on quotes and customs forms.',
      ],
      table: {
        caption: 'Duty, tariff and related terms compared',
        head: ['Term', 'What it names', 'Where you see it'],
        rows: [
          [
            'Tariff (schedule)',
            'The country’s full list of goods and rates',
            'The importing country’s official tariff, such as the US Harmonized Tariff Schedule',
          ],
          [
            'Tariff rate',
            'The rate on one tariff line',
            'A percentage or other rate printed against a code',
          ],
          ['Duty', 'The amount owed on a shipment', 'The entry, the broker’s bill, a courier bill'],
          [
            'Bound rate',
            'The WTO ceiling a member has committed to',
            'WTO schedules and tariff databases',
          ],
          ['Applied rate', 'The rate a member actually charges', 'The national tariff'],
          [
            'Duty-free',
            'A tariff line or preference with a zero rate',
            'Quotes and tariff entries marked “Free”',
          ],
        ],
      },
    },
    {
      heading: 'Who sets the tariff rate?',
      paragraphs: [
        'The importing country does. Your country’s tariff decides nothing about what your buyer pays; the buyer’s country’s tariff does. That is why the same goods can be duty-free into one market and dutiable into the next.',
        'WTO membership limits how high a country may go. The WTO explains that members bind their customs duty rates, and that its tariff data covers two types: bound rates, the ceilings listed in each member’s schedule of commitments, and applied rates, the rates members currently charge, which can be lower. The applied rate is the one that reaches the invoice.',
        'Within the applied tariff, the rate can still depend on where the goods come from. The WTO describes the most-favoured-nation tariff as the normal non-discriminatory rate, excluding preferential rates under free trade agreements. Which rate applies to your goods depends on their origin and on whether the importer can claim a preference.',
      ],
    },
    {
      heading: 'Why do tariffs around the world look similar?',
      paragraphs: [
        'Because most of them share a skeleton. The World Customs Organization’s Harmonized System groups goods under six-digit codes, and the WCO reports that more than 200 countries and economies use it as the basis for their customs tariffs. Countries add their own digits after the first six, so a national tariff line is longer and more detailed than the shared HS code.',
        'The shared structure does not mean shared rates. Two countries can put the same goods under the same six-digit heading and charge entirely different duties.',
        'It does help your documents travel. A clear description on the commercial invoice lets the importer’s broker find the right national line quickly, whichever country the goods go to. A vague one, such as “parts” or “accessories”, leaves the broker guessing and customs asking questions.',
      ],
    },
    {
      heading: 'Where do you find the duty rate for your product?',
      paragraphs: [
        'In the importing country’s official tariff, read for your own goods. For the US, CBP points importers to the US International Trade Commission’s tariff database, the searchable Harmonized Tariff Schedule, and warns that the rate you find is only as good as the information you put in and may not be the rate that finally applies.',
        'CBP adds that it makes the final determination of the correct rate, not the importer, and that you may request a binding ruling for certainty on a particular item. Other countries publish their tariffs online through their customs authority. TradeDocs does not suggest codes or rates for products; classify against the official tariff, and ask a licensed customs broker or the customs authority when unsure.',
      ],
    },
    {
      heading: 'How does duty enter your landed cost?',
      paragraphs: [
        'For an ad valorem rate, which the WTO defines as a rate charged as a percentage of the price, duty is the customs value multiplied by the rate. The value it multiplies differs by country. In the US, 19 CFR 152.102 defines the price actually paid or payable as excluding international freight and insurance; in the UK, HMRC includes transport and insurance up to the place where goods enter the UK.',
        'The worked example below uses invented figures and an invented 5% rate to show how the basis alone changes the duty. Replace the rate with the one from the official tariff for your goods.',
      ],
      table: {
        caption: 'Worked example with invented figures and an invented 5% rate',
        head: ['Item', 'Value basis excluding freight', 'Value basis including freight'],
        rows: [
          ['Goods (invoice price)', '10,000.00', '10,000.00'],
          ['International freight', 'not included', '800.00'],
          ['Insurance', 'not included', '50.00'],
          ['Customs value', '10,000.00', '10,850.00'],
          ['Duty at the invented 5% rate', '500.00', '542.50'],
        ],
      },
    },
  ],
  faq: [
    {
      q: 'Is a tariff a tax?',
      a: 'It is a charge collected by the government on imports, and the WTO notes that tariffs raise revenue for governments. Many countries also charge separate import taxes, such as VAT, on top of duty.',
    },
    {
      q: 'Who pays the tariff on imported goods?',
      a: 'The importer of record pays the duty to customs. Whether the buyer or the seller bears that cost commercially depends on the Incoterms® rule in the sale contract, for example DAP or DDP.',
    },
    {
      q: 'Are import duty and customs duty the same thing?',
      a: 'In practice, yes. Both name the charge customs collects on imported goods under the importing country’s tariff.',
    },
    {
      q: 'Can two countries charge different duty on the same product?',
      a: 'Yes. Each country sets its own applied rates, even when both classify the goods under the same Harmonized System heading.',
    },
    {
      q: 'What does duty-free mean on a quotation?',
      a: 'It should mean the tariff line or a trade preference carries a zero rate into the named country. Check it against the official tariff, since import taxes and fees may still apply.',
    },
    {
      q: 'Does a free trade agreement remove the tariff?',
      a: 'It can lower the rate, sometimes to zero, for goods that meet the agreement’s origin rules, when the importer claims the preference. The rules and the proof of origin each agreement requires differ; TradeDocs does not prepare proof of origin.',
    },
  ],
  sources: [
    'w3-wto-tariffs',
    'w3-wto-tariff-data',
    'w3-wco-hs',
    'w3-cbp-duty-rates',
    'w3-cbp-19-cfr-152-102',
    'w3-hmrc-delivery-costs',
    'wto-customs-valuation',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/incoterms', '/tools/invoice-generator'],
  callout: {
    afterSection: 1,
    tool: '/tools/landed-cost-calculator',
    title: 'Turn a tariff rate into a landed cost',
    text: 'Enter the goods value, freight, insurance and the rate from the official tariff, and see the duty and total landed cost on either value basis.',
  },
  related: [
    '/blog/how-to-calculate-import-duty',
    '/blog/brokerage-fees-and-duties-on-courier-shipments',
    '/guides/dap-vs-ddp',
    '/blog/commercial-invoice-requirements',
  ],
  cover: {
    id: 'kyCNGGKCvyw',
    src: 'https://images.unsplash.com/photo-1494412685616-a5d310fbb07d',
    width: 3936,
    height: 2624,
    alt: 'Rows of shipping containers stacked in an industrial port, seen from above',
    caption: 'Shipping containers in an industrial port',
    photographer: { name: 'CHUTTERSNAP', profile: 'https://unsplash.com/@chuttersnap' },
    page: 'https://unsplash.com/photos/shipping-containers-in-industrial-port-kyCNGGKCvyw',
  },
};

export default article;
