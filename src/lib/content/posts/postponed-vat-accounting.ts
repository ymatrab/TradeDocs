import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google UK, 2026-10-06): "postponed vat accounting" 1,000, KD 1;
 * "import vat" 590.
 * Plan: docs/research/content-plan-v3-2026-10-07.md (v2 #50), wave B.
 * Every rule is from HMRC's GOV.UK guidance, opened 2026-10-07 (PVA page last updated
 * 16 June 2025). The VAT rate and duty in the worked example are invented placeholders.
 * Written for the exporter whose UK buyer imports the goods; never tells a reader what their
 * own VAT position is.
 */
const article: ContentArticle = {
  slug: 'postponed-vat-accounting',
  title: 'Postponed VAT accounting: how UK import VAT works for your buyer',
  metaTitle: 'Postponed VAT accounting (PVA): UK import VAT',
  description:
    'How postponed VAT accounting lets a UK VAT-registered importer declare and reclaim import VAT on one return, who can use it, and what it changes for the exporter.',
  lede: 'When your goods reach a UK customer, someone pays UK import VAT. If that customer is registered for VAT, HMRC lets them account for it on their VAT Return instead of paying it at the border. Knowing how that works helps you quote, choose the Incoterms® rule and give the forwarder the right instructions.',
  answer:
    'Postponed VAT accounting (PVA) lets a UK VAT-registered business declare import VAT and reclaim it on the same VAT Return, instead of paying it when the goods arrive and recovering it later. HMRC needs no approval for it. The importer selects it on the import declaration and enters their VAT registration number.',
  keyFacts: [
    'HMRC describes postponed VAT accounting as declaring and recovering import VAT on the same VAT Return, rather than paying it upfront at import.',
    'HMRC says a business must be registered for VAT in the UK to use postponed VAT accounting, and needs no approval to do so.',
    'PVA covers goods imported into Great Britain from anywhere outside the UK, and into Northern Ireland from outside the UK and EU, according to HMRC.',
    'HMRC sets the value for VAT on imports as the customs value plus incidental costs such as transport and insurance to the first UK destination, plus any duty and other import charges.',
    'Since HMRC’s update of 9 June 2025, anyone importing on a business’s behalf must have that business’s written instruction before using PVA on the declaration.',
  ],
  definitions: [
    {
      term: 'Import VAT',
      meaning:
        'VAT charged when goods enter the UK from abroad, normally at the same rate as on the same goods sold in the UK.',
    },
    {
      term: 'Postponed import VAT statement',
      meaning:
        'The monthly online statement from HMRC showing the import VAT a business accounted for through PVA.',
    },
    {
      term: 'Input tax',
      meaning: 'VAT a registered business has paid or accounted for and may reclaim, subject to the normal rules.',
    },
    {
      term: 'C79 certificate',
      meaning:
        'HMRC’s monthly import VAT certificate for VAT paid through a duty deferment account, not through PVA.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is postponed VAT accounting?',
      paragraphs: [
        'It is a way for a UK VAT-registered importer to deal with import VAT on paper rather than in cash at the border. HMRC’s guidance puts it plainly: the business declares the import VAT and recovers it on the same VAT Return, rather than paying it upfront when the goods are imported and recovering it later. The normal rules on what can be reclaimed as input tax still apply.',
        'HMRC first published the guidance in July 2020 and clarified in August 2021 that PVA would be available permanently. In June 2025 it removed the section on when PVA was mandatory, so it is now a choice. An importer can instead pay import VAT at importation or, if they are a regular importer, defer it through a duty deferment account, which HMRC says needs a bank guarantee.',
      ],
    },
    {
      heading: 'Who can use postponed VAT accounting?',
      paragraphs: [
        'A business registered for VAT in the UK, importing goods for its business. HMRC lists two conditions: the goods are for use in the business and the importer has the right to dispose of them, usually as the owner; and the importer’s VAT registration number is on the import declaration.',
        'It applies to goods brought into Great Britain from anywhere outside the UK, and into Northern Ireland from outside the UK and the EU. There are exceptions. HMRC says a business cannot use PVA for postal consignments over £135 delivered by Royal Mail Group, including Parcelforce when it is not acting as an express operator, and that consignments of £135 or less follow separate rules. Goods coming out of a customs special procedure, such as customs warehousing or inward processing, can use PVA on the declaration that releases them into free circulation.',
      ],
    },
    {
      heading: 'How is UK import VAT calculated?',
      paragraphs: [
        'On more than the price of the goods. HMRC sets the value for VAT of imported goods as their customs value plus incidental expenses, such as commission, packing, transport and insurance up to the goods’ first destination in the UK, plus any customs duty, levy, excise duty or other charge payable on importation, except the VAT itself. Import VAT is normally charged at the same rate as a UK supply of the same goods.',
        'PVA does not change the amount. It changes when and how the importer accounts for it. The worked example uses invented figures and placeholder rates; the real rates depend on the goods, and the landed cost calculator lets you plug in your own.',
      ],
      table: {
        caption:
          'Worked example with invented figures: value for VAT on one import into Great Britain',
        head: ['Line', 'Amount (invented)'],
        rows: [
          ['Customs value of the goods', '£10,000'],
          ['Transport and insurance to the first UK destination, if not already in the customs value', '£600'],
          ['Customs duty at an invented 4% placeholder rate', '£424'],
          ['Value for VAT', '£11,024'],
          ['Import VAT at an invented 20% placeholder rate', '£2,204.80'],
          ['Paid at the border under PVA', '£0, declared and reclaimed on the VAT Return'],
        ],
      },
    },
    {
      heading: 'How does PVA work on the declaration and the VAT Return?',
      paragraphs: [
        'It runs through three documents: the import declaration, HMRC’s monthly statement and the importer’s VAT Return. HMRC’s guidance sets out each step.',
      ],
      steps: [
        'The importer, or the agent acting for them, selects on the import declaration that import VAT will be accounted for on the VAT Return; HMRC says the choice cannot be changed once the declaration is submitted.',
        'The importer’s VAT registration number goes at header level in Data Element 3/40, and method of payment G is not used in Data Element 4/8.',
        'HMRC records the VAT against the importer’s EORI number and shows it on a monthly postponed import VAT statement in the Customs Declaration Service, usually by the 10th working day of the following month.',
        'The importer downloads and keeps each statement; HMRC says they can be accessed for 6 months from publication.',
        'On the VAT Return for the period that covers the import date, the importer puts the postponed import VAT in Box 1, the amount reclaimed in Box 4 and the value of the imports, excluding VAT, in Box 7.',
      ],
    },
    {
      heading: 'What does PVA change for you as the exporter?',
      paragraphs: [
        'Mostly who does what, which the Incoterms® 2020 rule decides. Under rules such as FCA, CIF or DAP, the buyer is responsible for import clearance, so the buyer, or their agent, chooses PVA on their own declaration. Your part is a commercial invoice whose values the declaration can rely on.',
        'If you arrange the import yourself, for example under DDP, or deliver through a forwarder you appoint, HMRC’s guidance asks the UK buyer to agree with you how import VAT will be accounted for, so that you can give the person making the declaration written instructions, and to give you their EORI number. Those instructions must be in place before the declaration is made, and both sides should keep a written record. HMRC also notes that a person with no UK establishment needs someone to deal with customs for them, and that PVA itself is only open to businesses registered for VAT in the UK.',
      ],
    },
    {
      heading: 'What if your UK buyer is not registered for VAT?',
      paragraphs: [
        'They cannot use PVA. HMRC says a UK trader who is not VAT-registered still has to pay import VAT and will not be able to reclaim it, so the VAT is a real cost for that buyer, not a timing difference.',
        'That matters when you quote. A delivered price to a private or unregistered buyer has to carry, or clearly exclude, import VAT and duty, and the buyer will judge your price on the total. The guide to landed cost shows how those charges add up, and the guide to DAP vs DDP explains who pays them under each rule.',
      ],
    },
    {
      heading: 'Where do imports go missing from the PVA statement?',
      paragraphs: [
        'Usually at the declaration. HMRC suggests that a business with an entry missing from its statement check whether it appears on a group member’s statement, and, if an agent made the declaration, ask the agent to confirm the import VAT was allocated to the correct EORI number. Both checks lead back to the identifiers on the declaration, so put your buyer’s name, EORI and VAT numbers on your invoice exactly as they give them.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is postponed VAT accounting mandatory?',
      a: 'No. HMRC removed the section on when it was mandatory in June 2025. A VAT-registered importer can choose PVA, pay at import or use a duty deferment account.',
    },
    {
      q: 'Can a business outside the UK use PVA?',
      a: 'Only if it is registered for VAT in the UK. HMRC says a person with no UK establishment also needs someone to deal with customs and complete the import declaration for them.',
    },
    {
      q: 'What is the difference between a C79 and a PVA statement?',
      a: 'HMRC issues the C79 certificate for import VAT paid through a duty deferment account. Import VAT accounted for through PVA appears on the monthly postponed import VAT statement instead.',
    },
    {
      q: 'Does PVA reduce the import VAT due?',
      a: 'No. The value for VAT and the rate are the same. PVA changes when the VAT is accounted for, so a registered importer does not pay it at the border and reclaim it later.',
    },
    {
      q: 'Can PVA be used if the customs value is not yet known?',
      a: 'HMRC says yes: the importer applies for a general guarantee account to cover the unknown part and uses PVA for the amount that is known.',
    },
  ],
  sources: [
    'b4-gov-uk-pva',
    'b4-gov-uk-pva-vat-return',
    'b4-gov-uk-pva-statement',
    'b4-gov-uk-import-vat',
    'b4-gov-uk-c79',
    'w5-gov-uk-eori',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/invoice-generator', '/tools/incoterms'],
  callout: {
    afterSection: 2,
    tool: '/tools/landed-cost-calculator',
    title: 'Work out the VAT your UK buyer will account for',
    text: 'Enter the goods value, freight, insurance and your own duty and VAT rates to see the value for VAT and the total landed cost.',
  },
  related: [
    '/guides/landed-cost',
    '/blog/how-to-calculate-import-duty',
    '/guides/dap-vs-ddp',
    '/guides/eori-number',
    '/guides/importer-of-record',
    '/blog/fob-vs-ddp',
  ],
  cover: {
    id: 'Ae8vUq1RLj8',
    src: 'https://images.unsplash.com/photo-1695072798279-5250cc0e053e',
    width: 7008,
    height: 4672,
    alt: 'A large cargo ship at sea carrying goods that will owe import VAT when they arrive',
    caption: 'A large cargo ship at sea',
    photographer: { name: 'BEN ELLIOTT', profile: 'https://unsplash.com/@benjaminelliott' },
    page: 'https://unsplash.com/photos/a-large-cargo-ship-in-the-middle-of-a-body-of-water-Ae8vUq1RLj8',
  },
};

export default article;
