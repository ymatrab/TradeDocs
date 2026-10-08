import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Demand (DataForSEO, Google US, 2026-10-06): "commercial invoice declaration statement" 110.
 * Angle (v2 #30): what a declaration and signature on the invoice are for; no invented legal
 * wording, only text an authority publishes. Carrier pages (FedEx, UPS, DHL) refused the
 * request on 2026-10-08, so no carrier practice is described.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C (carried from v2 #30).
 */
const article: ContentArticle = {
  slug: 'commercial-invoice-declaration-statement',
  title: 'Commercial invoice declaration statement: what it is for',
  metaTitle: 'Commercial invoice declaration statement',
  description:
    'What the declaration and signature on a commercial invoice do, which statements a regulation actually prescribes, and why you should never copy wording you cannot trace.',
  lede: 'Many commercial invoice templates end with a sentence such as “I declare that the information on this invoice is true and correct”, followed by a signature line. Some statements on an invoice are required by a regulation, with set wording. Others are habit. Knowing which is which keeps you from leaving out the ones that matter and from signing promises you have not checked.',
  answer:
    'A commercial invoice declaration statement is a signed sentence in which the seller or exporter confirms the invoice is true and complete. US import rules under 19 CFR 141.86 set no standard wording, but they require a named responsible employee. Some statements are prescribed: the US destination control statement and preferential origin declarations each have regulated text.',
  keyFacts: [
    '19 CFR 141.86(j) requires each US import invoice to identify by name a responsible employee of the exporter who knows, or can readily find out, the facts of the transaction.',
    'Under 15 CFR 758.6, the destination control statement is an integral part of the commercial invoice for Commerce Control List items shipped in tangible form, with EAR99 items excluded.',
    '19 U.S.C. 1592 provides penalties for entering goods by means of a material and false document or statement, through fraud, gross negligence or negligence.',
    'HMRC accepts an origin declaration, also called an invoice declaration or statement on origin, on a commercial document such as an invoice, packing list or delivery note.',
    'The CBSA accepts a commercial invoice prepared by any means for Canadian imports when it gives all the information in Appendix A of Memorandum D1-4-1.',
  ],
  definitions: [
    {
      term: 'Declaration statement',
      meaning:
        'A sentence on the invoice, usually signed, in which the person issuing it confirms that what it says is true.',
    },
    {
      term: 'Destination control statement',
      meaning:
        'The statement the US Export Administration Regulations require on the commercial invoice for controlled items, with wording set in 15 CFR 758.6.',
    },
    {
      term: 'Origin declaration',
      meaning:
        'A statement on a commercial document that claims preferential origin under a trade agreement, in the form that agreement sets.',
    },
    {
      term: 'Responsible employee',
      meaning:
        'The person at the exporter whom 19 CFR 141.86(j) asks the invoice to name, who can answer for the transaction.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'What is a commercial invoice declaration statement?',
      paragraphs: [
        'It is the sentence near the signature that ties a person to the figures above it. In its common form, the seller states that the invoice is true and correct and that the goods are as described, then signs and dates it with a name and job title.',
        'The sentence has no single official text. Customs authorities ask for information, and some ask for particular statements, but the generic “true and correct” line on most templates is a convention of practice rather than wording any one regulation prescribes. That matters because a signed sentence is still a statement you make to customs, the carrier and the buyer, whoever wrote the template.',
      ],
    },
    {
      heading: 'Is a declaration statement required on a US import invoice?',
      paragraphs: [
        'The US regulation on invoice contents, 19 CFR 141.86, sets no standard declaration sentence. What it asks for is information: the port of entry, when, where and between whom the sale took place, a detailed description with marks and numbers, quantities, prices in the currency of sale, itemised charges, rebates and the country of origin, among other items.',
        'It also asks for a person. Under 19 CFR 141.86(j), each invoice must identify by name a responsible employee of the exporter who knows, or can readily obtain knowledge of, the transaction. A signature block with a printed name and title is a natural place to meet that requirement, which is one reason the block appears on most invoices.',
        'The weight behind the signature comes from elsewhere. 19 U.S.C. 1592 provides penalties for entering goods by means of a material and false document, statement or omission, whether through fraud, gross negligence or negligence, and whether or not duty is lost. A declaration line does not create that exposure, but it leaves no doubt about who stood behind the figures.',
      ],
    },
    {
      heading: 'Which invoice statements have prescribed wording?',
      paragraphs: [
        'A few statements are written by a regulator or a trade agreement, and for those you copy the official text exactly from its source. The table shows the ones a small exporter meets most often. Each is needed only in the situation the source describes.',
      ],
      table: {
        caption: 'Invoice statements and where their wording lives',
        head: ['Statement', 'When it applies', 'Where the wording is'],
        rows: [
          [
            'Generic “true and correct” declaration',
            'Customary on most templates; no single prescribed text',
            'Your own wording; keep it factual',
          ],
          [
            'Responsible employee named',
            'US imports, every invoice',
            '19 CFR 141.86(j) asks for the name, not a sentence',
          ],
          [
            'Destination control statement',
            'US exports of Commerce Control List items shipped in tangible form, not EAR99',
            '15 CFR 758.6, copied exactly',
          ],
          [
            'Origin declaration (statement on origin)',
            'Claiming preferential origin under a trade agreement',
            'The trade agreement itself; HMRC guidance for UK trade',
          ],
        ],
      },
    },
    {
      heading: 'When does the destination control statement go on the invoice?',
      paragraphs: [
        'When you export items on the Commerce Control List in tangible form. Under 15 CFR 758.6, the destination control statement must be an integral part of the commercial invoice in that case. Items classified EAR99 are excluded, and so are shipments under License Exceptions BAG and GFT.',
        'The statement says, in substance, that the items are controlled by the US Government, authorised for export only to the stated destination for the named consignee or end user, and may not be passed on without US Government approval. Copy the wording from 15 CFR 758.6 itself rather than from a template, because the regulation is the only version that counts. For some listed ECCNs, the same section also requires the invoice to state the ECCN.',
        'Whether your goods are on the Commerce Control List is a classification question, and the guide on ECCN, EAR99 and export licences explains where to check it. TradeDocs does not classify goods or decide whether the statement applies.',
      ],
    },
    {
      heading: 'What is an origin declaration on an invoice?',
      paragraphs: [
        'It is a statement that claims preferential origin under a trade agreement, so the buyer can import at the agreement’s lower duty rate. HMRC’s guidance calls it an origin declaration, also known as an invoice declaration or statement on origin, and accepts it on a commercial document such as an invoice, a packing list or a delivery note.',
        'The text and conditions come from the trade agreement, not from the seller. HMRC notes that some agreements require approved exporter status above a value threshold, and that a declaration must be signed unless a signature waiver applies. It is a separate claim from the generic declaration line, and making it without checking the origin rules of the agreement risks the buyer losing the preference later.',
      ],
    },
    {
      heading: 'How do you write a declaration you can stand behind?',
      paragraphs: [
        'Keep it short, factual and checked against the goods. These steps work for the generic line; for prescribed statements, the only step is to copy the official text.',
      ],
      steps: [
        'Check the invoice against what is actually packed: descriptions, quantities, unit prices, totals and the country of origin.',
        'Write a plain sentence that confirms only what you can verify, such as the invoice being true and complete to the best of your knowledge. Do not add promises about classification, licences or origin you have not checked.',
        'Print the name and job title of the person signing, who should be someone able to answer questions about the shipment.',
        'Add any prescribed statement the shipment needs, copied from its source, and keep it apart from your own wording.',
        'Sign and date the invoice, or have the named person do so, and keep a copy with the shipment records.',
      ],
    },
    {
      heading: 'Does a signature or stamp make the invoice official?',
      paragraphs: [
        'No. A signature shows that the person who prepared the invoice stands behind it; it does not mean any authority has checked or approved it. The CBSA, for example, accepts a commercial invoice prepared by any means for Canadian imports when it gives the required information, and its invoice fields ask for the name and address of the company on whose behalf the invoice was completed.',
        'TradeDocs makes this plain on every PDF: each page states that the document was prepared from the shipper’s own data and is not issued, endorsed, certified or cleared by any customs authority, carrier or chamber of commerce. In the workspace, the signatory name and title in document settings print under a signature line, and a document note can carry a short statement you have written or copied from its source. Pro organizations can also print an uploaded signature or stamp image above that line.',
      ],
    },
  ],
  faq: [
    {
      q: 'Can I copy a declaration from another company’s invoice?',
      a: 'You can use the idea, but read every word first. A sentence that promises more than you have checked, such as a statement about origin or licences, is still a statement you make when you sign it.',
    },
    {
      q: 'Does the free invoice generator add a declaration line?',
      a: 'No. The free generator prints the parties, lines, totals and terms you enter, plus a statement on every page that the document was prepared from your data and not issued by any authority. Add and sign any declaration yourself.',
    },
    {
      q: 'Who should sign the commercial invoice?',
      a: 'Someone at the exporter who can answer for the transaction. For US imports, 19 CFR 141.86(j) asks the invoice to name a responsible employee with knowledge of it, so the signatory is usually that person.',
    },
    {
      q: 'Is an electronic signature accepted?',
      a: 'That depends on the importing country, the carrier and, under a letter of credit, the credit’s terms. Ask your forwarder or customs broker before relying on an image or electronic signature for a particular route.',
    },
    {
      q: 'Does the declaration change the customs value?',
      a: 'No. The value comes from the transaction and the importing country’s valuation rules. The declaration only confirms that the figures on the invoice are the real ones.',
    },
  ],
  sources: [
    'c5-cornell-19-cfr-141-86',
    'c5-cornell-19-usc-1592',
    'c5-cornell-15-cfr-758-6',
    'c5-gov-uk-proof-of-origin',
    'c5-cbsa-d1-4-1',
    'a2-trade-gov-commercial-invoice',
  ],
  primaryTool: '/tools/invoice-generator',
  tools: ['/tools/invoice-generator', '/tools/proforma-invoice-generator', '/tools/incoterms'],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Get the figures right before you sign',
    text: 'Fill in the commercial invoice generator with your parties, lines and terms, download the PDF and check it against the goods before you add and sign a declaration.',
  },
  related: [
    '/blog/commercial-invoice-requirements',
    '/blog/how-to-fill-out-a-commercial-invoice',
    '/guides/eccn-ear99-export-licence',
    '/blog/commercial-invoice-for-canada',
    '/blog/declared-value-for-customs',
  ],
  cover: {
    id: 'ZKkuYgbTRl8',
    src: 'https://images.unsplash.com/photo-1643224781823-5a6ed8e0835c',
    width: 6000,
    height: 4000,
    alt: 'A hand writing on a sheet of paper with a pen',
    caption: 'Writing on a printed sheet',
    photographer: { name: 'Colynary Media', profile: 'https://unsplash.com/@colynarymedia' },
    page: 'https://unsplash.com/photos/a-person-writing-on-a-piece-of-paper-with-a-pen-ZKkuYgbTRl8',
  },
};

export default article;
