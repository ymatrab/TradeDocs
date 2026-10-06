import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "how long does customs clearance take" 1,300;
 * "customs clearance" 3,600, KD 28; "what is customs clearance" 1,000, KD 23.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'how-long-does-customs-clearance-take',
  title: 'How long does customs clearance take, and what makes it slow?',
  metaTitle: 'How long does customs clearance take?',
  description:
    'There is no fixed clearance time. What decides it is the paperwork, the entry filing, exams and duty payment. The document faults that cause holds, and how to avoid them.',
  lede: 'Ask a forwarder how long customs takes and the honest answer is “it depends”. It depends mostly on things you control before the goods leave: the invoice, the description, the value and who has agreed to clear them.',
  answer:
    'Customs clearance has no fixed duration. It takes as long as the importer or its broker needs to file a complete entry and for customs to accept it, examine the goods if it chooses, and collect any duties. Clean, consistent documents filed early keep it short; missing or inconsistent paperwork is the most common cause of holds.',
  keyFacts: [
    'In the US, 19 CFR 142.2 requires entry within 15 calendar days after the goods arrive, and allows entry documents to be filed before arrival.',
    'Under 19 CFR 127.1, goods not entered in time, with duties unpaid or without proper documents go to a general order warehouse at the consignee’s risk and expense.',
    'CBP states that it may examine any imported shipment and that the importer bears the costs of preparing the goods for examination.',
    'Under 19 CFR 141.86, a commercial invoice for a US import must state specific details, including a description, quantities, prices and the country of origin.',
    'CBP says the importer of record remains responsible for the entry and all duties, taxes and fees even when it uses a licensed customs broker.',
  ],
  definitions: [
    {
      term: 'Customs clearance',
      meaning:
        'The process of declaring imported goods to customs, meeting its requirements and obtaining their release.',
    },
    {
      term: 'Entry',
      meaning:
        'The declaration and documents filed with customs to obtain release of imported goods.',
    },
    {
      term: 'Importer of record',
      meaning:
        'The party responsible to customs for the entry, its accuracy and the duties, taxes and fees owed.',
    },
    {
      term: 'General order',
      meaning:
        'In the US, CBP custody of goods that were not entered in time or could not be entered, held in a warehouse at the consignee’s expense.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'How long does customs clearance take?',
      paragraphs: [
        'There is no standard figure, and no customs authority publishes one that applies to every shipment. Clearance time is the sum of several steps, and each can be quick or slow: filing the entry, customs reviewing it, any examination, and payment of what is owed.',
        'The legal clock in the US is about filing, not release. Under 19 CFR 142.2, goods that need an entry must be entered within 15 calendar days after they land, and the entry documents may be submitted before the goods arrive. Filing early is allowed, and it is the single easiest way to shorten the wait.',
        'Other countries set their own deadlines and procedures, so treat any timing you are quoted as an estimate for that country, that port and that type of goods.',
      ],
    },
    {
      heading: 'What happens during customs clearance?',
      paragraphs: [
        'The sequence differs by country and transport mode, but a US import by sea usually runs in this order. Each step needs something from a document you or the buyer prepared.',
      ],
      steps: [
        'For vessel cargo, the importer or its agent files the Importer Security Filing, advance cargo data that CBP requires for ocean shipments only.',
        'The importer of record, or a licensed customs broker acting for it, files the entry, ideally before the goods arrive.',
        'CBP reviews the entry data against the commercial invoice, the transport document and its own targeting.',
        'CBP releases the goods, or selects them for examination or asks for more information.',
        'The importer settles the duties, taxes and fees, and keeps the records.',
      ],
    },
    {
      heading: 'What causes customs holds and delays?',
      paragraphs: [
        'Most holds come back to a document that is missing, incomplete or inconsistent with the others. US rules spell out several of them directly.',
      ],
      table: {
        caption: 'Common causes of US import delays and how exporters can prevent them',
        head: ['Cause', 'What the rule or CBP says', 'How to prevent it'],
        rows: [
          [
            'Incomplete commercial invoice',
            '19 CFR 141.86 lists what the invoice must state',
            'Check every required field before shipping',
          ],
          [
            'Vague description of the goods',
            'CBP asks for a full and complete description to classify and value goods',
            'Describe material, use and model, not “parts” or “samples”',
          ],
          [
            'Goods not correctly invoiced',
            '19 CFR 127.1 allows general order when the port director believes goods are not correctly or legally invoiced',
            'Match invoice, packing list and transport document line by line',
          ],
          [
            'Entry filed late',
            '19 CFR 127.1 sends unentered goods to general order at the consignee’s expense',
            'Agree before shipping who clears and send documents ahead',
          ],
          [
            'Duties not paid',
            '19 CFR 127.1 covers entries incomplete for failure to pay estimated duties',
            'Agree under the Incoterms® rule who pays duties',
          ],
          [
            'Missing Importer Security Filing',
            'CBP warns that failures can lead to penalties, more inspections and delay',
            'Give the buyer’s agent shipment details in time for vessel cargo',
          ],
        ],
      },
    },
    {
      heading: 'What does a customs exam add to the timeline?',
      paragraphs: [
        'Time and cost. CBP states that under 19 U.S.C. 1467 it has the right to examine any shipment imported into the United States, and that the importer bears the expense of preparing the goods for examination and closing the packages, under 19 CFR 151.6.',
        'For containers, CBP explains that a selected shipment is usually moved to a Centralized Examination Station, a privately operated facility that unloads the container for the officers and reloads it afterwards, and bills the importer for that work, along with moving and storage costs. CBP does not charge for the exam itself.',
        'You cannot prevent a random or targeted selection, but you can make the exam short. A packing list that says exactly which carton holds which goods lets an officer check one carton instead of unloading the whole container.',
      ],
    },
    {
      heading: 'Does a low-value shipment clear differently?',
      paragraphs: [
        'It can use a simpler entry type. Under 19 CFR 143.21, shipments not exceeding $2,500 in value are among those eligible for informal entry in the US, with exceptions for certain articles classified in Chapter 99 of the tariff schedule. If the goods travel by courier, ask the courier who files the entry and in whose name.',
        'Simpler is not the same as automatic. The goods still need an accurate description and value, and duties and fees still apply where the tariff says they do. Low-value rules change, so check the current position on CBP’s site before you rely on them.',
      ],
    },
    {
      heading: 'How can an exporter help the goods clear faster?',
      paragraphs: [
        'You are not the party clearing the goods under most trade terms, but almost everything the importer files comes from your documents. The checks below cost minutes and save days.',
      ],
      list: [
        'Write the commercial invoice to the importing country’s rules; for the US, 19 CFR 141.86 sets the contents.',
        'Use the same description, quantities and weights on the invoice, packing list and transport document.',
        'State the Incoterms® rule and named place, so everyone knows who clears and who pays duties.',
        'Send copies of the documents to the buyer or its broker before the goods arrive, so the entry can be filed early.',
        'Label cartons to match the packing list, so an exam can find the right carton fast.',
      ],
    },
  ],
  faq: [
    {
      q: 'Why is my shipment stuck in customs?',
      a: 'The usual reasons are a missing or inconsistent document, an unpaid duty, a request for more information, or selection for examination. The importer’s customs broker or the carrier can see the status and say which applies.',
    },
    {
      q: 'Who is responsible for clearing goods through customs?',
      a: 'The importer of record. CBP says that remains true even when a licensed customs broker files the entry. The Incoterms® rule in the contract decides whether the buyer or the seller arranges and pays for import clearance.',
    },
    {
      q: 'Can customs clearance start before the goods arrive?',
      a: 'In the US, yes. 19 CFR 142.2 allows the entry documentation to be submitted before the merchandise arrives at the port where entry will be made.',
    },
    {
      q: 'What happens if nobody clears the goods?',
      a: 'In the US, under 19 CFR 127.1, goods not entered within the time allowed are taken into CBP custody and stored in a general order warehouse at the consignee’s risk and expense.',
    },
    {
      q: 'Does using a customs broker make clearance faster?',
      a: 'A broker knows the filing systems and can file early, which helps. It cannot fix a wrong invoice or a missing document on its own, and the importer stays responsible for the entry.',
    },
  ],
  sources: [
    'w3-cbp-19-cfr-142-2',
    'w3-cbp-19-cfr-127-1',
    'w3-cbp-19-cfr-143-21',
    'w3-cbp-importer-tips',
    'us-cbp-invoice-contents',
    'trade-gov-commercial-invoice',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Prepare an invoice customs can work from',
    text: 'Fill in parties, line descriptions, origin, quantities and the Incoterms® rule, and download a commercial invoice that matches your packing list.',
  },
  related: [
    '/blog/commercial-invoice-requirements',
    '/blog/brokerage-fees-and-duties-on-courier-shipments',
    '/blog/export-documents-checklist',
    '/guides/dap-vs-ddp',
  ],
  cover: {
    id: 'SoJc04BHUdU',
    src: 'https://images.unsplash.com/photo-1713859272766-76751031af78',
    width: 4608,
    height: 3456,
    alt: 'Container handler moving shipping containers at the Port of Manila terminal before release',
    caption: 'Container terminal, Port of Manila',
    photographer: { name: 'PortCalls Asia', profile: 'https://unsplash.com/@portcalls' },
    page: 'https://unsplash.com/photos/a-forklift-is-moving-a-large-stack-of-shipping-containers-SoJc04BHUdU',
  },
};

export default article;
