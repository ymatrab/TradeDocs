import type { Metadata } from 'next';
import Link from 'next/link';
import { CoverFigure } from '@/components/content/cover-figure';
import { BlogHubJsonLd } from '@/components/seo/json-ld';
import { GUIDES } from '@/lib/content/guides';
import { unsplashShareImage } from '@/lib/content/images';
import { BLOG_HUB_COVER, POSTS } from '@/lib/content/posts';
import { shortDate } from '@/lib/format';
import { openGraphFor, twitterFor } from '@/lib/seo/social';

const title = 'Export documentation blog';
const description =
  'Practical articles on the paperwork behind a shipment: commercial invoice requirements, a proforma invoice example, an export documents checklist, packing lists and FCA vs FOB. Sourced and dated.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': [{ url: '/blog/rss.xml', title: 'TradeDocs blog' }] },
  },
  openGraph: openGraphFor(title, description, '/blog', unsplashShareImage(BLOG_HUB_COVER)),
  twitter: twitterFor(unsplashShareImage(BLOG_HUB_COVER)),
};

/** Newest first; the data module keeps its own order for the sitemap and llms.txt. */
const ordered = [...POSTS].sort((a, b) => b.published.localeCompare(a.published));

export default function BlogPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Blog</p>
        <h1>Export paperwork, explained</h1>
        <p className="lede">
          What goes on each document, in what order, and why customs, carriers and banks read it the
          way they do. Every article answers the question first, cites its sources and links to the
          free tool that does the work.
        </p>
      </section>

      <section className="section guide-cover-section">
        <CoverFigure photo={BLOG_HUB_COVER} priority />
      </section>

      <section className="section" aria-labelledby="posts-title">
        <h2 id="posts-title" className="sr-only">
          Articles
        </h2>
        <div className="form-grid">
          {ordered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="form-cell">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <p className="muted">
                {post.byline} · <time dateTime={post.published}>{shortDate(post.published)}</time>
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="guides-title">
        <h2 id="guides-title">Guides to the bigger decisions</h2>
        <p className="measure">
          The guides compare the choices that come before the paperwork: how to ship, which
          delivered rule to agree, which invoice to send.
        </p>
        <div className="form-grid">
          {GUIDES.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="form-cell">
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>How these are written</h2>
        <p className="measure">
          By the TradeDocs team, from the published rules and official guidance listed at the foot
          of each article, with the date it was last checked. Worked examples use invented parties.
          They explain general practice; they are not legal, customs or tax advice.
        </p>
        <p className="measure">
          <Link className="text-link" href="/tools">
            See the free tools
          </Link>{' '}
          ·{' '}
          <a className="text-link" href="/blog/rss.xml">
            RSS feed
          </a>
        </p>
      </section>
      <BlogHubJsonLd />
    </>
  );
}
