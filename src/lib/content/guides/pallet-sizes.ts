import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "standard pallet size" 18,100, KD 13;
 * "pallet size" 5,400; "pallet dimensions" 4,400; "euro pallet size" (UK) 4,400.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 * Floor counts are our arithmetic from Maersk's published inside dimensions
 * ('maersk-dry-containers'), not a load plan.
 */
const article: ContentArticle = {
  slug: 'pallet-sizes',
  title: 'Standard pallet sizes: US, euro and ISO pallets',
  metaTitle: 'Standard pallet sizes: 48 × 40 in and euro',
  description:
    'The 48 × 40 inch pallet, the 1200 × 800 mm euro pallet and the 1200 × 1000 mm pallet, their weights and loads, ISO 6780, ISPM 15, and how many fit a container floor.',
  lede: 'There is no single standard pallet. North American shippers mostly talk in inches, European shippers in millimetres, and the container in between has its own inside width. This guide gives the sizes you will meet, where each figure comes from, and what they mean for your packing list and container.',
  answer:
    'The standard pallet size in the US is 48 × 40 inches (about 1,219 × 1,016 mm), the GMA-style pallet. In Europe it is the EPAL euro pallet, 1,200 × 800 mm, with the 1,200 × 1,000 mm pallet alongside it. ISO 6780 sets principal dimensions and tolerances for flat pallets used in intercontinental handling.',
  keyFacts: [
    'A USDA Forest Service study describes 48 × 40 inch GMA-type pallets as the most common wood pallets repaired and remanufactured in the United States.',
    'EPAL lists its euro pallet (EPAL 1) at 1,200 × 800 × 144 mm, about 25 kg, with a 1,500 kg safe working load.',
    'EPAL lists the EPAL 2 pallet at 1,200 × 1,000 × 162 mm, about 35 kg, with a 1,250 kg safe working load.',
    'ISO 6780:2003 specifies principal dimensions and tolerances for flat pallets for intercontinental materials handling, and ISO confirmed it as current in 2026.',
    'ISPM 15, from the International Plant Protection Convention, regulates wood packaging made from raw wood, including pallets and dunnage.',
  ],
  definitions: [
    {
      term: 'Euro pallet (EPAL 1)',
      meaning:
        'The 1,200 × 800 mm wooden pallet made to the European Pallet Association’s specification.',
    },
    {
      term: 'GMA-style pallet',
      meaning:
        'The 48 × 40 inch stringer pallet named after the Grocery Manufacturers of America (GMA).',
    },
    {
      term: 'Safe working load',
      meaning: 'The load a pallet is rated to carry in use, as stated by its specification.',
    },
    {
      term: 'ISPM 15',
      meaning:
        'The international phytosanitary standard for wood packaging material in international trade.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the standard pallet size in the US?',
      paragraphs: [
        'In the United States it is 48 × 40 inches, the GMA-style pallet. A USDA Forest Service study of pallet performance chose 48 × 40 inch, three-stringer GMA-type pallets because they are the most common wood pallets repaired and remanufactured in the country. In metric terms, 48 × 40 inches is 1,219.2 × 1,016 mm, since an inch is exactly 25.4 mm.',
        'When a US buyer or warehouse says “standard pallet” without a size, this is usually the one they mean. Ask, though, because the word covers different sizes in different markets.',
      ],
    },
    {
      heading: 'What size is a euro pallet?',
      paragraphs: [
        'A euro pallet is 1,200 × 800 mm. The European Pallet Association specifies its EPAL 1 euro pallet at 1,200 mm × 800 mm and 144 mm high, about 25 kg, with a safe working load of 1,500 kg. EPAL adds that the bottom pallet of a stack of laden pallets on a solid, even surface must not carry more than 5,500 kg.',
        'The larger European size is 1,200 × 1,000 mm. EPAL’s EPAL 2 pallet is 1,200 × 1,000 × 162 mm, about 35 kg, with a safe working load of 1,250 kg.',
      ],
      table: {
        caption: 'Common pallet sizes and their published specifications',
        head: ['Pallet', 'Footprint', 'Height', 'Own weight', 'Safe working load'],
        rows: [
          [
            'US GMA-style',
            '48 × 40 in (1,219 × 1,016 mm)',
            'Varies by build',
            'Varies by build',
            'Ask your supplier',
          ],
          ['EPAL 1 euro pallet', '1,200 × 800 mm', '144 mm', 'About 25 kg', '1,500 kg'],
          ['EPAL 2', '1,200 × 1,000 mm', '162 mm', 'About 35 kg', '1,250 kg'],
        ],
      },
    },
    {
      heading: 'What does ISO 6780 say about pallet sizes?',
      paragraphs: [
        'ISO 6780:2003 is the international standard for flat pallets used in intercontinental materials handling. ISO’s summary says it specifies principal dimensions and tolerances for new single-deck and double-deck flat pallets of any material, together with the openings, clearances and chamfers needed for handling by pallet trucks and forklifts. ISO reviewed and confirmed the 2003 edition in 2026.',
        'The full text is sold by ISO. For a shipment, the practical point is simpler: confirm the footprint your buyer’s warehouse and racking accept before you build the load.',
      ],
    },
    {
      heading: 'How many pallets fit on a container floor?',
      paragraphs: [
        'It depends on the pallet and on how you turn it. A container is 2,350 mm wide inside on Maersk’s sheet, so two euro pallets side by side, one turned each way, take 2,000 mm, and two 1,200 × 1,000 pallets turned the same way take 2,000 mm too. Mixing orientations in two lanes is what fits the most.',
        'The table is arithmetic on Maersk’s published inside lengths (5,896 mm for 20ft, 12,032 mm for 40ft, 13,556 mm for 45ft), on one tier, with no allowance for tolerances, overhang, loading space or bracing. Treat it as a ceiling for planning, not a load plan.',
      ],
      table: {
        caption: 'Single-tier floor-fit arithmetic from Maersk inside dimensions (not a load plan)',
        head: ['Pallet', '20ft', '40ft or 40ft high cube', '45ft high cube'],
        rows: [
          ['Euro, 1,200 × 800 mm', '11', '25', '27'],
          ['1,200 × 1,000 mm', '9', '22', '24'],
          ['48 × 40 in (1,219 × 1,016 mm)', '9', '20', '24'],
        ],
      },
    },
    {
      heading: 'Do wooden pallets need ISPM 15 treatment for export?',
      paragraphs: [
        'Wooden pallets made from raw wood fall under ISPM 15, the International Plant Protection Convention’s standard for wood packaging material in international trade. The standard describes phytosanitary measures that reduce the risk of spreading quarantine pests with wood packaging, and it covers dunnage too. It excludes wood processed so that it is free from pests, such as plywood.',
        'EPAL notes that the IPPC mark, showing the country code, the treatment and the registration number, has been mandatory on EPAL pallets since 1 January 2010. Whether the importing country enforces ISPM 15 and how is set by its plant protection authority, so check the destination’s rules and ask your pallet supplier for marked, treated pallets.',
      ],
    },
    {
      heading: 'How do pallets show up on your packing list?',
      paragraphs: [
        'A palletised shipment is listed by pallet as well as by carton. For each pallet, record the number of cartons on it, its footprint and loaded height, and its gross weight including the pallet itself. The pallet’s own weight, about 25 kg for a euro pallet on EPAL’s figures, is part of the gross weight but not the net weight of the goods.',
        'The guide Gross weight vs net weight explains how the totals fit together, and the same pallet count and gross weight should appear on the bill of lading.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is the most common pallet size?',
      a: 'In the US, 48 × 40 inches, which a USDA Forest Service study describes as the most common wood pallet repaired and remanufactured there. In Europe, it is the 1,200 × 800 mm euro pallet, which EPAL describes as the most widely used exchange pallet in the world, mainly used in Europe.',
    },
    {
      q: 'How much does a euro pallet weigh?',
      a: 'About 25 kg, according to EPAL’s specification for the EPAL 1 euro pallet. The 1,200 × 1,000 mm EPAL 2 weighs about 35 kg.',
    },
    {
      q: 'Is a euro pallet the same as a 48 × 40 pallet?',
      a: 'No. A euro pallet is 1,200 × 800 mm; a 48 × 40 inch pallet is about 1,219 × 1,016 mm, wider and slightly longer. They need different floor plans in a container.',
    },
    {
      q: 'How high can I stack a pallet for shipping?',
      a: 'There is no single limit. Check the door height of the container or truck, the carrier’s or forwarder’s rules and the pallet’s rated load. On Maersk’s sheet a 40ft standard door opening is 2,274 mm high.',
    },
  ],
  sources: [
    'w4-usda-gma-pallet',
    'w4-epal-euro-pallet',
    'w4-epal-2-pallet',
    'w4-iso-6780',
    'w4-ippc-ispm-15',
    'maersk-dry-containers',
  ],
  primaryTool: '/tools/cbm-calculator',
  tools: ['/tools/cbm-calculator', '/tools/packing-list-generator', '/tools/chargeable-weight'],
  callout: {
    afterSection: 2,
    tool: '/tools/cbm-calculator',
    title: 'Turn your pallets into cubic metres',
    text: 'Enter each pallet’s footprint, loaded height and count, and the CBM calculator gives the total volume and shows how much of each container size it fills.',
  },
  related: [
    '/guides/shipping-container-sizes',
    '/guides/gross-weight-vs-net-weight',
    '/guides/lcl-vs-fcl',
    '/blog/packing-list-for-shipping',
  ],
  cover: {
    id: 'tWLgDQCKRYU',
    src: 'https://images.unsplash.com/photo-1594571194668-7112042d8f54',
    width: 7360,
    height: 4912,
    alt: 'A tall stack of wooden shipping pallets, the flat platforms cargo is built on for export',
    caption: 'Wooden pallets stacked on top of each other',
    photographer: {
      name: 'Lucas van Oort',
      profile: 'https://unsplash.com/@switch_dtp_fotografie',
    },
    page: 'https://unsplash.com/photos/a-large-stack-of-wooden-pallets-stacked-on-top-of-each-other-tWLgDQCKRYU',
  },
};

export default article;
