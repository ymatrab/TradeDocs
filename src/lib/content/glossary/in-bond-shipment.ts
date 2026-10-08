import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'in-bond-shipment',
  term: 'In-bond shipment',
  aliases: ['in bond', 'in-bond movement', 'IT entry', 'T&E entry', 'transportation in bond'],
  demand: {
    keyword: 'in bond',
    market: 'US',
    volume: 320,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'In-bond shipment: meaning, IT and T&E moves',
  description:
    'What an in-bond shipment is in the United States, who files the in-bond application, the time limits CBP sets, and how IT and T&E movements differ, with the documents involved.',
  shortDefinition:
    'An in-bond shipment is imported cargo that moves within the United States under customs control, before duty is paid or the goods are released, carried under a customs bond to another port for entry or for export.',
  definition: [
    'Goods do not have to clear customs where they first land. A container that arrives in Los Angeles for a buyer in Chicago can travel inland still under CBP control, and be entered in Chicago. That movement is in bond: the bond guarantees that the goods arrive intact and that duties are paid or the goods leave the country.',
    'Under 19 CFR 18.1 the in-bond application, a transportation entry and a manifest, goes to CBP through an approved electronic system, filed by the carrier that brought the goods, the bonded carrier that will take them on, or a person with a sufficient interest in them. CBP authorizes the movement electronically. The goods must generally reach the destination or export port within 30 days, and their arrival must be reported within two business days, with the code for where they are held. Missing either is an irregular delivery.',
    'The common types are immediate transportation (IT), to another U.S. port for entry there, and transportation and exportation (T&E), through the country to another port for export. Under 19 CFR 18.20, T&E goods must be exported within 15 calendar days of arriving at the port of exportation unless CBP extends the time.',
  ],
  onYourDocuments: [
    'The in-bond application is a carrier or broker filing, not an exporter’s document. Your commercial invoice and packing list do not change, but they travel with a bill of lading that names the final U.S. place of delivery, which is where the in-bond carriage ends.',
    'If you sell on DAP or DDP to an inland U.S. city, ask the forwarder whether the goods will be entered at the port or moved in bond, because the place of entry decides where the broker files and where an exam would happen.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Nordwind Werkzeuge (invented), a German toolmaker, ships a container to a distributor in Denver. The carrier discharges it in Long Beach and files an IT in-bond application; CBP authorizes the move and the container goes by rail to Denver under the carrier’s bond.',
      'The rail operator reports arrival in Denver the next day, and the distributor’s broker files the entry there, using Nordwind’s commercial invoice and packing list.',
    ],
  },
  confusedWith: [
    {
      term: 'Bonded warehouse',
      difference:
        'A bonded warehouse stores imported goods under customs control with duty deferred. An in-bond shipment is goods moving under customs control from one place to another.',
    },
  ],
  related: [
    '/blog/customs-bond',
    '/guides/how-to-import-into-the-us',
    '/blog/what-is-customs-clearance',
    'transshipment',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator produces the invoice the broker at the in-bond destination files the entry with, matching the bill of lading’s consignee and delivery place.',
  faq: [
    {
      q: 'How long does an in-bond shipment have to reach its destination?',
      a: 'Under 19 CFR 18.1 the goods must generally arrive at the destination or export port within 30 days of the movement starting, and arrival must be reported to CBP within two business days.',
    },
    {
      q: 'What is the difference between an IT and a T&E in-bond?',
      a: 'An immediate transportation (IT) moves goods to another U.S. port where they are entered. A transportation and exportation (T&E) moves them across the United States to another port to be exported, without entry.',
    },
  ],
  sources: ['d5-cfr-19-18-1', 'd5-cfr-19-18-20', 'd5-cfr-19-19-41'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
