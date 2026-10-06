import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "shipping marks" 590; "pallet labels" 390.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'shipping-marks',
  title: 'Shipping marks: what to print on export cartons and pallets',
  metaTitle: 'Shipping marks: what to put on export cartons',
  description:
    'Shipping marks let every package be matched to the packing list, the invoice and the transport document. What goes in the mark, how to number packages, and an invented example.',
  lede: 'A forwarder’s warehouse may hold thousands of cartons that look exactly like yours. The marks on the outside are how your cartons are found, counted, checked against the paperwork and delivered to the right buyer. They take ten minutes to plan and save days when something goes missing.',
  answer:
    'Shipping marks are the identifying marks and numbers printed on each export package. The ITA lists the usual content: a shipper’s or buyer’s mark, the country of origin, weights in pounds and kilograms, the package number and dimensions, handling and cautionary marks, the port of entry and any hazardous-materials labels. The same marks appear on the packing list and invoice.',
  keyFacts: [
    'The International Trade Administration (ITA) says the overseas buyer usually specifies which export marks should appear on the cargo.',
    'The ITA lists the shipper’s mark, country of origin, weight in pounds and kilograms, number of packages and case size among the marks for export cartons.',
    'Under 19 CFR 141.86, a US import invoice gives the marks and numbers of the packages in which the goods are packed.',
    'CBSA Memorandum D1-4-1 asks for the marks and numbers on packaged goods and says they must be placed legibly on the outside where possible.',
    'The ITA says export markings should help receivers identify shipments and conceal the identity of the contents.',
  ],
  definitions: [
    {
      term: 'Shipping marks',
      meaning:
        'The marks and numbers printed on each package so it can be matched to the documents.',
    },
    {
      term: 'Shipper’s mark',
      meaning:
        'A short code, often the buyer’s initials and an order reference, that identifies whose goods the package holds.',
    },
    {
      term: 'Package number',
      meaning: 'The package’s position in the consignment, written as “3 of 12” or “3/12”.',
    },
    {
      term: 'Cautionary marks',
      meaning:
        'Handling instructions such as “This Side Up” or “Use No Hooks”, in words or pictorial symbols.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What are shipping marks?',
      paragraphs: [
        'Shipping marks are the text and symbols on the outside of each package that tie it to its paperwork. They tell the forwarder, the carrier, customs and the buyer’s warehouse whose goods these are, which package in the consignment this is, how heavy it is and how to handle it.',
        'The International Trade Administration’s Basic Guide to Exporting gives the purposes of export markings: meeting shipping regulations, ensuring proper handling, concealing the identity of the contents, helping receivers identify shipments and meeting environmental and safety standards. The last two depend on the destination, which is why the buyer often sets the format.',
      ],
    },
    {
      heading: 'What should a shipping mark include?',
      paragraphs: [
        'The ITA lists the markings exporters typically put on cartons. Use it as a starting point and add what the buyer’s purchase order asks for.',
      ],
      list: [
        'The shipper’s mark, usually agreed with the buyer.',
        'The country of origin, such as “Made in USA”.',
        'The weight, in pounds and in kilograms.',
        'The number of packages and the size of each case, in inches and in centimetres.',
        'Handling marks, using international pictorial symbols.',
        'Cautionary markings such as “This Side Up” or “Use No Hooks”, in English and in the language of the destination country.',
        'The port of entry.',
        'Labels for hazardous materials, using the symbols adopted by IATA and the IMO.',
        'Ingredients, where they apply, also in the language of the destination country.',
      ],
    },
    {
      heading: 'What does a shipping mark look like on a carton?',
      paragraphs: [
        'A mark is usually a block of a few lines on two sides of the carton. The block below shows one carton in a twelve-carton order. The buyer, the order and every figure are invented.',
      ],
      table: {
        caption: 'Worked example of a carton mark, invented buyer and figures',
        head: ['Line on the carton', 'Example', 'What it does'],
        rows: [
          [
            'Shipper’s mark',
            'NRT / PO 4471',
            'Identifies the buyer and the order without naming the goods',
          ],
          [
            'Destination',
            'Port of entry: Rotterdam',
            'Tells the carrier where the package is going',
          ],
          ['Package number', 'C/No. 3 of 12', 'Shows which package this is and how many there are'],
          ['Gross weight', '18.4 kg / 40.6 lb', 'Matches the packing list for that carton'],
          [
            'Dimensions',
            '60 × 40 × 40 cm / 23.6 × 15.7 × 15.7 in',
            'Lets the forwarder check volume and stacking',
          ],
          ['Origin', 'Made in USA', 'States the country of origin on the package'],
          [
            'Handling',
            'This Side Up; Keep Dry (symbols and words)',
            'Tells handlers how to treat the carton',
          ],
        ],
      },
    },
    {
      heading: 'How do shipping marks connect to the packing list and invoice?',
      paragraphs: [
        'The marks are the key the documents use. The ITA describes the packing list as itemising the contents of each package, with weights and measurements, so that forwarders can work out freight and customs officers can check a specific carton. The package numbers on the cartons are what make that possible.',
        'Customs rules ask for the same link. Under 19 CFR 141.86, an invoice for goods entering the United States includes the marks and numbers of the packages, and each invoice states in adequate detail what each package contains. CBSA Memorandum D1-4-1 asks for the descriptive marks and numbers on the invoice for goods entering Canada, placed legibly on the outside of packages where possible.',
        'Give your forwarder the same marks for the booking and the transport document. When the carton says “C/No. 3 of 12”, the packing list has a row for package 3, and the invoice and bill of lading show twelve packages, anyone can find carton 3 and check it.',
      ],
    },
    {
      heading: 'How do you number and mark a shipment?',
      paragraphs: ['A routine that works for cartons and pallets alike:'],
      steps: [
        'Ask the buyer which marks the purchase order or letter of credit requires, and copy the wording exactly.',
        'Count the packages and number them in sequence: 1 of 12, 2 of 12 and so on.',
        'Weigh and measure each package, and record net weight, gross weight and dimensions on the packing list against its number.',
        'Print the mark block on at least two sides of each package, in waterproof ink or on labels that will not peel off.',
        'Add handling and cautionary marks, in English and the destination language, and any required hazardous-materials labels.',
        'For pallets, give each pallet its own number and mark, and list which carton numbers it holds.',
        'Check that the package count and marks are the same on the packing list, the commercial invoice and the forwarder’s booking.',
      ],
    },
    {
      heading: 'What should you leave off the outside of a package?',
      paragraphs: [
        'Anything that advertises valuable contents. The ITA includes concealing the identity of the contents among the purposes of export marks, so a shipper’s mark built from the buyer’s initials and an order number is better than a brand name or a product photo on the outer carton.',
        'Leave off old marks too. Reused cartons with previous labels, earlier package numbers or other countries of origin confuse handlers and customs. Cover or remove them before you apply the new block.',
      ],
    },
    {
      heading: 'Which marking mistakes cause delays?',
      paragraphs: [
        'The common ones are a package count on the cartons that differs from the documents, package numbers that skip or repeat, weights that do not match the packing list, and marks that wear off or sit only on the top of a stacked carton.',
        'Each one has the same effect: someone has to open, weigh or recount the consignment before it moves. Number before you weigh, record as you pack, and compare the three documents against the cartons before the truck arrives.',
      ],
    },
  ],
  faq: [
    {
      q: 'Who decides what the shipping marks say?',
      a: 'Usually the buyer. The ITA notes that the overseas buyer generally specifies the export marks. If the buyer gives no instructions, use the ITA’s list as the starting point.',
    },
    {
      q: 'Do shipping marks have to show the country of origin?',
      a: 'The ITA includes the country of origin among the usual carton marks, and many destinations have their own origin-marking rules for goods and packages. Check the importing country’s rules.',
    },
    {
      q: 'Should weights be in kilograms or pounds?',
      a: 'The ITA suggests both, pounds and kilograms, and dimensions in inches and centimetres, so the mark reads correctly at each end of the journey.',
    },
    {
      q: 'Are pallet labels the same as shipping marks?',
      a: 'A pallet label carries the same information for the pallet as a whole: the shipper’s mark, the pallet number, weights and dimensions. The cartons on the pallet keep their own marks.',
    },
    {
      q: 'Do parcels sent by courier need shipping marks?',
      a: 'Express parcels carry the carrier’s label, which identifies them. Numbering multi-piece shipments and matching the packing list still helps when a piece is checked or delayed.',
    },
  ],
  sources: [
    'w2-ita-labeling',
    'trade-gov-packing-list',
    'us-cbp-invoice-contents',
    'w2-cbsa-d1-4-1',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/cbm-calculator', '/tools/invoice-generator'],
  callout: {
    afterSection: 2,
    tool: '/tools/packing-list-generator',
    title: 'Record marks and weights per package',
    text: 'The free packing list generator has a row for each package with its marks, contents, dimensions and weights, ready to match your cartons.',
  },
  related: [
    '/blog/packing-list-for-shipping',
    '/blog/export-documents-checklist',
    '/blog/commercial-invoice-requirements',
    '/guides/lcl-vs-fcl',
  ],
  cover: {
    id: 'GaJlFMlQ9oA',
    src: 'https://images.unsplash.com/photo-1603861609805-29b5fda4a585',
    width: 5871,
    height: 3123,
    alt: 'Wall of stacked cartons, each with a yellow label, showing how marked packages are told apart',
    caption: 'Stacked cartons with yellow labels',
    photographer: { name: 'Dan Parlante', profile: 'https://unsplash.com/@danparlante' },
    page: 'https://unsplash.com/photos/a-wall-full-of-boxes-with-yellow-labels-on-them-GaJlFMlQ9oA',
  },
};

export default article;
