import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "skid vs pallet" 1,300, KD n/a.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 * The difference comes from a carrier's own packing guide (FedEx Freight); the wood-packaging
 * rule from 7 CFR 319.40 (APHIS), which names skids and pallets alike. No prices, no freight
 * class claims. The palletised example is invented.
 */
const article: ContentArticle = {
  slug: 'skid-vs-pallet',
  title: 'Skid vs pallet: what is the difference for shipping?',
  metaTitle: 'Skid vs pallet: the difference for shipping',
  description:
    'A pallet has bottom deck boards and a skid does not. What that changes for handling, stacking and export paperwork, and how to describe either on a packing list.',
  lede: 'Carriers, warehouses and buyers use “skid” and “pallet” for the same thing so often that the words blur. The difference is one layer of boards, and it matters when you book freight, plan a stacked load or list the packages on your shipping documents.',
  answer:
    'A pallet has a top deck and bottom deck boards; a skid has a top deck on runners or blocks and no bottom deck. FedEx Freight’s packing guide puts it that way and notes the words are often used interchangeably. For export, both count as wood packaging and both belong in the gross weight.',
  keyFacts: [
    'FedEx Freight’s packing guide says a pallet has bottom deck boards and a skid does not, and that the two words are often used interchangeably.',
    'US import rules at 7 CFR 319.40-1 (USDA APHIS) list both pallets and skids as regulated wood packaging material.',
    'Under 7 CFR 319.40-3, regulated wood packaging entering the US must be treated and carry the IPPC mark, and unmarked material can be ordered re-exported.',
    'EPAL lists its euro pallet at 1,200 × 800 × 144 mm and about 25 kg, with a safe working load of 1,500 kg.',
    'Under SOLAS, as set out by the IMO, the verified gross mass of a packed container includes pallets, dunnage and securing material.',
  ],
  definitions: [
    {
      term: 'Skid',
      meaning:
        'A load platform with a top deck fixed to runners or blocks and no bottom deck boards.',
    },
    {
      term: 'Pallet',
      meaning:
        'A load platform with a top deck and bottom deck boards, so it sits on a flat base and can carry more on top of it.',
    },
    {
      term: 'Deck boards',
      meaning:
        'The flat boards of a platform: the top deck carries the load, and a bottom deck spreads it over the floor or the load below.',
    },
    {
      term: 'Stringer or runner',
      meaning:
        'The long beams under the top deck that hold a skid or pallet together and leave the gaps a fork or pallet jack enters.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between a skid and a pallet?',
      paragraphs: [
        'The bottom deck. A pallet has boards on top and boards underneath, joined by stringers or blocks; a skid has the top deck and the runners, and nothing underneath. FedEx Freight’s packing guide states the difference in one line, a pallet has bottom deck boards and a skid does not, and adds that the two terms are often used interchangeably.',
        'That loose usage is the practical problem. A buyer who asks for goods “on skids” may mean ordinary pallets, and a carrier’s rate request may say “skid count” for any platform. When the base matters to you, describe it rather than relying on the word: say whether it has a bottom deck, give its size and say how a fork enters it.',
      ],
      table: {
        caption: 'Skid and pallet compared',
        head: ['', 'Skid', 'Pallet'],
        rows: [
          ['Bottom deck boards', 'None', 'Yes'],
          ['What touches the floor', 'The runners or blocks', 'The bottom deck'],
          [
            'Load on top of it',
            'Rests on the runners, so a load below takes it on narrow strips',
            'Spread over the bottom deck',
          ],
          [
            'Export wood packaging rules',
            'Covered (7 CFR 319.40-1 names skids)',
            'Covered (7 CFR 319.40-1 names pallets)',
          ],
          ['In the gross weight', 'Yes', 'Yes'],
        ],
      },
    },
    {
      heading: 'Are skid and pallet the same thing?',
      paragraphs: [
        'In everyday freight talk, often yes; in how they are built, no. Booking forms, quotes and warehouse receipts often use either word for any platform a forklift can lift, so a “skid” on a carrier’s bill may be a full pallet. The build is where they differ, and the difference is the bottom deck.',
        'If the platform type matters for a shipment, check the carrier’s own packing rules before you book. FedEx Freight, for example, uses the bottom-deck definition in its packing guide. Other carriers publish their own requirements, and they can change, so read the current version for the service you use.',
      ],
    },
    {
      heading: 'When is a skid used instead of a pallet?',
      paragraphs: [
        'When the load does not need a bottom deck. A skid suits a single heavy item, such as a machine or a crate, fixed to runners that lift it off the floor far enough for forks and that will never sit on top of another load. A bottom deck would add boards that do nothing for that job.',
        'A pallet suits stacked and mixed cartons. The bottom deck spreads the weight when one loaded pallet sits on another, keeps cartons off a wet or uneven floor, and gives a flat face for stretch wrap and straps. If your load will be stacked in a warehouse, a truck or a container, a pallet is the safer base, and your carrier may require one.',
      ],
    },
    {
      heading: 'Do skids and pallets follow the same export rules?',
      paragraphs: [
        'Yes, when they are made of raw wood. In the US, the APHIS definitions at 7 CFR 319.40-1 list dunnage, crating, pallets, packing blocks, drums, cases and skids as regulated wood packaging material, and 7 CFR 319.40-3 requires that material to be treated and marked under the International Plant Protection Convention standard. The mark carries a symbol, the producing country’s code, the producer’s number and a treatment code such as HT for heat treatment.',
        'An inspector can order unmarked wood packaging to be re-exported, which can hold up the goods sitting on it. Other countries apply their own rules based on ISPM 15, the IPPC standard for wood packaging, so check the importing country’s requirements. Processed wood such as plywood and particle board falls outside these definitions, and plastic and metal platforms are not wood packaging at all.',
        'Ask your platform supplier for treated, marked skids or pallets before you pack an export load. A skid knocked together in the warehouse from untreated timber carries no mark, so it does not meet this rule.',
      ],
    },
    {
      heading: 'How do you list skids and pallets on a packing list?',
      paragraphs: [
        'As packages, each with its dimensions and weights. The International Trade Administration describes the packing list as itemising the contents of each package with weights and measurements, and forwarders use those figures to work out freight costs. A skid or pallet with its cartons is usually one package line.',
      ],
      steps: [
        'Give each loaded skid or pallet a number, and mark the same number on the load itself.',
        'Write the package type as you would describe it to the carrier: “wooden pallet” or “wooden skid”, not just “skid”.',
        'Measure the length, width and height of the loaded unit from the floor to the top of the load, platform included.',
        'Record the net weight of the goods and the gross weight with the platform, cartons, wrap and straps.',
        'Total the packages, the net weight and the gross weight at the foot of the list, and check they match the commercial invoice and the booking.',
      ],
    },
    {
      heading: 'How does the platform change the shipment’s weight and size?',
      paragraphs: [
        'It adds to both. The platform’s weight goes into the gross weight, and its height goes into the loaded height the carrier measures. EPAL lists its euro pallet at 1,200 × 800 × 144 mm and about 25 kg, so a euro pallet alone adds 144 mm to every load built on it. No body publishes a single weight for a 48 × 40 inch platform: a USDA Forest Service study describes the 48 × 40 inch GMA-style pallet as the most common wood pallet repaired and remanufactured in the US, and builds vary, so weigh the ones you use.',
        'For sea freight, the IMO’s rules on verified gross mass under SOLAS make the shipper responsible for the container’s weight, and the method of adding up the contents counts pallets, dunnage and securing material. For air and groupage freight, the carrier compares the actual weight with a volumetric weight from the dimensions, under IATA’s general rule of 6,000 cubic centimetres to the kilogram, so the platform’s height counts there too.',
      ],
      table: {
        caption: 'Worked example with invented figures: one loaded euro pallet',
        head: ['Item', 'Figure'],
        rows: [
          ['30 cartons × 14 kg (invented)', '420 kg net of packing'],
          ['EPAL euro pallet, EPAL approximate weight', '25 kg'],
          ['Wrap and corner boards (invented)', '2 kg'],
          ['Gross weight on the packing list', '447 kg'],
          ['Loaded height: 1,056 mm of cartons (invented) + 144 mm pallet', '1,200 mm'],
        ],
      },
    },
  ],
  faq: [
    {
      q: 'Is a skid cheaper than a pallet?',
      a: 'It uses fewer boards, but prices depend on the supplier, the timber and the treatment. Ask your supplier to quote both, treated and marked for export.',
    },
    {
      q: 'Can you stack loaded skids?',
      a: 'Only with care. A skid has no bottom deck, so its runners press on narrow strips of the load below. Check your carrier’s rules and your cartons’ stacking strength before you plan it.',
    },
    {
      q: 'Does a plastic skid need an ISPM 15 mark?',
      a: 'No. The wood packaging rules at 7 CFR 319.40 cover raw wood, so plastic and metal platforms fall outside them. Check the importing country’s rules for anything else it requires.',
    },
    {
      q: 'What does “skid count” mean on a freight quote?',
      a: 'Usually the number of platforms, whatever their build. Confirm with the carrier, and give it the dimensions and weight of each one so the quote matches what arrives at the dock.',
    },
    {
      q: 'Is the skid included in net weight?',
      a: 'No. Net weight is the goods alone. The skid or pallet, with cartons, wrap and straps, is part of the gross weight.',
    },
  ],
  sources: [
    'b1-fedex-freight-pallets-skids',
    'b1-cfr-7-319-40-1',
    'b1-cfr-7-319-40-3',
    'w4-ippc-ispm-15',
    'w4-epal-euro-pallet',
    'w4-usda-gma-pallet',
    'w4-imo-solas-vgm',
    'iata-volumetric',
    'a2-trade-gov-packing-list',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: [
    '/tools/packing-list-generator',
    '/tools/pallet-calculator',
    '/tools/container-loading-calculator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/pallet-calculator',
    title: 'Work out the loaded height and gross weight',
    text: 'Enter your carton size and weight to see cartons per layer, the loaded height and the gross weight on a 48 × 40 in, euro or 1,200 × 1,000 mm platform.',
  },
  related: [
    '/guides/pallet-sizes',
    '/blog/how-much-does-a-pallet-weigh',
    '/blog/how-many-pallets-fit-in-a-container',
    '/blog/packing-list-for-shipping',
    '/guides/gross-weight-vs-net-weight',
  ],
  cover: {
    id: 'shc7xdBeMmQ',
    src: 'https://images.unsplash.com/photo-1662106143542-321db529d793',
    width: 5472,
    height: 3648,
    alt: 'A group of empty wooden pallets, the platforms carriers often also call skids',
    caption: 'A group of wooden pallets',
    photographer: { name: 'Sincerely Media', profile: 'https://unsplash.com/@sincerelymedia' },
    page: 'https://unsplash.com/photos/a-group-of-wood-pallets-shc7xdBeMmQ',
  },
};

export default article;
