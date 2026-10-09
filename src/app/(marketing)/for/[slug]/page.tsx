import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Check, Clock } from 'lucide-react';
import { LinkButton } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { primaryAction } from '@/components/shell/public';
import { UseCaseJsonLd } from '@/components/seo/json-ld';
import { offeredFeatures } from '@/lib/billing/plans';
import { regulatedDocumentsEnabled } from '@/lib/config/server';
import { USE_CASES, findUseCase, type UseCase } from '@/lib/content/use-cases';
import { openGraphFor } from '@/lib/seo/social';
import { isDatabaseConfigured } from '@/lib/supabase/server';

/** The three use-case pages. Anything else is a 404, not an empty page. */
export function generateStaticParams() {
  return USE_CASES.map((useCase) => ({ slug: useCase.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const useCase = findUseCase(slug);
  if (!useCase) return { title: 'TradeDocs' };
  const path = `/for/${useCase.slug}`;
  return {
    title: useCase.title,
    description: useCase.description,
    alternates: { canonical: path },
    openGraph: openGraphFor(useCase.title, useCase.description, path),
  };
}

/**
 * The workspace features this page names, read from plans.ts with their enforced limits.
 * On a deployment without accounts each one says it is waiting, as the pricing page does.
 */
function FeatureList({ useCase, accountsOpen }: { useCase: UseCase; accountsOpen: boolean }) {
  const wanted = new Set<string>(useCase.features);
  const features = offeredFeatures(regulatedDocumentsEnabled()).filter((feature) =>
    wanted.has(feature.key),
  );
  return (
    <ul className="ledger" aria-label="What the workspace does">
      {features.map((feature) => {
        const waiting = feature.needsAccount && !accountsOpen;
        return (
          <li key={feature.key}>
            {waiting ? (
              <Clock size={17} aria-hidden="true" className="not-yet" />
            ) : (
              <Check size={17} aria-hidden="true" className="yes" />
            )}
            <span>
              {feature.label}
              {'limit' in feature && feature.limit ? (
                <span className="pricing-limit">{feature.limit}</span>
              ) : null}
              {waiting ? (
                <span className="pricing-limit">Needs an account; not open on this site yet</span>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function LinkGrid({ links }: { links: UseCase['tools'] }) {
  return (
    <div className="form-grid">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="form-cell">
          <h3>{link.label}</h3>
        </Link>
      ))}
    </div>
  );
}

export default async function UseCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const useCase = findUseCase(slug);
  if (!useCase) notFound();

  const accountsOpen = isDatabaseConfigured();
  const action = primaryAction(accountsOpen);
  const closedNote = accountsOpen
    ? null
    : 'Accounts are not open on this deployment yet; the free tools work now.';

  return (
    <>
      <section className="hero">
        <p className="eyebrow">{useCase.eyebrow}</p>
        <h1>{useCase.h1}</h1>
        <p className="lede">{useCase.lede}</p>
        <div className="cta-row">
          <LinkButton href={action.href} className="large">
            {action.label} <ArrowRight size={18} aria-hidden="true" />
          </LinkButton>
          <LinkButton href="/tools" tone="secondary" className="large">
            {accountsOpen ? 'Try a free tool' : 'See all free tools'}
          </LinkButton>
        </div>
        {closedNote ? <p className="muted">{closedNote}</p> : null}
      </section>

      <section className="section" aria-labelledby="jobs-title">
        <h2 id="jobs-title">What you would use it for</h2>
        <div className="cards four">
          {useCase.jobs.map((job) => (
            <article className="card" key={job.title}>
              <h3>{job.title}</h3>
              <p>{job.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="features-title">
        <h2 id="features-title">What the workspace does today</h2>
        <p className="measure">
          Free while early, with no card. The full list, with what each plan includes, is on the{' '}
          <Link className="text-link" href="/pricing">
            pricing page
          </Link>
          .
        </p>
        <FeatureList useCase={useCase} accountsOpen={accountsOpen} />
      </section>

      <section className="section">
        {/* The callout's body is a paragraph, so the boundaries read as sentences in it. */}
        <Callout tone="legal" title="What TradeDocs does not do">
          {useCase.boundaries.join(' ')}
        </Callout>
      </section>

      <section className="section" aria-labelledby="tools-title">
        <h2 id="tools-title">Free tools to start with</h2>
        <p className="measure">No account needed. The calculators run in your browser.</p>
        <LinkGrid links={useCase.tools} />
      </section>

      <section className="section" aria-labelledby="reading-title">
        <h2 id="reading-title">Worth reading</h2>
        <LinkGrid links={useCase.reading} />
      </section>

      <section className="section">
        <h2>Questions people ask</h2>
        <div className="faq">
          {useCase.faq.map((entry) => (
            <details key={entry.q}>
              <summary>{entry.q}</summary>
              <p>{entry.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Start with one shipment</h2>
        <div className="cta-row">
          <LinkButton href={action.href}>{action.label}</LinkButton>
          <Link className="text-link" href="/pricing">
            See pricing
          </Link>
          {closedNote ? <span className="muted">{closedNote}</span> : null}
        </div>
      </section>

      <UseCaseJsonLd slug={useCase.slug} />
    </>
  );
}
