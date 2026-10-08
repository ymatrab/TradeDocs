import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google UK, 2026-10-07): "ncts" 14,800, KD 66; "t1 document" 260;
 * "tir carnet" 140. The US "ncts" figure (33,100) is a volume anomaly and is not used.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 * Scope: movements starting in Great Britain under common transit, from HMRC guidance and the
 * European Commission's customs transit page. TIR is explained only as far as GOV.UK states it.
 */
const article: ContentArticle = {
  slug: 'transit-declarations-t1-ncts',
  title: 'NCTS and T1 transit declarations: how UK transit works',
  metaTitle: 'NCTS and T1 transit declarations explained',
  description:
    'What NCTS is, when a transit declaration helps, what T1 status means for goods leaving Great Britain, what you need to set up, and what the TAD and MRN are for.',
  lede: 'A lorry leaving Great Britain for Italy crosses several customs borders. Transit lets it make that journey with duties suspended and the import formalities done at the destination, and in the UK every transit movement starts with a declaration in NCTS.',
  answer:
    'NCTS, the New Computerised Transit System, is the online system UK traders use to submit transit declarations under the Common Transit Convention. A transit declaration lets goods travel between the UK, the EU and other convention countries with duties suspended until the movement ends, and goods starting in Great Britain almost always move with T1 status.',
  keyFacts: [
    'HMRC says UK traders must use NCTS to move goods under the Common Transit Convention.',
    'The European Commission lists the United Kingdom as a common transit country since 1 January 2021.',
    'HMRC says movements of goods starting in Great Britain will almost always have T1 status.',
    'In most cases, HMRC requires an export declaration before the transit declaration for goods leaving Great Britain.',
    'Under HMRC guidance, the time limit to reach the office of destination on a transit declaration can be no more than 14 days.',
    'HMRC says proof of Union status (T2L) documents cannot be submitted through NCTS.',
  ],
  definitions: [
    {
      term: 'NCTS',
      meaning:
        'The New Computerised Transit System, used to submit transit declarations and notifications to customs.',
    },
    {
      term: 'T1',
      meaning:
        'The transit status of non-Union goods, which includes goods made in Great Britain and goods with UK duties paid.',
    },
    {
      term: 'MRN',
      meaning:
        'The Master Reference Number that NCTS issues when a transit declaration is accepted.',
    },
    {
      term: 'TAD',
      meaning:
        'The Transit Accompanying Document, which can travel with the goods and carries the MRN as a barcode.',
    },
    {
      term: 'TIR',
      meaning:
        'The Transports Internationaux Routiers procedure, used for road transit to or through countries in the TIR Convention.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is NCTS?',
      paragraphs: [
        'NCTS is the online system for submitting transit declarations and notifications to HMRC. HMRC says UK traders must use it to move goods under the Common Transit Convention. You reach it through third-party software or the free NCTS web channel, which HMRC describes as suitable for low-volume users.',
        'One declaration covers the whole journey: from the office of departure, through an office of transit for each customs area the goods enter, to the office of destination.',
      ],
    },
    {
      heading: 'Why would you use a transit declaration?',
      paragraphs: [
        'To move goods across several customs borders without clearing them at each one. The European Commission describes transit as suspending the duties, taxes and commercial policy measures that apply at import, so clearance can happen at the destination rather than at the point of entry.',
        'HMRC lists the practical effect: you can delay full import or export declarations and the payment of duties until the goods end their transit movement, and some formalities can be completed away from the border at a customs office or, for authorised consignors and consignees, at your own premises.',
      ],
    },
    {
      heading: 'Which countries use common transit?',
      paragraphs: [
        'The UK, the EU and the other members of the Common Transit Convention. HMRC lists Georgia, Iceland, Liechtenstein, Moldova, Montenegro, Norway, North Macedonia, Serbia, Switzerland, Turkey and Ukraine alongside the EU. The European Commission dates the UK’s membership from 1 January 2021 and bases the procedure on the Convention of 20 May 1987.',
        'For road journeys to or through a country outside the convention, GOV.UK points to the TIR procedure for countries in the TIR Convention. HMRC adds that any part of a TIR journey within Northern Ireland or the EU is declared to NCTS.',
      ],
    },
    {
      heading: 'What does T1 status mean?',
      paragraphs: [
        'T1 is the status of non-Union goods in transit. HMRC says goods made outside the EU and Northern Ireland are non-Union goods, and that includes goods made in Great Britain, goods with UK duties paid, and goods from the rest of the world. That is why a movement starting in Great Britain will almost always be T1.',
        'People often call the transit declaration a “T1 document” for that reason. The status goes on the declaration itself; Section 2 of HMRC’s Transit Manual Supplement explains how to work it out in less common cases, such as goods moving between Great Britain and Northern Ireland.',
      ],
    },
    {
      heading: 'What do you need before your first transit movement?',
      paragraphs: [
        'HMRC lists four set-up steps, plus an optional fifth for using your own premises.',
      ],
      steps: [
        'Get an EORI number.',
        'Work out the amount of transit guarantee you need.',
        'Get access to NCTS, through software or the web channel.',
        'Get access to the Customs Declaration Service.',
        'If you want movements to start or end at your premises, apply for authorised consignor or consignee status.',
      ],
    },
    {
      heading: 'What goes into an NCTS transit declaration?',
      paragraphs: [
        'Mostly data you already hold. HMRC’s guidance on moving goods out of Great Britain lists what the declaration needs, and most of it comes from the export declaration and your shipping documents. If you are moving several items together, you may be able to send them as one movement under one declaration.',
      ],
      table: {
        caption: 'NCTS declaration data from HMRC guidance and where it usually comes from',
        head: ['Data HMRC asks for', 'Where you usually find it'],
        rows: [
          ['EORI number', 'Your customs registration'],
          ['Status of the goods (usually T1)', 'Worked out from where the goods are made and cleared'],
          ['Local reference number (under 22 characters)', 'A reference you create yourself'],
          ['Guarantee reference number', 'Your transit guarantee'],
          [
            'Estimated time to reach the office of destination (14 days at most)',
            'Your route plan and haulier',
          ],
          ['MRN of the UK export declaration or previous declaration', 'Your customs agent or CDS'],
          [
            'Offices of departure, transit and destination',
            'HMRC’s office reference list, or your authorised consignor or consignee',
          ],
          ['Description of the goods and vehicle details', 'The commercial invoice, packing list and haulier'],
        ],
      },
    },
    {
      heading: 'What are the TAD and the MRN for?',
      paragraphs: [
        'They tie the goods to the declaration on the road. When NCTS accepts a declaration, HMRC says the office of departure is notified, checks the request and releases the goods, and the system sends you a Master Reference Number. The Transit Accompanying Document carries that MRN as a number and a barcode, with a list of items when there are several.',
        'HMRC says the goods and the TAD must be presented at the office of destination so NCTS records that they have arrived; the MRN with its barcode can also be shown digitally.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a T1 the same as an export declaration?',
      a: 'No. The export declaration clears goods to leave the UK; the transit declaration in NCTS covers their journey to the destination. HMRC says the export declaration usually comes first.',
    },
    {
      q: 'Can I submit a T2L through NCTS?',
      a: 'No. HMRC lists proof of Union status (T2L) documents among the things NCTS cannot be used for.',
    },
    {
      q: 'What happens if NCTS is unavailable?',
      a: 'HMRC says a Business Continuity Procedure lets you start a transit movement with an offline TAD; the Transit Manual Supplement explains how to complete it.',
    },
    {
      q: 'Do I need a TIR carnet to drive into the EU?',
      a: 'Not for common transit, which covers the EU and the other convention countries. GOV.UK points to TIR for road journeys to or through countries outside common transit that are in the TIR Convention.',
    },
    {
      q: 'Who can submit a transit declaration?',
      a: 'You can, once set up with an EORI number, a guarantee and NCTS access, or you can get someone to deal with transit movements for you, as HMRC notes.',
    },
  ],
  sources: [
    'b6-gov-uk-ncts',
    'b6-gov-uk-transit-check',
    'b6-gov-uk-transit-set-up',
    'b6-gov-uk-transit-prepare-gb',
    'b6-ec-customs-transit',
  ],
  primaryTool: '/tools/invoice-generator',
  callout: {
    afterSection: 4,
    tool: '/tools/invoice-generator',
    title: 'Start from a complete commercial invoice',
    text: 'The goods description, values and parties on your declarations come from the invoice. The commercial invoice generator lays them out in one place for your agent.',
  },
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  related: [
    '/guides/cmr-note',
    '/guides/how-to-export-from-the-uk',
    '/guides/eori-number',
    '/blog/export-documents-checklist',
    '/blog/customs-status-messages-explained',
  ],
  cover: {
    id: 'Hw55McKlyi8',
    src: 'https://images.unsplash.com/photo-1722942537483-ca57d85a6f7c',
    width: 5842,
    height: 3430,
    alt: 'The Dover to Calais ferry loading in Dover harbour before crossing the Channel',
    caption: 'The Dover to Calais ferry loading in harbour',
    photographer: { name: 'Ed Wingate', profile: 'https://unsplash.com/@ed_wingate' },
    page: 'https://unsplash.com/photos/a-cruise-ship-docked-at-a-dock-in-a-harbor-Hw55McKlyi8',
  },
};

export default article;
