import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "proforma invoice vs quotation" 70, KD 6.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (v2 #32: quote first, proforma when
 * the buyer commits; what changes on the document).
 */
const article: ContentArticle = {
  slug: 'proforma-invoice-vs-quotation',
  title: 'Proforma invoice vs quotation: which one do you send, and when?',
  metaTitle: 'Proforma invoice vs quotation: the difference',
  description:
    'A quotation prices the goods while the buyer decides; a proforma invoice sets out the agreed sale in invoice form before shipment. What each one contains and when to switch.',
  lede: 'A buyer asks for a price and you send a quotation. A week later they ask for a proforma invoice. Both show the goods and a price, so it can look like the same document twice. The proforma does a different job: it gives the buyer what it needs to pay, open a letter of credit or apply for an import licence.',
  answer:
    'A quotation is the seller’s price offer while the buyer is still deciding. A proforma invoice is a quote in invoice format, sent when the buyer is ready to commit, with the full shipment details: parties, goods, prices, Incoterms® rule, payment terms, estimated shipping date and validity. It is not a demand for payment or a tax invoice.',
  keyFacts: [
    'The International Trade Administration (ITA) describes a proforma invoice as a quote in an invoice format.',
    'The ITA lists the proforma’s uses as applying for an import licence, opening a letter of credit, arranging pre-shipment inspection or transferring hard currency.',
    'The ITA describes the proforma as a negotiating tool before shipment that later becomes the final commercial invoice.',
    'HMRC states that a pro-forma invoice should be marked “this is not a VAT invoice” and cannot be used to reclaim input tax.',
    'There is no official form for a quotation; its content is set by the seller and the buyer’s request.',
  ],
  definitions: [
    {
      term: 'Quotation',
      meaning: 'A seller’s statement of price and terms for goods the buyer is considering.',
    },
    {
      term: 'Proforma invoice',
      meaning:
        'An advance invoice describing a sale before shipment, used by the buyer to pay, finance or license the import.',
    },
    {
      term: 'Commercial invoice',
      meaning:
        'The final invoice for goods actually shipped, which the importing country’s customs uses to assess duties and taxes.',
    },
    {
      term: 'Validity date',
      meaning: 'The date until which the quoted prices and terms stand.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between a proforma invoice and a quotation?',
      paragraphs: [
        'The quotation comes first and answers “how much?”; the proforma comes when the buyer is ready to buy and answers “what exactly will you ship, on what terms?”. Both are offers, not demands for payment.',
        'A quotation can be short: the products, unit prices, the currency and how long the price holds. It helps the buyer compare suppliers. A proforma invoice, in the ITA’s words a quote in an invoice format, carries the detail of the shipment so the buyer can act on it: pay in advance, open a letter of credit, apply for an import licence or show its own authorities what is coming.',
      ],
    },
    {
      heading: 'How do a quotation and a proforma invoice compare?',
      paragraphs: [
        'The table shows what usually changes when a quotation becomes a proforma. The proforma column follows the items the ITA lists for a proforma invoice.',
      ],
      table: {
        caption: 'Quotation and proforma invoice compared',
        head: ['', 'Quotation', 'Proforma invoice'],
        rows: [
          ['When it is sent', 'While the buyer compares offers', 'When the buyer is ready to commit'],
          ['Format', 'Any: email, price list, PDF', 'Laid out like an invoice'],
          [
            'Parties',
            'Often the seller and a contact name',
            'Seller and buyer names and addresses, buyer’s reference',
          ],
          [
            'Goods',
            'Products and unit prices',
            'Quantities, unit and extended prices, weights and dimensions, discounts',
          ],
          [
            'Delivery terms',
            'Sometimes',
            'Incoterms® rule with the named place, estimated shipping date',
          ],
          ['Payment terms', 'Sometimes', 'Stated in full'],
          ['Validity', 'Usually stated', 'Validity date stated'],
          [
            'Who relies on it',
            'The buyer, to decide',
            'The buyer, its bank, and import or currency authorities',
          ],
        ],
      },
    },
    {
      heading: 'When should you send a proforma instead of a quotation?',
      paragraphs: [
        'Send a proforma when the buyer has said yes and needs a document to act on. Common triggers are a request to pay in advance by bank transfer, a letter of credit application, an import licence or permit application in the buyer’s country, and a pre-shipment inspection booking. The ITA names each of these as a use of the proforma.',
        'Until then a quotation is usually enough. Sending a full proforma for every enquiry costs time and can confuse the buyer’s accounts team, which may treat an invoice-shaped document as something to pay.',
      ],
    },
    {
      heading: 'What changes when you turn a quotation into a proforma?',
      paragraphs: [
        'Start from the accepted quotation and add what the buyer’s bank and authorities will check. A short sequence:',
      ],
      steps: [
        'Confirm the products, quantities and prices the buyer accepted, and remove options it did not choose.',
        'Add the full names and addresses of both parties and the buyer’s order or reference number.',
        'Add weights and dimensions for each line, so the buyer can arrange freight and estimate costs.',
        'State the Incoterms® rule with its named place and version, for example “FCA Leeds, seller’s warehouse, Incoterms® 2020” (an invented example).',
        'State the payment terms, the estimated shipping date and the validity date.',
        'Title it “Proforma invoice”, give it its own number, and in the UK mark it “this is not a VAT invoice”.',
      ],
    },
    {
      heading: 'Is a proforma invoice binding?',
      paragraphs: [
        'It depends on its wording and on the contract law that applies to the sale; neither the ITA nor HMRC guidance settles the point. In practice a proforma that the buyer accepts, or pays against, is treated as the agreed terms, so check it as carefully as a contract.',
        'The ITA advises that the proforma informs both the buyer and the import authorities about the future shipment, and that it should not be changed without the buyer’s consent. If the price, quantity or delivery date moves, issue a revised proforma with a new number or revision mark rather than editing the old one.',
        'For tax, HMRC is clear in VAT Notice 700: a pro-forma invoice is not a VAT invoice, cannot be used to reclaim input tax, and a proper VAT invoice must be issued once the goods are supplied or paid for. Other countries have their own rules, so check the tax authority where you invoice.',
      ],
    },
    {
      heading: 'How does the proforma become the commercial invoice?',
      paragraphs: [
        'When the goods ship, the proforma’s details carry over to the commercial invoice, which the ITA describes as the document the buyer’s customs uses to assess duties and taxes. The commercial invoice then shows what was actually shipped, with any quantity or price changes, and adds items such as HS codes where they are needed.',
        'Keep the quotation, the proforma and the commercial invoice consistent on the parties, goods, currency and Incoterms® rule. A mismatch between the proforma a bank or licensing office saw and the invoice customs sees invites questions at the border.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can a proforma invoice be used as a quotation?',
      a: 'Yes. The ITA calls a proforma a quote in an invoice format, so some sellers send one in place of a quotation. It is more work than a simple quote, so it is usually kept for buyers ready to commit.',
    },
    {
      q: 'Does a buyer have to pay a proforma invoice?',
      a: 'Not as a bill. It sets out the terms; payment is due under the payment terms the parties agree, which may require payment in advance against the proforma.',
    },
    {
      q: 'Should a quotation have an expiry date?',
      a: 'It is good practice. Prices, exchange rates and freight costs move, and a validity date makes clear when the offer ends. The ITA lists a validity date among the items a proforma carries.',
    },
    {
      q: 'Is a proforma invoice the same as an estimate?',
      a: 'No. An estimate is an approximate price that may change. A proforma states the specific goods, prices and terms the seller expects to ship on, and it should change only with the buyer’s agreement.',
    },
  ],
  sources: [
    'c3-trade-gov-proforma-invoice',
    'c3-trade-gov-common-export-documents',
    'c3-trade-gov-commercial-invoice',
    'c3-hmrc-vat-notice-700-proforma',
    'c3-icc-incoterms-2020',
  ],
  primaryTool: '/tools/proforma-invoice-generator',
  tools: ['/tools/proforma-invoice-generator', '/tools/invoice-generator', '/tools/incoterms'],
  callout: {
    afterSection: 2,
    tool: '/tools/proforma-invoice-generator',
    title: 'Turn an accepted quote into a proforma',
    text: 'Enter the parties, goods, Incoterms® rule, payment terms and validity date, and download a proforma invoice ready to send to the buyer.',
  },
  related: [
    '/guides/what-is-a-proforma-invoice',
    '/guides/proforma-vs-commercial-invoice',
    '/blog/how-to-make-a-proforma-invoice',
    '/blog/proforma-invoice-example',
    '/blog/pi-and-po',
    '/blog/tt-payment',
  ],
  cover: {
    id: 'ZH4FUYiaczY',
    src: 'https://images.unsplash.com/photo-1635859890085-ec8cb5466806',
    width: 5472,
    height: 3648,
    alt: 'A buyer signing paperwork at a table, the point where a quotation becomes a proforma invoice',
    caption: 'Signing a contract with a ballpoint pen',
    photographer: { name: 'Dimitri Karastelev', profile: 'https://unsplash.com/@dkfra19' },
    page: 'https://unsplash.com/photos/a-woman-sitting-at-a-table-with-lots-of-papers-ZH4FUYiaczY',
  },
};

export default article;
