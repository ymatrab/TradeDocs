import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "what is a proforma invoice" 4,400, KD 6;
 * "proforma invoice meaning" 2,400; "proforma invoice definition" 320.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A.
 * Definitional guide; the side-by-side comparison lives in proforma-vs-commercial-invoice and
 * the filled-in sample in the proforma-invoice-example post.
 */
const article: ContentArticle = {
  slug: 'what-is-a-proforma-invoice',
  title: 'What is a proforma invoice? Meaning, uses and contents',
  metaTitle: 'What is a proforma invoice? Meaning and uses',
  description:
    'A proforma invoice is a quotation in invoice form. What it is for, what it should show, whether it binds you, and how it leads to the commercial invoice.',
  lede:
    'A buyer asks for a proforma before they have agreed to buy, or before their bank or government will let them pay. It looks like an invoice, but it does a different job, and getting it right early saves rewriting every document that follows.',
  answer:
    'A proforma invoice is a seller’s quotation laid out as an invoice. It lists the buyer, the goods, prices, the Incoterms® rule, payment terms and the expected shipping date. The International Trade Administration calls it a quote in invoice format that buyers use to open a letter of credit or apply for an import licence.',
  keyFacts: [
    'The International Trade Administration (ITA) describes a pro forma invoice as a quote in an invoice format.',
    'According to the ITA, buyers may need a pro forma invoice to apply for an import licence, open a letter of credit or arrange a transfer of hard currency.',
    'The ITA says changes to a pro forma invoice should not be made without the buyer’s consent.',
    'Under 19 CFR 142.3, a US entry normally needs a commercial invoice; a pro forma invoice is accepted only in the cases the regulations list.',
    'Under 19 CFR 141.85, a US importer whose commercial invoice is missing at entry files its own pro forma invoice and produces the commercial invoice later.',
  ],
  definitions: [
    {
      term: 'Proforma invoice',
      meaning:
        'A quotation set out in invoice form, issued before the goods ship so the buyer can commit, pay or obtain approvals.',
    },
    {
      term: 'Commercial invoice',
      meaning:
        'The invoice for goods actually sold and shipped, which customs uses to assess duties and taxes.',
    },
    {
      term: 'Letter of credit',
      meaning:
        'A bank’s commitment, on the buyer’s behalf, to pay the seller once the documents the credit requires are presented.',
    },
    {
      term: 'Validity date',
      meaning: 'The last day on which the prices and terms on the proforma still stand.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does proforma invoice mean?',
      paragraphs: [
        'It means an invoice issued in advance, as a statement of what the seller will invoice if the buyer goes ahead. Nothing has shipped and, usually, nothing has been paid. The ITA’s definition is short: a pro forma invoice is a quote in an invoice format, carrying much of the same information as a formal quotation.',
        'You will see it written as proforma, pro forma and pro-forma. They are the same document. What matters is that the buyer, their bank and any authority reading it can see at once that it is a proforma and not the final invoice, so label it clearly at the top.',
      ],
    },
    {
      heading: 'What is a proforma invoice used for?',
      paragraphs: [
        'A proforma gives the buyer something official-looking to act on before the sale is final. The ITA lists the common reasons a buyer asks for one, and each of them needs the figures to be exact, because someone other than the buyer is going to rely on them.',
      ],
      list: [
        'Applying for an import licence or permit in the buyer’s country.',
        'Opening a letter of credit with the buyer’s bank.',
        'Arranging a transfer of hard currency where the buyer’s country controls foreign exchange.',
        'Contracting a pre-shipment inspection.',
      ],
    },
    {
      heading: 'What should a proforma invoice include?',
      paragraphs: [
        'The ITA lists the details a pro forma invoice should carry. Most of them are the same fields your commercial invoice will carry later, which is the point: if the proforma is complete, the final invoice is mostly a copy with a new number and the shipment date.',
      ],
      table: {
        caption: 'What a proforma invoice should show, following the ITA’s list',
        head: ['Field', 'What to write'],
        rows: [
          ['Seller and buyer', 'Full names and addresses of both parties'],
          ['Buyer’s reference', 'The enquiry or purchase reference the buyer gave you'],
          ['Goods', 'Each item with its quantity, unit price and line total'],
          ['Weights and dimensions', 'So the buyer can estimate freight and duty'],
          ['Discounts', 'Any discount, shown separately from the unit prices'],
          ['Terms of sale', 'The Incoterms® rule with its named place, such as FCA Leeds'],
          ['Payment terms', 'How and when the buyer pays, such as by letter of credit'],
          ['Estimated shipping date', 'When the goods are expected to be ready or to ship'],
          ['Validity date', 'How long the prices and terms hold'],
        ],
      },
    },
    {
      heading: 'Is a proforma invoice legally binding?',
      paragraphs: [
        'On its own it is an offer, not a demand for payment. Whether it becomes binding depends on what the buyer does with it and on the contract law that applies: a buyer who accepts it in writing, or pays against it, may have made a contract on those terms. Treat every proforma as a price you are prepared to honour until its validity date.',
        'The ITA adds a practical rule: a pro forma invoice informs the buyer and the import authorities about the future shipment, so changes should not be made without the buyer’s consent. If the price, quantity or terms change, issue a revised proforma with a new number and date rather than editing the old one, and keep both.',
      ],
    },
    {
      heading: 'Can a proforma invoice replace a commercial invoice?',
      paragraphs: [
        'Normally no. Customs assesses duties and taxes from the commercial invoice, and under 19 CFR 142.3 a US entry needs a commercial invoice except in the cases the regulations list, where a pro forma invoice or other documentation may be accepted.',
        'The US pro forma under 19 CFR 141.85 is also narrower than the exporter’s proforma. It is a statement the importer files at entry when the seller’s commercial invoice has not arrived, and the importer still has to produce the commercial invoice. For the full comparison, see our guide Proforma invoice vs commercial invoice.',
      ],
    },
    {
      heading: 'How do you make a proforma invoice?',
      paragraphs: [
        'Build it from the buyer’s enquiry, then check it as if a bank were going to read it, because it may be.',
      ],
      steps: [
        'Confirm the buyer’s full legal name and address, and the reference they want quoted.',
        'List each item with a plain description, quantity, unit and unit price, in the currency agreed.',
        'Add the Incoterms® rule with a precise named place and the Incoterms® 2020 version.',
        'State the payment terms, and the bank details if the buyer will pay in advance.',
        'Give net and gross weights and the packed dimensions, so freight and duty can be estimated.',
        'Set an estimated shipping date and a validity date for the offer.',
        'Mark the document “Proforma invoice”, give it its own number, and keep a copy.',
      ],
    },
    {
      heading: 'What happens to the proforma when the goods ship?',
      paragraphs: [
        'It is replaced by the commercial invoice, which records what was actually sold and shipped. If the buyer opened a letter of credit from your proforma, the credit will repeat its description, quantity and price, and the commercial invoice will be checked against the credit. Reuse the same wording and figures so the two agree, and change only what really changed.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a proforma invoice a request for payment?',
      a:
        'Not in the way a final invoice is. It sets out what the buyer will pay if they go ahead. Some sellers ask for advance payment against it, and then the proforma should state the payment terms and bank details.',
    },
    {
      q: 'How long is a proforma invoice valid?',
      a:
        'As long as the validity date you put on it. The ITA lists a validity date among the details a pro forma should carry. There is no standard period; choose one that reflects how long your prices and capacity hold.',
    },
    {
      q: 'Should a proforma invoice have an invoice number?',
      a:
        'Give it a reference number of its own, and mark it clearly as a proforma, so it is never confused with a commercial invoice in your records or the buyer’s.',
    },
    {
      q: 'Can I change a proforma invoice after sending it?',
      a:
        'Issue a revised one with a new number and date. The ITA advises that changes should not be made without the buyer’s consent, especially once a bank or authority has relied on the first version.',
    },
    {
      q: 'Does a proforma invoice need the HS code?',
      a:
        'It is not on the ITA’s list, but a buyer applying for an import licence may ask for it. If you include one, take it from the official tariff of the country concerned; do not guess.',
    },
  ],
  sources: [
    'trade-gov-proforma-invoice',
    'us-cbp-proforma-invoice',
    'a4-cfr-19-142-3',
    'trade-gov-commercial-invoice',
    'a4-trade-gov-letter-of-credit',
  ],
  primaryTool: '/tools/proforma-invoice-generator',
  callout: {
    afterSection: 2,
    tool: '/tools/proforma-invoice-generator',
    title: 'Fill in a proforma with every field on the list',
    text:
      'The proforma invoice generator has the buyer’s reference, Incoterms® rule, payment terms and validity date built in. Enter the goods and download the PDF.',
  },
  tools: [
    '/tools/proforma-invoice-generator',
    '/tools/invoice-generator',
    '/tools/incoterms',
    '/tools/landed-cost-calculator',
  ],
  related: [
    '/guides/proforma-vs-commercial-invoice',
    '/blog/proforma-invoice-example',
    '/blog/commercial-invoice-requirements',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'I3HPUolh5hA',
    src: 'https://images.unsplash.com/photo-1625225233840-695456021cde',
    width: 6000,
    height: 4000,
    alt:
      'Blank sheet of paper on a desk beside a pen and a calculator, ready for a price quotation',
    caption: 'A blank sheet, a pen and a calculator on a desk',
    photographer: { name: 'Mediamodifier', profile: 'https://unsplash.com/@mediamodifier' },
    page: 'https://unsplash.com/photos/black-calculator-beside-black-pen-on-white-printer-paper-I3HPUolh5hA',
  },
};

export default article;
