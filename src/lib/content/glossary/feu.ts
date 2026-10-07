import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-07';

const term: GlossaryTerm = {
  slug: 'feu',
  term: 'FEU (forty-foot equivalent unit)',
  abbreviation: 'FEU',
  aliases: ['forty-foot equivalent unit'],
  demand: {
    keyword: 'feu',
    market: 'US',
    volume: 2_900,
    kd: 14,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'FEU meaning: forty-foot equivalent unit',
  description:
    'What an FEU is, how it relates to the TEU, what a 40ft and a 40ft high-cube container hold, and where FEU shows up in freight quotes.',
  shortDefinition:
    'An FEU, or forty-foot equivalent unit, is a unit for counting containers based on one 40-foot container. One FEU equals two TEU. A freight rate quoted per FEU is a rate per 40ft box.',
  definition: [
    'The FEU is the 40-foot counterpart of the TEU. UNCTAD lists the two as the main units of measure in container transport, the first based on a 20-foot container and the second on a 40-foot one. Eurostat’s statistical equivalence counts a 40-foot ISO container as 2 TEU, so one FEU is two TEU.',
    'Like the TEU, the FEU is about length. A 40ft standard container and a 40ft high cube are both one FEU, though the high cube is taller and holds more. On Maersk’s published sheet a 40ft dry container holds about 67 m³ and a 40ft high cube about 76 m³, against about 33 m³ for a 20ft box, so a 40ft box gives about twice the volume of a 20ft but almost the same maximum payload: Maersk lists 28,800 kg for the 40ft and 28,200 kg for the 20ft.',
    'That difference is why heavy, dense cargo often goes in 20ft boxes and light, bulky cargo in 40ft ones: the dense load reaches the weight limit before the space runs out.',
  ],
  onYourDocuments: [
    'FEU is a freight and statistics term, so it does not appear on the commercial invoice or packing list. What appears is the container: its number, size and type, and the seal number, normally on the bill of lading or sea waybill and often on the packing list.',
    'When a forwarder quotes a rate per FEU, read it as per 40ft container, and check whether the high cube costs the same or carries a supplement on that route.',
  ],
  example: {
    caption: 'Worked example with invented parties, using Maersk’s typical figures',
    paragraphs: [
      'Lakeside Home (invented) has 70 m³ of flat-packed furniture weighing 9,000 kg. It does not fit a 40ft standard at about 67 m³, so the forwarder offers either one 40ft high cube (one FEU) or a 40ft plus a 20ft (three TEU).',
    ],
    table: {
      caption: 'Invented example: one FEU or three TEU for 70 m³',
      head: ['Option', 'Boxes', 'Typical volume (m³)', 'Counted as'],
      rows: [
        ['One 40ft high cube', '1', '76', '1 FEU (2 TEU)'],
        ['One 40ft and one 20ft', '2', '67 + 33 = 100', '3 TEU'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'TEU',
      difference: 'A TEU is based on a 20ft container. One FEU is two TEU.',
    },
    {
      term: '40ft high cube',
      difference:
        'A high cube is a taller 40ft box. It is still one FEU, because the unit counts length, not height.',
    },
  ],
  related: ['teu', 'cbm', '/guides/shipping-container-sizes', '/guides/lcl-vs-fcl'],
  tool: '/tools/container-loading-calculator',
  toolPitch:
    'The container loading calculator shows how many of your cartons or pallets fit a 40ft or a 40ft high cube, by volume and by weight.',
  faq: [
    {
      q: 'Is a 40ft high cube one FEU?',
      a: 'Yes. The FEU and TEU count containers by length, so a 40ft high cube is one FEU, or two TEU, even though it holds more than a 40ft standard box.',
    },
    {
      q: 'What is the difference between TEU and FEU?',
      a: 'A TEU is based on a 20ft container and an FEU on a 40ft container. One FEU equals two TEU. Port and ship capacities are stated in TEU, so a 40ft box adds two to the count.',
    },
  ],
  sources: ['unctad-containerised-transport', 'era-eurostat-teu', 'maersk-dry-containers'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
