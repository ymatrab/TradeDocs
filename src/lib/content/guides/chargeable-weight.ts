import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06/07): "volumetric weight" 390, KD 20; "how to
 * calculate dimensional weight" 390; "chargeable weight" 110; UK "volumetric weight" 260.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B (v2 guide #21).
 * Explainer only: the calculation itself lives at /tools/chargeable-weight, which this links to.
 * Divisors are the ones the tool cites (core sources iata-volumetric, dhl-express-volumetric,
 * fedex-dimensional, ups-dimensional); no rates, no rounding rules.
 */
const article: ContentArticle = {
  slug: 'chargeable-weight',
  title: 'Volumetric weight and chargeable weight, explained',
  metaTitle: 'Volumetric weight: how chargeable weight works',
  description:
    'Why carriers bill light, bulky cartons on their size, how volumetric and chargeable weight are worked out for air, express and sea freight, and what goes on your documents.',
  lede: 'A carton of pillows and a carton of bolts can weigh very different amounts and still fill the same space in an aircraft hold. Volumetric weight is how carriers charge for that space, and chargeable weight is the figure that ends up on the freight invoice.',
  answer:
    'Volumetric weight is a weight worked out from a shipment’s size: length × width × height divided by the carrier’s divisor. Chargeable weight is whichever is higher, the actual weight or the volumetric weight. IATA’s general rule for air cargo divides cubic centimetres by 6,000; DHL Express, FedEx and UPS publish 5,000 for international express.',
  keyFacts: [
    'IATA states that air carriers may charge by volumetric or actual weight, whichever is higher, and that the general rule divides volume in cubic centimetres by 6,000.',
    'DHL states that DHL Express divides length × width × height in centimetres by 5,000 to get volumetric weight.',
    'FedEx and UPS each publish a divisor of 5,000 for dimensional weight measured in centimetres on their international pages.',
    'Maersk describes LCL sea freight as charged on the cubic metres the cargo uses, while FCL is booked by the container.',
    'Article 5 of the Montreal Convention requires the air waybill to show the weight of the consignment.',
  ],
  definitions: [
    {
      term: 'Volumetric weight',
      meaning:
        'A notional weight calculated from a package’s dimensions and the carrier’s divisor; FedEx and UPS call it dimensional weight.',
    },
    {
      term: 'Actual weight',
      meaning: 'What the package weighs on the scales, packaging included: its gross weight.',
    },
    {
      term: 'Chargeable weight',
      meaning: 'The greater of the actual weight and the volumetric weight, which freight is billed on.',
    },
    {
      term: 'Divisor',
      meaning:
        'The number of cubic centimetres a carrier counts as one kilogram, such as 6,000 or 5,000.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Why do carriers charge by volumetric weight?',
      paragraphs: [
        'Because space is as limited as lift. An aircraft or a delivery van fills up by volume long before it reaches its weight limit if the cargo is light and bulky, so carriers price both. IATA puts it simply: air carriers can charge by volumetric weight or by actual weight, and whichever is higher is used for pricing.',
        'The divisor turns volume into a weight so the two can be compared. A smaller divisor makes the same box “heavier”, which is why a carton can cost more by express than by general air cargo even before rates are applied.',
      ],
    },
    {
      heading: 'How is chargeable weight worked out?',
      paragraphs: [
        'In four steps, carton by carton or for the whole consignment, depending on how the carrier rates it.',
      ],
      steps: [
        'Measure each package at its longest points, length, width and height, in centimetres, including any bulges.',
        'Multiply the three to get the volume in cubic centimetres.',
        'Divide by the carrier’s divisor to get the volumetric weight in kilograms.',
        'Compare it with the actual gross weight and take the higher figure: that is the chargeable weight.',
      ],
    },
    {
      heading: 'Which divisor applies to air, express and sea freight?',
      paragraphs: [
        'Each carrier publishes its own, and its rule for your country and service is the one that counts. These are the figures the TradeDocs calculator cites, from each carrier’s or IATA’s page as retrieved.',
      ],
      table: {
        caption: 'Published divisors by mode and carrier, as cited by the TradeDocs calculator',
        head: ['Mode or carrier', 'Rule', 'Equivalent density'],
        rows: [
          ['General air cargo (IATA)', 'cm³ ÷ 6,000', 'About 167 kg per m³'],
          ['DHL Express', 'cm³ ÷ 5,000', '200 kg per m³'],
          ['FedEx international', 'cm³ ÷ 5,000', '200 kg per m³'],
          ['UPS (UK site)', 'cm³ ÷ 5,000', '200 kg per m³'],
          ['Sea freight, LCL', 'Charged on the cubic metres used', 'Set by the forwarder’s tariff'],
          ['Sea freight, FCL', 'Priced per container', 'Not applicable'],
        ],
      },
    },
    {
      heading: 'How much difference does the divisor make?',
      paragraphs: [
        'Enough to change which weight you pay for. The example below runs one invented consignment through both divisors.',
      ],
      table: {
        caption: 'Worked example with invented cartons and figures, comparing the 6,000 and 5,000 divisors',
        head: ['', 'Air cargo, ÷ 6,000', 'Express, ÷ 5,000'],
        rows: [
          ['Four cartons of 50 × 40 × 30 cm', '240,000 cm³', '240,000 cm³'],
          ['Volumetric weight', '40 kg', '48 kg'],
          ['Actual gross weight, four cartons', '44 kg', '44 kg'],
          ['Chargeable weight', '44 kg (actual is higher)', '48 kg (volumetric is higher)'],
        ],
      },
    },
    {
      heading: 'Does your contract change the divisor?',
      paragraphs: [
        'It can. The published figures are general rules; a negotiated account, a particular service or a different country page can set another divisor or measure in inches. The UPS page this guide relies on is UPS’s UK site, and the FedEx page is one of its international pages, so open the page for your own country and service before you quote a customer.',
        'Forwarders consolidating air cargo apply their own tariffs as well. Ask which divisor the quote uses, and whether the chargeable weight is worked out per piece or for the whole consignment.',
      ],
    },
    {
      heading: 'How can you lower the chargeable weight honestly?',
      paragraphs: [
        'By shipping less air, not by declaring smaller numbers. The volumetric weight depends only on the outer dimensions, so packaging choices are where the saving is.',
      ],
      list: [
        'Use the smallest carton that protects the goods, and cut down oversized boxes.',
        'Combine several small parcels into fewer, fuller cartons where the carrier rates the consignment as a whole.',
        'Check whether the goods are dense enough that actual weight already decides the price; then box size matters less.',
        'Compare air cargo with express for the same consignment, since the divisors differ.',
        'Always declare the real dimensions and gross weight: they also appear on your packing list and transport document.',
      ],
    },
    {
      heading: 'Where do the weights and dimensions go on your documents?',
      paragraphs: [
        'On the packing list first. The International Trade Administration says a packing list itemises the contents of each package, includes weights and measurements, and is used by freight forwarders to determine weights and freight costs. For air cargo, Article 5 of the Montreal Convention requires the air waybill to show the weight of the consignment.',
        'Use one set of figures everywhere. If the packing list, the booking and the air waybill disagree, the carrier bills on what it measures, and the documents no longer match each other at customs.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is volumetric weight the same as dimensional weight?',
      a: 'Yes. FedEx and UPS call it dimensional or DIM weight; IATA and DHL call it volumetric weight. The calculation is the same: volume divided by the carrier’s divisor.',
    },
    {
      q: 'Why is express freight’s divisor smaller than air cargo’s?',
      a: 'The divisor is each carrier’s commercial choice. A divisor of 5,000 counts more weight for the same box than 6,000, so bulky parcels are charged more under the express rule.',
    },
    {
      q: 'Is chargeable weight worked out per carton or per shipment?',
      a: 'That depends on the carrier and the service. Ask for the rule in your quote, because it can change the total when cartons differ in density.',
    },
    {
      q: 'Which weight goes on the packing list, actual or chargeable?',
      a: 'The actual net and gross weights and each package’s dimensions. Chargeable weight is the carrier’s billing figure, worked out from them.',
    },
  ],
  sources: [
    'iata-volumetric',
    'dhl-express-volumetric',
    'fedex-dimensional',
    'ups-dimensional',
    'maersk-fcl-lcl',
    'a4-montreal-convention',
    'trade-gov-packing-list',
  ],
  primaryTool: '/tools/chargeable-weight',
  callout: {
    afterSection: 2,
    tool: '/tools/chargeable-weight',
    title: 'Run your own cartons through the calculator',
    text: 'Enter each carton’s size and weight, and the chargeable weight calculator compares volumetric and actual weight for air, express and sea, using the divisors in this guide.',
  },
  tools: ['/tools/chargeable-weight', '/tools/cbm-calculator', '/tools/packing-list-generator'],
  related: [
    '/guides/air-waybill',
    '/blog/how-to-measure-a-box-for-shipping',
    '/guides/gross-weight-vs-net-weight',
    '/blog/standard-box-sizes-for-shipping',
    '/guides/lcl-vs-fcl',
  ],
  cover: {
    id: 'NixrmlDt-6E',
    src: 'https://images.unsplash.com/photo-1681726267019-ce6433fd7b49',
    width: 6000,
    height: 4000,
    alt: 'A worker in a factory surrounded by stacked cardboard cartons, whose size sets their volumetric weight',
    caption: 'A worker among cartons in a factory',
    photographer: { name: 'Kat von Wood', profile: 'https://unsplash.com/@kat_von_wood' },
    page: 'https://unsplash.com/photos/a-woman-working-in-a-factory-with-a-lot-of-boxes-NixrmlDt-6E',
  },
};

export default article;
