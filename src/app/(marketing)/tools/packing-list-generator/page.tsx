import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { openGraphFor } from '@/lib/seo/social';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { DocumentGenerator } from '../invoice-generator/generator';
import { SourcesBlock, ToolCta } from '../page-parts';

const PATH = '/tools/packing-list-generator';

export const metadata: Metadata = {
  title: 'Free packing list template for shipping and export — PDF',
  description:
    'Fill in an export packing list with packages, quantities and net and gross weights per line, and download it as a PDF. No account, no watermark, and nothing you type is stored.',
  alternates: { canonical: PATH },
  openGraph: openGraphFor(
    'Free export packing list template (PDF)',
    'Fill in a shipping packing list with packages and weights per line and download the PDF. No account, nothing stored.',
    PATH,
  ),
};

const contents = [
  'Shipper and consignee, with the document number and date',
  'A description of the goods on each line, as it appears on the commercial invoice',
  'The number of packages on each line and the quantity they hold',
  'Net and gross weight per line, and the totals',
  'The Incoterms® rule and named place, so the set states one set of terms',
];

const faq = [
  {
    q: 'What is a packing list used for?',
    a: 'It itemises what is in each package of a shipment. Freight forwarders use it to work out weights and shipping costs, and customs officials use it to check the contents of packages against the declaration, as the U.S. International Trade Administration describes.',
  },
  {
    q: 'Does a packing list show prices?',
    a: 'Not normally, and this one does not: the PDF prints packages, quantities and weights, not unit prices or values. The values belong on the commercial invoice. The unit price field on the form is used only if you switch the type to an invoice.',
  },
  {
    q: 'Do the packing list and commercial invoice have to match?',
    a: 'They should describe the same goods in the same quantities, with the same parties and terms. A packing list that disagrees with its invoice is a common reason for questions at customs, which is why preparing both from the same figures matters.',
  },
  {
    q: 'Can I download the packing list as Excel?',
    a: 'Not from this page; it produces a PDF, which is what is usually sent with the shipment. With an account, a shipment’s documents download together, and the product catalog imports from the spreadsheet you already keep.',
  },
];

export default function PackingListGeneratorPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>Packing list generator</h1>
        <p className="lede">
          A fillable export packing list. Enter the parties, then the packages, quantities and
          weights on each line, and download the PDF to send with the shipment. No account, no
          watermark, and nothing you type is stored.
        </p>
      </section>

      <section className="section">
        <DocumentGenerator initialKind="packing_list" />
      </section>

      <section className="section">
        <h2>What goes on a packing list</h2>
        <p className="measure">
          A packing list itemises the contents of each package in a shipment, with weights,
          measurements and a description of the goods. It travels with the cargo, often inside one
          carton and attached to the outside of another, so whoever opens the shipment can check it
          without the commercial invoice.
        </p>
        <ul className="measure">
          {contents.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="measure">
          Work out the cubic metres of your cartons with the{' '}
          <Link className="text-link" href="/tools/cbm-calculator">
            CBM calculator
          </Link>{' '}
          before you book, and check whether you will be billed on volume with the{' '}
          <Link className="text-link" href="/tools/chargeable-weight">
            dimensional weight calculator
          </Link>
          .
        </p>
      </section>

      <section className="section">
        <Callout tone="legal" title="What this document is">
          A document prepared from information you supplied. It is not issued, endorsed or certified
          by any customs authority or carrier, and the descriptions and weights on it remain your
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
        <h2>The list and the invoice, from one record</h2>
        <p className="measure">
          Typing the same goods into a packing list after the invoice is where the two start to
          disagree. With an account, the shipment holds the goods, packages and weights once, and
          the packing list and the commercial invoice are both prepared from it.
        </p>
        <ToolCta secondary={{ href: '/tools', label: 'All trade tools' }} />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.packingList} />
      <RelatedTools current={PATH} />
      <ToolJsonLd path={PATH} faq={faq} />
    </>
  );
}
