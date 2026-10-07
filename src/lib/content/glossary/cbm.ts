import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-07';

const term: GlossaryTerm = {
  slug: 'cbm',
  term: 'CBM (cubic metre)',
  abbreviation: 'CBM',
  aliases: ['cubic metre', 'cubic meter', 'm³'],
  demand: {
    keyword: 'cbm meaning',
    market: 'US',
    volume: 1_900,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'CBM meaning in shipping: cubic metres explained',
  description:
    'What CBM means in shipping, how to work it out from carton sizes, how it converts to cubic feet, and why LCL freight is charged on it.',
  shortDefinition:
    'CBM stands for cubic metre (m³), the volume of a box one metre long, wide and high. In shipping it measures how much space cargo takes, and less-than-container-load (LCL) sea freight is usually charged on it. One CBM is about 35.31 cubic feet.',
  definition: [
    'CBM is simply volume in cubic metres. For a carton you multiply length by width by height in metres: a carton of 60 × 40 × 40 cm is 0.6 × 0.4 × 0.4 = 0.096 CBM. A shipment’s CBM is that figure for each carton times the number of cartons, added up across every size.',
    'Forwarders use it because space is what they sell. Maersk explains that an LCL shipment shares a container with other shippers’ cargo and is charged on the cubic metres it uses, while an FCL booking pays for the whole box. Forwarders’ tariffs also set how weight is compared with volume for dense cargo, so ask how yours does it before you quote.',
    'In cubic feet, the U.S. unit, one foot is exactly 0.3048 m, so a cubic foot is 0.028 316 846 592 m³, the factor NIST lists as 2.831 685 E-02. One CBM is therefore about 35.3147 cubic feet. Containers are described in CBM too: a typical 20ft dry box holds about 33 m³ on Maersk’s sheet, a 40ft about 67 m³ and a 40ft high cube about 76 m³.',
  ],
  onYourDocuments: [
    'The packing list is where CBM belongs: the dimensions of each package and the total volume, next to the gross weight. Forwarders quote and book from those two figures, so a missing or wrong total volume means a re-quote.',
    'The commercial invoice normally does not need CBM, though some buyers ask for the total volume on it. If it appears on both, it must be the same figure.',
  ],
  example: {
    caption: 'Worked example with invented parties and figures',
    paragraphs: [
      'Greenway Kitchenware (invented) ships two carton sizes by LCL. The forwarder asks for the total CBM.',
    ],
    table: {
      caption: 'Invented example: total CBM of a mixed consignment',
      head: ['Carton', 'Size (cm)', 'Cartons', 'CBM each', 'CBM total'],
      rows: [
        ['A', '60 × 40 × 40', '50', '0.096', '4.800'],
        ['B', '50 × 30 × 30', '40', '0.045', '1.800'],
        ['Total', '', '90', '', '6.600'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'Cubic feet (ft³, CFT)',
      difference: 'The imperial volume unit. One CBM is about 35.3147 cubic feet.',
    },
    {
      term: 'Chargeable weight',
      difference:
        'Air and express carriers turn volume into a weight with a divisor and bill the greater of that and the actual weight; CBM itself is the volume.',
    },
  ],
  related: ['teu', 'feu', '/guides/lcl-vs-fcl', '/guides/shipping-container-sizes'],
  tool: '/tools/cbm-calculator',
  toolPitch:
    'The CBM calculator works out cubic metres and cubic feet from your carton sizes and compares the total with each container.',
  faq: [
    {
      q: 'How do I calculate CBM?',
      a: 'Multiply length × width × height of a carton in metres, then multiply by the number of cartons. A 60 × 40 × 40 cm carton is 0.096 CBM, so 50 of them are 4.8 CBM.',
    },
    {
      q: 'How many cubic feet are in one CBM?',
      a: 'About 35.3147. A cubic foot is exactly 0.028 316 846 592 m³, because a foot is defined as 0.3048 m.',
    },
  ],
  sources: ['nist-si-volume', 'maersk-fcl-lcl', 'maersk-dry-containers'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
