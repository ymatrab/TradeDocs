import type { Metadata } from 'next';
import Link from 'next/link';
import { LinkButton } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { DocumentGenerator } from './generator';

export const metadata: Metadata = {
  title: 'Free commercial invoice generator — PDF, no sign-up',
  description:
    'Fill in a commercial invoice, proforma invoice or packing list and download it as a PDF. No account, no watermark, and nothing you type is stored.',
  alternates: { canonical: '/tools/invoice-generator' },
};

const faq = [
  {
    q: 'What has to be on a commercial invoice?',
    a: 'The seller and buyer with full addresses, an invoice number and date, a description of the goods, quantities, unit prices and the total, the currency, the country of origin, and the agreed Incoterm with its named place. HS codes are not always mandatory but customs work is far faster with them.',
  },
  {
    q: 'What is the difference between a commercial invoice and a proforma invoice?',
    a: 'A proforma is issued before the sale is concluded — it is a formal quotation the buyer uses to arrange payment or open a letter of credit. A commercial invoice is the demand for payment for goods actually sold, and it is the document customs values the consignment from.',
  },
  {
    q: 'Is anything I type here saved?',
    a: 'No. The form runs in your browser, the details are sent once to render the PDF, and nothing is written to a database. Close the tab and it is gone — which also means we cannot recover it for you.',
  },
  {
    q: 'Is the PDF watermarked?',
    a: 'No. It is produced by the same engine the product uses, so what you download is the real output. Every document carries a line stating that it was prepared from your own data and is not issued or certified by any authority — that line is on every TradeDocs document and cannot be removed.',
  },
];

export default function GeneratorPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>Commercial invoice generator</h1>
        <p className="lede">
          Fill it in, download the PDF. No account, no watermark, and nothing you type is stored
          anywhere. Also produces a proforma invoice or a packing list from the same form.
        </p>
      </section>

      <section className="section">
        <DocumentGenerator />
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
          a packing list that contradicts its invoice is the usual reason a consignment is held.
          With an account, the goods and the parties are saved once, every document is generated
          from the same shipment, and the set downloads together with a manifest.
        </p>
        <div className="cta-row">
          <LinkButton href="/sign-up">Create a free account</LinkButton>
          <Link className="text-link" href="/tools">
            All trade tools
          </Link>
        </div>
      </section>
    </>
  );
}
