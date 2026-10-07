import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "packing list example" 390, KD 10;
 * "packing list sample" 210; "packing list format" 210. The head term ("packing list" 40,500)
 * and template intent stay with the generator page; this post shows a filled-in example.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A.
 */
const article: ContentArticle = {
  slug: 'packing-list-example',
  title: 'Packing list example: a filled-in sample, package by package',
  metaTitle: 'Packing list example: a filled-in sample',
  description:
    'A complete export packing list example with invented parties: the header, every carton range with contents, weights and sizes, and how it ties to the invoice.',
  lede: 'A packing list answers one question for everyone who handles the shipment: what is in each package? Below is a complete example for an invented export of tableware, laid out package by package, then what each column is for and the layout choices that keep it readable.',
  answer:
    'A packing list example shows the shipper and consignee, the invoice it belongs to, and every package with its marks and numbers, contents, quantity, net and gross weight and dimensions, then the totals: number of packages, total quantity, total weights and volume. It carries no prices; those stay on the commercial invoice.',
  keyFacts: [
    'The ITA says a packing list itemises the contents of each package, with weights, measurements and detailed lists of the goods.',
    'According to the ITA, freight forwarders use the packing list to determine weights and freight costs.',
    'The ITA notes that customs officials use the packing list to check the contents of a specific package or carton.',
    'Under 19 CFR 141.86(e), a US import invoice must state in adequate detail what merchandise is in each individual package.',
    '19 CFR 141.86(i) allows invoice information to be given on an attachment, which is the role a packing list often fills.',
  ],
  definitions: [
    {
      term: 'Packing list',
      meaning:
        'A document listing what each package in a shipment contains, with weights and sizes.',
    },
    {
      term: 'Carton number range',
      meaning:
        'A run of package numbers, such as C/No. 1–50, used when identical packages hold identical goods.',
    },
    {
      term: 'Gross weight',
      meaning: 'The weight of a package with its contents and all packing materials.',
    },
    {
      term: 'Net weight',
      meaning: 'The weight of the goods alone, without the carton or packing.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does a complete packing list look like?',
      paragraphs: [
        'The example below is invented: a pottery in England shipping stoneware tableware to a retailer in Oregon. It is the packing list for the same order as our commercial invoice example, so the two can be read side by side. Names, numbers and weights are made up to show the layout.',
        'The header identifies the shipment and ties the list to its invoice. The package table that follows does the real work.',
      ],
      table: {
        caption: 'Example packing list header (invented parties and figures)',
        head: ['Field', 'Example entry'],
        rows: [
          ['Document title', 'PACKING LIST'],
          ['Packing list number and date', 'PL-2026-031, 7 October 2026'],
          ['Invoice reference', 'INV-2026-031; buyer reference PO 4471'],
          [
            'Shipper (exporter)',
            'Example Ceramics Ltd, Unit 4, Kiln Lane, Stoke-on-Trent ST1 0AA, United Kingdom',
          ],
          ['Consignee', 'Sample Homeware Inc, 200 Harbor Way, Portland, OR 97201, United States'],
          ['Terms of sale', 'FCA Felixstowe, Incoterms® 2020'],
          ['Shipping marks', 'SHW / PORTLAND / PO 4471 / C/No. 1–130'],
          ['Type of packages', 'Corrugated cartons on pallets'],
        ],
      },
    },
    {
      heading: 'How are the packages listed in the example?',
      paragraphs: [
        'Each row is a run of identical cartons holding identical goods, which keeps a 130-carton shipment to three rows. Weights and sizes are given per carton and as row totals, so a reader can check any single carton and the whole shipment from the same table.',
      ],
      table: {
        caption: 'Example package table (invented figures)',
        head: [
          'Cartons',
          'Contents per carton',
          'Quantity',
          'Net kg (each / row)',
          'Gross kg (each / row)',
          'Size per carton',
        ],
        rows: [
          [
            'C/No. 1–50 (50)',
            'Stoneware mugs, 350 ml, 24 pcs',
            '1,200 pcs',
            '8.4 / 420.0',
            '10.0 / 500.0',
            '40 × 30 × 30 cm',
          ],
          [
            'C/No. 51–100 (50)',
            'Stoneware dinner plates, 27 cm, 12 pcs',
            '600 pcs',
            '10.8 / 540.0',
            '12.5 / 625.0',
            '30 × 30 × 25 cm',
          ],
          [
            'C/No. 101–130 (30)',
            'Stoneware serving bowls, 20 cm, 10 pcs',
            '300 pcs',
            '8.0 / 240.0',
            '9.5 / 285.0',
            '45 × 25 × 25 cm',
          ],
          ['Total: 130 cartons', '', '2,100 pcs', '1,200.0', '1,410.0', '3.77 m³'],
        ],
      },
    },
    {
      heading: 'What is each column of the example for?',
      paragraphs: [
        'The carton numbers match the marks on the boxes. If customs opens carton 73, the officer finds it in the second row and knows to expect 12 dinner plates. That is the check the ITA describes: customs uses the packing list to look into a specific package.',
        'The contents column names the goods in the same words as the invoice line and says how many are in one carton. The quantity column multiplies that by the number of cartons, which is the figure the invoice must also show.',
        'Net weight is the goods alone and gross weight adds the carton and packing. The forwarder prices the freight from the gross weights and the sizes, which the ITA names as a main use of the list. The volume total here is the sum of length × width × height for every carton: 1.800 m³ for the mug cartons, 1.125 m³ for the plates and 0.844 m³ for the bowls.',
        'There are no prices anywhere on it. A packing list travels with the goods and is read by warehouse staff, drivers and inspectors; the values belong on the commercial invoice.',
      ],
    },
    {
      heading: 'How does the packing list tie to the commercial invoice?',
      paragraphs: [
        'It carries the same parties, the same invoice number and the same goods, and its totals equal the invoice’s figures. In the example, both documents say 2,100 pieces in three lines, 130 cartons, a net weight of 1,200.0 kg and a gross weight of 1,410.0 kg.',
        'For a US entry, 19 CFR 141.86 asks the invoice to state what is in each package, and allows that information on an attachment. A packing list that disagrees with its invoice therefore leaves customs with two different accounts of one shipment. Our post on why the commercial invoice and packing list must match goes through each field that has to agree.',
      ],
    },
    {
      heading: 'Should a packing list go line by line or package by package?',
      paragraphs: [
        'Use package by package when cartons hold different things or when anyone may need to find a single carton: it is the layout the ITA’s description and 19 CFR 141.86(e) both point to. Use line by line, with a package count per line, for small or simple shipments where each line is packed in its own cartons.',
      ],
      list: [
        'Mixed cartons, where one box holds several products: list each carton or carton range with every product inside it.',
        'Identical cartons with identical contents: one row per carton range, as in the example.',
        'Pallets: say how many cartons are on each pallet and give the pallet’s own gross weight and size, because the forwarder handles the pallet.',
        'A small parcel shipment: one row per line, with the number of boxes, can be enough.',
      ],
    },
    {
      heading: 'Which mistakes make a packing list useless?',
      paragraphs: [
        'A packing list fails when it cannot be matched to the boxes or to the invoice. These are the errors that cause that:',
      ],
      list: [
        'Carton numbers on the list that do not match the marks on the cartons.',
        'Quantities that add up differently from the invoice, often after a last-minute change to the packing.',
        'Gross weights estimated rather than weighed, so they disagree with the carrier’s scale.',
        'Descriptions shortened to codes or SKUs that a customs officer cannot read.',
        'Totals left out, so nobody can check the package count against the transport booking.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does a packing list show prices?',
      a: 'Normally not. The packing list describes the physical shipment; values belong on the commercial invoice. Leaving prices off also keeps them away from everyone who handles the boxes.',
    },
    {
      q: 'Is a packing list the same as a delivery note?',
      a: 'They overlap. A delivery note confirms what was delivered to the receiver; an export packing list itemises each package with weights and sizes for forwarders and customs.',
    },
    {
      q: 'Who signs a packing list?',
      a: 'The shipper prepares it. Whether it must also be signed depends on who reads it, so check what the buyer, the bank under a letter of credit or the importing country asks for.',
    },
    {
      q: 'Do I need a packing list for a single box?',
      a: 'Ask your carrier what it requires for the shipment. Even when it is optional, a packing list helps whenever one box holds several different products, because it says what is inside without opening it.',
    },
    {
      q: 'What units should the weights be in?',
      a: 'Use the units your buyer and carrier expect, and the same ones on the invoice. For US entries, 19 CFR 141.86 accepts the weights and measures of the shipping country or of the United States.',
    },
  ],
  sources: ['a2-trade-gov-packing-list', 'a2-cornell-19-cfr-141-86', 'icc-incoterms-2020'],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/cbm-calculator', '/tools/invoice-generator'],
  callout: {
    afterSection: 1,
    tool: '/tools/packing-list-generator',
    title: 'Make this packing list with your own figures',
    text: 'The packing list generator takes the packages, quantities and net and gross weights for each line and downloads a PDF with the totals. No account, nothing stored.',
  },
  related: [
    '/blog/commercial-invoice-example',
    '/blog/packing-list-for-shipping',
    '/blog/how-to-make-a-packing-list-from-your-invoice',
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/guides/gross-weight-vs-net-weight',
    '/blog/shipping-marks',
  ],
  cover: {
    id: 'CxBV9i3gWHc',
    src: 'https://images.unsplash.com/photo-1545287072-e39ac363b3c8',
    width: 5040,
    height: 3360,
    alt: 'Brown cardboard boxes with printed labels, the cartons a packing list identifies one by one',
    caption: 'Labelled brown cardboard boxes',
    photographer: { name: 'Toby Stodart', profile: 'https://unsplash.com/@tobystodart' },
    page: 'https://unsplash.com/photos/brown-labeled-box-lot-CxBV9i3gWHc',
  },
};

export default article;
