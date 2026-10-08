import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, Google, 2026-10-08): "awb number" 1,000 (US), KD 37; CA 260; AU 170.
 * Plan: docs/research/content-plan-v4-2026-10-08.md, wave E, group 1.
 * Number structure from CBP (19 CFR 122.48a), IATA (DG AutoCheck help) and the Australian
 * Border Force check-digit page; the air waybill's role from IATA and the Montreal Convention.
 * The airline prefix 000 and every serial in the examples are invented.
 */
const article: ContentArticle = {
  slug: 'how-to-read-an-awb-number',
  title: 'How to read an AWB number: prefix, serial and check digit',
  metaTitle: 'AWB number: how to read an air waybill number',
  description:
    'An AWB number is 11 digits: the airline’s three-digit prefix, a seven-digit serial and a check digit. How to read it, check it, and where to put it on your documents.',
  lede: 'Your forwarder emails an eleven-digit number and calls it the AWB. It is the key to the whole air shipment: the airline tracks on it, customs files on it, and your buyer’s broker will ask for it. It also takes about a minute to read and check by hand.',
  answer:
    'An AWB number is the 11-digit air waybill number, written 000-00000000. The first three digits are the issuing airline’s IATA prefix, the next seven are the serial number and the last is a check digit: the remainder when the serial is divided by 7. US customs treats it as the IATA standard number.',
  keyFacts: [
    'Under 19 CFR 122.48a, CBP defines the air waybill number, and the master air waybill number, as the IATA standard 11-digit number.',
    'IATA’s DG AutoCheck help gives the format as 000-00000000 and says the 11th digit is a check digit calculated as an unweighted modulus 7.',
    'The Australian Border Force describes the first three digits as the issuing carrier’s three-digit IATA airline code, followed by a seven-digit serial and the check digit.',
    'Under 19 CFR 122.48a, a house air waybill number may be up to 12 letters and digits, and its letters may not be dropped when it is sent to CBP.',
    'Under the Montreal Convention (Article 11), the air waybill is prima facie evidence of the contract of carriage and of the airline’s acceptance of the cargo.',
  ],
  definitions: [
    {
      term: 'Air waybill (AWB)',
      meaning:
        'The document, paper or electronic, that records the contract of carriage between the shipper and the airline for one consignment.',
    },
    {
      term: 'Airline prefix',
      meaning:
        'The three-digit IATA code of the airline that issued the air waybill, written as the first three digits of the number.',
    },
    {
      term: 'Check digit',
      meaning:
        'The last digit of the number, worked out from the serial so that a mistyped serial can be caught.',
    },
    {
      term: 'House air waybill (HAWB)',
      meaning:
        'A forwarder’s own waybill for one shipper’s goods inside a consolidation, with its own reference rather than an airline number.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is an AWB number?',
      paragraphs: [
        'It is the reference number of an air waybill, the document IATA describes as the contract of carriage between the shipper and the airline. Each air waybill carries one number, and that number identifies the consignment for its whole journey: at acceptance, on the flight manifest, in the customs filing and at collection.',
        'CBP’s air cargo rules call it “the International Air Transport Association (IATA) standard 11-digit number”. The same format is used whether the air waybill is printed or exchanged as an electronic air waybill (e-AWB) under IATA’s Multilateral e-AWB Agreement.',
      ],
    },
    {
      heading: 'How is an AWB number structured?',
      paragraphs: [
        'Three parts, read left to right. IATA’s DG AutoCheck help writes the format as 000-00000000: three digits, a hyphen, then eight digits. The Australian Border Force breaks those eleven digits down as the issuing carrier’s IATA airline code, a seven-digit serial number and one check digit.',
      ],
      table: {
        caption: 'The parts of an AWB number, using an invented number 000-12345675',
        head: ['Position', 'Digits', 'What it is'],
        rows: [
          ['1–3', '000', 'The issuing airline’s three-digit IATA prefix (invented here)'],
          ['4–10', '1234567', 'The serial number the airline assigned to this air waybill'],
          ['11', '5', 'The check digit: 1234567 divided by 7 leaves 5'],
        ],
      },
    },
    {
      heading: 'What does the three-digit prefix tell you?',
      paragraphs: [
        'Which airline issued the air waybill. The prefix is a numeric airline code, separate from the two-letter airline designator most people know. It is the first thing to check when a number will not track: make sure the prefix belongs to the airline whose tracking you are using, and if it does not, ask the forwarder which airline issued it.',
        'The prefix is not covered by the check digit. The Australian Border Force’s method divides only the seven-digit serial, so a wrong prefix with a correct serial still looks well formed. Read the first three digits against the airline named on the booking confirmation.',
        'Do not guess an airline from the prefix. Ask your forwarder which airline issued the number, or look up the code in IATA’s coding directories, which are the authoritative list.',
      ],
    },
    {
      heading: 'How do you check an AWB number by hand?',
      paragraphs: [
        'Divide the seven-digit serial by 7 and compare the remainder with the last digit. The Australian Border Force describes exactly this test, and IATA calls the method an unweighted modulus 7. Because a remainder after dividing by 7 is always 0 to 6, a last digit of 7, 8 or 9 is wrong by definition.',
      ],
      steps: [
        'Write the number without the hyphen and count the digits: there must be eleven.',
        'Set aside the first three digits; they are the airline prefix and are not part of the check.',
        'Take the next seven digits as one number, the serial.',
        'Divide the serial by 7 and keep the whole-number remainder.',
        'Compare the remainder with the eleventh digit. If they match, the number is well formed; if not, a digit has been mistyped.',
      ],
    },
    {
      heading: 'What does a worked check look like?',
      paragraphs: [
        'Here are two checks on invented numbers. The first serial comes from the Australian Border Force’s own example; the second shows a transposed pair of digits being caught.',
      ],
      table: {
        caption: 'Worked example with invented AWB numbers',
        head: [
          'AWB number as received',
          'Serial',
          'Serial ÷ 7',
          'Remainder',
          'Last digit',
          'Result',
        ],
        rows: [
          ['000-12345675', '1234567', '176,366', '5', '5', 'Well formed'],
          ['000-81140743', '8114074', '1,159,153', '3', '3', 'Well formed'],
          ['000-81104743', '8110474', '1,158,639', '1', '3', 'Typing error'],
        ],
      },
    },
    {
      heading: 'Is the AWB number the same as the HAWB number?',
      paragraphs: [
        'No. When a forwarder consolidates your goods with other shippers’, the airline issues one master air waybill for the whole consignment, and that master carries the eleven-digit airline number. The forwarder then issues you a house air waybill with its own reference.',
        'CBP’s rule shows the difference: the master air waybill number is the IATA standard 11-digit number, while a house air waybill number may be up to 12 alphanumeric characters. A house number therefore will not pass the modulus 7 check, and is not meant to. Track the master with the airline and the house with the forwarder. The post on MAWB vs HAWB explains how the two levels fit together.',
      ],
    },
    {
      heading: 'Where does the AWB number go on your documents?',
      paragraphs: [
        'On the air waybill itself it is the document’s own reference. On your commercial invoice and packing list it is a reference you add once the forwarder or airline gives it to you, usually after the booking is confirmed.',
        'Adding it to the commercial invoice and packing list lets the buyer’s broker tie the paperwork to the right consignment. Keep everything else on the air waybill consistent with those documents too: the Montreal Convention (Article 5) requires the air waybill to show the places of departure and destination and the weight of the consignment, and CBP’s advance data for air cargo includes the number of pieces, the weight and a description of the goods.',
      ],
      list: [
        'Copy the number exactly, with the prefix, and keep the hyphen after the third digit.',
        'Check it with the modulus 7 test before you send documents to the buyer.',
        'If you ship through a forwarder, record both the master and the house numbers.',
        'Make the piece count and gross weight on the packing list match what the air waybill will show.',
      ],
    },
  ],
  faq: [
    {
      q: 'How many digits is an AWB number?',
      a: 'Eleven. CBP and IATA both describe the standard air waybill number as 11 digits: a three-digit airline prefix, a seven-digit serial and a check digit.',
    },
    {
      q: 'Can an AWB number contain letters?',
      a: 'An airline’s air waybill number is digits only. A forwarder’s house air waybill number can mix letters and digits, up to 12 characters under CBP’s rule.',
    },
    {
      q: 'Why does my AWB number not track on the airline’s website?',
      a: 'Check three things: that the prefix belongs to that airline, that the check digit passes, and that you have not been given a house number, which only the forwarder can track.',
    },
    {
      q: 'Does the check digit prove the shipment exists?',
      a: 'No. It only shows the number is well formed. A number can pass the check and still be wrong, so confirm it with the forwarder or airline.',
    },
    {
      q: 'Is the AWB number the same on an electronic air waybill?',
      a: 'Yes. IATA’s e-AWB replaces the paper document, not the numbering: the air waybill number keeps the same 11-digit IATA standard format.',
    },
  ],
  sources: [
    'e1-cfr-19-122-48a-awb-number',
    'e1-iata-dg-autocheck-awb',
    'e1-abf-awb-check-digit',
    'a4-iata-e-awb',
    'a4-montreal-convention',
    'b1-cfr-19-122-48a',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/chargeable-weight', '/tools/invoice-generator'],
  callout: {
    afterSection: 3,
    tool: '/tools/packing-list-generator',
    title: 'Put the AWB number on a matching packing list',
    text: 'Enter each piece with its dimensions and weights, add the air waybill number as a reference, and download a packing list PDF that agrees with what the airline will show.',
  },
  related: [
    '/blog/mawb-vs-hawb',
    '/guides/air-waybill',
    '/guides/chargeable-weight',
    '/blog/incoterms-for-air-freight',
    '/blog/air-freight-vs-sea-freight',
  ],
  cover: {
    id: '8JRYdYXJ8f4',
    src: 'https://images.unsplash.com/photo-1572017235244-8f2c23b76559',
    width: 5184,
    height: 3456,
    alt: 'An aircraft taking off over a cargo dock, the kind of flight an air waybill number identifies',
    caption: 'An aircraft climbing over a cargo dock',
    photographer: { name: 'Ye R', profile: 'https://unsplash.com/@solutionrong' },
    page: 'https://unsplash.com/photos/an-airplane-is-flying-over-a-cargo-dock-8JRYdYXJ8f4',
  },
};

export default article;
