import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'excise-duty',
  term: 'Excise duty',
  aliases: ['excise', 'excise tax', 'excise duties', 'duty-suspended goods'],
  demand: {
    keyword: 'excise duty',
    market: 'UK',
    volume: 880,
    kd: 13,
    dataFile: '06-labs-keyword-overview-uk-candidates.json',
  },
  metaTitle: 'Excise duty meaning: how it applies to imports',
  description:
    'What excise duty is, which goods carry it in the UK, how it differs from customs duty, and how imported excise goods are declared duty paid or moved under duty suspension.',
  shortDefinition:
    'Excise duty is a tax charged on particular goods, such as alcohol, tobacco and fuel, whether they are made at home or imported. On imports it is collected alongside customs duty and import VAT unless the goods move under duty suspension.',
  definition: [
    'Customs duty is a charge on crossing the border, set in the customs tariff. Excise is a tax on the product itself, so it applies to a bottle of gin distilled in London as much as to one shipped in from abroad. The World Customs Organization’s Revised Kyoto Convention reflects this by defining import duties and taxes widely: customs duties plus all other duties, taxes or charges collected on or in connection with importation. On an imported excise good, excise is one of those charges.',
    'In the UK, HMRC’s Excise Notice 196 lists the excise goods as alcohol, tobacco products, vaping products, and motor and heating fuels. They can be held in an HMRC-approved excise warehouse without the duty being paid; duty becomes payable when the goods are released from that suspension, or lost.',
    'For imports into Great Britain, HMRC describes three routes: release to free circulation and home use with customs duty, import VAT and excise all paid; a customs special procedure with all three suspended; or free circulation with excise alone suspended.',
  ],
  onYourDocuments: [
    'Excise has no box of its own on a commercial invoice. What the importer’s broker needs from you is what the charge is worked out on: a precise description, the commodity code, the quantity in the unit the tariff uses, and for drinks the volume and alcoholic strength stated per line.',
    'The route chosen appears on the import declaration as a customs procedure code. A duty-suspended movement onward to an excise warehouse is normally started by a registered consignor and recorded on the Excise Movement Control System (EMCS), so the warehouse details belong in the shipping instructions.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Cascade Ridge Cellars (invented), an Oregon winery, ships two pallets of wine to a London merchant. Its invoice lists each wine with bottle size, number of bottles, alcoholic strength and commodity code.',
      'The merchant does not want to pay excise on stock it will sell over months, so its broker declares the wine to free circulation with excise duty suspension. Customs duty and import VAT are dealt with at import, and a registered consignor moves the wine under EMCS to a bonded warehouse; excise falls due as cases are released for sale.',
    ],
  },
  confusedWith: [
    {
      term: 'Customs duty',
      difference:
        'Customs duty applies because goods cross the border and is set by the tariff. Excise applies because of what the goods are, so domestic production pays it too.',
    },
  ],
  related: ['/blog/uk-import-duty', '/blog/duty-vs-tariff', '/guides/landed-cost', 'customs-declaration'],
  tool: '/tools/landed-cost-calculator',
  toolPitch:
    'The landed cost calculator keeps excise as its own line beside freight, customs duty and VAT, so the figure your broker gives you lands in the right place.',
  faq: [
    {
      q: 'Is excise duty the same as import duty?',
      a: 'No. Import or customs duty is a border charge from the customs tariff. Excise is a tax on specific goods such as alcohol, tobacco and fuel, charged on domestic and imported goods alike, and on imports it is collected with the other import charges.',
    },
    {
      q: 'Can excise duty be delayed on imported goods?',
      a: 'Yes, under duty suspension. In Great Britain goods can be declared to free circulation with excise suspended and moved to an approved excise warehouse, with duty payable when they leave suspension.',
    },
  ],
  sources: ['d5-wco-rkc-duties-and-taxes', 'd5-hmrc-excise-notice-196', 'd5-hmrc-hmag70300'],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
