import type { CountryPage } from '@/lib/content/country';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "export to brazil" 260, KD 5; "exporting to
 * brazil" 260; "brazil customs" 320; "siscomex" 210; "shipping to brazil from us" 140.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B. Every fact below comes from the
 * source named beside it, mainly the Receita Federal's import clearance manual; there are no
 * duty or tax rates on this page by design.
 */
const country: CountryPage = {
  slug: 'brazil',
  name: 'Brazil',
  iso2: 'BR',
  customsUnion: null,
  demand: [
    {
      keyword: 'brazil customs',
      market: 'US',
      volume: 320,
      kd: 3,
      dataFile: '05-labs-keyword-overview-us-posts-countries-2.json',
    },
    {
      keyword: 'export to brazil',
      market: 'US',
      volume: 260,
      kd: 5,
      dataFile: '02-labs-keyword-overview-us-countries.json',
    },
    {
      keyword: 'siscomex',
      market: 'US',
      volume: 210,
      kd: 5,
      dataFile: '04-labs-keyword-overview-us-questions.json',
    },
  ],
  metaTitle: 'Brazil export documents: fatura and Siscomex',
  description:
    'The documents a shipment to Brazil needs: the signed original commercial invoice, the bill of lading, the packing list and the importer’s Siscomex access, from Receita Federal sources.',
  answer:
    'A shipment to Brazil is cleared on an import declaration the Brazilian importer files in Siscomex. It rests on the original commercial invoice signed by the exporter, the original bill of lading or equivalent, a packing list where one is normally issued, and an import licence or proof of origin when the goods or a preference need one.',
  lede: 'What the exporter supplies and what the Brazilian importer files, with the official source for each line, most of them from the Receita Federal’s own clearance manual. It covers the documents only: it states no duty or tax rates, and the importer’s customs broker (despachante aduaneiro) decides what a particular shipment needs.',
  customsAuthority: {
    name: 'Receita Federal do Brasil (RFB)',
    url: 'https://www.gov.br/receitafederal/pt-br',
    sourceId: 'b7-rfb-documentos-instrutivos',
  },
  documents: [
    {
      document: 'Import declaration, registered in Siscomex',
      status: 'required',
      condition:
        'Filed by the Brazilian importer, or its representative, in the Sistema Integrado de Comércio Exterior; clearance runs through that system.',
      sourceId: 'b7-rfb-habilitacao',
    },
    {
      document: 'Commercial invoice (fatura comercial), original signed by the exporter',
      status: 'required',
      condition:
        'The declaration must be supported by the original invoice, signed by digital certificate if it is electronic or by hand if it is on paper.',
      sourceId: 'b7-rfb-fatura-comercial',
      tool: '/tools/invoice-generator',
    },
    {
      document: 'Bill of lading or equivalent transport document, original',
      status: 'required',
      condition: 'The original transport document, or a document with the same effect, supports every import declaration.',
      sourceId: 'b7-rfb-documentos-instrutivos',
    },
    {
      document: 'Packing list (romaneio de carga)',
      status: 'conditional',
      condition:
        'Required where issuing one is current practice; not for bulk cargo or goods that identify themselves, such as vehicles by chassis number.',
      sourceId: 'b7-rfb-romaneio',
      tool: '/tools/packing-list-generator',
    },
    {
      document: 'Proof of origin',
      status: 'conditional',
      condition:
        'Only where it applies, for example when the importer claims a trade preference. Ask the importer which form it needs.',
      sourceId: 'b7-rfb-documentos-instrutivos',
    },
    {
      document: 'Import licence',
      status: 'conditional',
      condition:
        'For goods that need one, approved by one or more of sixteen Brazilian authorities, usually before shipment.',
      sourceId: 'trade-gov-ccg-br',
    },
    {
      document: 'ANVISA product registration',
      status: 'conditional',
      condition:
        'For products that may affect the human body, such as pharmaceuticals, vitamins, cosmetics and medical devices.',
      sourceId: 'trade-gov-ccg-br',
    },
  ],
  invoiceRequirements: [
    {
      text: 'The importer presents the original invoice signed by the exporter: a digital certificate signature on an electronic invoice, or a handwritten signature by the exporter or its legal representative on paper.',
      sourceId: 'b7-rfb-fatura-comercial',
    },
    {
      text: 'Goods are specified in Portuguese or in an official language of the GATT, which the Receita Federal lists as English, French and Spanish. In another language, customs may require a Portuguese translation.',
      sourceId: 'b7-rfb-fatura-comercial',
    },
    {
      text: 'The invoice states the full names and addresses of exporter and importer, the marks, numbering and reference numbers of the packages, their quantity and kind, and their gross and net weight.',
      sourceId: 'b7-rfb-fatura-comercial',
    },
    {
      text: 'It names three countries separately: origin (where the goods were produced), acquisition (where they were bought from) and provenance (where they were when shipped).',
      sourceId: 'b7-rfb-fatura-comercial',
    },
    {
      text: 'It shows the unit and total price of each kind of goods, the freight and other expenses, the conditions and currency of payment, and the Incoterms® rule.',
      sourceId: 'b7-rfb-fatura-comercial',
    },
    {
      text: 'The importer uploads the supporting documents, invoice included, to the Portal Único de Comércio Exterior, authenticated with a digital certificate.',
      sourceId: 'b7-rfb-documentos-instrutivos',
    },
  ],
  importerIdentifiers: [
    {
      name: 'CNPJ (Cadastro Nacional da Pessoa Jurídica)',
      whoNeedsIt:
        'The Brazilian importing company. Its CNPJ must be in active status to request access to Siscomex.',
      sourceId: 'b7-rfb-portal-habilita',
    },
    {
      name: 'Siscomex habilitação',
      whoNeedsIt:
        'The importer, before it can use Siscomex. It is requested in the Habilita system on the Portal Único Siscomex; some operations are exempt.',
      sourceId: 'b7-rfb-habilitacao',
    },
    {
      name: 'SECEX registration',
      whoNeedsIt:
        'Brazilian importers, who register with the Foreign Trade Secretariat (SECEX) of the Ministry of Development, Industry, Trade and Services through Siscomex.',
      sourceId: 'trade-gov-ccg-br',
    },
  ],
  valuationBasis: null,
  incotermsNotes: [
    {
      text: 'Only a company with an active CNPJ and Siscomex access can register the import declaration, so a DDP sale needs a Brazilian entity able to import in its own name. Without one, sell on DAP or an earlier rule and let the buyer import.',
      sourceId: 'b7-rfb-portal-habilita',
    },
    {
      text: 'Health-regulated products can be imported and sold only if the foreign company sets up a local manufacturing unit or office, or appoints an authorised Brazilian distributor that holds the ANVISA registration.',
      sourceId: 'trade-gov-ccg-br',
    },
  ],
  controlledGoods: null,
  packaging: { ispm15: true, sourceId: 'b7-mapa-embalagens' },
  lowValueThreshold: null,
  sections: [
    {
      heading: 'Who files what at Brazilian customs?',
      paragraphs: [
        'The exporter supplies the commercial documents; the importer does the filing. The Brazilian buyer, usually through a despachante aduaneiro, registers the import declaration in Siscomex, attaches digital copies of the supporting documents through the Portal Único and pays what is due. The Receita Federal, Brazil’s tax and customs authority, then clears the goods.',
        'Your invoice is the core of that file. The Receita Federal’s manual lists fourteen items a fatura comercial has to show, and the importer has to present the signed original, so check every item before you sign rather than after the goods sail.',
      ],
    },
    {
      heading: 'What makes the Brazilian commercial invoice different?',
      paragraphs: [
        'Three things catch out first-time exporters. The original must be signed, and the Receita Federal accepts a digital certificate signature on an electronic invoice or a handwritten one on paper. The invoice asks for three countries, not one: where the goods were made, where they were bought from and where they were shipped from. And it wants freight and other expenses shown, alongside the Incoterms® rule and the payment terms.',
        'Language is less of a hurdle than many expect. Descriptions may be in Portuguese, English, French or Spanish, although customs can ask for a Portuguese translation of anything else. An English invoice that carries every required item is the usual starting point; ask the importer’s broker whether it wants Portuguese descriptions alongside.',
      ],
    },
    {
      heading: 'Does the packing list matter in Brazil?',
      paragraphs: [
        'Yes, wherever packing lists are normal for the cargo. The Receita Federal requires the romaneio de carga when issuing one is current practice and sets no standard form. It expects to see the total number of packages, their marks and numbers, and the net and gross weight, unit dimensions and total volume for each kind of packaging. Bulk cargo and goods identified by their own serial or chassis numbers are the exceptions.',
      ],
    },
    {
      heading: 'What should I ask my Brazilian buyer before shipping?',
      paragraphs: [
        'Settle five points first: whether the buyer’s CNPJ is active and it holds Siscomex access for the import; which despachante aduaneiro handles the clearance; whether the goods need an import licence, and if so whether it is issued before shipment; whether ANVISA or another agency regulates the product; and whether the buyer will claim a trade preference that needs proof of origin.',
        'Then confirm the paperwork for the wood: Brazil’s agriculture ministry requires wood packaging from abroad to be treated to ISPM 15 and the importer to state the treatment or IPPC mark, and untreated packaging is sent back.',
      ],
    },
    {
      heading: 'Where do duty and tax figures come from?',
      paragraphs: [
        'From the importer’s broker, not this page. Brazilian import charges depend on the classification of the goods and on taxes that change over time. TradeDocs states no rates here; what it can do is make sure the invoice gives the broker the values, freight and expenses it needs to work them out.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does a commercial invoice for Brazil have to be in Portuguese?',
      a: 'No. The Receita Federal accepts goods descriptions in Portuguese or in an official GATT language, which it lists as English, French and Spanish. In any other language, customs may require a Portuguese translation.',
    },
    {
      q: 'Does the invoice for Brazil need to be signed?',
      a: 'Yes. The import declaration must be supported by the original commercial invoice signed by the exporter, by digital certificate on an electronic invoice or by hand on paper.',
    },
    {
      q: 'What is Siscomex?',
      a: 'The Sistema Integrado de Comércio Exterior, the system in which Brazilian customs clearance is processed. The importer must obtain access to it, requested through the Habilita system on the Portal Único Siscomex, before registering an import declaration.',
    },
    {
      q: 'Can I sell DDP to Brazil?',
      a: 'Only if a Brazilian company with an active CNPJ and Siscomex access imports the goods in its own name. A foreign seller without a Brazilian entity normally sells on DAP or an earlier rule, so the buyer imports.',
    },
  ],
  sources: [
    'b7-rfb-documentos-instrutivos',
    'trade-gov-ccg-br',
    'b7-rfb-fatura-comercial',
    'b7-rfb-romaneio',
    'b7-rfb-habilitacao',
    'b7-rfb-portal-habilita',
    'b7-mapa-embalagens',
  ],
  regulated: true,
  review: null,
  tool: '/tools/invoice-generator',
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default country;
