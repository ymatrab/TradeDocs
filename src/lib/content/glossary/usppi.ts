import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'usppi',
  term: 'USPPI (U.S. principal party in interest)',
  abbreviation: 'USPPI',
  aliases: ['U.S. principal party in interest', 'US principal party in interest'],
  demand: {
    keyword: 'usppi',
    market: 'US',
    volume: 720,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'USPPI meaning: U.S. principal party in interest',
  description:
    'Who the USPPI is in a U.S. export, what the Foreign Trade Regulations ask it to report, how it differs from the exporter on the invoice, and what changes in a routed export.',
  shortDefinition:
    'The USPPI, or U.S. principal party in interest, is the person in the United States that receives the primary benefit, monetary or otherwise, from an export transaction. It is the party named in the USPPI field of the Electronic Export Information filed in AES.',
  definition: [
    'The term comes from the Census Bureau’s Foreign Trade Regulations, 15 CFR Part 30, which govern the Electronic Export Information (EEI) filed in the Automated Export System. Section 30.1 defines the USPPI as the person in the United States that receives the primary benefit of the export, and its counterpart, the foreign principal party in interest (FPPI), as the person abroad who buys the goods or to whom final delivery is made.',
    'In most sales the USPPI is the U.S. seller, often the manufacturer or a trading company that bought the goods for export. The rule turns on who benefits, not on who books the freight, so a forwarder that files on your behalf is your authorized agent, not the USPPI. A foreign buyer that is in the United States when it buys or obtains the goods for export is itself the USPPI.',
    'The USPPI may file the EEI itself or authorize an agent in writing. In a routed export transaction the FPPI authorizes a U.S. agent to arrange the export and file the EEI; the USPPI still has to give that agent complete and accurate export information and keep records that support it.',
  ],
  onYourDocuments: [
    'USPPI is a filing role, so it is not a box on a commercial invoice or packing list. The party that becomes the USPPI usually appears on your invoice as the seller or exporter, and the same name should go into the USPPI field of the EEI.',
    'The EEI asks for the USPPI’s name, its Employer Identification Number, a contact person who knows the shipment, and the address of origin where the goods start their journey to the port of export, even if the USPPI does not own that facility. Give your forwarder those details with the invoice and packing list, because an invoice may not carry everything the EEI needs.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Granite Ridge Tools of Ohio (invented) sells pumps to a distributor in Chile. Granite Ridge receives the payment, so it is the USPPI; the Chilean buyer is the FPPI. Its forwarder files the EEI under a written authorization, entering Granite Ridge’s name and EIN in the USPPI field and its warehouse in Dayton as the address of origin.',
      'If the Chilean buyer had instead appointed its own U.S. forwarder to arrange the export, the sale would be a routed export transaction: the buyer’s agent files, and Granite Ridge supplies the export information and keeps its records.',
    ],
  },
  confusedWith: [
    {
      term: 'Exporter of record',
      difference:
        'Exporter is the everyday word for the seller. USPPI is the defined role in the Foreign Trade Regulations, and in a routed export the party filing is the buyer’s agent, not the USPPI.',
    },
    {
      term: 'Consignor',
      difference:
        'The consignor is the party that hands goods to the carrier. It is often the USPPI, but a third-party warehouse can be the consignor while the seller remains the USPPI.',
    },
  ],
  related: [
    '/guides/eei-aes-filing-itn',
    '/guides/how-to-export-from-the-us',
    'consignor',
    'exporting',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator puts the seller’s name and address in the place your forwarder looks for the USPPI details.',
  faq: [
    {
      q: 'Who is the USPPI in an export?',
      a: 'The person in the United States that receives the primary benefit, monetary or otherwise, from the export, usually the U.S. seller. A freight forwarder filing for you is an authorized agent, not the USPPI.',
    },
    {
      q: 'Can a foreign company be the USPPI?',
      a: 'Yes, if the foreign entity is in the United States when it buys or obtains the goods for export. It cannot file the EEI itself and must authorize a U.S. agent; without an EIN, the agent reports another identifier allowed by 15 CFR 30.6.',
    },
  ],
  sources: ['c6-ftr-30-1-parties', 'w5-ftr-30-3', 'c6-ftr-30-6-usppi'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
