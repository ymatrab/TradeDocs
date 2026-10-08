import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'routed-export-transaction',
  term: 'Routed export transaction',
  aliases: ['routed export', 'routed transaction', 'FPPI-routed export'],
  demand: {
    keyword: 'routed export transaction',
    market: 'US',
    volume: 260,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Routed export transaction: who files the EEI',
  description:
    'What a routed export transaction is under the Foreign Trade Regulations, who files the EEI, what the U.S. seller still owes the buyer’s agent, and why the Incoterms® rule does not decide it.',
  shortDefinition:
    'A routed export transaction is a U.S. export in which the foreign buyer, the FPPI, authorizes a U.S. agent to arrange the export and to prepare and file the Electronic Export Information (EEI), instead of the U.S. seller doing so.',
  definition: [
    'The Census Bureau’s Foreign Trade Regulations recognise two kinds of export transaction. In a standard one, the U.S. principal party in interest (USPPI), normally the seller, files the EEI in AES or authorizes its own forwarder to file it. In a routed one, defined in 15 CFR 30.1, the foreign principal party in interest (FPPI) takes control of the export and appoints a U.S. agent, usually its own forwarder, to move the goods and file.',
    'Section 30.3 sets out who does what. The FPPI’s agent needs a power of attorney or written authorization from the FPPI. The USPPI must give that agent complete, accurate and timely export information for the data elements it holds, and keep records that support it; the agent files on the basis of what the USPPI supplied. The FPPI can instead authorize the USPPI in writing to file, and the transaction is still routed.',
    'The regulations add a point that often surprises sellers: trade terms do not determine the type of transaction or the parties to it. An EXW or FCA sale is not automatically routed; what matters is who the FPPI authorized.',
  ],
  onYourDocuments: [
    'In a routed export you do not file the EEI, but your documents carry its data. The commercial invoice and packing list give the buyer’s agent the description, quantities, value and weights; the agent also needs your EIN, the Schedule B or HTS number, and the licence information, which an invoice may not show, so send them in writing.',
    'Keep a copy of what you supplied. On request the agent must give you the FPPI’s authorization, the data elements you supplied as filed, its contact details, the export date and the Internal Transaction Number (ITN).',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Mesa Pump Works (invented) of Arizona sells irrigation pumps FCA Phoenix to a distributor in Peru. The distributor appoints its Miami forwarder, in writing, to collect the goods and handle the export. That makes the sale a routed export transaction.',
      'Mesa emails the forwarder its invoice, packing list, EIN, Schedule B numbers and the licence determination, and keeps that email. After the pumps leave, the forwarder sends Mesa the ITN and a copy of the distributor’s authorization for its file.',
    ],
  },
  confusedWith: [
    {
      term: 'Standard export transaction',
      difference:
        'In a standard export the USPPI files the EEI or authorizes its own agent. In a routed export the foreign buyer authorizes the agent, and the USPPI supplies the information.',
    },
  ],
  related: [
    'usppi',
    '/guides/eei-aes-filing-itn',
    '/blog/exw-vs-fca',
    '/guides/how-to-export-from-the-us',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator gives the buyer’s forwarder the descriptions, quantities, values and weights it needs to file the EEI in a routed export.',
  faq: [
    {
      q: 'Is every EXW or FCA sale a routed export transaction?',
      a: 'No. The Foreign Trade Regulations say trade terms do not determine the type of transaction. It is routed only when the foreign buyer authorizes a U.S. agent to facilitate the export and file the EEI.',
    },
    {
      q: 'What does the U.S. seller have to do in a routed export?',
      a: 'Give the buyer’s agent complete, accurate and timely export information for the EEI data elements it holds, and keep documentation supporting what it supplied.',
    },
  ],
  sources: ['w5-ftr-30-1', 'w1-ecfr-15-cfr-30-3', 'w5-ftr-30-3'],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
