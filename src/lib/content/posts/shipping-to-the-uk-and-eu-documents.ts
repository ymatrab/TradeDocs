import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "how to ship to uk from us" 90, KD 19; conversion
 * role for the invoice generator.
 * Plan: docs/research/content-plan-v3-2026-10-07.md (v2 #38), wave C. Angle: invoice, EORI,
 * commodity codes and VAT points for UK and EU buyers in one page.
 * Every UK rule is from GOV.UK and every EU rule from the European Commission, opened 2026-10-08.
 * No duty or VAT rate is stated for any product; example parties are invented.
 */
const article: ContentArticle = {
  slug: 'shipping-to-the-uk-and-eu-documents',
  title: 'Shipping to the UK and EU from the US: the documents you need',
  metaTitle: 'How to ship to the UK and EU: documents',
  description:
    'The documents and numbers a US seller needs to ship to UK and EU buyers: commercial invoice, packing list, EORI, commodity codes, and where VAT and duty are paid.',
  lede: 'Shipping from the US to a buyer in the UK or the EU uses the same core paperwork: a commercial invoice, a packing list and the carrier’s transport document. What changes between the two is who registers for customs, which tariff the codes come from and how VAT is collected. This post sets out both sides so you can quote and prepare the shipment once.',
  answer:
    'To ship to the UK or EU from the US, send a commercial invoice and packing list with the goods, show the commodity code and customs value for each line, and agree who imports and pays duty and VAT. In the UK the importer needs a GB EORI number; in the EU, an EU EORI number.',
  keyFacts: [
    'GOV.UK says a business importing into Great Britain needs an EORI number starting with GB.',
    'HMRC says the commodity code on the import declaration determines the rate of duty and whether an import licence is needed.',
    'GOV.UK says no Customs Duty is charged on non-excise goods worth £135 or less sent to Great Britain; VAT is charged on all goods except gifts of £39 or less.',
    'The European Commission says an import declaration is required for all goods entering the EU, regardless of value, since 1 July 2021.',
    'The EU’s Import One-Stop Shop covers VAT on distance sales of imported goods in consignments worth up to EUR 150.',
  ],
  definitions: [
    {
      term: 'EORI number',
      meaning:
        'The customs identification number used on declarations: GB numbers in Great Britain, EU numbers issued by an EU country.',
    },
    {
      term: 'Importer',
      meaning:
        'The party that makes, or has an agent make, the import declaration and pays the duty and import VAT.',
    },
    {
      term: 'Commodity code',
      meaning:
        'The number that classifies goods in the UK Trade Tariff or the EU’s TARIC, and sets their duty and rules.',
    },
    {
      term: 'IOSS',
      meaning:
        'The EU Import One-Stop Shop, which lets a seller charge and pay EU VAT on low-value sales at the point of sale.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Which documents travel with a shipment to the UK or EU?',
      paragraphs: [
        'The commercial invoice, the packing list and the transport document. The invoice gives customs the seller, buyer, goods description, quantities, values and currency; the packing list gives packages, weights and dimensions; the carrier issues the bill of lading, air waybill or courier label. The importer’s customs agent builds the import declaration from them.',
        'GOV.UK’s import guidance says the importer must keep commercial invoices and customs paperwork, and that the importer should check that whoever sends the goods can export them from their own country. On the US side, the export rules, including any filing in the Automated Export System, are covered in the guide “How to export from the US”.',
      ],
      table: {
        caption: 'The same documents serve UK and EU buyers; the numbers on them differ',
        head: ['Item', 'Buyer in Great Britain', 'Buyer in the EU'],
        rows: [
          ['Commercial invoice', 'Required by the importer’s agent', 'Required by the importer’s agent'],
          ['Packing list', 'Matches invoice quantities', 'Matches invoice quantities'],
          ['Importer’s customs number', 'EORI starting with GB', 'EORI issued by an EU country'],
          ['Tariff for commodity codes', 'UK Trade Tariff', 'EU TARIC'],
          ['Low-value VAT route', 'Seller charges UK VAT at sale, £135 or less', 'IOSS, up to EUR 150'],
        ],
      },
    },
    {
      heading: 'Who is the importer when you ship to the UK or EU?',
      paragraphs: [
        'Usually the buyer, but it depends on the Incoterms® 2020 rule you agree. Under rules such as FCA, FOB, CIF or DAP, the buyer handles import clearance and pays import duties and taxes. Under DDP, the ICC’s rules place import clearance and import duties on the seller, so a US seller shipping DDP takes on the importer’s role.',
        'That choice decides whose customs number goes on the import declaration. GOV.UK says importers into Great Britain need an EORI number starting with GB. The European Commission says operators established outside the EU need an EU EORI number when they lodge customs declarations, issued by the EU country where they carry out their first customs operation. Settle the rule before you quote, because a DDP price has to cover duty and VAT you will not know until the goods are classified and valued.',
      ],
    },
    {
      heading: 'What must the commercial invoice show for UK and EU customs?',
      paragraphs: [
        'Enough for the importer to declare the goods correctly. HMRC lists the commodity code and the customs value among the things an importer needs before the goods arrive, and the commodity code determines the duty rate and whether an import licence is needed. The invoice is where both start.',
      ],
      steps: [
        'Name the seller and the buyer in full, with the buyer’s EORI number if they give you one.',
        'Describe each line in plain words a customs officer can classify, with quantity and unit.',
        'Show the commodity code for each line if you or the buyer have classified it. TradeDocs never suggests a code for a product.',
        'State the unit price, line value, total and currency, and show freight and insurance separately.',
        'State the Incoterms® 2020 rule with the named place, such as DAP Leeds or FCA Chicago.',
        'Give the country of origin of the goods and the reason for export, such as sale or sample.',
      ],
    },
    {
      heading: 'How is VAT collected on goods shipped to the UK?',
      paragraphs: [
        'It depends on the value of the consignment. For goods sold directly to customers in Great Britain in consignments worth £135 or less, HMRC’s guidance says UK supply VAT is charged at the point of sale, by the seller, rather than at import. If the customer is a UK business that gives you its UK VAT registration number, the guidance says you do not charge VAT and can note on the invoice that the customer accounts for it under the reverse charge.',
        'Above £135, HMRC says normal VAT and customs rules apply at import. The importer pays import VAT, or a VAT-registered importer can use postponed VAT accounting, explained in the post “Postponed VAT accounting: how UK import VAT works for your buyer”. GOV.UK also says no Customs Duty is charged on non-excise goods worth £135 or less; above that, duty depends on the commodity code and origin.',
      ],
    },
    {
      heading: 'How is VAT collected on goods shipped to the EU?',
      paragraphs: [
        'The European Commission says the VAT exemption for imported goods below EUR 22 ended on 1 July 2021, so imported goods are subject to VAT whatever their value, and every consignment needs an import declaration. For consignments up to EUR 150, VAT can be collected through the Import One-Stop Shop or through the special arrangements; above EUR 150, the standard import procedure applies.',
        'Under IOSS, a seller selling to EU consumers charges VAT at the point of sale and pays it through a monthly return in one EU country. The Commission says a seller established outside the EU must appoint an EU-established intermediary to use the scheme. The guide “IOSS: EU VAT on low-value parcels for non-EU sellers” explains the steps.',
        'Low-value parcels also carry a customs duty now. The Commission announced a temporary €3 customs duty from 1 July 2026 on low-value parcels worth up to €150 imported from outside the EU, charged per item by tariff classification and declared and paid by the seller or importer.',
      ],
    },
    {
      heading: 'Where do the commodity codes come from?',
      paragraphs: [
        'From the destination’s tariff. For Great Britain, codes come from the UK Trade Tariff; for the EU, from the Combined Nomenclature and TARIC. Both build on the World Customs Organization’s Harmonized System, so the first six digits usually match the code you use for US export, but the national digits after them can differ, and so can the duty rate. The guides “UK commodity codes” and “TARIC and CN codes” explain how to look them up.',
      ],
    },
    {
      heading: 'How do you prepare one shipment for a UK or EU buyer?',
      paragraphs: [
        'Work through the shipment in this order. An invented example: Lakeshore Outfitters LLC (invented) in Ohio sells 40 cartons of hiking gear to Fellside Retail Ltd (invented) in Kendal on DAP Kendal. Fellside is the importer, gives its GB EORI number, and its agent declares the goods; Lakeshore supplies the invoice and packing list, books the freight to Kendal and checks its own US export filing.',
        'If the same order went to a German retailer on DAP terms, the paperwork would look the same; only the importer’s EU EORI number and the TARIC codes would change. On DDP terms, Lakeshore itself would need the importer’s customs number in the destination and would pay the duty and VAT there.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do I need a UK EORI number to ship to a UK customer?',
      a: 'Only if you act as the importer, for example on DDP terms. GOV.UK says importers into Great Britain need an EORI number starting with GB; on other rules the buyer usually imports.',
    },
    {
      q: 'Is the £135 rule the same as the EU’s EUR 150 rule?',
      a: 'No. Both let VAT on low-value sales be charged at the point of sale, but the UK rule applies by default to Great Britain sales, while IOSS is a scheme the seller registers for.',
    },
    {
      q: 'Can I use one commercial invoice for UK and EU buyers?',
      a: 'The same layout works for both. Each shipment needs its own invoice with that buyer’s details, the destination’s commodity codes and the agreed Incoterms® rule.',
    },
    {
      q: 'Who pays import VAT if the buyer is the importer?',
      a: 'The importer pays it at import or, in the UK, may account for it through postponed VAT accounting if VAT-registered.',
    },
  ],
  sources: [
    'c4-gov-uk-import-goods',
    'c4-gov-uk-overseas-goods-sold-to-uk-customers',
    'c4-gov-uk-goods-sent-from-abroad',
    'c4-ec-eori',
    'c4-ec-low-value-consignments',
    'c4-ec-oss-schemes',
    'c4-ec-eur3-duty-low-value-parcels',
    'icc-incoterms-2020',
    'w4-wco-hs',
    'b3-ec-taric',
    'trade-gov-commercial-invoice',
  ],
  primaryTool: '/tools/invoice-generator',
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Make one invoice your UK or EU buyer’s agent can declare from',
    text: 'The commercial invoice generator lays out the parties, EORI numbers, goods lines, commodity codes you enter, values, currency, origin and Incoterms® rule on one page.',
  },
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/landed-cost-calculator', '/tools/incoterms'],
  related: [
    '/blog/uk-import-duty',
    '/guides/eori-number',
    '/blog/postponed-vat-accounting',
    '/guides/uk-commodity-codes',
    '/blog/taric-and-cn-codes',
    '/guides/how-to-export-from-the-us',
  ],
  cover: {
    id: 'Zuxxq0iHkN4',
    src: 'https://images.unsplash.com/photo-1562892302-97faedd66f1c',
    width: 5758,
    height: 3839,
    alt: 'Aerial view of stacked freight containers at the port of Barcelona',
    caption: 'Containers stacked at the port of Barcelona',
    photographer: { name: 'Olga Subach', profile: 'https://unsplash.com/@create4eyes' },
    page: 'https://unsplash.com/photos/aerial-view-photo-of-freight-containers-Zuxxq0iHkN4',
  },
};

export default article;
