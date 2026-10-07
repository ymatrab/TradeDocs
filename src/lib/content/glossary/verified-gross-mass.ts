import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-07';

const term: GlossaryTerm = {
  slug: 'verified-gross-mass',
  term: 'Verified gross mass (VGM)',
  abbreviation: 'VGM',
  aliases: ['VGM', 'SOLAS VGM', 'container weight verification'],
  demand: {
    keyword: 'verified gross mass',
    market: 'US',
    volume: 8_100,
    kd: 12,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Verified gross mass (VGM): SOLAS rule explained',
  description:
    'What the verified gross mass of a container is, who must provide it under SOLAS, the two ways to obtain it, and how it relates to your packing list weights.',
  shortDefinition:
    'Verified gross mass (VGM) is the total weight of a packed export container: cargo, packaging, pallets, dunnage and the container’s own tare. Under the SOLAS convention the shipper must provide it to the carrier before the container can be loaded on a ship.',
  definition: [
    'The VGM rule is in SOLAS, the International Convention for the Safety of Life at Sea, in regulation VI/2. The IMO explains that it makes the shipper responsible for verifying the gross mass of a packed container, and that a verified gross mass is a condition for loading a packed container onto a ship. The requirement entered into force on 1 July 2016.',
    'There are two ways to get the figure. Method 1 is to weigh the packed container. Method 2 is to weigh all the packages and cargo items, including pallets, dunnage and other securing material, and add the tare mass of the container; it must follow a certified method approved by the competent authority of the country where the container was packed. Either way the figure comes from weighing.',
    'The IMO defines the shipper as the party named as shipper on the bill of lading, sea waybill or equivalent multimodal transport document, or the party that concluded the contract of carriage with the line. That may not be the person who stuffs the box. If a forwarder or warehouse packs it for you, agree in advance who weighs it and who sends the VGM to the line, usually through the carrier’s booking system before the cut-off.',
  ],
  onYourDocuments: [
    'SOLAS has the shipper state the VGM in a shipping document given to the carrier, in practice the shipping instruction or a separate VGM submission in the line’s booking system. It is not a field on the commercial invoice.',
    'Your packing list feeds it. Method 2 is the packing list’s gross weight plus the container tare, so the gross weights per package, pallets and bracing included, must be complete and correct. A packing list that shows only net weights cannot support a Method 2 VGM.',
  ],
  example: {
    caption: 'Worked example with invented parties, using Method 2',
    paragraphs: [
      'Riverside Ceramics (invented) packs a 20ft container itself and uses Method 2. It weighs every pallet as packed, under the certified Method 2 procedure that applies where it packs, and takes the tare from the container’s door markings.',
    ],
    table: {
      caption: 'Invented example: a Method 2 VGM',
      head: ['Item', 'Weight (kg)'],
      rows: [
        ['20 pallets of tiles as weighed, pallets included', '14,200'],
        ['Timber bracing and airbags (dunnage)', '90'],
        ['Container tare, from the door markings', '2,200'],
        ['Verified gross mass', '16,490'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'Gross weight on the packing list',
      difference:
        'The packing list gross weight covers the cargo and its packing; the VGM adds the container’s tare to it.',
    },
    {
      term: 'Maximum payload',
      difference:
        'Payload is how much cargo a container may carry; VGM is how much the packed container actually weighs.',
    },
  ],
  related: [
    'dunnage',
    'teu',
    '/guides/gross-weight-vs-net-weight',
    '/blog/packing-list-for-shipping',
  ],
  tool: '/tools/packing-list-generator',
  toolPitch:
    'The packing list generator totals net and gross weight per line, the figures a Method 2 VGM starts from.',
  faq: [
    {
      q: 'Who is responsible for the VGM?',
      a: 'The shipper named on the bill of lading or sea waybill. SOLAS regulation VI/2 places the responsibility for verifying the gross mass on the shipper, even when a forwarder or packer does the weighing on its behalf.',
    },
    {
      q: 'What are the two VGM methods?',
      a: 'Method 1: weigh the packed container. Method 2: weigh all the cargo and packing, including pallets and dunnage, and add the container’s tare mass, using a certified method where the container is packed. Both rely on weighing.',
    },
    {
      q: 'What happens if no VGM is provided?',
      a: 'Under SOLAS a verified gross mass is a condition for loading. The IMO notes that the master and the terminal may obtain the figure on the shipper’s behalf, but otherwise the box stays on the quay and can miss its sailing.',
    },
  ],
  sources: ['w4-imo-solas-vgm'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
