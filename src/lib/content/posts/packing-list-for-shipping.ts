import { BYLINE, type ContentArticle } from '@/lib/content/article';

const BLOG_ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-05): "packing list for shipping" 210, "shipping packing
 * list" 210, "export packing list" 40, "packing list for export" 40.
 */
const article: ContentArticle = {
  slug: 'packing-list-for-shipping',
  title: 'Packing list for shipping: what it is and what goes on it',
  metaTitle: 'Packing list for shipping: what goes on it',
  description:
    'What an export packing list is, who relies on it, the fields it needs, how it differs from the commercial invoice, and a worked example with weights and dimensions.',
  lede: 'The commercial invoice says what the goods are worth. The packing list says where they are: which carton holds what, how much each one weighs and how big it is. Forwarders, customs and the buyer’s warehouse all work from it.',
  answer:
    'A packing list for shipping itemises the contents of each package in a consignment, with the package count, marks and numbers, dimensions, and net and gross weights. It carries no prices. Forwarders use it to work out freight, customs use it to check the contents, and the buyer uses it to check the delivery.',
  keyFacts: [
    'A packing list itemises the contents of each package, with weights, measurements and a detailed list of the goods.',
    'Forwarders use the packing list to determine weights and freight costs.',
    'Customs officials use the packing list to check the contents of packages.',
    'A packing list normally carries no prices; values belong on the commercial invoice.',
    'For U.S. imports, 19 CFR 141.86 requires the invoice to state in adequate detail what each package contains.',
  ],
  definitions: [
    {
      term: 'Packing list',
      meaning:
        'A package-by-package statement of what a consignment contains, with weights and dimensions.',
    },
    {
      term: 'Net weight',
      meaning: 'The weight of the goods alone, without packaging.',
    },
    {
      term: 'Gross weight',
      meaning: 'The weight of the goods with all their packaging, as the carrier will weigh it.',
    },
    {
      term: 'Shipping marks',
      meaning:
        'The marks and numbers printed on each package so it can be matched to the documents.',
    },
  ],
  published: BLOG_ROUND,
  updated: BLOG_ROUND,
  reviewed: BLOG_ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a packing list in shipping?',
      paragraphs: [
        'In export shipping, a packing list is the document that itemises the contents of each package, whether that is a carton, a crate or a pallet. The U.S. International Trade Administration describes it as including weights, measurements and detailed lists of the goods in each package.',
        'It is a different document from a travel packing list or a warehouse packing slip. An export packing list follows the goods across a border, travels with the commercial invoice and the transport document, and is read by people who will never open the cartons unless something on it looks wrong.',
      ],
    },
    {
      heading: 'Who uses the packing list?',
      paragraphs: [
        'Several parties rely on the same document for different reasons, which is why one inaccurate line causes trouble in several places at once.',
      ],
      list: [
        'The forwarder or carrier, to work out weights, volume and the freight charge, and to plan loading.',
        'Customs at export and import, to check what is in each package against the invoice and to select packages for inspection.',
        'The consolidator, in an LCL shipment, to keep your packages together among other shippers’ cargo.',
        'The buyer’s warehouse, to check the delivery carton by carton and report anything missing.',
        'The buyer’s bank, where a letter of credit asks for a packing list among the documents.',
      ],
    },
    {
      heading: 'What goes on an export packing list?',
      paragraphs: [
        'The packing list repeats the parties and references of the commercial invoice, so the two can be matched, and then describes the packages rather than the prices.',
      ],
      steps: [
        'Head it with the seller, the buyer and the consignee, the date, and the invoice and order numbers it belongs to.',
        'Number every package and give its shipping marks exactly as printed on the outside.',
        'List what each package contains: the description and quantity of each product, matching the invoice lines.',
        'Give each package’s dimensions, net weight and gross weight, in stated units.',
        'Total the packages, the net and gross weights and the volume at the foot.',
        'Add the Incoterms® rule and place, the mode of transport and, once known, the container and seal numbers.',
      ],
    },
    {
      heading: 'What is the difference between a packing list and a commercial invoice?',
      paragraphs: [
        'They describe the same shipment from two angles. The invoice is about money and classification; the packing list is about physical packages. Customs compares them, so every shared figure must agree.',
      ],
      table: {
        caption: 'Packing list and commercial invoice compared',
        head: ['', 'Packing list', 'Commercial invoice'],
        rows: [
          ['Main purpose', 'Describe each package', 'Bill the goods and declare their value'],
          ['Prices and values', 'Not normally shown', 'Shown for every line'],
          ['Weights and dimensions', 'Per package and in total', 'Total weights, often'],
          ['Package marks and numbers', 'Always', 'Usually, as a summary'],
          [
            'Read by customs to',
            'Check contents and choose packages to inspect',
            'Assess duties and taxes',
          ],
          [
            'Read by the forwarder to',
            'Calculate freight and plan loading',
            'Prepare the export declaration',
          ],
        ],
      },
    },
    {
      heading: 'What does a filled-in packing list look like?',
      paragraphs: [
        'The lines below are an invented example for three pallets of machine parts. Figures are made up to show the layout and the arithmetic, not taken from a real shipment.',
        'Note that the gross weight of each pallet includes the pallet and packaging, and that the totals at the foot are simple sums of the lines. A forwarder will check those totals against what its scale and tape measure say.',
      ],
      table: {
        caption: 'Example packing list lines (invented figures)',
        head: ['Package', 'Marks', 'Contents', 'Dimensions (cm)', 'Net kg', 'Gross kg'],
        rows: [
          [
            'Pallet 1',
            'EXM/2026/1',
            '120 hydraulic fittings, model HF-20',
            '120 × 80 × 110',
            '310',
            '345',
          ],
          [
            'Pallet 2',
            'EXM/2026/2',
            '120 hydraulic fittings, model HF-20',
            '120 × 80 × 110',
            '310',
            '345',
          ],
          ['Pallet 3', 'EXM/2026/3', '60 pump housings, model PH-5', '120 × 80 × 95', '280', '312'],
          ['Total', '3 pallets', '', '3.02 m³', '900', '1,002'],
        ],
      },
    },
    {
      heading: 'How detailed should the contents of each package be?',
      paragraphs: [
        'Detailed enough that someone holding only the packing list could find any item without opening every package. For goods entering the United States this is not only good practice: 19 CFR 141.86 requires the invoice to state in adequate detail what merchandise each individual package contains, and the packing list is where that detail is normally kept.',
        'In practice that means one line per product per package, using the same description and the same unit as the commercial invoice line it belongs to. If a carton holds three different products, list all three under that carton. If forty identical cartons hold the same product, a single line for cartons 1 to 40, with the quantity per carton and the totals, is clear and checkable.',
        'Mixed pallets need the most care. Give the pallet its own number and marks, list the cartons on it, and state the pallet’s own gross weight, so a customs officer selecting one carton for inspection can find it on the right pallet.',
      ],
    },
    {
      heading: 'Which packing list mistakes cause delays?',
      paragraphs: [
        'Most problems are disagreements between the packing list, the invoice and what is physically in the container.',
      ],
      list: [
        'A package count that differs from the invoice or the bill of lading.',
        'Gross weights estimated rather than weighed, which the forwarder re-measures and re-bills.',
        'Contents described differently from the invoice lines, so customs cannot match them.',
        'Marks on the list that are not the marks on the cartons.',
        'A packing list prepared before the final packing, then not updated when the cartons change.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a packing list required for export?',
      a: 'Many shipments cannot move without one: forwarders need it to book and price freight, and customs and banks often ask for it. The U.S. International Trade Administration lists it among the documents of the export process.',
    },
    {
      q: 'Does a packing list show prices?',
      a: 'Normally not. Values belong on the commercial invoice. Some buyers ask for a combined invoice and packing list, but the two jobs are easier to check on separate documents.',
    },
    {
      q: 'Where should the packing list go?',
      a: 'With the shipping documents sent to the forwarder and the buyer. The ITA also suggests putting a copy inside the package or attaching one to the outside.',
    },
    {
      q: 'How do I calculate the volume on a packing list?',
      a: 'Multiply each package’s length, width and height in metres to get cubic metres, then add the packages together. A CBM calculator does the conversion from centimetres or inches.',
    },
    {
      q: 'Should the packing list match the commercial invoice?',
      a: 'Yes. The parties, references, product descriptions, quantities and package count should be identical on both, because customs and the buyer compare them line by line.',
    },
  ],
  sources: ['trade-gov-packing-list', 'trade-gov-commercial-invoice', 'us-cbp-invoice-contents'],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/cbm-calculator', '/tools/invoice-generator'],
  callout: {
    afterSection: 2,
    tool: '/tools/packing-list-generator',
    title: 'Prepare a packing list in the browser',
    text: 'The packing list generator takes packages, contents, dimensions and weights, totals them and downloads a PDF. No account, nothing stored.',
  },
  cover: {
    id: 'BNBA1h-NgdY',
    src: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866',
    width: 6048,
    height: 4024,
    alt: 'Brown cardboard cartons on white warehouse racking, the packages an export packing list itemises',
    caption: 'Brown cardboard boxes on a white metal rack',
    photographer: { name: 'CHUTTERSNAP', profile: 'https://unsplash.com/@chuttersnap' },
    page: 'https://unsplash.com/photos/brown-cardboard-boxes-on-white-metal-rack-BNBA1h-NgdY',
  },
};

export default article;
