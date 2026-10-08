import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, Google US, 2026-10-08, file 12): "packing list vs bill of lading" 30;
 * "bill of lading vs packing list" 30; "packing slip vs bill of lading" 40.
 * Plan: docs/research/content-plan-v4-2026-10-08.md, wave E, group 1.
 * Packing list from ITA and 19 CFR 141.86; bill of lading from ITA, the UCC, 49 U.S.C. 80103
 * and the Hague-Visby Rules; manifest data from 19 CFR 4.7a; VGM from IMO (SOLAS VI/2).
 * The shipment in the worked example is invented.
 */
const article: ContentArticle = {
  slug: 'packing-list-vs-bill-of-lading',
  title: 'Packing list vs bill of lading: who writes each, and what must match',
  metaTitle: 'Packing list vs bill of lading: the difference',
  description:
    'You write the packing list; the carrier issues the bill of lading. What each document does, who relies on it, how the bill is built from your packing list, and the figures that must agree.',
  lede: 'Both documents list your packages and their weights, so they can look like two copies of the same thing. They are not. One is your own description of what you packed; the other is the carrier’s receipt and contract, and much of it is copied from yours.',
  answer:
    'A packing list is the exporter’s own document itemising what is in each package, with weights and measurements. A bill of lading is issued by the carrier as its receipt for the goods and the contract of carriage, and can be a document of title. The bill is largely typed from your packing list, so they must agree.',
  keyFacts: [
    'The ITA describes the packing list as itemising each package’s contents with weights and measurements, used by forwarders for weights and freight costs and by customs to check packages.',
    'The ITA describes the bill of lading as the contract between the owner of the goods and the carrier.',
    'Under the Uniform Commercial Code (section 1-201), a bill of lading evidences receipt of goods for shipment, and bills of lading are documents of title.',
    'Under the Hague-Visby Rules (Article III), the carrier issues on the shipper’s demand a bill showing the marks, the number of packages or weight and the apparent condition of the goods.',
    'Under 19 CFR 4.7a, the US vessel cargo declaration gives the quantity of the lowest external packaging unit; containers and pallets are not acceptable quantities.',
  ],
  definitions: [
    {
      term: 'Packing list',
      meaning:
        'The exporter’s itemised list of what is in each package, with marks, dimensions, net and gross weights.',
    },
    {
      term: 'Bill of lading',
      meaning:
        'The carrier’s receipt for the goods and evidence of the contract of carriage; in negotiable form, also a document of title.',
    },
    {
      term: 'Shipping instructions',
      meaning:
        'The details the shipper sends the carrier or forwarder so it can prepare the bill of lading.',
    },
    {
      term: 'Packing slip',
      meaning:
        'A simple list of the items in one parcel, put inside or on it for the recipient; less detailed than an export packing list.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between a packing list and a bill of lading?',
      paragraphs: [
        'Who issues it and what it proves. You, the exporter, write the packing list to describe what you packed. The carrier, or an NVOCC acting as carrier, issues the bill of lading to confirm what it received and on what terms it will carry it.',
        'The packing list is information. The bill of lading has legal effect: it evidences the contract of carriage and, when negotiable, controls who can collect the goods.',
      ],
      table: {
        caption: 'Packing list and bill of lading compared',
        head: ['', 'Packing list', 'Bill of lading'],
        rows: [
          ['Issued by', 'The exporter or seller', 'The carrier or an NVOCC'],
          ['What it is', 'A description of each package and its contents', 'A receipt for the goods and evidence of the contract of carriage'],
          ['Legal effect', 'None on its own; it supports the other documents', 'Contract evidence; a document of title when negotiable'],
          ['Level of detail', 'Item by item, package by package', 'Totals: marks, package count, weight, a description'],
          ['Prices shown', 'No', 'No (freight terms may be shown)'],
          ['Used by', 'Forwarder, carrier, customs, the buyer’s warehouse', 'Carrier, customs, the buyer, banks'],
          ['Mode', 'Any', 'Sea; air cargo uses an air waybill instead'],
        ],
      },
    },
    {
      heading: 'What does a packing list do?',
      paragraphs: [
        'It shows what is in each package. The ITA describes a packing list as itemising the contents of each package, with weights, measurements and detailed lists of the goods, and notes that freight forwarders use it to determine weights and freight costs while customs officials use it to check a specific package.',
        'US import rules lean on the same detail. Under 19 CFR 141.86, the invoice must state what merchandise is in each individual package, and a packing list is the usual way to give that breakdown when the invoice does not.',
      ],
    },
    {
      heading: 'What does a bill of lading do?',
      paragraphs: [
        'It records that the carrier received the goods and the terms of carriage. Under the UCC, a bill of lading evidences the receipt of goods for shipment and is a document of title; under 49 U.S.C. 80103, an order bill is negotiable and a straight bill is nonnegotiable.',
        'The carrier describes the goods from what you declare. The Hague-Visby Rules require the carrier, on your demand, to issue a bill showing the marks, the number of packages or the weight and the apparent order and condition of the goods. The carrier does not open your cartons to count the items inside; that detail stays on your packing list.',
      ],
    },
    {
      heading: 'How does the packing list become the bill of lading?',
      paragraphs: [
        'Through your shipping instructions. The figures the carrier prints are the ones you send it, so the packing list is effectively the first draft of the bill’s cargo section.',
      ],
      steps: [
        'Finish the packing list: every package with its marks, contents, dimensions, net and gross weight.',
        'Total the packages and the gross weight, and work out the volume.',
        'Send the carrier or forwarder shipping instructions with the parties, marks, package count, gross weight, volume and a plain description of the goods.',
        'For a full container, add the container and seal numbers and the verified gross mass, which SOLAS makes the shipper named on the bill of lading responsible for.',
        'Check the draft bill of lading against the packing list and commercial invoice, line by line, before you approve it.',
      ],
    },
    {
      heading: 'What must match between the two documents?',
      paragraphs: [
        'The figures and words that describe the cargo. US customs compares them: under 19 CFR 4.7a, the vessel cargo declaration gives the quantity of the lowest external packaging unit and a precise description, and generic descriptions are not acceptable. A bill that says “1 container” or “general cargo” when your packing list shows 40 cartons of named goods is the kind of mismatch that draws questions.',
      ],
      table: {
        caption: 'Worked example with invented goods and figures',
        head: ['Field', 'Packing list', 'Bill of lading', 'Agrees?'],
        rows: [
          ['Marks', 'BUYER A / LONDON / 1–40 (invented)', 'BUYER A / LONDON / 1–40', 'Yes'],
          ['Number of packages', '40 cartons', '40 cartons', 'Yes'],
          ['Gross weight', '812.0 kg', '812.0 kg', 'Yes'],
          ['Volume', '6.4 m³', '6.4 m³', 'Yes'],
          ['Description', 'Ceramic tableware, 40 cartons (items listed per carton)', 'Ceramic tableware', 'Yes, in summary'],
          ['Net weight per carton', 'Listed for each carton', 'Not shown', 'Not needed on the bill'],
        ],
      },
    },
    {
      heading: 'Is a packing slip the same as a bill of lading?',
      paragraphs: [
        'No. A packing slip is a short list of the items in a parcel, put in the box for the person who opens it. A bill of lading is the carrier’s document for the whole consignment, and it is issued by the carrier, not packed with the goods.',
        'For exports, a packing slip does not replace a packing list either. Forwarders and customs need the weights, measurements and package-by-package breakdown the ITA describes, which a packing slip usually lacks.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can a packing list replace a bill of lading?',
      a: 'No. Only the carrier can issue the bill of lading, because it is the carrier’s receipt and contract. The packing list supports it.',
    },
    {
      q: 'Does the bill of lading list every item in the shipment?',
      a: 'Usually not. It shows the marks, package count, weight and a description of the goods. The item-by-item detail belongs on the packing list.',
    },
    {
      q: 'Which comes first, the packing list or the bill of lading?',
      a: 'The packing list. You write it when the goods are packed, and the carrier prepares the bill of lading from your shipping instructions after it receives the goods.',
    },
    {
      q: 'What happens if the packing list and the bill of lading disagree?',
      a: 'Expect questions from customs or the buyer’s bank. Correct the error at the draft stage; once a bill of lading is issued, changing it goes through the carrier.',
    },
    {
      q: 'Is the packing list sent with the bill of lading?',
      a: 'Often, yes. Both usually travel with the commercial invoice to the buyer or the bank, and the packing list also goes to the forwarder.',
    },
  ],
  sources: [
    'trade-gov-packing-list',
    'a2-cornell-19-cfr-141-86',
    'trade-gov-export-documents',
    'w4-cornell-ucc-1-201',
    'w4-cornell-49-usc-80103',
    'b5-hague-visby-art-3',
    'e1-cfr-19-4-7a',
    'w4-imo-solas-vgm',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/invoice-generator', '/tools/cbm-calculator'],
  callout: {
    afterSection: 3,
    tool: '/tools/packing-list-generator',
    title: 'Write the packing list the bill will be typed from',
    text: 'Enter each package with its marks, dimensions and weights, and download a packing list PDF whose totals you can copy straight into your shipping instructions.',
  },
  related: [
    '/guides/what-is-a-bill-of-lading',
    '/blog/packing-list-for-shipping',
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/blog/bill-of-lading-number',
    '/blog/shipping-marks',
    '/blog/delivery-note-vs-packing-list',
  ],
  cover: {
    id: 'YqPN_7HP5bs',
    src: 'https://images.unsplash.com/photo-1617909517433-b38d5b21629b',
    width: 5760,
    height: 3840,
    alt: 'Brown cardboard boxes packed and closed on a table, the cartons a packing list describes',
    caption: 'Cardboard boxes packed and ready to ship',
    photographer: { name: 'Sticker Mule', profile: 'https://unsplash.com/@stickermule' },
    page: 'https://unsplash.com/photos/brown-cardboard-boxes-on-yellow-table-YqPN_7HP5bs',
  },
};

export default article;
