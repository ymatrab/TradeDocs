import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "shipping invoice" 320; "freight invoice" 110.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (v2 #55: three documents called
 * "invoice" in shipping, and which one customs reads).
 */
const article: ContentArticle = {
  slug: 'shipping-invoice-vs-commercial-invoice',
  title: 'Shipping invoice vs commercial invoice: which one does customs read?',
  metaTitle: 'Shipping invoice vs commercial invoice',
  description:
    '“Shipping invoice” can mean the commercial invoice, the proforma or the carrier’s freight bill. What each document is, who issues it, and the one customs uses to assess duty.',
  lede: 'Ask three people in shipping for the “shipping invoice” and you can get three different documents. One is the invoice that travels with the goods, one is the advance invoice sent before they ship, and one is the carrier’s bill for moving them. Only one of them is the document customs uses to assess duty.',
  answer:
    '“Shipping invoice” is an informal name, not a defined document. It usually means the commercial invoice, which the seller issues to the buyer and which the importing country’s customs uses to assess duties and taxes. It can also mean the proforma sent before shipment, or the freight invoice a carrier or forwarder issues for transport.',
  keyFacts: [
    'The International Trade Administration (ITA) describes the commercial invoice as the document the buyer’s customs uses to assess import duties and taxes.',
    'The ITA describes the commercial invoice as a legal document between the exporter and the buyer.',
    'The ITA describes a proforma invoice as a quote in an invoice format, sent before shipment.',
    'Under 19 CFR 141.86, a commercial invoice for a US import must itemise charges such as freight, insurance and packing by name and amount.',
    'A freight invoice is the carrier’s or forwarder’s bill for transport; it does not replace the seller’s commercial invoice at customs.',
  ],
  definitions: [
    {
      term: 'Commercial invoice',
      meaning:
        'The seller’s invoice to the buyer for goods actually shipped, used for export and import clearance.',
    },
    {
      term: 'Proforma invoice',
      meaning:
        'An advance invoice setting out the sale before shipment, used by the buyer to pay, finance or license the import.',
    },
    {
      term: 'Freight invoice',
      meaning:
        'The carrier’s or forwarder’s bill to whoever booked the transport, for freight and related charges.',
    },
    {
      term: 'Bill of lading',
      meaning:
        'The carrier’s receipt and contract of carriage for goods shipped by sea; not an invoice.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a shipping invoice?',
      paragraphs: [
        '“Shipping invoice” is a working name, not a document defined by any customs authority. Most of the time it means the commercial invoice: the seller’s invoice that travels with an international shipment and declares what is in it and what it is worth.',
        'People also use it for two other documents. Before the goods ship, the seller may send a proforma invoice. After they ship, the carrier or forwarder sends a bill for the freight. When someone asks you for the shipping invoice, ask which of the three they mean.',
      ],
    },
    {
      heading: 'How do the three “shipping invoices” compare?',
      paragraphs: [
        'The table sets out who issues each document, who reads it and what it is for.',
      ],
      table: {
        caption: 'Three documents called a shipping invoice',
        head: ['', 'Commercial invoice', 'Proforma invoice', 'Freight invoice'],
        rows: [
          ['Issued by', 'Seller', 'Seller', 'Carrier or forwarder'],
          ['Issued to', 'Buyer', 'Buyer', 'Whoever booked the freight'],
          ['When', 'At shipment', 'Before shipment', 'After booking or carriage'],
          [
            'What it charges for',
            'The goods, plus charges agreed in the sale',
            'Nothing yet; it sets out the terms',
            'Transport and related services',
          ],
          [
            'Who relies on it',
            'Export and import customs, the buyer',
            'The buyer, its bank, licensing authorities',
            'The payer’s accounts team',
          ],
          ['Used to assess duty', 'Yes', 'Only if the final invoice is missing', 'No'],
        ],
      },
    },
    {
      heading: 'Which invoice does customs use?',
      paragraphs: [
        'Customs uses the commercial invoice. The ITA describes it as a required document for export and import clearance, and the one the buyer’s customs officials use to assess import duties and taxes. A freight invoice is never a substitute for it.',
        'Customs may still need the freight amount. In the US, 19 CFR 141.86 asks the commercial invoice to itemise all charges on the goods, including freight, insurance, commission and packing, by name and amount; 19 U.S.C. § 1401a then excludes international freight and insurance from the price actually paid. In the UK, HMRC includes transport and insurance up to the border in the customs value. Either way, the freight figure belongs on the commercial invoice, taken from the freight invoice, rather than on a separate document handed to customs.',
        'A proforma invoice can stand in at entry in some cases. In the US, 19 CFR 141.85 lets the importer file a pro forma invoice when the commercial invoice is not available at the time of entry; the commercial invoice still has to follow. The guide to the proforma vs commercial invoice covers that rule.',
      ],
    },
    {
      heading: 'What goes on a commercial invoice that a freight invoice lacks?',
      paragraphs: [
        'A commercial invoice describes the sale; a freight invoice describes the transport. Customs needs the details of the sale.',
      ],
      list: [
        'The seller and buyer, and for US imports the details of when, where and by whom the goods were sold.',
        'A detailed description of each item, with quantities in weights and measures.',
        'The price of each item in the currency of the sale, and the total.',
        'The terms of sale, such as the Incoterms® rule and named place.',
        'The country of origin of the goods.',
        'The charges included in the price, itemised where the importing country requires it.',
      ],
    },
    {
      heading: 'Who pays the freight invoice?',
      paragraphs: [
        'Whoever booked the transport, which the Incoterms® rule usually decides. Under EXW, FCA or FOB the buyer normally books and pays the main carriage, so the carrier bills the buyer. Under CFR, CIF, CPT, CIP or the delivered rules the seller books it, and the carrier bills the seller, who recovers the cost through the price on the commercial invoice.',
        'If you pay the freight and charge it on to the buyer, show it as its own line on the commercial invoice. Do not attach the carrier’s freight invoice in place of that line; the buyer’s broker needs one document with the goods and the charges together.',
      ],
    },
    {
      heading: 'How do you prepare the right invoice for a shipment?',
      paragraphs: ['A short sequence for a typical export:'],
      steps: [
        'Before shipment, send a proforma invoice if the buyer needs it to pay, open a letter of credit or apply for an import licence.',
        'When the goods are packed, issue the commercial invoice for what actually ships, matching the packing list line by line.',
        'Add the freight and insurance as separate lines if the terms of sale make them part of your price.',
        'Give the commercial invoice to your carrier or forwarder with the shipment, in the number of copies or the electronic form it asks for.',
        'File the freight invoice in your accounts; it is a cost record, not a customs document.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a shipping invoice the same as a packing list?',
      a: 'No. A packing list sets out how the goods are packed: the packages, their contents, weights and dimensions. The ITA notes it is not a substitute for the commercial invoice, and the two should agree.',
    },
    {
      q: 'Is a bill of lading an invoice?',
      a: 'No. The ITA describes the bill of lading as a contract between the owner of the goods and the carrier. It records the shipment; it does not price the goods or the freight for customs.',
    },
    {
      q: 'Can I use my normal sales invoice as a commercial invoice?',
      a: 'Often, if it carries the details the importing country requires. The ITA notes that in most countries the seller’s own format is acceptable when it includes all the pertinent information, while a few countries require a specific form.',
    },
    {
      q: 'Does a freight forwarder issue the commercial invoice?',
      a: 'No. The commercial invoice is the seller’s document for the sale. A forwarder may help prepare the shipping paperwork and will send its own freight invoice for its services.',
    },
    {
      q: 'What currency should the commercial invoice use?',
      a: 'The currency of the sale. For US imports, 19 CFR 141.86 asks for the purchase price of each item in the currency of the purchase. Keep the freight and other charges in the same currency so the totals add up.',
    },
  ],
  sources: [
    'c3-trade-gov-commercial-invoice',
    'c3-trade-gov-common-export-documents',
    'c3-trade-gov-proforma-invoice',
    'c3-cornell-19-cfr-141-86',
    'c3-usc-19-1401a',
    'c3-hmrc-delivery-costs',
    'us-cbp-proforma-invoice',
    'c3-icc-incoterms-2020',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/proforma-invoice-generator',
    '/tools/packing-list-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Make the invoice customs reads',
    text: 'Enter the parties, goods, terms of sale and charges, and download a commercial invoice ready to travel with the shipment.',
  },
  related: [
    '/guides/proforma-vs-commercial-invoice',
    '/blog/commercial-invoice-requirements',
    '/blog/how-to-fill-out-a-commercial-invoice',
    '/blog/commercial-invoice-ups-fedex-dhl',
    '/blog/freight-prepaid-vs-freight-collect',
    '/blog/commercial-invoice-and-packing-list-must-match',
  ],
  cover: {
    id: '_My6Tbu09ks',
    src: 'https://images.unsplash.com/photo-1782405183299-f177ddb3f437',
    width: 6720,
    height: 4480,
    alt: 'Brown cardboard box sealed with orange tape, ready to ship with its commercial invoice',
    caption: 'A brown cardboard box sealed with orange tape',
    photographer: { name: 'Giorgio Trovato', profile: 'https://unsplash.com/@giorgiotrovato' },
    page: 'https://unsplash.com/photos/brown-cardboard-box-with-bright-orange-tape-_My6Tbu09ks',
  },
};

export default article;
