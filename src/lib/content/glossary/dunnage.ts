import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-07';

const term: GlossaryTerm = {
  slug: 'dunnage',
  term: 'Dunnage',
  aliases: ['blocking and bracing', 'load securing material'],
  demand: {
    keyword: 'dunnage',
    market: 'US',
    volume: 18_100,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Dunnage: meaning in shipping and ISPM 15',
  description:
    'What dunnage is, why wooden dunnage falls under ISPM 15, how it differs from a pallet, and where it shows up on a packing list.',
  shortDefinition:
    'Dunnage is the loose material used to brace, block, cushion or lift cargo inside a container, truck or hold so it cannot shift in transit. Wooden dunnage counts as wood packaging material under the international phytosanitary standard ISPM 15.',
  definition: [
    'Dunnage is whatever fills the gaps around cargo so it stays put: timber boards and blocks, wedges, inflatable airbags between pallets, cardboard, foam or matting under the load. It is there to stop goods sliding, toppling or rubbing against each other and the walls, and to lift them off a floor where water can collect.',
    'The plant-health rules use a narrower, wood-only meaning. The IPPC’s glossary (ISPM 5) defines dunnage as wood packaging material used to secure or support a commodity but which does not remain associated with the commodity. That last part is the difference from a pallet or a crate, which travels with the goods to the buyer. Dunnage usually stays in the container or is thrown away at unloading.',
    'Because wooden dunnage is wood packaging material, ISPM 15 applies to it in the same way as to pallets. The standard covers packaging made from raw wood and excludes wood processed so that it is pest-free, such as plywood. If you brace a load with sawn timber, treat and mark it as you would a pallet, or use a material the standard does not cover.',
  ],
  onYourDocuments: [
    'Dunnage rarely gets its own line on a commercial invoice, because it is not sold to the buyer. It matters on the packing list and the transport documents in two ways. First, its weight is part of the gross weight of the load but not the net weight of the goods, so heavy timber bracing changes the figure you declare to the carrier. Second, wooden dunnage is wood packaging, so it is worth asking the buyer or their broker whether the destination wants the shipment’s wood packaging described on the paperwork as well as marked on the wood.',
    'For a full container, the weight of dunnage is also part of the verified gross mass the shipper gives the carrier before loading.',
  ],
  example: {
    caption: 'Worked example with invented parties and figures',
    paragraphs: [
      'Northfield Tools (invented) loads 18 pallets of hand tools into a 20ft container. The pallets do not fill the floor, so the loader braces the last row with sawn timber and puts two airbags in the gap by the doors. The packing list shows the goods, the pallets and the bracing separately so the gross weight adds up.',
    ],
    table: {
      caption: 'Invented example: how dunnage enters the weights',
      head: ['Item', 'Weight (kg)', 'Counts towards'],
      rows: [
        ['Goods (net weight)', '9,600', 'Net and gross weight'],
        ['18 pallets', '450', 'Gross weight only'],
        ['Timber bracing and airbags (dunnage)', '120', 'Gross weight only'],
        ['Total gross weight of the cargo', '10,170', 'Packing list, VGM with the container tare'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'Pallet',
      difference:
        'A pallet carries the goods and stays with them to the buyer; dunnage braces or supports them and usually stays behind.',
    },
    {
      term: 'Packaging',
      difference:
        'Packaging (cartons, crates, wrapping) belongs to each package; dunnage works on the load as a whole.',
    },
  ],
  related: [
    'verified-gross-mass',
    'teu',
    '/guides/pallet-sizes',
    '/guides/gross-weight-vs-net-weight',
  ],
  tool: '/tools/container-loading-calculator',
  toolPitch:
    'The container loading calculator shows how many cartons or pallets a container takes, so you can see how much space is left to brace.',
  faq: [
    {
      q: 'Does dunnage need ISPM 15 treatment?',
      a: 'Wooden dunnage made from raw wood is wood packaging material under ISPM 15, so treat and mark it as you would a pallet. Processed wood such as plywood is outside the standard. Whether and how the destination enforces it is set by its plant protection authority.',
    },
    {
      q: 'Is dunnage included in the gross weight?',
      a: 'Yes. Gross weight is the goods plus everything shipped with them, and dunnage travels in the same container or truck. It is not part of the net weight of the goods.',
    },
  ],
  sources: ['ippc-ispm-15-implementation', 'w4-ippc-ispm-15', 'w4-imo-solas-vgm'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
