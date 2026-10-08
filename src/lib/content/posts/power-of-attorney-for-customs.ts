import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "power of attorney customs" 140, KD n/a.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (v2 #37: why brokers and
 * forwarders ask for one; US CBP Form 5291 and the FTR written authorization).
 */
const article: ContentArticle = {
  slug: 'power-of-attorney-for-customs',
  title: 'Power of attorney for customs: why your broker asks you to sign one',
  metaTitle: 'Customs power of attorney: Form 5291 and more',
  description:
    'Why customs brokers and forwarders ask for a power of attorney, what CBP Form 5291 covers, the export filing authorization, the UK equivalent, and how to revoke one.',
  lede: 'Before a customs broker files your first entry, or a forwarder files your export data, they send you a form to sign. It is a power of attorney: your written permission for them to deal with customs in your name. It is routine, but it is also a legal grant of authority, so it is worth knowing what you are signing.',
  answer:
    'A customs power of attorney is a written authorization that lets a broker or forwarder transact customs business in your name. In the US, CBP Form 5291 or a document with the same wording is used, and the broker must execute it directly with the importer of record. Exports and UK customs use their own written authorizations.',
  keyFacts: [
    'Under 19 CFR 141.32, Customs Form 5291 may be used to give power of attorney to transact customs business.',
    'CBP says a broker must execute a power of attorney directly with the importer of record, not through a freight forwarder or other unlicensed third party.',
    'Under 19 CFR 141.34, a power of attorney issued by a partnership is limited to 2 years; others may be granted for an unlimited period.',
    'Under 19 CFR 141.35, a power of attorney can be revoked at any time by written notice received by CBP.',
    'Under 15 CFR 30.3, a USPPI can authorize an agent to file Electronic Export Information through a power of attorney or written authorization.',
  ],
  definitions: [
    {
      term: 'Power of attorney (POA)',
      meaning:
        'A written grant of authority from a principal, such as an importer, allowing an agent to act for it in defined matters.',
    },
    {
      term: 'Importer of record',
      meaning:
        'The party responsible for an import entry with US customs, and the party that must sign the broker’s power of attorney.',
    },
    {
      term: 'CBP Form 5291',
      meaning:
        'The US customs power of attorney form named in 19 CFR 141.32, which can grant general or limited authority.',
    },
    {
      term: 'Direct and indirect representation',
      meaning:
        'The two ways an appointed agent can act for a trader with UK customs, which the written instructions must state.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a customs power of attorney?',
      paragraphs: [
        'It is your written permission for someone else to deal with customs in your name. A customs broker uses it to file entries, pay duties and answer CBP questions for your imports. A forwarder or broker uses a similar authorization to file export data for you.',
        'Without it, the agent has no authority to act. That protects you as much as the agent: it fixes who may make declarations that bind your business, and for what.',
      ],
    },
    {
      heading: 'Why does a customs broker need one before filing?',
      paragraphs: [
        'Because the regulations require it. CBP’s broker guidance says a broker must execute a power of attorney directly with the importer of record or drawback claimant, and not through a freight forwarder or other unlicensed third party. 19 CFR 111.36 sets out the same rule for brokers working with forwarders.',
        'CBP explains “directly” to mean that the importer of record must execute and sign the power of attorney itself. An agent may help, but may not sign or negotiate it in the importer’s place, and CBP says a freight forwarder may not assign a power of attorney to a broker on a client’s behalf. That is why your forwarder’s broker sends you its own form even when the forwarder already has your paperwork.',
        'CBP also tells brokers to examine the document carefully. Its page on validating powers of attorney asks brokers to complete them in person where possible and to check that the importer’s name, importer number and Employer Identification Number match what is in ACE, CBP’s trade system.',
      ],
    },
    {
      heading: 'What does CBP Form 5291 contain?',
      paragraphs: [
        'The principal, the agent and the scope of authority. 19 CFR 141.32 says Customs Form 5291 may be used to give power of attorney to transact customs business. If another document is used, it must be either a general power of attorney with unlimited authority or a limited one, executed in the same way as Form 5291. CBP’s broker guidance says it has not changed the standard wording in 19 CFR 141.32.',
        'The regulation includes a sample general power of attorney. It names the principal, its legal form and where it does business, names the agent, and grants authority to do every lawful act the principal could do in customs matters, with a space for an expiry date and the principal’s signature.',
      ],
      table: {
        caption: 'US power of attorney rules in 19 CFR Part 141, subpart C',
        head: ['Rule', 'What the regulation says'],
        rows: [
          ['141.32 Form', 'Form 5291, or a general or limited power with the same execution'],
          [
            '141.34 Duration',
            'Partnerships: up to 2 years from execution; others: unlimited period',
          ],
          ['141.35 Revocation', 'At any time, by written notice received by CBP'],
          [
            '141.37 Corporations',
            'Some nonresident corporations must prove the signer’s authority to grant it',
          ],
          [
            '141.46 Brokers',
            'Brokers keep the power of attorney on file; they need not file it with CBP',
          ],
        ],
      },
    },
    {
      heading: 'How long does a customs power of attorney last, and can you revoke it?',
      paragraphs: [
        'It depends on who grants it. Under 19 CFR 141.34, a power of attorney issued by a partnership is limited to a period not exceeding 2 years from the date of execution, and all others may be granted for an unlimited period. You can still choose an expiry date on the form.',
        'You can end it whenever you like. 19 CFR 141.35 says any power of attorney is subject to revocation at any time by written notice given to and received by CBP, at the port of entry or electronically. Tell the broker too, and keep a copy of the notice.',
      ],
    },
    {
      heading: 'Do exporters need a power of attorney as well?',
      paragraphs: [
        'Often, yes, for the export filing. Under the Foreign Trade Regulations at 15 CFR 30.3, a US principal party in interest (USPPI) that has an agent file its Electronic Export Information gives that agent a power of attorney or written authorization to do so.',
        'The regulation says the authorization should specify the responsibilities of the parties with particularity and state that the agent may act for the principal party as its true and lawful agent for creating and filing the export data. In a routed export, where the foreign buyer controls the shipment, 15 CFR 30.3 says the foreign principal party gives its agent written authorization, and the USPPI is not required to give the buyer’s agent one.',
      ],
    },
    {
      heading: 'Is there a UK equivalent?',
      paragraphs: [
        'Yes, written instructions to a customs representative. GOV.UK says whoever you hire cannot act on your behalf without written instructions from you, that the instructions must show whether they act for you directly or indirectly, and that you confirm the terms of the representation in writing.',
        'HMRC will only ask for evidence of that authorisation if it needs it, according to GOV.UK, and you remain responsible for due diligence on your declarations even when someone else makes them. Ask your agent which form of representation it offers before you sign.',
      ],
    },
    {
      heading: 'How do you sign a customs power of attorney safely?',
      paragraphs: [
        'Treat it like any other grant of authority. The steps below follow the CBP and GOV.UK guidance above; your broker’s instructions come first.',
      ],
      steps: [
        'Check that the agent is who it says it is, and for US imports that the broker is licensed.',
        'Read whether the form grants general or limited authority, and to which agent.',
        'Make sure the legal name, address and identification numbers match your registration exactly.',
        'Have it signed by a person with authority to bind the business, and keep a signed copy.',
        'Set an expiry date if you want one, and diarise a review.',
        'Revoke it in writing, to CBP and the agent, when the relationship ends.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can my freight forwarder sign the broker’s power of attorney for me?',
      a: 'No, not for US imports. CBP says the importer of record must execute and sign it directly; a forwarder may help but may not sign it or assign one to a broker.',
    },
    {
      q: 'Does the broker send my power of attorney to CBP?',
      a: 'Not usually. 19 CFR 141.46 says customs brokers keep powers of attorney with their books and papers and are not required to file them with CBP.',
    },
    {
      q: 'Can I grant authority for only some shipments?',
      a: 'Yes. 19 CFR 141.32 allows a limited power of attorney as well as a general one, so you can restrict the scope if the broker agrees to work on that basis.',
    },
    {
      q: 'Do I still need a commercial invoice if my broker has a power of attorney?',
      a: 'Yes. The power of attorney lets the broker file; the commercial invoice and packing list give it the facts to file. The broker relies on the documents you supply.',
    },
  ],
  sources: [
    'd1-cornell-19-cfr-141-32',
    'd1-cornell-19-cfr-141-34',
    'd1-cornell-19-cfr-141-35',
    'd1-cornell-19-cfr-141-37',
    'd1-cornell-19-cfr-141-46',
    'd1-cornell-19-cfr-111-36',
    'd1-cbp-broker-faqs',
    'd1-cbp-validating-poa',
    'd1-cornell-15-cfr-30-3',
    'd1-gov-uk-appoint-customs-agent',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator'],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Give your broker clean documents to file from',
    text: 'A power of attorney lets the broker act; the invoice tells it what to declare. Prepare the commercial invoice and packing list once, with matching parties and values.',
  },
  related: [
    '/guides/freight-forwarder-vs-customs-broker',
    '/guides/importer-of-record',
    '/guides/eei-aes-filing-itn',
    '/blog/shippers-letter-of-instruction',
    '/blog/customs-bond',
  ],
  cover: {
    id: 'wNxbeoNUg_4',
    src: 'https://images.unsplash.com/photo-1664463760781-f159dfe3af30',
    width: 6000,
    height: 4000,
    alt: 'Two people at a desk signing a printed document, as a business does when it grants a customs power of attorney',
    caption: 'Signing a document at a desk',
    photographer: { name: 'Annika Wischnewsky', profile: 'https://unsplash.com/@wischn' },
    page: 'https://unsplash.com/photos/couple-signing-document-at-desk-wNxbeoNUg_4',
  },
};

export default article;
