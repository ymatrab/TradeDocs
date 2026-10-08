import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, Google, 2026-10-08): "bill of lading number" 390 (US), KD 7; CA 50.
 * Plan: docs/research/content-plan-v4-2026-10-08.md, wave E, group 1.
 * Number format from 19 CFR 4.7a (US vessel manifest rule) and the NMFTA's SCAC page; the
 * issuers from 46 U.S.C. 40102 and the FMC; the bill's role from the UCC, ITA and Hague-Visby.
 * Carrier help pages on booking references did not load, so carrier practice is described
 * generally and hedged. The SCAC XXXX and every number in the examples are invented.
 */
const article: ContentArticle = {
  slug: 'bill-of-lading-number',
  title: 'Bill of lading number: who issues it and where to find it',
  metaTitle: 'Bill of lading number: format and where to look',
  description:
    'The bill of lading number identifies your ocean shipment’s contract of carriage. Who issues it, how it is built for US cargo, where to find it, and how it differs from the booking number.',
  lede: 'The buyer asks for the B/L number, the broker asks for it, and the carrier’s tracking page wants it. It is printed at the top of the bill of lading, but it is easy to confuse with the booking number, the container number or a forwarder’s house reference.',
  answer:
    'A bill of lading number is the unique reference the carrier, NVOCC or forwarder gives the bill of lading it issues. For cargo arriving in the US, 19 CFR 4.7a makes it up to 16 characters: the issuer’s four-letter SCAC, then up to 12 letters or digits, never reused for 3 years.',
  keyFacts: [
    'Under 19 CFR 4.7a, every bill of lading, whether issued by a carrier, freight forwarder or other issuer, must carry a unique identifier of up to 16 characters.',
    'Under 19 CFR 4.7a, the first four characters are the issuer’s Standard Carrier Alpha Code (SCAC) and the rest, up to 12 characters, may be letters or digits.',
    'Under 19 CFR 4.7a, the issuer may not use the same identifier for another bill of lading for 3 years after issue.',
    'The NMFTA describes the SCAC as the freight industry’s universal carrier identifier and says it issues and governs SCACs exclusively.',
    'Under 46 U.S.C. 40102, an NVOCC is a common carrier that does not operate the vessels, so it can issue its own house bills of lading.',
  ],
  definitions: [
    {
      term: 'Bill of lading (B/L)',
      meaning:
        'The carrier’s receipt for the goods and the contract of carriage; a negotiable one is also a document of title.',
    },
    {
      term: 'SCAC',
      meaning:
        'Standard Carrier Alpha Code: the code, issued by the NMFTA, that identifies a carrier or bill issuer and starts a US bill of lading number.',
    },
    {
      term: 'Master bill of lading',
      meaning:
        'The ocean carrier’s bill for a consolidated shipment, usually issued to the NVOCC or forwarder that booked the space.',
    },
    {
      term: 'House bill of lading',
      meaning:
        'The bill an NVOCC or forwarder issues to each shipper whose goods travel under its master bill.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a bill of lading number?',
      paragraphs: [
        'It is the reference that identifies one bill of lading, and so one contract of carriage for your goods. The ITA describes the bill of lading as the contract between the owner of the goods and the carrier; under the Uniform Commercial Code it is also the document evidencing that the carrier received the goods for shipment.',
        'Because the number identifies the contract, it is the reference everyone downstream uses: the carrier to track and release the cargo, the importer’s broker to match the entry to the manifest, and a bank to check documents under a letter of credit.',
      ],
    },
    {
      heading: 'Who issues the bill of lading number?',
      paragraphs: [
        'Whoever issues the bill of lading. That is the ocean carrier when you book directly with a shipping line, or an NVOCC when you book with a forwarder that issues its own bills. Under 46 U.S.C. 40102, an NVOCC is a common carrier that does not operate the vessels by which the ocean transportation is provided, and the FMC licenses US-based NVOCCs and ocean freight forwarders.',
        'You do not choose the number, and it is not printed until the issuer has your shipping instructions. Your part is to send those instructions with the correct parties, marks, package count, weights and description, because those details and the number end up on the same document.',
      ],
    },
    {
      heading: 'How is a US bill of lading number built?',
      paragraphs: [
        'In two elements, under CBP’s vessel manifest rule. 19 CFR 4.7a requires every bill of lading for cargo arriving in the US to carry a unique identifier of up to 16 characters. The first four characters are the issuer’s SCAC; the second element, up to 12 characters, may be letters, digits or both. The identifier may not be reused for another bill for 3 years.',
        'Outside US trade, there is no single public format, so treat the number as the issuer writes it and copy it character for character.',
      ],
      table: {
        caption: 'An invented US bill of lading number read part by part',
        head: ['Part', 'Characters', 'In the invented number XXXX2026A0001234'],
        rows: [
          ['Issuer’s SCAC', '4 letters', 'XXXX (invented)'],
          ['Issuer’s own reference', 'Up to 12 letters or digits', '2026A0001234'],
          ['Whole identifier', 'Up to 16 characters', 'XXXX2026A0001234'],
        ],
      },
    },
    {
      heading: 'Where do you find the bill of lading number?',
      paragraphs: [
        'At the top of the bill of lading, in the box labelled B/L number or bill of lading number. It also appears on the draft bill the issuer sends for your approval, and it is the reference the issuer’s tracking uses.',
        'If your goods were consolidated, there are two numbers. The house bill from your forwarder carries the forwarder’s number; the master bill from the ocean carrier carries the carrier’s. Under 19 CFR 4.7a, the cargo declaration reports the bill numbers at master or house level as applicable, so your buyer’s broker may need both.',
      ],
      steps: [
        'Open the bill of lading or the draft sent for approval and read the number box at the top.',
        'Check whose name and code head the document: an ocean carrier or an NVOCC.',
        'If it is an NVOCC’s house bill, ask the forwarder for the master bill number as well.',
        'Copy both numbers exactly, with every letter, into your records and your message to the buyer.',
      ],
    },
    {
      heading: 'Is the booking number the same as the bill of lading number?',
      paragraphs: [
        'Not necessarily. The booking number is the reference the carrier or forwarder gives when it accepts your reservation of space, before any goods are loaded. The bill of lading number identifies the issued bill, after the goods are received or shipped. Some issuers reuse the booking reference as the bill number; others do not, so check the issued bill rather than assuming.',
      ],
      table: {
        caption: 'Booking number, bill of lading number and container number',
        head: ['', 'Booking number', 'Bill of lading number', 'Container number'],
        rows: [
          [
            'Identifies',
            'Your space reservation',
            'The contract and receipt for your goods',
            'One physical box',
          ],
          [
            'When you get it',
            'When the booking is confirmed',
            'When the bill is drafted or issued',
            'When a container is released or loaded',
          ],
          [
            'Issued by',
            'Carrier or forwarder',
            'Carrier, NVOCC or forwarder',
            'The owner, under a BIC-registered code',
          ],
          [
            'Used for',
            'Releasing an empty box and the cut-offs',
            'Tracking, customs and releasing cargo',
            'Tracking the box at the terminal',
          ],
        ],
      },
    },
    {
      heading: 'What else on the bill must match your documents?',
      paragraphs: [
        'Everything that describes the goods. Under the Hague-Visby Rules, the carrier issues on demand a bill showing the marks, the number of packages or the weight, and the apparent order and condition of the goods, which it takes from what the shipper declares. Under 19 CFR 4.7a, the US cargo declaration needs the quantity of the lowest external packaging unit and a precise description, and CBP says generic descriptions are not acceptable.',
        'So write the shipping instructions from your commercial invoice and packing list, and check the draft bill against them before you approve it. A number in the right box does not help if the package count beside it disagrees with the packing list.',
      ],
      list: [
        'Shipper, consignee and notify party, as on the commercial invoice.',
        'Number and type of packages, as on the packing list, not the number of pallets or containers alone.',
        'Gross weight and volume, as on the packing list.',
        'A plain description of the goods that matches the invoice.',
        'Container and seal numbers for a full container load.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I track a shipment with the bill of lading number?',
      a: 'Yes, with whoever issued the bill. A house bill number tracks with the forwarder; the master bill number tracks with the ocean carrier.',
    },
    {
      q: 'How long is a bill of lading number?',
      a: 'For cargo arriving in the US, up to 16 characters under 19 CFR 4.7a: a four-character SCAC and up to 12 more. Elsewhere the length depends on the issuer.',
    },
    {
      q: 'Does a sea waybill have a number too?',
      a: 'Yes. A sea waybill is identified by its own reference in the same way, but it is not a document of title, so the consignee does not need to present it to collect the goods.',
    },
    {
      q: 'Who gets a SCAC?',
      a: 'Carriers and bill issuers apply to the NMFTA, which issues and governs SCACs. An exporter does not need one to receive a bill of lading.',
    },
    {
      q: 'Should the bill of lading number go on the commercial invoice?',
      a: 'It is not a standard invoice field, but a buyer or a bank may ask for it as a reference. Add it once the bill is issued, copied exactly.',
    },
  ],
  sources: [
    'e1-cfr-19-4-7a',
    'e1-nmfta-scac',
    'b5-usc-46-40102',
    'b7-fmc-oti',
    'trade-gov-export-documents',
    'w4-cornell-ucc-1-201',
    'b5-hague-visby-art-3',
    'dcsa-sea-waybill',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/packing-list-generator', '/tools/incoterms'],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Give the bill of lading the right details',
    text: 'Make the commercial invoice from one form, with the parties, goods and values your shipping instructions will copy, and add the bill of lading number once it is issued.',
  },
  related: [
    '/guides/what-is-a-bill-of-lading',
    '/guides/types-of-bill-of-lading',
    '/blog/container-number-format',
    '/guides/shipper-consignee-notify-party',
    '/blog/shippers-letter-of-instruction',
    '/blog/letter-of-credit-documents',
  ],
  cover: {
    id: 'l_nECkZrCuk',
    src: 'https://images.unsplash.com/photo-1648050081277-b8da65e581bf',
    width: 12000,
    height: 8000,
    alt: 'A large container ship moored at a quay, the voyage a bill of lading number identifies',
    caption: 'A large cargo ship docked at a quay',
    photographer: { name: 'Freysteinn G. Jonsson', profile: 'https://unsplash.com/@freys' },
    page: 'https://unsplash.com/photos/a-large-cargo-ship-docked-at-a-dock-l_nECkZrCuk',
  },
};

export default article;
