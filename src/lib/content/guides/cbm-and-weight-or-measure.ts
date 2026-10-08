import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "cbm to kg" 390, KD 2 (v3 also lists
 * "kg to cbm" 390). Angle (v2 #22): CBM does not convert to kg; how W/M sea pricing works. The
 * 1 t/m³ sea LCL ratio and the 333 kg/m³ road ratio have no primary source and are labelled
 * conventions (CONTENT.md, VOLUMETRIC_RULES in src/lib/trade/calculations.ts).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (carried from v2 #22).
 */
const article: ContentArticle = {
  slug: 'cbm-and-weight-or-measure',
  title: 'CBM to kg: why volume does not convert, and how W/M pricing works',
  metaTitle: 'CBM to kg: volume, weight and W/M pricing',
  description:
    'Why a cubic metre has no fixed weight in kilograms, how carriers turn volume into a chargeable figure, and how weight or measure (W/M) works for sea LCL.',
  lede: 'Search for a CBM to kg converter and you will find calculators that turn 1 CBM into 1,000 kg, 333 kg or 167 kg. None of them converts anything. They apply a carrier’s pricing ratio, and which ratio applies depends on how the goods travel.',
  answer:
    'CBM does not convert to kg: a cubic metre measures volume and a kilogram measures mass, so the weight of 1 CBM depends on what is in it. Carriers instead use a ratio to compare the two. Air uses IATA’s 6,000 cm³ per kg, about 167 kg per CBM; sea LCL commonly treats 1 CBM as 1 tonne.',
  keyFacts: [
    'A cubic metre (CBM, m³) is a unit of volume and a kilogram is a unit of mass, so one cannot be converted into the other without the density of the goods.',
    'IATA’s general rule for air cargo divides volume in cubic centimetres by 6,000 to get volumetric weight, so 1 m³ counts as about 166.7 kg.',
    'DHL Express divides by 5,000 for volumetric weight, so 1 m³ counts as 200 kg.',
    'Sea LCL is commonly quoted on weight or measure, treating 1 m³ as 1 tonne; this ratio is a common industry convention, not a published standard.',
    'NIST gives one cubic foot as 0.028 316 85 m³ and one pound as 0.453 592 4 kg.',
  ],
  definitions: [
    {
      term: 'CBM',
      meaning: 'Cubic metre: length × width × height in metres, the volume a shipment takes up.',
    },
    {
      term: 'Density',
      meaning:
        'Mass per unit of volume, in kilograms per cubic metre; the only figure that links CBM and kg for real goods.',
    },
    {
      term: 'W/M (weight or measure)',
      meaning:
        'A sea freight basis that compares tonnes with cubic metres and charges on whichever is greater.',
    },
    {
      term: 'Revenue tonne',
      meaning: 'The unit an LCL charge is multiplied by: the greater of the tonnes and the CBM.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Can you convert CBM to kg?',
      paragraphs: [
        'No. A cubic metre is a volume and a kilogram is a mass, and the link between them is the density of whatever fills the space. A cubic metre of foam cushions and a cubic metre of floor tiles take the same space and weigh very different amounts.',
        'To know what your cubic metre weighs, weigh it. The gross weight on your packing list comes from the scale, and the CBM comes from the tape measure. Both go on the documents, and the carrier uses both to price the shipment.',
      ],
    },
    {
      heading: 'Why do CBM to kg calculators give different answers?',
      paragraphs: [
        'Because they apply a carrier’s pricing ratio, not a conversion, and each mode uses a different one. The ratio says how many kilograms a cubic metre is treated as when the carrier compares space with weight. The table lists the ratios TradeDocs’ calculators use.',
      ],
      table: {
        caption: 'Volume-to-weight ratios by mode',
        head: ['Mode', 'Ratio', '1 CBM counts as', 'Status'],
        rows: [
          ['Air cargo', '6,000 cm³ per kg', '166.7 kg', 'IATA general rule'],
          ['Express (DHL Express)', '5,000 cm³ per kg', '200 kg', 'Carrier’s published divisor'],
          ['Road groupage, Europe', '333 kg per m³', '333 kg', 'Common convention; check the tariff'],
          ['Sea LCL', '1 tonne per m³', '1,000 kg', 'Common convention; check the tariff'],
        ],
      },
    },
    {
      heading: 'How does weight or measure (W/M) work?',
      paragraphs: [
        'The forwarder works out two figures and charges on the larger. One is your gross weight in tonnes; the other is your volume in cubic metres. Whichever is greater becomes the number of revenue tonnes, which is multiplied by the rate per W/M unit. Maersk describes LCL as paying for the container space your cargo uses, measured in cubic metres; W/M adds weight so that dense cargo pays its share.',
        'Treating one tonne as one cubic metre is a common industry convention rather than a standard any authority publishes. Tariffs differ and minimum charges apply, so check your forwarder’s tariff before relying on the figure.',
      ],
    },
    {
      heading: 'How do you work out the chargeable figure?',
      paragraphs: [
        'Measure, weigh, then compare. The worked example uses invented figures: 24 cartons, each 60 × 40 × 50 cm and 18 kg.',
      ],
      steps: [
        'Work out one carton’s volume in metres: 0.60 × 0.40 × 0.50 = 0.12 m³.',
        'Multiply by the number of cartons: 0.12 × 24 = 2.88 m³.',
        'Total the gross weight: 18 × 24 = 432 kg, or 0.432 tonnes.',
        'For sea LCL, compare 2.88 m³ with 0.432 t: volume is greater, so the shipment pays on 2.88 revenue tonnes.',
        'For air, convert the volume at the IATA ratio: 2,880,000 cm³ ÷ 6,000 = 480 kg, which is more than 432 kg, so the chargeable weight is 480 kg.',
      ],
    },
    {
      heading: 'When does weight decide the price instead of volume?',
      paragraphs: [
        'When the goods are denser than the ratio. At the sea LCL convention, anything heavier than 1,000 kg per cubic metre pays on weight. At the IATA air ratio, anything heavier than about 167 kg per cubic metre pays on actual weight. Divide your gross weight by your CBM to find your shipment’s density and compare it with the ratio for the mode you are quoting.',
        'Density is also why a container can fill up by weight before it fills by volume. Maersk publishes a maximum payload for each container type as well as its internal volume; heavy goods reach the payload with space still empty.',
      ],
    },
    {
      heading: 'How do you convert cubic feet and pounds?',
      paragraphs: [
        'With exact factors, because these are real conversions within one quantity. NIST gives one cubic foot as 0.028 316 85 m³, so 100 ft³ is about 2.83 m³, and one pound as 0.453 592 4 kg, so 1,000 lb is about 453.6 kg. Convert first, then apply the carrier’s ratio.',
      ],
    },
  ],
  faq: [
    {
      q: 'How many kg is 1 CBM?',
      a: 'It depends on the goods. Weigh them to know. For pricing, carriers treat 1 CBM as a set number of kilograms: about 167 kg for air under IATA’s rule, and commonly 1,000 kg for sea LCL.',
    },
    {
      q: 'How do I convert kg to CBM?',
      a: 'You cannot without the goods’ density or dimensions. Measure the packages, multiply length × width × height in metres for each, and add them up.',
    },
    {
      q: 'Is W/M used for full container loads?',
      a: 'No. A full container load is usually priced per container, up to the container’s maximum payload. W/M applies to part loads that share a container.',
    },
    {
      q: 'Does the CBM go on the packing list?',
      a: 'It is often shown with each package’s dimensions and in the totals, because forwarders use the packing list to work out weights and freight costs. Check what your forwarder and buyer ask for.',
    },
  ],
  sources: [
    'iata-volumetric',
    'dhl-express-volumetric',
    'maersk-fcl-lcl',
    'maersk-dry-containers',
    'nist-si-volume',
    'nist-si-mass',
    'a2-trade-gov-packing-list',
  ],
  primaryTool: '/tools/cbm-calculator',
  tools: ['/tools/cbm-calculator', '/tools/chargeable-weight', '/tools/cbm-to-cubic-feet'],
  callout: {
    afterSection: 2,
    tool: '/tools/chargeable-weight',
    title: 'Compare volume and weight in one step',
    text: 'Enter carton dimensions, count and weight in the chargeable weight calculator and choose air, express, road or sea LCL to see which figure you will be billed on.',
  },
  related: [
    '/guides/chargeable-weight',
    '/guides/lcl-vs-fcl',
    '/blog/how-many-cbm-fit-in-a-container',
    '/blog/how-to-calculate-shipping-cost',
    '/blog/how-to-measure-a-box-for-shipping',
  ],
  cover: {
    id: '98MbUldcDJY',
    src: 'https://images.unsplash.com/photo-1612012060851-20f943c02d3d',
    width: 3200,
    height: 2133,
    alt: 'A traditional weighing scale, a reminder that weight comes from the scale and volume from the tape',
    caption: 'A weighing scale on a table',
    photographer: { name: 'Piret Ilver', profile: 'https://unsplash.com/@saltsup' },
    page: 'https://unsplash.com/photos/brown-and-beige-weighing-scale-98MbUldcDJY',
  },
};

export default article;
