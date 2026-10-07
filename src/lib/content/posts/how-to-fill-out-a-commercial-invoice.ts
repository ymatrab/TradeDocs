import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "how to fill out a commercial invoice" 70, KD 20;
 * "how to create a commercial invoice" 50; "how to make a commercial invoice" 30. Product-led:
 * every step follows the fields of the free generator (src/app/(marketing)/tools/invoice-generator)
 * and the workspace shipment screen as they exist in the code.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A.
 */
const article: ContentArticle = {
  slug: 'how-to-fill-out-a-commercial-invoice',
  title: 'How to fill out a commercial invoice, field by field',
  metaTitle: 'How to fill out a commercial invoice',
  description:
    'A step-by-step walk through a commercial invoice in the order the free TradeDocs generator asks for it: what to enter in each field, what to check and what to leave out.',
  lede: 'Filling out a commercial invoice is mostly copying facts you already have into the right boxes, in the right form. This walk-through follows the fields of the free commercial invoice generator in order, says what goes in each one and why, and ends with the checks to make before the invoice leaves.',
  answer:
    'To fill out a commercial invoice, give it a unique number and date, enter the seller and buyer with full names and addresses, state the currency and the Incoterms® rule with its named place, then list each product with a precise description, HS code, origin, quantity, unit price and weight. Check that the lines add up to the total.',
  keyFacts: [
    'The ITA describes the commercial invoice as the document the importing country’s customs uses to assess duties and taxes.',
    'Under 19 CFR 141.86, a US import invoice needs a detailed description of the goods and quantities in recognised weights and measures.',
    '19 CFR 141.86(d) requires a US import invoice in English or with an accurate English translation attached.',
    'For US exports of items on the Commerce Control List, 15 CFR 758.6 makes the destination control statement part of the commercial invoice, with stated exceptions.',
    'The TradeDocs free generator needs a document number, an issuer, an addressee and one described line before it produces a PDF.',
  ],
  definitions: [
    {
      term: 'Issued by',
      meaning: 'The seller or exporter whose invoice it is; printed as the exporter on the PDF.',
    },
    {
      term: 'Addressed to',
      meaning: 'The buyer or consignee the invoice is made out to; printed as the consignee.',
    },
    {
      term: 'Buyer reference',
      meaning: 'The buyer’s own order or PO number, so its accounts team can match the invoice.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What do you need before you start?',
      paragraphs: [
        'Have the final facts of the shipment in front of you. A commercial invoice records what is actually being shipped, so it is filled in after the goods are packed, not from the quotation.',
      ],
      list: [
        'The buyer’s order, with its PO number and the agreed prices and currency.',
        'The agreed Incoterms® rule and named place, from the contract or the proforma invoice.',
        'The final quantities of each product, and the net and gross weights once packed.',
        'The country where each product was made.',
        'The HS code of each product, classified by you or your broker in the importing country’s tariff.',
        'The full legal names, addresses and tax numbers of both parties.',
      ],
    },
    {
      heading: 'How do you fill out a commercial invoice, step by step?',
      paragraphs: [
        'Work from the top of the document to the bottom. The steps below follow the free commercial invoice generator, which asks for the fields in this order and prints them on a PDF.',
      ],
      steps: [
        'Choose “Commercial invoice” as the type, then enter your own invoice number, such as INV-2026-031. Use a new number for every invoice; the buyer, its bank and customs all refer to it.',
        'Enter the document date, or leave it blank to print today’s date.',
        'Choose the currency the sale was agreed in. Every price and total on the invoice is in that currency.',
        'Choose the Incoterms® 2020 rule and type the named place, such as FCA Felixstowe. A rule without a place does not say where delivery happens.',
        'Enter the country of origin as a two-letter code if every line shares it; leave it blank and set it per line if they differ.',
        'Add the buyer’s reference or PO number and your payment terms, such as 30 days from invoice date.',
        'Under “Issued by”, enter your company name, address, city, postal code, two-letter country code and tax number.',
        'Under “Addressed to”, enter the buyer the same way.',
        'Add one line per product, with the fields described in the next section, then check the total shown under the lines.',
        'Download the PDF, check it against the packing list and the goods, and sign it if your buyer or carrier asks.',
      ],
    },
    {
      heading: 'What goes in each line of goods?',
      paragraphs: [
        'Each line is one product with one price. The table lists the line fields in the generator’s order with what customs and the buyer use them for. Where the example column shows figures, they are invented.',
      ],
      table: {
        caption: 'Line fields with invented example entries',
        head: ['Field', 'What to enter', 'Invented example'],
        rows: [
          [
            'Description of goods',
            'What the goods are in plain words: material, finish, size, use',
            'Stoneware dinner plates, glazed, 27 cm',
          ],
          ['HS code', 'Your own classification from the official tariff', '[your code]'],
          ['Origin', 'Two-letter code of the country of manufacture', 'GB'],
          ['Quantity and unit', 'The number shipped and its unit', '600 pcs'],
          ['Unit price', 'The price of one unit in the invoice currency', '5.25'],
          ['Net weight (kg)', 'The goods alone, for the whole line', '540'],
          ['Gross weight (kg)', 'Goods plus packing, for the whole line', '625'],
          ['Packages', 'How many cartons or other packages hold this line', '50'],
        ],
      },
    },
    {
      heading: 'Which details do US customs ask for?',
      paragraphs: [
        'If the goods are entering the United States, 19 CFR 141.86 sets out what the invoice states. Most of it is in the fields above; a few items need attention.',
        'The description must be detailed, with the grade or quality and the marks and numbers of the packages. Quantities must be in the weights and measures of the shipping country or of the United States. The regulation also asks for the port of entry, the purchase price in the currency of the sale and any charges such as freight, insurance and packing, itemised. The invoice must be in English or carry an accurate translation.',
        'Other countries set their own lists. Canada’s CBSA, for example, accepts a commercial invoice that gives all the information in Appendix A of Memorandum D1-4-1, in English or French, including the number of packages and both net and gross weight. Check the importing country’s rules for your shipment.',
      ],
    },
    {
      heading: 'What does the free generator not do?',
      paragraphs: [
        'The free generator covers the fields most invoices need and stores nothing you type: the values are gone when you close the page. It takes up to 20 lines. It has no fields for ports, marks and numbers or package dimensions, no signature line, and no field for statements such as the destination control statement, so write those on the printed copy or use the workspace.',
        'In a free TradeDocs account, the shipment screen adds port of loading and port of discharge, country of destination, shipping date and marks and numbers. Your organisation settings hold payment terms, bank details, a signatory name and title printed under a signature line, and a short document note printed on every document, which can carry a statement your goods need. Documents are generated from the saved shipment, so the next invoice for the same buyer starts from the directory and product catalog. Adding your logo and a signature image to the PDF is PDF branding, a feature of the paid Pro plan.',
        'Every PDF, free or from the workspace, says it was prepared with TradeDocs from the shipper’s own data and is not issued, endorsed, certified or cleared by any customs authority, carrier or chamber of commerce. The figures are yours to get right.',
      ],
    },
    {
      heading: 'How do you check the invoice before it goes?',
      paragraphs: [
        'Read the PDF once against the goods and once against the other documents. These checks catch most errors:',
      ],
      list: [
        'Every line amount equals quantity × unit price, and the total equals the sum of the lines.',
        'The package count and weights equal the packing list and what the carrier will weigh.',
        'The descriptions say what the goods are without relying on a product code.',
        'The Incoterms® rule has its named place, and the price matches what the rule includes.',
        'The buyer’s name and address match its order and, under a letter of credit, the credit itself.',
      ],
    },
  ],
  faq: [
    {
      q: 'Who fills out the commercial invoice?',
      a: 'The seller or exporter, because it is the seller’s statement of what was sold and at what price. A forwarder or broker may help, but the facts come from the seller.',
    },
    {
      q: 'Can I fill out a commercial invoice by hand?',
      a: 'Some customs authorities accept it: the CBSA, for one, accepts a commercial invoice prepared by any means, including by hand, if it carries the required information. A typed PDF is easier to read and to correct.',
    },
    {
      q: 'Do I need an account to use the commercial invoice generator?',
      a: 'No. The free generator works without an account and stores nothing. An account saves the shipment, the parties and the products so later documents start from them.',
    },
    {
      q: 'What if I make a mistake after sending the invoice?',
      a: 'Issue a corrected invoice and tell everyone who received the first one, including your forwarder or broker. In the TradeDocs workspace, a change to the shipment marks the earlier documents as out of date.',
    },
  ],
  sources: [
    'a2-trade-gov-commercial-invoice',
    'a2-cornell-19-cfr-141-86',
    'a2-cbsa-d1-4-1',
    'a2-cornell-15-cfr-758-6',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  callout: {
    afterSection: 1,
    tool: '/tools/invoice-generator',
    title: 'Follow these steps in the generator',
    text: 'Open the free commercial invoice generator beside this page and fill it in step by step. It adds up the lines and downloads the PDF. No account needed.',
  },
  related: [
    '/blog/commercial-invoice-example',
    '/blog/commercial-invoice-requirements',
    '/blog/how-to-make-a-packing-list-from-your-invoice',
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/guides/proforma-vs-commercial-invoice',
    '/blog/commercial-invoice-for-canada',
  ],
  cover: {
    id: 'Q2J2qQsoYH8',
    src: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc',
    width: 3999,
    height: 2666,
    alt: 'A printed sheet of paper beside a laptop, as when filling in an invoice on screen and checking the copy',
    caption: 'A sheet of printer paper beside a laptop',
    photographer: { name: 'Markus Winkler', profile: 'https://unsplash.com/@markuswinkler' },
    page: 'https://unsplash.com/photos/white-printer-paper-beside-silver-laptop-computer-Q2J2qQsoYH8',
  },
};

export default article;
