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
  listedPrices,
  paidAdditions,
  paidOnlyFeatures,
  paidOnlySummary,
  PLAN_NAMES,
  type Feature,
  type PaidPlanId,
  type Plan,
  type PlanId,
} from '@/lib/billing/plans';
import { MAX_IMPORT_ROWS, MAX_SET_DOCUMENTS } from '@/lib/limits';
import { openGraphFor } from '@/lib/seo/social';
import { isDatabaseConfigured } from '@/lib/supabase/server';

/**
 * Pricing, from one source (src/lib/billing/plans.ts). Every plan side by side with its full
 * feature list, the comparison table, why TradeDocs (facts about this product only, no other
 * product named), then the questions.
 *
 * Three honest states, decided per plan by the offer:
 * - PRICES_APPROVED off (the default): no price anywhere, paid plans "Not available yet".
 * - Approved, checkout not open: the approved prices show, with no button ("listed").
 * - Approved and purchasable: the env price, and the way to buy from the workspace.
 */

type PageState = 'unpriced' | 'listed' | 'open';

function pageState(plans: Plan[]): PageState {
  if (plans.some((plan) => plan.offer.state === 'purchasable')) return 'open';
  if (plans.some((plan) => plan.offer.state === 'listed')) return 'listed';
  return 'unpriced';
}

/**
 * What Pro and Team add over Free, from plans.ts, such as " Pro and Team add PDF branding;
 * Team also adds the REST API."
 */
const PAID_EXTRAS = paidOnlySummary();
const ADDITIONS = paidAdditions();
const ADDS = ADDITIONS ? ` ${ADDITIONS}.` : '';
const FREE_SCOPE = PAID_EXTRAS
  ? `every document generator, calculator and workspace feature except ${PAID_EXTRAS}`
  : 'every document generator, calculator and workspace feature';

const DESCRIPTIONS: Record<PageState, string> = {
  unpriced: `TradeDocs is free while it is early: ${FREE_SCOPE}, with no card.${ADDS} Paid plans are not open yet; their prices will be published here first.`,
  listed: `TradeDocs is free while it is early, with no card.${ADDS} Pro and Team prices, monthly or yearly in US dollars or euros, are listed here; checkout is not open yet.`,
  open: `TradeDocs is free while it is early, with no card.${ADDS} Pro and Team prices are listed here and can be bought from your workspace.`,
};

export function generateMetadata(): Metadata {
  const description = DESCRIPTIONS[pageState(currentPlans())];
  return {
    title: 'Pricing — free while early',
    description,
    alternates: { canonical: '/pricing' },
    openGraph: openGraphFor('TradeDocs pricing: free while early', description, '/pricing'),
  };
}

type Question = { q: string; a: string };

const CURRENCY_NAMES: Record<string, string> = { USD: 'US dollars', EUR: 'euros' };

/** "$19 a month or $190 a year (€19 or €190 in euros)". */
function priceSentence(plan: PaidPlanId): string {
  const [first, ...others] = listedPrices(plan);
  if (!first) return 'not priced yet';
  const extra = others.map((price) => {
    const name = CURRENCY_NAMES[price.currency] ?? price.currency;
    return `${price.month} or ${price.year} in ${name}`;
  });
  const suffix = extra.length > 0 ? ` (${extra.join('; ')})` : '';
  return `${first.month} a month or ${first.year} a year${suffix}`;
}

/** The price a plan's card shows: the live checkout price when open, otherwise the proposal. */
function quotedPrice(plan: PaidPlanId, plans: ReturnType<typeof currentPlans>): string {
  const offer = plans.find((entry) => entry.id === plan)?.offer;
  if (offer?.state === 'purchasable') return `${offer.price} ${INTERVAL_LABELS[offer.interval]}`;
  return priceSentence(plan);
}

function questionsFor(state: PageState, plans: ReturnType<typeof currentPlans>): Question[] {
  const priced = state !== 'unpriced';
  const monthsFree = listedPrices('pro')[0]?.monthsFree ?? 0;
  const list: Question[] = [
    {
      q: 'Is TradeDocs free?',
      a: PAID_EXTRAS
        ? `Yes, while it is early: ${FREE_SCOPE} is in the free plan, so nobody needs to pay to prepare and download their documents.${ADDS}${priced ? '' : ' No paid plan is open yet, so nobody is charged for anything.'}`
        : priced
          ? 'Yes, while it is early. Every feature listed on this page is in the free plan today. Pro and Team add no paid-only features yet, so nobody needs to pay to use TradeDocs.'
          : 'Yes, while it is early. Every feature listed on this page is free today, and no paid plan is open, so nobody is charged for anything.',
    },
    {
      q: 'Do I need a card to start?',
      a: 'No. The free tools need no account at all, and creating an account asks for no payment details.',
    },
  ];
  if (priced) {
    list.push(
      {
        q: 'What do Pro and Team cost?',
        a: `Pro is ${quotedPrice('pro', plans)}. Team is ${quotedPrice('team', plans)}. ${
          state === 'open'
            ? 'Stripe’s checkout page shows the exact amount before you pay.'
            : 'Checkout is not open yet, so nobody can be charged today.'
        }`,
      },
      {
        q: 'Is there a discount for paying yearly?',
        a:
          monthsFree > 0
            ? `Yes. A year costs the price of ${12 - monthsFree} months, so ${monthsFree} months are free.`
            : 'No. A year costs twelve times the monthly price.',
      },
    );
  } else {
    list.push({
      q: 'What happens when paid plans arrive?',
      a: 'Their prices and what they add will be published on this page before they open, with notice. Until then the paid plans show "Not available yet" and cannot be bought.',
    });
  }
  list.push(
    {
      q: 'What is the refund policy?',
      a:
        state === 'open'
          ? 'Refunds follow the Terms of service. A full refund ends the paid plan at once.'
          : 'A refund policy will be published before checkout opens. No one can pay today, so there is nothing to refund yet.',
    },
    {
      q: 'If I cancel a paid plan later, when does it end?',
      a: 'At the end of the period you paid for: cancelling stops the renewal, not the access you have already paid for. A fully refunded or disputed payment ends the plan straight away.',
    },
    {
      q: 'Who will take the payment?',
      a: 'Stripe, on its own hosted checkout page. Card details are entered there and never reach TradeDocs.',
    },
  );
  return list;
}

/** Facts about TradeDocs only; no other product is named or implied (rules/product.md). */
const reasons = [
  {
    title: 'One shipment record, every document',
    body: 'The commercial invoice, proforma invoice, packing list and delivery note come from the same shipment revision, so parties, goods, totals and weights agree across them.',
    needsAccount: true,
  },
  {
    title: 'Documents that do not drift',
    body: 'Each PDF is locked to the revision it came from. Change the shipment and the older documents are marked stale instead of quietly changing.',
    needsAccount: true,
  },
  {
    title: 'Free generators with no account',
    body: 'The commercial invoice, proforma and packing list generators work without signing up, and nothing you type is stored.',
    needsAccount: false,
  },
  {
    title: 'No cap on shipments or teammates today',
    body: 'Save as many shipments as you need and invite your team by link, with owner, admin and member roles.',
    needsAccount: true,
  },
  {
    title: 'Your catalog in, the whole set out',
    body: `Import products from a CSV of up to ${MAX_IMPORT_ROWS.toLocaleString('en')} rows, and download a shipment’s current documents, up to ${MAX_SET_DOCUMENTS}, as one ZIP with a checksum manifest.`,
    needsAccount: true,
  },
  {
    title: 'Incoterms explained where you choose them',
    body: 'An Incoterms 2020 reference and CBM, dimensional weight and landed cost calculators are free, with no account.',
    needsAccount: false,
  },
];

const GROUPS = ['Free tools', 'Workspace', 'Team'] as const;

function planIncludes(feature: Feature, plan: PlanId): boolean {
  return feature.plans.includes(plan);
}

function PlanPrice({ plan }: { plan: Plan }) {
  const offer = plan.offer;
  if (offer.state === 'free') {
    return (
      <p className="pricing-price">
        <span className="pricing-amount">Free</span>
        <span className="pricing-term">No card · while early</span>
      </p>
    );
  }
  if (offer.state === 'purchasable') {
    return (
      <p className="pricing-price">
        <span className="pricing-amount">{offer.price}</span>
        <span className="pricing-term">{INTERVAL_LABELS[offer.interval]}</span>
      </p>
    );
  }
  if (offer.state === 'listed' && offer.prices.length > 0) {
    const [first, ...others] = offer.prices;
    return (
      <p className="pricing-price">
        <span className="pricing-amount">{first?.month}</span>
        <span className="pricing-term">
          per month, or {first?.year} per year
          {first && first.monthsFree > 0 ? ` (${first.monthsFree} months free)` : ''}
        </span>
        {others.map((price) => (
          <span className="pricing-term" key={price.currency}>
            In euros: {price.month} per month or {price.year} per year
          </span>
        ))}
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

function planTag(plan: Plan): string {
  switch (plan.offer.state) {
    case 'free':
    case 'purchasable':
      return 'Open now';
    case 'listed':
      return 'Checkout not open';
    case 'unavailable':
      return 'Not open';
  }
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

const FREE_LEDE = PAID_EXTRAS
  ? `The generators, calculators and shipment workspace are free, with no card.${ADDS}`
  : 'Everything TradeDocs does today is free, with no card.';

const LEDES: Record<PageState, string> = {
  unpriced: `${FREE_LEDE} Paid plans are not open yet: when they are, their prices will be published here first.`,
  listed: `${FREE_LEDE} Pro and Team prices are below; checkout is not open yet, so nobody can be charged.`,
  open: `${FREE_LEDE} Pro and Team are open and can be bought from your workspace.`,
};

export default function PricingPage() {
  const accountsOpen = isDatabaseConfigured();
  const action = primaryAction(accountsOpen);
  const plans = currentPlans();
  const state = pageState(plans);
  const questions = questionsFor(state, plans);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Pricing</p>
        <h1>Free while early.</h1>
        <p className="lede">{LEDES[state]}</p>
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
                <span className={plan.id === 'free' ? 'tag on-tape' : 'tag'}>{planTag(plan)}</span>
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
                  ) : plan.offer.state === 'listed' ? (
                    <span className="caption">Checkout is not open yet</span>
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
                  ) : plan.offer.state === 'listed' ? (
                    <span className="pricing-limit">
                      {plan.offer.prices[0]?.month} per month · checkout not open
                    </span>
                  ) : plan.offer.state === 'purchasable' ? (
                    <span className="pricing-limit">
                      {plan.offer.price} {INTERVAL_LABELS[plan.offer.interval]}
                    </span>
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

      <section className="section" aria-labelledby="why-title">
        <div className="section-head">
          <p className="eyebrow">Why TradeDocs</p>
          <h2 id="why-title">Built around the shipment, not the blank form.</h2>
        </div>
        <div className="cards">
          {reasons
            .filter((reason) => accountsOpen || !reason.needsAccount)
            .map((reason) => (
              <article className="card" key={reason.title}>
                <h3>{reason.title}</h3>
                <p>{reason.body}</p>
              </article>
            ))}
        </div>
        <p className="note">
          Every point above is in the {PLAN_NAMES.free} plan. Documents are prepared from your own
          data; TradeDocs does not issue, certify or file them.
        </p>
      </section>

      <section className="section sunken" aria-labelledby="pricing-faq-title">
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
