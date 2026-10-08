import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google UK, 2026-10-06): "export declaration" 210, KD 3; "c88 form" 110;
 * "customs declaration service" 590 routed here.
 * Plan: docs/research/content-plan-v3-2026-10-07.md (v2 #51), wave C. Angle: who files, what data
 * comes from the invoice.
 * Every rule is from a GOV.UK page opened 2026-10-08 and listed in `sources`. No commodity code
 * is suggested for any product; example parties are invented.
 */
const article: ContentArticle = {
  slug: 'uk-export-declaration',
  title: 'UK export declaration: who files it and what it needs',
  metaTitle: 'UK export declaration: who files it and how',
  description:
    'How a UK export declaration works on the Customs Declaration Service: who makes it, the data it takes from your invoice and packing list, deadlines and the departure message.',
  lede: 'Goods leaving Great Britain need an export declaration, cleared by customs before they go. You can make it yourself or have a forwarder, customs agent or courier make it for you. Either way, most of the data it needs comes from your commercial invoice and packing list.',
  answer:
    'A UK export declaration is the electronic customs declaration that tells HMRC what is leaving the UK, from whom, to whom and how. HMRC says the exporter or their representative must submit it and get customs clearance before the goods leave. It is made through software on the Customs Declaration Service, usually by a forwarder or customs agent.',
  keyFacts: [
    'HMRC says exporters or their representatives must make an export declaration and get customs clearance before goods leave the UK.',
    'HMRC requires an EORI number starting with GB to export goods from England, Wales or Scotland.',
    'Subscribing to the Customs Declaration Service lets a business submit import and export declarations using software; one subscription covers both.',
    'HMRC calls the DUCR the main reference number that links the declarations for a consignment.',
    'Without a departure message, HMRC says an export declaration cannot be used as official evidence of export.',
  ],
  definitions: [
    {
      term: 'Customs Declaration Service (CDS)',
      meaning: 'HMRC’s system for submitting UK import and export declarations through software.',
    },
    {
      term: 'DUCR',
      meaning:
        'The Declaration Unique Consignment Reference, which links all the declarations for one consignment.',
    },
    {
      term: 'Departure message',
      meaning:
        'The notice to HMRC that the goods have left the UK, sent by the system at the point of exit.',
    },
    {
      term: 'Customs procedure code',
      meaning:
        'The code on the declaration that tells HMRC which customs procedure the goods are being declared to.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a UK export declaration?',
      paragraphs: [
        'It is the customs declaration that clears goods to leave the UK. HMRC’s guidance on making a full export declaration says exporters or their representatives must submit one and get customs clearance before the goods leave, and that it can be made online or through commercial software. HMRC’s step-by-step export guidance places it near the end of the process, after you have checked licences, got an EORI number, classified the goods and prepared the invoice.',
        'People also search for the C88 form when they mean an export declaration. The GOV.UK export pages HMRC links to, opened on 8 October 2026, describe declarations made electronically through software and the Customs Declaration Service rather than a paper form, so ask your agent which data they need instead of looking for a form to fill in.',
      ],
    },
    {
      heading: 'Who makes the export declaration?',
      paragraphs: [
        'You can make it yourself or hire someone. GOV.UK says you can hire a transporter or customs agent to make the export declaration and get the goods through customs, and that if you have appointed someone, they make the declaration and get the goods through the UK border.',
        'Hiring someone does not hand over every obligation. HMRC’s guidance on appointing a representative says whoever you hire cannot act for you without written instructions, which must show whether they are acting for you directly or indirectly, and that you remain responsible for due diligence on your customs declarations. Confirm the terms in writing and keep a copy.',
        'To make declarations yourself, HMRC says you must be registered on the right systems and have compatible software. Its guidance on getting access to the Customs Declaration Service lists what you need to subscribe, including Government Gateway sign-in details for the business, an EORI number starting with GB or XI and your Unique Taxpayer Reference.',
      ],
    },
    {
      heading: 'What information goes on an export declaration?',
      paragraphs: [
        'HMRC lists the data a full export declaration needs. Three items are named first: the customs procedure code, the commodity code and the DUCR. The rest describe the shipment, and nearly all of it already sits on your commercial invoice and packing list.',
      ],
      table: {
        caption: 'Data HMRC lists for a full export declaration, and where it usually comes from',
        head: ['Declaration data (HMRC list)', 'Usually taken from'],
        rows: [
          ['Customs procedure code', 'Your agent, based on what you tell them about the movement'],
          ['Commodity code', 'Your classification in the UK Trade Tariff, shown on the invoice'],
          ['DUCR', 'Created by you or your agent for the consignment'],
          ['Consignor and consignee', 'Seller and buyer details on the commercial invoice'],
          ['Departure point and destination', 'The invoice and the transport booking'],
          ['Type, amount and packaging of goods', 'Invoice line items and the packing list'],
          ['Transport methods and costs', 'The booking and the freight shown on the invoice'],
          ['Currencies and valuation methods', 'Invoice currency, prices and the Incoterms® 2020 rule'],
          ['Certificates and licences', 'Any export licence or certificate the goods need'],
        ],
      },
    },
    {
      heading: 'How do you prepare the data for your agent?',
      paragraphs: [
        'Give your agent one consistent set of figures before the goods move, and build the invoice and packing list from the same line items so the declaration matches both.',
      ],
      steps: [
        'Get an EORI number starting with GB, or check the one you have; HMRC needs it to export from England, Wales or Scotland.',
        'Find the commodity code for each line in the UK Trade Tariff. TradeDocs never suggests a code for a product.',
        'Prepare the commercial invoice with the sale price, currency, the Incoterms® 2020 rule and named place, and any freight or insurance included in the price shown separately, as GOV.UK’s export guidance asks.',
        'Prepare the packing list with packages, gross and net weights and dimensions that match the invoice quantities.',
        'Send your written instructions, the invoice, packing list and any licence to the agent, and agree who creates the DUCR.',
        'Ask the agent for the declaration reference and, after departure, confirmation that the goods left.',
      ],
    },
    {
      heading: 'When must the export declaration be made?',
      paragraphs: [
        'Before the goods leave, with a minimum time set by the last mode of transport. HMRC’s full export declaration guidance sets these deadlines: by road at least 1 hour before departure, by air at least 30 minutes before departure, for containerised sea cargo to short-sea destinations such as North Sea, Baltic or Mediterranean ports at least 2 hours before leaving port, for other containerised sea cargo at least 24 hours before loading, and for non-containerised sea cargo at least 2 hours before leaving port.',
        'Some locations need an arrived declaration, which HMRC says must be submitted before the goods start their journey to the border. GOV.UK also says the goods must go to the port or border location named in the declaration, and that you or your transporter need the master reference number, the invoice and any export licences or certificates at the border.',
      ],
    },
    {
      heading: 'What happens after the goods leave the UK?',
      paragraphs: [
        'HMRC must receive a departure message. Its guidance says this is sent by systems at the point of departure, such as an inventory linked system, the Goods Vehicle Movement Service or an approved loader; at other locations, the exporter must report the export to HMRC.',
        'The departure message matters for VAT. Without one, HMRC says the declaration cannot be used as official evidence of export, although commercial evidence under VAT Notice 703 can support zero rating. The post “VAT on exports from the UK: zero rating and proof of export” explains what that evidence looks like.',
        'Declarations can be amended before customs clearance. After clearance, HMRC points to form C81 for amending statistical records within 3 years, and to form C1700 where licence details change.',
      ],
    },
    {
      heading: 'Can regular exporters use a simplified declaration?',
      paragraphs: [
        'Yes, with authorisation. HMRC’s guidance on simplified declarations for exports describes a procedure for declaring goods before they leave when full details are not yet known, followed by a supplementary declaration within 14 days of the goods departing, or by the 10th calendar day of the following month for multiple consignments.',
        'Authorisation needs a good customs compliance record, a regular pattern of declarations against your EORI number and an application on form C&E48.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do I need software to make a UK export declaration?',
      a: 'If you make declarations yourself, GOV.UK says you need to be registered on the right systems and have compatible software. If you hire an agent, they use theirs.',
    },
    {
      q: 'Is the C88 still used for UK exports?',
      a: 'The GOV.UK export guidance we checked on 8 October 2026 describes electronic declarations through software and the Customs Declaration Service. Ask your agent which data they need from you.',
    },
    {
      q: 'Who is liable if my agent makes a mistake on the declaration?',
      a: 'HMRC says liability depends on the services provided, what you asked for and your agreement, and that you remain responsible for due diligence on your declarations.',
    },
    {
      q: 'Does a courier make the export declaration for parcels?',
      a: 'HMRC’s simplified declarations guidance mentions an express industry arrangement for consignments under £900. Ask your courier whether it declares your shipment and what data it needs from you.',
    },
    {
      q: 'How do I prove my goods were exported?',
      a: 'HMRC treats a cleared declaration with a departure message as official evidence. Keep its reference with your invoice and transport documents.',
    },
  ],
  sources: [
    'c4-gov-uk-full-export-declaration',
    'c4-gov-uk-export-customs-declaration',
    'c4-gov-uk-cds-access',
    'c4-gov-uk-appoint-customs-agent',
    'c4-gov-uk-simplified-export-declarations',
    'c4-gov-uk-export-goods',
    'c4-hmrc-vat-notice-703',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/invoice-generator',
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Give your agent the invoice the declaration is built from',
    text: 'The commercial invoice generator lays out seller, buyer, goods, commodity codes you enter, values, currency and the Incoterms® rule, so your agent has the declaration data in one place.',
  },
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  related: [
    '/guides/how-to-export-from-the-uk',
    '/blog/zero-rating-exports-vat-uk',
    '/guides/eori-number',
    '/guides/uk-commodity-codes',
    '/guides/transit-declarations-t1-ncts',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'Qj7dPzmN45A',
    src: 'https://images.unsplash.com/photo-1757083822288-c4b4976788f3',
    width: 4095,
    height: 3276,
    alt: 'A ferry sailing out of the port of Dover under a cloudy sky',
    caption: 'A ferry leaving the port of Dover',
    photographer: { name: 'Thivanika Uthayakumaran', profile: 'https://unsplash.com/@shotbythivi' },
    page: 'https://unsplash.com/photos/a-large-ferry-boat-travels-on-the-water-Qj7dPzmN45A',
  },
};

export default article;
