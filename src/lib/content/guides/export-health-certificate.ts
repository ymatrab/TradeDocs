import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google UK, 2026-10-06): "ehc" 2,400, KD 24; "export health certificate" 390.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D, review gate: this guide describes
 * an official certificate TradeDocs does not issue, and stays noindex until a review record
 * exists (rules/seo-content.md). Every rule is from GOV.UK (APHA/Defra) pages opened 2026-10-08.
 * No fee amounts are given; example parties are invented.
 */
const article: ContentArticle = {
  slug: 'export-health-certificate',
  title: 'Export health certificate (EHC): how UK exporters get one',
  metaTitle: 'Export health certificate (EHC) in the UK',
  description:
    'What an export health certificate is, which animal products need one from Great Britain, who signs it, and how EHC Online works. TradeDocs does not issue EHCs.',
  lede: 'Live animals and animal products leaving Great Britain, from fresh meat and fish to pet food, usually need an export health certificate. It is an official certificate, signed by a vet or inspector authorised by the government. TradeDocs does not issue, sign or apply for EHCs; this guide explains who does and how the process runs.',
  answer:
    'An export health certificate (EHC) is an official document confirming that live animals or animal products meet the destination country’s health requirements. In Great Britain, exporters apply to APHA through EHC Online, and an official vet or local authority inspector signs it. TradeDocs does not issue export health certificates.',
  keyFacts: [
    'GOV.UK says live animals and animal products moved from Great Britain to the EU, non-EU countries or Northern Ireland need an EHC.',
    'APHA says an EHC is signed by an official veterinarian it has authorised or by a local authority inspector.',
    'GOV.UK says each animal or animal product type needs its own EHC, including each product type in a mixed consignment.',
    'Under APHA’s process, the certifier receives the EHC 7 working days before the export date.',
    'GOV.UK says exports from Northern Ireland need an EHC for non-EU countries only, with DAERA as the competent authority.',
  ],
  definitions: [
    {
      term: 'Official veterinarian (OV)',
      meaning:
        'A vet authorised by APHA to inspect consignments and sign export health certificates.',
    },
    {
      term: 'Competent authority',
      meaning:
        'The government body in each country that sets and enforces animal health import conditions, such as Defra in Great Britain or DAERA in Northern Ireland.',
    },
    {
      term: 'EHC Online',
      meaning:
        'APHA’s online service where exporters in Great Britain register and apply for export health certificates.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is an export health certificate?',
      paragraphs: [
        'GOV.UK calls it an official document that confirms your export meets the health requirements of the destination country. The conditions on it are set by that country’s competent authority, and the UK side certifies that the consignment meets them.',
        'It is a government certificate, not a commercial document. TradeDocs does not issue, sign, file or apply for export health certificates, and nothing our tools produce replaces one. We prepare the commercial invoice and packing list that travel with the same consignment.',
      ],
    },
    {
      heading: 'Which exports need an EHC?',
      paragraphs: [
        'Live animals and animal products, depending on where they go. GOV.UK says goods moved from Great Britain (England, Scotland and Wales) to, or through, the EU, non-EU countries or Northern Ireland need one. Related GOV.UK guidance covers germplasm such as semen and embryos, and animal feed and pet food.',
        'Transit counts. GOV.UK says goods passing through the EU need a transit EHC, and transit through a non-EU country may need one, so check with that country’s competent authority. Each animal or product type needs a separate EHC, so a mixed consignment can need several.',
      ],
    },
    {
      heading: 'Who signs an export health certificate?',
      paragraphs: [
        'A certifier authorised by the government, never the exporter. GOV.UK says the EHC is signed by an official veterinarian authorised by APHA or by a local authority inspector, who must be able to inspect the consignment. For goods consolidated at a logistics hub, a certifying officer completes and processes the EHCs.',
        'You choose and contact your certifier before you apply and name them in the application. GOV.UK publishes guidance on finding a professional to certify EHCs.',
      ],
    },
    {
      heading: 'How do you apply for an EHC?',
      paragraphs: [
        'Through EHC Online, after finding the right certificate. The steps follow APHA’s guidance on GOV.UK; the current GOV.UK pages are the authority.',
      ],
      steps: [
        'Search APHA’s “Find an export health certificate” finder by destination country and commodity; it holds the latest versions, each with a numbered reference.',
        'Read the certificate and its guidance notes, and check that your product and premises can meet every condition.',
        'Register for EHC Online and contact the official vet or inspector who will certify the consignment.',
        'Apply in EHC Online, naming your certifier and attaching any waiver from the destination’s competent authority.',
        'Have the consignment ready for inspection; the certifier signs the EHC if the conditions are met.',
        'Send the signed EHC with the goods, alongside the commercial invoice and packing list.',
      ],
    },
    {
      heading: 'How far ahead should you apply for an EHC?',
      paragraphs: [
        'Early enough for your certifier to work with it. GOV.UK says the official vet or inspector receives the EHC 7 working days before the export date; if the export is sooner, they receive it within one working day of APHA receiving the application.',
        'Leave extra time when the destination is new to you, the product is unusual or you need a waiver. Invented example: Coldharbour Dairy (an invented business) plans its first cheese export to a non-EU buyer. It finds the certificate in the APHA finder a month ahead, sees a condition about its supplier’s approval it must confirm, and books its local authority inspector before applying.',
      ],
    },
    {
      heading: 'What if there is no EHC for your product or destination?',
      paragraphs: [
        'Ask the destination country. GOV.UK says that if you cannot find an EHC, contact the destination’s competent authority for its paperwork and rules; if it requires a UK-issued EHC, send its import conditions to APHA through APHA’s online contact form.',
        'The destination can also relax a condition. GOV.UK says its competent authority can grant a waiver for a condition you cannot meet, and APHA can then issue a derogation to your certifier.',
      ],
      table: {
        caption: 'Where an EHC is needed, by origin (GOV.UK, retrieved 8 October 2026)',
        head: ['Moving from', 'To the EU', 'To Northern Ireland', 'To non-EU countries'],
        rows: [
          ['Great Britain', 'EHC needed', 'EHC needed', 'EHC needed'],
          ['Northern Ireland', 'No EHC needed', 'Not applicable', 'EHC needed (DAERA)'],
        ],
      },
    },
  ],
  faq: [
    {
      q: 'Can TradeDocs issue or sign an export health certificate?',
      a: 'No. An EHC is applied for through APHA and signed by an authorised official vet or local authority inspector. TradeDocs prepares commercial documents only, such as invoices and packing lists.',
    },
    {
      q: 'Is an EHC the same as a phytosanitary certificate?',
      a: 'No. An EHC covers live animals and animal products and comes through APHA in Great Britain. A phytosanitary certificate covers plants and plant products and comes from the plant health authority.',
    },
    {
      q: 'Can one EHC cover a mixed consignment?',
      a: 'Usually not. GOV.UK says each animal or animal product type needs its own EHC, including each product type in a mixed consignment, so plan one application per product type.',
    },
    {
      q: 'Who sets the conditions on an export health certificate?',
      a: 'The destination country’s competent authority. GOV.UK says it sets the import conditions and can grant waivers for conditions an exporter cannot meet.',
    },
  ],
  sources: ['d4-gov-uk-get-ehc', 'd4-gov-uk-find-ehc'],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Prepare the commercial documents for the consignment',
    text: 'The EHC comes from your certifier. The commercial invoice and packing list come from you: build them in our generators and keep products and quantities consistent with the application.',
  },
  related: [
    '/guides/how-to-export-from-the-uk',
    '/blog/uk-export-declaration',
    '/blog/shipping-to-the-uk-and-eu-documents',
    '/blog/export-documents-checklist',
    '/guides/eori-number',
  ],
  cover: {
    id: 'SYmXbXfgkL0',
    src: 'https://images.unsplash.com/photo-1588595422102-da26a1cb48c6',
    width: 6000,
    height: 4000,
    alt: 'Blue plastic crates stacked on a black metal rack, the kind of storage goods wait in before dispatch',
    caption: 'Blue plastic crates on a metal rack',
    photographer: { name: 'Andriyko Podilnyk', profile: 'https://unsplash.com/@andriyko' },
    page: 'https://unsplash.com/photos/blue-plastic-crates-on-black-metal-rack-SYmXbXfgkL0',
  },
};

export default article;
