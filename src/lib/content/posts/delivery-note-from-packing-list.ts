import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "delivery note vs invoice" 50, KD n/a; conversion
 * role for the delivery note generator and the workspace. Product-led: the delivery note PDF
 * prints description, HS code and quantity per line and only a total quantity
 * (columnsFor/totalsFor in src/lib/pdf/trade-document.ts); with packages described in the
 * workspace it adds the packing table (dimensions, volume, row weights, marks, contents), as
 * the packing list does; payment terms and bank details print on invoices only; the free
 * generator hides the invoice-only fields for a delivery note and suggests DN-2026-001.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 */
const article: ContentArticle = {
  slug: 'delivery-note-from-packing-list',
  title: 'Delivery note vs invoice, and how to make one from your packing list',
  metaTitle: 'Delivery note vs invoice: make one from a list',
  description:
    'A delivery note lists what is handed over, without prices; an invoice bills it. How the two differ, and how to make the delivery note from your packing list in TradeDocs.',
  lede: 'A delivery note, an invoice and a packing list all describe the same goods, which is why they are so often confused and so often retyped. Each answers a different question for a different reader. This post sets the delivery note against the invoice, then shows how to make it from the packing list you already have, without typing the lines again.',
  answer:
    'A delivery note lists the goods handed over, with quantities and no prices, so the receiver can check the delivery. An invoice states what the buyer owes for those goods, with prices, totals and payment terms. Make the delivery note from the packing list or invoice so the descriptions and quantities are identical.',
  keyFacts: [
    'A delivery note carries no prices; the commercial invoice carries the prices and is the document the buyer’s customs uses to assess duties and taxes.',
    'The ITA says a packing list itemises the contents of each package, with weights, measurements and detailed lists of the goods.',
    'HMRC’s Notice 703 lists packing lists, advice notes and evidence of the receipt of the goods abroad among records that support a zero-rated export.',
    'A TradeDocs delivery note PDF prints the description, HS code and quantity of each line, and a total quantity.',
    'In the TradeDocs workspace, a delivery note from a shipment with described packages also prints each package’s marks and contents.',
  ],
  definitions: [
    {
      term: 'Delivery note',
      meaning:
        'A document that goes with the goods and lists what is being delivered, so the receiver can check it on arrival.',
    },
    {
      term: 'Commercial invoice',
      meaning: 'The seller’s bill for the goods, with prices, used by customs to value them.',
    },
    {
      term: 'Packing list',
      meaning: 'A list of each package with its contents, weights and dimensions.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between a delivery note and an invoice?',
      paragraphs: [
        'A delivery note records what changed hands; an invoice records what is owed for it. The delivery note travels with the goods and is checked, and often signed, by whoever receives them. The invoice goes to the buyer’s accounts team and, on an export, to customs: the ITA says the commercial invoice is the document the buyer’s customs officials use to assess import duties and taxes.',
      ],
      table: {
        caption: 'Delivery note, commercial invoice and packing list compared',
        head: ['', 'Delivery note', 'Commercial invoice', 'Packing list'],
        rows: [
          [
            'Main reader',
            'The receiver at the door',
            'The buyer and customs',
            'The forwarder and customs',
          ],
          ['Prices and totals', 'No', 'Yes', 'No'],
          ['Descriptions and quantities', 'Yes', 'Yes', 'Yes'],
          ['Weights and dimensions', 'Usually not', 'Total weights, often', 'Yes, per package'],
          ['Payment terms and bank details', 'No', 'Yes', 'No'],
          ['Signed on receipt', 'Often', 'No', 'No'],
        ],
      },
    },
    {
      heading: 'Why make the delivery note from the packing list?',
      paragraphs: [
        'Because the packing list already holds everything the delivery note needs, in the form the receiver will check against: each line’s description and quantity, and which package it is in. The ITA describes the packing list as itemising the contents of each package, and says customs officials use it to check a specific package or carton. A delivery note built from it shows the receiver the same lines in the same words.',
        'Typed separately, the two drift. A carton count corrected on the packing list and not on the delivery note leaves the receiver signing for a different shipment from the one the forwarder loaded. Taking the delivery note from the same lines, and changing nothing but the document type and number, removes that risk.',
      ],
    },
    {
      heading: 'How do you make a delivery note from a packing list in the free generator?',
      paragraphs: [
        'The free TradeDocs generator is one form for the commercial invoice, proforma, packing list and delivery note. The values stay in the form while the page is open, so you can download one document, switch the type and download the next.',
      ],
      steps: [
        'Fill in the packing list: the shipper and receiver, the Incoterms® rule and named place, and each line with its description, quantity, unit, weights and packages. Download it.',
        'Keep the page open and change the type from “Packing list” to “Delivery note”.',
        'Replace the document number with the delivery note’s own number; the field suggests the DN-2026-001 pattern.',
        'Set the document date to the day the goods are handed over, or leave it blank for today.',
        'Leave the parties, descriptions and quantities exactly as they are, and download the delivery note PDF.',
        'Print a copy to go with the goods for the receiver to check and sign, and keep the signed copy.',
      ],
    },
    {
      heading: 'What does a TradeDocs delivery note show?',
      paragraphs: [
        'The PDF is titled “Delivery Note” and carries the number, issue date and both parties, with the Incoterms® 2020 rule, ports and country of origin in the terms row. The line table has three columns: the description of goods, the HS code and the quantity with its unit, followed by the total quantity. There are no prices, because the unit price field on the form is used only when the type is an invoice.',
        'In a free TradeDocs workspace, the delivery note comes from the same shipment as the invoice and packing list. If you have described the packages in the packing panel, it adds a packing table: each package with its count, dimensions, volume, net and gross weight, its marks and the goods packed in it. That gives the receiver what they need to check carton by carton. The shipment’s marks and numbers and any document notes from your settings print on it too, while payment terms and bank details stay on the invoices.',
      ],
    },
    {
      heading: 'Do you need a delivery note for an export?',
      paragraphs: [
        'Not as a customs document; customs work from the commercial invoice and the export declaration, and carriers from their own transport document, such as a bill of lading, an air waybill or a CMR consignment note. A delivery note is a commercial record between you, the carrier and the receiver, and many buyers ask for one so their warehouse can book the goods in.',
        'It can also help your own records. For UK exporters, HMRC’s VAT Notice 703 lists the records an exporter is likely to hold in support of a zero-rated export, among them the customer’s order, the export sales invoice, advice notes, packing lists and evidence of the receipt of the goods abroad. A delivery note signed by the receiver is one way to keep the last of these; check the notice for what HMRC treats as proof of export itself.',
      ],
    },
    {
      heading: 'What should the receiver check against the delivery note?',
      paragraphs: [
        'The receiver checks that what arrived matches what the note says was sent, before signing. Give them a note that makes this easy:',
      ],
      list: [
        'The number of packages delivered against the packages on the note.',
        'The marks on each carton or pallet against the marks listed.',
        'The description and quantity of each line against what is unpacked.',
        'Visible damage to packaging, noted beside the signature rather than after it.',
        'The delivery note number, written on any claim or query.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a delivery note the same as an invoice?',
      a: 'No. A delivery note confirms what was delivered and carries no prices; an invoice states the amount owed. Many shippers send both, prepared from the same lines.',
    },
    {
      q: 'Can a delivery note replace the packing list?',
      a: 'Not for an export. The forwarder and customs rely on the packing list’s weights and package details; the delivery note is a shorter copy for the receiver.',
    },
    {
      q: 'Does the delivery note need the invoice number on it?',
      a: 'It helps. Quoting the invoice or order reference lets the receiver’s accounts team match the delivery to the bill.',
    },
    {
      q: 'Who signs the delivery note?',
      a: 'Usually the person who receives the goods, to confirm what arrived. Some shippers also have the driver sign when the goods are collected.',
    },
    {
      q: 'Is anything I type in the free generator saved?',
      a: 'No. The details are sent once to render the PDF and nothing is stored. A free account saves the shipment so you can generate the delivery note again at any time.',
    },
  ],
  sources: [
    'a2-trade-gov-packing-list',
    'a2-trade-gov-commercial-invoice',
    'a3-hmrc-vat-notice-703',
    'trade-gov-export-documents',
  ],
  primaryTool: '/tools/delivery-note-generator',
  tools: [
    '/tools/delivery-note-generator',
    '/tools/packing-list-generator',
    '/tools/invoice-generator',
  ],
  callout: {
    afterSection: 1,
    tool: '/tools/delivery-note-generator',
    title: 'Open the delivery note generator',
    text: 'The same form as the packing list, opened on the delivery note. Enter the lines once and download both PDFs without an account.',
  },
  related: [
    '/blog/delivery-note-vs-packing-list',
    '/blog/how-to-make-a-packing-list-from-your-invoice',
    '/blog/packing-list-example',
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/blog/shipping-marks',
    '/guides/cmr-note',
  ],
  cover: {
    id: 'Jv1swO4FghI',
    src: 'https://images.unsplash.com/photo-1707407087163-7ab35bca9ffc',
    width: 5000,
    height: 3774,
    alt: 'Boxes stacked in the back of a delivery truck, waiting to be checked off against a delivery note',
    caption: 'Boxes loaded in the back of a truck',
    photographer: {
      name: 'Infinity Movers Cape Coral',
      profile: 'https://unsplash.com/@infinitymoverscapecoral',
    },
    page: 'https://unsplash.com/photos/a-truck-with-a-bunch-of-boxes-in-the-back-of-it-Jv1swO4FghI',
  },
};

export default article;
