import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';
import { DELIVERY_NOTE_FAQ } from '@/lib/tools/faq';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { DocumentGenerator } from '../invoice-generator/generator';
import { SourcesBlock, ToolCta } from '../page-parts';

const PATH = '/tools/delivery-note-generator';

export const metadata: Metadata = {
  title: 'Free delivery note template and generator — PDF',
  description:
    'Fill in a delivery note with the shipper, the receiver and each line of goods with its quantity, and download it as a PDF. No prices, no account, no watermark, and nothing you type is stored.',
  alternates: { canonical: PATH },
  openGraph: openGraphFor(
    'Free delivery note template (PDF)',
    'Fill in a delivery note with the parties, goods and quantities and download the PDF. No account, nothing stored.',
    PATH,
  ),
};

const contents = [
  'The shipper and the receiver, with the delivery note number and date',
  'A description of the goods on each line, as it appears on the commercial invoice',
  'The quantity and unit of each line, and the HS code where you have it',
  'The Incoterms® rule and named place, so the receiver sees the agreed terms',
];

const faq = DELIVERY_NOTE_FAQ;

export default function DeliveryNoteGeneratorPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>Delivery note generator</h1>
        <p className="lede">
          A delivery note lists what is being handed over: who sends it, who receives it, and the
          goods and quantities, without prices. Fill in the form below and download the PDF. No
          account, no watermark, and nothing you type is stored.
        </p>
      </section>

      <section className="section">
        <DocumentGenerator initialKind="delivery_note" />
      </section>

      <section className="section">
        <h2>What goes on a delivery note</h2>
        <p className="measure">
          The receiver checks the goods against the delivery note when they arrive, so it states
          exactly what was sent and in what quantities. Prices stay on the commercial invoice;
          weights and package dimensions belong on the{' '}
          <Link className="text-link" href="/tools/packing-list-generator">
            packing list
          </Link>
          .
        </p>
        <ul className="measure">
          {contents.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <Callout tone="legal" title="What this document is">
          A document prepared from information you supplied. It is not issued, endorsed or certified
          by any customs authority or carrier, and the descriptions and quantities on it remain your
          own declarations.
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
        <h2>The note, the list and the invoice, from one record</h2>
        <p className="measure">
          Retyping the goods for every document is where they start to disagree. With an account, a
          shipment holds the goods once, and the delivery note, packing list and commercial invoice
          are all prepared from it.
        </p>
        <ToolCta secondary={{ href: '/tools', label: 'All trade tools' }} />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.deliveryNote} />
      <RelatedTools current={PATH} />
      <ToolJsonLd path={PATH} faq={faq} />
    </>
  );
}
