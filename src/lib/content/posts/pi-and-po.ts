import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "pi meaning in business" 140; "pi and po" 110.
 * Replaces v2 #56 "proforma invoice vs purchase order" (10).
 * Plan: docs/research/content-plan-v3-2026-10-07.md (v2 #56, retargeted), wave B.
 * Contract formation is described, never decided: the article names where the rules live
 * (UCC § 2-206 in the US, the CISG between contracting states) and stops there. The order
 * numbers and figures in the example are invented.
 */
const article: ContentArticle = {
  slug: 'pi-and-po',
  title: 'PI and PO: what a proforma invoice and a purchase order mean',
  metaTitle: 'PI and PO meaning: proforma and purchase order',
  description:
    'What PI and PO stand for in trade, who issues each one, which comes first, what each must carry and how they line up with the commercial invoice.',
  lede: 'Two abbreviations run through almost every export order. The buyer sends a PO; the seller sends a PI. They describe the same deal from opposite sides, and when their numbers disagree the shipment, the payment or the customs entry is where you find out.',
  answer:
    'In trade, PI means proforma invoice and PO means purchase order. The PO is the buyer’s document: it orders the goods at stated prices and terms. The PI is the seller’s document: a quote in invoice format that confirms the order’s details and often requests payment. Neither replaces the commercial invoice issued at shipment.',
  keyFacts: [
    'The International Trade Administration (ITA) defines a pro forma invoice as a quote in an invoice format that a buyer may need to apply for an import licence, open a letter of credit or arrange a transfer of hard currency.',
    'The ITA lists the buyer’s reference, terms of sale or Incoterm, terms of payment, estimated shipping date and validity date among a pro forma’s contents.',
    'Under UCC § 2-206 in the United States, an order to buy goods for prompt shipment invites acceptance by a prompt promise to ship or by shipping.',
    'In the UK, HMRC’s VAT Notice 700 says a pro-forma invoice cannot be used to reclaim input tax and should be marked “this is not a VAT invoice”.',
    'Under 19 CFR 141.85, US Customs and Border Protection accepts a pro forma invoice at entry when the commercial invoice is not available.',
  ],
  definitions: [
    {
      term: 'Proforma invoice (PI)',
      meaning:
        'The seller’s advance invoice for an order, setting out the goods, prices and terms before shipment.',
    },
    {
      term: 'Purchase order (PO)',
      meaning:
        'The buyer’s written order for goods, with quantities, prices, delivery and payment terms and the buyer’s order number.',
    },
    {
      term: 'Order confirmation',
      meaning:
        'The seller’s acceptance of a purchase order, which some sellers send as the proforma itself.',
    },
    {
      term: 'Commercial invoice',
      meaning:
        'The seller’s final invoice for goods actually shipped, used for payment and customs clearance.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does PI mean in business?',
      paragraphs: [
        'In trade and purchasing, PI means proforma invoice. The ITA describes it as a quote in an invoice format: it looks like an invoice, with the seller, the buyer, the goods and the prices, but it is issued before the sale is completed and asks the buyer to commit, to pay or to arrange what the import needs.',
        'The ITA lists what buyers use it for: applying for an import licence, contracting for pre-shipment inspection, opening a letter of credit or arranging the transfer of hard currency. It also notes that a pro forma usually carries much the same information as a formal quotation and can often take its place. The guide to what a proforma invoice is covers it in full.',
      ],
    },
    {
      heading: 'What does PO mean in business?',
      paragraphs: [
        'PO means purchase order: the buyer’s written instruction to buy. It names the goods, quantities and prices the buyer is ordering, the delivery and payment terms they expect, and a PO number the buyer will look for on every document that follows.',
        'Whether a PO is a binding offer, and when it becomes a contract, depends on the law that governs the sale. In the United States, UCC § 2-206 says that an order to buy goods for prompt or current shipment invites acceptance either by a prompt promise to ship or by shipping the goods. Between businesses in different countries, the UN Convention on Contracts for the International Sale of Goods (CISG) may apply instead, as UNCITRAL explains, when both have their places of business in contracting states. If the answer matters for a deal, ask a lawyer in the relevant country.',
      ],
    },
    {
      heading: 'What is the difference between a PI and a PO?',
      paragraphs: [
        'The PO comes from the buyer and says what they want; the PI comes from the seller and says what they will supply, at what price and on what terms. The table sets the two side by side, with the commercial invoice for comparison.',
      ],
      table: {
        caption: 'Purchase order, proforma invoice and commercial invoice compared',
        head: ['Point', 'Purchase order (PO)', 'Proforma invoice (PI)', 'Commercial invoice'],
        rows: [
          ['Issued by', 'Buyer', 'Seller', 'Seller'],
          [
            'When',
            'When the buyer decides to order',
            'Before shipment, often before payment',
            'At or after shipment',
          ],
          [
            'Purpose',
            'Orders the goods',
            'Confirms the order and requests payment or arrangements',
            'Records the sale and asks for payment due',
          ],
          [
            'Reference it carries',
            'The buyer’s PO number',
            'Its own PI number and the buyer’s PO number',
            'Invoice number, PO and often PI numbers',
          ],
          [
            'Used for customs',
            'No',
            'Sometimes, in place of a missing commercial invoice',
            'Yes, as the main valuation document',
          ],
          [
            'UK VAT invoice',
            'No',
            'No, under HMRC’s VAT Notice 700',
            'Can be, if it carries the details HMRC requires',
          ],
        ],
      },
    },
    {
      heading: 'Which comes first, the PI or the PO?',
      paragraphs: [
        'Either, depending on who moves first. Some buyers send a PO and the seller answers with a PI that confirms it; others ask for a PI so they can raise a PO internally, open a letter of credit or apply for an import licence. What matters is that the last version of each agrees with the other before anything ships.',
      ],
      steps: [
        'The buyer asks for prices, or sends a PO with its number, goods, quantities and terms.',
        'The seller issues a PI quoting the PO number, with prices, the Incoterms® 2020 rule and named place, payment terms and a validity date.',
        'The buyer confirms, and raises or amends the PO so its figures match the PI.',
        'If the terms ask for it, the buyer pays the deposit or opens the letter of credit against the PI.',
        'The seller ships and issues the commercial invoice, quoting the PO and PI numbers, for the goods actually shipped.',
      ],
    },
    {
      heading: 'What should a proforma invoice include?',
      paragraphs: [
        'The ITA lists the points a pro forma should carry, the same as for a quotation. Add the buyer’s PO number as the buyer’s reference, so their accounts team can match it.',
      ],
      list: [
        'Seller’s and buyer’s names and addresses.',
        'The buyer’s reference, usually the PO number.',
        'The items quoted, with prices per unit and extended totals.',
        'Weights and dimensions of the quoted products.',
        'Discounts, if any.',
        'Terms of sale, or the Incoterm used, with the delivery point.',
        'Terms of payment.',
        'Estimated shipping date and a validity date.',
      ],
    },
    {
      heading: 'What has to match between the PO, the PI and the commercial invoice?',
      paragraphs: [
        'The goods, the quantities, the unit prices, the currency, the Incoterms® rule and the payment terms. The ITA warns that a pro forma informs the buyer and the import authorities about the future shipment, and that changes should not be made without the buyer’s consent. Under a letter of credit, the ITA notes that the documents are detailed and prone to discrepancies, so a PI that disagrees with the credit, or an invoice that disagrees with both, can hold up payment.',
        'The example shows a change caught in time. The quantity and price moved between the first PO and the PI, so the buyer amended the PO before paying.',
      ],
      table: {
        caption:
          'Worked example with invented parties and figures: one order across three documents',
        head: ['Field', 'PO 7781 (rev. 1)', 'PI-0233', 'Invoice INV-0519'],
        rows: [
          ['Goods', 'Steel shelving units', 'Steel shelving units', 'Steel shelving units'],
          ['Quantity', '240', '240', '240'],
          ['Unit price', 'USD 38.00', 'USD 38.00', 'USD 38.00'],
          ['Incoterms® 2020 rule', 'FOB Felixstowe', 'FOB Felixstowe', 'FOB Felixstowe'],
          [
            'Payment terms',
            '30% deposit, balance before shipment',
            'Same',
            'Paid in full, USD 9,120',
          ],
        ],
      },
    },
    {
      heading: 'Is a PI or a PO legally binding?',
      paragraphs: [
        'It can be, but the document’s name does not decide it; the law that governs the sale and what the parties wrote and did do. In the US, UCC § 2-206 treats an order for prompt shipment as inviting acceptance by a promise to ship or by shipping. For international sales between businesses in contracting states, the CISG sets uniform rules. Either way, a PI that states the terms in full and a PO that accepts them leave far less to argue about than two documents that disagree.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a proforma invoice a tax invoice?',
      a: 'Not in the UK: HMRC’s VAT Notice 700 says it cannot be used to reclaim input tax and should be marked “this is not a VAT invoice”. Check the rule where you are registered.',
    },
    {
      q: 'Can a proforma invoice be used for customs?',
      a: 'Sometimes. In the US, 19 CFR 141.85 lets the importer file a pro forma invoice at entry when the commercial invoice is not available, with the commercial invoice to follow.',
    },
    {
      q: 'Should the PO number go on the commercial invoice?',
      a: 'It helps. The ITA lists the buyer’s reference among a pro forma’s contents, and carrying the same number onto the commercial invoice lets the buyer match payment to order.',
    },
    {
      q: 'Can a seller change a proforma after the buyer orders?',
      a: 'Only with the buyer’s agreement. The ITA says changes to a pro forma should not be made without the buyer’s consent, so issue a revised PI and ask for an amended PO.',
    },
    {
      q: 'What does PI mean in other contexts?',
      a: 'Outside trade it has other meanings, such as the mathematical constant. On an order, a payment request or a supplier’s email, PI almost always means proforma invoice.',
    },
  ],
  sources: [
    'trade-gov-proforma-invoice',
    'b4-cornell-ucc-2-206',
    'b4-uncitral-cisg',
    'b4-hmrc-vat-notice-700',
    'us-cbp-proforma-invoice',
    'a4-trade-gov-letter-of-credit',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/proforma-invoice-generator',
  tools: [
    '/tools/proforma-invoice-generator',
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/proforma-invoice-generator',
    title: 'Answer the PO with a matching proforma',
    text: 'Enter the buyer’s PO number, goods, prices and terms once, and download a proforma invoice PDF that quotes it.',
  },
  related: [
    '/guides/what-is-a-proforma-invoice',
    '/guides/proforma-vs-commercial-invoice',
    '/blog/proforma-invoice-example',
    '/guides/export-payment-terms',
    '/blog/commercial-invoice-and-packing-list-must-match',
  ],
  cover: {
    id: 'GJao3ZTX9gU',
    src: 'https://images.unsplash.com/photo-1521791055366-0d553872125f',
    width: 6016,
    height: 4016,
    alt: 'A buyer writing on a printed purchase order on a desk',
    caption: 'A person writing on white paper',
    photographer: {
      name: 'Cytonn Photography',
      profile: 'https://unsplash.com/@cytonn_photography',
    },
    page: 'https://unsplash.com/photos/person-writing-on-white-paper-GJao3ZTX9gU',
  },
};

export default article;
