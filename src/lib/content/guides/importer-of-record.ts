import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "importer of record" 1,300, KD n/a.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A (v2 #23).
 */
const article: ContentArticle = {
  slug: 'importer-of-record',
  title: 'What is an importer of record, and who should it be?',
  metaTitle: 'Importer of record: who it is and what it owes',
  description:
    'Who the importer of record is under US customs law, what it is liable for, how the Incoterms rule you agree changes who takes the role, and what a foreign seller needs under DDP.',
  lede: 'Every formal US import has one party that answers to CBP for the entry and the duty. Agree a delivered price without knowing who that party is and you may find it is you.',
  answer:
    'The importer of record is the party that makes entry of goods into the United States and is responsible to CBP for the entry and the duties. Under 19 U.S.C. 1484, it is the owner or purchaser of the goods, or a licensed customs broker designated by them. Using a broker does not move the duty liability.',
  keyFacts: [
    'Under 19 U.S.C. 1484, the importer of record is the owner or purchaser of the merchandise, or a licensed customs broker when designated.',
    'CBP says the importer of record is ultimately responsible for the correctness of the entry and all duties, taxes and fees, even when using a broker.',
    'Under 19 CFR 141.1, duty is a personal debt of the importer to the United States, and paying a broker who fails to pay CBP does not discharge it.',
    'Under 19 CFR 142.4, goods are not released at entry unless a bond on CBP Form 301 has been filed, subject to a limited waiver.',
    'Under 19 CFR 141.18, a nonresident corporation entering goods needs a resident agent for service of process and a bond with a resident corporate surety.',
  ],
  definitions: [
    {
      term: 'Importer of record (IOR)',
      meaning:
        'The party that makes entry with CBP and is liable for the entry and the duties on it.',
    },
    {
      term: 'Entry',
      meaning:
        'The filing that lets CBP decide whether to release imported goods and assess the duty.',
    },
    {
      term: 'Customs bond',
      meaning:
        'A guarantee on CBP Form 301 that secures duties and obligations on an entry, single or continuous.',
    },
    {
      term: 'Reasonable care',
      meaning: 'The standard of care US law requires of the party making entry.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does the importer of record do?',
      paragraphs: [
        'It makes entry and stands behind it. Under 19 U.S.C. 1484, the party making entry files the information CBP needs to decide whether the goods may be released, then completes the entry with the declared value, classification and rate of duty, using reasonable care.',
        'Responsibility stays with the importer of record when a broker does the filing. CBP’s guidance for importers says that even when using a broker, the importer of record is ultimately responsible for the correctness of the entry documentation and all applicable duties, taxes and fees.',
      ],
    },
    {
      heading: 'Who can be the importer of record?',
      paragraphs: [
        'US law names two kinds of party. Under 19 U.S.C. 1484, the importer of record is the owner or purchaser of the merchandise or, when designated by them, a person holding a customs broker licence. CBP notes that some resident importers file entries themselves, while many first-time importers use a licensed customs broker, who is licensed by CBP but is not a CBP employee.',
        'CBP entry forms ask for an importer number: the IRS business registration number, or a social security number where the business is not registered with the IRS. A party without either can request a CBP-assigned number on CBP Form 5106 at a port of entry.',
      ],
    },
    {
      heading: 'What is the importer of record liable for?',
      paragraphs: [
        'The duty, first of all. Under 19 CFR 141.1, liability for duties is a personal debt due from the importer to the United States, and it is not discharged if the importer paid a broker who then failed to pay CBP. The duties are also a lien on the goods while they are under customs control.',
        'A bond backs the entry but does not replace the importer. Under 19 CFR 142.4, goods are not released at entry unless a single entry or continuous bond on CBP Form 301 has been filed, with a limited waiver for some entries valued at $2,500 or less. Under 19 CFR 141.1, a bond does not relieve the importer of liabilities from the importation.',
      ],
    },
    {
      heading: 'How does the Incoterms® rule decide who is importer of record?',
      paragraphs: [
        'It decides who has agreed to clear the goods for import, and that party usually acts as importer of record. Under the ICC’s Incoterms® 2020 rules, import clearance and import duty sit with the buyer under every rule except DDP, where the seller takes them on.',
        'The Incoterms® rule is a contract between seller and buyer; it does not change who US law accepts as importer of record. A seller agreeing to DDP needs to be able to act as the owner or purchaser making entry, or to arrange a broker designated to do so.',
      ],
      table: {
        caption: 'Who usually clears US imports under common Incoterms® 2020 rules',
        head: ['Rule', 'Import clearance and duty', 'Who usually acts as importer of record'],
        rows: [
          ['EXW, FCA, FOB', 'Buyer', 'The US buyer, or its designated broker'],
          ['CPT, CIP, CFR, CIF', 'Buyer', 'The US buyer, or its designated broker'],
          ['DAP, DPU', 'Buyer', 'The US buyer, or its designated broker'],
          ['DDP', 'Seller', 'The seller, or a broker it designates'],
        ],
      },
    },
    {
      heading: 'What does a foreign seller need to act as importer of record?',
      paragraphs: [
        'More than a price. A seller established outside the United States that agrees to DDP is making entry as a nonresident. Under 19 CFR 141.18, a nonresident corporation entering goods for consumption needs a resident agent, in the state of the port of entry, authorised to accept service of process, and a bond on CBP Form 301 with a resident corporate surety.',
      ],
      steps: [
        'Confirm with the buyer which Incoterms® 2020 rule applies and who will make entry.',
        'If it is you, appoint a licensed customs broker and give it written authority to act.',
        'Arrange the bond, and for a nonresident corporation the resident agent, before the goods arrive.',
        'Obtain an importer number, or request one on CBP Form 5106.',
        'Send the broker a commercial invoice whose description, value and quantities match the shipment.',
        'Budget for duties, taxes and fees in the price, since the importer of record owes them.',
      ],
    },
    {
      heading: 'What should the commercial invoice show for the importer of record?',
      paragraphs: [
        'It should show who is buying, who receives the goods and the facts the entry depends on: an accurate description, the quantity, the value and the currency. The broker builds the entry from these details, and the importer of record answers for them, so they need to be right before the goods ship.',
        'If the importer of record is not the buyer or the consignee, show it as a separate party so the broker does not have to guess. The guide on shipper, consignee and notify party explains how those roles appear on the documents.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is the importer of record the same as the consignee?',
      a: 'Often, but not necessarily. The consignee is the party the goods are delivered to; the importer of record is the party making entry with CBP. Under 19 U.S.C. 1484 that is the owner or purchaser, or a broker they designate.',
    },
    {
      q: 'Does my customs broker become liable for the duty?',
      a: 'CBP says the importer of record remains ultimately responsible for the entry and the duties, and 19 CFR 141.1 says paying a broker who fails to pay CBP does not discharge the importer’s liability.',
    },
    {
      q: 'Can a company outside the US be importer of record?',
      a: 'A nonresident corporation can make entry if it meets 19 CFR 141.18: a resident agent authorised to accept service of process and a bond with a resident corporate surety.',
    },
    {
      q: 'What is CBP Form 5106 for?',
      a: 'CBP says a party can request a CBP-assigned importer number on Form 5106, presented to the entry branch at a port of entry.',
    },
  ],
  sources: [
    'a5-usc-19-1484',
    'w3-cbp-importer-tips',
    'a5-cfr-19-141-1',
    'a5-cfr-19-142-4',
    'a5-cfr-19-141-18',
    'icc-incoterms-2020',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: ['/tools/landed-cost-calculator', '/tools/incoterms', '/tools/invoice-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/landed-cost-calculator',
    title: 'Price the duty before you agree to DDP',
    text: 'Add freight, insurance, duty and fees to the goods value to see what the importer of record will pay, using a rate you have checked.',
  },
  related: [
    '/guides/dap-vs-ddp',
    '/blog/fob-vs-ddp',
    '/guides/landed-cost',
    '/guides/shipper-consignee-notify-party',
    '/blog/ddp-vs-ddu',
  ],
  cover: {
    id: 'huciLx_BveI',
    src: 'https://images.unsplash.com/photo-1703226741497-6de4f67c6e11',
    width: 5472,
    height: 3648,
    alt: 'Container ship guided into port by tugboats beside cranes and stacked containers, where imports are entered',
    caption: 'A container ship guided into port by tugboats',
    photographer: { name: 'Bernd Dittrich', profile: 'https://unsplash.com/@hdbernd' },
    page: 'https://unsplash.com/photos/a-tug-boat-in-the-water-next-to-a-large-cargo-ship-huciLx_BveI',
  },
};

export default article;
