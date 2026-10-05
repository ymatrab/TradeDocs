import type { Metadata } from 'next';
import Link from 'next/link';
import { GuidesHubJsonLd } from '@/components/seo/json-ld';
import { GUIDES } from '@/lib/content/guides';
import { shortDate } from '@/lib/format';
import { openGraphFor } from '@/lib/seo/social';

const description =
  'Plain-language guides to the decisions behind a shipment’s paperwork: LCL or FCL, DAP or DDP, a proforma or a commercial invoice. Sourced, dated and linked to the free tools.';

export const metadata: Metadata = {
  title: 'Shipping and trade document guides',
  description,
  alternates: { canonical: '/guides' },
  openGraph: openGraphFor('Shipping and trade document guides', description, '/guides'),
};

export default function GuidesPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Guides</p>
        <h1>Guides for people who ship</h1>
        <p className="lede">
          Each one answers a question that comes up before a shipment is booked, cites where its
          facts come from, and points at the tool that does the arithmetic.
        </p>
      </section>

      <section className="section">
        <div className="form-grid">
          {GUIDES.map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`} className="form-cell">
              <h2>{guide.title}</h2>
              <p>{guide.description}</p>
              <p className="muted">Last reviewed {shortDate(guide.reviewed)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>How these are written</h2>
        <p className="measure">
          By the TradeDocs team, from the published rules and official guidance listed at the foot
          of each guide, with the date it was last checked. They explain general practice; they are
          not legal, customs or tax advice.
        </p>
        <p className="measure">
          <Link className="text-link" href="/tools">
            See the free tools
          </Link>
        </p>
      </section>
      <GuidesHubJsonLd />
    </>
  );
}
