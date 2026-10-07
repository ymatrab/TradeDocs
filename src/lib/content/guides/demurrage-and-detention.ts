import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06/07): "demurrage" 6,600, KD 16; "demurrage meaning" 3,600, KD 11;
 * "demurrage vs detention" 480.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A (v2 #26).
 */
const article: ContentArticle = {
  slug: 'demurrage-and-detention',
  title: 'Demurrage and detention: what they mean and when they start',
  metaTitle: 'Demurrage vs detention: the difference',
  description:
    'What demurrage and detention charges are, when free time ends and each charge starts, what a US invoice for them must show under FMC rules, and how to dispute one.',
  lede:
    'A container that sits too long costs money twice over: once while it waits in the terminal, and again while you keep the box. Those are demurrage and detention, and both start when the free time runs out.',
  answer:
    'Demurrage is charged when a container stays at the marine terminal beyond its free time. Detention is charged for keeping the carrier’s container or other equipment beyond the free time once it has left the terminal. In the US, the Federal Maritime Commission sets rules for how carriers and terminals bill both charges.',
  keyFacts: [
    'The FMC says demurrage accrues when a container exceeds free time on a marine terminal.',
    'The FMC describes detention as charged for extended use of intermodal equipment.',
    'Under 46 CFR 541.7, a demurrage or detention invoice must be issued within 30 calendar days of the date the charge was last incurred.',
    'Under 46 CFR 541.5, an invoice missing any required information removes the billed party’s obligation to pay the charge.',
    'Under 46 CFR 541.8, the billed party has at least 30 calendar days from the invoice date to request mitigation, refund or waiver.',
  ],
  definitions: [
    {
      term: 'Free time',
      meaning:
        'The period a container may stay at the terminal, or be kept by the merchant, before charges begin.',
    },
    {
      term: 'Demurrage',
      meaning: 'A charge for a container staying at the marine terminal after its free time.',
    },
    {
      term: 'Detention',
      meaning:
        'A charge for keeping the carrier’s container or equipment after its free time; US rules include per diem charges in the term.',
    },
    {
      term: 'Billed party',
      meaning:
        'Under 46 CFR 541.3, the person who receives the invoice and is responsible for paying the charge.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is demurrage?',
      paragraphs: [
        'It is the charge for a container that stays at the marine terminal too long. The Federal Maritime Commission says demurrage accrues when a container exceeds free time on a marine terminal. The terminal space is the resource being paid for.',
        'In US regulation the two terms are defined together. 46 CFR 541.3 treats demurrage or detention as charges, including per diem charges, assessed by ocean common carriers, marine terminal operators or non-vessel-operating common carriers for the use of marine terminal space or shipping containers.',
      ],
    },
    {
      heading: 'What is detention?',
      paragraphs: [
        'It is the charge for keeping the equipment too long. The FMC describes detention as charged for extended use of intermodal equipment: once a container has left the terminal, the clock runs on the box itself until it is returned.',
        'For an importer, that usually means the time between picking up a loaded container and returning it empty. For an exporter, it is the time between collecting an empty container to load and delivering it back full. The free time for each comes from the carrier’s or terminal’s terms, so it varies by contract and port.',
      ],
    },
    {
      heading: 'How do demurrage and detention compare?',
      paragraphs: [
        'The difference is where the container is when the free time ends. Many invoices show both, and the FMC’s rules apply to each in the same way.',
      ],
      table: {
        caption: 'Demurrage and detention compared, from FMC definitions',
        head: ['', 'Demurrage', 'Detention'],
        rows: [
          [
            'What it pays for',
            'Container staying at the marine terminal',
            'Use of the container or equipment outside the terminal',
          ],
          [
            'When it starts',
            'Once terminal free time is exceeded',
            'Once equipment free time is exceeded',
          ],
          [
            'Who can bill it (US)',
            'Carrier, terminal operator or NVOCC',
            'Carrier, terminal operator or NVOCC',
          ],
          ['US billing rules', '46 CFR part 541', '46 CFR part 541'],
        ],
      },
    },
    {
      heading: 'How do the charges add up on a shipment?',
      paragraphs: [
        'Day by day once free time ends, which is why delays in release matter. The worked example below uses invented dates and invented free time; your own figures come from the carrier’s or terminal’s published terms. It shows only the count of chargeable days, not any rate.',
      ],
      table: {
        caption: 'Worked example with invented dates and free time (no rates)',
        head: ['Step', 'Invented date', 'Effect'],
        rows: [
          [
            'Container discharged at the terminal',
            '1 March',
            'Terminal free time starts (5 invented days)',
          ],
          ['Terminal free time ends', '5 March', 'Demurrage begins the next day'],
          [
            'Customs release and pick-up',
            '8 March',
            '3 days of demurrage; equipment free time starts (4 invented days)',
          ],
          ['Equipment free time ends', '11 March', 'Detention begins the next day'],
          ['Empty container returned', '13 March', '2 days of detention'],
        ],
      },
    },
    {
      heading: 'What must a US demurrage or detention invoice show?',
      paragraphs: [
        'The FMC’s rule lists the minimum. Under 46 CFR 541.6, the invoice includes the bill of lading and container numbers, the port of discharge and the basis for liability, the invoice and due dates, the allowed free time with its start and end dates, and the specific dates charged.',
        'It must also give contact details for questions and a digital pointer, such as a URL or QR code, to the dispute process, with the timeframes for requesting mitigation or refund. Under 46 CFR 541.5, leaving out any of the required information eliminates the billed party’s obligation to pay.',
      ],
    },
    {
      heading: 'How do you dispute a demurrage or detention charge?',
      paragraphs: [
        'Within the window the rules set, and with the dates in hand. The FMC rules give the billed party time to ask and the billing party a deadline to respond.',
      ],
      steps: [
        'Check that the invoice was issued within 30 calendar days of the date the charge was last incurred; 46 CFR 541.7 says a late charge need not be paid.',
        'Check each item 46 CFR 541.6 requires, including the free time and the exact dates charged.',
        'Compare the dates with your own records: discharge, availability, customs release, pick-up and return.',
        'Send the request for mitigation, refund or waiver through the process shown on the invoice, within the window it states; 46 CFR 541.8 sets that at no less than 30 calendar days from the invoice date.',
        'Expect the billing party to attempt to resolve it within 30 calendar days of receiving your request, unless you agree a later date.',
      ],
    },
    {
      heading: 'How do correct documents help avoid the charges?',
      paragraphs: [
        'They remove one reason a container waits. If goods sit at the terminal past free time while a missing or inconsistent document is sorted out, those days can become demurrage. A commercial invoice and packing list that match each other and the bill of lading give the broker what it needs at the first attempt.',
        'Plan the return leg as well. Booking the truck and the empty return before free time ends is the importer’s side of detention, and knowing the cargo’s volume and weight in advance helps the trucker and the warehouse plan the unload.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is detention the same as per diem?',
      a:
        'In the US rules they are treated together: 46 CFR 541.3 defines demurrage or detention to include per diem charges for the use of shipping containers.',
    },
    {
      q: 'Who pays demurrage, the shipper or the consignee?',
      a:
        'It depends on the contract and the Incoterms® 2020 rule agreed. Under 46 CFR 541.3, the billed party is the person who receives the invoice and is responsible for paying it.',
    },
    {
      q: 'Can a carrier send a demurrage invoice months later?',
      a:
        'In the US, 46 CFR 541.7 requires issue within 30 calendar days of the date the charge was last incurred; otherwise the billed party is not required to pay.',
    },
    {
      q: 'Where do I find the free time for my container?',
      a:
        'In the carrier’s or terminal’s published terms and your contract or quote. The FMC rules require the invoice to state the allowed free time and its start and end dates.',
    },
  ],
  sources: [
    'a5-fmc-detention-demurrage',
    'a5-cfr-46-541-3',
    'a5-cfr-46-541-5',
    'a5-cfr-46-541-6',
    'a5-cfr-46-541-7',
    'a5-cfr-46-541-8',
  ],
  primaryTool: '/tools/landed-cost-calculator',
  tools: [
    '/tools/landed-cost-calculator',
    '/tools/packing-list-generator',
    '/tools/cbm-calculator',
  ],
  callout: {
    afterSection: 4,
    tool: '/tools/packing-list-generator',
    title: 'Send a packing list that matches the invoice',
    text:
      'Build the packing list from the same items as the commercial invoice, so the broker has consistent documents before the container lands.',
  },
  related: [
    '/guides/lcl-vs-fcl',
    '/guides/shipping-container-sizes',
    '/guides/what-is-a-bill-of-lading',
    '/blog/how-long-does-customs-clearance-take',
    '/guides/landed-cost',
  ],
  cover: {
    id: 'Annl9CjEaEs',
    src: 'https://images.unsplash.com/photo-1678182451047-196f22a4143e',
    width: 5464,
    height: 3640,
    alt:
      'Rows of shipping containers stacked at the Dar es Salaam port terminal, where free time runs',
    caption: 'Containers stacked at the port of Dar es Salaam',
    photographer: { name: 'Ali Mkumbwa', profile: 'https://unsplash.com/@mkumbwajr' },
    page:
      'https://unsplash.com/photos/a-large-amount-of-containers-are-stacked-on-top-of-each-other-Annl9CjEaEs',
  },
};

export default article;
