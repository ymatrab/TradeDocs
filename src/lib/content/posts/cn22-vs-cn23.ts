import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, 2026-10-06): "cn22" 170 (Google US); "cn23" 110 (US), 590 (UK).
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave B (v2 #33).
 */
const article: ContentArticle = {
  slug: 'cn22-vs-cn23',
  title: 'CN22 vs CN23: which postal customs form do you need?',
  metaTitle: 'CN22 vs CN23: which customs form to use',
  description:
    'The difference between the CN22 and CN23 postal customs declarations, the 300 SDR line between them, what each form asks for, and when a commercial invoice must travel too.',
  lede: 'Send goods abroad by post and the parcel needs a customs declaration: a CN22 or a CN23. Both are Universal Postal Union forms, and the choice depends on what you send and what it is worth. This post explains the line between them, what each one asks for, how the US Postal Service names them, and when a business shipment needs a commercial invoice as well.',
  answer:
    'A CN22 is the short customs declaration for letter-post items, such as small packets, whose contents are worth less than 300 SDR. A CN23 is the fuller declaration for parcels and for letter-post items worth more than that. Both are Universal Postal Union forms; commercial items may also need an invoice attached.',
  keyFacts: [
    'Under the WCO–UPU guidelines, a CN22 is used on letter-post items whose contents are worth less than 300 SDR.',
    'The same guidelines say a CN23 is used on parcels and on letter-post items whose contents exceed 300 SDR, because it is more detailed and speeds customs clearance.',
    'A parcel can carry a CP 72 manifold set instead of a CN23; the UPU notes that the CP 72 contains the CN23 information.',
    'From 1 September 2025, the six-digit HS code is mandatory on commercial postal items where the destination country requires it, according to the WCO–UPU guidelines.',
    'The USPS International Mail Manual names PS Form 2976 as the CN22 and PS Form 2976-A as the CP 72 customs declaration and dispatch note.',
  ],
  definitions: [
    {
      term: 'CN22',
      meaning:
        'The Universal Postal Union’s short customs declaration, affixed to letter-post items whose contents are worth less than 300 SDR.',
    },
    {
      term: 'CN23',
      meaning:
        'The fuller UPU customs declaration, used for parcels and for letter-post items whose contents are worth more than 300 SDR.',
    },
    {
      term: 'SDR (special drawing right)',
      meaning:
        'The monetary unit used between postal operators, with the currency code XDR; the UPU publishes national currency conversion factors by circular.',
    },
    {
      term: 'ITMATT',
      meaning:
        'The UPU’s electronic message that carries the data from a CN22 or CN23 to the destination country before the item arrives.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is the difference between a CN22 and a CN23?',
      paragraphs: [
        'The CN22 is the short form and the CN23 is the full one. The WCO–UPU guidelines on postal customs data describe both as the customs declaration forms for postal items set by the Acts of the Universal Postal Union, so customs officers in every member country can rely on them. The CN22 fits small, low-value letter-post items. The CN23 carries more detail about the sender, the goods and the shipment, and is used for parcels and for higher-value letter-post items.',
        'Neither is a carrier form in the courier sense. They belong to the postal system, so you use them when you send through a designated postal operator such as the US Postal Service. Express couriers run their own customs paperwork; FedEx, for example, requires a commercial invoice for all international commodity shipments.',
      ],
    },
    {
      heading: 'When do you use a CN22?',
      paragraphs: [
        'For letter-post items, such as small packets, whose contents are worth less than 300 SDR. That is the definition in the WCO–UPU guidelines. The SDR is the unit postal operators use between themselves; its value in pounds, dollars or euros moves with exchange rates, and the UPU publishes conversion factors by circular. Your postal operator states the limit in local currency, so check its current figure rather than converting it yourself.',
        'A CN22 is a small label with one box for the HS code and country of origin for the whole item, rather than one per article. It still asks for a detailed description, quantity, weight and value of the contents, the category of the item, and the sender’s signature.',
      ],
    },
    {
      heading: 'When do you need a CN23?',
      paragraphs: [
        'For every parcel, and for letter-post items whose contents are worth more than 300 SDR. The WCO–UPU guidelines explain that the CN23 is required above that value because it is more detailed and will speed customs clearance. A parcel may travel with a CP 72 manifold set instead, which contains the same CN23 information on several copies.',
        'Postal services can set stricter rules than the UPU minimum. The USPS, for example, requires its CP 72-based PS Form 2976-A on every Priority Mail International item whatever its value. If you are unsure which form a service needs, ask your postal operator before you post.',
      ],
    },
    {
      heading: 'What does each form ask for?',
      paragraphs: [
        'Both ask what is inside, what it weighs and what it is worth. The CN23 adds the fields that a commercial shipment needs. The table follows the field list in the WCO–UPU guidelines.',
      ],
      table: {
        caption: 'Main fields on the CN22 and the CN23',
        head: ['Field', 'CN22', 'CN23'],
        rows: [
          ['Sender’s name and address', 'Yes', 'Yes, including the business name'],
          [
            'Sender’s customs reference (such as VAT or EORI number)',
            'No field',
            'Where one supports import clearance',
          ],
          [
            'Category of item (gift, commercial sale, returned goods, documents, other)',
            'Yes',
            'Yes',
          ],
          ['Detailed description and quantity of each article', 'Yes', 'Yes'],
          ['Weight and value of each article, and totals', 'Yes', 'Yes'],
          ['HS code and country of origin', 'One box for the item', 'Per article'],
          ['Postage and insurance paid', 'No', 'Yes'],
          ['Invoice attached, with its number', 'Tick box', 'Tick box and reference number'],
          ['Office of origin and date of posting', 'No', 'Required'],
        ],
      },
    },
    {
      heading: 'Do you need a commercial invoice as well as a CN23?',
      paragraphs: [
        'Often, for goods you sell. The WCO–UPU guidelines ask the sender to tick the invoice box, give its number and attach an invoice for commercial items. The USPS International Mail Manual says a commercial invoice must be completed where required, and leaves it to the mailer to find out whether the destination country needs one.',
        'The two documents do different jobs. The CN23 is the postal declaration customs sees first. The invoice is the record of the sale: seller, buyer, terms and the price paid. Customs compares them, so the descriptions, quantities and values should match line for line. The guidelines note that where a commercial sender’s declared value is lower than its invoice, the destination post is expected to raise it with the origin post.',
      ],
    },
    {
      heading: 'What are the USPS names for the CN22 and CN23?',
      paragraphs: [
        'The USPS uses its own form numbers. Its International Mail Manual lists PS Form 2976 as the customs declaration under UPU form CN22, and PS Form 2976-A as the customs declaration and dispatch note under UPU form CP 72, which carries the CN23 information. The manual sets the form by mail class: all Priority Mail International items use PS Form 2976-A, for example, and First-Class Package International Service items are limited to $400 in value.',
        'The manual also requires the data to be sent electronically. Forms come from Click-N-Ship, the USPS customs form application or approved software, and a mailer who prints its own forms must transmit the declaration data before mailing. Each item needs a detailed description with quantity, net weight and value, and at least a six-digit HS code unless the country listing says otherwise.',
      ],
    },
    {
      heading: 'How do you fill in a postal customs declaration?',
      paragraphs: [
        'Work from the goods and your invoice, then copy the same facts onto the form or the postal operator’s online system.',
      ],
      steps: [
        'Choose the form: a CN22 for a letter-post item worth less than your operator’s 300 SDR limit, a CN23 (or CP 72) for any parcel or a higher-value item.',
        'Tick one category for the item: gift, commercial sale, e-commerce goods, returned goods, documents or other.',
        'Describe each article plainly: what it is, what it is made of and what it is for. The guidelines ask for a plain-language description sufficient to identify the article, and stress this for gifts; a single word such as “gift” or “parts” identifies nothing.',
        'Give the quantity, net weight and value of each article, then the totals. Use the price paid, or a fair market value for goods you are not selling.',
        'Add the HS code and country of origin for each article where the form or the destination asks for them.',
        'For commercial items, tick the invoice box, give the invoice number and attach the commercial invoice.',
        'Sign and date the declaration. Where you enter the data online, the guidelines still require a printed, signed form on the item.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is the CN22 the same as a customs label?',
      a: 'Yes, in everyday use. The CN22 is the small customs declaration label stuck on a letter-post item. Some postal operators combine it with the address or postage label.',
    },
    {
      q: 'What is 300 SDR in pounds or dollars?',
      a: 'It changes with exchange rates. The UPU publishes SDR conversion factors by circular, and each postal operator states the CN22 limit in its own currency, so use your operator’s current figure.',
    },
    {
      q: 'Can I mark a business shipment as a gift?',
      a: 'No. The category should describe the item truthfully. A gift is a non-commercial item sent as a present; goods sold to a customer are a commercial sale and need their real value.',
    },
    {
      q: 'Do I need a CN23 for documents?',
      a: 'It depends on the service and the weight. The USPS manual, for example, lets documents under 16 ounces travel by First-Class Mail International without a customs form. Check your operator’s rules for each service.',
    },
    {
      q: 'Does a courier shipment use a CN22 or CN23?',
      a: 'No. The CN forms belong to the postal system. Couriers set their own requirements; FedEx, for example, requires a commercial invoice for all international commodity shipments.',
    },
  ],
  sources: [
    'b3-wco-upu-postal-ead-guidelines',
    'b3-usps-imm-123',
    'w5-wco-hs',
    'w2-fedex-customs-documents',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/proforma-invoice-generator',
    '/tools/packing-list-generator',
  ],
  callout: {
    afterSection: 4,
    tool: '/tools/invoice-generator',
    title: 'Make the invoice that goes with the CN23',
    text: 'The commercial invoice generator lists each article with its description, quantity, weight, value, HS code and origin, so the CN23 copies from one consistent record.',
  },
  related: [
    '/blog/how-to-ship-internationally-small-business',
    '/blog/commercial-invoice-for-samples',
    '/blog/brokerage-fees-and-duties-on-courier-shipments',
    '/blog/commercial-invoice-requirements',
    '/blog/how-to-find-hs-code',
  ],
  cover: {
    id: 'Y_cazJRS7AM',
    src: 'https://images.unsplash.com/photo-1758795680241-ba9cd3fa2cc2',
    width: 3130,
    height: 2075,
    alt: 'Five red post boxes in a row under a post office sign, where small packets are posted',
    caption: 'A row of red post boxes beneath a post office sign',
    photographer: { name: 'T', profile: 'https://unsplash.com/@tanyabarrow' },
    page: 'https://unsplash.com/photos/five-red-post-boxes-under-a-post-office-sign-Y_cazJRS7AM',
  },
};

export default article;
