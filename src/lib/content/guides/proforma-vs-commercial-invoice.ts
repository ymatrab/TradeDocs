import { BYLINE, type ContentArticle } from '@/lib/content/article';

const CONTENT_ROUND = '2026-10-05';
const GEO_ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-05): "proforma vs commercial invoice" 720.
 */
const article: ContentArticle = {
  slug: 'proforma-vs-commercial-invoice',
  title: 'Proforma invoice vs commercial invoice: what each one is for',
  metaTitle: 'Proforma vs commercial invoice: the difference',
  description:
    'A proforma invoice is a quotation in invoice form, issued before the sale. A commercial invoice bills goods sold and is what customs values them from. What goes on each, and how they relate.',
  lede: 'They look alike and carry many of the same fields, which is exactly why they get confused. They are issued at different moments, for different readers, and only one of them is the basis customs works from.',
  answer:
    'A proforma invoice is a quotation in the form of an invoice, sent before the sale is final so the buyer can arrange payment, a letter of credit or an import licence. A commercial invoice is issued for goods actually sold and shipped; it requests payment, and customs in the importing country assesses duties and taxes from it.',
  keyFacts: [
    'A proforma invoice is a quotation in invoice form, issued before the sale is final.',
    'A commercial invoice bills goods actually sold and shipped.',
    'Customs in the importing country assesses duties and taxes from the commercial invoice.',
    'For U.S. imports, the contents of a commercial invoice are set out in 19 CFR 141.86.',
    'Under 19 CFR 141.85 a U.S. importer may file a pro forma invoice when the commercial invoice is missing at entry.',
  ],
  definitions: [
    {
      term: 'Proforma invoice',
      meaning:
        'A formal quotation laid out as the final invoice will be, used to arrange payment or licences.',
    },
    {
      term: 'Commercial invoice',
      meaning: 'The seller’s bill for goods supplied, and the document customs values them from.',
    },
    {
      term: 'Letter of credit',
      meaning:
        'A bank’s undertaking to pay the seller against documents that match the credit’s terms.',
    },
  ],
  published: CONTENT_ROUND,
  updated: GEO_ROUND,
  reviewed: GEO_ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a proforma invoice for?',
      paragraphs: [
        'The U.S. International Trade Administration describes a proforma invoice as a quote in an invoice format. It tells a prospective buyer exactly what it would be buying, at what price and on what terms, laid out the way the final invoice will be.',
        'Buyers ask for one because other parties need to see the deal before it happens. The ITA lists the common reasons: to apply for an import licence, to contract for a pre-shipment inspection, to open a letter of credit, and to arrange the transfer of currency. A bank or a licensing authority wants a document that looks like the invoice it will later see, which a plain price list is not.',
        'A proforma does not request payment for goods delivered, because nothing has been delivered yet. If the terms change before shipment, a revised proforma is issued; the commercial invoice comes later.',
      ],
      list: [
        'Seller and buyer, with names and addresses, and the buyer’s reference number',
        'The goods quoted, with unit and total prices, weights and dimensions',
        'Any discounts, the terms of sale with the Incoterms® rule and its delivery point, and the payment terms',
        'The estimated shipping date and the date the quotation is valid until',
      ],
    },
    {
      heading: 'What is a commercial invoice for?',
      paragraphs: [
        'The commercial invoice is issued when the goods are sold and shipped. It is the seller’s bill to the buyer, and it is also a customs document: the ITA calls it a required document for export and import clearance, and the one customs officials in the buyer’s country use to assess import duties and taxes.',
        'It carries the information from the proforma, updated to what was actually shipped, plus what customs needs: the country of origin, a precise description of each line, and usually the HS code of each product, which speeds clearance. Some importing countries specify what must appear. For goods entering the United States, the required contents are set out in 19 CFR 141.86, which include the port of entry, who sold the goods to whom and when, a detailed description with the marks and numbers of the packages, the quantities, the purchase price of each item in the currency of the purchase, the charges on the goods itemised by name and amount, and the country of origin.',
      ],
    },
    {
      heading: 'How do they differ, side by side?',
      paragraphs: [
        'Most of the fields overlap. The differences are in when the document is issued, what it commits the parties to and who relies on it.',
      ],
      table: {
        caption: 'Proforma invoice and commercial invoice compared',
        head: ['', 'Proforma invoice', 'Commercial invoice'],
        rows: [
          ['Issued', 'Before the sale is final', 'When the goods are sold and shipped'],
          ['Purpose', 'A formal quotation', 'A request for payment for goods supplied'],
          [
            'Read by',
            'Buyer, its bank, licensing or inspection bodies',
            'Buyer and customs authorities',
          ],
          ['Quantities and prices', 'As quoted', 'As actually shipped'],
          ['Validity date', 'Usually stated', 'Not applicable'],
          ['Used to value goods at import', 'Not normally', 'Yes, it is the basis'],
        ],
      },
    },
    {
      heading: 'Does customs ever accept a proforma invoice?',
      paragraphs: [
        'There is one situation where a proforma invoice does reach customs, and it means something narrower. Under U.S. rules, an importer who does not yet have the seller’s commercial invoice when the goods are entered can file a pro forma invoice instead: a statement of value in the form set out in 19 CFR 141.85, in which the importer declares the prices or values, the basis for them and the country of origin, and undertakes to file the commercial invoice once it arrives.',
        'That is the importer’s stopgap declaration, not the seller’s sales quotation. Other countries have their own provisions for missing invoices. Either way, it is an exception for a document that is late, not a substitute you choose.',
      ],
    },
    {
      heading: 'How do I keep the two invoices consistent?',
      paragraphs: [
        'Trouble usually starts when the shipment differs from the quotation and only one document is updated. If a letter of credit was opened against a proforma, the commercial invoice presented to the bank has to match the credit’s terms, so a change in quantity or price may need the credit amended first. And the commercial invoice, the packing list and the transport document have to agree with each other, because customs and the receiver compare them.',
        'The simplest protection is to produce all of them from one set of figures: the same parties, the same lines, the same Incoterms® rule and place.',
      ],
      steps: [
        'Issue the proforma with its own reference number and a validity date.',
        'If the quantities or prices change before shipment, issue a revised proforma and tell the buyer’s bank if a credit depends on it.',
        'Prepare the commercial invoice and packing list from the same shipment figures, citing the proforma number as the reference.',
        'Check the totals, the Incoterms® rule and the named place agree across every document before they leave.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a proforma invoice a legal document?',
      a: 'It is a formal quotation. Once the buyer accepts it, it can form part of the sales contract, and banks and licensing authorities rely on it. It is not a request for payment for goods delivered, and it is not normally the document customs values goods from.',
    },
    {
      q: 'Can I use a proforma invoice for customs clearance?',
      a: 'Normally customs needs the commercial invoice. Some countries accept a substitute when the commercial invoice is missing at entry; in the United States that is the importer’s pro forma invoice under 19 CFR 141.85, with the commercial invoice to follow.',
    },
    {
      q: 'Does a proforma invoice need an invoice number?',
      a: 'It should have its own reference so the buyer, its bank and you can refer to the same version. Many sellers number proformas in a separate series from commercial invoices so the two are never confused.',
    },
    {
      q: 'What happens if the commercial invoice differs from the proforma?',
      a: 'The commercial invoice should state what was actually shipped. If payment depends on the proforma, as with a letter of credit opened against it, agree the change with the buyer and its bank before shipping so the documents still match the credit.',
    },
  ],
  sources: [
    'trade-gov-proforma-invoice',
    'trade-gov-commercial-invoice',
    'us-cbp-invoice-contents',
    'us-cbp-proforma-invoice',
  ],
  primaryTool: '/tools/proforma-invoice-generator',
  callout: {
    afterSection: 1,
    tool: '/tools/invoice-generator',
    title: 'Turn the quotation into the invoice',
    text: 'The commercial invoice generator lays out the fields customs reads, line by line, and downloads a PDF without an account.',
  },
  tools: [
    '/tools/proforma-invoice-generator',
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
  ],
  cover: {
    id: 'spScdgWY-_c',
    src: 'https://images.unsplash.com/photo-1631651693480-97f1132e333d',
    width: 3576,
    height: 2384,
    alt: 'Paper documents and a pen on a wooden table, ready for an invoice to be filled in',
    caption: 'Papers and a pen on a wooden table',
    photographer: { name: '2H Media', profile: 'https://unsplash.com/@2hmedia' },
    page: 'https://unsplash.com/photos/spScdgWY-_c',
  },
};

export default article;
