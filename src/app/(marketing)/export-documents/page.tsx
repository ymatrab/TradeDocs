import type { Metadata } from 'next';
import Link from 'next/link';
import { CountriesHubJsonLd } from '@/components/seo/json-ld';
import { COUNTRIES, COUNTRIES_HUB, COUNTRY_POSTS, LISTED_COUNTRIES } from '@/lib/content/countries';
import { COUNTRY_DISCLAIMER } from '@/lib/content/country';
import { shortDate } from '@/lib/format';
import { openGraphFor } from '@/lib/seo/social';

export const metadata: Metadata = {
  title: COUNTRIES_HUB.metaTitle,
  description: COUNTRIES_HUB.description,
  alternates: { canonical: '/export-documents' },
  openGraph: openGraphFor(COUNTRIES_HUB.title, COUNTRIES_HUB.description, '/export-documents'),
  // An index of pages that are all still waiting for review would be indexed with nothing
  // indexable behind it, so the hub follows its first reviewed country.
  ...(LISTED_COUNTRIES.length > 0 ? {} : { robots: { index: false, follow: true } }),
};

export default function ExportDocumentsHubPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Export documents by country</p>
        <h1>{COUNTRIES_HUB.title}</h1>
        <p className="lede">{COUNTRIES_HUB.lede}</p>
      </section>

      <section className="section" aria-labelledby="countries-title">
        <h2 id="countries-title">Countries</h2>
        <div className="form-grid">
          {COUNTRIES.map((country) => (
            <Link
              key={country.slug}
              href={`/export-documents/${country.slug}`}
              className="form-cell"
            >
              <h3>{country.name}</h3>
              <p>{country.answer}</p>
              <p className="muted">Checked against sources {shortDate(country.reviewed)}</p>
            </Link>
          ))}
          {COUNTRY_POSTS.map((post) => (
            <Link key={post.href} href={post.href} className="form-cell">
              <h3>{post.name}</h3>
              <p>What a commercial invoice for {post.name} must show, on the blog.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>How these pages are written</h2>
        <p className="measure">
          From the destination’s customs authority and the U.S. International Trade Administration’s
          country commercial guides, with the source beside every line and the date it was checked.
          A country is added only when at least five of its facts can be sourced.{' '}
          {COUNTRY_DISCLAIMER}
        </p>
        <p className="measure">
          <Link className="text-link" href="/blog/export-documents-checklist">
            The export documents checklist
          </Link>{' '}
          ·{' '}
          <Link className="text-link" href="/glossary">
            Glossary
          </Link>{' '}
          ·{' '}
          <Link className="text-link" href="/tools/invoice-generator">
            Commercial invoice generator
          </Link>
        </p>
      </section>
      <CountriesHubJsonLd />
    </>
  );
}
