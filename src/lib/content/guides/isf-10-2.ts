import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06/07): "isf filing" 880, KD 8; "importer security
 * filing" 880, KD 8; "isf 5" 70; "isf penalty" 50.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B (v2 guide #25).
 * Describes 19 CFR Part 149 as published; TradeDocs does not file the ISF.
 */
const article: ContentArticle = {
  slug: 'isf-10-2',
  title: 'ISF filing (10+2): what the Importer Security Filing needs',
  metaTitle: 'ISF filing (10+2): the Importer Security Filing',
  description:
    'The Importer Security Filing for US-bound ocean cargo: the ten importer elements, the two carrier elements, the 24-hour deadline, who files, and which data comes from your documents.',
  lede: 'If goods are coming to the United States by ship, CBP wants to know about them before they are even loaded abroad. The Importer Security Filing is how, and most of what it asks for is already on the seller’s commercial invoice and packing list.',
  answer:
    'ISF filing is the Importer Security Filing CBP requires for cargo arriving in the US by vessel. Under 19 CFR Part 149, the ISF Importer or its agent submits ten data elements, most no later than 24 hours before loading at the foreign port. The carrier adds two: the stow plan and container status messages.',
  keyFacts: [
    'CBP’s Importer Security Filing and Additional Carrier Requirements rule, known as “10+2”, took effect on January 26, 2009 and applies to import cargo arriving by vessel.',
    'Under 19 CFR 149.2, eight ISF elements are due no later than 24 hours before the cargo is laden aboard the vessel at the foreign port.',
    'Under 19 CFR 149.3, ISF data is given for each good at the six-digit HTSUS level and at the house bill of lading level where one exists.',
    'Under 19 CFR 149.1, the ISF Importer is the goods’ owner, purchaser, consignee or agent such as a licensed customs broker.',
    'The basic importation and entry bond in 19 CFR 113.62 sets liquidated damages of $5,000 for each ISF violation.',
  ],
  definitions: [
    {
      term: 'Importer Security Filing (ISF)',
      meaning:
        'Advance cargo data that CBP requires electronically for goods arriving in the US by vessel.',
    },
    {
      term: 'ISF Importer',
      meaning:
        'The party causing the goods to arrive by vessel, responsible for the filing: usually the buyer, owner or consignee, or its agent.',
    },
    {
      term: 'ISF-5',
      meaning:
        'The shorter, five-element filing for cargo remaining on board (FROB) and in-bond shipments for immediate exportation or transportation and exportation.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is ISF filing?',
      paragraphs: [
        'It is advance information about ocean cargo bound for the United States. CBP’s rule, titled Importer Security Filing and Additional Carrier Requirements and commonly known as “10+2”, went into effect on January 26, 2009 and applies to import cargo arriving by vessel. Under 19 CFR 149.2, the filing is made in English through a CBP-approved electronic system; bulk cargo is excepted.',
        'The “10” is the importer’s data, the “2” is the carrier’s. CBP warns that failure to comply could result in monetary penalties, increased inspections and delay of cargo.',
      ],
    },
    {
      heading: 'What are the 10 ISF data elements?',
      paragraphs: [
        '19 CFR 149.3 lists them for goods to be entered into the US or delivered to a foreign trade zone. The manufacturer, country of origin and HTSUS number must be linked to one another at the line level. The table shows where a seller’s documents usually hold each one.',
      ],
      table: {
        caption: 'The ten ISF elements in 19 CFR 149.3 and where the data usually comes from',
        head: ['Element', 'What it is', 'Usual source'],
        rows: [
          ['1. Seller', 'Last known entity selling the goods', 'Commercial invoice'],
          ['2. Buyer', 'Last known entity buying the goods', 'Commercial invoice'],
          ['3. Importer of record number', 'IRS, EIN, SSN or CBP-assigned number', 'The importer'],
          ['4. Consignee number(s)', 'Number of the US party the goods are shipped for', 'The importer'],
          ['5. Manufacturer (or supplier)', 'Who last made, assembled or grew the goods, or supplied them', 'Seller'],
          ['6. Ship to party', 'First party to receive the goods after release', 'The importer'],
          ['7. Country of origin', 'Country of manufacture, production or growth', 'Commercial invoice'],
          ['8. HTSUS number', 'At least six digits, up to ten', 'The importer or its broker'],
          ['9. Container stuffing location', 'Where the goods were stuffed into the container', 'Seller or forwarder'],
          ['10. Consolidator (stuffer)', 'Who stuffed the container or arranged it', 'Seller or forwarder'],
        ],
      },
    },
    {
      heading: 'What are the 2 carrier elements?',
      paragraphs: [
        'They are the vessel stow plan and container status messages, and the carrier files them, not you. Under 19 CFR 4.7c, the incoming carrier must submit a stow plan no later than 48 hours after the vessel leaves the last foreign port. Under 19 CFR 4.7d, it must report container status messages for US-bound containers where it already creates or collects them in its equipment tracking system.',
      ],
    },
    {
      heading: 'When is the ISF due?',
      paragraphs: [
        'Most of it, 24 hours before loading abroad. 19 CFR 149.2 lets the importer give best available data for elements 5 to 8 at first, provided it updates them as soon as better information is available and no later than 24 hours before arrival. The filer must also update the ISF if anything changes before the goods reach a US port, and withdraw it if the goods are no longer coming to the US.',
        'The section sets the deadlines in three parts:',
      ],
      list: [
        'Seller, buyer, importer of record number and consignee number: no later than 24 hours before the cargo is laden at the foreign port.',
        'Manufacturer, ship to party, country of origin and HTSUS number: the same deadline.',
        'Container stuffing location and consolidator: as early as possible, and no later than 24 hours before arrival at a US port.',
      ],
    },
    {
      heading: 'Who files the ISF?',
      paragraphs: [
        'The ISF Importer, or an agent it authorises. 19 CFR 149.1 defines the ISF Importer as the party causing goods to arrive by vessel: for most shipments the goods’ owner, purchaser, consignee or an agent such as a licensed customs broker. For cargo remaining on board, it is the carrier or the NVOCC.',
        'Under 19 CFR 149.5, the ISF Importer needs a bond, such as a basic importation and entry bond or a specific ISF bond, and if it has none the filing agent may post its own. Agents keep the importer’s power of attorney. The basic importation and entry bond in 19 CFR 113.62 sets liquidated damages of $5,000 for each violation.',
      ],
    },
    {
      heading: 'What does the seller need to send for the ISF?',
      paragraphs: [
        'Accurate details, early. The importer cannot file on time without them, because the deadline falls before the ship sails. 19 CFR 149.2 recognises that the filer often receives the data from someone else and allows it to rely on what it reasonably believes to be true, which makes the seller’s documents the starting point.',
      ],
      steps: [
        'Agree with the buyer who supplies which elements, and by when, when you confirm the order.',
        'Send the commercial invoice and packing list, with the manufacturer’s name and address and country of origin, before the cargo is loaded.',
        'Tell the buyer or its broker the container stuffing location and the consolidator as soon as the container is packed.',
        'Report any change, such as a different supplier or added goods, so the filing can be updated before arrival.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does ISF apply to air or truck shipments?',
      a: 'No. Under 19 CFR 149.2, the Importer Security Filing applies to cargo arriving in the US by vessel. Other modes have their own advance data rules.',
    },
    {
      q: 'What is an ISF-5?',
      a: 'The filing for cargo remaining on board and for in-bond immediate exportation or transportation and exportation shipments. 19 CFR 149.3 lists five elements for it: booking party, foreign port of unlading, place of delivery, ship to party and HTSUS number.',
    },
    {
      q: 'Can the seller file the ISF?',
      a: 'The filing belongs to the ISF Importer defined in 19 CFR 149.1, usually the owner, purchaser or consignee, which may authorise an agent. A foreign seller typically supplies the data rather than filing.',
    },
    {
      q: 'Is the ISF the same as customs entry?',
      a: 'No. The ISF is advance security data filed before loading. Entry is the later filing that releases the goods and declares their value and classification for duty.',
    },
  ],
  sources: [
    'a1-cbp-isf',
    'b5-cfr-19-149-1',
    'b5-cfr-19-149-2',
    'b5-cfr-19-149-3',
    'b5-cfr-19-149-5',
    'b5-cfr-19-113-62',
    'b5-cfr-19-4-7c',
    'b5-cfr-19-4-7d',
  ],
  primaryTool: '/tools/packing-list-generator',
  callout: {
    afterSection: 1,
    tool: '/tools/invoice-generator',
    title: 'Put the ISF data on the invoice from the start',
    text: 'The commercial invoice generator records the seller, the buyer and each line’s country of origin, three of the details your buyer’s ISF filer will ask you for.',
  },
  tools: ['/tools/packing-list-generator', '/tools/invoice-generator', '/tools/landed-cost-calculator'],
  related: [
    '/guides/how-to-import-into-the-us',
    '/guides/importer-of-record',
    '/blog/importing-from-china-documents',
    '/blog/cbp-form-7501',
    '/guides/what-is-a-bill-of-lading',
  ],
  cover: {
    id: '9cCeS9Sg6nU',
    src: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738',
    width: 3991,
    height: 2661,
    alt: 'An aerial view of a shipping container yard where boxes wait to be loaded onto vessels bound abroad',
    caption: 'A container yard seen from above',
    photographer: { name: 'CHUTTERSNAP', profile: 'https://unsplash.com/@chuttersnap' },
    page: 'https://unsplash.com/photos/aerial-view-of-shipping-container-yard-9cCeS9Sg6nU',
  },
};

export default article;
