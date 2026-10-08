import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "who pays import duties" 90, KD 26;
 * "who pays customs duties" 20.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C.
 */
const article: ContentArticle = {
  slug: 'who-pays-import-duties',
  title: 'Who pays import duties: the buyer, the seller or the importer?',
  metaTitle: 'Who pays import duties? Law vs Incoterms',
  description:
    'Who owes import duty to US customs, how the Incoterms rule shifts the cost between buyer and seller, what DDP asks of a foreign seller, and how to show it on the invoice.',
  lede: 'Two different questions hide behind “who pays the duty?”. One is legal: who owes the money to customs. The other is commercial: which side of the sale ends up carrying the cost. They often have different answers, and mixing them up is how a seller ends up with an unexpected bill.',
  answer:
    'In the United States, the importer of record owes import duties to CBP: under 19 CFR 141.1 the duty is the importer’s personal debt. Who bears the cost between buyer and seller is set by the sale contract. Under the Incoterms® 2020 rules the buyer clears imports and pays duty, except under DDP, where the seller does.',
  keyFacts: [
    'Under 19 CFR 141.1, liability for US import duties is a personal debt of the importer, and paying a broker who fails to pay CBP does not discharge it.',
    'Under 19 CFR 141.1, a customs bond protects the revenue and does not relieve the importer of its liabilities.',
    'HMRC’s guidance on the Incoterms® 2020 rules says that under DDP the seller clears the goods for import and pays any import duty.',
    'Under 19 CFR 141.18, a nonresident corporation making entry needs a resident agent for service of process and a bond with a resident corporate surety.',
    'Under 19 U.S.C. 1401a, US duties and federal taxes payable on importation are not part of the transaction value when identified separately from the price.',
  ],
  definitions: [
    {
      term: 'Importer of record',
      meaning:
        'The party that makes entry with CBP and is liable for the entry and the duties on it.',
    },
    {
      term: 'DDP (Delivered Duty Paid)',
      meaning:
        'The Incoterms® 2020 rule under which the seller delivers the goods cleared for import, paying import duty and carrying out import formalities.',
    },
    {
      term: 'Import duty',
      meaning:
        'The tax charged on goods when they enter a customs territory, at the rate set for their tariff classification.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Who owes import duty to customs?',
      paragraphs: [
        'The importer. In the United States, 19 CFR 141.1 says the liability for duties attaching on importation is a personal debt due from the importer to the United States, discharged only by payment in full. The importer can pay CBP directly or through a licensed customs broker, but if the broker takes the money and fails to pay, the importer still owes it.',
        'Two more rules in the same section make the point. A customs bond is delivered only to protect the revenue, and it does not relieve the importer of its liabilities. The duty is also a lien on the goods themselves, which CBP can enforce while the goods are in its custody or under its control. Other countries set their own rules on who is liable, so check the importing country’s customs authority.',
      ],
    },
    {
      heading: 'Why can the seller end up paying?',
      paragraphs: [
        'Because the sale contract can move the cost even though it cannot move the legal debt. The ITA’s guide to Incoterms® explains that each rule states which party carries out the customs formalities for import, obtains any import licence, and bears the cost of those tasks. A seller who agrees to deliver with duty paid has promised to carry that cost, and often to be the importer.',
        'Two questions therefore come before a quote. Who will be the importer of record, and who will pay the duty, taxes and clearance charges? Under most rules both answers are the buyer. Under DDP both are usually the seller, which is why a delivered price needs a landed cost calculation behind it.',
      ],
    },
    {
      heading: 'Which Incoterms rule makes the seller pay import duty?',
      paragraphs: [
        'Only DDP. Under the ICC’s Incoterms® 2020 rules, import clearance and import duty fall to the buyer under the other ten rules, including DAP and DPU, where the seller delivers at the destination but the goods are not cleared for import. HMRC’s summary of DDP says the seller must clear the goods for export and import, pay any duty for both, and carry out all customs formalities.',
      ],
      table: {
        caption: 'Import clearance and import duty under the Incoterms® 2020 rules',
        head: ['Rule', 'Who clears for import', 'Who pays import duty'],
        rows: [
          ['EXW, FCA, FAS, FOB', 'Buyer', 'Buyer'],
          ['CFR, CIF, CPT, CIP', 'Buyer', 'Buyer'],
          ['DAP, DPU', 'Buyer', 'Buyer'],
          ['DDP', 'Seller', 'Seller'],
        ],
      },
    },
    {
      heading: 'What does DDP ask of a seller importing into the US?',
      paragraphs: [
        'Usually that the seller, or an agent it appoints, acts as importer of record. Under 19 CFR 141.18, a nonresident corporation making entry must have a resident agent in the state of entry authorised to accept service of process, and a bond on CBP Form 301 with a resident corporate surety. Under 19 CFR 142.4, goods are not released at entry without a bond unless the limited waiver applies.',
        'It also means the duty becomes the seller’s debt, with everything 19 CFR 141.1 attaches to it. If that is more than you want to take on, DAP keeps delivery at the buyer’s door while leaving import clearance and duty with the buyer. The guide on DAP vs DDP compares the two in detail.',
      ],
    },
    {
      heading: 'When do US import duties become payable?',
      paragraphs: [
        'They accrue on arrival. Under 19 CFR 141.1(a), duties and the liability to pay them accrue when the importing vessel arrives in a port with the intent to unload, or when goods arriving another way enter the US customs territory. Under 19 CFR 142.12, estimated duties are deposited with the entry summary, which is filed within 10 working days after the time of entry when it was not filed at entry.',
        'The rate itself comes from the Harmonized Tariff Schedule; CBP’s guidance says the HTS gives the rate and CBP makes the final determination. Do not quote a buyer a rate from memory or an old entry.',
      ],
    },
    {
      heading: 'Can the buyer refuse the goods and the duty?',
      paragraphs: [
        'Only in a narrow case. Under 19 CFR 141.1(f), a person to whom goods are consigned without their authority has no liability for the duty if they refuse them, and the goods are treated as unclaimed. That covers unordered goods, not a buyer who ordered them and then dislikes the duty bill.',
        'Disputes about who should have paid are contract disputes between buyer and seller. The way to avoid them is to agree the rule, the named place and the importer before shipping, and write them on the proforma and the commercial invoice.',
      ],
    },
    {
      heading: 'How should the invoice show who pays the duty?',
      paragraphs: [
        'Name the rule and make the price structure visible. These steps help the broker and the buyer read the deal the same way.',
      ],
      steps: [
        'State the Incoterms® 2020 rule with its named place, for example “DAP Chicago, Incoterms® 2020”, on the proforma and commercial invoice.',
        'Name the importer of record, or say who will act as importer, where the buyer’s broker needs it.',
        'Under DDP, show any US duty and tax you include separately from the price of the goods, since 19 U.S.C. 1401a excludes them from transaction value when identified separately.',
        'Show freight and insurance separately from the goods so the importer can see what is in the price.',
        'Use a landed cost estimate before you quote a delivered price, with the duty rate checked in the current tariff.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does the buyer or the seller pay customs duty under DAP?',
      a: 'The buyer. Under DAP the seller delivers at the named destination ready for unloading, but import clearance and import duty remain with the buyer under the Incoterms® 2020 rules.',
    },
    {
      q: 'If the seller agreed to pay duty, can CBP still bill the importer?',
      a: 'Yes. Under 19 CFR 141.1, the duty is the importer’s personal debt to the United States. A contract between buyer and seller decides who reimburses whom, not who CBP can collect from.',
    },
    {
      q: 'Does a customs broker pay the duty?',
      a: 'A broker may transmit payment for the importer under 19 CFR 141.1(b)(3), but the liability stays with the importer. If the broker fails to pay CBP, the importer still owes the duty.',
    },
    {
      q: 'Who pays duty on a gift or sample sent abroad?',
      a: 'The same rules apply: the importer owes the duty unless an exemption covers the goods, and the parties can agree who bears it. Samples still need a fair customs value on the invoice.',
    },
    {
      q: 'Can I find the duty rate for my product here?',
      a: 'No. TradeDocs does not classify goods or quote rates. The importer looks up the rate in the importing country’s official tariff, which in the US is the Harmonized Tariff Schedule.',
    },
  ],
  sources: [
    'c2-cfr-19-141-1',
    'a5-cfr-19-141-18',
    'a5-cfr-19-142-4',
    'a3-ecfr-19-cfr-142-12',
    'c2-usc-19-1401a',
    'w3-cbp-duty-rates',
    'icc-incoterms-2020',
    'w1-hmrc-incoterms',
    'w1-ita-know-your-incoterms',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/landed-cost-calculator', '/tools/proforma-invoice-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/landed-cost-calculator',
    title: 'Price DDP with the duty in view',
    text: 'The landed cost calculator adds freight, insurance and a duty rate you enter from the official tariff, so a delivered price shows what the seller is taking on.',
  },
  related: [
    '/guides/importer-of-record',
    '/guides/dap-vs-ddp',
    '/blog/fob-vs-ddp',
    '/blog/how-to-calculate-import-duty',
    '/guides/landed-cost',
    '/blog/brokerage-fees-and-duties-on-courier-shipments',
  ],
  cover: {
    id: 'zR7nFjjIAWE',
    src: 'https://images.unsplash.com/photo-1725258080098-727051947997',
    width: 3000,
    height: 2001,
    alt: 'A calculator resting on banknotes and receipts, the sums behind who carries the import duty',
    caption: 'A calculator on a pile of banknotes and receipts',
    photographer: { name: 'Jakub Żerdzicki', profile: 'https://unsplash.com/@jakubzerdzicki' },
    page: 'https://unsplash.com/photos/a-calculator-sitting-on-top-of-a-pile-of-money-zR7nFjjIAWE',
  },
};

export default article;
