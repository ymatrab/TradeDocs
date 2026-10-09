import type { Metadata } from 'next';
import Link from 'next/link';
import { Callout } from '@/components/primitives/feedback';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { HS_CODE_LOOKUP_FAQ } from '@/lib/content/faq';
import { openGraphFor } from '@/lib/seo/social';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../page-parts';
import { HsCodeLookup } from './lookup';

const PATH = '/tools/hs-code-lookup';

export const metadata: Metadata = {
  title: 'HS code lookup — search the US HTS and UK Trade Tariff',
  description:
    'Search the official US Harmonized Tariff Schedule and UK Trade Tariff by product description or code, with a link to each line on the official site. A lookup, not a classification. Free, no account.',
  alternates: { canonical: PATH },
  openGraph: openGraphFor(
    'HS code lookup: the US HTS and UK Trade Tariff in one search',
    'Search both official tariffs by description or code and open each line on the official site. A lookup, not a classification.',
    PATH,
  ),
};

const faq = HS_CODE_LOOKUP_FAQ;

export default function HsCodeLookupPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Free tool</p>
        <h1>HS code lookup</h1>
        <p className="lede">
          Search the United States Harmonized Tariff Schedule and the UK Trade Tariff at once, by
          what the goods are or by a code you already have. Every line links to the official page
          it came from.
        </p>
      </section>

      <section className="section">
        <Callout tone="legal" title="A lookup, not a classification" level={2}>
          These are the tariff lines whose wording matches your search, read live from the USITC
          and HMRC. They are not a classification of your goods and no duty rate is shown. The
          importer, usually with a customs broker, decides the code declared; the customs
          authority can confirm it with a binding ruling.
        </Callout>
      </section>

      <section className="section">
        <HsCodeLookup />
      </section>

      <section className="section">
        <h2>How the lookup works</h2>
        <ul className="measure">
          <li>
            Your search goes from our server to the two official services, the USITC’s HTS search
            and the GOV.UK Trade Tariff API, and their answers come back as they are, trimmed to
            the code and description. Nothing is added or ranked by us.
          </li>
          <li>
            The first six digits of a code are the international Harmonized System; the digits
            after them are national, so the US and UK lines often differ.
          </li>
          <li>
            Results are cached for up to a day, the rate at which the tariffs change. Open the
            official page before you rely on a line.
          </li>
          <li>Searches are not stored, and nothing about them is logged.</li>
        </ul>
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
        <h2>From a code to the documents</h2>
        <p className="measure">
          The code you and your broker settle on goes on the commercial invoice and the packing
          list, beside the description and the country of origin.{' '}
          <Link className="text-link" href="/tools/invoice-generator">
            Open the commercial invoice generator
          </Link>
          .
        </p>
        <ToolCta secondary={{ href: '/tools', label: 'All trade tools' }} />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.hsCodeLookup} />
      <RelatedTools current={PATH} />
      <ToolJsonLd path={PATH} faq={faq} />
    </>
  );
}
