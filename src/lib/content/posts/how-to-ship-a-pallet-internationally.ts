import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06/07): "how to ship a pallet" 140; "how to wrap a
 * pallet" 140; "how to stack boxes on a pallet" 110.
 * Plan: docs/research/content-plan-v3-2026-10-07.md (v2 #58), wave B.
 * Pallet facts from ISO, EPAL and the IPPC; weights and volumes from IATA and the IMO. No
 * carrier rates, height limits or transit times: carriers set them. Stacking and wrapping are
 * described as general practice without invented thresholds. The worked pallet is invented.
 * ISPM 15 is kept short here; the planned ispm-15-wood-packaging page covers it in depth.
 */
const article: ContentArticle = {
  slug: 'how-to-ship-a-pallet-internationally',
  title: 'How to ship a pallet internationally: build, wrap, measure, document',
  metaTitle: 'How to ship a pallet internationally',
  description:
    'Choose an export pallet, stack and wrap the boxes, measure and weigh the load, label it and list it on the packing list, step by step for one international pallet.',
  lede: 'A pallet turns forty loose cartons into one piece of freight that a forklift can move, a carrier can price and customs can count. Shipping one abroad is mostly careful packing and accurate numbers: the right pallet, a stable load, the real dimensions and weight, and documents that describe exactly what is on it.',
  answer:
    'To ship a pallet internationally, use a sound pallet that meets ISPM 15 if it is wood, stack the cartons square within its edges, wrap and strap the load, then measure it from the floor to the top and weigh it. Label every side, list it on the packing list and invoice, and book it with your carrier.',
  keyFacts: [
    'ISO 6780 sets the principal dimensions and tolerances of flat pallets for intercontinental materials handling.',
    'EPAL lists its euro pallet at 1,200 × 800 × 144 mm and about 25 kg, with a safe working load of 1,500 kg.',
    'ISPM 15, the International Plant Protection Convention standard, covers wood packaging made of raw wood, including pallets and dunnage, and excludes processed wood such as plywood.',
    'IATA’s general air cargo rule converts volume to weight at 6,000 cubic centimetres per kilogram, and the carrier charges the greater of actual and volumetric weight.',
    'Under SOLAS, as the IMO sets out, a packed container’s verified gross mass includes pallets, dunnage and securing material.',
  ],
  definitions: [
    {
      term: 'Unit load',
      meaning:
        'Goods stacked and secured on a pallet so they can be handled, stored and shipped as one piece.',
    },
    {
      term: 'Overhang',
      meaning:
        'Cartons that stick out beyond the edge of the pallet deck, where they take knocks and lose support.',
    },
    {
      term: 'Chargeable weight',
      meaning:
        'The weight a carrier bills: the greater of the actual gross weight and the volumetric weight.',
    },
    {
      term: 'ISPM 15 mark',
      meaning:
        'The stamp on treated wood packaging showing it meets the international plant-health standard.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'How do you ship a pallet internationally, step by step?',
      paragraphs: [
        'Build the load first and book it last, because the carrier quotes on the dimensions and weight of the finished pallet. The order below works for road groupage, sea freight in a shared container or air cargo.',
      ],
      steps: [
        'Choose a pallet that suits the goods and the destination, wooden ones treated and marked to ISPM 15.',
        'Stack the cartons square on the deck, heaviest at the bottom, with nothing hanging over the edges.',
        'Add a top sheet and corner boards, then stretch-wrap the load to the pallet and strap it if the goods are heavy.',
        'Measure the length, width and height of the finished pallet, from the floor to the highest point, and weigh it.',
        'Label at least two sides with the shipping marks and the pallet number, such as 1 of 3.',
        'Record the pallet on the packing list and the commercial invoice, then book it with the measured dimensions and gross weight.',
      ],
    },
    {
      heading: 'Which pallet should you use for an international shipment?',
      paragraphs: [
        'One whose size the destination handles and whose material the destination accepts. ISO 6780 sets the principal dimensions of flat pallets for intercontinental handling, and the guide to pallet sizes explains the common ones. EPAL specifies its euro pallet at 1,200 × 800 × 144 mm, with a safe working load of 1,500 kg and an empty weight of about 25 kg. In the United States, a USDA Forest Service study describes the 48 × 40 inch GMA-style pallet as the most common wood pallet repaired and remanufactured there.',
        'If the pallet is wood, plant-health rules apply. ISPM 15 covers wood packaging made of raw wood, pallets included, and countries that apply it expect the wood to be treated and to carry the ISPM 15 mark. EPAL states that every euro pallet made since 1 January 2010 is heat treated to ISPM 15. Processed wood such as plywood falls outside the standard, and plastic or metal pallets are not wood packaging at all. Ask your pallet supplier for marked pallets, and check the importing country’s rules.',
      ],
    },
    {
      heading: 'How do you stack boxes on a pallet?',
      paragraphs: [
        'Square, tight and within the edges. Cartons that overhang the deck carry their load on unsupported board and take every knock in the warehouse, so plan the layer so that the cartons fill the deck without passing its edges. Put the heaviest cartons at the bottom and keep the top flat so that the wrap and any pallet stacked on it bear evenly.',
        'Carton sizes that divide the pallet make this easier. ISO 3394 sets transport package dimensions on modules of 600 × 400 mm and related sizes, chosen to fit the standard unit load footprints of 1,200 × 800 and 1,200 × 1,000 mm. Two layouts are common: columns, with each carton directly above the one below, which uses the carton’s own stacking strength; and interlocking, with alternate layers turned, which ties the load together. Ask your carton supplier which suits your boxes, especially before you plan to double-stack pallets.',
      ],
    },
    {
      heading: 'How do you wrap a pallet for shipping?',
      paragraphs: [
        'So that the load and the pallet move as one piece. Start the stretch wrap at the base, taking a few turns around the deck itself to tie the cartons to the pallet, then spiral up to the top and back down, overlapping each pass. A cardboard top sheet stops the wrap crushing the top layer, and corner boards spread the pressure of straps and wrap along the edges.',
        'Heavy or dense loads usually need straps through the pallet as well as wrap. Whatever you use, include it in the weight: wrap, straps, corner boards and sheets are part of the gross weight on your packing list.',
      ],
    },
    {
      heading: 'How do you measure and weigh a pallet?',
      paragraphs: [
        'Measure the finished pallet, not the cartons. Length and width are the larger of the deck or the load; height runs from the floor, including the pallet, to the highest point. Weigh it on a pallet scale if you can; if not, add the cartons, the empty pallet and the packing materials, and round up.',
        'For air freight, IATA’s general rule converts volume to weight at 6,000 cm³ per kilogram, and the carrier charges whichever is greater. A tall, light pallet can cost more by volume than by weight, which is why every centimetre of height counts.',
      ],
      table: {
        caption:
          'Worked example with invented figures: chargeable weight of one euro pallet by air',
        head: ['Measure', 'Value'],
        rows: [
          ['Dimensions, floor to top', '120 × 80 × 150 cm (invented load height)'],
          ['Volume', '1.44 m³'],
          ['Volumetric weight at 6,000 cm³/kg', '240 kg'],
          ['Actual gross weight, pallet and wrap included (invented)', '310 kg'],
          ['Chargeable weight', '310 kg, the greater of the two'],
        ],
      },
    },
    {
      heading: 'How should an export pallet be labelled?',
      paragraphs: [
        'With the same marks as its cartons, on at least two sides so that they can be read whichever way the pallet is stored. The ITA lists the marks export packages usually carry: the shipper’s mark, the country of origin, the weight in pounds and kilograms, the number of packages and their size, handling and cautionary marks, and the port of entry, often as the buyer specifies. Number each pallet, such as 2 of 3, so that the consignee can check the count.',
        'The ITA also notes that a packing list can be attached to the outside of a package with a copy inside. On a pallet, a document pouch under the wrap on one side keeps it readable and dry.',
      ],
    },
    {
      heading: 'What documents does a pallet shipment need?',
      paragraphs: [
        'A packing list and a commercial invoice at the least, plus whatever the destination and the mode require. The ITA describes the packing list as itemising each package, pallets included, with weights, measurements and contents, and says forwarders use it to work out weights and freight costs while customs officials use it to check what is inside. List each pallet as its own line, with its dimensions, net and gross weight and the cartons on it, and make the totals match the invoice.',
        'If your pallets travel in a container you pack, the IMO’s rules under SOLAS make the shipper responsible for the verified gross mass, which includes the pallets, dunnage and securing material. Your forwarder tells you what else the destination needs.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do plastic pallets need ISPM 15 treatment?',
      a: 'No. ISPM 15 covers wood packaging made of raw wood. Plastic and metal pallets are outside it, as is processed wood such as plywood, though the importing country’s rules still apply.',
    },
    {
      q: 'How tall can a shipping pallet be?',
      a: 'Each carrier and vehicle sets its own limit, and air freight limits depend on the aircraft. Ask your forwarder before you build the load, and measure the height with the pallet included.',
    },
    {
      q: 'Is the pallet included in the gross weight?',
      a: 'Yes. Gross weight covers the goods with all their packing, and the pallet, wrap and straps are packing. Net weight leaves them out.',
    },
    {
      q: 'Can I ship one pallet in a container?',
      a: 'Yes, as part of a shared, less-than-container load, which the carrier or forwarder consolidates with other shippers’ cargo. A full container is booked and packed for one shipper.',
    },
    {
      q: 'Should I wrap the pallet before or after weighing it?',
      a: 'Before. The carrier and the documents need the weight and dimensions of the finished pallet, so measure and weigh it exactly as it will ship.',
    },
  ],
  sources: [
    'w4-iso-6780',
    'w4-epal-euro-pallet',
    'w4-usda-gma-pallet',
    'w4-ippc-ispm-15',
    'a1-iso-3394',
    'iata-volumetric',
    'w4-imo-solas-vgm',
    'w2-ita-labeling',
    'trade-gov-packing-list',
    'maersk-fcl-lcl',
  ],
  primaryTool: '/tools/pallet-calculator',
  tools: [
    '/tools/pallet-calculator',
    '/tools/packing-list-generator',
    '/tools/chargeable-weight',
    '/tools/cbm-calculator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/pallet-calculator',
    title: 'Plan how your cartons fit the pallet',
    text: 'Enter your carton size and pallet type to see how many cartons fit per layer and per pallet, and the height and weight of the finished load.',
  },
  related: [
    '/guides/pallet-sizes',
    '/blog/how-much-does-a-pallet-weigh',
    '/blog/how-many-pallets-fit-in-a-container',
    '/blog/shipping-marks',
    '/blog/packing-list-for-shipping',
    '/guides/lcl-vs-fcl',
  ],
  cover: {
    id: 'xGYp_h7fm2I',
    src: 'https://images.unsplash.com/photo-1651525670033-279c26cc2347',
    width: 5865,
    height: 3910,
    alt: 'Stacks of boxes in a processing warehouse, built up into loads ready for shipping',
    caption: 'Stacked boxes inside a fruit processing warehouse',
    photographer: { name: 'Arno Senoner', profile: 'https://unsplash.com/@arnosenoner' },
    page: 'https://unsplash.com/photos/a-large-stack-of-boxes-xGYp_h7fm2I',
  },
};

export default article;
