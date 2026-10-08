import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google UK, 2026-10-07): "exporting from uk" 1,000, KD 48.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 * Follows the order of HMRC's "Export goods from the UK: step by step" for goods leaving Great
 * Britain permanently; Northern Ireland movements are pointed to the official guidance only.
 */
const article: ContentArticle = {
  slug: 'how-to-export-from-the-uk',
  title: 'Exporting from the UK: a first export, step by step',
  metaTitle: 'Exporting from the UK: step by step',
  description:
    'A first export from Great Britain in order: destination rules and licences, a GB EORI number, the commodity code, the invoice, the export declaration and its deadlines, and records.',
  lede: 'Exporting from the UK is a sequence of checks and one customs declaration. HMRC publishes the official order on GOV.UK; this guide follows it for goods leaving England, Scotland or Wales for good, and says where each step’s rules live.',
  answer:
    'To export from the UK, check the destination’s rules and any licence, get an EORI number starting with GB, classify the goods with a commodity code, prepare the commercial invoice and packing list, decide who makes the export declaration, get customs clearance before the goods leave, and keep the invoices and customs records.',
  keyFacts: [
    'HMRC says you need an EORI number starting with GB to export goods from England, Wales or Scotland.',
    'Under HMRC guidance, an export declaration must be made and cleared by customs before goods are allowed to leave the UK.',
    'HMRC requires the export declaration at least one hour before departure by road and at least 30 minutes before departure by air.',
    'GOV.UK says the invoice should show the selling price, with any freight or export insurance included in it listed separately.',
    'HMRC’s VAT Notice 703 accepts transport documents such as bills of lading, air waybills and CMR notes as commercial evidence of export.',
  ],
  definitions: [
    {
      term: 'EORI number',
      meaning:
        'The customs identification number a business uses on declarations; GB numbers cover Great Britain.',
    },
    {
      term: 'Commodity code',
      meaning:
        'The number that classifies goods in the UK Trade Tariff and sets the rules that apply to them.',
    },
    {
      term: 'DUCR',
      meaning:
        'The Declaration Unique Consignment Reference, the main reference that links the declarations for a consignment.',
    },
    {
      term: 'Departure message',
      meaning: 'The notice to HMRC that the goods have left the UK, which closes the export.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Does this process apply to your export?',
      paragraphs: [
        'It applies when you move goods permanently from Great Britain to a country outside the UK, or from Northern Ireland to a country outside the UK and the EU. HMRC sets out different routes for goods moving between Great Britain and Northern Ireland, parcels sent by post, small amounts of goods carried in person, and goods taken out of the UK temporarily.',
      ],
    },
    {
      heading: 'What should you check before you sell?',
      paragraphs: [
        'Check the rules at both ends. GOV.UK tells exporters to check the duties, rules and restrictions for the goods in the destination country, and to confirm that the buyer can import them: the buyer may need to make an import declaration and hold licences or certificates of its own.',
        'Then check whether the goods need a UK export licence. HMRC lists special rules for goods such as animals and animal products, plants, medicines, chemicals, works of art, waste, firearms, military goods and items with both civil and military uses. If a UK sanction applies, the sanctions guidance sets out exceptions and licences.',
      ],
    },
    {
      heading: 'How do you get your business ready to export?',
      paragraphs: [
        'Get an EORI number that starts with GB; HMRC requires one to export from England, Wales or Scotland, and moving goods to or from Northern Ireland may need an XI number. The EORI number guide explains who needs one and how to apply.',
        'Check whether you need to register for VAT. Regular exporters can also look at simplified declaration procedures, Common Transit and Authorised Economic Operator status, which HMRC lists as ways to make clearing customs quicker.',
      ],
    },
    {
      heading: 'Who makes the export declaration?',
      paragraphs: [
        'You can make it yourself or hire someone, such as a customs agent or forwarder, to deal with customs and transport for you. HMRC says that if you appoint someone, they make the declaration and get the goods through the UK border.',
        'Either way, the declaration needs data from your documents. HMRC lists the customs procedure code, the commodity code and the DUCR, plus the departure point and destination, the consignor and consignee, the type, amount and packaging of the goods, transport methods and costs, currencies and valuation methods, and any certificates and licences.',
      ],
    },
    {
      heading: 'How do you classify and invoice the goods?',
      paragraphs: [
        'Find the commodity code first, using the UK Trade Tariff; HMRC says you must find the right code for the goods you export, and your agent or transporter may be able to help. TradeDocs never suggests a code for a product.',
        'Then prepare the invoice. GOV.UK says the completed invoice and any licences or certificates must travel with the goods. Use the price you are selling the goods for, or their market value if you are not selling them, and list any freight or export insurance included in the price separately. Agree the Incoterms® 2020 rule and named place with the buyer first, because it decides which of those costs sit in your price.',
        'If the goods qualify for a reduced or zero rate of duty in the destination, GOV.UK says you may need proof of origin, which TradeDocs does not prepare. You may also be able to zero rate the sale for VAT.',
      ],
    },
    {
      heading: 'When must the export declaration be made?',
      paragraphs: [
        'Before the goods leave, with deadlines set by the last mode of transport. HMRC lists these minimum times in its guidance on making a full export declaration.',
      ],
      table: {
        caption: 'Minimum lodging times for a UK full export declaration, from HMRC guidance',
        head: ['Last mode of transport', 'Declare at least'],
        rows: [
          ['Road and inland waters', '1 hour before departure'],
          ['Air', '30 minutes before departure from a UK airport'],
          [
            'Sea, containers to short-sea destinations (such as North Sea, Baltic or Mediterranean ports)',
            '2 hours before leaving port',
          ],
          ['Sea, all other containerised cargo', '24 hours before loading onto the vessel'],
          ['Sea, cargo not in a container', '2 hours before the goods leave the port'],
          [
            'Rail',
            '1 hour before arriving at the office of exit if the journey takes under 2 hours; otherwise 2 hours before leaving the UK',
          ],
        ],
      },
    },
    {
      heading: 'What happens after the goods leave?',
      paragraphs: [
        'HMRC must be told the goods have left, through a departure message sent by the systems at the point of exit, such as an inventory linked system or the Goods Vehicle Movement Service. Without one, HMRC says the declaration cannot be used as official evidence of export, though commercial evidence under VAT Notice 703 can support VAT zero rating.',
        'Keep the records. GOV.UK says you must keep commercial invoices and any customs paperwork, and VAT-registered businesses record the goods in their VAT accounts even when the sale is zero rated.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do I need an EORI number to export from the UK?',
      a: 'Yes, for goods leaving England, Wales or Scotland HMRC requires an EORI number starting with GB. Goods moving to or from Northern Ireland may need one starting with XI.',
    },
    {
      q: 'Can a freight forwarder make the export declaration for me?',
      a: 'Yes. HMRC says you can hire someone to deal with customs and transport. They submit the declaration, but they need accurate data from your invoice and packing list.',
    },
    {
      q: 'Do I charge VAT on goods exported from the UK?',
      a: 'You may be able to zero rate them, charging VAT at 0%. HMRC’s VAT Notice 703 sets the conditions and the evidence of export you need to keep.',
    },
    {
      q: 'Which documents travel with UK export goods?',
      a: 'GOV.UK says the completed invoice and any licences or certificates must travel with the goods. The carrier adds its transport document, and the buyer may ask for more for import.',
    },
    {
      q: 'Is exporting to the EU different from exporting elsewhere?',
      a: 'From Great Britain, the same export declaration process applies. Some exporters use Common Transit for road journeys into the EU, which moves customs formalities away from the border.',
    },
  ],
  sources: [
    'b6-gov-uk-export-goods',
    'b6-gov-uk-full-export-declaration',
    'w5-gov-uk-eori',
    'w4-gov-uk-commodity-codes',
    'a3-hmrc-vat-notice-703',
    'b6-gov-uk-transit-check',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/invoice-generator',
  callout: {
    afterSection: 4,
    tool: '/tools/invoice-generator',
    title: 'Build the invoice the declaration is made from',
    text: 'The commercial invoice generator lays out the parties, goods, values, currency and Incoterms® rule, so your agent has the data the export declaration needs.',
  },
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  related: [
    '/guides/eori-number',
    '/guides/uk-commodity-codes',
    '/blog/export-documents-checklist',
    '/guides/transit-declarations-t1-ncts',
    '/guides/cmr-note',
    '/guides/how-to-export-from-the-us',
  ],
  cover: {
    id: '_9pRPwRuyE0',
    src: 'https://images.unsplash.com/photo-1698002794901-b532ba0dafaf',
    width: 4000,
    height: 3000,
    alt: 'A container ship at Felixstowe container terminal, seen across the water from Harwich',
    caption: 'Felixstowe container terminal, seen from Harwich',
    photographer: { name: 'Frank', profile: 'https://unsplash.com/@generein' },
    page: 'https://unsplash.com/photos/a-body-of-water-with-boats-in-the-background-_9pRPwRuyE0',
  },
};

export default article;
