import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'ics2',
  term: 'ICS2 (Import Control System 2)',
  abbreviation: 'ICS2',
  aliases: ['Import Control System 2', 'ICS2 entry summary declaration', 'ENS filing'],
  demand: {
    keyword: 'ics2',
    market: 'US',
    volume: 1600,
    kd: 32,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'ICS2 meaning: the EU’s advance cargo filing',
  description:
    'What ICS2 is, who files the entry summary declaration before goods reach the EU, why the invoice description and the real parties matter, and how it differs from the import declaration.',
  shortDefinition:
    'ICS2, the Import Control System 2, is the European Union’s advance cargo information system. Operators bringing goods into or through the EU file safety and security data in an entry summary declaration (ENS) before the goods arrive, so customs can assess risk.',
  definition: [
    'The European Commission describes ICS2 as an advance cargo information system for the security of goods moving into the EU. It does not collect duty and it does not clear goods for sale. Its job is risk analysis: customs see who is sending what to whom before the shipment lands, and can target the consignments that look dangerous while the rest move on.',
    'The filing is the entry summary declaration, or ENS. Economic operators that bring goods to or through the EU must lodge a complete ENS before arrival. Air cargo has an extra step, a minimum data set filed before the goods are even loaded abroad, and the carrier then sends an arrival notification at the first customs office of entry, where the goods are presented. The Commission states that consignments entering the EU from 1 June 2026 need a valid ENS.',
    'In practice the ENS is lodged by the carrier, a forwarder or a postal or express operator, not by the exporter, but its data comes from the exporter’s documents.',
  ],
  onYourDocuments: [
    'ICS2 is not a field on a commercial invoice, yet the invoice feeds it. The goods description, the HS code and the names and addresses of the seller and buyer are what the filer copies into the ENS. Guidance the Commission circulated to air cargo operators says descriptions such as “unknown” are unacceptable, that goods under different HS codes need separate items, and that the consignor and consignee on the lowest house air waybill must be the real parties, not a forwarder or customs agent.',
    'So write a plain, specific description on every line of the invoice and packing list, show the HS code where you know it, and name the actual buyer as consignee.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Lakeshore Optics (invented), a U.S. company, air-freights lenses to a retailer in Lyon. Its forwarder needs the ENS data before the flight leaves Chicago. The first invoice draft says “parts”, which the forwarder flags as too vague for ICS2. Lakeshore reissues it as “glass camera lenses, unmounted” with an HS code, and names the Lyon retailer, not the French customs agent, as consignee.',
      'The ENS is accepted before loading. When the plane lands, the retailer’s broker files the separate import declaration that actually clears the goods.',
    ],
  },
  confusedWith: [
    {
      term: 'Import customs declaration',
      difference:
        'The ENS filed in ICS2 is a security notice made before arrival. The customs declaration, filed later by or for the importer, places the goods under a procedure and settles duty and VAT.',
    },
  ],
  related: [
    '/blog/shipping-to-the-uk-and-eu-documents',
    '/guides/eori-number',
    'customs-declaration',
    'shipping-manifest',
  ],
  tool: '/tools/invoice-generator',
  toolPitch:
    'The commercial invoice generator gives every line its own description and HS code, which is the detail an ICS2 filer copies into the ENS.',
  faq: [
    {
      q: 'Who files the ICS2 entry summary declaration?',
      a: 'The economic operators bringing the goods into the EU, usually the carrier, and in some business models the forwarder or postal or express operator as well. The exporter rarely files it but supplies the data through its invoice and shipping documents.',
    },
    {
      q: 'Does ICS2 replace the import declaration?',
      a: 'No. ICS2 handles the security and safety data before arrival. The goods still need a customs declaration, lodged by or for the importer, before they are released into the EU.',
    },
  ],
  sources: ['d5-ec-ics2', 'b1-eeas-ics2-air', 'c6-zoll-entry-summary'],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
