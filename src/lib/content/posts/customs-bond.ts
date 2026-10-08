import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "customs bond" 880; "continuous bond" 210.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (v2 #49: single-entry vs
 * continuous bond, US importer view).
 */
const article: ContentArticle = {
  slug: 'customs-bond',
  title: 'Customs bond: single entry or continuous, and how CBP sets the amount',
  metaTitle: 'Customs bond: single entry vs continuous',
  description:
    'What a US customs bond is, why CBP will not release goods without one, how single transaction and continuous bonds differ, and how CBP sets the bond amount.',
  lede: 'A first-time US importer usually meets the customs bond when the broker asks which one to use. It is a small line on the entry, but goods do not leave CBP custody without it, and the choice between a one-off bond and an annual one depends on how often you import.',
  answer:
    'A customs bond is a contract in which a surety guarantees to CBP that an importer will pay duties, taxes and fees and meet entry requirements. Under 19 CFR 142.4, goods are not released at entry without one, subject to a limited waiver. A single transaction bond covers one entry; a continuous bond covers all entries for a year.',
  keyFacts: [
    'CBP’s bond guidance defines a bond as a performance contract between the principal and a surety, with CBP as the third-party beneficiary.',
    'Under 19 CFR 113.62, the principal and surety jointly and severally agree to deposit duties, taxes and charges when due and to pay any later found due.',
    'CBP’s February 2024 guidance sets the minimum continuous import bond at $50,000 or 10% of the duties, taxes and fees of the previous 12 months, whichever is greater.',
    'Under 19 CFR 113.12, only one continuous bond for a particular activity is authorised for each principal.',
    'Under 19 CFR 141.1, a customs bond protects the revenue and does not relieve the importer of its own liability for duties.',
  ],
  definitions: [
    {
      term: 'Principal',
      meaning:
        'The party, usually the importer of record, whose obligations the bond secures and who contracts with the surety.',
    },
    {
      term: 'Surety',
      meaning:
        'The company that guarantees the principal’s obligations to CBP; Form 3461 identifies it by a surety code for a company authorised by the Department of the Treasury.',
    },
    {
      term: 'Single transaction bond',
      meaning: 'A bond that secures one transaction or activity, such as one entry.',
    },
    {
      term: 'Continuous bond',
      meaning:
        'A bond that secures transactions over a one-year period, renews automatically on its anniversary and stays in force until terminated.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a customs bond?',
      paragraphs: [
        'It is a guarantee to CBP that an importer will meet its obligations. CBP’s guide to how it sets bond amounts describes a bond as a performance contract taken out by a party doing business with CBP, to protect the revenue and ensure compliance. The contract is between the principal and a surety, or the principal can secure it with cash in lieu of surety. CBP is the third-party beneficiary.',
        'For imports, the conditions are in 19 CFR 113.62, the basic importation and entry bond. The principal and surety agree, jointly and severally, to deposit duties, taxes and charges within the time allowed, to pay any additional amounts later found due on an entry, and to file or complete the entry for goods released before it was made. Other activities, such as international carriage or the Importer Security Filing, have their own activity codes in CBP’s bond guidance.',
      ],
    },
    {
      heading: 'Why does an importer need a customs bond?',
      paragraphs: [
        'Because CBP will not release goods without one. Under 19 CFR 142.4, merchandise is not released at entry unless a single entry or continuous bond on CBP Form 301 has been filed, subject to a limited waiver for some entries. Form 3461 records the bond type in block 2, its value in block 6 and the surety code in block 11.',
        'The bond does not take the debt away from the importer. Under 19 CFR 141.1, delivering a bond with an entry is solely to protect the revenue and does not relieve the importer of its liabilities.',
      ],
    },
    {
      heading: 'How do single transaction and continuous bonds differ?',
      paragraphs: [
        'One covers a single entry; the other covers a year of them. CBP’s guidance defines a continuous bond as securing transactions over a one-year period, renewing automatically on the anniversary of its effective date and remaining in effect until terminated. The table compares the two for basic importation and entry.',
      ],
      table: {
        caption:
          'Single transaction vs continuous import bonds (19 CFR 113.11–113.13 and CBP’s February 2024 bond guidance)',
        head: ['', 'Single transaction bond', 'Continuous bond'],
        rows: [
          [
            'Covers',
            'One transaction, such as one entry',
            'All covered transactions for a year, renewing automatically',
          ],
          [
            'Approved by',
            'The Revenue Division or the port director where filed',
            'The Revenue Division; one per activity for each principal',
          ],
          [
            'Usual amount',
            'Generally not less than the entered value plus duties, taxes and fees',
            '$50,000 or 10% of the previous 12 months’ duties, taxes and fees, whichever is greater',
          ],
          [
            'Application',
            'Identifies the value and nature of the goods in the transaction',
            'States the general character of the goods and the duties and taxes accrued in the previous calendar year',
          ],
          ['Fits', 'An occasional or one-off import', 'Regular imports through one or more ports'],
        ],
      },
    },
    {
      heading: 'How does CBP set the bond amount?',
      paragraphs: [
        'By formula, then by review. Under 19 CFR 113.13, no CBP bond may be less than $100 unless the law allows a lower amount, and CBP weighs the principal’s payment and compliance record, the value and nature of the goods and the supervision CBP will exercise. CBP’s February 2024 guidance turns that into figures for import bonds.',
        'For a continuous import bond, the minimum is $50,000 or 10% of the total estimated duties, taxes and fees in the previous 12 months, whichever is greater, set in increments of $10,000 up to $100,000 and of $100,000 above that. An importer with no imports in the previous year uses its estimate for the next 12 months, and the amount is never below $50,000. Informal entries under $2,500 are among the entry types the guidance leaves out of the calculation.',
        'For a single transaction import bond, the guidance says the amount is generally not less than the total entered value plus all duties, taxes and fees, with exceptions: 10% of entered value for unconditionally duty-free goods, and three times the value for restricted goods. Take an invented importer that paid $300,000 in duties, taxes and fees last year: 10% is $30,000, so the $50,000 minimum applies.',
      ],
    },
    {
      heading: 'What happens if the bond becomes too small?',
      paragraphs: [
        'CBP asks for more. Under 19 CFR 113.13(c), CBP periodically reviews each bond, notifies the principal and surety in writing if it is inadequate, and gives 15 days to remedy the deficiency. Where a bond is insufficient, CBP may require additional security, such as a cash deposit or a single transaction bond, for the principal’s transactions until the deficiency is fixed.',
        'Under 19 CFR 113.11, a principal with a continuous bond must also send an updated application within 30 days when the information it gave changes significantly, for example when the value or nature of its imports changes.',
      ],
    },
    {
      heading: 'How do you get a customs bond?',
      paragraphs: [
        'Through a surety, usually arranged by your customs broker. These are the steps CBP’s guidance and the regulations describe.',
      ],
      steps: [
        'Set up an ACE account: CBP’s guidance says any party that needs a bond must have one, created by filing CBP Form 5106.',
        'Decide between a single transaction bond for one entry and a continuous bond for regular imports.',
        'Give the surety or broker the general character of the goods and your duties and taxes for the past year, or an estimate if you are new.',
        'Have the surety file the bond on CBP Form 301, or transmit it electronically to ACE through eBond.',
        'Keep the bond number and surety code for the broker, who records them on the entry.',
      ],
    },
    {
      heading: 'Does a foreign seller ever need a US customs bond?',
      paragraphs: [
        'Only if it becomes the importer of record, which usually happens when it sells DDP. Under 19 CFR 141.18, a nonresident corporation making entry needs a resident agent authorised to accept service of process and a bond on CBP Form 301 with a resident corporate surety. Under DAP or any rule where the buyer clears the goods, the buyer’s bond covers the entry.',
        'Either way, the seller’s documents feed the amount. The entered value and the duties on your invoice are what a single transaction bond is sized against, so a complete invoice with prices, currency and charges shown helps the importer get the right bond first time.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a customs bond the same as paying duty?',
      a: 'No. The importer still deposits the duties itself. The bond guarantees that it will, and under 19 CFR 113.62 lets CBP recover unpaid amounts from the surety.',
    },
    {
      q: 'Can I pay cash instead of using a surety?',
      a: 'CBP’s guidance allows a bond to be secured by cash in lieu of surety. Its rules for when that is accepted, and for which activities, are in 19 CFR Part 113.',
    },
    {
      q: 'Can one importer hold two continuous import bonds?',
      a: 'No. Under 19 CFR 113.12(b), only one continuous bond for a particular activity is authorised for each principal.',
    },
    {
      q: 'Does an informal entry need a bond?',
      a: 'It depends on the entry. Form 3461 offers a “no bond required” option, 19 CFR 142.4 has a limited waiver, and CBP’s guidance leaves informal entries under $2,500 out of the continuous bond calculation. Ask the broker what applies.',
    },
    {
      q: 'Who sets the bond amount, the surety or CBP?',
      a: 'CBP sets the minimum it will accept, using 19 CFR 113.13 and its published guidance. The surety decides whether to write the bond and on what terms.',
    },
  ],
  sources: [
    'c2-cbp-bond-amounts-guide',
    'c2-cfr-19-113-11',
    'c2-cfr-19-113-12',
    'c2-cfr-19-113-13',
    'c2-cfr-19-113-62',
    'a5-cfr-19-142-4',
    'c2-cfr-19-141-1',
    'a5-cfr-19-141-18',
    'c2-cbp-form-3461',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/invoice-generator', '/tools/incoterms'],
  callout: {
    afterSection: 3,
    tool: '/tools/landed-cost-calculator',
    title: 'Estimate the duties your bond is sized on',
    text: 'Enter the goods value, freight, insurance and the rate from the official tariff; the landed cost calculator shows the duty and total, the figures a bond application asks you to estimate.',
  },
  related: [
    '/guides/importer-of-record',
    '/blog/cbp-form-3461',
    '/guides/how-to-import-into-the-us',
    '/blog/who-pays-import-duties',
    '/guides/isf-10-2',
    '/guides/freight-forwarder-vs-customs-broker',
  ],
  cover: {
    id: 'PLydcuGyTy4',
    src: 'https://images.unsplash.com/photo-1784915479350-65d68ad0b0dc',
    width: 5815,
    height: 3877,
    alt: 'Red and blue shipping containers stacked at a commercial port, waiting for release by customs',
    caption: 'Stacked red and blue shipping containers at a commercial port',
    photographer: { name: 'Julia Taubitz', profile: 'https://unsplash.com/@justmejuliee' },
    page: 'https://unsplash.com/photos/stacked-red-and-blue-shipping-containers-at-a-commercial-port-PLydcuGyTy4',
  },
};

export default article;
