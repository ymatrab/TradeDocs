import { BYLINE, type ContentArticle } from '@/lib/content/article';

const BLOG_ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-05): "proforma invoice example(s)" 1,300 + 1,300,
 * "proforma invoice meaning" 2,400. The definition query ("what is a proforma invoice", 4,400)
 * stays with the proforma generator page, which answers it, so the two do not compete.
 */
const article: ContentArticle = {
  slug: 'proforma-invoice-example',
  title: 'Proforma invoice example: a filled-in sample, explained line by line',
  metaTitle: 'Proforma invoice example, explained line by line',
  description:
    'A complete proforma invoice example with invented parties, what each part means, when a buyer asks for one and how it leads to the commercial invoice.',
  lede: 'A proforma invoice is easier to understand by looking at one. Below is a complete sample for an invented export order, followed by what each part is doing and the mistakes that make a buyer’s bank send it back.',
  answer:
    'A proforma invoice example shows a quotation laid out as the final invoice will be: seller and buyer, the goods with quantities and prices, the currency, the Incoterms® rule and place, payment terms, the expected shipping date and a validity date. The buyer uses it to arrange payment, a letter of credit or an import licence.',
  keyFacts: [
    'A proforma invoice is a quotation in invoice format, issued before the sale is final.',
    'The U.S. International Trade Administration lists import licences, letters of credit, pre-shipment inspection and currency transfers as reasons buyers ask for one.',
    'A proforma invoice carries a validity date; a commercial invoice does not.',
    'A proforma invoice does not request payment for goods delivered, because nothing has been delivered yet.',
    'The commercial invoice should follow the proforma, updated to what was actually shipped.',
  ],
  definitions: [
    {
      term: 'Proforma invoice',
      meaning: 'A formal quotation set out like the invoice that will follow the sale.',
    },
    {
      term: 'Validity date',
      meaning: 'The last day the quoted prices and terms can be accepted.',
    },
    {
      term: 'Payment terms',
      meaning: 'How and when the buyer pays, for example 30% deposit and 70% against documents.',
    },
  ],
  published: BLOG_ROUND,
  updated: BLOG_ROUND,
  reviewed: BLOG_ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does proforma invoice mean?',
      paragraphs: [
        '“Pro forma” is Latin for “as a matter of form”. In trade, a proforma invoice is a document that takes the form of an invoice without being a demand for payment. The U.S. International Trade Administration calls it a quote in an invoice format.',
        'It exists because other parties need to see the deal before it happens. A bank opening a letter of credit, an authority issuing an import licence and an inspection company booking a pre-shipment check all want a document that looks like the invoice they will later see. A price list or an email does not give them that.',
      ],
    },
    {
      heading: 'What does a complete proforma invoice look like?',
      paragraphs: [
        'The sample below is invented: a small Indian manufacturer quoting cotton bags to a retailer in Kenya. Names, numbers and prices are made up to show the layout and are not a model for any real order.',
      ],
      table: {
        caption: 'Example proforma invoice (invented parties and figures)',
        head: ['Field', 'Example entry'],
        rows: [
          ['Document title', 'PROFORMA INVOICE'],
          ['Proforma number and date', 'PI-2026-014, 6 October 2026'],
          ['Seller', 'Example Textiles Pvt Ltd, Plot 12, Industrial Estate, Tiruppur, India'],
          ['Buyer', 'Sample Retail Ltd, PO Box 100, Nairobi, Kenya; buyer reference SR-PO-88'],
          [
            'Line 1',
            'Cotton tote bags, natural, 38 × 42 cm, HS 4202.92: 5,000 pcs at USD 1.10 = USD 5,500.00',
          ],
          [
            'Line 2',
            'Cotton drawstring bags, black, 30 × 40 cm, HS 4202.92: 3,000 pcs at USD 0.95 = USD 2,850.00',
          ],
          ['Total', 'USD 8,350.00'],
          ['Terms of sale', 'CIF Mombasa, Incoterms® 2020'],
          ['Payment terms', 'Irrevocable letter of credit at sight'],
          ['Estimated shipment', 'Within 30 days of receipt of the letter of credit'],
          ['Packing and weights', 'About 80 cartons, gross weight about 1,150 kg, 6.2 m³'],
          ['Valid until', '5 November 2026'],
        ],
      },
    },
    {
      heading: 'What is each part of the example doing?',
      paragraphs: [
        'The title and the number come first because the buyer’s bank must never mistake the document for a demand for payment, and every later document will refer back to that number. Number proformas in their own series so a revised quotation is PI-2026-014 revision 1, not a new invoice.',
        'The parties are written in full because a letter of credit names them exactly. If the buyer’s legal name on the proforma differs from the name on the credit application, the documents will not match later.',
        'Each line carries a description a customs officer could classify, the HS code, the quantity, the unit price and the line total. The HS code in the example is illustrative; the correct classification of your goods is for you or your broker to confirm.',
        'The terms of sale name the Incoterms® rule, the place and the version. CIF Mombasa tells the buyer that the price includes sea freight and minimum insurance to Mombasa, so it can compare the quotation with others on the same basis. The ITA lists the terms of sale and the delivery point among the details a proforma should carry.',
        'The estimated shipment date, the approximate packing figures and the validity date tell the buyer how long the price holds and give the bank and the forwarder what they need to plan. Weights and volume are estimates at this stage; the packing list will give the real ones.',
      ],
    },
    {
      heading: 'When do you need a proforma invoice?',
      paragraphs: [
        'You need one whenever the buyer has to show the deal to someone else before it can commit. The ITA names the common cases:',
        'Many sellers also send one for every export quotation, because it forces both sides to agree the description, the price basis and the terms before production starts.',
      ],
      list: [
        'applying for an import licence in the buyer’s country',
        'contracting a pre-shipment inspection',
        'opening a letter of credit',
        'arranging the transfer of hard currency to pay for the goods',
      ],
    },
    {
      heading: 'How do you write a proforma invoice?',
      paragraphs: [
        'Start from the buyer’s enquiry and the price you would accept, and set it out exactly as the commercial invoice will be laid out later.',
      ],
      steps: [
        'Title the document “Proforma invoice” and give it a number in its own series and a date.',
        'Enter the seller and the buyer with full legal names and addresses, and the buyer’s reference.',
        'List each product with a precise description, the HS code if known, the quantity, the unit price and the line total.',
        'State the currency, the total, any discount, and the Incoterms® rule with its named place and version.',
        'Add the payment terms, the estimated shipping date and the estimated weights and volume.',
        'Set a validity date, then send it and keep a copy as the reference for the commercial invoice.',
      ],
    },
    {
      heading: 'What mistakes make a bank or buyer send it back?',
      paragraphs: [
        'The proforma is often the first document a bank sees, and banks compare documents strictly. The mistakes that cost the most time:',
      ],
      list: [
        'A buyer name or address that differs from the one on the credit application or import licence.',
        'An Incoterms® rule without a place, or one the payment terms contradict.',
        'Descriptions too vague to classify, which an import licence authority will query.',
        'No validity date, so a price quoted months ago is presented as still binding.',
        'Changing the quantity or price on the commercial invoice without first revising the proforma and, where a credit depends on it, the credit.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a proforma invoice legally binding?',
      a: 'It is a formal quotation. Once the buyer accepts it, it can form part of the sales contract. It is not a request for payment for goods delivered.',
    },
    {
      q: 'Does a proforma invoice need an invoice number?',
      a: 'It should have its own reference so the buyer, its bank and you can refer to the same version. Keep proforma numbers in a separate series from commercial invoices.',
    },
    {
      q: 'Can a proforma invoice be used for customs clearance?',
      a: 'Normally customs needs the commercial invoice. In the United States, an importer whose commercial invoice is missing at entry can file a pro forma invoice under 19 CFR 141.85 and supply the commercial invoice afterwards.',
    },
    {
      q: 'How long is a proforma invoice valid?',
      a: 'As long as the validity date on it says. There is no standard period; sellers set it from how long they can hold the price, often 30 days.',
    },
    {
      q: 'What is the difference between a proforma invoice and a quotation?',
      a: 'A quotation can be any offer of a price. A proforma invoice is a quotation set out exactly like the invoice that will follow, with the parties, lines, terms and totals, so a bank or licensing authority can rely on it.',
    },
  ],
  sources: ['trade-gov-proforma-invoice', 'us-cbp-proforma-invoice', 'icc-incoterms-2020'],
  primaryTool: '/tools/proforma-invoice-generator',
  tools: ['/tools/proforma-invoice-generator', '/tools/invoice-generator', '/tools/cbm-calculator'],
  callout: {
    afterSection: 1,
    tool: '/tools/proforma-invoice-generator',
    title: 'Make this proforma with your own figures',
    text: 'The proforma invoice generator has every field in the example, totals the lines and downloads a PDF. No account and nothing stored.',
  },
  cover: {
    id: 'Vs6ip7fsld8',
    src: 'https://images.unsplash.com/photo-1648201637025-1c77b9be3013',
    width: 5167,
    height: 3445,
    alt: 'Calculator and pen on a sheet of paper, as when pricing a proforma invoice quotation',
    caption: 'A calculator and a pen on a piece of paper',
    photographer: { name: 'Aaron Lefler', profile: 'https://unsplash.com/@alefler' },
    page: 'https://unsplash.com/photos/a-calculator-and-a-pen-sitting-on-top-of-a-piece-of-paper-Vs6ip7fsld8',
  },
};

export default article;
