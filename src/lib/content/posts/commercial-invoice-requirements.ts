import { BYLINE, type ContentArticle } from '@/lib/content/article';

const BLOG_ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-05): "what is a commercial invoice" 720, "commercial
 * invoice example" 390, "how to fill out a commercial invoice" 70, "commercial invoice
 * requirements" 50 (head term "commercial invoice" 3,600).
 */
const article: ContentArticle = {
  slug: 'commercial-invoice-requirements',
  title: 'Commercial invoice requirements: what to include, field by field',
  metaTitle: 'Commercial invoice requirements: what to include',
  description:
    'What a commercial invoice must show for export and import clearance: parties, goods, values, origin, Incoterms® rule and the U.S. list in 19 CFR 141.86, with a worked example.',
  lede: 'Customs reads the commercial invoice before it reads anything else. If a field is missing or disagrees with the packing list, the goods wait. Here is what goes on one, why each field is there, and the order to fill it in.',
  answer:
    'A commercial invoice must identify the seller and buyer, describe each item precisely with its quantity, unit price and total, state the currency, the country of origin and the Incoterms® rule with its named place, and itemise charges such as freight and insurance. Customs in the importing country assesses duties and taxes from it.',
  keyFacts: [
    'The commercial invoice is the document customs in the importing country uses to assess import duties and taxes.',
    'For U.S. imports, the required contents of a commercial invoice are set out in 19 CFR 141.86.',
    'U.S. rules require the invoice in English or with an accurate English translation attached.',
    'The U.S. International Trade Administration recommends the HS code on each line to speed clearance.',
    'Quantities, weights and package counts on the invoice should match the packing list and the transport document.',
  ],
  definitions: [
    {
      term: 'Commercial invoice',
      meaning:
        'The seller’s bill for goods sold and shipped, and the basis customs values them from.',
    },
    {
      term: 'HS code',
      meaning: 'The Harmonized System number that classifies a product for duty and statistics.',
    },
    {
      term: 'Incoterms® rule',
      meaning:
        'One of the eleven ICC trade terms, such as FCA or DAP, that says where delivery and risk pass.',
    },
    {
      term: 'Country of origin',
      meaning: 'The country where the goods were produced or last substantially transformed.',
    },
  ],
  published: BLOG_ROUND,
  updated: BLOG_ROUND,
  reviewed: BLOG_ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a commercial invoice?',
      paragraphs: [
        'A commercial invoice is the bill the seller issues for goods it has sold and is shipping across a border. It does two jobs at once. For the buyer it is a request for payment. For customs it is the declaration of what is in the shipment and what it is worth.',
        'The U.S. International Trade Administration (ITA) describes it as a required document for export and import clearance and the one customs officials in the buyer’s country use to assess duties and taxes. That second job is why the level of detail matters: customs can only value, classify and release goods from what the invoice tells it.',
        'It is issued once the sale is final, after any proforma invoice used to quote the deal. Most countries accept the exporter’s own layout as long as the information is complete; a few require a specific form, so check the importing country’s rules before the first shipment.',
      ],
    },
    {
      heading: 'What must a commercial invoice include?',
      paragraphs: [
        'Requirements differ by country, but the same core fields appear everywhere because customs needs the same answers: who is trading, what the goods are, what they cost, where they come from and on what terms they travel.',
      ],
      table: {
        caption: 'Core fields of a commercial invoice and why customs needs them',
        head: ['Field', 'What to write', 'Why it is there'],
        rows: [
          [
            'Seller and buyer',
            'Full legal names and addresses; tax or importer numbers where used',
            'Identifies the parties to the sale and the importer of record',
          ],
          [
            'Invoice number and date',
            'A unique number and the date of issue',
            'Ties payment, customs entry and other documents to one record',
          ],
          [
            'Description of goods',
            'Plain words a customs officer can classify, with grade or model',
            'Classification and valuation start here',
          ],
          [
            'HS code',
            'The tariff classification of each line',
            'Speeds clearance; the ITA recommends it',
          ],
          [
            'Quantity and unit',
            'Number of units per line, in a stated unit',
            'Lets customs check the goods against the invoice',
          ],
          [
            'Unit price and line total',
            'In the currency of the sale',
            'The transaction value customs normally starts from',
          ],
          [
            'Currency',
            'One currency for the whole invoice, stated once',
            'Converted at the importing country’s official rate',
          ],
          [
            'Charges',
            'Freight, insurance, packing and commissions, itemised',
            'Some countries add them to the customs value',
          ],
          [
            'Incoterms® rule and place',
            'For example “FCA Rotterdam terminal, Incoterms® 2020”',
            'Shows which costs the price includes',
          ],
          [
            'Country of origin',
            'For each line, where it differs',
            'Decides the duty rate and any preference',
          ],
          [
            'Packages, marks and weights',
            'Package count, marks and numbers, net and gross weight',
            'Must agree with the packing list and the transport document',
          ],
        ],
      },
    },
    {
      heading: 'What does U.S. customs require on a commercial invoice?',
      paragraphs: [
        'For goods entering the United States the list is written into regulation. 19 CFR 141.86, the U.S. Customs and Border Protection (CBP) rule on the contents of invoices, requires among other things:',
        'Two further paragraphs of the same section catch exporters out. The invoice must be in English or come with an accurate English translation, and it must state in adequate detail what merchandise is in each individual package, which is why the package marks and the per-package contents matter as much as the totals.',
      ],
      list: [
        'the port of entry the goods are destined for',
        'the time, place and parties of the sale, or how the goods were procured if they were not sold',
        'a detailed description of the merchandise, with the name each item is known by, its grade or quality, and the marks, numbers and symbols on the packages',
        'the quantities, in the weights and measures of the country of origin or of the United States',
        'the purchase price of each item in the currency of the purchase',
        'all charges on the merchandise itemised by name and amount, including freight, insurance, commission, containers, coverings and the cost of packing',
        'all rebates, drawbacks and bounties, itemised separately',
        'the country of origin',
      ],
    },
    {
      heading: 'How do you fill out a commercial invoice?',
      paragraphs: [
        'Fill the invoice in the order customs reads it, from the parties to the totals. Working from the confirmed order and the final packing figures, rather than the original quotation, avoids the most common mismatch.',
      ],
      steps: [
        'Enter the seller, the buyer and, if different, the consignee and the importer of record, with full addresses.',
        'Give the invoice a unique number and date, and reference the order or proforma number it follows.',
        'State the Incoterms® rule, its named place and the version, for example “DAP Lyon, buyer’s warehouse, Incoterms® 2020”.',
        'List each product on its own line: a plain description, the HS code, the country of origin, the quantity and unit, the unit price and the line total.',
        'Itemise freight, insurance, packing and any other charges separately, then show the invoice total and the currency.',
        'Add the package count, marks and numbers, and the total net and gross weight, taken from the packing list.',
        'Check every total against the packing list and the booking before the documents leave.',
      ],
    },
    {
      heading: 'What does a filled-in commercial invoice look like?',
      paragraphs: [
        'The lines below are an invented example for a small shipment of ceramic tableware from Portugal to the United States, sold FCA at the seller’s premises. The parties and figures are made up to show the layout; they are not a template for any real transaction.',
      ],
      table: {
        caption: 'Example commercial invoice lines (invented parties and figures)',
        head: ['Line', 'Description', 'Origin', 'Quantity', 'Unit price', 'Total'],
        rows: [
          [
            '1',
            'Stoneware dinner plates, 27 cm, glazed',
            'Portugal',
            '1,200 pcs',
            'USD 4.80',
            'USD 5,760.00',
          ],
          [
            '2',
            'Stoneware bowls, 15 cm, glazed',
            'Portugal',
            '800 pcs',
            'USD 3.90',
            'USD 3,120.00',
          ],
          ['3', 'Packing in export cartons', '', '40 cartons', 'USD 6.00', 'USD 240.00'],
          [
            '',
            'Invoice total, FCA Aveiro seller’s premises, Incoterms® 2020',
            '',
            '',
            '',
            'USD 9,120.00',
          ],
        ],
      },
    },
    {
      heading: 'Which mistakes delay customs clearance?',
      paragraphs: [
        'Most holds come from an invoice that is incomplete or that disagrees with the other documents, not from anything exotic. The usual ones:',
      ],
      list: [
        'Vague descriptions such as “samples”, “parts” or “gifts” that customs cannot classify.',
        'Totals, package counts or weights that differ from the packing list or the bill of lading.',
        'An Incoterms® rule without a named place, or a rule that contradicts the freight charges shown.',
        'Missing country of origin, or one origin stated for lines that come from different countries.',
        'A value below the price actually paid. Customs normally values goods from the transaction value, so an understated invoice is a false declaration, whatever the buyer asks for.',
      ],
    },
  ],
  faq: [
    {
      q: 'Who prepares the commercial invoice?',
      a: 'The seller or exporter, or a forwarder acting on its instructions. The data on it remains the seller’s declaration, whoever types it.',
    },
    {
      q: 'Does a commercial invoice need an HS code?',
      a: 'Not every country requires it on the invoice, but the U.S. International Trade Administration recommends it because it speeds clearance. The importer’s customs declaration will need the classification either way.',
    },
    {
      q: 'Can I use the same commercial invoice for every country?',
      a: 'The core fields work almost everywhere, but some importing countries require extra statements, a specific form or a language. Check the destination’s rules, and for U.S. imports the list in 19 CFR 141.86.',
    },
    {
      q: 'What currency should the commercial invoice be in?',
      a: 'The currency of the sale, stated once and used for every price on the invoice. U.S. rules ask for the purchase price of each item in the currency of the purchase.',
    },
    {
      q: 'Is a commercial invoice the same as a proforma invoice?',
      a: 'No. A proforma invoice is a quotation issued before the sale is final. The commercial invoice bills the goods actually shipped and is what customs values them from.',
    },
  ],
  sources: [
    'trade-gov-commercial-invoice',
    'us-cbp-invoice-contents',
    'wto-customs-valuation',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  callout: {
    afterSection: 1,
    tool: '/tools/invoice-generator',
    title: 'Fill these fields in the free generator',
    text: 'The commercial invoice generator lays out every field above, adds up the lines and downloads a PDF. No account, no watermark, nothing stored.',
  },
  cover: {
    id: 'xoU52jUVUXA',
    src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
    width: 5563,
    height: 3192,
    alt: 'Person holding a paper document beside a pen and calculator while checking invoice figures',
    caption: 'Person holding paper near a pen and calculator',
    photographer: { name: 'Kelly Sikkema', profile: 'https://unsplash.com/@kellysikkema' },
    page: 'https://unsplash.com/photos/person-holding-paper-near-pen-and-calculator-xoU52jUVUXA',
  },
};

export default article;
