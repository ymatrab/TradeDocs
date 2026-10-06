import type { Metadata } from 'next';
import { ArrowRight, Check, Clock, Minus } from 'lucide-react';
import { LinkButton } from '@/components/primitives/button';
import { DataTable } from '@/components/primitives/table';
import { primaryAction } from '@/components/shell/public';
import { PricingJsonLd } from '@/components/seo/json-ld';
import { currentPlans } from '@/lib/billing/server';
import {
  FEATURES,
  INTERVAL_LABELS,
  paidOnlyFeatures,
  type Feature,
  type Plan,
  type PlanId,
} from '@/lib/billing/plans';
import { openGraphFor } from '@/lib/seo/social';
import { isDatabaseConfigured } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Pricing — free while early',
  description:
    'TradeDocs is free while it is early: every document generator, calculator and workspace feature, with no card. Paid plans are not open yet; their prices will be published here first.',
  alternates: { canonical: '/pricing' },
  openGraph: openGraphFor(
    'TradeDocs pricing: free while early',
    'Every feature free while TradeDocs is early, with no card. Paid plans are not open yet.',
    '/pricing',
  ),
};

/**
 * Pricing, from one source (src/lib/billing/plans.ts). Every plan side by side with its full
 * feature list, then the comparison table, then the questions. Nothing here states a price:
 * a paid plan shows one only when the environment supplies it and payments are open, and
 * otherwise says "Not available yet" with no button.
 */

const questions = [
  {
    q: 'Is TradeDocs free?',
    a: 'Yes, while it is early. Every feature listed on this page is free today, and no paid plan is open, so nobody is charged for anything.',
  },
  {
    q: 'Do I need a card to start?',
    a: 'No. The free tools need no account at all, and creating an account asks for no payment details.',
  },
  {
    q: 'What happens when paid plans arrive?',
    a: 'Their prices and what they add will be published on this page before they open, with notice. Until then the paid plans show "Not available yet" and cannot be bought.',
  },
  {
    q: 'What is the refund policy?',
    a: 'A refund policy will be published before paid plans open. No one can pay today, so there is nothing to refund yet.',
  },
  {
    q: 'If I cancel a paid plan later, when does it end?',
    a: 'At the end of the period you paid for: cancelling stops the renewal, not the access you have already paid for. A fully refunded or disputed payment ends the plan straight away.',
  },
  {
    q: 'Who will take the payment?',
    a: 'Stripe, on its own hosted checkout page. Card details are entered there and never reach TradeDocs.',
  },
];

const GROUPS = ['Free tools', 'Workspace', 'Team'] as const;

function planIncludes(feature: Feature, plan: PlanId): boolean {
  return feature.plans.includes(plan);
}

function PlanPrice({ plan }: { plan: Plan }) {
  if (plan.offer.state === 'free') {
    return (
      <p className="pricing-price">
        <span className="pricing-amount">Free</span>
        <span className="pricing-term">No card · while early</span>
      </p>
    );
  }
  if (plan.offer.state === 'purchasable') {
    return (
      <p className="pricing-price">
        <span className="pricing-amount">{plan.offer.price}</span>
        <span className="pricing-term">{INTERVAL_LABELS[plan.offer.interval]}</span>
      </p>
    );
  }
  return (
    <p className="pricing-price">
      <span className="pricing-amount pricing-unavailable">Not available yet</span>
      <span className="pricing-term">No price is set</span>
    </p>
  );
}

function FeatureLedger({ plan, accountsOpen }: { plan: PlanId; accountsOpen: boolean }) {
  // A paid plan that adds nothing over Free says so instead of repeating Free's list.
  const extras = FEATURES.filter(
    (feature) => planIncludes(feature, plan) && !planIncludes(feature, 'free'),
  );
  if (plan !== 'free' && extras.length === 0) {
    return <p className="pricing-note">Everything in Free. Paid-only features: none yet.</p>;
  }
  return (
    <ul className="ledger" aria-label="Included features">
      {FEATURES.filter((feature) => planIncludes(feature, plan)).map((feature) => {
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

export default function PricingPage() {
  const accountsOpen = isDatabaseConfigured();
  const action = primaryAction(accountsOpen);
  const plans = currentPlans();

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Pricing</p>
        <h1>Free while early.</h1>
        <p className="lede">
          Everything TradeDocs does today is free, with no card. Paid plans are not open yet: when
          they are, their prices and what they add will be published here first.
        </p>
      </section>

      <section className="section" aria-labelledby="plans-title">
        <div className="section-head">
          <p className="eyebrow">Plans</p>
          <h2 id="plans-title">Every plan, side by side.</h2>
        </div>
        <div className="cards pricing-plans">
          {plans.map((plan) => {
            const paidOnly = plan.id === 'free' ? [] : paidOnlyFeatures(plan.id);
            return (
              <article
                className="card pricing-plan"
                key={plan.id}
                aria-labelledby={`plan-${plan.id}`}
              >
                <span className={plan.id === 'free' ? 'tag on-tape' : 'tag'}>
                  {plan.offer.state === 'unavailable' ? 'Not open' : 'Open now'}
                </span>
                <h3 id={`plan-${plan.id}`}>{plan.name}</h3>
                <PlanPrice plan={plan} />
                <p>{plan.summary}</p>
                {plan.id !== 'free' ? (
                  <p className="pricing-note">
                    {paidOnly.length === 0
                      ? 'Paid-only features: none yet. They will be listed here before this plan opens.'
                      : `Paid-only: ${paidOnly.map((feature) => feature.label).join('; ')}.`}
                  </p>
                ) : null}
                <FeatureLedger plan={plan.id} accountsOpen={accountsOpen} />
                <div className="card-foot">
                  {plan.offer.state === 'free' ? (
                    <LinkButton href={action.href}>
                      {action.label} <ArrowRight size={17} aria-hidden="true" />
                    </LinkButton>
                  ) : plan.offer.state === 'purchasable' && accountsOpen ? (
                    // Buying happens from inside the workspace, where the organization is known.
                    <LinkButton href="/app" tone="secondary">
                      Upgrade from your workspace <ArrowRight size={17} aria-hidden="true" />
                    </LinkButton>
                  ) : (
                    <span className="caption">Cannot be bought yet</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section sunken" aria-labelledby="compare-title">
        <div className="section-head">
          <p className="eyebrow">Compare</p>
          <h2 id="compare-title">What each plan includes.</h2>
        </div>
        <DataTable caption="Features by plan">
          <thead>
            <tr>
              <th scope="col">Feature</th>
              {plans.map((plan) => (
                <th scope="col" key={plan.id}>
                  {plan.name}
                  {plan.offer.state === 'unavailable' ? (
                    <span className="pricing-limit">Not available yet</span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          {GROUPS.map((group) => (
            <tbody key={group}>
              <tr>
                <th scope="colgroup" colSpan={plans.length + 1} className="pricing-group">
                  {group}
                </th>
              </tr>
              {FEATURES.filter((feature) => feature.group === group).map((feature) => (
                <tr key={feature.key}>
                  <th scope="row" className="pricing-feature">
                    {feature.label}
                    {'limit' in feature && feature.limit ? (
                      <span className="pricing-limit">{feature.limit}</span>
                    ) : null}
                  </th>
                  {plans.map((plan) => (
                    <td key={plan.id}>
                      {planIncludes(feature, plan.id) && feature.needsAccount && !accountsOpen ? (
                        <>
                          <Clock size={17} aria-hidden="true" className="not-yet" />
                          <span className="sr-only">Not open yet</span>
                        </>
                      ) : planIncludes(feature, plan.id) ? (
                        <>
                          <Check size={17} aria-hidden="true" className="yes" />
                          <span className="sr-only">Included</span>
                        </>
                      ) : (
                        <>
                          <Minus size={17} aria-hidden="true" />
                          <span className="sr-only">Not included</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </DataTable>
        <p className="note">
          Limits are the ones the service enforces today. The generator quota applies per network
          address wherever this site runs request quotas.
        </p>
      </section>

      <section className="section" aria-labelledby="pricing-faq-title">
        <div className="section-head">
          <p className="eyebrow">Questions</p>
          <h2 id="pricing-faq-title">About paying, and not paying.</h2>
        </div>
        <div className="faq">
          {questions.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <div className="cta-row pricing-closing">
          <LinkButton href={action.href} className="large">
            {action.label} <ArrowRight size={18} aria-hidden="true" />
          </LinkButton>
          <LinkButton href="/tools" tone="secondary" className="large">
            See all free tools
          </LinkButton>
        </div>
      </section>
      <PricingJsonLd faq={questions} />
    </>
  );
}
