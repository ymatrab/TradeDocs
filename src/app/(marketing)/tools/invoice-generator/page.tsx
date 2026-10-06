import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../page-parts';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';
import { DocumentGenerator } from './generator';
import { INVOICE_GENERATOR_FAQ } from '@/lib/content/faq';

export const metadata: Metadata = {
  title: 'Commercial invoice template and generator — free PDF',
  description:
    'A fillable commercial invoice template for export shipments: enter the seller, buyer and goods and download the PDF. No account, no watermark, and nothing you type is stored.',
  alternates: { canonical: '/tools/invoice-generator' },
  openGraph: openGraphFor(
    'Commercial invoice template and generator (free PDF)',
    'A fillable commercial invoice template: enter the seller, buyer and goods and download the PDF. No account, no watermark, nothing stored.',
    '/tools/invoice-generator',
  ),
};

/** What each part of the form becomes on the invoice, in the order the form asks for it. */
const fields = [
  {
    term: 'Document number and date',
    detail:
      'Your own invoice number, unique to this sale, and the date it is issued. Customs, the buyer and its bank all refer to the invoice by this number.',
  },
  {
    term: 'Currency',
    detail:
      'The currency the goods are priced and paid in, as a three-letter code. Every price and total on the invoice is in this currency.',
  },
  {
    term: 'Incoterms® rule and named place',
    detail:
      'Who pays for carriage and where risk passes, such as FCA Rotterdam. The rule alone does not identify a delivery point, so give the place with it.',
  },
  {
    term: 'Country of origin',
    detail:
      'Where the goods were produced, which is not necessarily where they ship from. State it for the whole shipment, or per line when the lines differ.',
  },
  {
    term: 'Issued by and addressed to',
    detail:
      'The seller (often also the exporter) and the buyer, with full addresses and any tax or registration number the importing country expects.',
  },
  {
    term: 'Description of goods',
    detail:
      'What the goods are, precisely enough for customs to classify them: material, use and model rather than a product code alone.',
  },
  {
    term: 'HS code',
    detail:
      'The Harmonized System code of each line. It is not always mandatory on the invoice, but customs work is faster with it.',
  },
  {
    term: 'Quantity, unit and unit price',
    detail:
      'How many, counted in what, at what price each. The line total and the invoice total are worked out from these with exact decimal arithmetic.',
  },
  {
    term: 'Net and gross weight, packages',
    detail:
      'Optional. They print on the packing list made from the same form, not on the invoice itself. Net is the goods alone; gross includes their packaging.',
  },
];

const faq = INVOICE_GENERATOR_FAQ;

export default function GeneratorPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>Commercial invoice template and generator</h1>
        <p className="lede">
          A commercial invoice template you fill in on the page: seller, buyer, goods and terms,
          then download the PDF. No account, no watermark, and nothing you type is stored anywhere.
          The same form also produces a{' '}
          <Link className="text-link" href="/tools/proforma-invoice-generator">
            proforma invoice
          </Link>{' '}
          or a{' '}
          <Link className="text-link" href="/tools/packing-list-generator">
            packing list
          </Link>
          .
        </p>
      </section>

      <section className="section">
        <DocumentGenerator />
      </section>

      <section className="section" aria-labelledby="fields-title">
        <h2 id="fields-title">What each field on the invoice means</h2>
        <p className="measure">
          A commercial invoice is the seller’s bill for goods sold and shipped, and the document
          customs in the importing country assesses duties and taxes from. Most of the form prints
          on the invoice; the weights and package counts print on the packing list instead.
        </p>
        <ul className="measure">
          {fields.map((field) => (
            <li key={field.term}>
              <strong>{field.term}.</strong> {field.detail}
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <Callout tone="legal" title="What this document is">
          A document prepared from information you supplied. It is not issued, endorsed, certified
          or cleared by any customs authority, carrier or chamber of commerce, and the HS codes,
          origin and values on it remain your declarations.
        </Callout>
      </section>

      <section className="section">
        <h2>Questions people ask</h2>
        <div className="faq">
          {faq.map((entry) => (
            <details key={entry.q}>
              <summary>{entry.q}</summary>
              <p>{entry.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>The second invoice is the problem</h2>
        <p className="measure">
          Filling this in once is fine. Filling it in again next month, then retyping the same
          figures into a packing list, is where a document set starts to disagree with itself — and
          a packing list that contradicts its invoice is a common reason a consignment is held. With
          an account, the goods and the parties are saved once, every document is generated from the
          same shipment, and the set downloads together with a manifest.
        </p>
        <ToolCta
          current="/tools/invoice-generator"
          secondary={{ href: '/tools', label: 'All trade tools' }}
        />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.invoice} />
      <RelatedTools current="/tools/invoice-generator" />
      <ToolJsonLd path="/tools/invoice-generator" faq={faq} />
    </>
  );
}
