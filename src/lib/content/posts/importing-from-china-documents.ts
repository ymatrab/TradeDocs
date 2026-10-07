import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "importing from china" 2,400, KD 32;
 * "shipping from china to us" 1,000, KD 2.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A.
 * US import side only, from CBP regulations (via Cornell LII), CBP's CSMS on de minimis, the
 * February 2026 executive order and USTR's Section 301 page. No duty rates, no classification,
 * no broker or freight prices. Tariff measures change often; the text says to check the
 * current CBP and USTR pages.
 */
const article: ContentArticle = {
  slug: 'importing-from-china-documents',
  title: 'Importing from China into the US: the documents you need',
  metaTitle: 'Importing from China: documents for US customs',
  description:
    'The commercial invoice, packing list, bill of lading, ISF, bond and entry forms for goods shipped from China to the US, who prepares each, and when.',
  lede: 'Buying from a Chinese supplier is the easy part. Getting the goods released in the United States depends on a short set of documents, some prepared by the supplier, some by the carrier and some by you or your customs broker, and on filing one of them before the container is even loaded.',
  answer:
    'To import goods from China into the US you need the supplier’s commercial invoice and packing list, the bill of lading or air waybill, a customs entry (CBP Form 3461 or its electronic equivalent, then the entry summary), a customs bond for most entries and, for ocean freight, an Importer Security Filing lodged 24 hours before loading.',
  keyFacts: [
    'Under 19 CFR 142.3, US entry documents are CBP Form 3461 or its electronic equivalent, evidence of the right to make entry, a commercial invoice, a packing list where appropriate, and any documents other agencies require.',
    'Under 19 CFR 149.2, the Importer Security Filing for ocean cargo is due no later than 24 hours before the cargo is laden aboard the vessel at the foreign port.',
    'Under 19 CFR 142.4, merchandise is not released from CBP custody unless a single entry or continuous bond has been filed, with limited exceptions.',
    'CBP’s CSMS # 66065494 states that from 29 August 2025 goods of all countries no longer receive duty-free de minimis treatment, whatever their value.',
    'Under 19 CFR 134.11, every imported article of foreign origin, or its container, must be marked with the English name of its country of origin.',
  ],
  definitions: [
    {
      term: 'Importer of record',
      meaning:
        'The party responsible to CBP for the entry, its accuracy and the duties, taxes and fees on the goods.',
    },
    {
      term: 'Importer Security Filing (ISF)',
      meaning:
        'Advance data about ocean cargo, often called “10+2”, sent to CBP before the goods are loaded abroad.',
    },
    {
      term: 'Customs bond',
      meaning:
        'A surety contract that guarantees payment of duties and compliance with CBP rules, for one entry or continuously.',
    },
    {
      term: 'Entry summary',
      meaning:
        'The filing that follows the entry and declares the classification, value and duty of the goods.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What documents do you need to import from China?',
      paragraphs: [
        'The core set is the same as for any US import. 19 CFR 142.3 lists the entry documentation: CBP Form 3461 or its electronic equivalent, evidence of the right to make entry, a commercial invoice, a packing list where appropriate, and other documents that CBP or other federal, state or local agencies require for the particular goods. Ocean shipments add the Importer Security Filing, and most entries need a bond.',
      ],
      table: {
        caption: 'Documents for a US import from China and who usually prepares them',
        head: ['Document', 'Usually prepared by', 'When'],
        rows: [
          ['Commercial invoice', 'Chinese supplier', 'Before shipment; needed for entry'],
          ['Packing list', 'Chinese supplier', 'Before shipment, with the invoice'],
          ['Bill of lading or air waybill', 'Carrier or forwarder', 'When the goods are loaded'],
          ['Importer Security Filing (ocean only)', 'Importer or its broker', 'No later than 24 hours before loading in China'],
          ['Customs bond', 'Importer, through a surety, often via a broker', 'Before entry'],
          ['Entry (CBP Form 3461 or electronic) and entry summary', 'Importer or its licensed customs broker', 'At or before arrival, within the CBP time limits'],
          ['Other agency documents', 'Importer, with the supplier’s data', 'As the agency requires for the goods'],
        ],
      },
    },
    {
      heading: 'What should the Chinese supplier’s invoice show?',
      paragraphs: [
        'Everything 19 CFR 141.86 asks for, because CBP works from it to value and classify the goods. Check the supplier’s draft against the rule before the goods ship, while it is still easy to correct. The rule requires, among other things, the port of entry, the parties and the place and time of the sale, a detailed description of the goods with the marks and numbers on the packages, the quantities, the purchase price of each item in the currency of purchase, all charges itemised by name and amount, any rebates, and the country of origin.',
        'The invoice and the packing list must agree on quantities, package counts and marks. If the supplier’s template leaves fields out, send them a complete invoice layout to fill in, and keep the final signed copy with your entry records.',
      ],
    },
    {
      heading: 'What is the ISF, and when must it be filed?',
      paragraphs: [
        'It is the Importer Security Filing, advance information about ocean cargo that CBP calls “10+2”. Under 19 CFR 149.2, the ISF Importer or its agent must submit most of the data, including the seller, buyer, manufacturer, ship-to party, country of origin and tariff number, no later than 24 hours before the cargo is laden aboard the vessel at the foreign port.',
        'The rule applies only to cargo arriving by vessel. CBP warns that failing to comply can lead to monetary penalties, more inspections and delayed cargo. In practice the ISF needs data from your supplier days before the container is loaded in China, so ask for the manufacturer’s name and address and the container stuffing location when you place the order.',
      ],
    },
    {
      heading: 'Do you need a customs broker and a bond?',
      paragraphs: [
        'A bond, usually yes; a broker, not necessarily. Under 19 CFR 142.4, goods are not released from CBP custody unless a single entry or continuous bond on CBP Form 301 has been filed, apart from listed exceptions. A single entry bond covers one shipment; a continuous bond covers your entries over a period, which suits regular importers.',
        'You may file entries yourself, but CBP notes that many first-time importers use a licensed customs broker. CBP is also clear that the importer of record remains ultimately responsible for the correctness of the entry and for all duties, taxes and fees, even when a broker files it.',
      ],
    },
    {
      heading: 'Can small shipments from China still enter duty free?',
      paragraphs: [
        'Not under the de minimis rule as it stands. CBP’s CSMS # 66065494 states that from 12:01 a.m. on 29 August 2025, goods of all countries are no longer eligible for duty-free de minimis treatment, regardless of value, country of origin or mode of transport, and must be entered on a formal or informal entry with all duties, taxes and fees paid. An executive order of 20 February 2026 continued the suspension.',
        'Shipments valued at $2,500 or less may still qualify for an informal entry under 19 CFR 143.21, which is simpler than a formal entry, though some goods are excluded. Entry is due within 15 calendar days of arrival under 19 CFR 142.2. These rules have changed several times since 2025, so check CBP’s current guidance before you rely on any of them.',
      ],
    },
    {
      heading: 'What duties apply to goods from China?',
      paragraphs: [
        'The duty rate in the Harmonized Tariff Schedule for the goods’ classification, plus any additional duties that apply to Chinese-origin goods. The best known are the Section 301 tariffs, which USTR publishes as four lists of products of China. Other measures can apply on top, and rates change, so look up your classification in the official HTS search and check USTR and CBP for current additional duties. CBP makes the final determination of the rate.',
        'In the US, duty is generally charged on the transaction value, and 19 CFR 152.102 excludes international freight and insurance from the price actually paid or payable. Keep them as separate lines on the invoice so they can be identified. Never lower the declared value or describe the goods vaguely to reduce duty; the importer of record answers for the entry.',
      ],
    },
    {
      heading: 'How do you prepare the documents for a shipment from China?',
      paragraphs: [
        'Work backwards from the loading date in China, because the ISF and the supplier’s paperwork are needed first.',
      ],
      steps: [
        'Agree the Incoterms® rule with the supplier; under EXW you handle Chinese export clearance, under FCA or FOB the supplier does.',
        'Find the HTS classification and the duties that apply, and estimate the landed cost before you confirm the order.',
        'Arrange a customs bond and, if you use one, a licensed customs broker.',
        'Collect the ISF data from the supplier and file the ISF at least 24 hours before loading for ocean cargo.',
        'Check the draft commercial invoice and packing list against 19 CFR 141.86 and each other, and confirm the goods are marked with their country of origin.',
        'Send the final documents and the bill of lading or air waybill to your broker so the entry can be filed on time.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do I need an import licence to import from China into the US?',
      a: 'There is no single US import licence in the entry documents, but 19 CFR 142.3 includes any documents other federal, state or local agencies require, and some goods need permits or registrations. Check the agencies that cover your product.',
    },
    {
      q: 'Who files the ISF, the supplier or the importer?',
      a: 'The ISF Importer, as 19 CFR 149.1 defines it, or its authorized agent such as a customs broker, under 19 CFR 149.2. The supplier provides much of the data.',
    },
    {
      q: 'Does the invoice from China have to be in English?',
      a: 'For US entry, 19 CFR 141.86 requires the invoice in English or with an accurate English translation, so ask the supplier for an English invoice.',
    },
    {
      q: 'Do goods from China need to say “Made in China”?',
      a: '19 CFR 134.11 requires imported articles, or their containers, to be marked legibly and permanently with the English name of the country of origin, with some exceptions.',
    },
    {
      q: 'What happens if the documents are late or wrong?',
      a: 'The goods can be held, examined or sent to a general order warehouse at the consignee’s cost, and an inaccurate entry can bring penalties. Correct errors before the goods ship.',
    },
  ],
  sources: [
    'a1-cornell-19-cfr-142-3',
    'us-cbp-invoice-contents',
    'a1-cornell-19-cfr-149-2',
    'a1-cbp-isf',
    'a1-cornell-19-cfr-142-4',
    'w2-cbp-importer-tips',
    'a1-cbp-csms-de-minimis',
    'a1-whitehouse-eo-14388',
    'w3-cbp-19-cfr-143-21',
    'w3-cbp-19-cfr-142-2',
    'w3-cbp-19-cfr-127-1',
    'a1-ustr-301-china',
    'w4-usitc-hts-search',
    'w3-cbp-duty-rates',
    'w3-cbp-19-cfr-152-102',
    'a1-cornell-19-cfr-134-11',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/invoice-generator', '/tools/packing-list-generator'],
  callout: {
    afterSection: 1,
    tool: '/tools/invoice-generator',
    title: 'Send your supplier a complete invoice layout',
    text: 'Fill in a commercial invoice with the parties, goods, values and origin, download the PDF, and use it to check or replace the supplier’s draft.',
  },
  related: [
    '/blog/incoterms-for-importing-from-china',
    '/blog/how-to-calculate-import-duty',
    '/blog/commercial-invoice-requirements',
    '/blog/how-long-does-customs-clearance-take',
    '/guides/what-is-a-bill-of-lading',
    '/guides/hs-vs-hts-vs-schedule-b',
  ],
  cover: {
    id: 'qO2ztAz5g7A',
    src: 'https://images.unsplash.com/photo-1766040923580-16ad32fae8b4',
    width: 3840,
    height: 2160,
    alt: 'A large pile of taped brown cartons, the kind of imported shipment the entry documents describe',
    caption: 'A pile of brown cardboard boxes with blue tape',
    photographer: { name: 'Rohit Choudhari', profile: 'https://unsplash.com/@iamrohitchoudhari' },
    page: 'https://unsplash.com/photos/a-large-pile-of-brown-cardboard-boxes-with-blue-tape-qO2ztAz5g7A',
  },
};

export default article;
