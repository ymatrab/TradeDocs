import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "how to make a proforma invoice" 20, KD 9;
 * "how to create a proforma invoice" 20. Product-led: the steps follow the free generator
 * (src/app/(marketing)/tools/invoice-generator/generator.tsx, src/lib/tools/document-snapshot.ts:
 * type switch, PI-2026-001 placeholder, document date, currency, Incoterms rule and named place,
 * country of origin, buyer reference, valid until, payment terms, up to 20 lines, 30 PDFs per
 * 10 minutes per address) and the workspace (shipment editor's buyer reference and "Proforma
 * valid until", PI numbering in the database, preview marked "PREVIEW · NOT ISSUED"). The
 * invoice PDF prints no weights (columnsFor/totalsFor in src/lib/pdf/trade-document.ts).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 */
const article: ContentArticle = {
  slug: 'how-to-make-a-proforma-invoice',
  title: 'How to make a proforma invoice, step by step',
  metaTitle: 'How to make a proforma invoice, step by step',
  description:
    'Make a proforma invoice in a few minutes: the details to gather, each field in the free TradeDocs generator, the validity date, and how to keep it for the commercial invoice.',
  lede: 'A buyer has asked for a proforma invoice, perhaps to open a letter of credit or to apply for an import licence, and wants it today. The document is short, but every figure on it becomes a promise you will be held to when the goods ship. This post shows how to make one in the free TradeDocs generator and, for repeat buyers, in a free account.',
  answer:
    'To make a proforma invoice, gather the buyer’s details, the goods with quantities and unit prices, the Incoterms® rule and named place, payment terms and a validity date. Enter them in a proforma template or generator, title the document “Proforma Invoice”, give it its own number, check the totals and send the PDF to the buyer.',
  keyFacts: [
    'The ITA describes a pro forma invoice as a quote in an invoice format.',
    'The ITA lists the buyer’s reference, terms of sale, terms of payment, estimated shipping date and validity date among a proforma’s contents.',
    'The ITA says changes to a proforma should not be made without the buyer’s consent.',
    'The TradeDocs proforma generator prints a “Valid until” box only on proforma invoices.',
    'Without an account, the TradeDocs generator takes up to 20 lines per document and stores nothing.',
  ],
  definitions: [
    {
      term: 'Proforma invoice',
      meaning:
        'A quotation laid out as an invoice, issued before the sale so the buyer can approve, finance or license it.',
    },
    {
      term: 'Validity date',
      meaning: 'The last day the prices and terms on the proforma stand.',
    },
    {
      term: 'Named place',
      meaning:
        'The place written after the Incoterms® rule, such as FCA Leeds, which fixes where delivery happens.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What do you need before you make a proforma invoice?',
      paragraphs: [
        'You need the same facts as a quotation, settled well enough to stand behind. The International Trade Administration (ITA) lists what a proforma should carry: the seller’s and buyer’s names and addresses, the buyer’s reference, the items quoted, unit prices and extended totals, weights and dimensions, any discounts, the terms of sale or Incoterms® rule with the delivery point, the terms of payment, an estimated shipping date and a validity date.',
        'Collect them before you open any template: the buyer’s legal name, address and tax number, their order or enquiry number, a specific description of each product, the quantity and unit, the price per unit in the currency you will invoice in, and the weights and packed dimensions if the buyer will need them for freight or a licence.',
      ],
    },
    {
      heading: 'How do you make a proforma invoice in the free generator?',
      paragraphs: [
        'The TradeDocs proforma invoice generator is the same form as the commercial invoice generator, opened on the proforma type. It needs no account, and nothing you type is stored.',
      ],
      steps: [
        'Open the proforma invoice generator; the type is already set to “Proforma invoice”.',
        'Enter a document number. The field suggests the PI-2026-001 pattern, which keeps proformas apart from commercial invoices.',
        'Leave the document date blank for today, or enter the date you want printed as the issue date.',
        'Choose the currency, the Incoterms® 2020 rule and the named place, and the country of origin.',
        'Enter the buyer’s reference or PO number, the “Valid until” date, and the payment terms.',
        'Fill in “Issued by” with your company and “Addressed to” with the buyer: name, tax number, address, city, postal code and country.',
        'Add a line for each product: description, HS code and origin if you have them, quantity, unit and unit price. The running total updates as you type.',
        'Complete the security check if one appears under the form, then choose “Download the PDF”.',
      ],
    },
    {
      heading: 'What does the TradeDocs proforma PDF show?',
      paragraphs: [
        'The PDF is titled “Proforma Invoice” and carries your number and issue date at the top. Under the parties it prints the Incoterms® 2020 rule with its named place and the country of origin, then a second row with the buyer reference and the “Valid until” date when you entered them. The line table shows the description, HS code, quantity, unit price and amount, with a per-line origin column if any line has an origin, then the total amount in your currency. The payment terms follow the table.',
        'Two things it does not do. It prints no weights, because weights are not part of the invoice layout; if the buyer asked for weights and dimensions, switch the same form to “Packing list” and send that PDF alongside. And every page states that the document was prepared with TradeDocs from your own data and is not issued or certified by any customs authority or carrier.',
      ],
    },
    {
      heading: 'How long should a proforma invoice be valid?',
      paragraphs: [
        'There is no standard period; set the date you can honour. Think about how long your prices hold, how long the buyer’s bank or licensing authority usually takes, and whether exchange rates or freight costs could move against you. The ITA notes that the proforma informs both the buyer and import authorities about the future shipment, and that changes should not be made without the buyer’s consent, so a realistic validity date protects you from being held to an old price.',
        'If the date passes before the buyer accepts, issue a new proforma with a new number and the current prices rather than editing the old one. Both parties then know which version the order is based on.',
      ],
    },
    {
      heading: 'How do you make proformas for repeat buyers?',
      paragraphs: [
        'In a free TradeDocs account, a proforma is generated from a shipment rather than typed into a form, so a repeat buyer and your regular products come from saved records.',
      ],
      steps: [
        'Add the buyer once to your company directory and your products once to the catalog, or import products from a CSV file.',
        'Create a shipment, choose your company as exporter and the buyer as consignee, and set the Incoterms® rule, named place and currency.',
        'Enter the buyer reference and a “Proforma valid until” date in the shipment details.',
        'Add the goods lines from the catalog and check the quantities and prices.',
        'Preview the proforma, which is marked “PREVIEW · NOT ISSUED” and has no number, then generate it. The workspace numbers it in its own PI series.',
      ],
    },
    {
      heading: 'What mistakes should you avoid on a proforma invoice?',
      paragraphs: [
        'Most problems come from treating the proforma as a draft that does not matter. These are the ones that cause rework later:',
      ],
      list: [
        'Calling it a commercial invoice, or reusing the commercial invoice number series.',
        'Leaving out the named place after the Incoterms® rule, so the price has no defined delivery point.',
        'Vague descriptions such as “parts” that will not match the commercial invoice or satisfy a licensing authority.',
        'No validity date, which leaves the price open indefinitely.',
        'A currency or payment term the buyer’s bank was not told about.',
        'Changing quantities or prices after acceptance without the buyer’s agreement.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a proforma invoice the same as a quotation?',
      a: 'Nearly. The ITA says a proforma contains much of the same information as a formal quotation and can often be used in place of one. A buyer may still need the proforma itself, for example to open a letter of credit or apply for an import licence.',
    },
    {
      q: 'Can I make a proforma invoice in Word or Excel?',
      a: 'Yes, any layout that carries the details works. A generator saves you the arithmetic and the layout, and keeps the proforma consistent with the commercial invoice you make later.',
    },
    {
      q: 'Does a proforma invoice need a signature?',
      a: 'Not always. Some buyers, banks or licensing authorities ask for a signed one; check what the person who requested it needs before you send it.',
    },
    {
      q: 'Should a proforma invoice have its own number?',
      a: 'Yes. A separate number, such as PI-2026-001, lets everyone refer to the right quotation and keeps it out of your sales invoice sequence.',
    },
    {
      q: 'Can I include freight on a proforma invoice?',
      a: 'Yes, where your Incoterms® rule puts freight on you, such as CIF or CPT. State the rule and named place so the buyer knows what the total includes.',
    },
    {
      q: 'Is the free generator limited?',
      a: 'It takes up to 20 lines per document and up to 30 PDFs in 10 minutes from one address. In a free account, a shipment can hold up to 999 lines.',
    },
  ],
  sources: ['trade-gov-proforma-invoice', 'icc-incoterms-2020'],
  primaryTool: '/tools/proforma-invoice-generator',
  tools: [
    '/tools/proforma-invoice-generator',
    '/tools/packing-list-generator',
    '/tools/incoterms',
    '/tools/landed-cost-calculator',
  ],
  callout: {
    afterSection: 1,
    tool: '/tools/proforma-invoice-generator',
    title: 'Open the proforma generator',
    text: 'Every field in the steps above is on the form, with a “Valid until” date and the buyer reference. Download the PDF without an account.',
  },
  related: [
    '/blog/proforma-invoice-example',
    '/guides/what-is-a-proforma-invoice',
    '/guides/proforma-vs-commercial-invoice',
    '/guides/export-payment-terms',
    '/blog/how-to-fill-out-a-commercial-invoice',
  ],
  cover: {
    id: 'h2aDKwigQeA',
    src: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f',
    width: 5184,
    height: 3456,
    alt: 'A calculator, pens and notebooks on an office desk, ready for working out the prices on a quotation',
    caption: 'A calculator and pens on an office desk',
    photographer: { name: 'Recha Oktaviani', profile: 'https://unsplash.com/@rechaoktaviani' },
    page: 'https://unsplash.com/photos/black-and-silver-calculator-beside-black-pen-h2aDKwigQeA',
  },
};

export default article;
