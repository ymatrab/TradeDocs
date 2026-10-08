import { BYLINE, type ContentArticle } from '@/lib/content/article';

const ROUND = '2026-10-08';

/**
 * Product-led (conversion role: Pro PDF branding, D-021). No search volume claimed. Describes
 * the feature as built: src/app/(app)/branding-actions.ts (Pro entitlement, owners and
 * administrators, removal without a plan, content-addressed images kept for issued documents),
 * src/app/(app)/app/[org]/settings/page.tsx (placement and requirements, from LOGO_BOX and
 * SIGNATURE_BOX in src/lib/pdf/branding-layout.ts and MAX_BRANDING_* in src/lib/limits.ts) and
 * the DISCLOSURE in src/lib/pdf/trade-document.ts. No price: PRICES_APPROVED is not set
 * (D-020); no claim that sign-up or purchase is open.
 * Plan: docs/research/content-plan-v3-2026-10-07.md, wave C.
 */
const article: ContentArticle = {
  slug: 'add-logo-and-signature-to-export-documents',
  title: 'How to add your logo and signature to export documents',
  metaTitle: 'Add a logo and signature to export documents',
  description:
    'Where a logo and a signature belong on a commercial invoice or packing list, what they do and do not prove, and how PDF branding works in TradeDocs.',
  lede: 'A commercial invoice on your own letterhead, signed by the person who prepared it, looks like it came from a real business, because it did. Buyers, forwarders and banks see it next to documents from other companies, and the logo and signature tell them at a glance whose figures they are reading. They do not make the document more official than that.',
  answer:
    'To add your logo and signature to export documents, print the logo in the header of every page and an image of the authorised person’s signature or company stamp above the signatory line, with their printed name and title. In TradeDocs, Pro organizations upload both once in document settings, and every document generated afterwards carries them.',
  keyFacts: [
    'For US imports, 19 CFR 141.86(j) requires each invoice to identify by name a responsible employee of the exporter.',
    'The CBSA accepts a commercial invoice prepared by any means for Canadian imports when it gives the information in Appendix A of Memorandum D1-4-1.',
    'TradeDocs prints the logo at the top left of every page, scaled to fit 53 × 14 mm, and the signature or stamp above the signatory line, scaled to fit 64 × 18 mm.',
    'TradeDocs accepts PNG or JPEG branding images up to 1 MB and 2,000 × 2,000 pixels; transparent PNGs keep their transparency.',
    'Every TradeDocs PDF states on each page that it is prepared from the shipper’s own data and not issued, endorsed, certified or cleared by any authority, carrier or chamber of commerce.',
  ],
  definitions: [
    {
      term: 'Letterhead',
      meaning:
        'The company name, logo and contact details printed at the top of a business document.',
    },
    {
      term: 'Signatory',
      meaning:
        'The person who signs the document for the company, named with their job title under the signature.',
    },
    {
      term: 'Company stamp',
      meaning:
        'An inked or printed mark with the company’s name, used in some trades alongside or instead of a handwritten signature.',
    },
  ],
  published: ROUND,
  updated: ROUND,
  reviewed: ROUND,
  byline: BYLINE,
  sections: [
    {
      heading: 'Why put a logo and signature on export documents?',
      paragraphs: [
        'To show who issued the document and who stands behind it. A logo identifies the seller at a glance among the papers a forwarder or bank handles for many shippers. A signature, with a printed name and title, ties the figures to a person who can answer for them.',
        'That second point has a regulatory echo. For US imports, 19 CFR 141.86(j) requires each invoice to identify by name a responsible employee of the exporter who knows, or can readily find out, the facts of the transaction. A signature block with the person’s name and title is the usual way to show it.',
      ],
    },
    {
      heading: 'Does a logo or signature make an invoice official?',
      paragraphs: [
        'No. A commercial invoice is the seller’s own document. The CBSA, for example, accepts a commercial invoice prepared by any means for Canadian imports when it gives the required information. No logo, signature or stamp turns it into a document issued or approved by customs, a carrier or a chamber of commerce.',
        'TradeDocs keeps that line clear. Every PDF it produces carries a statement on each page that the document was prepared with TradeDocs from the shipper’s own data and is not issued, endorsed, certified or cleared by any customs authority, carrier or chamber of commerce. The statement cannot be switched off, with or without branding.',
      ],
    },
    {
      heading: 'Where should the logo and signature go?',
      paragraphs: [
        'The logo in the header, the signature at the end. The table shows where TradeDocs prints each element and what it needs from you.',
      ],
      table: {
        caption: 'Branding on a TradeDocs document',
        head: ['Element', 'Where it prints', 'What you provide', 'Plan'],
        rows: [
          [
            'Logo',
            'Top left of every page, scaled to fit 53 × 14 mm without stretching',
            'PNG or JPEG; a wide logo on a transparent or white background works best',
            'Pro',
          ],
          [
            'Signature or stamp image',
            'Above the signatory line at the end of each document, scaled to fit 64 × 18 mm',
            'PNG or JPEG, ideally a transparent PNG of the signature or stamp',
            'Pro',
          ],
          [
            'Signatory name and title',
            'Under the signature line on every document',
            'Typed in document settings',
            'Every plan',
          ],
          [
            'Document note',
            'On every document, as a short note',
            'Typed in document settings, such as a returns address',
            'Every plan',
          ],
        ],
      },
    },
    {
      heading: 'How do you add a logo and signature in TradeDocs?',
      paragraphs: [
        'In the workspace’s document settings, once for the whole organization. An owner or administrator of a Pro organization follows these steps:',
      ],
      steps: [
        'Prepare the images: PNG or JPEG, up to 1 MB and 2,000 × 2,000 pixels each. Crop the logo close and scan or photograph the signature on white, then remove the background if you can.',
        'Open the organization’s document settings and find the branding panel.',
        'Upload the logo, then the signature or stamp image. Each shows a preview with its format, size and dimensions.',
        'Fill in the signatory name and title, so the printed name appears under the signature.',
        'Generate a document from a shipment and check the PDF. Every document generated from then on carries the branding.',
      ],
    },
    {
      heading: 'What happens to documents already issued?',
      paragraphs: [
        'They keep exactly what they were issued with. Each document is generated from a snapshot of the shipment and the organization’s settings at that moment, and an issued document keeps the image it was issued with even if you later replace or remove the logo or signature. Old images are deleted only when no slot and no document of the organization still refers to them.',
        'This matters when a buyer or bank asks for a copy months later: the copy is the same document they received, not a re-rendered version with today’s letterhead. To show the new branding on an existing shipment’s documents, generate them again.',
      ],
    },
    {
      heading: 'Who can change the branding, and what if the plan ends?',
      paragraphs: [
        'Only owners and administrators can upload, replace or remove branding images; every member can see the settings, because they appear on the documents everyone generates. Uploading needs the Pro plan, which both the application and the database check before any image is stored.',
        'Removing an image needs no plan, so an organization whose plan has ended can still take its images down. Without branding, the documents still print the signatory name, if you have entered one, under a signature line, which becomes a place to sign by hand. Images are kept in private storage and previewed in settings through short-lived links.',
        'Branding is a workspace feature and needs a TradeDocs account. The free generators produce unbranded documents without an account; see the pricing page for which plans are available today.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is an image of my signature as good as a handwritten one?',
      a: 'That depends on who reads the document. A bank checking documents under a letter of credit, or the importing country’s authorities, may have their own rules on how a document is signed. Ask your buyer, bank or customs broker before you rely on an image.',
    },
    {
      q: 'Can I add a logo with the free invoice generator?',
      a: 'No. The free generators produce a clean, unbranded PDF. Logos and signature images are part of the workspace’s PDF branding, on the Pro plan.',
    },
    {
      q: 'Which file format works best for a logo?',
      a: 'A PNG with a transparent background, cropped close to the logo. TradeDocs keeps the transparency, so the logo sits cleanly on the page. A wide logo fits the header space better than a tall one.',
    },
    {
      q: 'Does the signature print on the packing list too?',
      a: 'Yes. The signatory block, with the signature or stamp image when one is uploaded, prints at the end of each document the organization generates, including packing lists.',
    },
    {
      q: 'Will teammates’ documents carry the same branding?',
      a: 'Yes. Branding belongs to the organization, not to one user, so every member’s documents use the same logo, signature image and signatory name. Only owners and administrators can change them, which keeps one approved version on every document.',
    },
    {
      q: 'Can a company stamp replace the signature?',
      a: 'TradeDocs treats them the same: the image slot takes either a signature or a stamp. Whether a stamp alone is enough is for the reader of the document to decide, so check with the buyer or bank when it matters.',
    },
  ],
  sources: ['c5-cornell-19-cfr-141-86', 'c5-cbsa-d1-4-1'],
  primaryTool: '/tools/invoice-generator',
  tools: [
    '/tools/invoice-generator',
    '/tools/packing-list-generator',
    '/tools/proforma-invoice-generator',
  ],
  callout: {
    afterSection: 2,
    tool: '/tools/invoice-generator',
    title: 'Try the layout without an account',
    text: 'Make an unbranded commercial invoice in the free generator to see the document layout, then sign it by hand or add branding later in the workspace.',
  },
  related: [
    '/blog/commercial-invoice-requirements',
    '/blog/how-to-fill-out-a-commercial-invoice',
    '/blog/commercial-invoice-example',
    '/blog/commercial-invoice-and-packing-list-must-match',
  ],
  cover: {
    id: 'iFLzEx6RNmI',
    src: 'https://images.unsplash.com/photo-1611619899256-5e61d4c46df9',
    width: 4608,
    height: 3072,
    alt: 'A hand holding a pen over white paper, about to sign a printed business document',
    caption: 'About to sign a printed document',
    photographer: { name: 'Owen Michael Grech', profile: 'https://unsplash.com/@winu99' },
    page: 'https://unsplash.com/photos/person-writing-on-white-paper-iFLzEx6RNmI',
  },
};

export default article;
