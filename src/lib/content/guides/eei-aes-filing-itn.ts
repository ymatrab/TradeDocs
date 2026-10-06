import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-06';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "itn number" 4,400, KD 20; "aes filing" 1,300, KD 32;
 * "eei filing" 880; "what is an itn number" 480; "electronic export information" 260.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 */
const article: ContentArticle = {
  slug: 'eei-aes-filing-itn',
  title: 'EEI, AES filing and the ITN: what US exporters need to know',
  metaTitle: 'EEI and AES filing: what the ITN number is',
  description:
    'When a US export needs Electronic Export Information, who files it in AES, the deadlines by mode of transport, and what the ITN is and where it goes.',
  lede: 'For many US exports the last step before the goods leave is an electronic filing that the exporter never sees on paper. The filing produces one number, the ITN, which the carrier needs before it loads. This guide explains when the filing applies, who makes it and when.',
  answer:
    'Electronic Export Information (EEI) is the export data filed in the Automated Export System (AES). It is generally required when a Schedule B line is worth over $2,500 or the goods need a licence. When AES accepts a filing it returns an Internal Transaction Number (ITN), which goes to the carrier and onto the loading document.',
  keyFacts: [
    'Under 15 CFR 30.2, EEI is filed through AES by the USPPI, its authorized agent or the authorized US agent of the foreign party.',
    'Under 15 CFR 30.37, a Schedule B or HTSUSA line valued at $2,500 or less is exempt unless another filing requirement applies.',
    'Goods needing a BIS licence or controlled under the ITAR require EEI regardless of value (15 CFR 30.2).',
    'Exports whose ultimate destination is Canada are generally exempt from EEI under 15 CFR 30.36.',
    'The Census Bureau describes ACE AESDirect as the primary, free tool for filing EEI.',
  ],
  definitions: [
    {
      term: 'EEI (Electronic Export Information)',
      meaning:
        'The export data filed in AES, the electronic successor of the paper Shipper’s Export Declaration.',
    },
    {
      term: 'AES (Automated Export System)',
      meaning: 'The export component of CBP’s Automated Commercial Environment (ACE).',
    },
    {
      term: 'ITN (Internal Transaction Number)',
      meaning: 'The number AES assigns to confirm that an EEI filing was accepted and is on file.',
    },
    {
      term: 'USPPI',
      meaning:
        'The US principal party in interest: the person in the US that receives the primary benefit of the export.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is EEI?',
      paragraphs: [
        'EEI is the record of an export that the United States collects electronically. 15 CFR 30.1 calls it the electronic equivalent of the export data formerly collected on the Shipper’s Export Declaration, and it is filed through AES. Under 15 CFR 30.6 its mandatory data include the USPPI, the ultimate consignee, the country of ultimate destination, the commodity classification number and description, quantity, shipping weight, value and a licence code.',
        'The commercial invoice supplies much of this, but not all of it. 15 CFR 30.3 warns that invoices and other commercial documents may not contain all the information needed to prepare and file the EEI, so expect to gather a few details the invoice does not show, such as the port of export and the carrier.',
      ],
    },
    {
      heading: 'When is AES filing required?',
      paragraphs: [
        'The general rule, as the ITA summarises the Foreign Trade Regulations, is that EEI is required when the value of the goods classified under any one Schedule B number is over $2,500, or when there is a mandatory filing requirement such as an export licence.',
        'The $2,500 test is applied line by line. Under 15 CFR 30.37, a shipment that mixes lines under and over $2,500 only needs the lines over $2,500 reported, whatever the shipment’s total value; several items under the same Schedule B number are added together for the test. Some filings are required regardless of value: under 15 CFR 30.2 these include goods needing a BIS licence, defence articles under the ITAR, and used self-propelled vehicles, among others.',
        'There are exemptions. Under 15 CFR 30.36, exports to Canada are generally exempt, unless the goods are stored in Canada or moving through it to a third country. The full list of exemptions is in Subpart D of 15 CFR Part 30, and it is worth reading against your own shipment rather than relying on a summary.',
      ],
    },
    {
      heading: 'Who files the EEI?',
      paragraphs: [
        'The USPPI or an agent it authorises. 15 CFR 30.3 defines the USPPI as the person in the United States that receives the primary benefit of the transaction, usually the US seller; if a manufacturer sells directly to a foreign buyer, the manufacturer is the USPPI. You can authorise your freight forwarder to file for you.',
        'In a routed export transaction the foreign buyer authorises a US agent to arrange the export and file the EEI, and the USPPI still has responsibilities under 15 CFR 30.3, such as giving the agent accurate and timely export information. Whoever files must be physically in the United States, hold an EIN or DUNS number and be certified to report in AES, under 15 CFR 30.3.',
      ],
    },
    {
      heading: 'When must the EEI be filed?',
      paragraphs: [
        'Before the goods leave, by a deadline that depends on the mode of transport. 15 CFR 30.4 sets the predeparture filing times, and the ITN has to reach the carrier by then.',
      ],
      table: {
        caption: 'EEI predeparture filing deadlines under 15 CFR 30.4',
        head: ['Mode', 'File no later than'],
        rows: [
          ['Vessel', '24 hours before the cargo is loaded at the US port of lading'],
          ['Air', '2 hours before the aircraft’s scheduled departure'],
          ['Truck', '1 hour before the truck arrives at the US border'],
          ['Rail', '2 hours before the train arrives at the US border'],
          ['Mail', '2 hours before exportation'],
        ],
      },
    },
    {
      heading: 'What is an ITN number and where does it go?',
      paragraphs: [
        'The ITN is the receipt. 15 CFR 30.1 defines it as the AES-generated number confirming that an EEI transaction was accepted and is on file. Under 15 CFR 30.7, the filer gives this proof of filing citation to the exporting carrier, and it appears on the bill of lading, air waybill or other commercial loading document, clearly visible; in the regulation’s format the citation reads “AES” followed by the ITN.',
        'If no EEI is required, the loading document carries an exemption legend instead, citing the provision that applies. Either way the carrier needs one or the other before it accepts the cargo, so settle with your forwarder who will supply it.',
      ],
      steps: [
        'Check each Schedule B line against the $2,500 test and any licence requirement.',
        'Decide who files: you in AESDirect, or a forwarder you authorise in writing.',
        'Collect the data: parties, Schedule B numbers, values, quantities, weights, licence details, ports and carrier.',
        'File before the deadline for the mode of transport and wait for AES to accept it.',
        'Send the ITN to the carrier or forwarder for the bill of lading or air waybill.',
        'Keep the filing and the shipment documents for five years.',
      ],
    },
    {
      heading: 'How long must export records be kept?',
      paragraphs: [
        'Five years from the date of export. 15 CFR 30.10 requires the parties to the export, including the USPPI, authorised agents and carriers, to keep the documents relating to the shipment for that period, and longer where another agency’s rules, such as a licence condition, require it. Keep the EEI data, the ITN, the commercial invoice, the packing list and the transport document together so they can be produced on request.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does it cost anything to file EEI in AES?',
      a: 'The Census Bureau describes the ACE AESDirect portal as a free filing tool. A forwarder that files for you may charge for the service under its own terms.',
    },
    {
      q: 'Is the ITN the same as a tracking number?',
      a: 'No. The ITN is the confirmation that AES accepted your export filing. It does not track the goods; the carrier’s bill of lading or air waybill number does that.',
    },
    {
      q: 'Do I need EEI for a $3,000 shipment made of small lines?',
      a: 'Not necessarily. The test is per Schedule B number, so if no single line is worth over $2,500 and no other filing requirement applies, the shipment may be exempt. Show the exemption legend on the loading document.',
    },
    {
      q: 'Who is the USPPI if I sell to a US distributor that exports the goods?',
      a: 'Under 15 CFR 30.3, when a manufacturer sells goods as a domestic sale to a US buyer that then sells them for export, the US buyer is listed as the USPPI, not the manufacturer.',
    },
  ],
  sources: [
    'trade-gov-export-documents',
    'w5-ftr-30-1',
    'w5-ftr-30-3',
    'w5-ftr-30-4',
    'w5-ftr-30-6',
    'w5-ftr-30-7',
    'w5-ftr-30-10',
    'w5-ftr-30-36',
    'w5-ftr-30-37',
    'w5-census-aes',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/chargeable-weight'],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Start from a complete invoice',
    text: 'Much of the EEI data starts on the commercial invoice: parties, descriptions, HS codes, quantities, values and country of origin. Build the invoice first, then give your filer the details it adds.',
  },
  related: [
    '/guides/how-to-export-from-the-us',
    '/guides/hs-vs-hts-vs-schedule-b',
    '/blog/export-documents-checklist',
    '/guides/shipper-consignee-notify-party',
  ],
  cover: {
    id: 'CpsTAUPoScw',
    src: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec',
    width: 6000,
    height: 4000,
    alt: 'Container ships docked at a pier, loaded with freight containers ready to depart',
    caption: 'Cargo ships docked at the pier during the day',
    photographer: { name: 'Andy Li', profile: 'https://unsplash.com/@andylid0' },
    page: 'https://unsplash.com/photos/cargo-ships-docked-at-the-pier-during-day-CpsTAUPoScw',
  },
};

export default article;
