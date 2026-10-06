import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "ddp vs ddu" 320, KD 6; "ddu vs ddp" 260, KD 3;
 * "ddu meaning" 260, KD 5.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1. Carrier pages on "DDU" could not
 * be retrieved on 2026-10-06 (access denied or script-rendered), so no carrier practice is stated.
 */
const article: ContentArticle = {
  slug: 'ddp-vs-ddu',
  title: 'DDP vs DDU: what DDU means now that it has left the rules',
  metaTitle: 'DDP vs DDU: DDU meaning and what replaced it',
  description:
    'DDU was removed from the Incoterms rules in 2010 and DAP took its place. What DDU and DDP mean, who pays import duty under each, and what to write on an invoice today.',
  lede: 'DDU still turns up on quotations and in conversations about parcels, usually set against DDP: one where the receiver pays the import duty, one where the seller does. The pairing is easy to understand. The trouble is that only one of the two is a current Incoterms® rule, and an invoice that names the other leaves the terms open to argument.',
  answer:
    'DDU (Delivered Duty Unpaid) was an Incoterms® rule under which the seller delivered to the destination and the buyer paid the import duties. The ICC removed it in Incoterms® 2010 and added DAP, which covers the same idea. Under DDP (Delivered Duty Paid) the seller delivers, clears the goods for import and pays the duties.',
  keyFacts: [
    'The ICC’s Incoterms® rules history records that Incoterms® 2010 removed DAF, DES, DEQ and DDU and added DAT and DAP.',
    'DDP remains one of the eleven Incoterms® 2020 rules; DDU is not among them.',
    'HMRC’s guidance says that under DDP the seller must clear the goods for export and for import and pay any duty for both.',
    'Under DAP, the seller delivers when the goods are at the buyer’s disposal on the arriving means of transport, ready for unloading, at the named destination.',
    'The International Trade Administration says parties may agree an earlier Incoterms® version if they clearly name it.',
  ],
  definitions: [
    {
      term: 'DDU (Delivered Duty Unpaid)',
      meaning:
        'A former Incoterms® rule, withdrawn in 2010, in which the seller delivered to the destination and the buyer paid the import duty.',
    },
    {
      term: 'DDP (Delivered Duty Paid)',
      meaning:
        'The seller delivers the goods cleared for import at the named destination and pays the import duties and taxes.',
    },
    {
      term: 'DAP (Delivered at Place)',
      meaning:
        'The seller delivers at the named destination, ready for unloading; the buyer clears the goods for import and pays the duties.',
    },
    {
      term: 'Importer of record',
      meaning:
        'The party responsible to the importing country’s customs for the entry and the duties owed on it.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does DDU mean?',
      paragraphs: [
        'DDU stands for Delivered Duty Unpaid. It was a rule in earlier editions of the Incoterms® rules: the seller delivered the goods to the named place in the buyer’s country, and, as the name says, the import duty stayed unpaid by the seller and fell to the buyer.',
        'The ICC’s own history of the rules records what happened next. Incoterms® 2010 consolidated the D-family, removing DAF (Delivered at Frontier), DES (Delivered Ex Ship), DEQ (Delivered Ex Quay) and DDU, and adding DAT (Delivered at Terminal) and DAP (Delivered at Place). Incoterms® 2020 kept DAP and renamed DAT as DPU, Delivered at Place Unloaded.',
      ],
    },
    {
      heading: 'What is the difference between DDP and DDU?',
      paragraphs: [
        'The difference is who handles import clearance and pays the import duties and taxes. Under DDP the seller does both. HMRC’s customs valuation guidance describes DDP as delivery cleared for import, with the seller bearing all costs and risks to the destination and obliged to clear the goods for export and import, pay the duty for both and carry out all customs formalities.',
        'Under DDU the seller delivered but left the import duty to the buyer. Today that arrangement is expressed with DAP. The table sets the three side by side; the DDU column says only what its name and its withdrawal establish, and the 2000 edition holds the detail.',
      ],
      table: {
        caption: 'DDU, DAP and DDP compared',
        head: ['', 'DDU', 'DAP', 'DDP'],
        rows: [
          ['In the Incoterms® 2020 rules', 'No, removed in 2010', 'Yes', 'Yes'],
          ['Seller delivers to the named destination', 'Yes', 'Yes', 'Yes'],
          ['Import duties paid by', 'Buyer', 'Buyer', 'Seller'],
          ['Import clearance', 'See the edition named', 'Buyer', 'Seller'],
          ['Unloading at destination', 'See the edition named', 'Buyer', 'Buyer'],
          ['Use for a new contract', 'Replaced by DAP', 'Yes', 'Yes'],
        ],
      },
    },
    {
      heading: 'What does DDP add for the seller?',
      paragraphs: [
        'DDP adds the whole import side. The seller has to be able to clear the goods through the importing country’s customs, pay the import duties and any import taxes, and carry out the formalities there. That often means appointing a customs broker in that country, holding any registrations the country requires and paying duty and tax before the buyer pays you.',
        'Registrations are the step most easily overlooked. In the UK, for example, HMRC says a business based outside the UK that supplies goods there must register for VAT whatever its turnover. Other countries have their own rules, so check the importing country before you offer DDP.',
      ],
    },
    {
      heading: 'Can you still use DDU on an invoice?',
      paragraphs: [
        'You can, but only as a reference to an older edition. The International Trade Administration notes that contracts using any Incoterms® version are valid if the parties agree and the version is correctly identified on the export documents, so “DDU Lyon, Incoterms® 2000” is a legitimate term between willing parties. Without a version, DDU points at no current rule.',
        'For a new contract there is little reason to do it. DAP describes the same split of duties and is in the current rules, which means the buyer’s bank, forwarder and customs broker can read it against the 2020 text they already use.',
      ],
    },
    {
      heading: 'What do people mean by DDU on parcel shipments?',
      paragraphs: [
        'On parcels, DDU is often used loosely to mean “the receiver pays the import duties and taxes on arrival”, as opposed to DDP, “the shipper pays them”. That plain-language use is about who receives the duty bill, not a reference to the withdrawn rule and its delivery obligations.',
        'If a carrier, platform or customer uses the label, ask what it covers: who pays duties and import taxes, who pays any clearance or disbursement fees the carrier adds, and what happens if the receiver refuses to pay. Then write the sales term as DAP or DDP with the named place, and set the carrier’s billing option to match. The two should say the same thing.',
      ],
    },
    {
      heading: 'Should you choose DAP or DDP instead of DDU?',
      paragraphs: [
        'Choose DAP when the buyer can act as importer and pay the duties, which is the old DDU split. Choose DDP only when you can carry out import clearance in the buyer’s country and pay its duties and taxes, which may require registrations there. Our guide to DAP vs DDP covers the risks of each, and the article on FOB vs DDP explains what DDP adds to a quotation.',
      ],
      steps: [
        'Find where DDU appears: quotations, proformas, invoices, carrier account settings or marketplace listings.',
        'Agree with the buyer who will be importer and who pays duties and taxes.',
        'Replace DDU with DAP or DDP, the named place and the version, for example “DAP Lyon, buyer’s warehouse, Incoterms® 2020”.',
        'Set the carrier’s duty billing option to match the term, so the receiver is not billed for duties the seller agreed to pay, or the reverse.',
        'Estimate the duties and taxes before quoting DDP, because they become part of your price.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is DDU still a valid Incoterm?',
      a: 'Not in the current rules. The ICC removed it in Incoterms® 2010. Parties can still agree to use an earlier edition if they name it, but DAP is the current rule for the same split.',
    },
    {
      q: 'Who pays import duty under DDU?',
      a: 'The buyer. That was the defining feature of the rule, and it is the same under DAP today.',
    },
    {
      q: 'Is DAP the same as DDU?',
      a: 'DAP replaced DDU in 2010 and keeps import clearance and duties with the buyer. Its wording is from the current rules, so check the 2020 text rather than assuming every detail of DDU carried over.',
    },
    {
      q: 'Why would a seller offer DDP on parcels?',
      a: 'So the receiver pays nothing on delivery. The seller then has to pay the duties and taxes and, in some countries, register there to do so.',
    },
    {
      q: 'What happens if the receiver refuses to pay duties on a DAP parcel?',
      a: 'It depends on the carrier’s terms of carriage, which may bill the shipper or return the goods. Check the carrier’s terms before you ship.',
    },
  ],
  sources: [
    'w1-icc-incoterms-history',
    'icc-incoterms-2020',
    'w1-hmrc-incoterms',
    'w1-ita-know-your-incoterms',
    'w1-gov-uk-register-for-vat',
  ],
  primaryTool: '/tools/incoterms',
  tools: ['/tools/incoterms', '/tools/landed-cost-calculator', '/tools/invoice-generator'],
  callout: {
    afterSection: 1,
    tool: '/tools/incoterms',
    title: 'Read DAP and DDP in the current rules',
    text: 'The Incoterms® 2020 guide has a page for each delivered rule, with where risk passes and who pays the import duties and taxes.',
  },
  related: ['/guides/dap-vs-ddp', '/blog/fob-vs-ddp', '/blog/commercial-invoice-requirements'],
  cover: {
    id: 'efgpRGeu9tg',
    src: 'https://images.unsplash.com/photo-1614018453562-77f6180ce036',
    width: 6000,
    height: 4000,
    alt: 'Cardboard parcel left beside a front door, the delivery where DDU or DDP decides who has paid the duty',
    caption: 'A cardboard parcel beside a white wooden door',
    photographer: { name: 'MealPro', profile: 'https://unsplash.com/@mealpro' },
    page: 'https://unsplash.com/photos/brown-cardboard-box-beside-white-wooden-door-efgpRGeu9tg',
  },
};

export default article;
