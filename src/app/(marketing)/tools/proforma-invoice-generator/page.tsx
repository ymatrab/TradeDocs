import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { DocumentGenerator } from '../invoice-generator/generator';
import { SourcesBlock, ToolCta } from '../page-parts';
import { PROFORMA_GENERATOR_FAQ } from '@/lib/content/faq';

const PATH = '/tools/proforma-invoice-generator';

export const metadata: Metadata = {
  title: 'Free proforma invoice template and generator — PDF',
  description:
    'Fill in a proforma invoice for a quotation, a letter of credit or an import licence and download it as a PDF. No account, no watermark, and nothing you type is stored.',
  alternates: { canonical: PATH },
  openGraph: openGraphFor(
    'Free proforma invoice template and generator (PDF)',
    'Fill in a proforma invoice and download the PDF. No account, no watermark, nothing stored.',
    PATH,
  ),
};

const contents = [
  'Seller and buyer, with names and addresses, and the buyer’s reference',
  'Each item quoted, with quantity, unit price and line total',
  'Weights and dimensions of the goods, where you know them',
  'The Incoterms® rule with its named place, and the payment terms',
  'The estimated shipping date and the date the quotation is valid until',
];

const faq = PROFORMA_GENERATOR_FAQ;

export default function ProformaGeneratorPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>Proforma invoice generator</h1>
        <p className="lede">
          A fillable proforma invoice template. Enter the parties and the goods you are quoting,
          download the PDF and send it to your buyer. No account, no watermark, and nothing you type
          is stored.
        </p>
      </section>

      <section className="section">
        <DocumentGenerator initialKind="proforma_invoice" />
      </section>

      <section className="section">
        <h2>What is a proforma invoice?</h2>
        <p className="measure">
          A proforma invoice is a quotation in the form of an invoice. The U.S. International Trade
          Administration lists why buyers ask for one: to apply for an import licence, to arrange a
          pre-shipment inspection, to open a letter of credit and to arrange the transfer of
          currency. A bank or licensing authority needs to see the deal before it happens, laid out
          the way the final invoice will be.
        </p>
        <p className="measure">
          It is not a demand for payment for goods delivered, and if the terms change before
          shipment you issue a revised proforma. The commercial invoice follows when the goods
          actually ship, with the quantities and prices as shipped.
        </p>
        <h2>What goes on one</h2>
        <ul className="measure">
          {contents.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="measure">
          In U.S. customs the term has a second, narrower meaning: an importer without the seller’s
          commercial invoice at entry can file a pro forma invoice under 19 CFR 141.85, a statement
          of value with the commercial invoice to follow.{' '}
          <Link className="text-link" href="/guides/proforma-vs-commercial-invoice">
            Proforma vs commercial invoice, explained
          </Link>
          .
        </p>
      </section>

      <section className="section">
        <Callout tone="legal" title="What this document is">
          A document prepared from information you supplied. It is not issued, endorsed or certified
          by any customs authority, bank or chamber of commerce, and the prices, origin and terms on
          it remain your own statements.
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
        <h2>When the quotation becomes a shipment</h2>
        <p className="measure">
          The figures on the proforma are the ones the commercial invoice and the packing list have
          to repeat. With an account, the shipment holds them once and every document in the set is
          prepared from the same record, so a bank or customs officer comparing them finds the same
          numbers.
        </p>
        <ToolCta secondary={{ href: '/tools', label: 'All trade tools' }} />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.proforma} />
      <RelatedTools current={PATH} />
      <ToolJsonLd path={PATH} faq={faq} />
    </>
  );
}
