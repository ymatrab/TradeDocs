import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-07';

const term: GlossaryTerm = {
  slug: 'teu',
  term: 'TEU (twenty-foot equivalent unit)',
  abbreviation: 'TEU',
  aliases: ['twenty-foot equivalent unit'],
  demand: {
    keyword: 'teu',
    market: 'US',
    volume: 9_900,
    kd: 17,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'TEU meaning: twenty-foot equivalent unit',
  description:
    'What a TEU is, why a 40ft container counts as two, what a TEU holds, and how the term differs from the container you actually book.',
  shortDefinition:
    'A TEU, or twenty-foot equivalent unit, is the standard unit for counting containers: one 20-foot container is one TEU and one 40-foot container is two. Ports, shipping lines and statistics use it to state capacity and volumes.',
  definition: [
    'TEU is a counting unit, not a box. Eurostat’s glossary for transport statistics defines it as a statistical unit based on a 20-foot-long (6.10 m) ISO container, used to give a standard measure of containers of different sizes and to describe the capacity of container ships and terminals. On that basis a 20-foot container is 1 TEU, a 40-foot container is 2 TEU, a container between 20 and 40 feet is 1.5 TEU and one longer than 40 feet is 2.25 TEU.',
    'That is why a ship is described as a 15,000 TEU vessel, or a port as handling so many million TEU a year: the figure adds boxes of different lengths into one number. UNCTAD lists the TEU and its 40-foot counterpart, the FEU, as the main units of measure in container transport.',
    'For a single shipment the unit matters less than the box. You book a 20ft, a 40ft or a 40ft high cube, and the carrier prices that equipment. The container’s outside dimensions follow ISO 668; its inside volume and payload vary by carrier and series.',
  ],
  onYourDocuments: [
    'TEU does not appear on a commercial invoice or packing list. What your documents carry is the container itself: its number, its size and type code, and the seal number, usually on the bill of lading or sea waybill and often repeated on the packing list so the receiver can match boxes to cartons.',
    'You will meet TEU in freight quotations, in a forwarder’s capacity or rate sheets, and in port statistics. When a quote is stated per TEU, a 40ft box costs two of them unless the quote says otherwise.',
  ],
  example: {
    caption: 'Worked example with invented parties and the TEU equivalences above',
    paragraphs: [
      'Harbourline Exports (invented) ships three 20ft containers and two 40ft high cubes in one month. Its forwarder reports the volume in TEU.',
    ],
    table: {
      caption: 'Invented example: counting a month’s boxes in TEU',
      head: ['Container', 'Boxes', 'TEU each', 'TEU'],
      rows: [
        ['20ft standard', '3', '1', '3'],
        ['40ft high cube', '2', '2', '4'],
        ['Total', '5', '', '7'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'FEU',
      difference:
        'An FEU is the forty-foot equivalent unit, a 40ft box. One FEU is two TEU in the Eurostat equivalence.',
    },
    {
      term: 'CBM',
      difference:
        'CBM is the volume of your cargo in cubic metres; TEU counts containers regardless of how full they are.',
    },
  ],
  related: ['feu', 'cbm', '/guides/shipping-container-sizes', '/guides/lcl-vs-fcl'],
  tool: '/tools/container-loading-calculator',
  toolPitch:
    'The container loading calculator estimates how many of your cartons or pallets fit a 20ft, 40ft or high-cube box.',
  faq: [
    {
      q: 'How many TEU is a 40ft container?',
      a: 'Two. Eurostat counts a 40-foot ISO container as 2 TEU, and the same applies to a 40ft high cube, since the unit is based on length. Containers longer than 40 feet count as 2.25 TEU.',
    },
    {
      q: 'How much cargo fits in one TEU?',
      a: 'A TEU is a counting unit, so it has no fixed capacity. A typical 20ft dry container on Maersk’s published sheet holds about 33 m³ with a maximum payload of 28,200 kg; other carriers’ boxes differ slightly.',
    },
  ],
  sources: ['era-eurostat-teu', 'unctad-containerised-transport', 'w4-iso-668', 'maersk-dry-containers'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
