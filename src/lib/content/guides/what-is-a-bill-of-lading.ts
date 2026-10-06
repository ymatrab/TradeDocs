import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-07';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "bill of lading" 27,100, KD 28;
 * "what is a bill of lading" 4,400, KD 27; "bill of lading meaning" 2,900.
 * Plan: docs/research/content-plan-v2-2026-10-06.md, batch 1.
 * TradeDocs explains the bill of lading; it does not issue one. The carrier does.
 */
const article: ContentArticle = {
  slug: 'what-is-a-bill-of-lading',
  title: 'What is a bill of lading?',
  metaTitle: 'What is a bill of lading? Meaning and types',
  description:
    'What a bill of lading does as receipt, contract and document of title, straight vs negotiable bills, who issues it, and what must match your invoice and packing list.',
  lede: 'The bill of lading is the one export document you do not write yourself. The carrier issues it, but the details on it come from you, and if they disagree with your invoice or packing list the shipment and the payment can both stall.',
  answer:
    'A bill of lading is the document a carrier issues for goods it has received for shipment. It works as a receipt for the goods, as evidence of the contract of carriage between the shipper and the carrier, and, when it is negotiable, as a document of title that lets the holder claim the goods.',
  keyFacts: [
    'The Uniform Commercial Code (§ 1-201) defines a bill of lading as a document evidencing the receipt of goods for shipment, issued by a transporter or forwarder.',
    'The International Trade Administration describes the bill of lading as a contract between the owner of the goods and the carrier.',
    'Under 49 U.S.C. § 80103, a bill is negotiable when it consigns the goods to the order of a consignee, and nonnegotiable when it consigns them to a named consignee.',
    'A common carrier issuing a nonnegotiable bill must mark it “nonnegotiable” or “not negotiable” (49 U.S.C. § 80103).',
    'Air waybills are not negotiable, unlike order bills of lading for vessel shipments, according to the International Trade Administration.',
  ],
  definitions: [
    {
      term: 'Shipper',
      meaning:
        'The party named on the bill as sending the goods, usually the exporter or its agent.',
    },
    {
      term: 'Consignee',
      meaning: 'The party the carrier will deliver the goods to, or to whose order they are consigned.',
    },
    {
      term: 'Straight bill of lading',
      meaning: 'A nonnegotiable bill that consigns the goods to a named consignee.',
    },
    {
      term: 'Order (negotiable) bill of lading',
      meaning:
        'A bill that consigns the goods “to the order of” a party and can be transferred to pass the right to the goods.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does a bill of lading do?',
      paragraphs: [
        'A bill of lading does three jobs at once. It is the carrier’s receipt: the Uniform Commercial Code defines it as a document evidencing the receipt of goods for shipment, issued by a business that transports or forwards goods. It is evidence of the contract of carriage, which is how the International Trade Administration describes it: a contract between the owner of the goods and the carrier. And when it is negotiable, it is a document of title, which the UCC lists among the documents treated as showing that the holder may receive and dispose of the goods.',
        'That third job is what makes the bill of lading central to export payments. The ITA notes that the buyer usually needs an original bill of lading as proof of ownership to take possession of the goods from the ocean carrier. Whoever holds the original controls the cargo.',
      ],
    },
    {
      heading: 'Who issues the bill of lading?',
      paragraphs: [
        'The carrier, or a forwarder acting as carrier, issues it when it receives the goods. You do not prepare it, and neither does TradeDocs. What you do is supply the information it is built from, usually through the booking or the shipping instructions you give the carrier or forwarder.',
        'The shipper named on the bill matters beyond the paperwork. For sea containers, the IMO’s rules on verified gross mass define the shipper as the party named on the bill of lading or sea waybill as shipper, or the party that contracted the carriage, and make that shipper responsible for declaring the container’s verified gross mass.',
      ],
    },
    {
      heading: 'What is the difference between a straight and a negotiable bill?',
      paragraphs: [
        'The difference is who can take delivery. For bills issued by common carriers for US shipments, including exports to a foreign country, 49 U.S.C. § 80103 sets the test. A bill is negotiable if it states that the goods are to be delivered to the order of a consignee and carries no agreement on its face that it is not negotiable. It is nonnegotiable if it states that the goods are to be delivered to a consignee, and the carrier must then mark it “nonnegotiable” or “not negotiable”.',
        'The ITA puts the commercial effect simply: a straight bill is non-negotiable, while a negotiable, or shipper’s order, bill can be used to buy, sell or trade the goods while they are in transit.',
      ],
      table: {
        caption: 'Straight and negotiable bills of lading compared',
        head: ['', 'Straight bill', 'Negotiable (order) bill'],
        rows: [
          ['Consigned', 'To a named consignee', 'To the order of a party'],
          ['Marked', '“Nonnegotiable” or “not negotiable”', 'No non-negotiable statement'],
          [
            'Transfer',
            'Indorsing it does not make it negotiable',
            'Can be transferred to pass the right to the goods',
          ],
          [
            'Typical use',
            'Often used when the buyer has already paid',
            'Often used for payment through banks or sale in transit',
          ],
        ],
      },
    },
    {
      heading: 'What must match your commercial invoice and packing list?',
      paragraphs: [
        'The bill of lading must describe the same shipment as your other documents. The ITA notes that customs officials may check the cargo against the packing list, so the commercial invoice should reflect it; the bill of lading is the third document in that set, and a bank or a customs officer will read all three together.',
        'Check these details on the draft, before the carrier issues the bill; how an issued original is corrected depends on the carrier’s own process:',
      ],
      list: [
        'Shipper, consignee and notify party: names and addresses exactly as on the invoice and the sales contract.',
        'Number and kind of packages: the same carton or pallet count as the packing list.',
        'Description of goods: consistent with the invoice wording, not a vaguer version of it.',
        'Gross weight and volume: the packing list totals, in the same units.',
        'Marks and numbers: as printed on the packages.',
        'Ports or places of receipt and delivery: consistent with the Incoterms® rule and named place agreed with the buyer.',
      ],
    },
    {
      heading: 'Why can a wrong bill of lading stop payment?',
      paragraphs: [
        'When payment runs through banks, the banks handle documents, not goods, and they read the bill of lading alongside the invoice. If the bill shows a different consignee, a different package count or a description that does not match the other documents, expect questions. The ITA warns that discrepancies or omissions in export documents can delay the shipment, result in nonpayment or even lead to seizure of the goods.',
        'The practical rule is to draft the commercial invoice and packing list first, from one set of line items, and give the carrier the same figures for the bill. Then read the draft bill against both before you approve it.',
      ],
    },
    {
      heading: 'Is a sea waybill or an air waybill the same thing?',
      paragraphs: [
        'Not quite. A waybill is a transport document too, and the IMO’s container rules name the sea waybill alongside the bill of lading as a document that identifies the shipper. The difference that matters is title. The ITA notes that air waybills are shipper-specific and are not negotiable, unlike order bills of lading used for vessel shipments. Couriers issue their own waybills; read the carrier’s terms for how delivery is released under each.',
      ],
    },
  ],
  faq: [
    {
      q: 'Who fills out the bill of lading?',
      a: 'The carrier or forwarder issues it, using details the shipper supplies in the booking or shipping instructions. The shipper should check the draft against the commercial invoice and packing list before it is issued.',
    },
    {
      q: 'Does TradeDocs create bills of lading?',
      a: 'No. A bill of lading is issued by the carrier. TradeDocs prepares the commercial invoice and packing list, whose figures the carrier’s document should match.',
    },
    {
      q: 'What does “to order” mean on a bill of lading?',
      a: 'That the goods are consigned to the order of a named party, which makes the bill negotiable under 49 U.S.C. § 80103 for US carrier bills. The holder can transfer it to pass the right to the goods.',
    },
    {
      q: 'Does naming a notify party change who owns the goods?',
      a: 'No. Under 49 U.S.C. § 80103, inserting a person to be notified of arrival in a negotiable bill does not limit its negotiability and is not notice of any right that person has to the goods.',
    },
  ],
  sources: [
    'trade-gov-export-documents',
    'trade-gov-packing-list',
    'w4-cornell-ucc-1-201',
    'w4-cornell-49-usc-80103',
    'w4-imo-solas-vgm',
    'w4-trade-gov-export-transaction',
  ],
  primaryTool: '/tools/packing-list-generator',
  tools: ['/tools/packing-list-generator', '/tools/invoice-generator', '/tools/incoterms'],
  callout: {
    afterSection: 3,
    tool: '/tools/packing-list-generator',
    title: 'Give the carrier figures that already match',
    text: 'The packing list generator totals packages, gross weight and volume from the same lines as your invoice, so the numbers you send for the bill of lading agree.',
  },
  related: [
    '/blog/export-documents-checklist',
    '/guides/gross-weight-vs-net-weight',
    '/blog/packing-list-for-shipping',
    '/blog/commercial-invoice-requirements',
    '/guides/shipping-container-sizes',
  ],
  cover: {
    id: 'vkvHBK8n_gs',
    src: 'https://images.unsplash.com/photo-1625980344922-a4df108b2bd0',
    width: 3024,
    height: 2005,
    alt: 'A person holding printed shipping paperwork, the kind of document a carrier issues for cargo',
    caption: 'Printed paperwork held in hand',
    photographer: { name: 'Chanhee Lee', profile: 'https://unsplash.com/@jjik_da' },
    page: 'https://unsplash.com/photos/person-holding-white-printer-paper-vkvHBK8n_gs',
  },
};

export default article;
