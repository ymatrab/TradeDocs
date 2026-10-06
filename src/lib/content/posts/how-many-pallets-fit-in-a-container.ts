import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "how many pallets fit in a 40ft container" 390;
 * "how many pallets fit in a 20ft container" 50.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 * Floor counts are arithmetic on Maersk's published inside dimensions (maersk-dry-containers)
 * and the EPAL pallet sizes; they are labelled "before stacking limits, weight limits and dunnage".
 */
const article: ContentArticle = {
  slug: 'how-many-pallets-fit-in-a-container',
  title: 'How many pallets fit in a 20ft or 40ft container?',
  metaTitle: 'How many pallets fit in a 20ft or 40ft container',
  description:
    'Floor-fit arithmetic for euro, 1,200 × 1,000 mm and 48 × 40 inch pallets in 20ft, 40ft and high cube containers, from published inside dimensions, and why real loads differ.',
  lede: 'The numbers you see quoted for pallets per container come from simple geometry: the container floor divided by the pallet footprint. Doing the sum yourself shows you where those numbers come from, and where your own load will fall short of them.',
  answer:
    'On a single tier, the floor arithmetic gives 11 euro pallets (1,200 × 800 mm) in a 20ft container and 25 in a 40ft, or 9 and 22 pallets of 1,200 × 1,000 mm, using Maersk’s published inside dimensions. These are counts before stacking limits, weight limits and dunnage; real loads can be lower.',
  keyFacts: [
    'Maersk lists the inside of its 20ft dry container as 5,896 mm long and 2,350 mm wide.',
    'Maersk lists the inside of its 40ft dry and 40ft high cube containers as 12,032 mm long and 2,350 mm wide.',
    'EPAL specifies its Euro pallet at 1,200 × 800 mm and its EPAL 2 pallet at 1,200 × 1,000 mm.',
    'The 40ft high cube has the same floor as the 40ft standard; Maersk lists 2,697 mm of inside height against 2,393 mm.',
    'Maersk lists maximum payloads of 28,200 kg for its 20ft and 28,800 kg for its 40ft standard dry containers.',
  ],
  definitions: [
    {
      term: 'Floor fit',
      meaning:
        'How many pallet footprints fit on the container floor in one layer, by length and width alone.',
    },
    {
      term: 'Lengthwise and crosswise',
      meaning:
        'A pallet loaded with its long side along the container, or turned so its long side runs across it.',
    },
    {
      term: 'Dunnage',
      meaning:
        'Bracing, airbags or timber used to stop the load moving, which takes up floor space.',
    },
    {
      term: 'Payload',
      meaning: 'The maximum weight of cargo a container may carry, as stated by its operator.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'How many pallets fit in a 20ft and a 40ft container?',
      paragraphs: [
        'The table gives single-tier floor counts calculated from Maersk’s published inside dimensions for its dry containers and the pallet sizes EPAL publishes for its Euro and EPAL 2 pallets, with the 48 × 40 inch size converted at 25.4 mm to the inch. Every count is before stacking limits, weight limits and dunnage.',
        'Other carriers’ containers differ by a few millimetres, and on a tight fit a few millimetres decide whether the last pallet goes in. Treat these as the ceiling for one layer, then check your carrier’s figures.',
      ],
      table: {
        caption:
          'Single-tier floor fit from Maersk inside dimensions, before stacking limits, weight limits and dunnage',
        head: [
          'Pallet footprint',
          '20ft (5,896 × 2,350 mm)',
          '40ft and 40ft high cube (12,032 × 2,350 mm)',
        ],
        rows: [
          ['Euro pallet, 1,200 × 800 mm', '11', '25'],
          ['1,200 × 1,000 mm (EPAL 2 size)', '9', '22'],
          ['48 × 40 in (1,219 × 1,016 mm)', '9', '20'],
        ],
      },
    },
    {
      heading: 'How is the pallet count worked out?',
      paragraphs: [
        'By trying each way of laying the pallets along the floor and keeping the best. The container is long and narrow, so the question is how many rows fit across the 2,350 mm width, and how many pallets fit in each row along the length.',
      ],
      steps: [
        'Take the inside length and width of the container from the carrier’s specification.',
        'Divide the length by the pallet’s long side and by its short side, rounding down each time.',
        'Check which pallet widths fit across the container side by side: two short sides, one long side, or one of each.',
        'For a mixed layout, add a row of crosswise pallets to a row of lengthwise pallets, if their two widths together fit the container width.',
        'Keep the layout with the highest count, then repeat for a second tier only if height, weight and the goods allow it.',
      ],
    },
    {
      heading: 'Why does the euro pallet give 11 and 25?',
      paragraphs: [
        'Because one long side and one short side fit across the container together. A row of euro pallets turned crosswise uses 1,200 mm of the width, and a row placed lengthwise uses 800 mm, for 2,000 mm out of 2,350 mm.',
        'In the 20ft, the crosswise row holds 7 pallets (5,600 mm of the 5,896 mm length) and the lengthwise row holds 4 (4,800 mm), for 11. In the 40ft, the crosswise row holds 15 (12,000 mm of 12,032 mm) and the lengthwise row 10 (12,000 mm), for 25. That second row leaves only 32 mm spare, which is why a real 40ft load of euro pallets may come out lower.',
        'The 1,200 × 1,000 mm pallet works the same way with a 2,200 mm combined width: 5 + 4 = 9 in the 20ft and 12 + 10 = 22 in the 40ft. The 48 × 40 inch pallet needs 2,235 mm for the same mixed layout and gives 5 + 4 = 9 and 11 + 9 = 20.',
      ],
    },
    {
      heading: 'Does a 40ft high cube hold more pallets?',
      paragraphs: [
        'Not on the floor. Maersk’s specifications give the 40ft high cube the same inside length and width as the 40ft standard, 12,032 × 2,350 mm, so the single-tier count is identical. What the high cube adds is height: 2,697 mm inside against 2,393 mm.',
        'That extra height only helps if the goods can be stacked two high. Check the load against the door opening as well as the inside height: Maersk lists door openings of 2,274 mm high on the 40ft standard and 2,577 mm on the high cube, and anything loaded already stacked has to pass through the door.',
      ],
    },
    {
      heading: 'Why do real loads hold fewer pallets than the arithmetic?',
      paragraphs: [
        'Because pallets, goods and containers are not perfect rectangles. The floor count assumes the pallets touch each other and the walls exactly, with nothing overhanging.',
      ],
      list: [
        'Cartons can overhang the pallet edge, so the real footprint is larger than the pallet.',
        'A forklift needs room to place the last pallets, and the doors and their seals take a little of the length.',
        'Bracing, airbags and timber (dunnage) take floor space to stop the load shifting.',
        'Weight runs out before space with dense goods, and the weight must be spread along the floor.',
        'Pallets that are damaged, of mixed sizes or not stackable break the pattern.',
        'Containers from other carriers or of other builds differ slightly from the figures used here.',
      ],
    },
    {
      heading: 'How do you check weight and stacking limits?',
      paragraphs: [
        'Multiply the pallet count by the heaviest pallet weight and compare it with the container’s payload. Maersk lists maximum payloads of 28,200 kg for its 20ft dry container and 28,800 kg for its 40ft; 25 euro pallets at an invented 1,000 kg each would weigh 25,000 kg, within the 40ft figure, but two tiers of them would not be.',
        'Then check the pallet itself. EPAL gives its Euro pallet a safe working load of 1,500 kg and its EPAL 2 pallet 1,250 kg, and states that when laden Euro pallets are stacked on a solid, even surface, the bottom pallet must not carry more than 5,500 kg. Your goods and packaging may set a lower limit than the pallet does.',
        'Once the plan works on paper, record it on the packing list: number of pallets, dimensions and gross weight per pallet, and totals. The forwarder and the carrier work from those figures when they plan the container.',
      ],
    },
  ],
  faq: [
    {
      q: 'How many euro pallets fit in a 40ft container?',
      a: 'On one tier, the floor arithmetic from Maersk’s inside dimensions gives 25 euro pallets, 22 pallets of 1,200 × 1,000 mm or 20 pallets of 48 × 40 inches, before stacking limits, weight limits and dunnage.',
    },
    {
      q: 'How many standard pallets fit in a 20ft container?',
      a: 'On one tier, 11 euro pallets, or 9 pallets of either 1,200 × 1,000 mm or 48 × 40 inches, using Maersk’s inside dimensions of 5,896 × 2,350 mm.',
    },
    {
      q: 'Can pallets be stacked two high in a container?',
      a: 'Only if the goods and packaging can bear the load, the stack fits under the inside height and through the door, and the total stays within the payload.',
    },
    {
      q: 'Is a 40ft container twice the capacity of a 20ft?',
      a: 'In floor length slightly more than twice: Maersk lists 12,032 mm inside for the 40ft against 5,896 mm for the 20ft. Its maximum payload is only slightly higher, at 28,800 kg against 28,200 kg, so heavy goods gain little.',
    },
    {
      q: 'How do I know how many cartons fit on each pallet?',
      a: 'Work out the carton layout per layer from the carton and pallet dimensions, then the number of layers the height and weight allow. A CBM calculator gives you the volume to check against.',
    },
  ],
  sources: [
    'maersk-dry-containers',
    'w3-epal-euro-pallet',
    'w3-epal-2-pallet',
    'trade-gov-packing-list',
  ],
  primaryTool: '/tools/cbm-calculator',
  tools: ['/tools/cbm-calculator', '/tools/packing-list-generator', '/tools/chargeable-weight'],
  callout: {
    afterSection: 1,
    tool: '/tools/cbm-calculator',
    title: 'Check the volume of your load',
    text: 'Enter pallet or carton dimensions and quantities to get the total cubic metres, then compare them with the container you plan to book.',
  },
  related: [
    '/guides/lcl-vs-fcl',
    '/blog/packing-list-for-shipping',
    '/blog/shippers-letter-of-instruction',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'OnbSOhz0oig',
    src: 'https://images.unsplash.com/photo-1689942010216-dc412bb1e7a9',
    width: 6000,
    height: 4000,
    alt: 'Warehouse floor lined with loaded pallets, the units counted when planning a container load',
    caption: 'A large warehouse filled with pallets',
    photographer: {
      name: 'AFINIS Group ® - AFINIS GASKET® Production',
      profile: 'https://unsplash.com/@afinisgroup',
    },
    page: 'https://unsplash.com/photos/a-large-warehouse-filled-with-lots-of-pallets-OnbSOhz0oig',
  },
};

export default article;
