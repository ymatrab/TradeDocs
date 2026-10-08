import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, Google US, 2026-10-08, file 12): "quotation validity" 70; "price validity"
 * 30; "quotation valid for 30 days" 30; "quote is valid for 30 days" 30.
 * Plan: docs/research/content-plan-v4-2026-10-08.md, wave E, group 2 (explainer; the
 * proforma's "valid until" field).
 */
const article: ContentArticle = {
  slug: 'quotation-validity-period',
  title: 'Quotation validity period: how long an export quote should hold',
  metaTitle: 'Quotation validity period for export quotes',
  description:
    'What “this quotation is valid for 30 days” commits you to, how to pick a validity period for an export quote or proforma, what to fix and what to leave open, and what to do after it expires.',
  lede: 'Every export quote ends with a line most sellers copy from the last one: “valid for 30 days”. That line decides how long you are standing behind a price built on freight rates, exchange rates and material costs that will not wait for the buyer. It deserves more thought than it usually gets.',
  answer:
    'A quotation validity period is the time during which the seller stands behind the prices and terms in a quote or proforma invoice. There is no standard length; “valid for 30 days” is a convention. Set an end date you can honour given your freight, currency and material costs, and requote rather than ship at an expired price.',
  keyFacts: [
    'The International Trade Administration lists a validity date among the contents of a proforma invoice, next to the estimated shipping date.',
    'The ITA advises that a proforma should not be changed without the buyer’s agreement, because buyers and import authorities rely on it.',
    'Buyers use proforma invoices for import licences, letters of credit, pre-shipment inspection and currency transfers, according to the ITA.',
    'Part II of the UN Convention on Contracts for the International Sale of Goods (CISG) governs how contracts are formed by offer and acceptance.',
    'UNCITRAL notes that the CISG applies to sales between businesses in different contracting states, and not to consumer purchases.',
  ],
  definitions: [
    {
      term: 'Validity period',
      meaning:
        'The time, ending on a stated date, during which the seller stands behind the quoted prices and terms.',
    },
    {
      term: 'Quotation',
      meaning:
        'The seller’s statement of price and terms for goods a buyer has asked about, sent before an order is placed.',
    },
    {
      term: 'Proforma invoice',
      meaning:
        'A quote laid out as an invoice, which the buyer can use for a licence, a letter of credit or a payment in advance.',
    },
    {
      term: 'Requote',
      meaning:
        'A new quotation with current costs and a new validity date, issued under its own number once the old one has lapsed.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a quotation validity period?',
      paragraphs: [
        'It is the window in which your quoted price and terms stand. It starts when you send the quote and ends on the date you write on it. Within that window, a buyer who accepts expects you to supply at the quoted price; after it, you are free to requote.',
        'On an export quote the validity covers more than the unit price. It covers the Incoterms® rule and named place, the payment terms, the shipping date you estimated and, if your price includes carriage, the freight figure inside it. The International Trade Administration lists a validity date among the items a proforma invoice should carry, so the same date usually appears on both documents.',
      ],
    },
    {
      heading: 'Why do export quotes need a validity date?',
      paragraphs: [
        'Because the costs inside an export price change faster than a buyer’s approval process. Three of them move on their own schedule.',
        'Freight comes first. If you quote CPT, CIF, DAP or DDP, your price includes a freight cost your forwarder quoted you, and that quote has its own expiry. The ITA notes that forwarders help exporters prepare price quotations by advising on freight, port and documentation costs, so ask yours how long its figure holds before you set yours.',
        'Exchange rates come second. A price in the buyer’s currency, or costs paid in a third currency, can drift between the quote and the payment. Materials and supplier prices come third, especially for goods made to order.',
        'A quote with no date leaves all three risks with you for as long as the buyer cares to wait.',
      ],
    },
    {
      heading: 'How long should a quotation be valid?',
      paragraphs: [
        'As long as you can honour the price, and long enough for the buyer to act on it. No rule fixes the length; 30 days is common because it is round, not because anyone requires it. Work it out from the factors below, then write a calendar date rather than a number of days.',
      ],
      table: {
        caption: 'What pushes a validity period shorter or longer',
        head: ['Factor', 'Points to a shorter period', 'Points to a longer period'],
        rows: [
          ['Freight included in the price', 'Forwarder’s rate expires soon', 'Price excludes freight (EXW, FCA, FOB)'],
          ['Currency', 'Quote in a currency you do not earn in', 'Quote in your own currency'],
          ['Materials', 'Volatile inputs or supplier prices', 'Stock goods at stable cost'],
          ['Buyer’s process', 'Buyer can order straight away', 'Buyer needs an import licence or a letter of credit'],
          ['Order type', 'One-off spot order', 'Framework price for repeat orders'],
        ],
      },
    },
    {
      heading: 'What happens when a quotation expires?',
      paragraphs: [
        'After the date passes, the quoted price no longer stands, and you can confirm it, change it or decline. What the buyer can hold you to before that date is a legal question, and the answer depends on the law that governs the sale.',
        'For international sales between businesses, that law is often the CISG. UNCITRAL explains that the Convention applies when the buyer and seller are in different contracting states, when the rules of private international law lead to a contracting state’s law, or when the parties choose it, and that its Part II governs how a contract is formed by offer and acceptance. Whether your quote counts as an offer, and whether you can withdraw it early, is decided under those rules or under the national law that applies instead. If a quote matters enough to dispute, ask a lawyer who knows the law named in your terms.',
        'In practice, sellers avoid the argument by being clear: a firm date, the words “subject to written order confirmation” if you want the last word, and a new quote whenever the old one lapses.',
      ],
    },
    {
      heading: 'How do you write the validity on a quote or proforma?',
      paragraphs: [
        'Put it in one place, in plain words, and repeat it on the proforma. A checklist for the line and the terms around it:',
      ],
      steps: [
        'Write an end date, such as “Valid until 30 November 2026”, not “valid for 30 days”, which leaves the start date open to argument.',
        'Give the quote a number, so an acceptance, a proforma and later the commercial invoice can all refer back to it.',
        'State the currency, the Incoterms® rule, the named place and the version, so the buyer knows what the price covers.',
        'Say which costs are fixed until the date and which are estimates, for example “freight included at today’s rate, subject to confirmation at booking”.',
        'If the buyer needs a letter of credit, allow time for it to be opened and checked before the quote expires.',
        'Copy the same date into the “valid until” field of the proforma, so the two documents never disagree.',
      ],
    },
    {
      heading: 'Can you change a price before the validity date?',
      paragraphs: [
        'Treat the price as fixed until the date you wrote. Buyers plan around it, and the ITA notes that a proforma informs both the buyer and the import authorities about the shipment, so it should not be changed without the buyer’s agreement. A buyer may already have used it to apply for an import licence or to ask its bank for a letter of credit, and a new figure can mean starting those again.',
        'If a cost has moved sharply, talk to the buyer, agree the change in writing and issue a revised proforma with a new number. Do not quietly ship at the new price.',
      ],
    },
    {
      heading: 'What should you do when a buyer accepts after the date?',
      paragraphs: [
        'Check your costs, then either confirm the old price in writing or send a new quote. Look again at the freight rate, the exchange rate and your supplier prices. If they still work, a short written confirmation that you will hold the expired price, with a new validity date, is enough. If they do not, requote with a new number and date, and say plainly that the earlier quote has lapsed. Either way, the proforma and the commercial invoice should carry the price you actually agreed.',
      ],
    },
  ],
  faq: [
    {
      q: 'What does “this quotation is valid for 30 days” mean?',
      a: 'It means the seller stands behind the quoted prices and terms for 30 days, usually counted from the date on the quote. Writing the end date itself avoids any doubt about when the 30 days began.',
    },
    {
      q: 'Is a quotation legally binding?',
      a: 'It can be, depending on its wording and the law that governs the sale. For international business sales the CISG often applies and has its own rules on offer and acceptance. For a binding answer on a particular quote, ask a lawyer.',
    },
    {
      q: 'Does a proforma invoice need a validity date?',
      a: 'The International Trade Administration lists a validity date among the items a proforma invoice should include, alongside the estimated shipping date, the Incoterm and the payment terms.',
    },
    {
      q: 'Can a validity period be extended?',
      a: 'Yes. Confirm the extension in writing with the new end date, or issue a revised quote. Keep the original number in the reference so the paper trail stays clear.',
    },
    {
      q: 'Should the freight price have its own validity?',
      a: 'If your price includes carriage, yes. Match your quote’s date to your forwarder’s, or state that the freight element will be confirmed at booking.',
    },
  ],
  sources: ['e2-trade-gov-proforma-invoice', 'e2-uncitral-cisg', 'e2-trade-gov-shipping-options'],
  primaryTool: '/tools/proforma-invoice-generator',
  tools: [
    '/tools/proforma-invoice-generator',
    '/tools/export-price-calculator',
    '/tools/incoterms',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/proforma-invoice-generator',
    title: 'Put the end date on the proforma',
    text: 'The free proforma invoice generator has a “Proforma valid until” field in the shipment details, next to the buyer reference, so the date prints on the PDF you send.',
  },
  related: [
    '/blog/proforma-invoice-vs-quotation',
    '/blog/how-to-make-a-proforma-invoice',
    '/guides/what-is-a-proforma-invoice',
    '/blog/freight-quote-checklist',
    '/blog/proforma-to-commercial-invoice',
  ],
  cover: {
    id: 'FoKO4DpXamQ',
    src: 'https://images.unsplash.com/photo-1435527173128-983b87201f4d',
    width: 3872,
    height: 2592,
    alt: 'Open monthly planner on a wooden desk, for marking the date an export quotation stops being valid',
    caption: 'A monthly planner open on a desk',
    photographer: { name: 'Eric Rothermel', profile: 'https://unsplash.com/@erothermel' },
    page: 'https://unsplash.com/photos/open-monthly-planner-on-wooden-desk-FoKO4DpXamQ',
  },
};

export default article;
