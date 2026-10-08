import type { CountryPage } from '@/lib/content/country';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "korea customs" 170, KD 29; "export to south
 * korea" 110; "exporting to south korea" 110; "kc certification" 110.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C. Every fact below comes from the
 * source named beside it: the Korea Customs Service's own English pages and the ITA Country
 * Commercial Guide for South Korea. There are no duty or tax rates on this page by design, and
 * no wood-packaging, valuation or low-value rows because no current official source for them
 * was confirmed on the retrieval date.
 */
const country: CountryPage = {
  slug: 'south-korea',
  name: 'South Korea',
  iso2: 'KR',
  customsUnion: null,
  demand: [
    {
      keyword: 'korea customs',
      market: 'US',
      volume: 170,
      kd: 29,
      dataFile: '05-labs-keyword-overview-us-posts-countries-2.json',
    },
    {
      keyword: 'export to south korea',
      market: 'US',
      volume: 110,
      kd: 32,
      dataFile: '02-labs-keyword-overview-us-countries.json',
    },
    {
      keyword: 'exporting to south korea',
      market: 'US',
      volume: 110,
      kd: 2,
      dataFile: '02-labs-keyword-overview-us-countries.json',
    },
  ],
  metaTitle: 'South Korea export documents and UNI-PASS',
  description:
    'What a shipment to South Korea needs: a commercial invoice with two copies, two packing lists, the bill of lading and the UNI-PASS import declaration, from Korea Customs Service sources.',
  answer:
    'A shipment to South Korea is cleared on an import declaration that a customs broker or the goods’ owner files in the Korea Customs Service’s UNI-PASS system. It rests on an original commercial invoice with two copies, two packing lists, a clean bill of lading or air waybill, and origin evidence where the buyer claims a trade preference.',
  lede: 'What the exporter supplies and what the Korean importer files, with the official source for each line, from the Korea Customs Service’s English pages and the U.S. government’s Country Commercial Guide. It covers documents and labels only: it states no duty or tax rates, and the importer’s customs broker decides what a particular shipment needs.',
  customsAuthority: {
    name: 'Korea Customs Service (KCS)',
    url: 'https://www.customs.go.kr/english/',
    sourceId: 'c6-kcs-import-declaration',
  },
  documents: [
    {
      document: 'Import declaration, filed in UNI-PASS',
      status: 'required',
      condition:
        'Filed electronically by a customs broker or the owner of the goods; it may be filed before the goods arrive to speed up clearance.',
      sourceId: 'c6-kcs-import-declaration',
    },
    {
      document: 'Commercial invoice, original and two copies',
      status: 'required',
      condition:
        'Presented with the shipping documents, showing total value, unit value, quantity, marks, description and where the goods ship from and to.',
      sourceId: 'trade-gov-ccg-kr',
      tool: '/tools/invoice-generator',
    },
    {
      document: 'Packing list, two copies',
      status: 'required',
      condition: 'Two copies accompany the shipping documents.',
      sourceId: 'trade-gov-ccg-kr',
      tool: '/tools/packing-list-generator',
    },
    {
      document: 'Clean bill of lading, or air waybill for air cargo',
      status: 'required',
      condition:
        'Showing the shipper, the consignee’s name and address, the port of destination and a description of the cargo; no set form or number of copies.',
      sourceId: 'trade-gov-ccg-kr',
    },
    {
      document: 'Origin evidence (for a trade preference)',
      status: 'conditional',
      condition:
        'Listed by KCS among the supporting documents; check with the importer which form, if any, the shipment needs, for example to claim a trade preference.',
      sourceId: 'c6-kcs-import-declaration',
    },
    {
      document: 'Quarantine inspection certificate',
      status: 'conditional',
      condition: 'For goods subject to quarantine, such as plant and animal products.',
      sourceId: 'c6-kcs-import-declaration',
    },
    {
      document: 'Marine insurance policy or certificate',
      status: 'conditional',
      condition:
        'When the Incoterms® rule in the sale makes the exporter responsible for insurance.',
      sourceId: 'trade-gov-ccg-kr',
    },
    {
      document: 'MFDS product registration',
      status: 'conditional',
      condition:
        'Medical devices and pharmaceuticals must be registered with the Ministry of Food and Drug Safety and imported by a licensed importer.',
      sourceId: 'trade-gov-ccg-kr',
    },
  ],
  invoiceRequirements: [
    {
      text: 'Send an original commercial invoice and two copies with the shipping documents.',
      sourceId: 'trade-gov-ccg-kr',
    },
    {
      text: 'The invoice shows the total value and unit value, the quantity, the marks, a description of the products and the shipping origin and destination.',
      sourceId: 'trade-gov-ccg-kr',
    },
    {
      text: 'The import declaration itself is usually prepared by the importer in Korean, so an English invoice is the normal starting point; make descriptions specific enough for the broker to translate.',
      sourceId: 'trade-gov-ccg-kr',
    },
    {
      text: 'Commercial shipments entering Korea need country of origin labelling, and origin marks must be visible at customs clearance even when Korean labels are added later in a bonded area.',
      sourceId: 'c6-trade-gov-kr-labeling',
    },
    {
      text: 'Where goods carry English labelling, the information on it has to match the Korean labels.',
      sourceId: 'c6-trade-gov-kr-labeling',
    },
  ],
  importerIdentifiers: [
    {
      name: 'Licensed importer for medical devices and pharmaceuticals',
      whoNeedsIt:
        'Korean importers of medical devices and pharmaceuticals, which are certified by a body the Ministry of Food and Drug Safety authorises.',
      sourceId: 'trade-gov-ccg-kr',
    },
    {
      name: 'Personal Customs Clearance Code',
      whoNeedsIt:
        'Individuals importing personal items, including foreigners buying e-commerce goods, who enter it on the declaration instead of a registration or passport number. It is issued through UNI-PASS.',
      sourceId: 'c6-kcs-personal-clearance-code',
    },
  ],
  valuationBasis: null,
  incotermsNotes: [
    {
      text: 'KCS accepts import declarations from a customs broker or the owner of the goods, and the importer pays the taxes after the declaration is accepted. A DDP seller therefore needs a broker able to declare and pay in Korea on its behalf; otherwise sell on DAP or an earlier rule and let the buyer import.',
      sourceId: 'c6-kcs-import-declaration',
    },
    {
      text: 'Registration of regulated products such as medical devices and pharmaceuticals is usually handled by a qualified local agent, so plan who holds the registration before quoting delivered terms.',
      sourceId: 'trade-gov-ccg-kr',
    },
  ],
  controlledGoods: null,
  packaging: null,
  lowValueThreshold: null,
  sections: [
    {
      heading: 'Who files what at Korean customs?',
      paragraphs: [
        'The exporter supplies the commercial documents; the Korean side files. KCS describes import clearance as a series of procedures for the release of imported goods, all handled in its electronic clearance system, UNI-PASS. The declaration is made by a customs broker or the owner of the goods, and it can be filed before the ship or aircraft arrives.',
        'Once the declaration is in, KCS selects goods for inspection using risk management and cargo data analysis; inspection can be full or partial, and the owner of the goods bears its cost. After acceptance the importer pays the customs duties and taxes, and KCS notes that low-risk, compliant businesses may qualify for payment after clearance.',
      ],
    },
    {
      heading: 'What does the Korean commercial invoice need?',
      paragraphs: [
        'The Country Commercial Guide asks for an original invoice and two copies, showing total and unit value, quantity, marks, the product description and the shipping route. That list is short, but it puts weight on two things exporters often leave vague: unit values for every line, and marks that match the cartons.',
        'Pair the invoice with two copies of the packing list and make sure the carton numbers, quantities and weights agree across both. The bill of lading has no prescribed form, but it should be clean and show the consignee’s name and address and the port of destination.',
      ],
    },
    {
      heading: 'Do my goods need a Korean label or KC mark?',
      paragraphs: [
        'Origin labelling is required for commercial shipments, and KCS publishes the origin-labelling rules by HS code, in Korean. Korean-language labels can be attached locally in a bonded area, but the origin mark has to be visible when the goods are cleared, so mark the goods or their packaging before they ship.',
        'Separately, some products need certification before sale. The KC Mark, issued by the Korean Agency for Technology and Standards since July 2009, covers items under that agency’s jurisdiction. Whether your product needs it is a question for the importer or a certification body; this page does not classify products.',
      ],
    },
    {
      heading: 'What should I ask my Korean buyer before shipping?',
      paragraphs: [
        'Settle five points first: which customs broker files the declaration; whether the buyer needs origin evidence for a preference, and in which form; whether the product needs quarantine inspection, MFDS registration or a KC Mark; whether Korean labels will be applied before shipment or in a bonded area; and which Incoterms® rule decides who insures the cargo.',
        'Then ask whether the broker wants the invoice descriptions in a particular form, since the declaration is prepared in Korean and the translation starts from your words.',
      ],
    },
    {
      heading: 'Where do duty and tax figures come from?',
      paragraphs: [
        'Ask the importer’s customs broker; this page gives none. Korean import charges turn on how the goods are classified and where they originate, and a preference claim can change them. TradeDocs helps at the step before: an invoice whose values, quantities and marks the broker can use without coming back to you.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is UNI-PASS?',
      a: 'The Korea Customs Service’s online electronic clearance system. Import declarations and the other clearance procedures are handled in it, and the declaration can be filed by a customs broker or the owner of the goods.',
    },
    {
      q: 'How many copies of the commercial invoice does South Korea need?',
      a: 'The U.S. government’s Country Commercial Guide says an original invoice and two copies must be presented with the shipping documents, along with two copies of the packing list.',
    },
    {
      q: 'Does the invoice for South Korea have to be in Korean?',
      a: 'The guidance asks for the invoice’s contents, not a language, and the import declaration is usually prepared by the importer in Korean. An English invoice with clear descriptions is the usual practice; ask the broker if it wants anything added.',
    },
    {
      q: 'Can I file the import declaration before the goods arrive?',
      a: 'Yes. KCS allows importers to file the declaration before the goods arrive, to speed up clearance; otherwise it is filed after arrival.',
    },
  ],
  sources: [
    'c6-kcs-import-declaration',
    'trade-gov-ccg-kr',
    'c6-trade-gov-kr-labeling',
    'c6-trade-gov-kr-standards',
    'c6-kcs-personal-clearance-code',
  ],
  regulated: true,
  review: null,
  tool: '/tools/invoice-generator',
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default country;
