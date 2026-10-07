import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, 2026-10-06): "delivery note" UK 880; "delivery note template" UK 480;
 * "delivery note" US 390.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave A (v2 #44).
 */
const article: ContentArticle = {
  slug: 'delivery-note-vs-packing-list',
  title: 'Delivery note vs packing list: which one does your shipment need?',
  metaTitle: 'Delivery note vs packing list: the difference',
  description:
    'A delivery note confirms what reached the customer; a packing list shows what is in each package for carriers and customs. When to use each, and what goes on them.',
  lede: 'A delivery note and a packing list both list goods without prices, so they are easy to mix up. They answer different questions for different readers. This post sets out what each document is for, who reads it, what it should carry, and where the commercial invoice fits beside them on an export.',
  answer:
    'A delivery note travels with goods to the customer and records what was delivered, usually signed on receipt. A packing list itemises the contents, weights and measurements of each package for forwarders and customs officials. Domestic deliveries often need only a delivery note; exports need a packing list and a commercial invoice.',
  keyFacts: [
    'The International Trade Administration describes a packing list as itemising the contents of each package, with weights, measurements and detailed lists of the goods.',
    'The International Trade Administration states that freight forwarders use the packing list to determine weights and freight costs, and customs officials use it to check package contents.',
    'Under 19 CFR 142.3, US entry documentation includes a commercial invoice and a packing list where appropriate.',
    'Under 19 CFR 141.86(e), each invoice for a US import must state in adequate detail what merchandise is in each package.',
    'HMRC’s VAT Notice 703 lists transport documents such as bills of lading, air waybills and CMR notes as commercial evidence of export; a delivery note is not among them.',
  ],
  definitions: [
    {
      term: 'Delivery note',
      meaning:
        'A document that accompanies goods to the recipient and lists what is being delivered, without prices; also called a delivery docket or dispatch note.',
    },
    {
      term: 'Packing list',
      meaning:
        'A document that itemises the goods in each package with weights and measurements, used by carriers, forwarders and customs.',
    },
    {
      term: 'Commercial invoice',
      meaning:
        'The seller’s bill for the goods, which customs in the buyer’s country uses to assess import duties and taxes.',
    },
    {
      term: 'Proof of delivery',
      meaning:
        'A record, often a signed delivery note or a carrier’s signature capture, that the goods reached the recipient.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a delivery note?',
      paragraphs: [
        'A delivery note is the document that goes with goods to the customer and says what is in the delivery. It names the sender and the recipient, the delivery address, an order or reference number, and each item with its quantity. It normally carries no prices, because it is read by whoever unloads the van or signs at the door, who may not be the person who pays.',
        'Its main use is the handover. The recipient checks the goods against the note, signs it, and notes any shortage or damage on it. The signed copy goes back to the seller as a record that the order arrived, which the seller’s accounts team can match against the invoice. That practice is commercial, not a legal form: there is no single official layout, and businesses design their own.',
      ],
    },
    {
      heading: 'What is a packing list?',
      paragraphs: [
        'A packing list describes how the goods are packed, package by package. The International Trade Administration defines it as a document that itemises the contents of each package, whether box, pallet or crate, and includes weights, measurements and detailed lists of the goods in each one.',
        'Its readers are further up the chain. The International Trade Administration notes that freight forwarders use it to determine weights and freight costs, and that US and foreign customs officials use it to check the contents of a specific package or carton. That is why a packing list numbers each package and gives net and gross weights and dimensions, details a delivery note usually leaves out.',
      ],
    },
    {
      heading: 'How do a delivery note, a packing list and a commercial invoice compare?',
      paragraphs: [
        'The three often share the same lines of goods but answer different questions. The table sets them side by side.',
      ],
      table: {
        caption: 'Delivery note, packing list and commercial invoice compared',
        head: ['Point', 'Delivery note', 'Packing list', 'Commercial invoice'],
        rows: [
          [
            'Question it answers',
            'What did the customer receive?',
            'What is in each package, and how heavy and large is it?',
            'What was sold, for how much, and from where?',
          ],
          [
            'Main readers',
            'The recipient and the seller’s accounts team',
            'Carriers, forwarders and customs officials',
            'The buyer and customs in the importing country',
          ],
          ['Prices', 'Usually none', 'Usually none', 'Yes, per line and in total'],
          [
            'Package detail',
            'Rarely',
            'Package numbers, weights and dimensions',
            'Required in some countries, such as the US under 19 CFR 141.86(e)',
          ],
          [
            'Typical use',
            'Domestic deliveries and proof of receipt',
            'Freight booking, loading and customs checks',
            'Customs valuation and payment',
          ],
        ],
      },
    },
    {
      heading: 'Do you need a delivery note or a packing list for an export?',
      paragraphs: [
        'For an export, the packing list and the commercial invoice are the documents customs and carriers ask for. In the United States, 19 CFR 142.3 lists the entry documentation as the entry form, evidence of the right to make entry, a commercial invoice, a packing list where appropriate, and any other documents an agency requires. CBP’s instructions for the entry summary form also include a missing-document code for the packing list.',
        'A delivery note does not replace either. It can still travel with an export consignment as the buyer’s receiving document, and many sellers send one so the buyer’s warehouse can book the goods in. What it cannot do is stand in for the customs paperwork, because it lacks the values, origin and package detail customs relies on.',
        'In the UK, exporters zero-rating VAT need evidence that the goods left the country. HMRC’s VAT Notice 703 lists transport documents such as bills of lading, air waybills and CMR notes as that evidence, and treats records such as an advice note, consignment note or packing list as supporting evidence of the supply. A delivery note signed in the destination country may help your file, but check the notice for what it accepts before relying on one.',
      ],
    },
    {
      heading: 'What should each document include?',
      paragraphs: [
        'Start from the same order data so the documents agree. The lists below are the usual fields; the importing country’s rules and your buyer’s instructions come first where they ask for more.',
      ],
      list: [
        'Delivery note: seller and recipient names and addresses, delivery date, order and delivery note numbers, item descriptions and quantities, a line for the recipient to sign, date and note any discrepancy.',
        'Packing list: exporter and consignee, invoice number, number and type of packages, package numbers or marks, contents of each package, net and gross weight, dimensions, and total packages and weight.',
        'Commercial invoice: seller and buyer, invoice number and date, full description, quantity, unit price and total for each line, currency, the Incoterms® 2020 rule with its named place, and country of origin.',
      ],
    },
    {
      heading: 'How do you make a delivery note from a packing list?',
      paragraphs: [
        'If you already have a packing list, the delivery note is a shorter view of the same data. Making one from the other keeps the descriptions and quantities identical, which avoids disputes at the receiving dock.',
      ],
      steps: [
        'Copy the parties, the order reference and the delivery address from the packing list or the order.',
        'Copy each line’s description and quantity exactly as they appear on the packing list.',
        'Leave out prices, and leave out weights and dimensions unless the recipient asks for them.',
        'Give the note its own number and the delivery date, and reference the invoice or packing list number.',
        'Add a receipt block: name, signature, date and a space to record shortages or damage.',
        'Print two copies, one for the recipient and one to come back signed, or capture the signature electronically.',
      ],
    },
    {
      heading: 'What goes wrong when the documents disagree?',
      paragraphs: [
        'The usual faults are a quantity that differs between documents, a description shortened on one and not the other, or a package count that does not match what is on the pallet. On a domestic delivery that means a query from the customer’s warehouse. On an export it can mean a customs question, since officials use the packing list to check packages against the declaration.',
        'The fix is to produce all three documents from one record of the shipment and to change that record, not a single document, when something changes. Then reprint all three.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is a delivery note the same as a dispatch note?',
      a: 'In everyday use, yes. Businesses use delivery note, delivery docket and dispatch note for the same document that travels with goods and lists what is being delivered. Use whichever name your customer recognises, and be consistent.',
    },
    {
      q: 'Should a delivery note show prices?',
      a: 'Usually not. The person receiving the goods may not be the buyer, and prices belong on the invoice. Some businesses print a priced delivery note on request, but most keep the two documents separate.',
    },
    {
      q: 'Can a packing list be used as a delivery note?',
      a: 'It can serve as one if it has a receipt block and the recipient signs it, since it already lists every item. Many exporters still send a separate delivery note so the buyer’s warehouse gets a short, price-free document to sign.',
    },
    {
      q: 'Who signs a delivery note?',
      a: 'The person who receives the goods signs and dates it, after checking the items against the note. The driver may also sign as the deliverer. Any shortage or visible damage should be written on the note before signing.',
    },
    {
      q: 'Does customs ever ask for a delivery note?',
      a: 'Customs authorities generally ask for the commercial invoice, the packing list and transport documents. A delivery note is a commercial record between seller and buyer, though it can form part of the evidence you keep for a shipment.',
    },
  ],
  sources: [
    'trade-gov-packing-list',
    'trade-gov-commercial-invoice',
    'us-cbp-invoice-contents',
    'a3-ecfr-19-cfr-142-3',
    'a3-cbp-form-7501',
    'a3-hmrc-vat-notice-703',
  ],
  primaryTool: '/tools/delivery-note-generator',
  tools: [
    '/tools/delivery-note-generator',
    '/tools/packing-list-generator',
    '/tools/invoice-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/packing-list-generator',
    title: 'Start with the packing list',
    text: 'The packing list generator records packages, contents and weights line by line. Keep it as the master record and the delivery note becomes a shorter copy of the same lines.',
  },
  related: [
    '/blog/packing-list-for-shipping',
    '/blog/commercial-invoice-requirements',
    '/blog/export-documents-checklist',
    '/blog/shipping-marks',
    '/guides/proforma-vs-commercial-invoice',
  ],
  cover: {
    id: '1qZQ_zsAXV0',
    src: 'https://images.unsplash.com/photo-1680034976253-e239f6b061b1',
    width: 4531,
    height: 3350,
    alt: 'A person holding a brown cardboard parcel tied with string, the kind of delivery a delivery note travels with',
    caption: 'A cardboard parcel tied with string, held in two hands',
    photographer: { name: 'Compagnons', profile: 'https://unsplash.com/@sigmund' },
    page: 'https://unsplash.com/photos/a-person-holding-a-brown-box-with-a-string-on-it-1qZQ_zsAXV0',
  },
};

export default article;
