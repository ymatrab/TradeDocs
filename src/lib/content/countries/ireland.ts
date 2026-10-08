import type { CountryPage } from '@/lib/content/country';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, 2026-10-07): "shipping to ireland from uk" 170, KD 8 (UK); "exporting
 * to ireland" 10, KD 3 (US). Plan: docs/research/content-plan-v3-2026-10-07.md, wave D. Ireland
 * is in the EU customs union, so its import rules are the Union Customs Code’s, applied by the
 * Revenue Commissioners; goods from Great Britain arrive from outside the EU like goods from
 * the United States. Every fact below comes from Revenue’s English pages, the European
 * Commission, GOV.UK or the ITA Country Commercial Guides. Northern Ireland’s arrangements are
 * out of scope. There are no duty or tax rates on this page by design, and no wood-packaging
 * or low-value rows because no current official source for them was confirmed on the
 * retrieval date.
 */
const country: CountryPage = {
  slug: 'ireland',
  name: 'Ireland',
  iso2: 'IE',
  customsUnion: 'EU',
  demand: [
    {
      keyword: 'shipping to ireland from uk',
      market: 'UK',
      volume: 170,
      kd: 8,
      dataFile: '06-labs-keyword-overview-uk-candidates.json',
    },
    {
      keyword: 'exporting to ireland',
      market: 'US',
      volume: 10,
      kd: 3,
      dataFile: '02-labs-keyword-overview-us-countries.json',
    },
  ],
  metaTitle: 'Ireland export documents: EORI, AIS, Revenue',
  description:
    'The documents a shipment to Ireland needs from Great Britain or the United States: the entry summary declaration, the import declaration in Revenue’s AIS, the EORI and the invoice behind them.',
  answer:
    'A shipment to Ireland from outside the EU, Great Britain included, needs an entry summary declaration before arrival and an import declaration lodged electronically in Revenue’s Automated Import System under an EORI number. The commercial invoice, packing list and bill of lading or air waybill supply its data.',
  lede: 'What the exporter supplies and what is filed in Ireland, with the official source for each line, mainly the Revenue Commissioners’ English pages. Ireland applies the EU’s customs rules, and since Brexit goods from Great Britain are imports like any other; this page states no duty or tax rates, and the importer’s customs agent decides what a particular shipment needs.',
  customsAuthority: {
    name: 'Office of the Revenue Commissioners (Revenue), Customs',
    url: 'https://www.revenue.ie/en/customs/index.aspx',
    sourceId: 'd5-revenue-new-to-customs',
  },
  documents: [
    {
      document: 'Entry summary declaration (ENS) in ICS2',
      status: 'required',
      condition:
        'Safety and security data lodged in the EU’s Import Control System 2 before the goods arrive by the operators bringing them in; for air cargo a minimum data set is due before loading.',
      sourceId: 'd5-ec-ics2',
    },
    {
      document: 'Import customs declaration in AIS',
      status: 'required',
      condition:
        'Lodged electronically with Revenue by the importer or an agent acting for it, in the Automated Import System, which validates, processes and clears declarations and accounts for duty.',
      sourceId: 'd5-revenue-new-to-customs',
    },
    {
      document: 'Commercial invoice',
      status: 'required',
      condition:
        'One copy is needed for customs clearance. No special format is required, but the ITA recommends signing it and showing the parties, weights, price and terms.',
      sourceId: 'trade-gov-ccg-ie',
      tool: '/tools/invoice-generator',
    },
    {
      document: 'Bill of lading or air waybill',
      status: 'required',
      condition:
        'One copy for clearance; the bill of lading should name the notify party, and the consignee needs the original to take possession of the goods.',
      sourceId: 'trade-gov-ccg-ie',
    },
    {
      document: 'Packing list',
      status: 'typical',
      condition:
        'Listed by Revenue among the documents an import may need, depending on the goods, alongside the invoice and transport document.',
      sourceId: 'd5-revenue-new-to-customs',
      tool: '/tools/packing-list-generator',
    },
    {
      document: 'Veterinary or plant health certificate, or a licence',
      status: 'conditional',
      condition:
        'Needed for particular goods, such as animal and plant products or licensed items; Revenue lists them among the supporting documents that depend on what is imported.',
      sourceId: 'd5-revenue-new-to-customs',
    },
  ],
  invoiceRequirements: [
    {
      text: 'Include the date and place of shipment, the buyer and seller, weights, the price, and the payment and delivery terms, and have a responsible official of the shipper sign the invoice, as the ITA’s Ireland guide recommends.',
      sourceId: 'trade-gov-ccg-ie',
    },
    {
      text: 'Describe each line precisely enough to be classified. Revenue explains that the commodity code is what determines the import duty, so goods must be correctly classified.',
      sourceId: 'd5-revenue-new-to-customs',
    },
    {
      text: 'State the country of origin for each line, as supplied by the manufacturer. Revenue warns that origin decides the duty payable and may differ from the country the goods are shipped from, which matters for goods sent on from a British warehouse.',
      sourceId: 'd5-revenue-new-to-customs',
    },
    {
      text: 'Show the importer’s EORI number with its name and address. Irish EORI numbers are registered through the Revenue Online Service, and some older ones match the VAT number with an IE prefix.',
      sourceId: 'd5-revenue-eori',
    },
  ],
  importerIdentifiers: [
    {
      name: 'EORI number (Economic Operators’ Registration and Identification number)',
      whoNeedsIt:
        'Any trader importing or exporting goods into or out of the EU. Irish businesses register through the Revenue Online Service (ROS), and an Eircode is mandatory, or declarations may be rejected.',
      sourceId: 'd5-revenue-eori',
    },
    {
      name: 'EORI number for a company outside the EU',
      whoNeedsIt:
        'A British or U.S. company lodging declarations itself. It requests the number from the customs authority of the first Member State it exports to and can then use it across the EU.',
      sourceId: 'trade-gov-ccg-ie',
    },
    {
      name: 'Trader Account Number (TAN)',
      whoNeedsIt:
        'Assigned automatically by Revenue on EORI registration and used to pay duties, in cash, by transfer to Revenue’s bank account or by deferred payment.',
      sourceId: 'd5-revenue-new-to-customs',
    },
  ],
  valuationBasis: { basis: 'CIF', sourceId: 'd5-revenue-new-to-customs' },
  incotermsNotes: [
    {
      text: 'Revenue defines the customs value as the invoice price plus the cost of transport and insurance. On an EXW or FCA sale, give the Irish buyer’s agent the freight and insurance figures, or the declaration cannot be completed.',
      sourceId: 'd5-revenue-new-to-customs',
    },
    {
      text: 'A seller outside the EU quoting DDP must be able to lodge the Irish declaration, itself or through an agent, under an EORI number. Revenue can cancel an Irish EORI held by a non-EU operator that goes unused for six months where Ireland is not its first Member State of declaration.',
      sourceId: 'd5-revenue-eori',
    },
    {
      text: 'A regular importer can use deferred payment: goods imported in one month and their import charges paid on the 15th of the following month. Under DAP that is the Irish buyer’s arrangement; under DDP the seller or its agent needs its own.',
      sourceId: 'd5-revenue-new-to-customs',
    },
  ],
  controlledGoods: null,
  packaging: null,
  lowValueThreshold: null,
  sections: [
    {
      heading: 'Do goods from Great Britain need customs declarations in Ireland?',
      paragraphs: [
        'Yes. Revenue’s rule is that anyone moving goods to, from or through a country outside the EU must register for customs, usually by obtaining an EORI number, and lodge customs declarations electronically. Great Britain is outside the EU, so a pallet from Manchester to Dublin is an import into Ireland and an export from the UK.',
        'That means two sets of formalities. On the British side, GOV.UK’s export declaration guidance covers the GB EORI, the declaration, often through an agent, and what the haulier needs at the border. On the Irish side, the importer’s agent lodges the import declaration in AIS.',
      ],
    },
    {
      heading: 'What is filed before and after the goods arrive in Ireland?',
      paragraphs: [
        'Before arrival, safety and security data goes into the EU’s Import Control System 2 as an entry summary declaration, filed by the operators bringing the goods in. The European Commission states that consignments entering the EU from 1 June 2026 need a valid ENS. It is a security filing, not a clearance.',
        'After arrival the goods are declared for a customs procedure. Revenue’s Automated Import System validates and processes the declaration, accounts for the duty and clears the goods. The ITA describes the EU-wide format, the Single Administrative Document, as covering customs duties and VAT and usually being filed by the importer of record or its agent.',
      ],
    },
    {
      heading: 'Why does Revenue care about the commodity code and origin?',
      paragraphs: [
        'Because together they decide the duty. Revenue says the commodity code determines the import duties, so products must be correctly classified, and that origin, normally provided by the supplier, decides the duty payable too. The EU’s trade agreements may allow preferential rates, under each agreement’s own rules.',
        'For a British seller this matters most: goods made in Great Britain and goods bought in from elsewhere and shipped on from a British warehouse do not share an origin. State the origin of each line as the manufacturer gave it, and let the Irish agent decide what can be claimed.',
      ],
    },
    {
      heading: 'What should I ask my Irish buyer before shipping?',
      paragraphs: [
        'Settle these first: the buyer’s EORI number and the name and address it is registered under; which customs agent will lodge the AIS declaration; the Incoterms® rule, and with it who pays duty and import VAT and how; and whether the goods need a veterinary or plant health certificate or a licence.',
        'Then send an invoice that matches the packing list, with descriptions the agent can classify, origin per line, and freight and insurance stated, because Revenue’s customs value includes them. TradeDocs states no rates here; the agent works out the charges from what you send.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do I need an EORI number to ship from the UK to Ireland?',
      a: 'The exporter needs a GB EORI for the UK export declaration, and the Irish importer needs an EU EORI to clear the goods. A British company that lodges Irish declarations itself needs an EU EORI from the first Member State it exports to.',
    },
    {
      q: 'What is AIS in Ireland?',
      a: 'The Automated Import System, Revenue’s national electronic system for import declarations. It validates and processes declarations, accounts for duty and clears the goods for businesses importing from outside the EU.',
    },
    {
      q: 'Is Ireland’s customs value CIF or FOB?',
      a: 'CIF in effect: Revenue defines the customs value as the invoice price plus the cost of transport and insurance, so freight and insurance figures are needed even on an EXW or FCA sale.',
    },
    {
      q: 'Who pays import charges on goods shipped to Ireland?',
      a: 'Whoever the Incoterms® rule makes the importer: the buyer under DAP, the seller under DDP. Charges are paid against the importer’s Trader Account Number, in cash, by transfer or by deferred payment.',
    },
  ],
  sources: [
    'd5-revenue-new-to-customs',
    'trade-gov-ccg-ie',
    'trade-gov-ccg-eu',
    'd5-revenue-ais',
    'd5-revenue-eori',
    'd5-ec-ics2',
    'c4-gov-uk-export-customs-declaration',
  ],
  regulated: true,
  review: null,
  tool: '/tools/invoice-generator',
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default country;
