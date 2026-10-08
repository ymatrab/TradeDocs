import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "third party inspection" 390; "inspection
 * certificate" 260; "pre shipment inspection" 70.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C.
 */
const article: ContentArticle = {
  slug: 'pre-shipment-inspection',
  title: 'Pre-shipment inspection: how third-party inspection works',
  metaTitle: 'Pre-shipment inspection: third-party checks',
  description:
    'Who orders a pre-shipment or third-party inspection, what the inspector checks against your invoice and packing list, what the WTO agreement requires, and how to prepare.',
  lede: 'A pre-shipment inspection puts an independent inspector between your warehouse and the carrier. The buyer, the buyer’s bank or the importing government wants someone other than you to confirm the goods, the quantity and sometimes the price before the shipment leaves. This post explains who asks for one, what gets checked and how to be ready.',
  answer:
    'A pre-shipment inspection is a check by an independent inspection company, before export, that the goods match the order in quantity, quality and marking, and for some governments in price. The buyer, a letter of credit or the importing country can require it, and the inspector issues a report or certificate.',
  keyFacts: [
    'The WTO describes preshipment inspection as the use of private companies to check the price, quantity and quality of goods ordered overseas.',
    'The WTO Agreement on Preshipment Inspection requires inspections to take place in the customs territory from which the goods are exported, with limited exceptions.',
    'Under the agreement, quantity and quality inspections follow the standards the seller and buyer set in the purchase agreement.',
    'Under the agreement, a Clean Report of Findings or written reasons for refusing one is due within five working days of the final documents and inspection.',
    'The International Trade Administration notes that some products require pre-shipment inspections before leaving the country of export.',
  ],
  definitions: [
    {
      term: 'Third-party inspection',
      meaning:
        'An inspection by a company independent of both buyer and seller, usually booked by the buyer.',
    },
    {
      term: 'Inspection certificate',
      meaning:
        'The inspector’s signed statement of what was checked and found, often required as a payment document.',
    },
    {
      term: 'Clean Report of Findings',
      meaning:
        'The WTO agreement’s term for the report a government-appointed inspector issues when the shipment passes.',
    },
    {
      term: 'User Member',
      meaning:
        'A WTO member whose government contracts for or mandates the use of preshipment inspection.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a pre-shipment inspection?',
      paragraphs: [
        'It is an independent check of the goods before they are shipped, compared with what was ordered. The inspector visits the factory or warehouse, counts and opens a sample of the cartons, checks the goods against the order and the packing against the shipping documents, and reports.',
        'There are two kinds with the same name. A commercial inspection is booked by the buyer, or required by the buyer’s letter of credit, to confirm quality and quantity. A government inspection is mandated by the importing country: the WTO describes it as the use of private companies to check the price, quantity and quality of goods ordered overseas, to safeguard national financial interests such as preventing capital flight, commercial fraud and customs duty evasion.',
        '“Third-party inspection” covers both, because in each case the inspector works for neither the seller nor, formally, the buyer.',
      ],
    },
    {
      heading: 'Who asks for an inspection, and why?',
      paragraphs: [
        'Whoever carries the risk of receiving the wrong goods. A buyer paying in advance, or one importing from a supplier they have never visited, books an inspection to see the goods before they pay the balance or before the goods leave.',
        'A bank can ask indirectly. When a letter of credit lists an inspection certificate among the required documents, the seller cannot be paid without one, because under the ICC’s UCP 600 banks examine documents, not goods. The International Trade Administration also notes that a buyer may need a proforma invoice to contract for a pre-shipment inspection.',
        'Governments ask through regulation. The ITA’s guide to common export documents says some products require pre-shipment inspections before departing the country of export, and that certain products need certificates showing cleanliness, compliance with standards, safety or health.',
      ],
    },
    {
      heading: 'What does the inspector check?',
      paragraphs: [
        'The inspector checks the shipment against documents you already have. Under the WTO agreement, quantity and quality inspections follow the standards the seller and buyer defined in the purchase agreement, and relevant international standards where the contract sets none.',
      ],
      table: {
        caption: 'Typical pre-shipment checks and the document each is compared with',
        head: ['Check', 'Compared with', 'What a mismatch looks like'],
        rows: [
          [
            'Quantity and carton count',
            'Packing list and commercial invoice',
            'Fewer cartons, or units per carton not as listed',
          ],
          [
            'Quality and specification',
            'The purchase agreement or order',
            'Wrong material, colour, size or defect rate',
          ],
          [
            'Marks and labels',
            'Shipping marks on the packing list',
            'Missing marks, wrong consignee or port',
          ],
          [
            'Weights and dimensions',
            'Packing list gross and net weights',
            'Cartons heavier or larger than declared',
          ],
          [
            'Price (government inspection)',
            'The contract price and export prices',
            'A price the inspector considers over- or under-invoiced',
          ],
        ],
      },
    },
    {
      heading: 'What does the WTO Agreement on Preshipment Inspection require?',
      paragraphs: [
        'It sets the rules a government-appointed inspector must follow, so exporters know what to expect. Inspections, including the issue of a Clean Report of Findings, take place in the customs territory from which the goods are exported, or where they are made if the products are complex or both parties agree.',
        'The inspector must issue the Clean Report of Findings, or a detailed written explanation of why not, within five working days of receiving the final documents and completing the inspection. Price verification exists to prevent over- and under-invoicing and fraud; the inspector may reject a contract price only if its finding rests on a verification process that meets the agreement’s criteria, and some benchmarks, such as the cost of production, cannot be used.',
        'Exporters get a way to object. The agreement requires appeals procedures, and two working days after a grievance either party may refer the dispute to independent review, administered with the International Federation of Inspection Agencies and the ICC, with a decision due within eight working days.',
      ],
    },
    {
      heading: 'What is an inspection certificate?',
      paragraphs: [
        'It is the inspector’s written result: what was checked, how, on which date and what was found. For a commercial inspection it is often a payment document under a letter of credit, so its wording must match what the credit asks for: the issuer it names, the checks it lists and the date. The ITA notes that the exporter’s bank checks documents for compliance with the credit’s terms and that discrepancies must be amended and resubmitted, which costs days you may not have before the credit expires. For a government inspection, the equivalent is the Clean Report of Findings.',
        'The certificate does not replace your own documents. Customs still clears the goods on the commercial invoice, the packing list and the transport document, and the inspector’s report will quote figures from them, so all three must agree before the inspector arrives.',
      ],
    },
    {
      heading: 'How do you prepare for a pre-shipment inspection?',
      paragraphs: [
        'Most failed inspections are paperwork and packing problems, not product ones. Prepare the shipment as if it were leaving that day.',
      ],
      steps: [
        'Confirm who books and pays for the inspection, which company it is and which standard it uses, and write it into the sales contract.',
        'Finish production and packing before the inspection date, so the inspector sees the shipment as it will leave.',
        'Mark every carton as the contract and the packing list say, with the same shipping marks and carton numbers.',
        'Have the commercial invoice, packing list and order or contract ready for the inspector, with the same descriptions and quantities.',
        'Give the inspector access, a space to open cartons and staff to move them.',
        'If a letter of credit requires the certificate, check its wording against the credit before the inspector signs it.',
        'Read the report before the goods ship, and fix and re-inspect anything that failed.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a pre-shipment inspection the same as a customs exam?',
      a: 'No. A pre-shipment inspection happens in the exporting country before the goods leave, by a private company. A customs exam is carried out by the importing country’s customs authority; in the US, CBP may examine any shipment, and the importer bears the related costs.',
    },
    {
      q: 'Who pays for a third-party inspection?',
      a: 'Whoever the sales contract says. A buyer who books its own inspector usually pays for it; a government programme sets its own rules. Agree it before the order is confirmed and write it on the proforma invoice or contract.',
    },
    {
      q: 'Where does the inspection take place?',
      a: 'Under the WTO agreement, a government-mandated inspection takes place in the customs territory of export, or of manufacture for complex goods or by agreement. Commercial inspections usually happen at the factory or warehouse where the goods are packed.',
    },
    {
      q: 'What happens if the goods fail inspection?',
      a: 'For a government inspection, the inspector must explain the refusal in writing, and the exporter can appeal and then ask for independent review. For a commercial inspection, the contract decides: usually the seller corrects the problem and the goods are inspected again.',
    },
  ],
  sources: [
    'c1-wto-preshipment-inspection',
    'c1-wto-psi-agreement',
    'c1-ita-common-export-documents',
    'trade-gov-proforma-invoice',
    'a4-icc-documentary-credits',
    'trade-gov-packing-list',
    'trade-gov-commercial-invoice',
    'w3-cbp-importer-tips',
    'a2-trade-gov-letter-of-credit',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/packing-list-generator',
    title: 'Give the inspector a packing list that matches the cartons',
    text: 'Generate the packing list from your invoice lines, with carton numbers, marks, net and gross weights, so the count on the day agrees with the paperwork.',
  },
  related: [
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/blog/packing-list-for-shipping',
    '/blog/shipping-marks',
    '/guides/export-payment-terms',
    '/blog/export-documents-checklist',
  ],
  cover: {
    id: '-Wt8AyCr9i4',
    src: 'https://images.unsplash.com/photo-1748347084012-075796185d56',
    width: 6295,
    height: 4197,
    alt: 'An inspector with a checklist examining equipment on a factory floor before the goods are packed for export',
    caption: 'An inspector working through a checklist in a factory',
    photographer: { name: 'TECNIC Bioprocess Solutions', profile: 'https://unsplash.com/@tecnic' },
    page: 'https://unsplash.com/photos/a-man-inspects-equipment-in-a-modern-factory--Wt8AyCr9i4',
  },
};

export default article;
