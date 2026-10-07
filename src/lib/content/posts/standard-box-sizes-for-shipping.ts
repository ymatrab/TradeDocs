import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "standard box sizes for shipping" 1,300, KD 26.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A.
 * There is no single legal standard box size; the article says so and gives what is published:
 * the ISO 3394 modules (a1-iso-3394), the USPS Flat Rate Box dimensions (a1-usps-pmi-flat-rate,
 * no prices) and the FEFCO style code. Per-layer counts are our arithmetic; the box choice
 * example uses invented sizes.
 */
const article: ContentArticle = {
  slug: 'standard-box-sizes-for-shipping',
  title: 'Standard box sizes for shipping: what is actually standard',
  metaTitle: 'Standard box sizes for shipping, explained',
  description:
    'There is no single standard shipping box. Here are the sizes that are published: ISO 3394 modules that fit pallets, USPS Flat Rate Boxes, and how to pick a size.',
  lede: 'Search for a standard shipping box and you will find dozens of lists that disagree. That is because no law or carrier sets one size for everyone. What does exist is a set of published sizes for particular jobs, and a simple way to choose a box that keeps your freight bill down.',
  answer:
    'There is no single standard box size for shipping. What is standardised is narrower: ISO 3394 sets carton sizes from a 600 × 400 mm module that divides evenly into common pallets, carriers such as USPS publish their own box sizes, and FEFCO codes the box styles. Choose the smallest box that protects the goods and fits your pallet.',
  keyFacts: [
    'ISO 3394:2012 sets dimensions for rigid rectangular transport packages based on plan modules of 600 × 400 mm, 600 × 500 mm and 550 × 366 mm.',
    'Those modules relate to the ISO 3676 unit load sizes of 1,219 × 1,016 mm, 1,200 × 1,000 mm, 1,200 × 800 mm and 1,100 × 1,100 mm.',
    'USPS lists its Priority Mail International Large Flat Rate Box at 12 × 11¾ × 5½ inches inside and 12¼ × 12 × 6 inches outside, with a 20 lb limit.',
    'FEFCO describes its code as the internationally applied system that gives a number to each common corrugated box design.',
    'FedEx, UPS and DHL Express publish a divisor of 5,000 for dimensional weight in centimetres, so a larger box can cost more to ship than a heavier small one.',
  ],
  definitions: [
    {
      term: 'Module',
      meaning:
        'A base footprint, such as 600 × 400 mm, from which carton sizes are derived so they tile a pallet without gaps.',
    },
    {
      term: 'Unit load',
      meaning: 'Goods grouped on a pallet or similar base so they are handled as one unit.',
    },
    {
      term: 'FEFCO code',
      meaning:
        'A numbering system for corrugated box styles, used to tell a supplier which design you want.',
    },
    {
      term: 'Inside dimensions',
      meaning:
        'The usable space in a box; the outside dimensions, which carriers measure, are slightly larger.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Is there a standard box size for shipping?',
      paragraphs: [
        'No. No customs authority, postal service or courier requires a particular box size for international shipping. Carriers set maximum sizes and weights per package, and they charge by size as well as weight, but within those limits you can use any box that protects the goods. The USPS Domestic Mail Manual, for example, caps a mailpiece at 108 inches in length and girth combined; couriers and freight carriers publish their own maximums for each service.',
        'The lists of “standard sizes” you see online are usually a box supplier’s own stock range. They are useful for finding a box off the shelf, but they are not a standard. The sizes that are published by a standards body or a carrier are covered below.',
      ],
    },
    {
      heading: 'What box sizes does ISO standardise?',
      paragraphs: [
        'ISO 3394:2012 gives a series of dimensions for rigid rectangular transport packages. It starts from three plan modules, 600 × 400 mm, 600 × 500 mm and 550 × 366 mm, which relate to the unit load sizes in ISO 3676: 1,219 × 1,016, 1,200 × 1,000, 1,200 × 800 and 1,100 × 1,100 mm.',
        'The point of a module is that cartons built from it fill a pallet edge to edge. The table shows our arithmetic for one layer of module-sized footprints on matching pallets. The full series of carton sizes is in the standard itself, which ISO and national standards bodies sell.',
      ],
      table: {
        caption: 'Module footprints per pallet layer, our arithmetic from the ISO 3394 and ISO 3676 dimensions',
        head: ['Module (mm)', 'Pallet (mm)', 'Layout', 'Footprints per layer'],
        rows: [
          ['600 × 400', '1,200 × 800 (euro pallet size)', '2 along × 2 across', '4'],
          ['600 × 500', '1,200 × 1,000', '2 along × 2 across', '4'],
          ['550 × 366', '1,100 × 1,100', '2 along × 3 across', '6 (1,100 × 1,098 mm used)'],
          ['400 × 300 (half of 600 × 400)', '1,200 × 800 (euro pallet size)', '4 along × 2 across', '8'],
        ],
      },
    },
    {
      heading: 'What sizes are the USPS Flat Rate Boxes?',
      paragraphs: [
        'USPS publishes the dimensions of its Priority Mail International Flat Rate Boxes, both inside and outside, with a weight limit for each. They are carrier-supplied boxes for that service, not a general standard, but they are one of the few sets of box sizes a carrier publishes. Prices change, so check the current USPS price list rather than any figure quoted elsewhere.',
      ],
      table: {
        caption: 'USPS Priority Mail International Flat Rate Boxes, as listed by USPS',
        head: ['Box', 'Inside (in)', 'Outside (in)', 'Weight limit'],
        rows: [
          ['Small', '8⅝ × 5⅜ × 1⅝', '8 11/16 × 5 7/16 × 1¾', '4 lb'],
          ['Medium 1 (top-loading)', '11 × 8½ × 5½', '11¼ × 8¾ × 6', '20 lb'],
          ['Medium 2 (side-loading)', '13⅝ × 11⅞ × 3⅜', '14 × 12 × 3½', '20 lb'],
          ['Large', '12 × 11¾ × 5½', '12¼ × 12 × 6', '20 lb'],
          ['Large Board Game', '23 11/16 × 11¾ × 3', '24 1/16 × 11⅞ × 3⅛', '20 lb'],
        ],
      },
    },
    {
      heading: 'What do box style codes like FEFCO mean?',
      paragraphs: [
        'They describe the shape of the box, not its size. FEFCO, the European Federation of Corrugated Board Manufacturers, maintains a code that gives a number to each common corrugated box design, and the International Corrugated Case Association has adopted it. A supplier can make the same style in almost any size.',
        'When you order cartons, give the supplier three things: the style (by FEFCO code or a description), the inside dimensions as length × width × height, and the board grade or strength your load needs. Inside dimensions matter for the goods; the outside dimensions are what the carrier and the packing list will use.',
      ],
    },
    {
      heading: 'How do you choose the right box size?',
      paragraphs: [
        'Start from the goods and the pallet, not from a list of standard sizes. A box only slightly too large costs money twice: in filler and in the dimensional weight the carrier charges.',
      ],
      steps: [
        'Measure the product, or the inner pack, and add room for cushioning on every side.',
        'Pick the smallest box whose inside dimensions fit that size, so the goods do not move.',
        'If the cartons will be palletised, check that their footprint divides into your pallet, such as a 600 × 400 mm module on a 1,200 × 800 mm pallet.',
        'Check the outside dimensions and the packed weight against the carrier’s limits for the service.',
        'Work out the dimensional weight with the carrier’s divisor and compare it with the actual weight.',
        'Record the outside dimensions and gross weight of each carton on the packing list.',
      ],
    },
    {
      heading: 'How much does box size change the shipping cost?',
      paragraphs: [
        'It can change it more than weight does. Couriers compare the actual weight with a dimensional weight worked out from the box, and charge the higher figure. FedEx, UPS and DHL Express divide the volume in cubic centimetres by 5,000 to get kilograms, so every extra centimetre on each side adds up.',
        'In the invented example below, the same 3 kg product goes in two boxes. The snug box is charged on its actual weight; the roomy one on a dimensional weight more than twice as high.',
      ],
      table: {
        caption: 'Worked example with invented boxes for a 3 kg product, at the 5,000 divisor',
        head: ['Box (outside, cm)', 'Volume', 'Dimensional weight', 'Charged on'],
        rows: [
          ['30 × 25 × 20', '15,000 cm³', '3.0 kg', 'Either, 3.0 kg'],
          ['40 × 30 × 30', '36,000 cm³', '7.2 kg', 'Dimensional, 7.2 kg'],
        ],
      },
    },
  ],
  faq: [
    {
      q: 'What is the most common shipping box size?',
      a: 'No official body publishes one. Box suppliers stock their own ranges, and carriers publish their own boxes for particular services, such as the USPS Flat Rate Boxes.',
    },
    {
      q: 'What box size fits a euro pallet?',
      a: 'Cartons with a 600 × 400 mm footprint, the ISO 3394 module, fit four to a layer on a 1,200 × 800 mm pallet, and 400 × 300 mm cartons fit eight.',
    },
    {
      q: 'Are box dimensions inside or outside?',
      a: 'Either, depending on who quotes them. Box makers often give inside sizes for the goods; carriers measure the outside. USPS lists both for its Flat Rate Boxes.',
    },
    {
      q: 'Can USPS Flat Rate Boxes be used for international shipping?',
      a: 'Yes, with Priority Mail International. USPS lists a 4 lb limit for the Small Flat Rate Box and 20 lb for the Medium, Large and Large Board Game boxes.',
    },
    {
      q: 'Can I ship internationally in any box?',
      a: 'In general yes, within the carrier’s size and weight limits for the service and its packaging guidance. Some goods, such as dangerous goods, have their own packaging rules.',
    },
  ],
  sources: [
    'a1-iso-3394',
    'a1-usps-pmi-flat-rate',
    'a1-usps-dmm-101',
    'a1-fefco-code',
    'fedex-dimensional',
    'ups-dimensional',
    'dhl-express-volumetric',
    'w4-epal-euro-pallet',
    'trade-gov-packing-list',
  ],
  primaryTool: '/tools/cbm-calculator',
  tools: ['/tools/cbm-calculator', '/tools/chargeable-weight', '/tools/container-loading-calculator'],
  callout: {
    afterSection: 1,
    tool: '/tools/container-loading-calculator',
    title: 'See how many cartons fit a container',
    text: 'Enter your carton size, weight and quantity to estimate how many fit a 20ft, 40ft or high-cube container by volume and by weight.',
  },
  related: [
    '/guides/pallet-sizes',
    '/blog/how-many-pallets-fit-in-a-container',
    '/guides/shipping-container-sizes',
    '/blog/packing-list-for-shipping',
    '/blog/commercial-invoice-ups-fedex-dhl',
  ],
  cover: {
    id: 'gthSas4oYC0',
    src: 'https://images.unsplash.com/photo-1700165644892-3dd6b67b25bc',
    width: 6720,
    height: 4480,
    alt: 'Rows of open brown cardboard boxes in different sizes, waiting to be packed for shipping',
    caption: 'Open brown cardboard boxes',
    photographer: { name: 'Luke Heibert', profile: 'https://unsplash.com/@lukeheibert' },
    page: 'https://unsplash.com/photos/a-lot-of-brown-boxes-that-are-open-gthSas4oYC0',
  },
};

export default article;
