import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "how to make a packing list" 40, KD n/a.
 * Product-led (conversion role): the steps follow the free generator's type switch
 * (src/app/(marketing)/tools/invoice-generator/generator.tsx), the packing list columns in
 * src/lib/pdf/trade-document.ts and the workspace packing panel and reconciliation
 * (src/lib/trade/packing.ts) as they exist in the code.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A.
 */
const article: ContentArticle = {
  slug: 'how-to-make-a-packing-list-from-your-invoice',
  title: 'How to make a packing list from your commercial invoice',
  metaTitle: 'How to make a packing list from your invoice',
  description:
    'Turn a finished commercial invoice into its packing list without retyping: what carries over, what you add, and how TradeDocs does it for free or in the workspace.',
  lede: 'Once the commercial invoice is right, most of the packing list is already written: the same parties, the same goods, the same quantities. What it adds is the physical side, meaning packages, weights and sizes, and what it drops is the prices. Here is how to make one from the other, first in the free generator and then in the workspace.',
  answer:
    'To make a packing list from your invoice, keep the parties, invoice reference, descriptions and quantities exactly as invoiced, remove the prices, and add the packages: how many, what each holds, net and gross weights, sizes and marks. The packing list totals must equal the invoice’s quantities, package count and weights.',
  keyFacts: [
    'The ITA says a packing list itemises the contents of each package, with weights, measurements and detailed lists of the goods.',
    'Under 19 CFR 141.86(e), a US import invoice must state in adequate detail what merchandise is in each individual package.',
    '19 CFR 141.86(i) allows required invoice information to be given on an attachment to the invoice.',
    'In the TradeDocs free generator, switching the document type keeps the parties and lines already entered while the page stays open.',
    'A TradeDocs packing list PDF prints packages, quantity and net and gross weight for each line, and no prices.',
  ],
  definitions: [
    {
      term: 'Allocation',
      meaning:
        'In the TradeDocs workspace, the quantity of an invoice line placed in a given package.',
    },
    {
      term: 'Reconciliation',
      meaning: 'Checking that every line’s packed quantity equals its invoiced quantity.',
    },
    {
      term: 'Shipping marks',
      meaning: 'The identifying text on each package, repeated on the packing list.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What carries over from the invoice to the packing list?',
      paragraphs: [
        'Everything that identifies the shipment and the goods carries over unchanged; only the prices stay behind. The table shows which parts of the invoice the packing list keeps, drops and adds.',
      ],
      table: {
        caption: 'Invoice fields on the packing list',
        head: ['Part of the invoice', 'On the packing list'],
        rows: [
          ['Seller and buyer', 'Kept, word for word, as shipper and consignee'],
          ['Invoice number', 'Kept as the reference; the packing list has its own number too'],
          ['Description of each line', 'Kept in the same words'],
          ['Quantity and unit', 'Kept, and divided across the packages'],
          ['Net and gross weights', 'Kept, and given per package where possible'],
          ['Unit price, amounts and total', 'Dropped'],
          ['Payment terms and bank details', 'Dropped'],
          ['Packages, sizes and marks', 'Added, or set out in more detail'],
        ],
      },
    },
    {
      heading: 'How do you turn an invoice into a packing list in the free generator?',
      paragraphs: [
        'The free generator is one form with a type switch, so the invoice you have just filled in can become its packing list without retyping. The values stay in the form while the page is open; nothing is stored once you close it.',
      ],
      steps: [
        'Fill in the commercial invoice, including the net weight, gross weight and number of packages on every line, and download the PDF.',
        'Keep the page open and change the type from “Commercial invoice” to “Packing list”.',
        'Change the document number to the packing list’s own number, such as PL-2026-031, so the two PDFs are not confused.',
        'Leave the parties, descriptions and quantities exactly as they are.',
        'Download the packing list PDF. It prints each line with its packages, quantity and net and gross weight, then the total quantity, packages and weights, and no prices.',
        'Lay the two PDFs side by side and check the totals agree.',
      ],
    },
    {
      heading: 'What does the packing list need that the invoice does not?',
      paragraphs: [
        'The packing list describes the boxes, not the sale. The ITA says forwarders use it to work out weights and freight costs and customs officers use it to check a specific package, so it needs the physical facts both of them look for.',
        'That means the number and type of packages, which goods are in which package, the gross weight of each package with its packing, the dimensions, and the marks that identify each package. A line-by-line packing list from the free generator gives packages and weights per line. When cartons are mixed, or anyone may need to find a single carton, list the contents package by package, as our packing list example shows.',
      ],
    },
    {
      heading: 'How does the workspace build the packing list from packages?',
      paragraphs: [
        'In a free TradeDocs account, the goods are entered once on the shipment and every document is generated from that one record. The packing panel adds the physical layer on top of the invoice lines.',
      ],
      steps: [
        'Add the goods lines to the shipment, from your product catalog or as one-off lines.',
        'In the packing panel, add each package row: its type, how many identical packages, length, width and height in centimetres, net and gross weight per package, and the marks.',
        'Allocate goods to packages: choose a package and a line and enter the quantity in that package.',
        'Read the reconciliation. The panel lists any line whose packed quantity differs from its invoiced quantity, and says when every line is fully allocated.',
        'Generate the commercial invoice and the packing list from the same shipment revision, and download them one by one or as a set.',
      ],
    },
    {
      heading: 'What does the workspace packing list print?',
      paragraphs: [
        'It prints the same line table as the free generator, and more once packages are described:',
      ],
      list: [
        'With packages described, the packing list PDF adds a table of the packages: their dimensions, net and gross weights, marks and contents.',
        'Its totals then come from the packages, including the total volume in cubic metres.',
        'Packing is optional: a shipment without packages still produces a line-by-line packing list.',
        'The set download holds the current documents with a manifest of their checksums; out-of-date ones stay out of it.',
      ],
    },
    {
      heading: 'What should you check before you send both documents?',
      paragraphs: [
        'Check the packing list against the invoice and against the goods. Our post on why the commercial invoice and packing list must match lists every field that has to agree; these are the quickest checks:',
      ],
      list: [
        'Total quantity per line equals the invoiced quantity per line.',
        'Total packages equals the number of cartons or pallets handed to the carrier.',
        'Total net and gross weights equal the invoice and the weighed shipment.',
        'Descriptions are word for word the same as on the invoice.',
        'The marks on the list are the marks on the boxes.',
      ],
    },
    {
      heading: 'Why make the packing list from the invoice rather than separately?',
      paragraphs: [
        'Because two documents typed separately drift apart. A quantity corrected on one and not the other, or a description shortened on the packing list, leaves customs, the forwarder and the buyer with two accounts of one shipment. For a US entry, where 19 CFR 141.86 treats the contents of each package as invoice information that may sit on an attachment, that disagreement is on the invoice itself.',
        'Making one document from the other means a correction happens once. In the free generator, correct the line and download both PDFs again. In the workspace, editing the shipment marks documents generated earlier as out of date, so you can see which ones to generate again.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can a packing list show prices?',
      a: 'It can, but it usually does not. Values belong on the commercial invoice, and the TradeDocs packing list leaves them off.',
    },
    {
      q: 'Does the packing list need the invoice number on it?',
      a: 'It should carry it as a reference so anyone can tell which invoice it belongs to. It also has its own number.',
    },
    {
      q: 'Can I make a delivery note from the same form?',
      a: 'Yes. The free generator also switches to a delivery note, which prints the descriptions, HS codes and quantities without prices or weights.',
    },
    {
      q: 'Does the free generator save my invoice so I can make the packing list later?',
      a: 'No. Nothing is stored, so switch the type before you close the page. An account saves the shipment so you can generate the packing list at any time.',
    },
    {
      q: 'What if the packing changes after the invoice is issued?',
      a: 'Correct both documents. If cartons were repacked but the quantities did not change, the invoice may stay the same while the packing list is reissued; if a quantity changed, the invoice changes too, and the two must agree again before the goods leave.',
    },
  ],
  sources: ['a2-trade-gov-packing-list', 'a2-cornell-19-cfr-141-86'],
  primaryTool: '/tools/packing-list-generator',
  tools: [
    '/tools/packing-list-generator',
    '/tools/invoice-generator',
    '/tools/delivery-note-generator',
    '/tools/cbm-calculator',
  ],
  callout: {
    afterSection: 1,
    tool: '/tools/packing-list-generator',
    title: 'Open the generator on the packing list',
    text: 'The packing list generator is the same form as the invoice generator, opened on the packing list. Enter the lines once and switch the type to get both PDFs.',
  },
  related: [
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/blog/packing-list-example',
    '/blog/how-to-fill-out-a-commercial-invoice',
    '/blog/packing-list-for-shipping',
    '/guides/gross-weight-vs-net-weight',
    '/blog/shipping-marks',
  ],
  cover: {
    id: 'gthSas4oYC0',
    src: 'https://images.unsplash.com/photo-1700165644892-3dd6b67b25bc',
    width: 6720,
    height: 4480,
    alt: 'Open brown cardboard boxes waiting to be packed, before their contents go on a packing list',
    caption: 'Open brown cardboard boxes',
    photographer: { name: 'Luke Heibert', profile: 'https://unsplash.com/@lukeheibert' },
    page: 'https://unsplash.com/photos/a-lot-of-brown-boxes-that-are-open-gthSas4oYC0',
  },
};

export default article;
