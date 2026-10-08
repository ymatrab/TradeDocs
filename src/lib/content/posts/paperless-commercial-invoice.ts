import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "ups paperless invoice" 260, KD n/a.
 * Carrier facts only from each carrier's own page, opened 2026-10-08: UPS (commercial invoice
 * page, w2-ups-commercial-invoice), FedEx (customs documents and ETD pages), DHL Express (US
 * PLT terms and the NZ MyDHL+ preparation page). No fees or transit times: none is quoted.
 * Product facts: the free generator downloads a PDF with no watermark and no signature fields
 * (src/app/(marketing)/tools/invoice-generator/generator.tsx); the workspace prints a
 * signatory line from the organization's settings, and the signature image is Pro PDF
 * branding (src/lib/billing/plans.ts, src/lib/pdf/trade-document.ts).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 */
const article: ContentArticle = {
  slug: 'paperless-commercial-invoice',
  title: 'Paperless commercial invoice: UPS, FedEx and DHL compared',
  metaTitle: 'Paperless commercial invoice: UPS, FedEx, DHL',
  description:
    'How UPS Paperless Invoice, FedEx Electronic Trade Documents and DHL Paperless Trade send the commercial invoice electronically, from each carrier’s own pages, and when paper is still needed.',
  lede: 'Every courier export of goods needs a commercial invoice, and all three big express carriers will now take it electronically instead of in a pouch on the box. The services have different names, different switches and different rules about uploading your own document. This post sets them side by side, from each carrier’s own pages as of 8 October 2026.',
  answer:
    'A paperless commercial invoice is sent to the carrier electronically with the shipment data, so no printed copies travel on the parcel. UPS calls it UPS Paperless Invoice, FedEx calls it Electronic Trade Documents, and DHL Express calls it Paperless Trade. Each must be switched on, and paper is still needed where a destination requires it.',
  keyFacts: [
    'UPS says opening a new UPS account automatically enrols you in UPS Paperless Invoice; existing accounts enrol under “Paperless Invoicing”.',
    'Without UPS Paperless Invoice, UPS asks for three signed copies of the commercial invoice, one original and two copies, with the shipment.',
    'FedEx Ship Manager at fedex.com lets you upload your own commercial invoice through FedEx Electronic Trade Documents.',
    'FedEx says ETD can take up to four additional customs documents with a shipment.',
    'DHL Express says it checks the shipment’s details to decide whether Paperless Trade is available.',
    'DHL’s Paperless Trade terms say it is not to be used where legal or customs rules require hard copy documents.',
  ],
  definitions: [
    {
      term: 'Paperless invoice',
      meaning:
        'A commercial invoice transmitted to the carrier as data or a file instead of printed copies attached to the parcel.',
    },
    {
      term: 'ETD',
      meaning:
        'FedEx Electronic Trade Documents, FedEx’s service for sending customs documents electronically.',
    },
    {
      term: 'PLT',
      meaning:
        'Paperless Trade, DHL Express’s service for sending shipment documentation electronically.',
    },
    {
      term: 'Commercial invoice',
      meaning:
        'The exporter’s invoice for the goods, which customs uses for valuation, duty and import control.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a paperless commercial invoice?',
      paragraphs: [
        'It is the same commercial invoice, delivered by a different route. Instead of printing copies and putting them in a document pouch, you give the carrier the invoice electronically while you book the shipment, and the carrier passes it on for customs clearance. The content does not change: UPS says the commercial invoice is the primary form used to assess duties and taxes, and FedEx says the other documents, the label included, must be consistent with it.',
        'What changes is the work around it. FedEx lists the benefits on its ETD page: no printing, folding and attaching, and documents that can be reviewed sooner, even before pickup. The invoice still has to be accurate and complete; a paperless invoice with a vague description is delayed just like a paper one.',
      ],
    },
    {
      heading: 'How do UPS, FedEx and DHL compare?',
      paragraphs: [
        'The three services do the same job but are switched on and used differently. The table summarises what each carrier’s own page says; the sections below give the detail.',
      ],
      table: {
        caption: 'Paperless invoice services, from each carrier’s own pages as of 8 October 2026',
        head: ['', 'UPS', 'FedEx', 'DHL Express'],
        rows: [
          [
            'Service name',
            'UPS Paperless Invoice',
            'Electronic Trade Documents (ETD)',
            'Paperless Trade (PLT)',
          ],
          [
            'How it is switched on',
            'Automatic for new accounts; existing accounts enrol in account details',
            'Selected under “Customs Documentation” in FedEx Ship Manager at fedex.com',
            'Offered when DHL confirms it is available for the shipment',
          ],
          [
            'Your own invoice file',
            'Not described on the page; UPS helps you fill in the invoice as you create the label',
            'Yes: “I will create my own invoice” and upload it',
            'Yes on the MyDHL+ guide: “Use My Own Invoice”',
          ],
          [
            'Without it',
            'Three signed copies with the shipment',
            'Print the invoice and attach it with the label',
            'Two printed copies to attach (MyDHL+ guide)',
          ],
        ],
      },
    },
    {
      heading: 'How does UPS Paperless Invoice work?',
      paragraphs: [
        'UPS fills in the commercial invoice with you as you create the shipping label and, for account holders, transmits the customs forms digitally. UPS says a new account is enrolled in UPS Paperless Invoice automatically. An existing account is enrolled from UPS.com in three steps: log in, choose “View Account Details” in the “Actions” menu, then choose “Paperless Invoicing” and “Enroll My Account”.',
        'Without it, UPS asks for three signed copies of the invoice, one original and two copies, to go with the package, and for you to keep a copy of the signed original. UPS’s page also asks for the country of origin of every line, a harmonized tariff code and the reason for export, such as a gift. Paperless or not, those details come from you.',
      ],
    },
    {
      heading: 'How do you upload an invoice to FedEx Electronic Trade Documents?',
      paragraphs: [
        'In FedEx Ship Manager at fedex.com, ETD is selected by default under “Customs Documentation”, and you then choose the invoice type from the “Invoice for Customs” menu.',
      ],
      steps: [
        'Complete the “Package Contents” section with a full description of the items and the shipment purpose.',
        'Under “Customs Documentation”, keep “Attach trade documents electronically (recommended)”.',
        'In “Invoice for Customs”, choose “I will create my own invoice” and upload your file, or let FedEx create a commercial or pro forma invoice.',
        'If FedEx creates it, upload your letterhead and signature images once; FedEx keeps them for later shipments.',
        'Add any other customs documents the shipment needs; FedEx allows up to four more.',
        'Finish the label as usual and keep the invoice with your shipment records.',
      ],
    },
    {
      heading: 'How does DHL Paperless Trade work?',
      paragraphs: [
        'DHL Express sends the invoice and certain other documents electronically through Paperless Trade, which its terms describe as eliminating the need for printed copies. DHL decides from the shipment’s details, such as origin, destination, contents and value, whether PLT is available. On its MyDHL+ preparation guide, you either let MyDHL+ create the invoice or choose “Use My Own Invoice” and upload the file; unticking the option means printing two copies to attach.',
        'DHL’s terms add conditions worth reading before you rely on it. Documents sent electronically must be legible, DHL gives instructions on the file format and scanning quality, and you agree not to use PLT where legal or customs requirements oblige hard copy documents. DHL also notes that some documentation may still have to be handed over on paper with the shipment.',
      ],
    },
    {
      heading: 'When do you still need a paper invoice?',
      paragraphs: [
        'Whenever the service is not available or the rules require paper. DHL says outright that PLT is not for shipments where legal or customs requirements oblige hard copies, and that it checks availability per shipment. UPS’s fallback is three signed copies; FedEx’s is a printed invoice attached with the label.',
        'Keep a printable PDF of every invoice for that reason. If a shipment cannot go paperless, or a broker or the buyer asks for a copy, you can print the same document you uploaded instead of making a second version that may not match.',
      ],
    },
    {
      heading: 'What should the file you upload contain?',
      paragraphs: [
        'Everything a paper commercial invoice would: the exporter and the consignee, the invoice number and date, a specific description of each line with its quantity, unit value and total, the country of origin, the currency, the terms of sale and the reason for export. FedEx’s own advice on descriptions applies equally to uploads: say what it is, how many, what it is made of and what it is for. “Parts” or “Samples” on their own invite a delay.',
        'The TradeDocs commercial invoice generator produces that document as a PDF with no account and no watermark, which you can upload where a carrier accepts your own invoice. Sign it the way the carrier instructs. In a free TradeDocs workspace, the PDF can print a signatory name and title from your document settings; adding your logo and a signature image to the PDF is part of Pro PDF branding.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is UPS Paperless Invoice automatic?',
      a: 'For new accounts, yes: UPS says opening a new account enrols you automatically. An existing account has to be enrolled from “View Account Details” on UPS.com.',
    },
    {
      q: 'Can I upload my own commercial invoice to FedEx?',
      a: 'Yes. In FedEx Ship Manager at fedex.com, choose “I will create my own invoice” under “Invoice for Customs” and upload the file while you create the label.',
    },
    {
      q: 'Does a paperless invoice still need a signature?',
      a: 'The carriers treat the signature as part of the document. FedEx and DHL both mention a letterhead and electronic signature for invoices they create; follow each carrier’s instructions for your own file.',
    },
    {
      q: 'Can I send a packing list paperless too?',
      a: 'FedEx ETD accepts up to four additional customs documents with a shipment, and DHL’s PLT covers certain documentation beyond the invoice. Check what each carrier accepts for your destination.',
    },
    {
      q: 'What happens if paperless is not available for my destination?',
      a: 'Print the invoice and attach it. UPS asks for three signed copies, DHL’s MyDHL+ guide for two, and FedEx for the printed invoice with the label.',
    },
  ],
  sources: [
    'w2-ups-commercial-invoice',
    'w2-fedex-customs-documents',
    'b2-fedex-etd',
    'b2-dhl-plt-terms',
    'b2-dhl-nz-prepare-shipment',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/chargeable-weight'],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Make the invoice you will upload',
    text: 'Fill in the parties, lines, origin and terms and download a commercial invoice PDF you can upload where a carrier accepts your own file, or print if it does not.',
  },
  related: [
    '/blog/commercial-invoice-ups-fedex-dhl',
    '/blog/how-to-fill-out-a-commercial-invoice',
    '/blog/commercial-invoice-requirements',
    '/blog/brokerage-fees-and-duties-on-courier-shipments',
    '/blog/customs-status-messages-explained',
  ],
  cover: {
    id: 'yW9jdBmE1BY',
    src: 'https://images.unsplash.com/photo-1577702312706-e23ff063064f',
    width: 6000,
    height: 4000,
    alt: 'A plain brown shipping box on an office desk, ready to send with its invoice transmitted online',
    caption: 'A packed box in an office workspace',
    photographer: { name: 'Brandable Box', profile: 'https://unsplash.com/@brandablebox' },
    page: 'https://unsplash.com/photos/brown-box-on-wooden-surface-yW9jdBmE1BY',
  },
};

export default article;
