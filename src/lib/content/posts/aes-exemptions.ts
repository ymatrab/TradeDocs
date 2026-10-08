import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "aes exemption" 260, KD 11.
 * Plan: docs/research/content-plan-v3-2026-10-07.md (v2 #57), wave D. Angle: the common
 * exemptions from filing EEI and the exemption legend; regulated, so every rule is quoted from
 * the Foreign Trade Regulations (15 CFR part 30) on eCFR, opened 2026-10-08. No Schedule B
 * number is suggested for any product; example parties and values are invented.
 */
const article: ContentArticle = {
  slug: 'aes-exemptions',
  title: 'AES exemptions: when a US export needs no EEI filing',
  metaTitle: 'AES exemption: when you do not file EEI',
  description:
    'The common exemptions from filing Electronic Export Information in AES under 15 CFR part 30, how the $2,500 line rule works, the NOEEI legend, and when you file anyway.',
  lede: 'Most US exports above a modest value need Electronic Export Information filed in the Automated Export System before they leave. The Foreign Trade Regulations also list shipments that need no filing at all. Knowing which exemption applies, and how to show it on the paperwork, saves a filing you do not need and stops you skipping one you do.',
  answer:
    'An AES exemption is a provision of the Foreign Trade Regulations (15 CFR part 30) under which a US export needs no Electronic Export Information filed in AES. Common ones cover goods to Canada, Schedule B lines of $2,500 or less and some temporary exports. Goods needing an export licence are filed regardless of value.',
  keyFacts: [
    'Under 15 CFR 30.37(a), EEI is not required for a Schedule B or HTSUSA line valued at $2,500 or less, regardless of the total shipment value.',
    'Under 15 CFR 30.36, shipments whose country of ultimate destination is Canada are exempt from EEI, unless they are stored in or move through Canada to a third country.',
    'Under 15 CFR 30.2(a)(1)(iv), EEI must be filed for shipments needing a BIS, State Department or other agency licence, regardless of value and notwithstanding any exemption.',
    'Under 15 CFR 30.35, an exempt shipment carries an exemption legend on the bill of lading, air waybill or other loading document and on the carrier’s outbound manifest.',
    'Appendix B to 15 CFR part 30 sets the legend format, such as NOEEI § 30.37(a) for low-value lines and NOEEI § 30.36 for Canada.',
  ],
  definitions: [
    {
      term: 'Electronic Export Information (EEI)',
      meaning:
        'The export data, such as parties, commodity classification, value and destination, filed in the Automated Export System under 15 CFR part 30.',
    },
    {
      term: 'Exemption legend',
      meaning:
        'The NOEEI statement on the loading document and manifest that tells the carrier and CBP which section of the Foreign Trade Regulations exempts the shipment.',
    },
    {
      term: 'USPPI',
      meaning:
        'The US principal party in interest: the person in the United States that receives the primary benefit, monetary or otherwise, of the export transaction, as 15 CFR 30.1 defines it.',
    },
    {
      term: 'Schedule B number',
      meaning:
        'The Census Bureau’s commodity classification for US exports, found with its Schedule B search; the $2,500 exemption is tested per Schedule B or HTSUSA number.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is an AES exemption?',
      paragraphs: [
        'A rule in subpart D of the Foreign Trade Regulations (15 CFR part 30) that removes the duty to file EEI for a defined kind of shipment. The regulations are administered by the Census Bureau, and the exemptions sit in four sections: 30.36 for Canada, 30.37 for a long list of miscellaneous cases, 30.39 for the US armed services and 30.40 for certain shipments to US government agencies and employees.',
        'An exemption is narrow. It covers the shipment described in its paragraph and nothing more, and 15 CFR 30.37 adds that the Census Bureau can periodically require reporting of shipments that are normally exempt. It also changes only the filing duty under part 30. Export licensing under the Export Administration Regulations and the importing country’s rules apply as before.',
      ],
    },
    {
      heading: 'Which shipments are exempt from filing EEI?',
      paragraphs: [
        'The exemptions a small exporter meets most often are the low-value line rule, Canada and a handful of cases for goods that leave and come back. Each one in the table names its section, which is also the reference used in the exemption legend.',
      ],
      table: {
        caption:
          'Common EEI exemptions in 15 CFR part 30, subpart D (eCFR, retrieved 8 October 2026)',
        head: ['Exemption', 'Section', 'Main condition'],
        rows: [
          [
            'Low-value line',
            '30.37(a)',
            '$2,500 or less per Schedule B or HTSUSA number, from one USPPI to one consignee on one conveyance',
          ],
          [
            'Canada',
            '30.36',
            'Ultimate destination is Canada; not goods stored in or moving through Canada to a third country',
          ],
          [
            'Tools of trade',
            '30.37(b)',
            'Owned by and accompanying the traveller, not for sale, back within one year, not under a bill of lading or air waybill',
          ],
          [
            'Technology and software',
            '30.37(f)',
            'No export licence required; mass-market software is still filed',
          ],
          [
            'Temporary exports',
            '30.37(q)',
            'Not licensed, exported and returned within 12 months, shipped or hand carried (for example on a carnet)',
          ],
          [
            'Goods under a temporary import bond',
            '30.37(r)',
            'Returned in the same condition, such as samples or exhibition goods; not goods imported for processing',
          ],
          [
            'Baggage and personal effects',
            '30.37(p)',
            'Not shipped as cargo under a bill of lading or air waybill and not licensed',
          ],
        ],
      },
    },
    {
      heading: 'How does the $2,500 exemption work?',
      paragraphs: [
        'Line by line, not shipment by shipment. Under 15 CFR 30.37(a), the test is the value of the goods classified under one Schedule B or HTSUSA number, shipped from one USPPI to one ultimate consignee on a single exporting conveyance. A shipment worth $20,000 can still be exempt if no single classification carries more than $2,500.',
        'Three details catch people out. Items of the same Schedule B number are added together, so two invoice lines of $1,400 and $1,300 under one number total $2,700 and must be reported. Goods of domestic and foreign origin under the same number are reported separately, and EEI is required when either is over $2,500. And when a shipment mixes lines above and below the threshold, only the lines over $2,500 are reported.',
      ],
      table: {
        caption: 'Worked example with invented parties and figures',
        head: ['Invoice line', 'Schedule B grouping', 'Value', 'EEI for this line?'],
        rows: [
          ['Hand tools (US origin)', 'Number 1', '$1,800', 'No, $2,500 or less'],
          ['Power tool batteries (US origin)', 'Number 2', '$3,200', 'Yes, over $2,500'],
          [
            'Drill bits, two lines (US origin)',
            'Number 3',
            '$1,400 + $1,300 = $2,700',
            'Yes, same number is added',
          ],
          ['Saw blades (foreign origin)', 'Number 4', '$900', 'No, $2,500 or less'],
        ],
      },
    },
    {
      heading: 'When must you file EEI even though an exemption applies?',
      paragraphs: [
        'Whenever the goods are licensed or specially controlled. 15 CFR 30.2(a)(1)(iv) says EEI is filed for the shipments it lists regardless of value and notwithstanding the exemptions in subpart D. Most of the exemption sections open with the words “except as noted in § 30.2(a)(1)(iv)” for that reason.',
        'The regulation adds a note for exports to countries in Country Group E:1 or E:2 of the Export Administration Regulations, which follow 15 CFR 758.1(b)(1). Whether goods need a licence depends on their export control classification and destination; the Bureau of Industry and Security’s licensing pages and our ECCN and EAR99 guide explain how that question is answered, without suggesting a classification for any product.',
      ],
      list: [
        'Goods requiring a Bureau of Industry and Security (BIS) licence, or reporting under 15 CFR 758.1(b).',
        'Goods requiring a State Department (DDTC) licence under the ITAR, and ITAR items exempt from licensing unless the ITAR says otherwise.',
        'Goods requiring a Drug Enforcement Administration export permit or declaration.',
        'Goods requiring a Nuclear Regulatory Commission export licence, or a licence from any other federal agency.',
        'Rough diamonds in the HS subheadings the regulation lists, and used self-propelled vehicles as defined by CBP.',
      ],
    },
    {
      heading: 'How do you show an exemption on the shipping documents?',
      paragraphs: [
        'With an exemption legend. 15 CFR 30.35 requires a legend describing the basis for the exemption on the first page of the bill of lading, air waybill or other commercial loading document, and on the carrier’s outbound manifest. The legend cites the section or paragraph that provides the exemption, in the format set by appendix B to part 30.',
      ],
      steps: [
        'Group the invoice lines by Schedule B or HTSUSA number and origin, and total the value of each group.',
        'Check whether any line or the shipment as a whole falls under 15 CFR 30.2(a)(1)(iv); if it does, EEI is filed.',
        'Identify the exemption paragraph that matches the shipment, such as 30.37(a) for low-value lines or 30.36 for Canada.',
        'Write the legend in the appendix B format: NOEEI § 30.37(a), NOEEI § 30.36, or NOEEI § 30.37 followed by the matching paragraph letter.',
        'Give the legend to the carrier or forwarder with the shipping instructions, so it appears on the loading document and the manifest.',
        'Keep the invoice and your working with the shipment records, so the basis for the exemption can be shown later.',
      ],
    },
    {
      heading: 'Do samples and trade show goods need EEI?',
      paragraphs: [
        'Often not, if they come back. 15 CFR 30.37(q) exempts temporary exports that are not licensed and return to the US within 12 months, whether shipped or hand carried, and names the carnet as an example. Goods imported under a temporary import bond and sent back in the same condition, such as samples for taking orders or goods for exhibition, fall under 30.37(r).',
        'Samples you give away or sell abroad are ordinary exports. They follow the $2,500 line rule like any other goods, and they need a fair value on the commercial invoice; a sample is not worth nothing because no one paid for it. Tools of trade under 30.37(b) have a further condition that is easy to miss: they must travel with the person, not as cargo under a bill of lading or air waybill.',
      ],
    },
    {
      heading: 'Who decides that a shipment is exempt?',
      paragraphs: [
        'The party responsible for filing, which is usually the USPPI or its authorised agent. The forwarder may suggest a legend, but the facts behind it (classification, value per line, destination, whether a licence is needed) come from the exporter.',
        'If the exemption turns out to be wrong, the shipment left without required EEI. Check the facts before the goods are tendered, and when the answer is unclear, file: AES Direct, the Census Bureau’s free filing route, is one of the four filing methods 15 CFR 30.2(a)(2) lists. Our guide to EEI, AES and the ITN walks through a filing.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a shipment worth more than $2,500 always filed in AES?',
      a: 'No. Under 15 CFR 30.37(a), the $2,500 test applies to each Schedule B or HTSUSA number, not the shipment total. A large shipment made of many low-value classifications can be exempt, unless it needs a licence.',
    },
    {
      q: 'Do exports to Canada need EEI?',
      a: 'Usually not. 15 CFR 30.36 exempts shipments whose ultimate destination is Canada, except goods stored in Canada for third countries or moving through Canada elsewhere. Licensed goods are filed under 30.2(a)(1)(iv).',
    },
    {
      q: 'What does NOEEI mean on a bill of lading?',
      a: 'No Electronic Export Information was filed because an exemption applies. The legend that follows cites the section, such as NOEEI § 30.37(a), as appendix B to 15 CFR part 30 sets out.',
    },
    {
      q: 'Does an AES exemption mean no export licence is needed?',
      a: 'No. An exemption only removes the EEI filing duty under 15 CFR part 30. Licensing under the Export Administration Regulations or the ITAR is a separate question, and licensed goods are filed regardless.',
    },
    {
      q: 'Can I split an order to keep each line under $2,500?',
      a: 'The test is per USPPI, consignee and conveyance, and same-number lines are added together. Ship and declare the goods as the sale really is; do not arrange an order around the threshold.',
    },
  ],
  sources: [
    'd4-ecfr-15-30-37',
    'd4-ecfr-15-30-36',
    'd4-ecfr-15-30-2',
    'd4-ecfr-15-30-35',
    'd4-ecfr-15-30-appendix-b',
    'c6-ftr-30-1-parties',
    'w5-census-aes',
    'w5-census-schedule-b',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'See the value of each line before you decide',
    text: 'The $2,500 test reads straight off the commercial invoice. Build it with an HS code and country of origin on every line, then total the lines that share a classification.',
  },
  related: [
    '/guides/eei-aes-filing-itn',
    '/blog/schedule-b-number',
    '/guides/eccn-ear99-export-licence',
    '/guides/how-to-export-from-the-us',
    '/blog/export-compliance-checklist',
    '/blog/commercial-invoice-for-samples',
  ],
  cover: {
    id: 'Wai6_uvVT2g',
    src: 'https://images.unsplash.com/photo-1729695625265-ce84b5a45757',
    width: 5184,
    height: 2916,
    alt: 'A large cargo aircraft parked on an airport apron at night, the kind of flight export cargo leaves on',
    caption: 'A cargo aircraft on the apron at night',
    photographer: { name: 'Bornil Amin', profile: 'https://unsplash.com/@bornil' },
    page: 'https://unsplash.com/photos/an-airplane-is-parked-on-the-runway-at-night-Wai6_uvVT2g',
  },
};

export default article;
