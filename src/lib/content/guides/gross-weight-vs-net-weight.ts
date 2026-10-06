import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "gross weight vs net weight" 6,600;
 * "net weight vs gross weight" 6,600; "tare weight" 4,400, KD 8; "gross weight" 2,400.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'gross-weight-vs-net-weight',
  title: 'Gross weight vs net weight vs tare weight',
  metaTitle: 'Gross weight vs net weight: tare and VGM',
  description:
    'Net, gross and tare weight on an export packing list, a worked example with invented figures, and how a container’s verified gross mass is built under SOLAS.',
  lede: 'Three weights describe one shipment, and each document asks for a different one. Get them straight on the packing list once and the invoice, the booking and the container weight declaration all follow from it.',
  answer:
    'Net weight is the weight of the goods alone, without packaging. Tare weight is the weight of the packaging or container that holds them. Gross weight is the two together: goods plus cartons, pallets and other packing. An export packing list states total net and gross weight, and a packed sea container needs a verified gross mass.',
  keyFacts: [
    'The International Trade Administration lists total net and gross weight, in kilograms, among the details of an export packing list.',
    'Forwarders use the packing list to work out weights and freight costs, and customs uses it to check package contents, according to the ITA.',
    'Under SOLAS regulation VI/2, in force since 1 July 2016, the shipper must declare a packed container’s verified gross mass before it is loaded on a ship.',
    'The IMO allows two methods: weighing the packed container, or weighing all packages and packing material and adding the container’s tare mass.',
    'Maersk lists the tare weight of its 20ft steel dry container at 2,280 kg and its 40ft standard at 3,700 kg.',
  ],
  definitions: [
    {
      term: 'Net weight',
      meaning: 'The weight of the goods themselves, without the shipping packaging.',
    },
    {
      term: 'Tare weight',
      meaning: 'The weight of the empty packaging, pallet or container.',
    },
    {
      term: 'Gross weight',
      meaning: 'Net weight plus tare: the goods with all their packaging.',
    },
    {
      term: 'Verified gross mass (VGM)',
      meaning:
        'The SOLAS-required total weight of a packed container, including cargo, packing material and the container’s tare.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between gross weight and net weight?',
      paragraphs: [
        'Net weight is what the goods weigh; gross weight is what the goods weigh packed. The difference is the tare: cartons, wrapping, pallets, crates and anything else that travels with the goods but is not the goods.',
        'Where the line between “goods” and “packaging” sits is not fixed: retail packaging sold with the product is the usual grey area, while shipping cartons and pallets are clearly tare. Agree the convention with your buyer, and check the importing country’s rules if duties there are charged by weight.',
      ],
    },
    {
      heading: 'What does tare weight mean?',
      paragraphs: [
        'Tare weight is the weight of the empty container, whatever the container is: a carton, a pallet or a steel shipping container. Subtract the tare from the gross and you have the net.',
        'Published tare figures help with planning. EPAL gives its 1,200 × 800 mm euro pallet a weight of about 25 kg. Maersk lists the tare of its 20ft steel dry container at 2,280 kg and its 40ft standard at 3,700 kg; its maximum payload is the maximum gross weight minus that tare.',
      ],
    },
    {
      heading: 'Which weights go on the packing list and the invoice?',
      paragraphs: [
        'The packing list carries both. The International Trade Administration’s description of an export packing list includes the number and type of packages, total net and gross weight in kilograms, and package marks and dimensions. Forwarders use those weights to work out freight costs, and customs officials may use the list to check the cargo, so the commercial invoice should reflect the same figures.',
        'In practice, give the net and gross weight for each package or line, and the totals at the foot. Carriers and forwarders quote on gross weight, because it is what they lift, and parcel carriers compare it with dimensional weight: UPS, for example, divides centimetre dimensions by 5,000 and charges on the greater of the two.',
      ],
    },
    {
      heading: 'How do you work out the weights for a shipment?',
      paragraphs: [
        'Build the weights up from the smallest unit. The worked example uses invented goods and figures; replace them with your own scale readings.',
      ],
      table: {
        caption: 'Worked example with invented goods and figures: 20 cartons on two euro pallets',
        head: ['Item', 'Calculation', 'Weight'],
        rows: [
          ['Goods per carton (net)', 'Weighed', '9.5 kg'],
          ['Empty carton and packing (tare)', 'Weighed', '0.5 kg'],
          ['Gross per carton', '9.5 + 0.5', '10.0 kg'],
          ['Total net weight', '20 × 9.5', '190 kg'],
          ['Cartons, gross', '20 × 10.0', '200 kg'],
          ['Two euro pallets (tare)', '2 × about 25 kg (EPAL figure)', '50 kg'],
          ['Total gross weight of the shipment', '200 + 50', '250 kg'],
        ],
      },
    },
    {
      heading: 'What is a container’s verified gross mass?',
      paragraphs: [
        'It is the weight of the packed container, and for sea freight it is a condition of loading. The IMO’s amendments to SOLAS regulation VI/2, in force since 1 July 2016, make the shipper responsible for stating the verified gross mass in the shipping document and submitting it to the master and the terminal in time for the stowage plan. The shipper is the party named on the bill of lading or sea waybill, or the party that contracted the carriage.',
        'The IMO recognises two methods:',
      ],
      steps: [
        'Weigh the packed container as a whole.',
        'Or weigh all the packages and cargo items, including pallets, dunnage and other securing material, and add the container’s tare mass, using a certified method approved by the authority of the country where the container was packed.',
      ],
    },
    {
      heading: 'Why must the weights agree across documents?',
      paragraphs: [
        'Because each party checks a different document against the same goods. The forwarder prices from the packing list, the carrier loads against the booked weight and the VGM, and customs can compare the packing list with what it finds. The IMO makes a verified gross mass a condition for loading a packed container, and the ITA warns that discrepancies in export documents can delay a shipment or stop payment.',
        'Weigh once, record the figures on the packing list, and copy them to the invoice, the booking and the bill of lading instructions. If you repack, weigh again.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is gross weight always heavier than net weight?',
      a: 'Yes, for packed goods. Gross weight is the net weight plus the tare of the packaging, so it can only be equal to net weight if the goods travel completely unpacked.',
    },
    {
      q: 'Does the pallet count in gross weight?',
      a: 'Yes. The pallet is part of the packaging, so its weight is included in gross weight and excluded from net weight. A euro pallet weighs about 25 kg on EPAL’s specification.',
    },
    {
      q: 'Does the container’s tare count in verified gross mass?',
      a: 'Yes. Under the IMO’s SOLAS rules, the verified gross mass includes the cargo, pallets, dunnage and securing material, and the container’s tare mass.',
    },
    {
      q: 'Which weight do carriers charge on?',
      a: 'Usually the gross weight, or for parcels and air freight the greater of gross weight and dimensional weight. Check the carrier’s own rules for the divisor it uses.',
    },
  ],
  sources: [
    'trade-gov-export-documents',
    'trade-gov-packing-list',
    'w4-imo-solas-vgm',
    'maersk-dry-containers',
    'w4-epal-euro-pallet',
    'ups-dimensional',
    'w4-trade-gov-export-transaction',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/chargeable-weight', '/tools/cbm-calculator'],
  callout: {
    afterSection: 2,
    tool: '/tools/packing-list-generator',
    title: 'Let the packing list add up the weights',
    text: 'Enter net and gross weight per carton and the packing list generator totals them for the whole shipment, ready to copy to the invoice and the booking.',
  },
  related: [
    '/blog/packing-list-for-shipping',
    '/guides/pallet-sizes',
    '/guides/shipping-container-sizes',
    '/guides/what-is-a-bill-of-lading',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: '7gCB0T6Lv2E',
    src: 'https://images.unsplash.com/photo-1757969039156-93c9e70c1e9b',
    width: 7600,
    height: 5067,
    alt: 'A cardboard shipping carton marked with measurements, ready to be weighed and listed for export',
    caption: 'Cardboard box with measurements and staples',
    photographer: { name: 'MiguelPhoto', profile: 'https://unsplash.com/@miguelphoto' },
    page: 'https://unsplash.com/photos/cardboard-box-with-measurements-and-staples-7gCB0T6Lv2E',
  },
};

export default article;
