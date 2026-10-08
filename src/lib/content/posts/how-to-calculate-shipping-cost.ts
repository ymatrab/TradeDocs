import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "how to calculate shipping cost" 1,900, KD 49.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 * No rates of our own: the article teaches the inputs (actual weight, dimensional weight, CBM)
 * and the structure of a quote, with divisors from IATA and each carrier's own page. The worked
 * example uses invented cartons and leaves the rate as a placeholder the reader fills in.
 */
const article: ContentArticle = {
  slug: 'how-to-calculate-shipping-cost',
  title: 'How to calculate shipping cost for an international shipment',
  metaTitle: 'How to calculate shipping cost: weight and CBM',
  description:
    'Work out the weight or volume a carrier will bill, apply the rate from your quote and add the surcharges. Divisors from IATA and the carriers, with a worked example.',
  lede: 'No calculator can tell you what a carrier will charge, because the rate comes from the carrier or forwarder you book with. What you can calculate exactly is the quantity the rate is applied to, and that is where most surprises on a freight invoice start.',
  answer:
    'Shipping cost is the billable quantity times the carrier’s rate, plus surcharges. For air and express, the billable quantity is the higher of actual and dimensional weight; for sea LCL, it is usually cubic metres or tonnes, whichever is greater; for a full container, it is the box. Measure, weigh, then apply your quote.',
  keyFacts: [
    'IATA says air carriers charge on volumetric or actual weight, whichever is higher, and that the general rule divides the volume in cubic centimetres by 6,000.',
    'FedEx and UPS publish a divisor of 5,000 for dimensional weight in centimetres and kilograms; DHL Express says it also divides by 5,000.',
    'IATA notes that air cargo tariffs exclude services such as customs clearance, pick-up and delivery, and that fuel and security surcharges come on top.',
    'Maersk describes LCL sea freight as charged on the cubic metres your cargo uses, while FCL pays for the whole container.',
    'Under 19 CFR 152.102, the US customs value excludes international freight and insurance; HMRC includes them up to the UK border in the customs value.',
  ],
  definitions: [
    {
      term: 'Dimensional (volumetric) weight',
      meaning:
        'A weight worked out from a package’s size, so that light, bulky cargo pays for the space it takes.',
    },
    {
      term: 'Chargeable weight',
      meaning:
        'The weight the carrier bills: the higher of the actual weight and the dimensional weight.',
    },
    {
      term: 'CBM',
      meaning:
        'Cubic metres, the volume of a shipment: length × width × height in metres, added up for every package.',
    },
    {
      term: 'Surcharge',
      meaning:
        'A charge added to the base freight rate, such as a fuel, security or remote-area charge, set by the carrier.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'How is shipping cost calculated?',
      paragraphs: [
        'By multiplying a billable quantity by a rate, then adding surcharges and service charges. The rate is not something you can calculate: IATA explains that air cargo tariffs are set by each carrier or at industry level, and that the rate a forwarder actually pays an airline can differ from the published tariff. Sea, road and courier pricing work the same way. The rate comes from your quote.',
        'The quantity is what you can control. It depends on how much the shipment weighs and how much space it takes, and each mode turns those two numbers into a billable quantity in its own way. Get the weight and dimensions right and you can check every quote line by line.',
      ],
      table: {
        caption: 'What each mode usually bills on',
        head: ['Mode', 'Billable quantity', 'Where the rule comes from'],
        rows: [
          [
            'Air freight',
            'Higher of actual and volumetric weight (cm³ ÷ 6,000)',
            'IATA general rule; the airline or forwarder’s tariff',
          ],
          [
            'Express courier',
            'Higher of actual and dimensional weight (cm³ ÷ 5,000 at FedEx, UPS and DHL Express)',
            'Each carrier’s published rules',
          ],
          [
            'Sea freight, LCL',
            'Cubic metres used, often compared with weight in tonnes',
            'The forwarder’s tariff',
          ],
          ['Sea freight, FCL', 'The container, up to its payload', 'The carrier’s container rate'],
          ['Road groupage', 'Weight, volume or pallet spaces', 'The haulier’s tariff'],
        ],
      },
    },
    {
      heading: 'What do you need before you calculate?',
      paragraphs: [
        'The packed figures for every package, taken from the goods as they will ship rather than from a product sheet. These are the same figures that go on your packing list, so measure once and use them for both.',
      ],
      list: [
        'The length, width and height of each package, at its widest points, including any bulge, handle or pallet.',
        'The gross weight of each package: goods, packaging, pallet and wrap.',
        'The number of packages, and which are identical.',
        'The origin and destination, the mode and the service level you want quoted.',
        'The Incoterms® rule of the sale, which decides which legs of the journey you pay for.',
      ],
    },
    {
      heading: 'How do you calculate dimensional weight?',
      paragraphs: [
        'Multiply length × width × height in centimetres and divide by the carrier’s divisor. IATA gives 6,000 cubic centimetres to the kilogram as the general rule for air cargo. FedEx and UPS publish 5,000 for their express services measured in centimetres and kilograms, and DHL Express says it divides by 5,000 as well. Divisors are each carrier’s own and can change, so check the current figure for the service you book.',
        'Then compare. The higher of the actual weight and the dimensional weight is the chargeable weight. A heavy, compact box bills on its actual weight; a light, bulky one bills on its size.',
      ],
      steps: [
        'Measure each package in centimetres and multiply the three sides.',
        'Divide by the carrier’s divisor to get the dimensional weight in kilograms.',
        'Weigh the package to get its actual weight.',
        'Take the higher of the two for each package, or for the whole shipment if the carrier rates it that way.',
        'Round the result the way the carrier’s rules say, since each carrier sets its own rounding step.',
      ],
    },
    {
      heading: 'How is sea freight cost calculated?',
      paragraphs: [
        'By volume for a shared container and by the box for a full one. Maersk describes LCL as paying for the container space your cargo uses, measured in cubic metres, while FCL means booking the whole container. Many forwarders quote LCL on weight or measure: they compare your cubic metres with your weight in tonnes and charge on the greater. The ratio is set in the forwarder’s tariff, so read it on the quote.',
        'To get cubic metres, multiply length × width × height in metres for one package and multiply by the number of packages. A carton of 60 × 40 × 40 cm is 0.096 m³, so 50 of them are 4.8 m³. For a full container, the question is whether the goods fit within the container’s volume and its maximum payload, which the container loading calculator checks.',
      ],
    },
    {
      heading: 'What does a worked example look like?',
      paragraphs: [
        'Here is one invented air shipment of 10 identical cartons, using the IATA general divisor of 6,000. The rate is left as a placeholder: put in the per-kilogram rate from your own quote.',
      ],
      table: {
        caption: 'Worked example with invented cartons and a placeholder rate',
        head: ['Step', 'Figure'],
        rows: [
          ['Carton size (invented)', '60 × 50 × 40 cm'],
          ['Volume of one carton', '120,000 cm³'],
          ['Dimensional weight of one carton (÷ 6,000)', '20 kg'],
          ['Actual weight of one carton (invented)', '12 kg'],
          ['Chargeable weight of one carton', '20 kg, the higher figure'],
          ['Chargeable weight of 10 cartons', '200 kg'],
          ['Freight', '200 kg × your quoted rate per kg'],
          ['Then add', 'The surcharges and service charges listed on the quote'],
        ],
      },
    },
    {
      heading: 'Which charges come on top of the freight rate?',
      paragraphs: [
        'Surcharges and services, which are not in the base rate. IATA notes that air cargo tariffs do not include services such as transshipment, customs clearance, pick-up and delivery, and lists fuel surcharges, security surcharges, dangerous goods fees and handling fees among the accessorial charges added to the standard cost. Sea and courier quotes carry their own equivalents.',
        'Ask for an itemised quote and compare like with like: the same chargeable weight or volume, the same pick-up and delivery points and the same services. A low base rate with long surcharge lines can cost more than a higher all-in rate.',
      ],
    },
    {
      heading: 'Does shipping cost affect duties and the invoice?',
      paragraphs: [
        'Yes, in some countries, so state it clearly on the commercial invoice. Under 19 CFR 152.102, the US transaction value excludes international freight and insurance to the place of importation, so the invoice should show them separately. HMRC, by contrast, includes transport and insurance costs up to the point the goods enter the UK in the customs value. The landed cost calculator adds freight, insurance, duty and taxes at the rates you enter.',
        'Who pays which leg is set by the ICC’s Incoterms® 2020 rules. Under FCA or FOB the buyer usually books the main carriage, and under CIF, CPT, DAP or DDP the seller does, so make sure the rule on the invoice matches the freight you are quoting.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is there a formula for shipping cost?',
      a: 'Billable quantity × rate + surcharges. The billable quantity you can calculate from weight and size; the rate and surcharges come from the carrier’s quote.',
    },
    {
      q: 'Why was I billed more than the weight of my box?',
      a: 'The carrier probably billed dimensional weight, because the box was large for its weight. Measure it, divide by the carrier’s divisor and compare with the actual weight.',
    },
    {
      q: 'What divisor should I use for air freight?',
      a: 'The one in your carrier’s or forwarder’s tariff. IATA gives 6,000 cm³ per kg as the general air cargo rule; FedEx, UPS and DHL Express publish 5,000 for their express services.',
    },
    {
      q: 'How do I reduce my shipping cost?',
      a: 'Pack tighter. Smaller cartons, less void fill and well-planned pallets lower the dimensional weight and the cubic metres you pay for. Then compare itemised quotes.',
    },
    {
      q: 'Do I include the pallet in the shipping weight?',
      a: 'Yes. The pallet is part of the gross weight, and its height is part of the dimensions the carrier measures.',
    },
  ],
  sources: [
    'b1-iata-air-cargo-tariffs',
    'iata-volumetric',
    'fedex-dimensional',
    'ups-dimensional',
    'dhl-express-volumetric',
    'maersk-fcl-lcl',
    'maersk-dry-containers',
    'w3-cbp-19-cfr-152-102',
    'w3-hmrc-delivery-costs',
    'icc-incoterms-2020',
    'a2-trade-gov-packing-list',
  ],
  primaryTool: '/tools/chargeable-weight',
  tools: [
    '/tools/chargeable-weight',
    '/tools/cbm-calculator',
    '/tools/container-loading-calculator',
    '/tools/landed-cost-calculator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/chargeable-weight',
    title: 'Find the weight you will be billed on',
    text: 'Enter your package dimensions and weight to compare dimensional and actual weight for air, express, road groupage and sea LCL.',
  },
  related: [
    '/blog/how-to-measure-a-box-for-shipping',
    '/guides/lcl-vs-fcl',
    '/guides/landed-cost',
    '/blog/how-many-pallets-fit-in-a-container',
    '/blog/how-to-calculate-import-duty',
    '/blog/standard-box-sizes-for-shipping',
  ],
  cover: {
    id: '66NaCdBrkCs',
    src: 'https://images.unsplash.com/photo-1600725935160-f67ee4f6084a',
    width: 5863,
    height: 3909,
    alt: 'Brown cardboard shipping boxes on a wooden table, ready to be measured and weighed',
    caption: 'Cardboard boxes on a wooden table',
    photographer: { name: 'Michal Balog', profile: 'https://unsplash.com/@mikbutcher' },
    page: 'https://unsplash.com/photos/brown-cardboard-boxes-on-brown-wooden-table-66NaCdBrkCs',
  },
};

export default article;
