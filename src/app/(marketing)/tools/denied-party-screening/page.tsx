import type { Metadata } from 'next';
import Link from 'next/link';
import { LinkButton } from '@/components/primitives/button';
import { Callout, EmptyState } from '@/components/primitives/feedback';
import { ToolJsonLd } from '@/components/seo/json-ld';
import { RelatedTools } from '@/components/seo/related-tools';
import { DENIED_PARTY_FAQ } from '@/lib/content/faq';
import { cslApiKey } from '@/lib/screening/config';
import { CSL_OFFICIAL_SEARCH } from '@/lib/screening/csl';
import { openGraphFor } from '@/lib/seo/social';
import { SCREENING_TOOL } from '@/lib/seo/site';
import { PAGE_SOURCES } from '@/lib/trade/sources';
import { SourcesBlock, ToolCta } from '../page-parts';
import { DeniedPartyScreening } from './screening';

const PATH = SCREENING_TOOL.path;

// Whether the tool runs follows the deployment's CSL key, so it is decided per request.
export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  const available = cslApiKey() !== null;
  return {
    title: 'Denied party screening — search the US Consolidated Screening List',
    description:
      'Screen a company or person against the US Consolidated Screening List of the Departments of Commerce, State and the Treasury, with the source list for each match. A screening aid, not a compliance determination.',
    alternates: { canonical: PATH },
    // Not offered to search engines while it cannot run (D-025).
    ...(available ? {} : { robots: { index: false, follow: true } }),
    openGraph: openGraphFor(
      'Denied party screening against the US Consolidated Screening List',
      'Screen a name against the Commerce, State and Treasury lists in one search. A screening aid, not a compliance determination.',
      PATH,
    ),
  };
}

const faq = DENIED_PARTY_FAQ;

export default function DeniedPartyScreeningPage() {
  const available = cslApiKey() !== null;
  return (
    <>
      <section className="hero">
        <p className="eyebrow">{available ? 'Free tool' : 'Not available yet'}</p>
        <h1>Denied party screening</h1>
        <p className="lede">
          Check a buyer, consignee or end user against the US Consolidated Screening List, which
          brings together the export screening lists of the Departments of Commerce, State and the
          Treasury, and see which list each possible match is on.
        </p>
      </section>

      <section className="section">
        <Callout tone="legal" title="A screening aid, not a compliance determination" level={2}>
          A match is a prompt for due diligence, and no match clears nothing: licensing, end-use
          rules, embargoes and other countries’ lists still apply. Before acting on a result, check
          the official list it came from. Names you search are sent to the trade.gov API to run the
          search and are not stored or logged by TradeDocs.
        </Callout>
      </section>

      <section className="section">
        {available ? (
          <DeniedPartyScreening />
        ) : (
          <EmptyState
            title="Screening is not available here yet"
            description="This tool runs on the trade.gov Consolidated Screening List API, which needs a key that has not been set up on this site. Until it is, the official CSL search on trade.gov does the same search, free."
            action={
              <LinkButton href={CSL_OFFICIAL_SEARCH} rel="noopener">
                Open the official CSL search
              </LinkButton>
            }
          />
        )}
      </section>

      <section className="section">
        <h2>What the list covers</h2>
        <ul className="measure">
          <li>
            Commerce (Bureau of Industry and Security): the Denied Persons, Entity, Unverified and
            Military End User lists.
          </li>
          <li>State: nonproliferation sanctions and the AECA debarred list.</li>
          <li>
            Treasury (OFAC): the Specially Designated Nationals list and other sanctions lists.
          </li>
          <li>
            trade.gov updates the consolidated list every day from the agencies that own each list.
          </li>
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
        <h2>Screened, then documented</h2>
        <p className="measure">
          Once the parties are checked, the same names go on the proforma, the commercial invoice
          and the packing list.{' '}
          <Link className="text-link" href="/tools/proforma-invoice-generator">
            Open the proforma invoice generator
          </Link>
          .
        </p>
        <ToolCta secondary={{ href: '/tools', label: 'All trade tools' }} />
      </section>

      <SourcesBlock ids={PAGE_SOURCES.deniedPartyScreening} />
      <RelatedTools current={PATH} />
      {available ? <ToolJsonLd path={PATH} faq={faq} /> : null}
    </>
  );
}
