import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US): "what is customs clearance" (v2 appendix), KD 23;
 * "customs clearance process" 140.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B.
 * The definition is the WCO's (Revised Kyoto Convention); the US steps come from 19 U.S.C. 1484,
 * 19 CFR 141 and 142 and the Census FTR, the UK steps from GOV.UK. Timing and holds are left to
 * how-long-does-customs-clearance-take and customs-status-messages-explained.
 */
const article: ContentArticle = {
  slug: 'what-is-customs-clearance',
  title: 'What is customs clearance? The process, step by step',
  metaTitle: 'What is customs clearance? The process explained',
  description:
    'Customs clearance is completing the formalities that let goods be exported or imported. Who does it, the documents it runs on, and the steps on each side of a shipment.',
  lede: 'Every international shipment is cleared twice: out of the country it leaves and into the country it enters. The seller’s documents feed both, so knowing what customs does with them is the quickest way to stop a shipment waiting at the border.',
  answer:
    'Customs clearance is completing the customs formalities that let goods be exported, imported for use or placed under another customs procedure, as the World Customs Organization defines it. The declarant files a declaration with the invoice and other documents, customs checks it, duties are paid or secured, and the goods are released.',
  keyFacts: [
    'The WCO’s Revised Kyoto Convention defines clearance as the accomplishment of the customs formalities needed for goods to enter home use, be exported or be placed under another customs procedure.',
    'The same convention defines release as customs placing goods undergoing clearance at the disposal of the persons concerned, which can happen before clearance is finished.',
    'Under 19 U.S.C. 1484, US import entry is made by the importer of record: the owner or purchaser, or a licensed customs broker it designates.',
    'Under 19 CFR 142.3, US entry documents include CBP Form 3461 or its electronic equivalent, a commercial invoice and, where appropriate, a packing list.',
    'Under 15 CFR 30.3, the US principal party in interest or its authorized agent files the Electronic Export Information for an export that needs it.',
  ],
  definitions: [
    {
      term: 'Goods declaration',
      meaning:
        'The statement, in the form customs prescribes, that names the customs procedure for the goods and gives the details customs needs to apply it.',
    },
    {
      term: 'Declarant',
      meaning:
        'The person who makes the goods declaration, or in whose name it is made, such as the importer or the customs broker acting for it.',
    },
    {
      term: 'Release',
      meaning:
        'Customs letting goods that are being cleared go to the people concerned, so they can leave the port or the carrier’s facility.',
    },
    {
      term: 'Importer of record',
      meaning:
        'In the US, the party that makes entry and is responsible to CBP for the declaration and the duties.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does customs clearance mean?',
      paragraphs: [
        'It means doing everything customs law requires before goods can cross the border legally. The World Customs Organization’s Revised Kyoto Convention, the international standard for customs procedures, defines clearance as the accomplishment of the customs formalities necessary for goods to enter home use, to be exported or to be placed under another customs procedure, such as a warehouse or transit.',
        'Those formalities are the operations both sides carry out to comply with customs law: the trader declares the goods and supplies documents, and customs checks them, decides whether to examine the goods and collects what is owed. When customs is satisfied, it releases the goods.',
        'Release and clearance are not always the same moment. The convention defines release as customs placing goods undergoing clearance at the disposal of the persons concerned, so goods can be released while some formalities, such as the final duty assessment, are still open. In the US, 19 CFR 141.0a describes goods “released conditionally” before liquidation, the final assessment of duty.',
      ],
    },
    {
      heading: 'Who handles customs clearance?',
      paragraphs: [
        'The declarant: the person who makes the goods declaration or in whose name it is made. On the import side that is usually the importer, often through a customs broker; on the export side it is the exporter or its forwarder.',
        'In the US, 19 U.S.C. 1484 lets the importer of record make entry: the owner or purchaser of the goods, or a licensed customs broker it designates. CBP adds that the importer of record stays responsible for the entry and all duties, taxes and fees even when a broker files for it. In the UK, HMRC’s step-by-step guide asks importers to decide who will make customs declarations, and says most importing businesses use a transporter or customs agent.',
        'The seller is rarely the declarant at import, unless the sale is on DDP terms. The ICC’s Incoterms® 2020 rules decide who clears: under most rules the seller clears for export and the buyer for import, under EXW the buyer does both, and under DDP the seller does both.',
      ],
    },
    {
      heading: 'What are the steps in the customs clearance process?',
      paragraphs: [
        'The names and forms differ by country, but the order is the same everywhere. Here is the import side, with the US and UK references for each step.',
      ],
      steps: [
        'Register as a trader where the country requires it: an EORI number in the UK, an importer number in the US, which CBP says can be an IRS business registration number.',
        'Classify the goods under the importing country’s tariff and work out their customs value, which decide the duty and any licence the goods need.',
        'Collect the documents: the commercial invoice, the packing list, the bill of lading or air waybill, and any licence or permit another agency requires.',
        'File the declaration. In the US, entry is made on CBP Form 3461 or its electronic equivalent, and the entry summary on CBP Form 7501 follows within 10 working days; in the UK, the import declaration is made to HMRC.',
        'Customs reviews the declaration and may hold the goods for an examination.',
        'Pay or secure the duties and taxes, then customs releases the goods to the importer or its carrier.',
        'Keep the invoices and customs records, as HMRC’s guide asks UK importers to do.',
      ],
    },
    {
      heading: 'What documents do you need for customs clearance?',
      paragraphs: [
        'The commercial invoice above all, plus the packing list, the transport document and anything the goods themselves need. Under 19 CFR 142.3, US entry documents are CBP Form 3461 or its electronic equivalent, evidence of the right to make entry, the commercial invoice, a packing list where appropriate and other documents CBP or other agencies require. Under 19 CFR 141.86, the US invoice must state, among other things, a full description of the goods, quantities, the unit and total price, the currency and the country of origin.',
      ],
      table: {
        caption: 'Documents customs clearance usually runs on, and who prepares them',
        head: ['Document', 'Prepared by', 'What customs takes from it'],
        rows: [
          [
            'Commercial invoice',
            'Seller',
            'Description, quantities, value, currency, origin, parties',
          ],
          ['Packing list', 'Seller', 'Packages, marks, weights and dimensions'],
          [
            'Bill of lading or air waybill',
            'Carrier or forwarder',
            'Carrier, route, consignee and package count',
          ],
          [
            'Entry or import declaration',
            'Importer or its broker',
            'Classification, value, duty and the procedure claimed',
          ],
          [
            'Licences or permits',
            'Importer, from the agency concerned',
            'Permission for regulated goods',
          ],
        ],
      },
    },
    {
      heading: 'What is export customs clearance?',
      paragraphs: [
        'It is the same idea on the way out: the exporter declares the goods to the country they leave. In the US, the Foreign Trade Regulations at 15 CFR 30.3 make the US principal party in interest, or its authorized agent, responsible for filing the Electronic Export Information in the Automated Export System when a shipment needs it, and the filing returns an Internal Transaction Number for the carrier.',
        'Export clearance depends on the same invoice and packing list, and a value or description that differs between the export filing and the import entry invites questions on both sides.',
      ],
    },
    {
      heading: 'How can a seller help the goods clear?',
      paragraphs: [
        'Send documents the declarant can file without asking you anything. The importer or its broker types the entry from your invoice, so every gap on the invoice becomes a question, and every question is time.',
      ],
      list: [
        'Describe each line in plain words a customs officer would recognise, with the material and use, not a part number alone.',
        'State the true transaction value, the currency and the Incoterms® rule with its named place.',
        'Give the country of origin for each line.',
        'Make the packing list match the invoice in packages, quantities and weights.',
        'Send copies to the buyer and its broker before the goods arrive, so they can file early.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is customs clearance the same as paying duty?',
      a: 'No. Paying or securing duty is one step of clearance. Clearance also covers the declaration, the document checks and any examination, and some goods clear with no duty due.',
    },
    {
      q: 'Can I clear customs myself without a broker?',
      a: 'Often, yes. In the US, 19 U.S.C. 1484 lets the owner or purchaser make entry itself. In the UK, HMRC lets you make the import declaration yourself. Many businesses still use a broker or agent.',
    },
    {
      q: 'What does “cleared customs” mean on tracking?',
      a: 'Usually that customs has released the shipment, so the carrier can deliver it. Duty may still be finalised later; the post on customs tracking statuses explains each message.',
    },
    {
      q: 'Who pays for customs clearance?',
      a: 'The party the sale contract names. The Incoterms® 2020 rule you agree, such as DAP or DDP, says who clears for import and so who pays the duties and the broker.',
    },
    {
      q: 'Does a courier clear customs for me?',
      a: 'Ask the carrier whether it files the import entry as part of the service, and on what terms. In the US, CBP says the importer of record stays responsible for the entry and the duties whoever files it.',
    },
  ],
  sources: [
    'b1-wco-rkc-definitions',
    'a5-usc-19-1484',
    'w3-cbp-importer-tips',
    'a4-cbp-importer-tips',
    'a3-ecfr-19-cfr-141-0a',
    'a3-ecfr-19-cfr-142-3',
    'a3-ecfr-19-cfr-142-12',
    'us-cbp-invoice-contents',
    'w5-ftr-30-1',
    'w5-ftr-30-3',
    'b1-gov-uk-import-step-by-step',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Make an invoice the declarant can file from',
    text: 'Fill in the parties, goods, origin, values and the Incoterms® rule, and download a commercial invoice PDF ready to send with the shipment.',
  },
  related: [
    '/blog/how-long-does-customs-clearance-take',
    '/blog/customs-status-messages-explained',
    '/guides/importer-of-record',
    '/blog/commercial-invoice-requirements',
    '/guides/eei-aes-filing-itn',
    '/guides/how-to-import-into-the-us',
  ],
  cover: {
    id: 'bukjsECgmeU',
    src: 'https://images.unsplash.com/photo-1601897690942-bcacbad33e55',
    width: 4928,
    height: 3264,
    alt: 'Stacked blue, red and yellow shipping containers waiting at a terminal to clear customs',
    caption: 'Intermodal containers stacked at a terminal',
    photographer: { name: 'Paul .T', profile: 'https://unsplash.com/@hooverpaul55' },
    page: 'https://unsplash.com/photos/blue-red-and-yellow-intermodal-containers-bukjsECgmeU',
  },
};

export default article;
