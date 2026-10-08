import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "export compliance" 320, KD 23 (v2 appendix);
 * "export compliance program" 90.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C.
 */
const article: ContentArticle = {
  slug: 'export-compliance-checklist',
  title: 'Export compliance checklist for small US exporters',
  metaTitle: 'Export compliance checklist for small exporters',
  description:
    'A per-shipment export compliance checklist for US exporters: classification, licence checks, party screening, invoice statements, EEI filing and record keeping, with the rule behind each.',
  lede: 'Export compliance sounds like a department, but for a small exporter it is a handful of checks done in the same order on every shipment: what the item is, where it is going, who is receiving it, what the invoice must say, what has to be filed and what you keep. This checklist follows that order and names the US rule behind each step.',
  answer:
    'Export compliance means checking every shipment against the export rules before it leaves: classify the item (an ECCN or EAR99), check the destination, end user and end use for licence requirements, screen the parties, put any required statements on the commercial invoice, file EEI when required, and keep the records for five years.',
  keyFacts: [
    'BIS describes an export compliance program as a series of procedures and tools that help an organisation comply with export controls.',
    'BIS lists eight elements of an effective export compliance program, from management commitment to building and maintaining the program.',
    'Under 15 CFR 734.13, an export includes an actual shipment out of the US and the release of technology to a foreign person in the US.',
    'Under 15 CFR 758.6, a destination control statement must appear on the commercial invoice for items on the Commerce Control List other than EAR99 items.',
    'The Foreign Trade Regulations and 15 CFR 762.6 both require export records to be kept for five years.',
  ],
  definitions: [
    {
      term: 'EAR',
      meaning:
        'The Export Administration Regulations, the US rules on exports of commercial and dual-use items, administered by BIS.',
    },
    {
      term: 'ECCN',
      meaning:
        'The Export Control Classification Number, a five-character code that places an item on the Commerce Control List.',
    },
    {
      term: 'EAR99',
      meaning:
        'The designation for items subject to the EAR but not listed on the Commerce Control List.',
    },
    {
      term: 'Destination control statement',
      meaning:
        'A statement on the commercial invoice that the items are controlled under the EAR, required for most listed items.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does export compliance cover?',
      paragraphs: [
        'It covers three sets of US rules that apply to the same shipment. Export controls under the EAR decide whether the item may go to that destination, party and use without a licence. Export reporting under the Foreign Trade Regulations decides whether you file Electronic Export Information. Screening checks that no party to the deal is on a US restricted list.',
        'An export is wider than a shipment. Under 15 CFR 734.13, it includes any actual shipment or transmission of an item out of the United States, and the release of technology or source code to a foreign person inside the United States counts as a deemed export to that person’s most recent country of citizenship or permanent residency.',
        'This checklist covers US exports. Other countries run their own export control and reporting systems, so check the rules of the country you ship from.',
      ],
    },
    {
      heading: 'What is an export compliance program?',
      paragraphs: [
        'It is your written way of doing the checks the same way every time. The Bureau of Industry and Security describes an export compliance program as a series of procedures and tools that facilitate compliance with export controls, developed by organisations whose activities are subject to the EAR. BIS sets out eight elements:',
      ],
      list: [
        'Management commitment',
        'Risk assessment',
        'Export authorization',
        'Recordkeeping',
        'Training',
        'Audits',
        'Export violations and corrective actions',
        'Building and maintaining the program',
      ],
    },
    {
      heading: 'How do you check whether a shipment needs a licence?',
      paragraphs: [
        'Work from the item outwards. BIS frames the licence question around what the item is, where it is going, who will receive it and what they will use it for.',
      ],
      steps: [
        'Classify the item: find its ECCN on the Commerce Control List, or confirm it is EAR99. TradeDocs does not classify items; BIS publishes the classification guidance.',
        'For a listed item, read the reasons for control in its ECCN entry and check them against the destination on the Commerce Country Chart.',
        'Check end-use and end-user controls; BIS notes that even EAR99 items need a licence for restricted end users, end uses or destinations.',
        'Check whether a licence exception applies before applying.',
        'If a licence is required, apply through BIS’s SNAP-R system and do not ship until it is granted.',
      ],
    },
    {
      heading: 'Who must you screen before you ship?',
      paragraphs: [
        'Screen every party to the transaction: the buyer, the ultimate consignee, any intermediate consignee and the forwarder abroad. The International Trade Administration’s Consolidated Screening List combines the export restriction lists of the Departments of Commerce, State and the Treasury in one search.',
        'Screen at the order and again before shipment, because the lists change. Record the date, the names searched and the result, and keep it with the shipment file. A possible match is a reason to stop and look closer, not to ship and hope.',
      ],
    },
    {
      heading: 'What must the commercial invoice say for export compliance?',
      paragraphs: [
        'It must describe the goods accurately and carry any statement the EAR requires. Under 15 CFR 758.6, when you export items on the Commerce Control List, other than items designated EAR99, the commercial invoice must carry the destination control statement, and for certain items the ECCN must also be shown.',
        'The value, quantity and description must be true. The ITA notes that you are responsible for the accuracy of documents a freight forwarder prepares for you, so check the forwarder’s drafts against your invoice. The post Commercial invoice requirements lists the other fields buyers’ customs authorities expect.',
      ],
    },
    {
      heading: 'When do you file EEI, and who files it?',
      paragraphs: [
        'File EEI in AES when a Schedule B or HTS line in the shipment is worth over $2,500, or when a licence or another mandatory filing requirement applies regardless of value. Under 15 CFR 30.37, the $2,500 exemption applies line by line, whatever the shipment’s total value.',
        'Under 15 CFR 30.3, the US Principal Party in Interest, or its authorised agent, files the EEI, and the filer must be in the United States. The Census Bureau describes ACE AESDirect as the primary, free tool for filing. Many forwarders file as agent; whoever files, agree it in writing and keep the Internal Transaction Number with the shipment documents.',
      ],
    },
    {
      heading: 'What does the per-shipment checklist look like?',
      paragraphs: ['Use it on every order, and keep the completed copy in the shipment file.'],
      table: {
        caption: 'Per-shipment export compliance checklist for US exporters',
        head: ['Check', 'When', 'Where the rule lives'],
        rows: [
          ['Item classified (ECCN or EAR99)', 'Before quoting', 'EAR, Commerce Control List'],
          [
            'Licence need checked for destination, end user and use',
            'Before quoting',
            'EAR, Commerce Country Chart, BIS guidance',
          ],
          [
            'All parties screened',
            'At order and before shipment',
            'ITA Consolidated Screening List',
          ],
          [
            'Destination control statement on the invoice, if required',
            'When invoicing',
            '15 CFR 758.6',
          ],
          ['Schedule B or HTS number reported for each line', 'When filing EEI', '15 CFR 30.6'],
          ['EEI filed, or exemption noted', 'Before export', '15 CFR 30.37 and 30.3'],
          ['Documents kept five years', 'After export', '15 CFR 30.10 and 762.6'],
        ],
      },
    },
  ],
  faq: [
    {
      q: 'Is an export compliance program required by law?',
      a: 'The BIS guidance presents an export compliance program as procedures and tools that help you comply; the EAR and the Foreign Trade Regulations are what you must follow. A written program is the practical way to show how you follow them on every shipment.',
    },
    {
      q: 'If my product is EAR99, can I ship it anywhere?',
      a: 'No. BIS states that EAR99 items need a licence only for restricted end users, end uses or destinations, which still means checking all three. BIS notes that its Country Chart does not cover Cuba, Iran, North Korea and Syria, which have their own parts of the EAR.',
    },
    {
      q: 'Does a freight forwarder handle export compliance for me?',
      a: 'A forwarder can file EEI as your agent and prepare documents, but the ITA notes that the exporter remains responsible for the accuracy of documents prepared on its behalf. Licence and screening decisions stay with you.',
    },
    {
      q: 'How long must export records be kept?',
      a: 'Five years. The Foreign Trade Regulations require export shipment documents to be kept for five years from the date of export, and 15 CFR 762.6 requires EAR records to be kept for five years from the latest of the export, any known reexport or transfer, or the end of the transaction.',
    },
  ],
  sources: [
    'c1-bis-export-compliance-programs',
    'b7-ear-734-13',
    'a5-bis-license-needed',
    'a5-bis-country-guidance',
    'w5-bis-classify',
    'w5-ita-csl',
    'a5-ear-758-6',
    'w4-trade-gov-export-transaction',
    'trade-gov-export-documents',
    'w5-ftr-30-37',
    'w5-ftr-30-3',
    'w5-ftr-30-6',
    'w5-census-aes',
    'w5-ftr-30-10',
    'c1-ear-762-6',
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
    title: 'Put the codes and statements on the invoice once',
    text: 'The commercial invoice generator keeps the HS code, origin and description on every line, so the invoice your forwarder files from matches your goods.',
  },
  related: [
    '/guides/eccn-ear99-export-licence',
    '/guides/eei-aes-filing-itn',
    '/guides/how-to-export-from-the-us',
    '/blog/schedule-b-number',
    '/blog/commercial-invoice-requirements',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: 'Y2NR5WmOPDA',
    src: 'https://images.unsplash.com/photo-1762341112870-1eb70d45b23e',
    width: 6000,
    height: 4000,
    alt: 'A person ticking off a checklist on a clipboard at a desk with a laptop before a shipment is released',
    caption: 'Working through a checklist at a desk',
    photographer: { name: 'Zulfugar Karimov', profile: 'https://unsplash.com/@zulfugarkarimov' },
    page: 'https://unsplash.com/photos/person-writing-on-clipboard-at-desk-with-laptop-Y2NR5WmOPDA',
  },
};

export default article;
