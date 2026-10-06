import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-05/06): "fedex commercial invoice" 1,900;
 * "commercial invoice for ups" 720; "dhl commercial invoice" 260, KD 2.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 * Carrier facts: each carrier's own US page, retrieved 2026-10-06 (sources/write-2.ts).
 */
const article: ContentArticle = {
  slug: 'commercial-invoice-ups-fedex-dhl',
  title: 'Commercial invoice for UPS, FedEx and DHL: one invoice, three carriers',
  metaTitle: 'Commercial invoice for UPS, FedEx and DHL',
  description:
    'What UPS, FedEx and DHL Express each ask for on a commercial invoice, how many copies, and how to submit it paperless, from each carrier’s own pages as of 6 October 2026.',
  lede: 'If you ship with more than one express carrier, you have probably noticed that each has its own invoice screen, its own blank form and its own advice. The underlying document is the same. Prepare one complete commercial invoice and you can hand it to any of the three.',
  answer:
    'UPS, FedEx and DHL Express all require a commercial invoice for international shipments of goods, prepared by the exporter. Each lets you create it while booking. UPS asks for three signed copies unless you use UPS Paperless Invoice, FedEx accepts an upload through Electronic Trade Documents, and MyDHL+ generates the invoice as you book.',
  keyFacts: [
    'FedEx states that a commercial invoice is required for all international commodity shipments, meaning any shipment with commercial value.',
    'UPS states that a commercial invoice is required for all cross-border shipments except documents with no commercial value.',
    'UPS asks for three signed copies, one original and two copies, with the shipment unless the account uses UPS Paperless Invoice.',
    'FedEx lets shippers upload a completed commercial invoice through FedEx Electronic Trade Documents while creating the label.',
    'DHL Express states that MyDHL+ generates a commercial invoice automatically as the shipment is booked.',
  ],
  definitions: [
    {
      term: 'Commercial invoice',
      meaning:
        'The seller’s invoice for the goods, which customs uses to assess duties and taxes and check the shipment.',
    },
    {
      term: 'Paperless invoice',
      meaning:
        'A carrier service that transmits the invoice electronically, so no paper copies travel with the parcel.',
    },
    {
      term: 'Air waybill (AWB) number',
      meaning:
        'The express carrier’s shipment number, which links the invoice to the parcel; DHL Express numbers have 10 digits.',
    },
    {
      term: 'Reason for export',
      meaning: 'The purpose of the shipment as stated on the invoice: sale, sample, repair, return or gift.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Do UPS, FedEx and DHL all need a commercial invoice?',
      paragraphs: [
        'Yes, for anything other than documents. FedEx describes the commercial invoice as required for all international commodity shipments, which it defines as any international shipment with commercial value. UPS says it is required for all cross-border shipments except documents with no commercial value. DHL says a commercial invoice is required for all international shipments of goods.',
        'All three put the job on the exporter. That is you, even when the carrier’s booking screen fills in the form, because the carrier only lays out what you enter. The International Trade Administration describes the commercial invoice as the document customs uses to assess duties and taxes, so the content has to be right before it is neat.',
      ],
    },
    {
      heading: 'What does each carrier ask for, side by side?',
      paragraphs: [
        'The carriers describe the same core document in different words. The table summarises each one’s US page as retrieved on 6 October 2026. Carrier practice changes, so check the page before you rely on a detail.',
      ],
      table: {
        caption: 'Commercial invoice practice at UPS, FedEx and DHL Express (US pages, retrieved 6 October 2026)',
        head: ['', 'UPS', 'FedEx', 'DHL Express'],
        rows: [
          ['Who prepares it', 'The exporter', 'The exporter', 'The seller'],
          [
            'Create while booking',
            'Yes, while creating the label',
            'Yes, in FedEx Ship Manager',
            'Yes, MyDHL+ generates it',
          ],
          [
            'Paperless option',
            'UPS Paperless Invoice; new accounts are enrolled automatically',
            'Upload through FedEx Electronic Trade Documents',
            'Generated in MyDHL+ during booking',
          ],
          [
            'Paper copies',
            'Three signed copies: one original and two copies',
            'Print and attach with the label',
            'Not stated on the page',
          ],
          [
            'Line details named',
            'Description and value, country of origin per line, 10-digit HTSUS code, quantity',
            'What it is, how many, what it is made of, what it is for',
            'Description, HS code, origin, quantity and unit, unit and subtotal value, unit net weight',
          ],
          [
            'Shipment details named',
            'Reason for export',
            'Consistency with the label and other documents',
            'Invoice number and date, AWB number, Incoterms, reason and type of export, currency',
          ],
        ],
      },
    },
    {
      heading: 'How do you send a commercial invoice to UPS?',
      paragraphs: [
        'UPS builds the invoice as you create the shipping label and, for account holders, transmits it digitally through UPS Paperless Invoice. UPS says new accounts are enrolled automatically, and existing accounts can enrol under the account’s Paperless Invoicing option.',
        'Without the paperless service, UPS asks you to print the commercial invoice and include three signed copies, one original and two copies, with the package, and to keep a copy of the signed original for your records. Its page also asks you to state the reason for export, such as a gift, and to include the tariff code.',
      ],
    },
    {
      heading: 'How do you send a commercial invoice to FedEx?',
      paragraphs: [
        'FedEx gives three routes. Create the invoice in FedEx Ship Manager while making the label, then print it and attach it with the label. Fill in your own invoice and attach it. Or fill in your own invoice and upload it in FedEx Ship Manager while creating the label, which needs FedEx Electronic Trade Documents switched on in the preferences.',
        'The upload route is the one that fits an invoice you have already prepared. FedEx also asks that the information on every other document, the label included, matches the commercial invoice, and that each type of goods has its own description.',
      ],
    },
    {
      heading: 'How do you send a commercial invoice to DHL Express?',
      paragraphs: [
        'DHL says that MyDHL+ generates a commercial invoice automatically as you book, and that you can download it at the end of the booking. Its guide lists what the invoice carries: the parties, including the importer of record and tax numbers where required, a line for each item, and a shipment summary.',
        'Two DHL fields are worth preparing before you open the booking screen. The reason for export, such as sale, sample, repair or gift, and the type of export: permanent, temporary or repair and return. Both tell customs at destination what kind of movement the shipment is, so they should match the sale and what the buyer expects.',
      ],
    },
    {
      heading: 'How do you prepare one invoice that works for all three?',
      paragraphs: [
        'Write the invoice once, from your own records, and copy it into whichever carrier you book. If it covers what US rules expect and what the carriers name, it will cover all three.',
      ],
      steps: [
        'Enter the seller, the buyer and the consignee with full addresses, phone numbers and tax or EORI numbers where the importing country asks for them.',
        'Give each line a specific description: what it is, what it is made of and what it is for, as FedEx and DHL both advise.',
        'Add the quantity and unit, the unit price, the line total and the currency for each line.',
        'Add the country of origin for each line, and the tariff code you have looked up in the official schedule, such as the USITC Harmonized Tariff Schedule.',
        'Add the net and gross weights, the number of packages and the invoice total.',
        'State the Incoterms® 2020 rule with its named place, the reason for export and the type of export.',
        'Copy the invoice into the carrier’s booking screen, or upload it, and add the air waybill number once the carrier issues it.',
      ],
    },
    {
      heading: 'Which mistakes hold express shipments at customs?',
      paragraphs: [
        'FedEx names inaccurate or vague descriptions as one of the most common reasons for customs delays, and gives examples: “Parts”, “Gift” and “Samples” are too vague; “Two steel springs for woodworking machine” is not. DHL’s guide makes the same point with its own examples.',
        'The other common problems are a value that does not match the goods, a missing country of origin and a label that does not match the invoice. For goods entering the United States, 19 CFR 141.86 sets out what an invoice must state, so a missing price, currency or origin is a problem whichever carrier carries the parcel.',
      ],
    },
  ],
  faq: [
    {
      q: 'How many copies of a commercial invoice does UPS need?',
      a: 'UPS asks for three signed copies, one original and two copies, with the shipment, unless your account uses UPS Paperless Invoice. Keep a copy of the signed original yourself.',
    },
    {
      q: 'Can I use my own commercial invoice with FedEx?',
      a: 'Yes. FedEx lets you fill in your own invoice and either attach it to the package with the label or upload it through FedEx Electronic Trade Documents while creating the label.',
    },
    {
      q: 'Does DHL Express create the commercial invoice for me?',
      a: 'MyDHL+ generates one from what you enter during booking. The content is still yours: descriptions, values, origin and the reason for export.',
    },
    {
      q: 'Do I need a commercial invoice to send documents abroad?',
      a: 'UPS and FedEx both exclude documents with no commercial value from the requirement. Anything with commercial value, including samples, needs an invoice.',
    },
    {
      q: 'Should the invoice be signed?',
      a: 'UPS asks for signed copies when the invoice travels on paper. Check the importing country’s rules and the carrier’s page for paperless shipments.',
    },
  ],
  sources: [
    'w2-ups-commercial-invoice',
    'w2-fedex-customs-documents',
    'w2-dhl-commercial-invoice',
    'trade-gov-commercial-invoice',
    'us-cbp-invoice-contents',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/chargeable-weight'],
  callout: {
    afterSection: 1,
    tool: '/tools/invoice-generator',
    title: 'Prepare the invoice once, for any carrier',
    text: 'Fill in parties, lines, origin and terms in the free generator, then copy the figures into UPS, FedEx or DHL, or upload the PDF.',
  },
  related: [
    '/blog/commercial-invoice-requirements',
    '/blog/packing-list-for-shipping',
    '/blog/export-documents-checklist',
    '/guides/proforma-vs-commercial-invoice',
  ],
  cover: {
    id: 'h60tsArJPH4',
    src: 'https://images.unsplash.com/photo-1558803116-b443d28fa878',
    width: 4144,
    height: 2768,
    alt: 'White delivery van with its rear doors open, the kind of vehicle that collects express parcels',
    caption: 'A delivery van with its rear doors open',
    photographer: { name: 'Matthew LeJune', profile: 'https://unsplash.com/@matthewlejune' },
    page: 'https://unsplash.com/photos/opened-white-van-h60tsArJPH4',
  },
};

export default article;
