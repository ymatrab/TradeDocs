import type { CountryPage } from '@/lib/content/country';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "india customs" 880, KD 19; "shipping to india
 * from us" 480; "india import tax" 390; "iec code" 210.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A. Every fact below comes from the
 * source named beside it; there are no duty or tax rates on this page by design.
 */
const country: CountryPage = {
  slug: 'india',
  name: 'India',
  iso2: 'IN',
  customsUnion: null,
  demand: [
    {
      keyword: 'india customs',
      market: 'US',
      volume: 880,
      kd: 19,
      dataFile: '05-labs-keyword-overview-us-posts-countries-2.json',
    },
    {
      keyword: 'shipping to india from us',
      market: 'US',
      volume: 480,
      kd: 3,
      dataFile: '02-labs-keyword-overview-us-countries.json',
    },
    {
      keyword: 'iec code',
      market: 'US',
      volume: 210,
      kd: 16,
      dataFile: '04-labs-keyword-overview-us-questions.json',
    },
  ],
  metaTitle: 'India export documents: bill of entry and IEC',
  description:
    'The documents a shipment to India needs: the bill of entry, a signed invoice, packing list, transport document and the importer’s IEC, from Indian customs sources.',
  answer:
    'Goods entering India are cleared on a bill of entry filed by the importer, who must first hold an Importer-Exporter Code (IEC) from the DGFT. Indian customs generally expects a signed commercial invoice, a packing list, the bill of lading or airway bill and a valuation declaration with it, plus any import licence the goods need.',
  lede: 'What the exporter supplies and what the Indian importer files, document by document, with the official source for each line. It covers the paperwork only: it states no duty or tax rates, and your buyer’s customs broker has the last word on what a particular shipment needs.',
  customsAuthority: {
    name: 'Central Board of Indirect Taxes and Customs (CBIC)',
    url: 'https://www.cbic.gov.in/',
    sourceId: 'cbic-india',
  },
  documents: [
    {
      document: 'Bill of entry',
      status: 'required',
      condition:
        'The importer’s customs declaration. Through the electronic (EDI) system the importer files the particulars and the system generates it.',
      sourceId: 'cbic-chennai-import-procedure',
    },
    {
      document: 'Signed commercial invoice',
      status: 'required',
      condition: 'Generally required with the bill of entry. Sign it, as Indian customs lists a signed invoice.',
      sourceId: 'cbic-chennai-import-procedure',
      tool: '/tools/invoice-generator',
    },
    {
      document: 'Packing list',
      status: 'required',
      condition: 'Generally required with the bill of entry.',
      sourceId: 'cbic-chennai-import-procedure',
      tool: '/tools/packing-list-generator',
    },
    {
      document: 'Bill of lading, or delivery order or airway bill',
      status: 'required',
      condition: 'The transport document, generally required with the bill of entry.',
      sourceId: 'cbic-chennai-import-procedure',
    },
    {
      document: 'GATT valuation declaration',
      status: 'required',
      condition:
        'A declaration of the value of the goods, generally required with the bill of entry and completed on the importer’s side.',
      sourceId: 'cbic-chennai-import-procedure',
    },
    {
      document: 'Import licence',
      status: 'conditional',
      condition:
        'Only for goods that are restricted under India’s import policy; import documents must then be accompanied by the licence.',
      sourceId: 'trade-gov-ccg-in',
    },
    {
      document: 'Insurance documents and other certificates',
      status: 'conditional',
      condition: 'Where applicable to the goods or the terms of sale.',
      sourceId: 'cbic-chennai-import-procedure',
    },
  ],
  invoiceRequirements: [
    {
      text: 'Indian customs lists a signed invoice among the documents that generally accompany the bill of entry.',
      sourceId: 'cbic-chennai-import-procedure',
    },
  ],
  importerIdentifiers: [
    {
      name: 'IEC (Importer-Exporter Code)',
      whoNeedsIt:
        'The Indian importer, before filing a bill of entry. No import or export may be made without one unless specifically exempted.',
      sourceId: 'dgft-iec',
    },
    {
      name: 'PAN (Permanent Account Number)',
      whoNeedsIt:
        'The Indian importer’s business. The IEC the DGFT issues is the same number as the firm’s PAN.',
      sourceId: 'dgft-iec',
    },
  ],
  valuationBasis: null,
  incotermsNotes: [
    {
      text: 'The importer files the bill of entry and must hold an IEC from the DGFT first. A DDP sale therefore needs a party in India that holds an IEC and can act as importer; settle who that is before agreeing DDP.',
      sourceId: 'cbic-chennai-import-procedure',
    },
    {
      text: 'Bills of entry differ by what happens to the goods: one for home consumption, a separate one for warehousing, and an ex-bond bill of entry when goods leave a customs warehouse.',
      sourceId: 'cbic-chennai-import-procedure',
    },
  ],
  controlledGoods: {
    label:
      'India’s ITC(HS) import policy, with the lists of restricted, prohibited and state trading (STE) items',
    officialUrl: 'https://www.dgft.gov.in/CP/?opt=itchs-import-export',
    sourceId: 'dgft-itchs-policy',
  },
  packaging: null,
  lowValueThreshold: null,
  sections: [
    {
      heading: 'Who does what at Indian customs?',
      paragraphs: [
        'The exporter supplies the commercial documents: the signed commercial invoice, the packing list and the transport document. The Indian importer, usually through a customs broker, files the bill of entry with the customs administration under the CBIC and pays what is due. Most clearance runs through the electronic system, where the importer files the particulars and the system generates the bill of entry, so the details on your documents are what the importer declares.',
        'Before any of that, the importer needs an Importer-Exporter Code from the Directorate General of Foreign Trade. The DGFT says no import or export may be made without one unless specifically exempted, and that the IEC is the same number as the firm’s PAN. If your buyer is new to importing, confirm it holds an IEC before you ship.',
      ],
    },
    {
      heading: 'Do my goods need an import licence for India?',
      paragraphs: [
        'It depends on how India’s import policy treats them. The ITA’s country guide explains that goods on the Open General License can be imported freely without a licence, while banned goods cannot be imported, restricted goods need a licence and canalised goods are imported only through government agencies.',
        'The DGFT publishes the ITC(HS) import policy by HS code, with the lists of restricted, prohibited and state trading items. Your buyer or its broker checks the goods against it; TradeDocs does not classify goods or say which list a product is on. Where a licence is needed, the ITA notes that the import documents must be accompanied by it.',
      ],
    },
    {
      heading: 'What should the commercial invoice to India show?',
      paragraphs: [
        'Indian customs lists a signed invoice, so sign it and print the signatory’s name. Beyond that, carry what any commercial invoice carries: the seller and buyer with full addresses, a description precise enough to classify each line, the HS code where you know it, quantities and units, unit and total values in the currency of the sale, the Incoterms® rule and the country of origin of the goods.',
        'Make the packing list agree with it line for line, because the two are filed together and the importer declares from both. Ask the buyer whether its broker wants its IEC or other references printed on the invoice.',
      ],
    },
    {
      heading: 'What should I ask my Indian buyer before shipping?',
      paragraphs: [
        'Four questions settle most first shipments: whether they hold an IEC, and who their customs broker is; whether the goods are freely importable or need a licence under the ITC(HS) policy; whether the goods are going into home consumption or a customs warehouse, which changes the bill of entry; and which Incoterms® rule you are selling on, so it is clear who imports and who pays the freight and insurance.',
        'Write the answers into the shipment record so the next shipment to the same buyer starts from the same facts, and the invoice, packing list and transport document agree because they come from one record.',
      ],
    },
    {
      heading: 'Where do duty rates come from?',
      paragraphs: [
        'Not from this page. Customs duty and other charges on an import into India depend on the classification and value of the goods and on the rules in force at the time, and the importer’s broker works them out. TradeDocs states no rates here because they change and a wrong figure in a quotation is worse than none.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is an IEC code?',
      a: 'The Importer-Exporter Code is the number the DGFT issues to a business that imports or exports. No import or export may be made without one unless specifically exempted, and the IEC is the same as the firm’s PAN. The Indian importer needs it before filing a bill of entry.',
    },
    {
      q: 'What is a bill of entry?',
      a: 'The importer’s customs declaration in India. Through the electronic system the importer files the particulars and the bill of entry is generated; it is supported by the signed invoice, the packing list, the transport document and a valuation declaration.',
    },
    {
      q: 'Does the invoice for India have to be signed?',
      a: 'Indian customs lists a signed invoice among the documents that generally accompany the bill of entry, so sign it and print the signatory’s name.',
    },
    {
      q: 'Can I sell DDP to India?',
      a: 'Only if a party in India holds an IEC and can file the bill of entry as importer. Otherwise, sell on DAP or an earlier rule so the buyer imports.',
    },
  ],
  sources: [
    'cbic-india',
    'cbic-chennai-import-procedure',
    'dgft-iec',
    'dgft-itchs-policy',
    'trade-gov-ccg-in',
  ],
  regulated: true,
  review: null,
  tool: '/tools/invoice-generator',
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default country;
