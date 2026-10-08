import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-09';

/**
 * Demand (DataForSEO, Google, 2026-10-08): "container number" 170 (US), KD 24; AU 70; CA 30;
 * "container number format" 20.
 * Plan: docs/research/content-plan-v4-2026-10-08.md, wave E, group 1.
 * Format from BIC (the ISO 6346 owner-code register); manifest data from 19 CFR 4.7a; seals
 * from CBP. The check-digit arithmetic is not reproduced: BIC does not publish it on the page
 * cited, so the post points to BIC's calculator instead. Example numbers are BIC's own or invented.
 */
const article: ContentArticle = {
  slug: 'container-number-format',
  title: 'Container number format: owner code, serial and check digit',
  metaTitle: 'Container number format under ISO 6346',
  description:
    'A shipping container number is four letters, six digits and a check digit. What each part means under ISO 6346, how to spot a mistyped number, and where it goes on your papers.',
  lede: 'Every shipping container in international use is painted with the same kind of code: four capital letters, six digits and a final digit in a box. Read once, it tells you who owns the box and lets you catch a typing error before it reaches the bill of lading or the customs filing.',
  answer:
    'A container number has eleven characters under ISO 6346: a three-letter owner code registered with BIC, an equipment letter (U for freight containers), a six-digit serial number and a check digit. BIC’s own example is BICU 123456 5. The check digit is calculated from the ten characters before it.',
  keyFacts: [
    'BIC, the Bureau International des Containers, originated the container owner-code register, which ISO adopted in 1972 and which BIC still maintains as part of ISO 6346.',
    'BIC lists the equipment category letters as U for freight containers, J for detachable freight container-related equipment and Z for trailers and chassis.',
    'BIC says the check digit validates the recording and transmission of the owner code and serial number, and must be recalculated if a container is re-marked with another code.',
    'Under 19 CFR 4.7a, the cargo declaration for goods arriving in the US by vessel must state the container numbers and the seal numbers for containerised shipments.',
    'BIC states that only codes registered with it may be used as a unique identity marking on containers in international documents.',
  ],
  definitions: [
    {
      term: 'ISO 6346',
      meaning:
        'The international standard for coding, identifying and marking freight containers, including the owner code, serial, check digit and size and type code.',
    },
    {
      term: 'BIC code',
      meaning:
        'The three-letter owner code plus the equipment letter, registered with the Bureau International des Containers; also called the container prefix.',
    },
    {
      term: 'Check digit',
      meaning:
        'The eleventh character of a container number, calculated from the first ten so that a wrong letter or digit can be detected.',
    },
    {
      term: 'Seal number',
      meaning:
        'The number on the seal that locks the container doors, recorded separately from the container number on the shipping documents.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a container number?',
      paragraphs: [
        'It is the unique identity of one physical container. The number is painted on the container itself, and it stays with the box from trip to trip, whoever books it, unless the box is re-marked with a new owner code. BIC describes the system as providing a uniform international identification of containers, and it guarantees that the identification is unique.',
        'The container number identifies the box, not your shipment. Your shipment is identified by the booking and the bill of lading; the container number tells the carrier, the terminal and customs which box the goods are in.',
      ],
    },
    {
      heading: 'How is a container number structured?',
      paragraphs: [
        'Four letters, six digits and one check digit, in that order. BIC’s description of the ISO 6346 code splits it into four parts, shown here on BIC’s own example number.',
      ],
      table: {
        caption: 'The parts of a container number, on BIC’s sample number BICU 123456 5',
        head: ['Characters', 'In the sample', 'What it is'],
        rows: [
          ['1–3', 'BIC', 'Owner code: three capital letters for the owner or principal operator'],
          ['4', 'U', 'Equipment category: U freight container, J related equipment, Z trailer or chassis'],
          ['5–10', '123456', 'Serial number: six digits chosen by the owner or operator'],
          ['11', '5', 'Check digit: one digit calculated from the ten characters before it'],
        ],
      },
    },
    {
      heading: 'What does the owner code tell you?',
      paragraphs: [
        'Who owns or principally operates the container. That may be the shipping line carrying your goods, a container leasing company or a shipper that owns its own boxes, so the owner code does not always match the carrier on your bill of lading.',
        'Owner codes are registered. BIC says the register it maintains is the one ISO adopted, and that only BIC-registered codes may be used as a unique identity marking in international documents. If you do not recognise an owner code, ask the carrier or forwarder whose container it is rather than guessing from the letters.',
      ],
    },
    {
      heading: 'What does the fourth letter mean?',
      paragraphs: [
        'It is the equipment category. For the boxes exporters book, it is almost always U, which BIC lists as freight containers. J marks detachable freight container-related equipment, and Z marks trailers and chassis.',
        'A number with any other letter in fourth place has been misread or mistyped. That is a quick check worth doing when a number is copied from a photo or a handwritten tally sheet.',
      ],
    },
    {
      heading: 'How do you check a container number?',
      paragraphs: [
        'Run it through a check-digit calculator, after a quick visual check of the shape. BIC explains that the check digit is calculated by an algorithm that takes both the owner code and the serial number into account, and it publishes a calculator that flags errors from data entry or optical character recognition.',
      ],
      steps: [
        'Remove spaces and count the characters: there must be eleven.',
        'Check that characters 1–4 are capital letters and characters 5–11 are digits.',
        'Check that the fourth letter is U, J or Z; for a shipping container it should be U.',
        'Enter the first ten characters into BIC’s check-digit calculator and compare its result with the eleventh character.',
        'If they differ, go back to the source: a photo of the container doors, the carrier’s release or the forwarder’s load confirmation.',
      ],
    },
    {
      heading: 'How is a container number different from a seal number?',
      paragraphs: [
        'The container number identifies the box; the seal number identifies the lock put on its doors for one trip. A container keeps its number across many trips, while a seal is applied each time the box is packed and closed, so the seal number changes with every shipment.',
        'Both are recorded. Under 19 CFR 4.7a, the cargo declaration for goods arriving in the US by vessel states the container numbers and the seal numbers. CBP’s seal guidance for manufacturers calls for high-security seals meeting ISO/PAS 17712 and for seal information to be carried on manifests, bills of lading and electronic transmissions.',
      ],
      table: {
        caption: 'Four references on a container shipment compared',
        head: ['Reference', 'Identifies', 'Issued by', 'Changes each shipment?'],
        rows: [
          ['Container number', 'The physical box', 'The owner, under a BIC-registered code', 'No'],
          ['Seal number', 'The seal on the doors', 'Printed on the seal; recorded by whoever seals the box', 'Yes'],
          ['Booking number', 'Your reservation of space', 'The carrier or forwarder', 'Yes'],
          ['Bill of lading number', 'The contract and receipt for your goods', 'The carrier or NVOCC', 'Yes'],
        ],
      },
    },
    {
      heading: 'Where does the container number go on your documents?',
      paragraphs: [
        'On the bill of lading and the carrier’s manifest, and on your own papers once you know it. For a full container load, the carrier or forwarder usually releases an empty container to you or your packer, so its number is known before loading starts. For a less-than-container load, the consolidator chooses the container, and you may only learn the number when the bill of lading is issued.',
        'Copy it exactly, owner code and check digit included. A wrong digit does not change where the box goes, but it breaks the link between your documents and the container that customs, the terminal and your buyer are looking for.',
      ],
      list: [
        'On the packing list or container load plan, beside the seal number, for a full container load.',
        'On the commercial invoice as a shipment reference, if your buyer or their broker asks for it.',
        'In the shipping instructions you send the carrier, so it prints on the bill of lading.',
        'In messages to the buyer, together with the bill of lading number, so they can track the box.',
      ],
    },
  ],
  faq: [
    {
      q: 'How many characters are in a container number?',
      a: 'Eleven: four letters followed by seven digits, the last of which is the check digit. It is often written with spaces, as in BIC’s example BICU 123456 5.',
    },
    {
      q: 'Can I tell the shipping line from the container number?',
      a: 'Only the owner. The owner code identifies the owner or principal operator, which may be a leasing company rather than the carrier on your bill of lading.',
    },
    {
      q: 'Does the container number show the container size?',
      a: 'No. Size and type are a separate marking, the size and type code, which ISO 6346 also describes. The guide to shipping container sizes covers the common boxes.',
    },
    {
      q: 'Can a container number change?',
      a: 'It can if the container is sold and re-marked with a new owner code. BIC says the check digit must then be recalculated for the new code.',
    },
    {
      q: 'Why does customs need the container number?',
      a: 'To link the goods declared to a physical box. In the US, 19 CFR 4.7a requires container and seal numbers in the vessel cargo declaration.',
    },
  ],
  sources: ['e1-bic-codes', 'e1-bic-check-digit', 'e1-cfr-19-4-7a', 'c6-cbp-seal-requirements'],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/cbm-calculator', '/tools/invoice-generator'],
  callout: {
    afterSection: 4,
    tool: '/tools/packing-list-generator',
    title: 'Record the container and seal on your packing list',
    text: 'List every package with its marks, dimensions and weights, add the container and seal numbers as references, and download a packing list PDF for the carrier and the buyer.',
  },
  related: [
    '/guides/shipping-container-sizes',
    '/blog/container-load-plan',
    '/blog/bill-of-lading-number',
    '/blog/shipping-container-weight-limits',
    '/guides/lcl-vs-fcl',
    '/blog/how-many-cbm-fit-in-a-container',
  ],
  cover: {
    id: 'BbiG_iYlTHk',
    src: 'https://images.unsplash.com/photo-1589725971583-8fa4d89e5e33',
    width: 5847,
    height: 3899,
    alt: 'The closed steel doors of a grey shipping container, where its container number is painted',
    caption: 'The doors of a grey shipping container',
    photographer: { name: 'Waldemar Brandt', profile: 'https://unsplash.com/@waldemarbrandt67w' },
    page: 'https://unsplash.com/photos/blue-and-white-metal-locker-BbiG_iYlTHk',
  },
};

export default article;
