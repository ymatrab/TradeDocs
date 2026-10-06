import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "commercial invoice canada" 480, KD 2;
 * "canada customs invoice" 480; "how to ship to canada from us" 260, KD 8.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'commercial-invoice-for-canada',
  title: 'Commercial invoice for Canada: the fields CBSA expects',
  metaTitle: 'Commercial invoice for Canada: CBSA fields',
  description:
    'CBSA accepts your own commercial invoice instead of a Canada Customs Invoice if it carries the fields in Memorandum D1-4-1. The field list, the CAD 2,500 exception and the copies.',
  lede: 'Shipping to a Canadian customer for the first time, you may be told you need a “Canada Customs Invoice”. You probably already have what you need. The Canada Border Services Agency accepts an ordinary commercial invoice, as long as it carries the information its memorandum lists.',
  answer:
    'Canada does not require the Canada Customs Invoice form itself. Under CBSA Memorandum D1-4-1, a commercial invoice in English or French that gives all the information in the memorandum’s Appendix A is accepted for commercial goods. You can also pair a basic invoice with Form CI1, or fill in Form CI1 alone.',
  keyFacts: [
    'CBSA Memorandum D1-4-1 sets out the invoice requirements for commercial goods imported into Canada.',
    'Under D1-4-1, CBSA accepts a commercial invoice prepared by any means if it gives all the information listed in Appendix A.',
    'The invoice documents must be in English or French.',
    'D1-4-1 relaxes the invoice requirement where the value for duty does not exceed CAD 2,500, among other exceptions.',
    'CBSA states it will not review or approve commercial invoices; the importer or owner must make sure the Appendix A information is provided.',
  ],
  definitions: [
    {
      term: 'Canada Customs Invoice (Form CI1)',
      meaning: 'CBSA’s own invoice form, which lists the same fields as Appendix A of D1-4-1.',
    },
    {
      term: 'Value for duty',
      meaning: 'The value on which Canadian customs duty is assessed, used in the CAD 2,500 threshold.',
    },
    {
      term: 'Date of direct shipment',
      meaning: 'The date the goods began their continuous journey to Canada.',
    },
    {
      term: 'CARM',
      meaning:
        'The CBSA Assessment and Revenue Management system, now CBSA’s system of record for importers.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Do you need a Canada Customs Invoice to ship to Canada?',
      paragraphs: [
        'Not as a separate form. CBSA Memorandum D1-4-1 gives three ways to meet the invoice requirement for commercial shipments: a commercial invoice that gives all the information in Appendix A; a commercial invoice showing the buyer, seller, price and an accurate description with quantity, together with Form CI1 carrying the rest; or a fully completed Form CI1.',
        'Most exporters use the first route. One complete invoice serves the buyer, the carrier and CBSA, and you avoid copying the same figures onto a second form. The memorandum allows the invoice to be prepared by any means, whether typed, handwritten or produced by software.',
        'The CBSA page for D1-4-1 carries a note that its content is under review following the move to CARM, CBSA’s new system of record. The memorandum itself is dated 1 March 2013. Check the page before each new customer in case it has been revised.',
      ],
    },
    {
      heading: 'Which shipments does the requirement cover?',
      paragraphs: [
        'D1-4-1 applies to commercial shipments entering Canada. Its paragraph 4 lists cases where commercial invoices or other documents that validate the information can support the declared value instead: where the value for duty does not exceed CAD 2,500; Canadian goods being returned whose value has increased but does not exceed CAD 2,500; goods that qualify for unconditional duty-free entry; and goods classified under tariff item 9810.00.00.00.',
        'A lower value changes how much supporting paperwork CBSA asks for, not whether the invoice has to be accurate. Prepare a full invoice anyway: it costs you nothing extra and covers the case where the value or the treatment turns out differently.',
      ],
    },
    {
      heading: 'What must a commercial invoice for Canada include?',
      paragraphs: [
        'Appendix A of D1-4-1 lists the fields by their number on Form CI1. The table groups them. Field names follow the memorandum; the notes summarise its descriptions.',
      ],
      table: {
        caption: 'Appendix A fields of CBSA Memorandum D1-4-1, grouped',
        head: ['Fields', 'What they ask for'],
        rows: [
          ['1 Vendor', 'Full name and address of the seller and, if different, the party consigning the goods'],
          ['2 Date of direct shipment to Canada', 'The date the goods began their continuous journey to Canada'],
          ['3 Other references', 'Useful references, such as your invoice number and the buyer’s order number'],
          ['4 Consignee; 5 Purchaser', 'Who the goods are shipped to, and who they are sold to if different'],
          ['6 Country of transhipment', 'Any country the goods passed through in transit under customs control'],
          ['7 Country of origin of goods', 'Where the goods were grown, produced or manufactured'],
          ['8 Transportation', 'The mode and the place from which the goods began their journey to Canada'],
          ['9 Conditions of sale; 10 Currency of settlement', 'The terms of sale and payment, and the invoice currency'],
          ['11 Number of packages; 12 Specification of commodities', 'Package count and kind, marks and numbers, and a commercial description'],
          ['13 Quantity; 14 Unit price; 15 Total', 'Per line, in the currency of settlement; N/A where nothing is paid'],
          ['16 Total weight; 17 Invoice total', 'Net and gross weight, and the total price paid or payable'],
          ['19 Exporter; 20 Originator; 21 CBSA ruling', 'Who ships the goods, who completed the invoice, and any CBSA ruling number and date'],
          ['22–25 Adjustments to price', 'Costs included or excluded from the price, including export packing'],
        ],
      },
    },
    {
      heading: 'Which fields do first-time exporters get wrong?',
      paragraphs: [
        'Country of origin is the first. D1-4-1 describes origin as the country where the goods were grown, produced or manufactured, and notes that operations such as packaging, splitting and sorting may not be enough to confer origin. If you repack goods made elsewhere, repacking alone may not change their origin, so check where they were made before you fill in field 7.',
        'The description is the second. Field 12 asks for the kind of packages, the marks and numbers on them, a general description and a proper commercial description with style or code numbers and sizes. If the goods are not new, the condition must be stated, for example used goods, remnants or discontinued lines.',
        'The third is export packing. Fields 22 to 25 ask for the amount of export packing where extra packing was needed only for the journey, and D1-4-1 points to Memorandum D13-4-7 for the other adjustments to the price paid or payable.',
      ],
    },
    {
      heading: 'How do you prepare an invoice for a shipment from the US to Canada?',
      paragraphs: [
        'A US exporter’s commercial invoice usually already holds most of the Appendix A fields. Work through the list once and add what is missing to your template.',
      ],
      steps: [
        'Check that the vendor, consignee and purchaser each appear with a full address, and add the exporter if a different party ships the goods.',
        'Add the date of direct shipment and the place and mode of transport, such as “truck from Buffalo, NY”.',
        'Write the terms of sale with the Incoterms® 2020 rule and named place, the payment terms and the currency.',
        'Give each line its quantity, unit price, total, country of origin and a commercial description with model or style numbers.',
        'Add the package count, the kind of packages, the marks and numbers, and the net and gross weights.',
        'State any export packing amount and any costs included in or excluded from the price.',
        'Write the invoice in English or French, and keep a copy for your records.',
      ],
    },
    {
      heading: 'How many copies does CBSA need, and what if something is missing?',
      paragraphs: [
        'D1-4-1 says CBSA requires two copies of the non-warehouse documents and three copies of the warehouse documents, and that the importer or owner needs one copy for their records. Your Canadian customs broker or the carrier will tell you how they want the invoice delivered.',
        'If information is inaccurate or supporting documents are not provided when requested, the memorandum says CBSA may withhold release until it receives them. The importer, owner or agent normally has seven days from the request to provide supporting documentation. A complete invoice at the start avoids that wait.',
        'Preferential tariff treatment under a trade agreement is a separate question, with its own proof of origin, which TradeDocs does not prepare. D1-4-1 points to Memorandum D11-4-2 for it.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is Form CI1 still in use?',
      a: 'Yes. D1-4-1 still lists a fully completed Form CI1 as one way to meet the requirement, but a commercial invoice carrying all the Appendix A information is accepted instead.',
    },
    {
      q: 'Does the invoice have to be in English?',
      a: 'English or French. D1-4-1 asks for the invoice documents in either language.',
    },
    {
      q: 'Is a commercial invoice needed for a shipment under CAD 2,500?',
      a: 'D1-4-1 relaxes the invoice requirement where the value for duty does not exceed CAD 2,500, but commercial invoices or similar documents still support the declared value. Send one.',
    },
    {
      q: 'Which currency should the invoice use for Canada?',
      a: 'The currency of settlement, meaning the currency in which you ask to be paid. Field 10 records it, and the unit prices and totals are stated in it.',
    },
    {
      q: 'Does CBSA check my invoice template in advance?',
      a: 'No. D1-4-1 says CBSA will not review or approve commercial invoices or privately printed customs invoices; the importer or owner is responsible for providing the information.',
    },
  ],
  sources: ['w2-cbsa-d1-4-1'],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/landed-cost-calculator'],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Fill the Appendix A fields in one invoice',
    text: 'The free invoice generator has fields for parties, origin, terms, currency, packages and weights, so one document can travel to Canada.',
  },
  related: [
    '/blog/commercial-invoice-requirements',
    '/blog/commercial-invoice-ups-fedex-dhl',
    '/blog/packing-list-for-shipping',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'iHXEPGDJvT0',
    src: 'https://images.unsplash.com/photo-1680884301520-882f911e6636',
    width: 4080,
    height: 3072,
    alt: 'Truck driving on a snow-covered road, the kind of road freight that carries goods into Canada',
    caption: 'A truck on a snow-covered road',
    photographer: { name: 'Matt & Chris Pua', profile: 'https://unsplash.com/@pua_photos' },
    page: 'https://unsplash.com/photos/a-truck-driving-down-a-snow-covered-road-iHXEPGDJvT0',
  },
};

export default article;
