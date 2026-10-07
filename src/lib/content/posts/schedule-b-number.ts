import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "schedule b number" 1,000, KD 11;
 * "what is schedule b" 1,000, KD 5.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A (v2 #40).
 */
const article: ContentArticle = {
  slug: 'schedule-b-number',
  title: 'What is a Schedule B number, and where do you find yours?',
  metaTitle: 'Schedule B number: what it is and how to find it',
  description:
    'What a Schedule B number is, who runs the schedule, when a US export filing needs it, how it relates to HS and HTS codes, and how to look yours up in the Census tool.',
  lede: 'If you export from the United States, sooner or later a forwarder asks for your Schedule B number. This post explains what the number is, where the rule that asks for it lives, how it lines up with the HS and HTS codes on your invoice, and how to find it yourself with the free Census Bureau tool.',
  answer:
    'A Schedule B number is the 10-digit code the US Census Bureau uses to classify exported goods. Exporters report it in the Electronic Export Information filed through AES, and it often appears on the commercial invoice and the shipper’s letter of instruction. Find yours with the Census Bureau’s free Schedule B search tool.',
  keyFacts: [
    'Under 15 CFR 30.1, Schedule B is the 10-digit statistical classification of US exports administered by the US Census Bureau.',
    'The International Trade Administration notes that the first six digits of a Schedule B number and an HTS number for the same product are the same HS subheading.',
    'Under 15 CFR 30.6, the commodity classification number is a mandatory data element of Electronic Export Information.',
    'Under 15 CFR 30.37(a), EEI is generally not required where each Schedule B or HTS line is valued at $2,500 or less and no licence is needed.',
    'The Census Bureau publishes lists of obsolete Schedule B codes, issued in January and July in most recent years.',
  ],
  definitions: [
    {
      term: 'Schedule B',
      meaning:
        'The Census Bureau’s schedule of 10-digit export commodity codes, built on the six-digit Harmonized System.',
    },
    {
      term: 'EEI (Electronic Export Information)',
      meaning:
        'The export data filed in the Automated Export System (AES) for a US export shipment, under the Foreign Trade Regulations.',
    },
    {
      term: 'HTS (Harmonized Tariff Schedule of the United States)',
      meaning:
        'The US import tariff, kept by the US International Trade Commission, which also uses 10-digit numbers.',
    },
    {
      term: 'USPPI',
      meaning:
        'The US principal party in interest: the party in the United States that receives the main benefit of the export, usually the seller.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a Schedule B number?',
      paragraphs: [
        'A Schedule B number is a 10-digit code that identifies a type of goods leaving the United States. The Foreign Trade Regulations, at 15 CFR 30.1, define Schedule B as the statistical classification of domestic and foreign commodities exported from the United States, administered by the US Census Bureau. The government uses the numbers to compile US export statistics, and the export filing uses them to describe what is shipped.',
        'The number is not a tax code. Schedule B is a statistical classification, so it carries no duty rates. Its job is to classify the goods consistently, so the data in each filing can be counted and checked.',
        'The International Trade Administration lists three practical uses: classifying physical goods for shipment abroad, reporting shipments in AES when a filing is required, and completing shipping documents such as the shipper’s letter of instruction and the commercial invoice.',
      ],
    },
    {
      heading: 'How does a Schedule B number relate to HS and HTS codes?',
      paragraphs: [
        'All three share one root: the six-digit Harmonized System of the World Customs Organization. The International Trade Administration states that a complete 10-digit Schedule B number and HTS number may differ for the same product, but the first six digits will be the same. The last four digits are national detail added for US statistics.',
        'The difference is direction. Schedule B is the export schedule, run by the Census Bureau. The HTS is the import tariff, kept by the US International Trade Commission, and its numbers carry duty rates. The importing country then applies its own tariff to your goods, which may add different national digits after the shared six.',
      ],
      table: {
        caption: 'Three related classification codes, by who uses them',
        head: ['Code', 'Digits', 'Used for', 'Kept by'],
        rows: [
          [
            'HS code',
            '6',
            'The shared international base of national tariffs',
            'World Customs Organization',
          ],
          [
            'Schedule B number',
            '10',
            'US export statistics and the EEI filing',
            'US Census Bureau',
          ],
          [
            'HTS number',
            '10',
            'US import classification and duty rates',
            'US International Trade Commission',
          ],
        ],
      },
    },
    {
      heading: 'When does a US export filing need a Schedule B number?',
      paragraphs: [
        'Whenever Electronic Export Information is filed. Under 15 CFR 30.6, the commodity classification number is one of the mandatory EEI data elements, reported with a commodity description detailed enough to verify it, the quantity in the schedule’s unit, the shipping weight and the value. The same section allows the 10-digit HTS number to be reported in its place, except where the HTS headnotes say otherwise.',
        'Not every export needs EEI. Under 15 CFR 30.37(a), filing is generally not required where the value of each Schedule B or HTS line is $2,500 or less, the test is applied line by line rather than to the whole shipment, and other exemptions in Subpart D carry their own conditions. A licence requirement can make a filing necessary regardless of value. The regulation is the place to check; this post does not decide whether your shipment qualifies.',
        'Under 15 CFR 30.3, the USPPI is responsible for the export information, and the USPPI or its authorised agent files it. A forwarder who files for you still needs the classification from you, because the facts about the goods are yours.',
      ],
    },
    {
      heading: 'How do you find your Schedule B number?',
      paragraphs: [
        'Use the Census Bureau’s Schedule B search tool, which is free and is the official source. The Census Bureau describes it as a way to help filers determine their correct export commodity code. It also publishes the full Schedule B book by chapter for each year, so you can read the notes around a code you find.',
      ],
      steps: [
        'Write a plain description of the goods before you search: what they are, what they are made of, what they do and how they are packed. Avoid brand names and internal part numbers.',
        'Search the Census Bureau’s Schedule B tool with that description and answer its follow-up questions honestly; it narrows the choice by asking about material and use.',
        'Open the chapter of the Schedule B book that the result belongs to and read the chapter notes, which include or exclude goods before the headings do.',
        'Check that the description on the 10-digit line matches your goods, and note the unit of quantity it asks for, because the filing reports quantity in that unit.',
        'Compare the first six digits with the HS code your buyer’s customs broker uses. If they differ, ask why before you ship.',
        'Record the number, the date and the edition you used. Codes change, so recheck them when a new edition takes effect.',
      ],
    },
    {
      heading: 'Can you use the same number every year?',
      paragraphs: [
        'Only after checking. The schedule is revised, and the Census Bureau publishes lists of obsolete Schedule B codes, with updates dated January and July in most recent years. A number that was valid when you first exported may no longer be accepted, or may now split into narrower lines.',
        'Keep a short product file: description, Schedule B number, the six-digit HS subheading, the unit of quantity and the date you last checked. When the schedule changes, you update one record instead of hunting through old invoices.',
      ],
    },
    {
      heading: 'Where does the number go on your export documents?',
      paragraphs: [
        'In the EEI it goes in the commodity classification field for each line. On the commercial invoice and the shipper’s letter of instruction it usually sits next to the description of each line, so the forwarder can copy it into the filing and the buyer’s broker can see the shared six digits.',
        'Ask your buyer which code they want printed. Some importers want only the six-digit HS subheading, because their own tariff adds different national digits; others accept the full Schedule B number for reference. Whatever you print, keep the description, the quantity and the unit identical across the invoice, the packing list and the filing.',
      ],
    },
    {
      heading: 'Why does this post not list example Schedule B numbers?',
      paragraphs: [
        'A Schedule B number is a classification of a specific product, and a list of examples invites copying a code that fits someone else’s goods. A small difference in material, function or packing can move goods to another heading, and the filing is made in your name. The Census tool, the chapter notes and, where needed, a licensed customs broker or forwarder are the right route to your number.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a Schedule B number the same as an HS code?',
      a: 'No. The HS code is the six-digit international base. A Schedule B number keeps those six digits and adds four more for US export statistics, so it has 10 digits in total.',
    },
    {
      q: 'Can I put the HTS number in the export filing instead?',
      a: 'Under 15 CFR 30.6, the 10-digit HTS number may be reported instead of the Schedule B number, except where the HTS headnotes say otherwise. Check the headnotes for your chapter before relying on it.',
    },
    {
      q: 'Who is responsible for choosing the Schedule B number?',
      a: 'The USPPI answers for the export information under 15 CFR 30.3, even when an authorised agent files it. Your forwarder can help, but the description of the goods and the classification start with you.',
    },
    {
      q: 'Does a Schedule B number decide the duty my buyer pays?',
      a: 'No. Duty is set by the importing country’s own tariff, applied by its customs to the goods as described. Only the six-digit HS base is shared internationally.',
    },
    {
      q: 'Do I need a Schedule B number for a small shipment?',
      a: 'If no EEI is required, the filing does not need one. Under 15 CFR 30.37(a), EEI is generally not required where each line is worth $2,500 or less and no licence applies, but buyers and forwarders may still ask for the code on the invoice.',
    },
  ],
  sources: [
    'w5-ftr-30-1',
    'w5-ftr-30-3',
    'w5-ftr-30-6',
    'w5-ftr-30-37',
    'w5-census-schedule-b',
    'w5-census-aes',
    'w5-ita-hs-codes',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Keep the code with each invoice line',
    text: 'The commercial invoice generator puts the commodity code beside the description, quantity and unit on every line, so the forwarder copies one consistent record into the filing.',
  },
  related: [
    '/guides/hs-vs-hts-vs-schedule-b',
    '/guides/eei-aes-filing-itn',
    '/blog/how-to-find-hs-code',
    '/blog/shippers-letter-of-instruction',
    '/guides/how-to-export-from-the-us',
  ],
  cover: {
    id: '6Vg8N8u61aI',
    src: 'https://images.unsplash.com/photo-1571244222371-0b0b60f3c92b',
    width: 4896,
    height: 3264,
    alt: 'Container ship stacked with shipping containers at the port of Los Angeles, ready for export',
    caption: 'A loaded container ship in the port of Los Angeles, California',
    photographer: { name: 'Diego Fernandez', profile: 'https://unsplash.com/@diegitane' },
    page: 'https://unsplash.com/photos/black-and-red-ship-on-body-of-water-at-daytime-6Vg8N8u61aI',
  },
};

export default article;
