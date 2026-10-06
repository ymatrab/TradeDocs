import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "export from usa" 2,900, KD 33; "how to export" 880,
 * KD 23.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'how-to-export-from-the-us',
  title: 'How to export from the US: a first shipment, step by step',
  metaTitle: 'How to export from the US, step by step',
  description:
    'A first export from the United States in order: find the Schedule B number, check export controls, screen the buyer, agree the Incoterms rule, prepare the documents and file EEI.',
  lede: 'A first export is mostly a sequence of checks, done in the right order. Several of the lookups are free official tools, and many only need doing once per product or customer. This guide walks through them from the first quotation to the goods leaving the country.',
  answer:
    'To export from the US, classify the product with its Schedule B number, check whether it needs an export licence, screen the buyer, agree the Incoterms® rule and named place, prepare the proforma, commercial invoice and packing list, book the carrier, file Electronic Export Information in AES when required, and keep the records for five years.',
  keyFacts: [
    'The U.S. Census Bureau administers Schedule B, the 10-digit classification used for US exports.',
    'BIS says an ECCN, the export control number, is entirely unrelated to the Schedule B number and HTS code.',
    'EAR99 items need no licence in most situations, but may need one for a restricted end user, end use or destination, according to BIS.',
    'The ITA’s Consolidated Screening List combines export screening lists from the Departments of Commerce, State and the Treasury.',
    'EEI is filed in AES when a Schedule B line is worth over $2,500 or another filing requirement, such as a licence, applies.',
  ],
  definitions: [
    {
      term: 'Schedule B number',
      meaning: 'The 10-digit US export classification code for a product, from the Census Bureau.',
    },
    {
      term: 'ECCN',
      meaning:
        'Export Control Classification Number: the five-character code on the Commerce Control List that decides licence needs.',
    },
    {
      term: 'EAR99',
      meaning:
        'The designation for items subject to the EAR that match no ECCN on the Commerce Control List.',
    },
    {
      term: 'USPPI',
      meaning:
        'The US principal party in interest, usually the US seller, named in the export filing.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What are the steps to export from the US?',
      paragraphs: [
        'There are eight, and the order matters because each one feeds the next: you cannot check controls without knowing what the product is, and you cannot file the export record without the documents.',
      ],
      steps: [
        'Find the product’s Schedule B number in the Census Bureau’s search tool.',
        'Check its export control classification: an ECCN on the Commerce Control List, or EAR99.',
        'Screen the buyer and any other party against the Consolidated Screening List.',
        'Ask the buyer which documents its customs will need on arrival.',
        'Agree the Incoterms® 2020 rule and named place, and quote on that basis.',
        'Issue a proforma invoice, then the commercial invoice and packing list for the goods that ship.',
        'Book the carrier and give it the export details for the bill of lading or air waybill.',
        'File EEI in AES before departure if required, give the carrier the ITN, and keep the records.',
      ],
    },
    {
      heading: 'How do you classify a product for export?',
      paragraphs: [
        'Start with the Schedule B number. The ITA explains that the United States uses a 10-digit Schedule B number to classify exports, administered by the Census Bureau, and that its first six digits are the international HS code your buyer’s customs will also recognise. The Census Bureau’s free Schedule B search tool is where to look it up, and TradeDocs does not suggest codes.',
        'Note the number down with the product. It goes into the export filing, and the ITA lists the commercial invoice among the shipping documents it helps you complete. The guide HS code vs HTS code vs Schedule B explains how the three numbers relate.',
      ],
    },
    {
      heading: 'Do I need an export licence?',
      paragraphs: [
        'Check rather than assume. BIS says the key question is whether the item is described by an Export Control Classification Number on the Commerce Control List. Items subject to the Export Administration Regulations that match no ECCN are designated EAR99, and BIS says EAR99 items do not need a licence in most situations.',
        'The exceptions are the destination, the end user and the end use. BIS notes that even EAR99 items may need a licence if they are going to a prohibited or restricted end user, end use or destination of concern. Other agencies license other goods: the ITA lists the State Department for defence articles, the Nuclear Regulatory Commission and the Drug Enforcement Administration among the issuers. If an item is controlled, the ITA adds, a destination control statement goes on the commercial invoice and the transport document.',
      ],
    },
    {
      heading: 'How do you check the buyer?',
      paragraphs: [
        'Screen every party to the sale against the Consolidated Screening List, which the ITA publishes with a search engine, downloadable files and an API. It brings together export screening lists kept by the Departments of Commerce, State and the Treasury. If a name appears to match, the ITA says further due diligence is needed before going ahead, because there may be an export prohibition, a licence requirement or other restrictions.',
        'Keep a record of each screening with its date. Screen again when a new party appears, such as a different consignee or a freight agent abroad.',
      ],
    },
    {
      heading: 'Which Incoterms® rule should a first export use?',
      paragraphs: [
        'One you can carry out. The Incoterms® 2020 rules, published by the ICC, decide where delivery happens, who pays for the main carriage and who clears the goods for import. Under FCA the seller hands the goods to the buyer’s carrier at a named place and clears them for export; under DAP the seller carries the goods to a named place at destination and the buyer clears them for import. Under DDP the seller also clears the goods for import and pays the duties, which needs the ability to act as importer in the buyer’s country.',
        'Write the rule with its named place and version on the quotation and the invoice, such as “FCA Newark, seller’s warehouse, Incoterms® 2020”, and price accordingly. If you quote a delivered rule, estimate the destination’s duty and taxes first with the rates your buyer’s broker gives you.',
      ],
    },
    {
      heading: 'Which documents does a US export need?',
      paragraphs: [
        'The core set is the commercial invoice, the packing list and the transport document. The ITA describes the commercial invoice as a bill for the goods from seller to buyer that customs uses to determine duties, and the bill of lading as a contract between the owner of the goods and the carrier. A proforma invoice usually comes first, so the buyer can arrange payment or an import permit.',
        'The importing country may want more, such as certificates for standards, health or safety, a pre-shipment inspection, or proof of origin, which TradeDocs does not prepare. The ITA’s advice is to ask the foreign buyer at the start which documents its customs will need, and its Country Commercial Guides list requirements by country.',
      ],
    },
    {
      heading: 'When do you file EEI, and what records do you keep?',
      paragraphs: [
        'Electronic Export Information is filed in the Automated Export System by the USPPI or its authorised agent, generally when any Schedule B line is worth over $2,500 or the goods need a licence, with exemptions such as most shipments to Canada. AES returns an ITN, which goes to the carrier and on the bill of lading or air waybill. The deadline depends on the mode: for vessel cargo, 24 hours before loading, under 15 CFR 30.4.',
        'Under 15 CFR 30.10, keep the documents for the shipment for five years from the date of export. The guide EEI, AES filing and the ITN covers the filing in detail.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is an export licence issued to the company or to the shipment?',
      a: 'The ITA describes an export licence as authorising specific goods, in specific quantities, to a particular destination for a particular end use. Whether one is needed depends on the item, where it goes and who uses it.',
    },
    {
      q: 'Can a freight forwarder handle the export for me?',
      a: 'A forwarder can book the carrier and, if you authorise it, file the EEI. You remain the USPPI and responsible for giving it accurate information about the goods and the sale.',
    },
    {
      q: 'Does each product need its own Schedule B number?',
      a: 'Each product is classified on its own, and the $2,500 EEI test in 15 CFR 30.37 is applied per Schedule B number, so a mixed shipment is checked line by line.',
    },
    {
      q: 'When should the export checks start?',
      a: 'When you quote, not when the goods are packed. Classification, screening and the buyer’s list of documents can all change the price, the timing or whether the sale can go ahead.',
    },
  ],
  sources: [
    'w5-ita-hs-codes',
    'w5-census-schedule-b',
    'w5-bis-classify',
    'w5-ita-csl',
    'trade-gov-export-documents',
    'icc-incoterms-2020',
    'w5-ftr-30-3',
    'w5-ftr-30-4',
    'w5-ftr-30-10',
    'w5-ftr-30-36',
    'w5-ftr-30-37',
    'trade-gov-proforma-invoice',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/proforma-invoice-generator',
    '/tools/packing-list-generator',
    '/tools/incoterms',
  ],
  callout: {
    afterSection: 4,
    tool: '/tools/proforma-invoice-generator',
    title: 'Quote with a proforma invoice',
    text: 'Set out the goods, prices, the Incoterms® 2020 rule and the named place in a proforma invoice, so the buyer can arrange payment and tell you which documents its customs needs.',
  },
  related: [
    '/blog/export-documents-checklist',
    '/guides/eei-aes-filing-itn',
    '/guides/hs-vs-hts-vs-schedule-b',
    '/blog/commercial-invoice-requirements',
    '/blog/fca-vs-fob',
  ],
  cover: {
    id: '85gDb_IHdAQ',
    src: 'https://images.unsplash.com/photo-1774698078446-59299e016718',
    width: 6960,
    height: 4640,
    alt: 'Cargo plane being loaded on an airport apron, an export shipment ready to depart',
    caption: 'Cargo plane being loaded at an airport',
    photographer: { name: 'Peaky_82', profile: 'https://unsplash.com/@peaky_82' },
    page: 'https://unsplash.com/photos/cargo-plane-being-loaded-at-an-airport-tarmac-85gDb_IHdAQ',
  },
};

export default article;
