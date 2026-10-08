import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-07): "legalized invoice" 140, KD n/a; "consular invoice" 20.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave D (new in v3; conversion: invoice).
 */
const article: ContentArticle = {
  slug: 'invoice-legalization',
  title: 'Invoice legalization: when a buyer asks for a stamped invoice',
  metaTitle: 'Invoice legalization: who stamps the invoice',
  description:
    'What it means to legalize a commercial invoice, why an apostille usually does not cover it, which official bodies stamp invoices, and how to prepare one that will not be rejected.',
  lede: 'Some buyers, banks and customs offices want more than your signature on the commercial invoice. They want a stamp from a chamber of commerce, a ministry or the importing country’s consulate confirming the document is genuine. That process is invoice legalization, and it adds time, cost and a few rules about how the invoice must look.',
  answer:
    'Invoice legalization is the official certification of a commercial invoice so that authorities in the importing country accept it. Depending on the country, a chamber of commerce, the destination’s consulate or a foreign ministry checks and stamps the signed invoice. It certifies the signature and seal, not the price or the goods, and only some countries require it.',
  keyFacts: [
    'The HCCH Apostille Convention defines legalisation as consular certification of a signature, the signer’s capacity and any seal or stamp.',
    'The Apostille Convention does not apply to administrative documents dealing directly with commercial or customs operations.',
    'The ITA says a consular invoice is required in some countries and that copies are available from the destination’s embassy or consulate in the United States.',
    'The ITA’s guide for Egypt says legalization of commercial invoices by the Egyptian consulate in the country of origin is required in most cases.',
    'The UAE Ministry of Foreign Affairs attests commercial invoices through its electronic documents attestation system, eDAS 2.0.',
  ],
  definitions: [
    {
      term: 'Legalization',
      meaning:
        'A formality in which an official body certifies that the signature and seal on a document are genuine, so another country’s authorities can rely on it.',
    },
    {
      term: 'Attestation',
      meaning:
        'The term some countries, including the UAE, use for their own certification of commercial documents such as invoices.',
    },
    {
      term: 'Consular invoice',
      meaning:
        'A separate form issued or certified through the importing country’s consulate, describing the shipment with the consignor, consignee and value.',
    },
    {
      term: 'Apostille',
      meaning:
        'A single certificate under the 1961 Hague Convention that replaces consular legalization for many public documents, but not for commercial or customs documents.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What does it mean to legalize an invoice?',
      paragraphs: [
        'It means an official body adds its certification to your signed invoice. The certification says the document was signed by the person it claims, in the capacity it claims, and that any seal on it is real. The HCCH’s Apostille Convention, the treaty that governs much of this area, defines legalisation in exactly those terms: the formality by which diplomatic or consular agents of the country where the document will be produced certify the authenticity of the signature, the capacity of the signer and, where appropriate, the seal or stamp.',
        'For an invoice, the body is usually one of three: a chamber of commerce in the exporting country, the importing country’s embassy or consulate, or a ministry in the importing country. Which one, and in what order, depends entirely on the importing country.',
        'Legalization does not check your commercial terms. A stamped invoice with a wrong price or a vague description is still wrong. The stamp only makes the document official enough to be relied on.',
      ],
    },
    {
      heading: 'Can an apostille be used for a commercial invoice?',
      paragraphs: [
        'Usually not. The Apostille Convention replaces consular legalization with a single certificate for many public documents, such as court papers and notarial acts. But its Article 1 says it does not apply to administrative documents dealing directly with commercial or customs operations.',
        'That is why an importing country can still require consular legalization or its own attestation for invoices even where it is a party to the Convention. If someone offers to apostille your commercial invoice, check with the buyer or the importing country’s consulate that an apostille will be accepted before you pay for it.',
      ],
    },
    {
      heading: 'Which countries ask for legalized invoices?',
      paragraphs: [
        'A minority, and the list changes. The ITA’s Country Commercial Guides are the quickest official place to check, because each one has an import requirements page written for US exporters. The examples below are from pages we opened on 8 October 2026; each guide shows its own publication date.',
      ],
      table: {
        caption:
          'Invoice certification requirements stated on official pages (checked 8 October 2026)',
        head: ['Importing country', 'What the official page says', 'Source'],
        rows: [
          [
            'Egypt',
            'Legalization by the Egyptian consulate in the country of origin is required in most cases',
            'ITA Country Commercial Guide, published 21 November 2025',
          ],
          [
            'United Arab Emirates',
            'Commercial invoices and shipping documents are attested through the UAE Ministry of Foreign Affairs, using eDAS 2.0',
            'ITA guide (25 August 2025) and UAE MOFA',
          ],
          [
            'Saudi Arabia',
            'US chambers of commerce perform the authentication of shipping documents',
            'ITA Country Commercial Guide, published 11 May 2026',
          ],
        ],
      },
    },
    {
      heading: 'What is the difference between a legalized invoice and a consular invoice?',
      paragraphs: [
        'A legalized invoice is your own commercial invoice with an official stamp added. A consular invoice is a separate document. The ITA describes it as a form that describes the shipment and shows information such as the consignor, consignee and value, required in some countries, with copies available from the destination country’s embassy or consulate in the United States.',
        'Both can be asked for on the same shipment, and the figures on them must agree. The ITA also warns that the cost of this documentation can be significant and should be discussed with the buyer. No official page we checked states a standard fee, so ask the consulate or chamber for a quote.',
      ],
    },
    {
      heading: 'How do you prepare an invoice for legalization?',
      paragraphs: [
        'Start from the importing country’s rules and work back. Every certifying body checks the document it is given, so mistakes found after stamping usually mean starting again. The order below is a general pattern; the consulate’s or chamber’s own instructions come first.',
      ],
      steps: [
        'Confirm with the buyer, in writing, which body must certify the invoice and how many originals are needed.',
        'Read the importing country’s import requirements page in the ITA Country Commercial Guide, then the consulate’s or ministry’s own page.',
        'Prepare the commercial invoice in full: seller and buyer, goods description, quantities, unit and total values, currency, terms of sale and origin of each line.',
        'Add any language, wording or letterhead the destination requires, and sign the invoice by hand or as the certifying body specifies.',
        'Submit it to the first certifying body, often a chamber of commerce, then to the consulate or ministry if a second stamp is required.',
        'Keep a copy of the certified invoice and send the originals with the shipping documents or through the bank, as the sale contract says.',
      ],
    },
    {
      heading: 'Why do legalized invoices get rejected?',
      paragraphs: [
        'Most often because the invoice and the rest of the file do not match. A certifying body or customs office compares the invoice against the packing list, the transport document and any consular invoice. A different consignee name, a changed quantity or a total that does not add up can stop the process.',
        'The second cause is a missing formal element: an original signature where one is required, the wrong number of copies, or a language the destination asks for. The ITA’s guides list these per country. Invented example: Larkfield Valves (an invented company) has its invoice rejected because the consignee’s name differs from the bill of lading, so it reissues both documents from the same data before resubmitting.',
      ],
    },
  ],
  faq: [
    {
      q: 'Does legalization make my invoice legally compliant?',
      a: 'No. It certifies the signature and seal. The content of the invoice remains your responsibility, and the importing country’s customs still checks the description and value.',
    },
    {
      q: 'How long does invoice legalization take?',
      a: 'No official page we checked states a standard time. Ask the chamber and consulate before you book transport, and allow for each certifying step in sequence.',
    },
    {
      q: 'Can I legalize an invoice after the goods have shipped?',
      a: 'Sometimes, but late documents can hold the goods at the destination or delay payment under a letter of credit. Prepare and certify the invoice before shipment where you can.',
    },
    {
      q: 'Does TradeDocs legalize or stamp invoices?',
      a: 'No. TradeDocs prepares the commercial invoice you then take to the certifying body. Legalization is done only by the chamber, consulate or ministry the importing country names.',
    },
  ],
  sources: [
    'd1-hcch-apostille-convention',
    'd1-trade-gov-special-documents',
    'd1-trade-gov-ccg-eg-import',
    'd1-trade-gov-ccg-ae-import',
    'd1-uae-mofa-attestation',
    'd1-trade-gov-ccg-sa-import',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 3,
    tool: '/tools/invoice-generator',
    title: 'Get the invoice right before it is stamped',
    text: 'Fill in parties, goods, values and origin once in the invoice generator, then print the signed original the certifying body asks for.',
  },
  related: [
    '/blog/commercial-invoice-requirements',
    '/blog/commercial-invoice-declaration-statement',
    '/blog/add-logo-and-signature-to-export-documents',
    '/blog/commercial-invoice-and-packing-list-must-match',
    '/guides/how-to-export-from-the-us',
  ],
  cover: {
    id: '7PMGUqYQpYc',
    src: 'https://images.unsplash.com/photo-1619418602850-35ad20aa1700',
    width: 3500,
    height: 2333,
    alt: 'A rubber stamp pressed onto printed office documents, like the certification added to a legalized invoice',
    caption: 'A rubber stamp on printed documents',
    photographer: { name: 'Markus Spiske', profile: 'https://unsplash.com/@markusspiske' },
    page: 'https://unsplash.com/photos/rubber-stamp-on-legal-document-7PMGUqYQpYc',
  },
};

export default article;
