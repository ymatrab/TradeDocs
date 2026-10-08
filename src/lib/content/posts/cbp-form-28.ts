import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, Google US, 2026-10-07 file 05): "cbp form 28" 110.
 * Plan: docs/research/content-plan-v4-2026-10-08.md, group 3, wave E.
 */
const article: ContentArticle = {
  slug: 'cbp-form-28',
  title: 'CBP Form 28: how to answer a US customs request for information',
  metaTitle: 'CBP Form 28: the request for information',
  description:
    'What CBP Form 28 asks for, who receives it, and how the importer and the foreign seller answer it from the invoice, the contract and the cost records.',
  lede: 'A CBP Form 28 arrives after the goods have entered the United States, when the officer reviewing the entry finds that the invoice does not say enough. It is addressed to the importer or its broker, but many of its questions can only be answered by the seller. This post walks through the form, question by question, and shows which records answer each one.',
  answer:
    'CBP Form 28 is the Request for Information that US Customs and Border Protection sends when an invoice or other entry documents do not give enough detail to value or classify imported goods. It goes to the importer or its agent, and can reach exporters and producers. The reply supplies documents, answers and sometimes samples.',
  keyFacts: [
    'CBP Form 28 is issued under 19 CFR 151.11, which lets CBP request samples or additional information about goods it has already released.',
    'CBP’s May 2026 Federal Register notice says the form goes to importers, exporters, producers or their agents when the invoice or other documents are insufficient.',
    'The current CBP Form 28 is the 08/24 edition, published in CBP’s forms library under OMB control number 1651-0023.',
    'The form’s instructions ask the recipient to contact the named CBP officer if a reply cannot be made within 30 days of the request.',
    'Under 19 CFR 152.2, a proposed increase in duties is notified separately, on CBP Form 29 or its electronic equivalent.',
  ],
  definitions: [
    {
      term: 'Request for information',
      meaning:
        'CBP Form 28, the written or electronic request CBP sends when it needs more facts, documents or samples to finish reviewing an entry.',
    },
    {
      term: 'Assist',
      meaning:
        'As defined on the form, materials, tools, moulds, consumables or design work the buyer supplies free or at reduced cost for producing the imported goods.',
    },
    {
      term: 'Price paid or payable',
      meaning:
        'The form’s term for the total payment the buyer makes to, or for the benefit of, the seller, excluding transport, insurance and other C.I.F. charges.',
    },
    {
      term: 'ACE',
      meaning:
        'The Automated Commercial Environment, CBP’s trade portal, where Forms 28 and 29 can be received and answered electronically.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is CBP Form 28?',
      paragraphs: [
        'CBP Form 28 is US Customs and Border Protection’s Request for Information. CBP’s Federal Register notice of May 2026 explains its purpose: CBP appraises imported goods, classifies them under the tariff schedule and assesses duty, and when the invoice or other documentation does not provide enough information for that, or for trade agreement and preference compliance, it sends this form. The authority printed on the form is 19 CFR 151.11.',
        'The form is a request, not a penalty. It tells you that an officer has a specific question about a specific entry. A complete, prompt answer is how the question gets closed; the form itself does not say what the officer has concluded.',
      ],
    },
    {
      heading: 'Who receives a Form 28, the importer or the exporter?',
      paragraphs: [
        'Usually the importer of record or its customs broker. The privacy statement on the 08/24 edition says CBP sends the written request, or its electronic equivalent, to the importer or their agent. CBP’s 2026 notice widens the description to importers, exporters, producers or their agents, which covers requests tied to trade agreement claims.',
        'In practice, a foreign seller most often hears about a Form 28 from its buyer. The questions about costs, contracts and how the goods are made can only be answered from the seller’s records, so the importer forwards them. As the exporter you are not the filer of the US entry, but your documents are what the officer is checking.',
      ],
    },
    {
      heading: 'What does the form ask for?',
      paragraphs: [
        'The top of the form identifies the entry: entry number, date of entry, invoice number and description, HTSUS item number, country of origin or exportation, manufacturer or seller, broker, carrier and port. Below that, the officer ticks the questions to answer and the items to send. The table maps each one to the record that usually answers it.',
      ],
      table: {
        caption: 'What CBP Form 28 (08/24) can ask for, and where the answer usually comes from',
        head: ['On the form', 'What CBP asks', 'Record that answers it'],
        rows: [
          [
            'Question A, relationship',
            'Whether you are related to the seller and, if so, how that affects the price',
            'The buyer’s and seller’s ownership and management details',
          ],
          [
            'Question B, additional costs',
            'Packing, commissions, proceeds that accrue to the seller, assists, royalties and licence fees',
            'Contract terms, agent agreements and the buyer’s purchase records',
          ],
          [
            'Contract or purchase order',
            'A copy of the contract, or the purchase order and seller’s confirmation, with revisions',
            'The purchase order, proforma invoice and order confirmation',
          ],
          [
            'Breakdown of components',
            'Components, materials or ingredients by weight, with their actual cost at assembly',
            'The seller’s bill of materials and cost records',
          ],
          [
            'Descriptive literature',
            'What the goods are, where and how they are used, and how they operate',
            'Catalogue pages, data sheets and drawings',
          ],
          [
            'Samples',
            'Samples taken from the shipment covered by the entry',
            'The importer, from the goods received',
          ],
        ],
      },
    },
    {
      heading: 'How long do you have to reply?',
      paragraphs: [
        'Read the date on your request first. The general instructions on the 08/24 edition say that if a reply cannot be made within 30 days from the date of the request, or if you want to discuss any of the questions, you should contact the CBP officer named on the front. The same page states that a reply is required under section 509(a) of the Tariff Act of 1930, 19 U.S.C. 1509.',
        'Samples follow a stricter path. Under 19 CFR 151.11, when CBP asks for samples or extra examination packages of goods it has already released and the request is not promptly met, CBP may demand that the goods be returned to its custody under the bond, in line with 19 CFR 141.113.',
      ],
    },
    {
      heading: 'How do you answer a Form 28, step by step?',
      paragraphs: [
        'The answer is assembled by the importer or broker and returned to CBP; the seller supplies the parts only it holds. The order below follows the form’s own instructions.',
      ],
      steps: [
        'Read which questions and items are ticked, and note the entry number and invoice number they relate to; everything you send must relate to that shipment.',
        'Pull the commercial invoice, packing list and purchase order for the entry, and check that descriptions, quantities and prices match across all three.',
        'Answer each ticked question to the best of your knowledge, in the order the form lists them, and say plainly when a cost such as an assist or a royalty does not apply.',
        'Attach the documents requested: the contract or order and confirmation, a cost breakdown if asked, and literature that explains what the goods are and how they work.',
        'If the same information was already given to CBP at another port, say which port, as the form asks, and include a copy of that reply if possible.',
        'Have a company official sign the certification that the information is true and correct; the form notes this is not required when a foreign firm completes it.',
        'Return a copy of the form with the reply, through the channel the request came by, before the date on the request or after agreeing a new one with the officer.',
      ],
    },
    {
      heading: 'Can you reply to Form 28 in ACE?',
      paragraphs: [
        'Yes, where the request was issued electronically. CBP’s ACE Forms Modernization notice of April 2022 announced a tool in the ACE portal for trade users to respond to and manage CBP Forms 28, 29 and 4647 and Docs Required requests. Importers and brokers with ACE access see the request there and upload the reply.',
        'A foreign seller does not normally have its own ACE access for the buyer’s entry. You send your part to the importer or the broker, who files it.',
      ],
    },
    {
      heading: 'What is the difference between Form 28 and Form 29?',
      paragraphs: [
        'Form 28 asks a question; Form 29 reports an action. Under 19 CFR 152.2, when the Center director believes the entered rate or value is too low, or finds more goods than were entered, the importer is notified on CBP Form 29 or its electronic equivalent, stating the nature of the difference.',
        'A Form 28 often comes before a Form 29, because the officer gathers facts first. A complete answer to the Form 28 is the importer’s chance to explain the price, the costs and the classification before CBP decides whether to propose a change.',
      ],
    },
    {
      heading: 'How can an exporter avoid the questions in the first place?',
      paragraphs: [
        'Send an invoice that already answers them. Most of the form’s questions concern facts that 19 CFR 141.86 expects on a US import invoice anyway: a detailed description, quantities, the price in the currency of sale, itemised charges for packing, commissions and freight, and the country of origin.',
        'State the costs you know about instead of leaving them out. If the buyer supplied moulds or paid a design fee, the invoice or a note to the broker can say so. Keep the purchase order, order confirmation and bill of materials filed by invoice number, so that a request months later takes an afternoon to answer, not a week.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does TradeDocs answer or file a CBP Form 28?',
      a: 'No. TradeDocs prepares commercial invoices, proforma invoices and packing lists. The Form 28 is issued by CBP, and the reply is made by the importer, its broker or the party CBP addressed, usually through ACE.',
    },
    {
      q: 'Does a Form 28 mean my shipment is under investigation?',
      a: 'Not by itself. CBP’s notice describes the form as a request for information when the documents are not sufficient for valuation, classification or trade agreement compliance. What happens next depends on the answer.',
    },
    {
      q: 'Where can I download a blank CBP Form 28?',
      a: 'From the CBP forms library, which publishes the 08/24 edition. CBP’s page notes that the OMB expiry date has passed but the form is still valid for use while OMB reviews it.',
    },
    {
      q: 'Does the foreign seller have to sign the Form 28 reply?',
      a: 'The certification on the form is signed by the owner, importer or a company official. The form notes the signature is not required if a foreign firm completes the form; follow what the importer’s broker asks for.',
    },
    {
      q: 'What counts as related parties on Form 28?',
      a: 'The form’s definitions include family members, officers or directors of each other’s organisations, partners, employer and employee, anyone holding 5 percent or more of the voting shares, and parties under common control.',
    },
  ],
  sources: [
    'e3-cbp-form-28',
    'e3-cbp-form-28-page',
    'e3-fr-2026-09221',
    'e3-ecfr-19-cfr-151-11',
    'e3-ecfr-19-cfr-152-2',
    'e3-cbp-ace-forms-notice',
    'us-cbp-invoice-contents',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/proforma-invoice-generator',
    '/tools/packing-list-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Answer the questions on the invoice',
    text: 'The commercial invoice generator has fields for full descriptions, origin, unit prices, currency and itemised packing, freight and commission charges, the facts a Form 28 asks about.',
  },
  related: [
    '/blog/cbp-form-7501',
    '/blog/cbp-customs-exam',
    '/blog/commercial-invoice-requirements',
    '/blog/declared-value-for-customs',
    '/guides/customs-value',
    '/guides/importer-of-record',
  ],
  cover: {
    id: 'b-5ubnkM0LU',
    src: 'https://images.unsplash.com/photo-1632152053640-da3a8b3ee812',
    width: 4240,
    height: 2384,
    alt: 'A stack of printed papers on a wooden table, the kind of file an importer pulls to answer customs',
    caption: 'A stack of papers on a wooden table',
    photographer: { name: '2H Media', profile: 'https://unsplash.com/@2hmedia' },
    page: 'https://unsplash.com/photos/a-stack-of-papers-sitting-on-top-of-a-wooden-table-b-5ubnkM0LU',
  },
};

export default article;
