import type { UnsplashPhoto } from '@/lib/content/images';
import { BYLINE, articleWordCount, type ContentArticle } from '@/lib/content/article';

/**
 * The blog, as data.
 *
 * One module renders the /blog hub, every post, the sitemap entries, llms.txt, the RSS feed
 * and the Article structured data. Posts share the guides' shape and rules
 * (lib/content/article): sourced facts only, a team byline, invented parties in examples
 * labelled as such, and the not-advice note on every page.
 *
 * Each post targets a query with measured demand in docs/research/content-plan-2026-10-05.md
 * (DataForSEO, Google US, 2026-10-05) and leads to the tool that does the work:
 *
 * - commercial-invoice-requirements: "what is a commercial invoice" 720, "commercial invoice
 *   example" 390, "how to fill out a commercial invoice" 70, "commercial invoice
 *   requirements" 50 (head term "commercial invoice" 3,600).
 * - proforma-invoice-example: "proforma invoice example(s)" 1,300 + 1,300, "proforma invoice
 *   meaning" 2,400. The definition query ("what is a proforma invoice", 4,400) stays with the
 *   proforma generator page, which answers it, so the two do not compete.
 * - export-documents-checklist: "shipping documents" 590, "export documents" 260, "export
 *   documentation" 260.
 * - packing-list-for-shipping: "packing list for shipping" 210, "shipping packing list" 210,
 *   "export packing list" 40, "packing list for export" 40.
 * - fca-vs-fob: "fca vs fob" 720, one of the Incoterm pairs the plan lists for the blog.
 *
 * "Incodocs alternative" was not written: the plan measured 0 searches and defers it until a
 * sales need exists and the competitor's live pages can be cited with a retrieval date.
 */

export type Post = ContentArticle;

const BLOG_ROUND = '2026-10-06';

export const POST_DISCLAIMER =
  'This article explains general practice to help you ask the right questions. It is not legal, ' +
  'customs or tax advice, and the rules of the countries involved, your contract and your ' +
  'carrier’s terms take precedence over anything here. Worked examples use invented parties.';

export const POSTS: readonly Post[] = [
  {
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
  },
  {
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
    tools: [
      '/tools/proforma-invoice-generator',
      '/tools/invoice-generator',
      '/tools/cbm-calculator',
    ],
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
  },
  {
    slug: 'export-documents-checklist',
    title: 'Export documents checklist for small exporters',
    metaTitle: 'Export documents checklist for small exporters',
    description:
      'The shipping documents a typical export needs, who prepares each one, when it is issued and who reads it: proforma, commercial invoice, packing list, bill of lading, EEI and licences.',
    lede: 'A first export usually fails on paperwork, not on freight. This checklist lists the documents a typical shipment uses, who produces each one and in what order, so nothing is missing when the goods reach the port.',
    answer:
      'Most exports need a commercial invoice, a packing list and a transport document: a bill of lading for sea freight or an air waybill for air. Many also need a proforma invoice before the sale, an export filing such as Electronic Export Information in the U.S., and, for some goods or destinations, an export licence or proof of origin.',
    keyFacts: [
      'The commercial invoice, the packing list and the transport document are the core of almost every export shipment.',
      'A bill of lading is the contract between the owner of the goods and the carrier; for ocean freight it can be negotiable.',
      'In the United States, Electronic Export Information is filed in the Automated Export System when a Schedule B line is worth over $2,500 or another filing requirement applies.',
      'An export licence authorises specific goods, in specific quantities, to a particular destination.',
      'The seller prepares the invoice and packing list; the carrier issues the transport document.',
    ],
    definitions: [
      {
        term: 'Bill of lading',
        meaning:
          'The carrier’s receipt and contract of carriage for sea freight; an original may be needed to collect the goods.',
      },
      {
        term: 'Air waybill',
        meaning: 'The transport document that accompanies an air freight shipment.',
      },
      {
        term: 'EEI (Electronic Export Information)',
        meaning: 'The U.S. export data filed through the Automated Export System (AES).',
      },
      {
        term: 'Destination control statement',
        meaning:
          'A statement on the invoice or shipping documents telling the parties the goods are subject to export restrictions.',
      },
    ],
    published: BLOG_ROUND,
    updated: BLOG_ROUND,
    reviewed: BLOG_ROUND,
    byline: BYLINE,
    sections: [
      {
        heading: 'Which documents does an export shipment need?',
        paragraphs: [
          'The exact set depends on the goods, the destination, the mode of transport and the payment terms. The U.S. International Trade Administration’s list of common export documents is a good map of what a typical shipment can involve. The table sorts them by who produces them and when.',
        ],
        table: {
          caption: 'Common export documents, who issues them and when',
          head: ['Document', 'Who issues it', 'When', 'Who relies on it'],
          rows: [
            [
              'Proforma invoice',
              'Seller',
              'Before the sale is final',
              'Buyer, its bank, licensing bodies',
            ],
            ['Commercial invoice', 'Seller', 'When the goods ship', 'Buyer, customs at both ends'],
            ['Packing list', 'Seller', 'When the goods are packed', 'Forwarder, customs, buyer'],
            [
              'Bill of lading',
              'Ocean carrier',
              'When the goods are received or loaded',
              'Buyer, banks, the carrier at destination',
            ],
            [
              'Air waybill',
              'Air carrier or its agent',
              'When the goods are accepted',
              'Buyer, the airline, customs',
            ],
            ['EEI filing (U.S.)', 'Exporter or its agent', 'Before export', 'U.S. government'],
            [
              'Export licence',
              'Export control authority',
              'Before shipment, where required',
              'Customs, the carrier',
            ],
          ],
        },
      },
      {
        heading: 'Which documents do you prepare yourself?',
        paragraphs: [
          'Three documents are the seller’s own work, and they are the ones most often wrong because they are typed separately from each other.',
          'The proforma invoice quotes the deal before it is final, so the buyer can arrange payment or a licence. The commercial invoice bills the goods actually shipped and is what customs in the importing country values them from. The packing list itemises the contents, weights and measurements of each package; the ITA notes that forwarders use it to work out freight and customs use it to check the contents.',
          'All three describe the same goods. Prepared from one set of figures, they agree; typed three times, they drift, and a difference between the invoice and the packing list is one of the commonest reasons for a customs query.',
          'Keep the quotation, the confirmed order and the final packing figures together. The proforma is written from the quotation, but the commercial invoice and the packing list must be written from what was actually packed, because that is what the forwarder will weigh and customs may open.',
        ],
      },
      {
        heading: 'Which documents do carriers and authorities issue?',
        paragraphs: [
          'The transport document comes from the carrier. For sea freight it is the bill of lading, which the ITA describes as a contract between the owner of the goods and the carrier. It can be negotiable, and the buyer usually needs an original to take the goods. For air freight it is the air waybill.',
          'In the United States, Electronic Export Information (EEI) is filed through the Automated Export System. The ITA states it is required when the value of the goods under a single Schedule B number is over $2,500, or when another mandatory filing requirement applies, such as goods that need a licence. Other countries have their own export declaration, usually lodged by the exporter or its forwarder.',
          'Some goods need an export licence: a government document authorising specific goods, in specific quantities, to a particular destination. Controlled goods may also need a destination control statement on the invoice. Where a trade agreement, the buyer’s bank or the importing country asks for proof of origin, that is a separate document with its own issuing rules. TradeDocs does not prepare licences or origin documents.',
        ],
      },
      {
        heading: 'In what order are export documents prepared?',
        paragraphs: [
          'The order follows the shipment. Getting it right means each document is built on figures that are already settled.',
        ],
        steps: [
          'Quote the deal with a proforma invoice, naming the Incoterms® rule, its place and the version.',
          'Once the order is confirmed and payment is arranged, check whether the goods or the destination need a licence.',
          'Pack the goods and record each package’s contents, dimensions and weights on the packing list.',
          'Issue the commercial invoice from the same figures, with the HS codes and country of origin.',
          'Book the transport and give the forwarder the invoice and packing list.',
          'File the export declaration, such as EEI in the U.S., where required.',
          'Collect the bill of lading or air waybill and send the document set to the buyer or its bank.',
        ],
      },
      {
        heading: 'What does the checklist look like before the goods leave?',
        paragraphs: [
          'Run through this list for every shipment, not only the first one. Each line is a question with a yes or no answer.',
        ],
        list: [
          'Do the seller, buyer and consignee appear the same way on every document?',
          'Do the invoice and the packing list show the same lines, quantities and package count?',
          'Do the net and gross weights on the packing list match what the forwarder will weigh?',
          'Does every invoice line have a plain description, an HS code and a country of origin?',
          'Is the Incoterms® rule written with its named place and version, the same on every document?',
          'Has the export declaration been filed where one is required?',
          'If payment is by letter of credit, does every document match the credit’s wording exactly?',
        ],
      },
    ],
    faq: [
      {
        q: 'What are the three main export documents?',
        a: 'The commercial invoice, the packing list and the transport document, which is a bill of lading for sea freight or an air waybill for air freight. Most other documents depend on the goods, the destination or the payment terms.',
      },
      {
        q: 'Who prepares the bill of lading?',
        a: 'The carrier or its agent issues it, usually from shipping instructions the exporter or its forwarder provides. The exporter checks the draft against the invoice and packing list before it is issued.',
      },
      {
        q: 'When is EEI required for U.S. exports?',
        a: 'According to the U.S. International Trade Administration, when the value of the goods under one Schedule B number is over $2,500, or when another mandatory filing requirement applies, such as goods that need an export licence.',
      },
      {
        q: 'Do small shipments need a commercial invoice?',
        a: 'Yes, for goods crossing a border, whatever the size.',
      },
      {
        q: 'Which export documents must match each other?',
        a: 'The commercial invoice, the packing list and the transport document must agree on the parties, the goods, the package count and the weights. Where payment is by letter of credit, every document must also match the credit’s terms.',
      },
    ],
    sources: [
      'trade-gov-export-documents',
      'trade-gov-commercial-invoice',
      'trade-gov-packing-list',
      'trade-gov-proforma-invoice',
      'icc-incoterms-2020',
    ],
    primaryTool: '/tools/invoice-generator',
    tools: [
      '/tools/invoice-generator',
      '/tools/packing-list-generator',
      '/tools/proforma-invoice-generator',
    ],
    callout: {
      afterSection: 1,
      tool: '/tools/packing-list-generator',
      title: 'Prepare the packing list alongside the invoice',
      text: 'The packing list generator itemises packages with net and gross weights per line and downloads a PDF, so the figures match the invoice you send with it.',
    },
    cover: {
      id: 'zQCDJZLS-Ms',
      src: 'https://images.unsplash.com/photo-1743385779431-45d26d9775b1',
      width: 7008,
      height: 4672,
      alt: 'Clipboard with a pencil and pen on a wooden desk, ready for working through an export documents checklist',
      caption: 'Clipboard, pencil and pen on a wooden surface',
      photographer: { name: 'Kelly Sikkema', profile: 'https://unsplash.com/@kellysikkema' },
      page: 'https://unsplash.com/photos/clipboard-pencil-and-pen-on-a-wooden-surface-zQCDJZLS-Ms',
    },
  },
  {
    slug: 'packing-list-for-shipping',
    title: 'Packing list for shipping: what it is and what goes on it',
    metaTitle: 'Packing list for shipping: what goes on it',
    description:
      'What an export packing list is, who relies on it, the fields it needs, how it differs from the commercial invoice, and a worked example with weights and dimensions.',
    lede: 'The commercial invoice says what the goods are worth. The packing list says where they are: which carton holds what, how much each one weighs and how big it is. Forwarders, customs and the buyer’s warehouse all work from it.',
    answer:
      'A packing list for shipping itemises the contents of each package in a consignment, with the package count, marks and numbers, dimensions, and net and gross weights. It carries no prices. Forwarders use it to work out freight, customs use it to check the contents, and the buyer uses it to check the delivery.',
    keyFacts: [
      'A packing list itemises the contents of each package, with weights, measurements and a detailed list of the goods.',
      'Forwarders use the packing list to determine weights and freight costs.',
      'Customs officials use the packing list to check the contents of packages.',
      'A packing list normally carries no prices; values belong on the commercial invoice.',
      'For U.S. imports, 19 CFR 141.86 requires the invoice to state in adequate detail what each package contains.',
    ],
    definitions: [
      {
        term: 'Packing list',
        meaning:
          'A package-by-package statement of what a consignment contains, with weights and dimensions.',
      },
      {
        term: 'Net weight',
        meaning: 'The weight of the goods alone, without packaging.',
      },
      {
        term: 'Gross weight',
        meaning: 'The weight of the goods with all their packaging, as the carrier will weigh it.',
      },
      {
        term: 'Shipping marks',
        meaning:
          'The marks and numbers printed on each package so it can be matched to the documents.',
      },
    ],
    published: BLOG_ROUND,
    updated: BLOG_ROUND,
    reviewed: BLOG_ROUND,
    byline: BYLINE,
    sections: [
      {
        heading: 'What is a packing list in shipping?',
        paragraphs: [
          'In export shipping, a packing list is the document that itemises the contents of each package, whether that is a carton, a crate or a pallet. The U.S. International Trade Administration describes it as including weights, measurements and detailed lists of the goods in each package.',
          'It is a different document from a travel packing list or a warehouse packing slip. An export packing list follows the goods across a border, travels with the commercial invoice and the transport document, and is read by people who will never open the cartons unless something on it looks wrong.',
        ],
      },
      {
        heading: 'Who uses the packing list?',
        paragraphs: [
          'Several parties rely on the same document for different reasons, which is why one inaccurate line causes trouble in several places at once.',
        ],
        list: [
          'The forwarder or carrier, to work out weights, volume and the freight charge, and to plan loading.',
          'Customs at export and import, to check what is in each package against the invoice and to select packages for inspection.',
          'The consolidator, in an LCL shipment, to keep your packages together among other shippers’ cargo.',
          'The buyer’s warehouse, to check the delivery carton by carton and report anything missing.',
          'The buyer’s bank, where a letter of credit asks for a packing list among the documents.',
        ],
      },
      {
        heading: 'What goes on an export packing list?',
        paragraphs: [
          'The packing list repeats the parties and references of the commercial invoice, so the two can be matched, and then describes the packages rather than the prices.',
        ],
        steps: [
          'Head it with the seller, the buyer and the consignee, the date, and the invoice and order numbers it belongs to.',
          'Number every package and give its shipping marks exactly as printed on the outside.',
          'List what each package contains: the description and quantity of each product, matching the invoice lines.',
          'Give each package’s dimensions, net weight and gross weight, in stated units.',
          'Total the packages, the net and gross weights and the volume at the foot.',
          'Add the Incoterms® rule and place, the mode of transport and, once known, the container and seal numbers.',
        ],
      },
      {
        heading: 'What is the difference between a packing list and a commercial invoice?',
        paragraphs: [
          'They describe the same shipment from two angles. The invoice is about money and classification; the packing list is about physical packages. Customs compares them, so every shared figure must agree.',
        ],
        table: {
          caption: 'Packing list and commercial invoice compared',
          head: ['', 'Packing list', 'Commercial invoice'],
          rows: [
            ['Main purpose', 'Describe each package', 'Bill the goods and declare their value'],
            ['Prices and values', 'Not normally shown', 'Shown for every line'],
            ['Weights and dimensions', 'Per package and in total', 'Total weights, often'],
            ['Package marks and numbers', 'Always', 'Usually, as a summary'],
            [
              'Read by customs to',
              'Check contents and choose packages to inspect',
              'Assess duties and taxes',
            ],
            [
              'Read by the forwarder to',
              'Calculate freight and plan loading',
              'Prepare the export declaration',
            ],
          ],
        },
      },
      {
        heading: 'What does a filled-in packing list look like?',
        paragraphs: [
          'The lines below are an invented example for three pallets of machine parts. Figures are made up to show the layout and the arithmetic, not taken from a real shipment.',
          'Note that the gross weight of each pallet includes the pallet and packaging, and that the totals at the foot are simple sums of the lines. A forwarder will check those totals against what its scale and tape measure say.',
        ],
        table: {
          caption: 'Example packing list lines (invented figures)',
          head: ['Package', 'Marks', 'Contents', 'Dimensions (cm)', 'Net kg', 'Gross kg'],
          rows: [
            [
              'Pallet 1',
              'EXM/2026/1',
              '120 hydraulic fittings, model HF-20',
              '120 × 80 × 110',
              '310',
              '345',
            ],
            [
              'Pallet 2',
              'EXM/2026/2',
              '120 hydraulic fittings, model HF-20',
              '120 × 80 × 110',
              '310',
              '345',
            ],
            [
              'Pallet 3',
              'EXM/2026/3',
              '60 pump housings, model PH-5',
              '120 × 80 × 95',
              '280',
              '312',
            ],
            ['Total', '3 pallets', '', '3.02 m³', '900', '1,002'],
          ],
        },
      },
      {
        heading: 'How detailed should the contents of each package be?',
        paragraphs: [
          'Detailed enough that someone holding only the packing list could find any item without opening every package. For goods entering the United States this is not only good practice: 19 CFR 141.86 requires the invoice to state in adequate detail what merchandise each individual package contains, and the packing list is where that detail is normally kept.',
          'In practice that means one line per product per package, using the same description and the same unit as the commercial invoice line it belongs to. If a carton holds three different products, list all three under that carton. If forty identical cartons hold the same product, a single line for cartons 1 to 40, with the quantity per carton and the totals, is clear and checkable.',
          'Mixed pallets need the most care. Give the pallet its own number and marks, list the cartons on it, and state the pallet’s own gross weight, so a customs officer selecting one carton for inspection can find it on the right pallet.',
        ],
      },
      {
        heading: 'Which packing list mistakes cause delays?',
        paragraphs: [
          'Most problems are disagreements between the packing list, the invoice and what is physically in the container.',
        ],
        list: [
          'A package count that differs from the invoice or the bill of lading.',
          'Gross weights estimated rather than weighed, which the forwarder re-measures and re-bills.',
          'Contents described differently from the invoice lines, so customs cannot match them.',
          'Marks on the list that are not the marks on the cartons.',
          'A packing list prepared before the final packing, then not updated when the cartons change.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is a packing list required for export?',
        a: 'Many shipments cannot move without one: forwarders need it to book and price freight, and customs and banks often ask for it. The U.S. International Trade Administration lists it among the documents of the export process.',
      },
      {
        q: 'Does a packing list show prices?',
        a: 'Normally not. Values belong on the commercial invoice. Some buyers ask for a combined invoice and packing list, but the two jobs are easier to check on separate documents.',
      },
      {
        q: 'Where should the packing list go?',
        a: 'With the shipping documents sent to the forwarder and the buyer. The ITA also suggests putting a copy inside the package or attaching one to the outside.',
      },
      {
        q: 'How do I calculate the volume on a packing list?',
        a: 'Multiply each package’s length, width and height in metres to get cubic metres, then add the packages together. A CBM calculator does the conversion from centimetres or inches.',
      },
      {
        q: 'Should the packing list match the commercial invoice?',
        a: 'Yes. The parties, references, product descriptions, quantities and package count should be identical on both, because customs and the buyer compare them line by line.',
      },
    ],
    sources: ['trade-gov-packing-list', 'trade-gov-commercial-invoice', 'us-cbp-invoice-contents'],
    primaryTool: '/tools/packing-list-generator',
    tools: ['/tools/packing-list-generator', '/tools/cbm-calculator', '/tools/invoice-generator'],
    callout: {
      afterSection: 2,
      tool: '/tools/packing-list-generator',
      title: 'Prepare a packing list in the browser',
      text: 'The packing list generator takes packages, contents, dimensions and weights, totals them and downloads a PDF. No account, nothing stored.',
    },
    cover: {
      id: 'BNBA1h-NgdY',
      src: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866',
      width: 6048,
      height: 4024,
      alt: 'Brown cardboard cartons on white warehouse racking, the packages an export packing list itemises',
      caption: 'Brown cardboard boxes on a white metal rack',
      photographer: { name: 'CHUTTERSNAP', profile: 'https://unsplash.com/@chuttersnap' },
      page: 'https://unsplash.com/photos/brown-cardboard-boxes-on-white-metal-rack-BNBA1h-NgdY',
    },
  },
  {
    slug: 'fca-vs-fob',
    title: 'FCA vs FOB: which Incoterms® 2020 rule fits your shipment?',
    metaTitle: 'FCA vs FOB: the difference in Incoterms 2020',
    description:
      'FCA and FOB both leave the main carriage to the buyer. They differ in where risk passes, which transport they suit and what happens with containers. The ICC positions, compared.',
    lede: 'FOB is the trade term most exporters learned first, and FCA is the one that matches how most goods now travel. They look similar on a quotation. Where they differ is the moment the seller stops carrying the risk.',
    answer:
      'Under FCA (Free Carrier) the seller delivers the goods, cleared for export, to the buyer’s carrier at a named place, and risk passes there. Under FOB (Free on Board) the seller delivers on board the vessel at the named port of shipment. FCA suits any transport, containers included; FOB is a sea and inland waterway rule.',
    keyFacts: [
      'FCA and FOB are two of the eleven Incoterms® 2020 rules published by the International Chamber of Commerce (ICC).',
      'Under FCA, risk passes when the goods are handed to the buyer’s nominated carrier at the named place.',
      'Under FOB, risk passes when the goods are on board the vessel at the named port of shipment.',
      'FCA works for any mode of transport; FOB is for sea and inland waterway transport only.',
      'Incoterms® 2020 lets FCA parties agree that the buyer’s carrier will issue an on-board bill of lading to the seller.',
    ],
    definitions: [
      {
        term: 'FCA (Free Carrier)',
        meaning:
          'The seller hands the goods, cleared for export, to the buyer’s carrier at a named place.',
      },
      {
        term: 'FOB (Free on Board)',
        meaning:
          'The seller loads the goods on board the buyer’s vessel at the named port of shipment.',
      },
      {
        term: 'Named place',
        meaning: 'The point written after the rule, where delivery happens and risk passes.',
      },
      {
        term: 'On-board bill of lading',
        meaning:
          'A bill of lading noting that the goods have been loaded on the ship, often required by letters of credit.',
      },
    ],
    published: BLOG_ROUND,
    updated: BLOG_ROUND,
    reviewed: BLOG_ROUND,
    byline: BYLINE,
    sections: [
      {
        heading: 'What do FCA and FOB mean?',
        paragraphs: [
          'Both are rules in the Incoterms® 2020 set, published by the International Chamber of Commerce. In both, the seller clears the goods for export and the buyer contracts and pays for the main carriage, import clearance and everything after delivery. Neither obliges either party to insure.',
          'The difference is the delivery point. FCA, Free Carrier, delivers when the goods are handed to the carrier the buyer has nominated, at a named place such as the seller’s warehouse, a forwarder’s depot or a container terminal. FOB, Free on Board, delivers when the goods are on board the vessel the buyer has nominated, at a named port of shipment.',
        ],
      },
      {
        heading: 'What is the difference between FCA and FOB?',
        paragraphs: ['Most of the obligations are the same. The table shows where they part.'],
        table: {
          caption: 'FCA and FOB compared under Incoterms® 2020',
          head: ['', 'FCA (Free Carrier)', 'FOB (Free on Board)'],
          rows: [
            ['Transport modes', 'Any, including multimodal', 'Sea and inland waterway only'],
            [
              'Delivery point',
              'Handover to the buyer’s carrier at the named place',
              'On board the vessel at the named port',
            ],
            ['Risk passes', 'At that handover', 'Once the goods are on board'],
            ['Export clearance', 'Seller', 'Seller'],
            ['Main carriage', 'Buyer contracts and pays', 'Buyer contracts and pays'],
            [
              'Loading',
              'Seller loads only if the named place is its own premises',
              'Seller loads on board',
            ],
            ['Insurance', 'Not required of either party', 'Not required of either party'],
            [
              'Typical cargo',
              'Containers, air, road, rail, courier',
              'Bulk and break-bulk loaded at the ship’s side',
            ],
          ],
        },
      },
      {
        heading: 'Why is FOB a poor fit for container shipments?',
        paragraphs: [
          'A container is usually handed over at a terminal or depot, often days before it is lifted on board. Under FOB the seller still carries the risk during that wait, for goods it no longer controls and cannot inspect. If the container is damaged in the terminal, the loss sits with the party that had no way to prevent it.',
          'FCA moves the risk at the handover, which is what actually happens. That is why FCA is the usual recommendation for containerised cargo, and why FOB is better kept for cargo the seller can see loaded onto the ship, such as bulk commodities.',
          'Habit keeps FOB in use. Buyers ask for “FOB prices” and sellers quote them, sometimes with an inland place such as “FOB factory” that the rule does not allow. If the goods will leave in a container from your premises or a depot, quote FCA and name that place.',
        ],
      },
      {
        heading: 'Can you get an on-board bill of lading under FCA?',
        paragraphs: [
          'This was the main practical objection to FCA: a letter of credit often asks for a bill of lading marked “on board”, and under FCA the seller delivers before the goods are loaded. Incoterms® 2020 added an option for exactly this case.',
          'If the parties agree it, the buyer must instruct its carrier to issue an on-board bill of lading to the seller after loading. The carrier is not a party to the sale contract, so the rules cannot oblige it to do so; the buyer’s instruction is what makes it happen. Agree the option in the contract and check the letter of credit matches.',
        ],
      },
      {
        heading: 'How should the named place be written?',
        paragraphs: [
          'Under both rules the place decides who pays for what, so write it precisely and add the version.',
        ],
        list: [
          'FCA at the seller’s premises: “FCA Leeds, seller’s warehouse, 12 Example Road, Incoterms® 2020”. The seller loads the buyer’s vehicle.',
          'FCA anywhere else: “FCA Felixstowe, forwarder’s depot, Incoterms® 2020”. The seller delivers ready for unloading.',
          'FOB: “FOB Durban, Incoterms® 2020”. A port of shipment, never an inland place.',
        ],
      },
      {
        heading: 'What should the invoice say under FCA or FOB?',
        paragraphs: [
          'The rule, the named place and the version belong in the terms of sale on the proforma and the commercial invoice, written exactly as in the contract. Customs in the importing country reads that line to understand what the invoice price covers.',
          'Under both FCA and FOB the price normally excludes the main freight and insurance, because the buyer pays for them. Where the importing country values goods on a basis that includes freight and insurance, the importer adds those costs at entry, so a correct rule on the invoice saves questions about missing charges.',
          'If you switch a customer from FOB to FCA, change the wording on every document at the same time, and tell the buyer’s forwarder where the handover now happens. The forwarder’s booking, the bill of lading and the invoice should all describe the same delivery point.',
        ],
      },
      {
        heading: 'Should you quote FCA or FOB?',
        paragraphs: [
          'Choose by how the goods actually leave you. A short decision path:',
          'Whichever you choose, write the same rule, place and version on the proforma, the commercial invoice and the packing list. A quotation that says FOB and an invoice that says FCA leave both sides arguing over the same loss.',
        ],
        steps: [
          'If the goods travel by air, road, rail or courier, use FCA; FOB does not apply.',
          'If they travel in a container handed over at your premises, a depot or a terminal, use FCA and name that place.',
          'If they are bulk or break-bulk cargo loaded at the ship’s side under your supervision, FOB fits.',
          'If a letter of credit requires an on-board bill of lading under FCA, agree the Incoterms® 2020 bill of lading option with the buyer.',
        ],
      },
    ],
    faq: [
      {
        q: 'Is FCA the same as FOB?',
        a: 'No. Under FCA risk passes when the goods are handed to the buyer’s carrier at the named place; under FOB it passes when they are on board the vessel. FCA works for any transport; FOB only for sea and inland waterway.',
      },
      {
        q: 'Who pays freight under FCA and FOB?',
        a: 'The buyer, under both. The seller pays the costs up to delivery, plus export clearance.',
      },
      {
        q: 'Can FOB be used for air freight?',
        a: 'Not under the Incoterms® rules. FOB is a sea and inland waterway rule; for air freight the equivalent is FCA at the airport or the forwarder’s premises.',
      },
      {
        q: 'Which is better for the seller, FCA or FOB?',
        a: 'For container cargo, FCA usually is, because the seller stops carrying the risk when it hands the container over rather than when the ship is loaded days later.',
      },
      {
        q: 'Does FOB mean the seller pays for loading?',
        a: 'Yes. Under FOB the seller delivers on board the vessel, so loading at the port of shipment is the seller’s cost and risk. Under FCA the seller loads only when the named place is its own premises.',
      },
    ],
    sources: ['icc-incoterms-2020', 'trade-gov-commercial-invoice', 'wto-customs-valuation'],
    primaryTool: '/tools/incoterms',
    tools: ['/tools/incoterms', '/tools/invoice-generator', '/tools/landed-cost-calculator'],
    callout: {
      afterSection: 1,
      tool: '/tools/incoterms',
      title: 'Compare all eleven rules on one chart',
      text: 'The Incoterms® 2020 guide sets out where risk passes and who pays what for every rule, with a page for FCA and for FOB.',
    },
    cover: {
      id: '4aOhA4ptIY4',
      src: 'https://images.unsplash.com/photo-1597334948330-38795f25d05d',
      width: 5897,
      height: 3931,
      alt: 'Container ship in the port of Hamburg, where the FCA and FOB rules place the handover differently',
      caption: 'Container ship in the port of Hamburg, Germany',
      photographer: { name: 'Dominik Lückmann', profile: 'https://unsplash.com/@exdigy' },
      page: 'https://unsplash.com/photos/blue-and-red-cargo-ship-4aOhA4ptIY4',
    },
  },
];

/** The /blog hub's cover. */
export const BLOG_HUB_COVER: UnsplashPhoto = {
  id: 'sI2eENXdoBI',
  src: 'https://images.unsplash.com/photo-1691591765923-3bd6f12f4209',
  width: 6000,
  height: 3375,
  alt: 'Large container ship on the water with a port crane behind it',
  caption: 'A large cargo ship in the water with a crane in the background',
  photographer: { name: 'Elijah Mears', profile: 'https://unsplash.com/@elijahjmears' },
  page: 'https://unsplash.com/photos/a-large-cargo-ship-in-the-water-with-a-large-crane-in-the-background-sI2eENXdoBI',
};

/** The newest post's date, for the hub's sitemap entry and the feed. */
export const BLOG_UPDATED = POSTS.reduce(
  (latest, post) => (post.updated > latest ? post.updated : latest),
  '',
);

export function findPost(slug: string): Post | undefined {
  return POSTS.find((post) => post.slug === slug);
}

/** Visible words in a post, for the content checks. */
export function postWordCount(post: Post): number {
  return articleWordCount(post);
}
