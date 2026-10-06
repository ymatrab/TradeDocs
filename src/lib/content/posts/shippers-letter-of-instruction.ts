import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "sli shipping" 320; "shipper's letter of
 * instruction" 210 ("shippers letter of instruction" 33,100 is a volume anomaly, not quoted).
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'shippers-letter-of-instruction',
  title: 'Shipper’s letter of instruction: what your forwarder needs from you',
  metaTitle: 'Shipper’s letter of instruction (SLI) explained',
  description:
    'What a shipper’s letter of instruction is, which fields come straight from your commercial invoice and packing list, and how it ties to US export filing.',
  lede: 'A forwarder can only book, document and file what you tell it. The shipper’s letter of instruction is where you tell it, in one place, before the goods leave. Most of it is already on your invoice and packing list.',
  answer:
    'A shipper’s letter of instruction (SLI) is the set of written instructions an exporter gives its freight forwarder: who the parties are, what the goods are, how they are packed, the trade terms, and who files the export data. It is a forwarder’s form, not a government one, and most fields repeat the commercial invoice and packing list.',
  keyFacts: [
    'No US regulation prescribes an SLI form; it is a document forwarders use to collect shipment instructions.',
    'Under 15 CFR 30.3, an agent filing Electronic Export Information (EEI) needs a power of attorney or written authorization from a principal party.',
    'The Foreign Trade Regulations state that Incoterms® rules and other terms of sale do not decide who the parties to an export transaction are.',
    'Under 15 CFR 30.4, EEI for vessel cargo is due 24 hours before loading and for air cargo 2 hours before departure.',
    'Under 15 CFR 30.6, the EEI value is the value at the US port of export, including inland freight and insurance to that port.',
  ],
  definitions: [
    {
      term: 'USPPI',
      meaning:
        'The US principal party in interest: the person in the United States that receives the primary benefit of the export, usually the seller.',
    },
    {
      term: 'EEI',
      meaning:
        'Electronic Export Information, the export data filed in the Automated Export System (AES) under 15 CFR Part 30.',
    },
    {
      term: 'Routed export transaction',
      meaning:
        'An export in which the foreign buyer authorizes a US agent to arrange the shipment and file the EEI.',
    },
    {
      term: 'Authorized agent',
      meaning:
        'A forwarder or other agent given written authority by a principal party to prepare and file the EEI.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a shipper’s letter of instruction?',
      paragraphs: [
        'It is a written brief from the exporter to the forwarder. It says who is shipping to whom, what is in the boxes, how much it weighs, what it is worth, which trade term applies and what the forwarder is allowed to do on your behalf. The forwarder uses it to book space, issue or request the bill of lading or air waybill, and prepare the export filing.',
        'There is no official SLI form. The US Foreign Trade Regulations in 15 CFR Part 30 set out what export data must be filed and who may file it, but they do not name a letter of instruction. Each forwarder has its own template, so the layout changes from one forwarder to the next while the information stays the same.',
        'Treat it as a shipping document with legal weight. If the forwarder files your EEI from it, the values, weights and descriptions on the SLI become the data the US government receives.',
      ],
    },
    {
      heading: 'Why does the forwarder ask for an SLI?',
      paragraphs: [
        'Two reasons: instructions and authority. The instructions are practical. A forwarder cannot guess the consignee’s address, the number of cartons or whether you want cargo insurance, and getting any of them wrong costs a re-issued document or a missed sailing.',
        'The authority is regulatory. Under 15 CFR 30.3, the EEI is filed either by the USPPI or by an authorized agent, and an agent filing on someone’s behalf must hold a power of attorney or written authorization from a principal party in interest. Forwarders collect that authorization either as a separate power of attorney or as signed wording on their SLI form; ask which yours uses, and read what you sign.',
        'The same section adds a warning worth knowing: invoices and other commercial documents may not contain everything needed to file the EEI. The SLI is where the missing pieces, such as the Schedule B number or the licence status, get supplied.',
      ],
    },
    {
      heading: 'What goes on a shipper’s letter of instruction?',
      paragraphs: [
        'Forwarders’ templates vary, but the fields map closely to the EEI data elements in 15 CFR 30.6 and to what you already put on your commercial documents. The table shows where each one usually comes from.',
      ],
      table: {
        caption: 'Typical SLI fields and the document each one comes from',
        head: ['SLI field', 'Where the answer usually comes from'],
        rows: [
          ['Exporter (USPPI) name, address and EIN', 'Your own company records'],
          [
            'Ultimate consignee and intermediate consignee',
            'Commercial invoice and sales contract',
          ],
          ['Description of the goods, in English', 'Commercial invoice, line by line'],
          [
            'Schedule B or HTS number per line',
            'Your own classification, checked in the official Schedule B search',
          ],
          ['Quantity and unit of measure', 'Commercial invoice'],
          [
            'Value per line',
            'Invoice price plus inland freight and insurance to the US port of export',
          ],
          ['Shipping weight in kilograms', 'Packing list (goods plus normal packaging)'],
          ['Number of packages, dimensions and marks', 'Packing list and shipping marks'],
          ['Incoterms® rule and named place', 'Sales contract, repeated on the invoice'],
          ['Licence, licence exception, or EAR99 status', 'Your export control review'],
          ['Hazardous material indicator', 'Your product safety data'],
          ['Routed or standard transaction; who files', 'Your agreement with the buyer'],
        ],
      },
    },
    {
      heading: 'Who files the export data, you or the forwarder?',
      paragraphs: [
        'Either can, and the SLI usually records the choice. In a standard export the USPPI files the EEI itself or authorizes an agent to file it. In a routed export transaction the foreign buyer authorizes the agent, and under 15 CFR 30.3 the USPPI must still give that agent complete, accurate and timely export information and keep records supporting what it provided.',
        'The trade term does not settle this. The Foreign Trade Regulations say Incoterms® rules and other terms of sale do not determine the type of export transaction or its parties. A sale on EXW terms can still leave you, as the US seller, with reporting duties, so agree in writing who files and what you will supply.',
        'Filing is not always required. The ITA’s guide to common export documents explains that EEI is generally filed when a Schedule B line is valued over $2,500 or when another rule, such as a licence requirement, applies. Your forwarder will tell you which applies; the SLI is where you give it the facts to decide.',
      ],
    },
    {
      heading: 'When does the forwarder need the SLI?',
      paragraphs: [
        'Before the filing deadline, with time to spare. Under 15 CFR 30.4, predeparture EEI for vessel cargo must be filed and the proof of filing given to the carrier 24 hours before the cargo is loaded at the US port, and for air cargo no later than 2 hours before the scheduled departure. Truck and rail cargo have their own deadlines in the same section.',
        'The forwarder needs your SLI earlier than that, because it also needs to book space, cut the documents and deal with any data the filing system rejects. Ask your forwarder for its own cut-off and send the SLI with the final commercial invoice and packing list, not after them.',
      ],
    },
    {
      heading: 'How do you fill in an SLI without retyping everything?',
      paragraphs: [
        'Prepare the commercial documents first, then copy from them. Retyping is where descriptions drift and weights stop adding up.',
      ],
      steps: [
        'Finish the commercial invoice: parties, line descriptions, quantities, unit prices, currency and the Incoterms® rule with its named place.',
        'Finish the packing list: packages, marks, net and gross weights and dimensions per package, with totals that match the invoice lines.',
        'Look up each line’s Schedule B or HTS number in the official tools yourself and record your export control status; the forwarder cannot decide either for you.',
        'Work out the value at the US port of export: the selling price plus inland freight and insurance to that port.',
        'Fill in the forwarder’s SLI from those documents, field by field, and state who files the EEI.',
        'Send the SLI, invoice and packing list together, and keep copies with your export records.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a shipper’s letter of instruction a legal requirement?',
      a: 'The form itself is not; it is a forwarder’s document. What is required in the US, under 15 CFR Part 30, is accurate export data and written authority for any agent who files it, and the SLI is a common way of supplying both.',
    },
    {
      q: 'Does the SLI replace the commercial invoice?',
      a: 'No. Customs in the importing country works from the commercial invoice. The SLI is an instruction to your forwarder and usually travels no further than the forwarder’s file.',
    },
    {
      q: 'Who signs the shipper’s letter of instruction?',
      a: 'Someone at the exporting company with authority to instruct the forwarder and, where the form includes it, to authorize EEI filing. Read the authorization wording before you sign.',
    },
    {
      q: 'Can the forwarder fill in the SLI for me?',
      a: 'It can type it, but the facts must come from you. Under 15 CFR 30.3 the filer may rely on information furnished by other parties, which puts the accuracy of what you supply on you.',
    },
    {
      q: 'Do I need an SLI for a courier shipment?',
      a: 'Couriers usually collect the same instructions through their own shipping system and commercial invoice rather than a separate SLI. The underlying export filing rules are the same.',
    },
  ],
  sources: [
    'w3-census-ftr-30-3',
    'w3-census-ftr-30-4',
    'w3-census-ftr-30-6',
    'trade-gov-export-documents',
    'trade-gov-commercial-invoice',
    'trade-gov-packing-list',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/invoice-generator', '/tools/incoterms'],
  callout: {
    afterSection: 2,
    tool: '/tools/packing-list-generator',
    title: 'Build the packing list your SLI copies from',
    text: 'Enter packages, weights and dimensions once and get totals that match the invoice, ready to copy into the forwarder’s form.',
  },
  related: [
    '/blog/export-documents-checklist',
    '/blog/packing-list-for-shipping',
    '/blog/commercial-invoice-requirements',
    '/blog/fca-vs-fob',
  ],
  cover: {
    id: '-aCrA9FmT8Y',
    src: 'https://images.unsplash.com/photo-1684695749267-233af13276d0',
    width: 7952,
    height: 5304,
    alt: 'Large warehouse filled with boxed goods waiting to be booked and shipped by a forwarder',
    caption: 'A large warehouse filled with boxes',
    photographer: { name: 'Alberto Rodríguez', profile: 'https://unsplash.com/@albertorodriguez' },
    page: 'https://unsplash.com/photos/a-large-warehouse-filled-with-lots-of-boxes--aCrA9FmT8Y',
  },
};

export default article;
