import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "cbp form 3461" 320; "customs entry" 170;
 * "entry summary" 110; "informal entry" 70.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C.
 */
const article: ContentArticle = {
  slug: 'cbp-form-3461',
  title: 'CBP Form 3461: the US entry that gets your goods released',
  metaTitle: 'CBP Form 3461: entry and immediate delivery',
  description:
    'What CBP Form 3461 is, when it is filed, how it differs from Form 7501, and which of its blocks come from your commercial invoice, packing list and bill of lading.',
  lede: 'Before an imported shipment can leave the port, someone has to ask CBP to release it. In the United States that request is the entry, and its form is CBP Form 3461. You will rarely file it yourself, but the data on it comes from the documents you send.',
  answer:
    'CBP Form 3461 is the US entry/immediate delivery form: the filing an importer or customs broker makes to get imported goods released from CBP custody. Filed on paper or as its electronic equivalent in ACE, it names the importer, bond, carrier, bill of lading and, per line, the HTS number, value and country of origin.',
  keyFacts: [
    'Under 19 CFR 142.3, the entry documents include CBP Form 3461 or its electronic equivalent, evidence of the right to make entry, a commercial invoice and a packing list where appropriate.',
    'Under 19 CFR 142.2, goods are entered within 15 calendar days after landing, and the entry documents may be filed before the goods arrive.',
    'Under 19 CFR 142.22, an immediate delivery application on Form 3461 may be supported by a pro forma invoice or other document describing the goods, quantities and values.',
    'CBP’s Form 3461 instructions require a 10-digit HTS number, a US dollar value and the actual country of origin for each line.',
    'Under 19 CFR 142.12, the entry summary on CBP Form 7501 follows within 10 working days after the time of entry when it was not filed at entry.',
  ],
  definitions: [
    {
      term: 'Entry',
      meaning:
        'Under 19 CFR 141.0a, the documents or data filed to secure the release of imported goods from CBP custody.',
    },
    {
      term: 'Immediate delivery',
      meaning:
        'Release of goods under a special permit before the entry summary is filed, in the cases listed in 19 CFR 142.21.',
    },
    {
      term: 'Entry number',
      meaning:
        'The 11-character number on Form 3461: a three-character filer code, a seven-digit number and a check digit.',
    },
    {
      term: 'ACE',
      meaning:
        'The Automated Commercial Environment, CBP’s electronic system to which entry data is transmitted under 19 CFR 142.16.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is CBP Form 3461?',
      paragraphs: [
        'CBP Form 3461 is the entry/immediate delivery form, the request to release imported goods from CBP custody. The current edition is dated 01/25 and cites 19 CFR 142.3, 142.16, 142.22, 142.24 and 149.3 as its authority. Most filings are electronic: the form is the paper face of data a broker transmits to ACE, and 19 CFR 142.3 allows the electronic equivalent in place of the paper form.',
        'CBP’s own purpose statement on the form explains what it does with the data. It lets CBP officers verify that the consignee and shipment information is correct and that a bond is on file. CBP also uses it to close out the carrier’s manifest and to establish the obligation to pay estimated duties within the time the law allows. The statement adds that failing to provide the information may prevent release.',
      ],
    },
    {
      heading: 'When is Form 3461 filed?',
      paragraphs: [
        'Within 15 calendar days after the goods land, under 19 CFR 142.2, or after arrival at the port of destination for goods moved in bond. The same section allows the entry documents to be submitted before the goods arrive, which is how brokers get shipments cleared close to the moment they are unloaded.',
        'Form 3461 is not always used. Under 19 CFR 142.16(b), when the entry summary is filed at the time of entry, so that one filing serves as both entry and entry summary, Form 3461 or its electronic equivalent is not required. When the entry is filed first, under 19 CFR 142.12 the entry summary follows within 10 working days after the time of entry, with estimated duties attached.',
      ],
    },
    {
      heading: 'What does “immediate delivery” mean on the form?',
      paragraphs: [
        'It is release under a special permit before the entry summary is filed. Under 19 CFR 142.21, it is available in listed cases, among them goods arriving by land from Canada or Mexico at the port director’s discretion where the importer has a bond on CBP Form 301, fresh fruits and vegetables from those countries, shipments for US Government agencies, articles for a trade fair and some quota-class goods.',
        'Under 19 CFR 142.22, the application is made on Form 3461 or its electronic equivalent. A commercial invoice is not required at that stage, apart from the case in 19 U.S.C. 1484(j): the importer may present a pro forma invoice, waybill or other document with an adequate description, the quantities and the values or approximate values. The goods stay in CBP custody until the entry summary is filed, and under 19 CFR 142.23 that must happen, with estimated duties deposited, within 10 working days after release.',
      ],
    },
    {
      heading: 'Which Form 3461 blocks come from your documents?',
      paragraphs: [
        'Most of the shipment data. The header names the importer, bond and port; the line and bill of lading blocks repeat what is on your invoice, packing list and transport document. The table follows CBP’s instructions on the 01/25 edition.',
      ],
      table: {
        caption: 'CBP Form 3461 blocks and where the filer finds the data (CBP Form 3461, 01/25)',
        head: ['Block', 'What CBP’s instructions ask for', 'Usual source'],
        rows: [
          [
            '2 Bond type',
            'Single transaction bond, continuous bond or no bond required',
            'The importer’s bond on file with CBP',
          ],
          [
            '4 Importer name and address',
            'The name and address of the importer of record',
            'The buyer or consignee on the invoice, as agreed',
          ],
          [
            '9 Entry type',
            'A two-digit code, such as 01 for free and dutiable consumption entries or 11 for informal entries',
            'The broker’s choice for the shipment',
          ],
          [
            '28 HTS code',
            'The 10-digit HTS number for the line',
            'The importer’s classification of your description',
          ],
          [
            '29 Description',
            'The HTS code, or a commercial or invoice description where the code is not known',
            'The line descriptions on the commercial invoice',
          ],
          [
            '32 Value',
            'The line value in US dollars, rounded to the nearest whole dollar',
            'Prices and currency on the commercial invoice',
          ],
          [
            '33 Country of origin',
            'The country of manufacture, production or growth, not the country of invoice or export',
            'The origin you state for each line',
          ],
          [
            '43–44 Bill of lading and quantity',
            'The bill of lading number from the carrier’s manifest and the quantity in the smallest exterior packaging unit',
            'The bill of lading or air waybill and the packing list',
          ],
        ],
      },
    },
    {
      heading: 'How do Form 3461 and Form 7501 fit together?',
      paragraphs: [
        'Form 3461 gets the goods released; Form 7501 settles the duty. Under 19 CFR 141.0a, the entry is what secures release and the entry summary is what lets CBP assess duties and collect statistics. Under 19 CFR 142.16(a), the importer may use the entry documents to prepare the entry summary on Form 7501 and must file them with it.',
        'Block 27 on Form 3461 is for CBP use only. It carries the release authorisation and boxes for “CBP examination required” and for other agency action, which is where a shipment is held back for inspection. Block 26 is where the broker gives the container numbers for containerised sea cargo and, if there is more than one site, the preferred site for an intensive exam.',
      ],
    },
    {
      heading: 'Is an informal entry made on Form 3461?',
      paragraphs: [
        'Usually not, though the two can meet. Under 19 CFR 143.21, shipments not exceeding $2,500 in value are among those that may be entered informally, with exceptions for some Chapter 99 articles. Under 19 CFR 143.23, an informal entry is made on CBP Form 368 or 368A, on Form 7501 or its electronic equivalent, or, if the Center director authorises it, on a commercial invoice carrying the importer’s signed declaration.',
        'The same section covers goods first released under immediate delivery or on the entry documents of 19 CFR 142.3, then entered on Form 7501 annotated “Informal Entry”. Form 3461 lists 11 and 12 as the informal entry type codes. Which route applies is the broker’s decision, and CBP may require a formal entry for any goods under 19 CFR 143.22.',
      ],
    },
    {
      heading: 'What can an exporter send so the entry goes through?',
      paragraphs: [
        'Everything the blocks above draw on, consistent across documents and in the broker’s hands before the goods land. These steps cover the data a Form 3461 filing needs.',
      ],
      steps: [
        'Send the commercial invoice and packing list to the buyer and its broker when the goods ship, not when they arrive.',
        'Describe each line in plain words: what it is, what it is made of and what it is for, so the importer can classify it.',
        'State the country of origin for each line, which may differ from the country you ship from.',
        'Give prices in the currency of sale with freight, insurance and other charges shown separately.',
        'Quote the bill of lading or air waybill number and the package count exactly as the carrier issued them.',
        'Number the packages and match them to the packing list, with container numbers for sea freight.',
      ],
    },
  ],
  faq: [
    {
      q: 'Who files CBP Form 3461?',
      a: 'The importer of record or a licensed customs broker acting for it. Block 23 carries the signature of the owner, purchaser or agent, and for electronic filing CBP treats certification as the equivalent of a signature.',
    },
    {
      q: 'Can a pro forma invoice support Form 3461?',
      a: 'For immediate delivery, yes. Under 19 CFR 142.22, the importer may present a pro forma invoice, waybill or similar document with an adequate description, quantities and values instead of a commercial invoice, except for goods released under 19 U.S.C. 1484(j).',
    },
    {
      q: 'Does Form 3461 need a customs bond?',
      a: 'Under 19 CFR 142.4, goods are not released at entry unless a single entry or continuous bond on CBP Form 301 is filed, subject to a limited waiver. Block 2 records the bond type and block 11 the surety code.',
    },
    {
      q: 'How is the Form 3461 entry number built?',
      a: 'CBP’s instructions describe 11 characters: the three-character filer code CBP assigned, a seven-digit number chosen by the filer and used only once, and a check digit calculated from the first ten.',
    },
    {
      q: 'Is Form 3461 the same as the ISF?',
      a: 'No. The Importer Security Filing is a separate advance filing that CBP requires for import cargo arriving by vessel. Form 3461 is the entry that requests release once the goods are at, or about to reach, the port.',
    },
  ],
  sources: [
    'c2-cbp-form-3461',
    'a3-ecfr-19-cfr-141-0a',
    'w3-cbp-19-cfr-142-2',
    'a3-ecfr-19-cfr-142-3',
    'a5-cfr-19-142-4',
    'a3-ecfr-19-cfr-142-12',
    'c2-cfr-19-142-16',
    'c2-cfr-19-142-21',
    'c2-cfr-19-142-22',
    'c2-cfr-19-142-23',
    'w3-cbp-19-cfr-143-21',
    'c2-cfr-19-143-23',
    'a1-cbp-isf',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Give the broker the line data first time',
    text: 'The commercial invoice generator has fields for each line’s description, origin, quantity, unit price and currency, plus separate freight and insurance charges: the facts a Form 3461 filing repeats.',
  },
  related: [
    '/blog/cbp-form-7501',
    '/guides/how-to-import-into-the-us',
    '/guides/importer-of-record',
    '/blog/what-is-customs-clearance',
    '/guides/isf-10-2',
  ],
  cover: {
    id: 'w8VfTO3TGs8',
    src: 'https://images.unsplash.com/photo-1769144256181-698b8f807066',
    width: 3911,
    height: 2199,
    alt: 'Aerial view of a container ship being unloaded at a port, the cargo that a US entry asks CBP to release',
    caption: 'A container ship being unloaded at the port of Vancouver, seen from above',
    photographer: { name: 'Daniel Miksha', profile: 'https://unsplash.com/@danielmiksha' },
    page: 'https://unsplash.com/photos/cargo-ship-loaded-with-colorful-containers-at-a-port-w8VfTO3TGs8',
  },
};

export default article;
