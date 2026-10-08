import type { GlossaryTerm } from '@/lib/content/glossary-term';

const ROUND = '2026-10-08';

const term: GlossaryTerm = {
  slug: 'container-seal-number',
  term: 'Container seal number',
  aliases: ['seal number', 'container seal', 'high-security seal', 'ISO 17712 seal'],
  demand: {
    keyword: 'container seal',
    market: 'US',
    volume: 720,
    kd: null,
    dataFile: '01-labs-keyword-overview-us-glossary.json',
  },
  metaTitle: 'Container seal number: what it is and where it goes',
  description:
    'What a container seal number is, why U.S. customs programmes call for ISO 17712 high-security seals, and where the number belongs on your bill of lading and packing list.',
  shortDefinition:
    'A container seal number is the unique serial number printed on the seal that locks a loaded container’s doors. It is recorded on the bill of lading and other shipping documents so anyone receiving the box can check it was not opened in transit.',
  definition: [
    'Once a container is loaded, the doors are closed with a one-time seal, usually a steel bolt seal or a cable seal. Each seal carries a serial number, and that number travels on the paperwork. If the seal on arrival is intact and shows the same number as the documents, the receiver has evidence that nobody opened the box between loading and delivery.',
    'The international standard for mechanical freight container seals is ISO 17712. U.S. Customs and Border Protection’s seal requirements for manufacturers in its CTPAT and FAST programmes say seals are affixed at the point of loading and must be of the high-security type under ISO/PAS 17712. The same page asks the manufacturer to keep a log of the seal numbers it issues and uses, and to have a way of checking seal numbers against weights and quantities received.',
    'A seal number is different from the container number. The container number identifies the box for its whole working life; the seal number identifies one closing of that box and changes every time it is resealed, for example after a customs inspection.',
  ],
  onYourDocuments: [
    'The seal number belongs next to the container number on the bill of lading or sea waybill. CBP’s seal guidance asks that manifests, bills of lading and other documentation, including electronic transmissions, carry all the pertinent seal information.',
    'It is good practice to repeat container and seal numbers on the packing list so the consignee can match cartons to boxes. Whoever loads the container, often the shipper for a full container load, records the number at the door and passes it to the forwarder before the bill of lading is drafted.',
  ],
  example: {
    caption: 'Worked example with invented parties and numbers',
    paragraphs: [
      'Coastline Ceramics (invented) loads a 40ft container at its own warehouse, closes the doors with a bolt seal and writes the seal number into its loading log. The forwarder copies it onto the draft bill of lading, and Coastline adds it to the packing list header.',
    ],
    table: {
      caption: 'Invented example: the same container and seal numbers on two documents',
      head: ['Document', 'Container number', 'Seal number'],
      rows: [
        ['Loading log', 'ZZZU 123456 7', 'CS 0048213'],
        ['Bill of lading', 'ZZZU 123456 7', 'CS 0048213'],
        ['Packing list', 'ZZZU 123456 7', 'CS 0048213'],
      ],
    },
  },
  confusedWith: [
    {
      term: 'Container number',
      difference:
        'The container number identifies the box itself and stays with it; the seal number identifies one sealing and changes when the box is reopened and resealed.',
    },
  ],
  related: [
    'shipping-manifest',
    'waybill',
    '/guides/what-is-a-bill-of-lading',
    '/guides/lcl-vs-fcl',
  ],
  tool: '/tools/packing-list-generator',
  toolPitch:
    'The packing list generator has room for container and seal numbers, so the receiver can match boxes to cartons.',
  faq: [
    {
      q: 'What is an ISO 17712 seal?',
      a: 'A mechanical freight container seal made to ISO 17712. CBP’s CTPAT and FAST seal requirements call for seals of the high-security type under ISO/PAS 17712 on loaded containers.',
    },
    {
      q: 'What happens if the seal number does not match?',
      a: 'Treat it as a possible sign that the container was opened. Record the discrepancy before unloading and tell the carrier and your forwarder; a box resealed after an official inspection should come with a note of the new seal number.',
    },
  ],
  sources: ['c6-cbp-seal-requirements'],
  regulated: false,
  review: null,
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
};

export default term;
