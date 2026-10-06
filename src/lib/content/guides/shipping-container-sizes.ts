import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "shipping container dimensions" 8,100, KD 27;
 * "shipping container sizes" 5,400; "container sizes" 1,900; "40ft high cube container
 * dimensions" 590.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 * Figures: Maersk dry equipment sheet ('maersk-dry-containers'), the same sheet behind
 * CONTAINERS in lib/trade/calculations (33, 67, 76, 85 m³; 28,200, 28,800, 28,620, 27,600 kg).
 */
const article: ContentArticle = {
  slug: 'shipping-container-sizes',
  title: 'Shipping container sizes and dimensions',
  metaTitle: 'Shipping container sizes: 20ft, 40ft, high cube',
  description:
    'Inside dimensions, door openings, volume and payload of 20ft, 40ft, 40ft high cube and 45ft containers from one carrier’s sheet, and how to use them to plan a load.',
  lede: 'Container “sizes” are quoted by their outside length, but what you load is decided by the inside dimensions, the door opening and the payload. This guide gives all of them for the four common dry containers, from one carrier’s published specification, so the figures are consistent with each other.',
  answer:
    'The common dry containers are the 20ft standard, the 40ft standard, the 40ft high cube and the 45ft high cube. On Maersk’s steel equipment sheet they hold about 33, 67, 76 and 85 m³, with maximum payloads of 28,200, 28,800, 28,620 and 27,600 kg. Inside, a 20ft box is 5,896 mm long and 2,350 mm wide.',
  keyFacts: [
    'ISO 668 classifies series 1 freight containers by external dimensions and ratings; ISO 1496 is the authoritative document for internal dimensions.',
    'Maersk lists its 20ft steel dry container at 5,896 × 2,350 × 2,393 mm inside, 33 m³ and a 28,200 kg maximum payload.',
    'Maersk’s 40ft standard and 40ft high cube share an inside length of 12,032 mm and width of 2,350 mm; the high cube is 2,697 mm high inside versus 2,393 mm.',
    'On the same sheet, the door opening of a 40ft standard is 2,340 mm wide and 2,274 mm high, lower than the inside height.',
    'Real containers vary by series and carrier, so treat any published figure as typical for planning and confirm with your carrier.',
  ],
  definitions: [
    {
      term: 'Door opening',
      meaning: 'The clear width and height of the open container doors, which limits what can be loaded.',
    },
    {
      term: 'High cube',
      meaning: 'A container 9 ft 6 in tall outside instead of the standard 8 ft 6 in.',
    },
    {
      term: 'Tare weight',
      meaning: 'The weight of the empty container itself.',
    },
    {
      term: 'Maximum payload',
      meaning:
        'The heaviest cargo load the container is rated for: its maximum gross weight minus its tare.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What are the standard shipping container sizes?',
      paragraphs: [
        'Four dry containers cover most general cargo: the 20ft standard, the 40ft standard, the 40ft high cube and the 45ft high cube. ISO 668 sets the classification of series 1 freight containers by their external dimensions and ratings, which is why the outside sizes are the same across carriers: 8 ft wide, 8 ft 6 in tall for standard boxes and 9 ft 6 in for high cubes.',
        'The inside is where boxes differ. ISO 668 itself points to ISO 1496 as the authority for internal dimensions, and each carrier publishes the figures for its own fleet. The tables below use one carrier’s sheet, Maersk’s dry equipment specification for steel containers, so every number comes from the same source. Other carriers and older units will differ by a few millimetres or kilograms.',
      ],
    },
    {
      heading: 'What are the inside dimensions of each container?',
      paragraphs: [
        'Inside length and width set the floor plan; the height “to load line” is the usable height. Maersk gives these figures for its steel dry containers.',
      ],
      table: {
        caption: 'Inside dimensions and volume, Maersk steel dry containers',
        head: ['Container', 'Outside (L × W × H)', 'Inside length', 'Inside width', 'Inside height', 'Volume'],
        rows: [
          ['20ft standard', '20 ft × 8 ft × 8 ft 6 in', '5,896 mm', '2,350 mm', '2,393 mm', '33 m³'],
          ['40ft standard', '40 ft × 8 ft × 8 ft 6 in', '12,032 mm', '2,350 mm', '2,393 mm', '67 m³'],
          ['40ft high cube', '40 ft × 8 ft × 9 ft 6 in', '12,032 mm', '2,350 mm', '2,697 mm', '76 m³'],
          ['45ft high cube', '45 ft × 8 ft × 9 ft 6 in', '13,556 mm', '2,352 mm', '2,698 mm', '85 m³'],
        ],
      },
    },
    {
      heading: 'How big is the door opening?',
      paragraphs: [
        'The door is smaller than the inside of the box, and for tall items it is the real limit. On Maersk’s sheet, the 20ft door opening is 2,350 mm wide and 2,274 mm high, and the 40ft standard door is 2,340 mm wide and 2,274 mm high, about 12 cm lower than the inside height of 2,393 mm. The 40ft high cube door is 2,577 mm high, and the 45ft high cube door 2,585 mm.',
        'Check the tallest item or loaded pallet against the door height, not the inside height, and allow for the forklift or pallet jack that has to lift it through.',
      ],
    },
    {
      heading: 'How much weight can each container carry?',
      paragraphs: [
        'Each box has a maximum gross weight, the container plus its cargo, and a tare weight, the empty box. The difference is the maximum payload, the most cargo it is rated to carry. Maersk publishes all three.',
        'Weight limits on the road or rail legs of the journey can also apply, so ask your forwarder what payload is practical on your route.',
      ],
      table: {
        caption: 'Weights, Maersk steel dry containers',
        head: ['Container', 'Tare weight', 'Maximum gross weight', 'Maximum payload'],
        rows: [
          ['20ft standard', '2,280 kg', '30,480 kg', '28,200 kg'],
          ['40ft standard', '3,700 kg', '32,500 kg', '28,800 kg'],
          ['40ft high cube', '3,880 kg', '32,500 kg', '28,620 kg'],
          ['45ft high cube', '4,900 kg', '32,500 kg', '27,600 kg'],
        ],
      },
    },
    {
      heading: 'How do you choose the right container size?',
      paragraphs: [
        'Start from your cargo, not from the box. Two numbers decide it: total volume in cubic metres and total gross weight. Whichever reaches the container’s limit first is the constraint.',
      ],
      steps: [
        'Measure each carton or pallet and count them; work out the total cubic metres and the total gross weight from your packing list.',
        'Compare the volume with the container’s capacity, leaving room for how cartons really stow; you rarely fill the full nominal volume.',
        'Compare the gross weight of the cargo with the maximum payload. Dense cargo can reach the weight limit in a 20ft box long before the box is full.',
        'Check the tallest and longest item against the door opening and the inside length.',
        'Ask your forwarder for the practical payload on the route and the exact dimensions of the units it will supply.',
      ],
    },
    {
      heading: 'Why does a 40ft container not hold twice a 20ft?',
      paragraphs: [
        'By volume it nearly does: 67 m³ against 33 m³ on Maersk’s sheet. By weight it does not: its maximum payload of 28,800 kg is only 600 kg more than the 20ft’s 28,200 kg. For dense cargo, a 40ft box adds space you may not be able to use; light, bulky cargo gains from the extra volume, and more still from a high cube.',
        'The pallet floor plan is the other difference. The guide Pallet sizes shows how pallets fit the 2,350 mm inside width.',
      ],
    },
  ],
  faq: [
    {
      q: 'What are the inside dimensions of a 40ft high cube container?',
      a: 'On Maersk’s steel dry container sheet: 12,032 mm long, 2,350 mm wide and 2,697 mm high to the load line, about 76 m³. The door opening is 2,340 mm wide and 2,577 mm high.',
    },
    {
      q: 'How many cubic metres is a 20ft container?',
      a: 'About 33 m³ on Maersk’s sheet, from inside dimensions of 5,896 × 2,350 × 2,393 mm. The usable volume is lower once cartons are stowed.',
    },
    {
      q: 'Are container dimensions the same for every shipping line?',
      a: 'The outside dimensions follow the ISO 668 classification, so they match. Inside dimensions, door openings and weights vary slightly by carrier and container series, so confirm them with the carrier for a tight load.',
    },
    {
      q: 'What is the difference between tare weight and payload?',
      a: 'Tare is the empty container’s own weight; payload is the most cargo it is rated to carry. Maximum gross weight is the two added together.',
    },
  ],
  sources: ['maersk-dry-containers', 'w4-iso-668'],
  primaryTool: '/tools/cbm-calculator',
  tools: ['/tools/cbm-calculator', '/tools/packing-list-generator', '/tools/chargeable-weight'],
  callout: {
    afterSection: 1,
    tool: '/tools/cbm-calculator',
    title: 'Check your cargo against each container',
    text: 'Enter carton dimensions, count and weight, and the CBM calculator shows how much of a 20ft, 40ft, 40ft high cube and 45ft container your shipment fills, by volume and by weight.',
  },
  related: [
    '/guides/lcl-vs-fcl',
    '/guides/pallet-sizes',
    '/guides/gross-weight-vs-net-weight',
    '/guides/what-is-a-bill-of-lading',
    '/blog/packing-list-for-shipping',
  ],
  cover: {
    id: '0wogewHn1HQ',
    src: 'https://images.unsplash.com/photo-1713950653257-33abeea82b40',
    width: 5958,
    height: 3972,
    alt: 'Blue and white steel shipping containers stacked side by side at a container yard',
    caption: 'Steel shipping containers stacked in a yard',
    photographer: { name: 'Daniel von Appen', profile: 'https://unsplash.com/@daniel_von_appen' },
    page: 'https://unsplash.com/photos/a-couple-of-blue-and-white-shipping-containers-0wogewHn1HQ',
  },
};

export default article;
