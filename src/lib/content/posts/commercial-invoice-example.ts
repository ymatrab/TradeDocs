import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "commercial invoice example" 390, KD 22;
 * "commercial invoice sample" 390. Template intent ("commercial invoice template" 2,400) stays
 * with the generator page; this post shows a filled-in example and links back to it.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A.
 */
const article: ContentArticle = {
  slug: 'commercial-invoice-example',
  title: 'Commercial invoice example: a complete sample for an export order',
  metaTitle: 'Commercial invoice example: a complete sample',
  description:
    'A filled-in commercial invoice example for an invented export, with every field explained, the totals checked and the details US customs asks for marked.',
  lede: 'A blank template tells you which boxes exist. A filled-in example shows what goes in them and how the figures relate. Below is a complete commercial invoice for an invented shipment of tableware from England to the United States, then what each part is doing and what to change for your own order.',
  answer:
    'A commercial invoice example shows the seller and buyer, the invoice number and date, each line of goods with quantity, unit price and amount, the currency and total, the Incoterms® rule with its named place, the country of origin, the packages and weights, and the payment terms. Customs in the importing country uses it to assess duties.',
  keyFacts: [
    'The ITA describes the commercial invoice as the document the importing country’s customs uses to assess duties and taxes.',
    'Under 19 CFR 141.86, a US import invoice gives a detailed description of the goods with the marks and numbers of the packages.',
    '19 CFR 141.86 asks for quantities in the weights and measures of the shipping country or of the United States.',
    'The ITA says most countries accept the seller’s own invoice format if all the pertinent information is included.',
    'Incoterms® 2020 rules are cited with the rule, the named place and the version, such as FCA Felixstowe, Incoterms® 2020.',
  ],
  definitions: [
    {
      term: 'Commercial invoice',
      meaning:
        'The seller’s bill for goods actually shipped, used by customs to value and check them.',
    },
    {
      term: 'Named place',
      meaning: 'The place written after an Incoterms® rule, where the seller’s delivery happens.',
    },
    {
      term: 'Marks and numbers',
      meaning:
        'The text painted or labelled on each package so it can be matched to the documents.',
    },
    {
      term: 'Port of entry',
      meaning: 'The port where the goods are entered into the importing country.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does a complete commercial invoice look like?',
      paragraphs: [
        'The sample below is invented from start to finish: a small pottery in England selling stoneware tableware to a homeware retailer in Oregon. Every name, number and price is made up to show the layout, and none of it is a model for a real order. The HS code column is left for you to fill, because the classification of your goods is yours or your broker’s to decide.',
      ],
      table: {
        caption: 'Example commercial invoice (invented parties and figures)',
        head: ['Field', 'Example entry'],
        rows: [
          ['Document title', 'COMMERCIAL INVOICE'],
          ['Invoice number and date', 'INV-2026-031, 7 October 2026'],
          [
            'Seller (exporter)',
            'Example Ceramics Ltd, Unit 4, Kiln Lane, Stoke-on-Trent ST1 0AA, United Kingdom; VAT GB000000000',
          ],
          [
            'Buyer (consignee)',
            'Sample Homeware Inc, 200 Harbor Way, Portland, OR 97201, United States',
          ],
          ['Buyer reference', 'PO 4471'],
          ['Terms of sale', 'FCA Felixstowe, Incoterms® 2020'],
          ['Port of entry', 'Seattle, Washington'],
          ['Country of origin', 'United Kingdom (GB), all lines'],
          [
            'Line 1',
            'Stoneware mugs, glazed, 350 ml, HS [your code]: 1,200 pcs at GBP 3.40 = GBP 4,080.00',
          ],
          [
            'Line 2',
            'Stoneware dinner plates, glazed, 27 cm, HS [your code]: 600 pcs at GBP 5.25 = GBP 3,150.00',
          ],
          [
            'Line 3',
            'Stoneware serving bowls, glazed, 20 cm, HS [your code]: 300 pcs at GBP 6.10 = GBP 1,830.00',
          ],
          ['Total', 'GBP 9,060.00'],
          ['Packages', '130 cartons, marked SHW / PORTLAND / PO 4471 / C/No. 1–130'],
          ['Weights', 'Net 1,200.0 kg, gross 1,410.0 kg'],
          ['Payment terms', '30% deposit with order, balance 30 days from invoice date'],
          ['Signed', 'Name and title of the person signing for the seller'],
        ],
      },
    },
    {
      heading: 'What is each part of the example doing?',
      paragraphs: [
        'The title, number and date identify the document. Every other paper in the shipment, from the packing list to the payment, will refer back to INV-2026-031, so the number should be unique in your own series and never reused.',
        'The seller and buyer are written with full legal names and addresses because customs, the carrier and the buyer’s bank all read them. The buyer reference is the purchase order number from Sample Homeware, which lets its accounts team match the invoice to what it ordered.',
        'Each line says what the goods are in words a customs officer could classify: the material, the finish, the size and the use. Under 19 CFR 141.86, a US import invoice needs a detailed description with the grade or quality, and the marks and numbers of the packages the goods are packed in. “Ceramics” alone would not do that.',
        'The quantity, unit and unit price multiply to the amount on each line, and the amounts add to the total. The currency is stated once and applies to every figure. The terms of sale say where the seller’s price stops: under FCA Felixstowe, the price covers delivery to the carrier at Felixstowe, and the buyer arranges the sea freight from there.',
        'The packages, marks and weights connect the invoice to the cartons on the pallet and to the packing list. The payment terms and the signature close the document. The ITA notes that some countries require a specific form, but most accept the seller’s own layout when the information is complete.',
      ],
    },
    {
      heading: 'How do the figures in the example add up?',
      paragraphs: [
        'Check the arithmetic before you send any invoice, because the total is what the importing country values the goods from. The table repeats the three lines of the example with the working shown.',
      ],
      table: {
        caption: 'Line totals and weights in the example (invented figures)',
        head: ['Line', 'Quantity × unit price', 'Amount (GBP)', 'Net weight (kg)'],
        rows: [
          ['Mugs, 350 ml', '1,200 × 3.40', '4,080.00', '420.0'],
          ['Dinner plates, 27 cm', '600 × 5.25', '3,150.00', '540.0'],
          ['Serving bowls, 20 cm', '300 × 6.10', '1,830.00', '240.0'],
          ['Total', '2,100 pcs', '9,060.00', '1,200.0'],
        ],
      },
    },
    {
      heading: 'What should you change for your own shipment?',
      paragraphs: [
        'Keep the structure and replace every value. The fields that change most from one order to the next are the ones that cause the most questions when they are wrong.',
      ],
      list: [
        'The Incoterms® rule and place: the price on the invoice must match what the rule says it includes. A DAP price includes the main carriage; an FCA price does not.',
        'The port of entry: required on a US import invoice under 19 CFR 141.86; for other countries, check the importing country’s own rules.',
        'The country of origin: per line when the goods come from different countries, once for the shipment when they do not.',
        'The currency: the one the sale was agreed in, stated once and used for every figure.',
        'The HS codes: your own classification, looked up in the official tariff of the importing country.',
        'Any statement your goods need: for US exports of items on the Commerce Control List, 15 CFR 758.6 makes the destination control statement part of the commercial invoice, with stated exceptions.',
      ],
    },
    {
      heading: 'How does the example differ from a proforma invoice?',
      paragraphs: [
        'A proforma invoice is the quotation; the commercial invoice records what was actually shipped. The ITA says a commercial invoice carries the proforma’s information plus details such as the HS codes, so the two look alike. The differences are in the facts behind them.',
        'Our separate proforma invoice example shows the quotation stage for an invented order. When the goods leave, the commercial invoice replaces estimates with the shipped quantities, the actual weights and the real package count, and drops the validity date, because the offer has been accepted.',
      ],
    },
    {
      heading: 'Which mistakes would make this invoice fail?',
      paragraphs: [
        'Most problems with an invoice are not missing boxes but figures that do not agree with each other or with the goods. These are the ones to check on every invoice before it goes:',
      ],
      list: [
        'Line amounts that do not equal quantity × unit price, or a total that does not equal the sum of the lines.',
        'A package count or gross weight that differs from the packing list and from the cartons themselves.',
        'An Incoterms® rule without a named place, or a price that does not match the rule.',
        'Descriptions by brand or part number alone, with no plain-words description of the goods.',
        'An invoice in a language the importing country does not accept: 19 CFR 141.86 asks for English or an accurate English translation for US entries.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does a commercial invoice need a signature?',
      a: 'It depends on the importing country and the carrier, so check both before you ship. Where a signature is asked for, it should be the name and title of the person responsible for the figures.',
    },
    {
      q: 'Can I write a commercial invoice in my own format?',
      a: 'Usually yes. The ITA says most countries accept the seller’s own version if all the pertinent information is included, though a few require a specific form.',
    },
    {
      q: 'What currency should a commercial invoice use?',
      a: 'The currency the sale was agreed in. State it once, clearly, and use it for every price and total on the invoice.',
    },
    {
      q: 'Should the commercial invoice show the HS code?',
      a: 'The ITA lists HS codes among the details a commercial invoice carries, because the code may help import clearance. Look the code up in the importing country’s official tariff.',
    },
    {
      q: 'Is a commercial invoice needed for goods sent free of charge?',
      a: 'Customs still has to value goods that are not sold. CBP, for example, expects the importer to use reasonable care to value samples, so the invoice states a fair value and says the goods are free of charge. Our post on commercial invoices for samples covers that case.',
    },
  ],
  sources: [
    'a2-trade-gov-commercial-invoice',
    'a2-cornell-19-cfr-141-86',
    'a2-cornell-15-cfr-758-6',
    'icc-incoterms-2020',
    'w2-cbp-samples',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  callout: {
    afterSection: 1,
    tool: '/tools/invoice-generator',
    title: 'Fill in this example with your own figures',
    text: 'The commercial invoice generator has the fields from the example, adds up the lines and downloads a PDF. No account, and nothing you type is stored.',
  },
  related: [
    '/blog/packing-list-example',
    '/blog/commercial-invoice-requirements',
    '/blog/how-to-fill-out-a-commercial-invoice',
    '/blog/proforma-invoice-example',
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/blog/commercial-invoice-for-samples',
  ],
  cover: {
    id: 'tQQ4BwN_UFs',
    src: 'https://images.unsplash.com/photo-1554224155-1696413565d3',
    width: 5568,
    height: 3712,
    alt: 'A stack of printed papers seen from above, like the invoice pages kept for a shipment',
    caption: 'A stack of papers, photographed from above',
    photographer: { name: 'Kelly Sikkema', profile: 'https://unsplash.com/@kellysikkema' },
    page: 'https://unsplash.com/photos/stack-of-papers-flat-lay-photography-tQQ4BwN_UFs',
  },
};

export default article;
