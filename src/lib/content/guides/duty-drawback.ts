import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "duty drawback" 1,000, KD 7.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (v2 #29: refunds of duty on
 * exported goods; the documents that prove export).
 */
const article: ContentArticle = {
  slug: 'duty-drawback',
  title: 'Duty drawback: getting US import duty back when goods are exported',
  metaTitle: 'Duty drawback: US refunds on exported goods',
  description:
    'How US duty drawback refunds import duties when goods are exported or destroyed: the five types, the 99% cap, the five-year limits and the export records that prove a claim.',
  lede: 'If you pay duty to bring goods into the United States and then send them, or what you make from them, abroad, part of that duty can come back. The refund is called drawback, and it depends less on the import than on how well you can prove the export.',
  answer:
    'Duty drawback is CBP’s refund of duties, certain taxes and fees paid on imported goods when those goods, or articles made from them, are exported or destroyed under CBP supervision. Under 19 CFR Part 190, the refund is capped at 99 percent, the goods generally must leave within five years of import, and the claim needs proof of export.',
  keyFacts: [
    'CBP describes drawback as the refund of certain duties, internal revenue taxes and fees collected on importation when the goods are exported or destroyed.',
    'Under 19 CFR 190.3, drawback covers ordinary duties, merchandise processing fees and harbor maintenance taxes, but not antidumping or countervailing duties.',
    'Under 19 CFR 190.31, unused merchandise drawback is capped at 99 percent of the duties, taxes and fees paid.',
    'Under 19 CFR 190.51, a complete drawback claim must be transmitted within 5 years after the date the designated goods were imported.',
    'Under 19 CFR 190.82, the exporter is entitled to claim drawback unless it waives and assigns that right by certification.',
  ],
  definitions: [
    {
      term: 'Drawback claimant',
      meaning:
        'The party that files the drawback claim: the exporter by default, or a party to which the exporter assigned the right.',
    },
    {
      term: 'Substitution',
      meaning:
        'Claiming drawback on exported goods that replace the imported goods, where 19 CFR Part 190 allows it, rather than on the imported goods themselves.',
    },
    {
      term: 'CBP Form 7553',
      meaning:
        'The Notice of Intent to Export, Destroy, or Return Merchandise for Purposes of Drawback, which gives CBP the chance to examine the goods.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is duty drawback?',
      paragraphs: [
        'A refund of US import charges on goods that leave the country again. CBP describes drawback as the refund of certain duties, internal revenue taxes and fees collected on importation, refunded when the merchandise is exported or destroyed. The rules are in 19 CFR Part 190.',
        'Not every charge comes back. Under 19 CFR 190.3, drawback is allowable on ordinary customs duties, marking duties, internal revenue taxes that attach on importation, merchandise processing fees and harbor maintenance taxes. It is not allowable on antidumping or countervailing duties.',
      ],
    },
    {
      heading: 'Which types of drawback are there?',
      paragraphs: [
        'Five main ones, set by what happens to the goods between import and export. Each has its own section of 19 CFR Part 190 and its own conditions.',
      ],
      table: {
        caption: 'Main US drawback types under 19 U.S.C. 1313 and 19 CFR Part 190',
        head: ['Type', 'What is exported or destroyed', 'Rule'],
        rows: [
          [
            'Direct identification manufacturing, 1313(a)',
            'Articles made in the US from the imported goods, unused before export',
            '19 CFR 190.21',
          ],
          [
            'Substitution manufacturing, 1313(b)',
            'Articles made from imported goods or from goods in the same 8-digit HTSUS subheading, within 5 years of import',
            '19 CFR 190.22',
          ],
          [
            'Rejected merchandise, 1313(c)',
            'Imported goods that did not conform to sample or specification, were defective, or were shipped without consent',
            '19 CFR 190.42 and 190.51',
          ],
          [
            'Direct identification unused, 1313(j)(1)',
            'The imported goods themselves, unused in the US, within 5 years of import',
            '19 CFR 190.31',
          ],
          [
            'Substitution unused, 1313(j)(2)',
            'Substituted goods, unused and in the claimant’s possession, within 5 years of import',
            '19 CFR 190.32',
          ],
        ],
      },
    },
    {
      heading: 'How much duty can drawback refund?',
      paragraphs: [
        'Up to 99 percent. Under 19 CFR 190.21 and 190.31, the refund will not exceed 99 percent of the duties, taxes and fees paid on the imported goods. For substitution claims, 19 CFR 190.22 and 190.32 cap it at 99 percent of the lesser of the duties paid on the import and the duties that would apply to the substituted or exported goods if they were imported.',
        'Values matter too. Under 19 CFR 190.11, the value of exported goods for drawback is the selling price declared in the Electronic Export Information, so the export price on your invoice and filing feeds the claim.',
      ],
    },
    {
      heading: 'What are the time limits for a drawback claim?',
      paragraphs: [
        'Five years, counted from the import. Under 19 CFR 190.31 and 190.32, unused merchandise must be exported or destroyed before the close of the five-year period beginning on the date of importation, and before the claim is filed. Under 19 CFR 190.51, a complete claim is timely only if it is transmitted within five years after the designated goods were imported.',
        'Notice comes before the export. Under 19 CFR 190.35, for unused merchandise claims a Notice of Intent to Export on CBP Form 7553 is filed at least 5 working days before export unless CBP allows otherwise or has granted a waiver, and CBP decides within 2 working days whether to examine the goods. Goods CBP chose to examine but that leave without being presented lose the drawback. For destruction, 19 CFR 190.71 requires the notice at least 7 working days ahead.',
      ],
    },
    {
      heading: 'Which export records prove a drawback claim?',
      paragraphs: [
        'The ones you already create when you ship, if they are complete. Under 19 CFR 190.72, proof of exportation must establish the date and fact of export and the identity of the exporter. The steps below follow its required data.',
      ],
      steps: [
        'Record the date of export and the exporter’s name as they appear on the transport document.',
        'Describe the goods on the commercial invoice and packing list in terms that match the import entry being claimed.',
        'Show the quantity and unit of measure, using the units the HTSUS line requires for substitution claims.',
        'State the Schedule B or HTSUS number the exporter declares and the country of ultimate destination.',
        'Keep the carrier’s bill of lading, air waybill or manifest, or the electronic export system record, with the claim file.',
      ],
    },
    {
      heading: 'Who can claim drawback, the exporter or the importer?',
      paragraphs: [
        'The exporter, unless it gives the right away. Under 19 CFR 190.82, the exporter or destroyer is entitled to claim drawback unless it waives the right by certification and assigns it to the manufacturer, producer, importer or an intermediate party. The certification must say the right has not been and will not be assigned to anyone else, and it can be a blanket certification for a stated period.',
        'Claims are filed electronically. Under 19 CFR 190.51, all claims go through a CBP-authorised system, and a complete claim combines the drawback entry, any Form 7553 notices, the import entry data and the evidence of export. Claimants who want estimated drawback paid before the drawback entry is liquidated can ask for accelerated payment, which CBP’s bond guidance says requires a bond equal to 100 percent of the accelerated amount.',
        'Exports to Canada and Mexico carry separate limits under the USMCA, for which CBP publishes guidance on its drawback page. Ask a licensed customs broker or drawback specialist before you plan around a refund.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I claim drawback on antidumping duties?',
      a: 'No. Under 19 CFR 190.3(b), drawback is not allowable on antidumping and countervailing duties imposed on goods entered for consumption.',
    },
    {
      q: 'Do the exported goods have to be the same ones I imported?',
      a: 'Not always. Substitution drawback under 19 CFR 190.22 and 190.32 allows a claim on other goods that meet the substitution rules, such as goods in the same 8-digit HTSUS subheading. Direct identification claims need the imported goods themselves.',
    },
    {
      q: 'Can goods be destroyed instead of exported?',
      a: 'Yes, where the drawback type allows it, if the destruction is under CBP supervision. Under 19 CFR 190.71, the claimant files Form 7553 at least 7 working days before, and CBP decides whether to witness it.',
    },
    {
      q: 'Is a drawback refund automatic when I export?',
      a: 'No. Nothing is refunded until a complete claim is filed through CBP’s system with the import data and proof of export, within the five-year limit in 19 CFR 190.51.',
    },
  ],
  sources: [
    'c2-cbp-drawback-overview',
    'c2-cfr-19-190-3',
    'c2-cfr-19-190-11',
    'c2-cfr-19-190-21',
    'c2-cfr-19-190-22',
    'c2-cfr-19-190-31',
    'c2-cfr-19-190-32',
    'c2-cfr-19-190-35',
    'c2-cfr-19-190-42',
    'c2-cfr-19-190-51',
    'c2-cfr-19-190-71',
    'c2-cfr-19-190-72',
    'c2-cfr-19-190-82',
    'c2-cbp-bond-amounts-guide',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: [
    '/tools/landed-cost-calculator',
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/landed-cost-calculator',
    title: 'See the duty that drawback could return',
    text: 'Enter the goods value, freight, insurance and the rate from the official tariff; the landed cost calculator shows the duty paid on import, the figure a drawback claim starts from.',
  },
  related: [
    '/guides/eei-aes-filing-itn',
    '/blog/schedule-b-number',
    '/blog/who-pays-import-duties',
    '/guides/landed-cost',
    '/blog/cbp-form-7501',
  ],
  cover: {
    id: '68bs5DWgS5c',
    src: 'https://images.unsplash.com/photo-1784915479841-cf051cf9992e',
    width: 6038,
    height: 4025,
    alt: 'A tugboat guiding a large container ship out of port, carrying goods abroad again',
    caption: 'A tugboat assists a large green container ship',
    photographer: { name: 'Julia Taubitz', profile: 'https://unsplash.com/@justmejuliee' },
    page: 'https://unsplash.com/photos/a-tugboat-assists-the-large-green-evergreen-cargo-ship-68bs5DWgS5c',
  },
};

export default article;
