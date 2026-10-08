import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'duty-deferment-account',
  term: 'Duty deferment account (DDA)',
  abbreviation: 'DDA',
  aliases: ['deferment account', 'deferment approval number', 'DAN', 'duty deferment'],
  demand: {
    keyword: 'duty deferment account',
    market: 'UK',
    volume: 260,
    kd: 6,
    dataFile: '06-labs-keyword-overview-uk-candidates.json',
  },
  metaTitle: 'Duty deferment account: paying UK import duty',
  description:
    'What a UK duty deferment account is, which import charges it covers, why a guarantee or waiver is needed, how the deferment approval number is used on declarations, and how agents use it.',
  shortDefinition:
    'A duty deferment account is an HMRC account that lets an importer, or someone representing it, pay import charges for a whole month in one Direct Debit instead of paying for each consignment before the goods are released.',
  definition: [
    'Without one, import duty and VAT are due shipment by shipment, and goods can wait until the payment clears. With one, HMRC releases the goods and collects the month’s total later. GOV.UK says the account can cover customs duty, excise duties and import VAT, and duties on goods released from an excise warehouse. Import VAT is left out if the business uses postponed VAT accounting, which puts that VAT on the VAT return instead.',
    'The account is backed by security. Unless HMRC approves a guarantee waiver, the applicant needs a guarantee from a UK-established financial institution regulated by the Prudential Regulation Authority. Waivers are only open to businesses established in the UK; a business established outside the UK can still have an account for use in Great Britain, but not a waiver.',
    'On approval HMRC issues a deferment approval number, the DAN. The account becomes active only once a Direct Debit Instruction is in place, even if the importer does not plan to use it straight away.',
  ],
  onYourDocuments: [
    'The DAN appears on the import declaration, not on the commercial invoice. The broker enters it as the method of payment, either the importer’s own DAN or, with authority set up on the Customs Declaration Service, its own account used for the client.',
    'For an exporter selling DDP into the UK this matters directly: you or your agent need a way to pay the charges at import. Agree in writing whose DAN will be used, and put the importer’s EORI and the Incoterms® rule on the invoice so the broker can match the declaration to the account.',
  ],
  example: {
    caption: 'Worked example with invented parties',
    paragraphs: [
      'Thistle & Thread (invented), a fabric wholesaler in Glasgow, imports from Portugal, India and the United States most weeks. Paying duty and VAT on each arrival was holding containers at the port, so it applied for a duty deferment account with a bank guarantee and received a DAN.',
      'Its broker now quotes that DAN on every declaration, and HMRC collects the month’s duty by Direct Debit. Thistle & Thread uses postponed VAT accounting, so import VAT goes on its VAT return rather than through the account.',
    ],
  },
  confusedWith: [
    {
      term: 'Postponed VAT accounting',
      difference:
        'Postponed VAT accounting moves import VAT onto the VAT return and needs no guarantee. A duty deferment account delays payment of duty, and of VAT not postponed, to a monthly Direct Debit.',
    },
  ],
  related: [
    '/blog/postponed-vat-accounting',
    '/blog/uk-import-duty',
    '/guides/eori-number',
    '/guides/landed-cost',
  ],
  tool: '/tools/landed-cost-calculator',
  toolPitch:
    'The landed cost calculator separates duty and import VAT, so you can see what a deferment account will collect each month and what goes on the VAT return.',
  faq: [
    {
      q: 'Do I need a guarantee for a duty deferment account?',
      a: 'Usually yes: a guarantee from a UK-established, PRA-regulated financial institution, unless HMRC approves a guarantee waiver. Only businesses established in the UK can get a waiver.',
    },
    {
      q: 'Can a customs agent use its own duty deferment account for my imports?',
      a: 'Yes, if it agrees to. GOV.UK lets the importer or someone representing it make the payment, and authority to use a deferment approval number is set up on the Customs Declaration Service.',
    },
  ],
  sources: ['d5-gov-uk-duty-deferment', 'b4-gov-uk-pva'],
  regulated: true,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
