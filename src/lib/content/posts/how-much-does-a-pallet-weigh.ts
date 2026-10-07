import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "how much does a pallet weigh" 1,900;
 * "pallet weight" 1,000.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A.
 * Empty weights only where the specifying body publishes one (EPAL). No body publishes a single
 * weight for the 48 × 40 inch pallet, so the article says so and tells the reader to weigh it.
 * Pound figures are conversions at the NIST factor; the loaded-pallet example is invented.
 */
const article: ContentArticle = {
  slug: 'how-much-does-a-pallet-weigh',
  title: 'How much does a pallet weigh, empty and loaded?',
  metaTitle: 'How much does a pallet weigh? Empty and loaded',
  description:
    'The published weights of euro and EPAL pallets, why the 48 × 40 inch pallet has no single figure, and how to work out the gross weight of a loaded pallet.',
  lede: 'The pallet is part of the gross weight on your packing list, part of the verified gross mass of a container and part of what the carrier charges for. Its weight is easy to forget and simple to find: look it up where a specification exists, and weigh it where one does not.',
  answer:
    'EPAL lists an empty euro pallet (1,200 × 800 mm) at about 25 kg, roughly 55 lb, and its 1,200 × 1,000 mm EPAL 2 pallet at about 35 kg. The 48 × 40 inch US pallet has no single published weight, because builds and timber vary, so weigh the pallets you actually use.',
  keyFacts: [
    'EPAL lists its euro pallet (EPAL 1) at 1,200 × 800 × 144 mm and about 25 kg, with a safe working load of 1,500 kg.',
    'EPAL lists its EPAL 2 pallet at 1,200 × 1,000 × 162 mm and about 35 kg, with a safe working load of 1,250 kg.',
    'EPAL lists its EPAL 3 pallet at 1,000 × 1,200 × 144 mm and about 30 kg, with a safe working load of 1,500 kg.',
    'Under SOLAS, as set out by the IMO, the verified gross mass of a packed container includes the mass of pallets, dunnage and other securing material.',
    'NIST defines one pound (avoirdupois) as 0.453 592 4 kg, so a 25 kg pallet is about 55.1 lb.',
  ],
  definitions: [
    {
      term: 'Tare weight',
      meaning:
        'The weight of the empty pallet or packaging, which is added to the goods to give the gross weight.',
    },
    {
      term: 'Safe working load',
      meaning:
        'The load a pallet is specified to carry in normal handling, as stated by its specification body or maker.',
    },
    {
      term: 'Gross weight',
      meaning:
        'The weight of the goods with all their packing, including cartons, wrap and the pallet.',
    },
    {
      term: 'Verified gross mass (VGM)',
      meaning:
        'The total weight of a packed container that the shipper must provide before it is loaded on a ship.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'How much does an empty pallet weigh?',
      paragraphs: [
        'It depends on the pallet. Where a specification body publishes a weight, use it as a guide; everywhere else, weigh the pallet. The European Pallet Association (EPAL) publishes approximate weights for its licensed pallets, and the table lists them with the pound equivalents at the NIST factor of 0.453 592 4 kg to the pound.',
        'EPAL writes each weight as “approx.”, because timber and moisture vary from pallet to pallet. Treat the figures as a starting point, not as the number for your shipping documents.',
      ],
      table: {
        caption: 'Empty pallet weights published by EPAL, with pounds converted at the NIST factor',
        head: ['Pallet', 'Size (mm)', 'Empty weight', 'Safe working load'],
        rows: [
          ['EPAL 1 (euro pallet)', '1,200 × 800 × 144', 'About 25 kg (55.1 lb)', '1,500 kg'],
          ['EPAL 2', '1,200 × 1,000 × 162', 'About 35 kg (77.2 lb)', '1,250 kg'],
          ['EPAL 3', '1,000 × 1,200 × 144', 'About 30 kg (66.1 lb)', '1,500 kg'],
          [
            '48 × 40 in (GMA-style)',
            'About 1,219 × 1,016',
            'No single published figure: weigh it',
            'Set by the maker',
          ],
        ],
      },
    },
    {
      heading: 'How much does a 48 × 40 inch pallet weigh?',
      paragraphs: [
        'There is no single official figure. The 48 × 40 inch pallet is a size, not one design: a USDA Forest Service study describes 48 × 40 inch GMA-type pallets as the most common wood pallets repaired and remanufactured in the United States, and those pallets are built from different timbers, in new, repaired and remanufactured grades, by many makers.',
        'Weight lists online give ranges, but none of them is a specification you can rely on for a shipping document. The reliable figure is your own: put three or four of the pallets you actually use on a scale, note the heaviest, and use that. If your pallet supplier publishes a weight on its specification sheet, keep the sheet with your shipping records.',
      ],
    },
    {
      heading: 'How do you work out the weight of a loaded pallet?',
      paragraphs: [
        'Add the goods, the cartons, the wrap and the pallet. Weigh the finished pallet if you have a pallet scale; if you do not, build the figure up from its parts, then round up rather than down.',
      ],
      steps: [
        'Weigh one packed carton, including its contents, inner packing and tape.',
        'Multiply by the number of cartons on the pallet.',
        'Add the empty pallet weight, from your scale or the specification sheet.',
        'Add stretch wrap, straps, corner boards and any slip or top sheet.',
        'Write the result as the gross weight of that pallet on the packing list, next to its dimensions.',
      ],
    },
    {
      heading: 'What does a loaded pallet weigh in practice?',
      paragraphs: [
        'Whatever your goods make it, and the pallet is usually a small share of the total. The example below uses invented cartons on a euro pallet. The pallet is about 5% of the gross weight here, but on a pallet of light, bulky goods it can be a much larger share, which is why it should never be left out.',
      ],
      table: {
        caption: 'Worked example with invented figures: 40 cartons on one EPAL euro pallet',
        head: ['Item', 'Weight'],
        rows: [
          ['40 cartons × 12.5 kg (invented)', '500 kg'],
          ['EPAL euro pallet, EPAL approximate weight', '25 kg'],
          ['Stretch wrap and corner boards (invented)', '1.5 kg'],
          ['Gross weight of the pallet', '526.5 kg (about 1,160.7 lb)'],
        ],
      },
    },
    {
      heading: 'How much weight can a pallet hold?',
      paragraphs: [
        'Its safe working load, as its specification states. EPAL gives 1,500 kg for the euro pallet and the EPAL 3, and 1,250 kg for the EPAL 2. When laden pallets are stacked on a solid, even surface, EPAL limits the load on the bottom pallet to 5,500 kg for the euro pallet, 4,500 kg for the EPAL 3 and 4,250 kg for the EPAL 2.',
        'Your cartons may set a lower limit than the pallet does. A pallet that can carry 1,500 kg is no help if the bottom layer of cartons crushes under a second pallet on top, so check the carton’s stacking strength with your packaging supplier before you plan a double-stacked load.',
      ],
    },
    {
      heading: 'Why does pallet weight matter for export?',
      paragraphs: [
        'Because it is in every weight the documents and the carrier work from. The gross weight on the packing list includes the pallet; the net weight does not. The guide to gross weight vs net weight explains how the two are reported.',
        'For air and groupage freight, the carrier compares the actual gross weight with a volumetric weight worked out from the dimensions, as IATA’s general air cargo rule of 6,000 cubic centimetres to the kilogram does. The pallet adds to both sides of that comparison: its weight to the gross weight, and its height, 144 mm for a euro pallet, to the volume. Measure a palletised shipment from the floor to the top of the load, pallet included.',
        'For sea freight, the IMO’s rules on the verification of gross mass under SOLAS make the shipper responsible for the verified gross mass of a packed container. Whether the shipper weighs the packed container or adds up the packages, the total includes pallets, dunnage and securing material, plus the container’s tare.',
        'Wooden pallets also bring a plant-health rule. ISPM 15, the International Plant Protection Convention standard, covers wood packaging made of raw wood, pallets included. EPAL states that every euro pallet made since 1 January 2010 is heat treated to ISPM 15. Ask your pallet supplier for treated, marked pallets when you export.',
      ],
    },
  ],
  faq: [
    {
      q: 'How much does a euro pallet weigh in pounds?',
      a: 'About 55 lb. EPAL gives about 25 kg, and at the NIST factor of 0.453 592 4 kg to the pound that is 55.1 lb.',
    },
    {
      q: 'Is the pallet included in gross weight?',
      a: 'Yes. Gross weight is the goods with all their packing, and the pallet is part of the packing. Net weight leaves it out.',
    },
    {
      q: 'Do plastic pallets weigh less than wooden ones?',
      a: 'Some do and some do not; plastic and metal pallets are made to each maker’s own design. Use the weight on the maker’s specification sheet, or weigh one.',
    },
    {
      q: 'What is the maximum weight on a euro pallet?',
      a: 'EPAL gives a safe working load of 1,500 kg for the euro pallet, and a limit of 5,500 kg on the bottom pallet when laden pallets are stacked on a solid, even surface.',
    },
    {
      q: 'Should I weigh every pallet in a shipment?',
      a: 'Weigh each loaded pallet if you can, since cartons and fill vary. Where you cannot, calculate each one from its parts and round up.',
    },
  ],
  sources: [
    'w4-epal-euro-pallet',
    'w4-epal-2-pallet',
    'a1-epal-3-pallet',
    'w4-usda-gma-pallet',
    'w4-imo-solas-vgm',
    'w4-ippc-ispm-15',
    'iata-volumetric',
    'nist-si-mass',
    'trade-gov-packing-list',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: [
    '/tools/packing-list-generator',
    '/tools/container-loading-calculator',
    '/tools/unit-converter',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/packing-list-generator',
    title: 'Put the pallet weights on your packing list',
    text: 'List each pallet with its dimensions, net and gross weight, and download a packing list PDF with the totals added up for you.',
  },
  related: [
    '/guides/pallet-sizes',
    '/guides/gross-weight-vs-net-weight',
    '/blog/how-many-pallets-fit-in-a-container',
    '/blog/packing-list-for-shipping',
    '/blog/shipping-marks',
  ],
  cover: {
    id: 'i2I0_u98Rh4',
    src: 'https://images.unsplash.com/photo-1573209680076-bd7ec7007616',
    width: 4608,
    height: 3456,
    alt: 'A pile of empty wooden pallets, each adding its own weight to the gross weight of a shipment',
    caption: 'A pile of wooden pallets',
    photographer: {
      name: 'Reproductive Health Supplies Coalition',
      profile: 'https://unsplash.com/@rhsupplies',
    },
    page: 'https://unsplash.com/photos/selective-focus-photography-of-piled-brown-wooden-pallets-i2I0_u98Rh4',
  },
};

export default article;
