import { BOUNDARY_STATEMENT } from '@/components/shell/public';
import { currentPlans } from '@/lib/billing/server';
import { FEATURES, INTERVAL_LABELS, paidOnlyFeatures, type Plan } from '@/lib/billing/plans';
import { COUNTRIES_HUB, LISTED_COUNTRIES } from '@/lib/content/countries';
import { GLOSSARY_HUB_ENTRIES, LISTED_GLOSSARY } from '@/lib/content/glossary';
import { GUIDES } from '@/lib/content/guides';
import { POSTS } from '@/lib/content/posts';
import { USE_CASES } from '@/lib/content/use-cases';
import { getPublicBaseUrl } from '@/lib/http/base-url';
import { documentKindLabels } from '@/lib/labels';
import { isLegalApproved } from '@/lib/legal/identity';
import { getLegalIdentity } from '@/lib/legal/server';
import {
  LEGAL_PAGES,
  PUBLIC_DOCUMENT_KINDS,
  PUBLIC_TOOLS,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '@/lib/seo/site';
import { INCOTERMS, INCOTERMS_DISCLAIMER } from '@/lib/trade/incoterms';

// The links name the deployment's canonical origin, so this is resolved per request.
export const dynamic = 'force-dynamic';

/** What a paid plan adds over Free, as a sentence, or nothing. */
function adds(plan: Plan): string {
  if (plan.id === 'free') return '';
  const extras = paidOnlyFeatures(plan.id).map((feature) => feature.label);
  return extras.length > 0 ? ` Adds ${extras.join('; ')}.` : '';
}

/** A plan's status in one line, from the same module the pricing page renders. */
function planLine(plan: Plan): string {
  if (plan.offer.state === 'free') return `- ${plan.name}: free, no card. ${plan.summary}`;
  if (plan.offer.state === 'purchasable') {
    const term = INTERVAL_LABELS[plan.offer.interval];
    return `- ${plan.name}: ${plan.offer.price} ${term}. ${plan.summary}${adds(plan)}`;
  }
  if (plan.offer.state === 'listed' && plan.offer.prices.length > 0) {
    const prices = plan.offer.prices
      .map((price) => `${price.month} per month or ${price.year} per year`)
      .join(', or ');
    return `- ${plan.name}: ${prices}; checkout is not open yet. ${plan.summary}${adds(plan)}`;
  }
  return `- ${plan.name}: not available yet; no price is set.${adds(plan)}`;
}

/**
 * A plain-text map of the public site for language-model crawlers (llmstxt.org).
 *
 * Generated from the data the pages render: the tool list, the guides and blog posts (each
 * summarised by its visible short answer), the eleven Incoterms rules and the document
 * types on offer, which leave the certificate of origin out while D-008 holds. The full text
 * of the guides and posts is at /llms-full.txt. Served on every deployment, because it only
 * restates public pages; whether those pages may be indexed is still decided by robots.txt
 * and X-Robots-Tag.
 */
export function GET(): Response {
  const base = getPublicBaseUrl();
  // Draft legal pages are not offered to crawlers of any kind until approved (D-009).
  const legalApproved = isLegalApproved(getLegalIdentity());
  const lines = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `${BOUNDARY_STATEMENT} It does not issue, endorse, certify or clear any document; every page it prepares says so, and the data on it remains the user's own declaration. Nothing on the site is legal, customs or compliance advice.`,
    '',
    '## Documents it prepares',
    '',
    ...PUBLIC_DOCUMENT_KINDS.map((kind) => `- ${documentKindLabels[kind]}`),
    '',
    '## Pricing',
    '',
    `- [Pricing](${base}/pricing): every plan, its features and limits, and the billing questions.`,
    ...currentPlans().map(planLine),
    '',
    'Included in the free plan:',
    '',
    ...FEATURES.filter((feature) => feature.plans.includes('free')).map(
      (feature) => `- ${feature.label}${'limit' in feature ? ` (${feature.limit})` : ''}`,
    ),
    '',
    '## Who it is for',
    '',
    ...USE_CASES.map(
      (useCase) => `- [${useCase.name}](${base}/for/${useCase.slug}): ${useCase.description}`,
    ),
    '',
    '## Free tools (no account)',
    '',
    `- [All free tools](${base}/tools): the index of the tools below.`,
    ...PUBLIC_TOOLS.map((tool) => `- [${tool.name}](${base}${tool.path}): ${tool.summary}`),
    '',
    '## Guides',
    '',
    `- [All guides](${base}/guides): the index of the guides below.`,
    ...GUIDES.map((guide) => `- [${guide.title}](${base}/guides/${guide.slug}): ${guide.answer}`),
    '',
    '## Blog',
    '',
    `- [All posts](${base}/blog): the index of the posts below; RSS at ${base}/blog/rss.xml.`,
    ...POSTS.map((post) => `- [${post.title}](${base}/blog/${post.slug}): ${post.answer}`),
    '',
    '## Glossary',
    '',
    `- [Shipping terms glossary](${base}/glossary): every term below, plus ${GLOSSARY_HUB_ENTRIES.length} more defined in a line and linked to the guide or tool that explains them.`,
    ...LISTED_GLOSSARY.map(
      (term) => `- [${term.term}](${base}/glossary/${term.slug}): ${term.shortDefinition}`,
    ),
    '',
    // Country pages state customs facts, so they are offered only once reviewed.
    ...(LISTED_COUNTRIES.length > 0
      ? [
          `## ${COUNTRIES_HUB.title}`,
          '',
          `- [${COUNTRIES_HUB.title}](${base}/export-documents): ${COUNTRIES_HUB.description}`,
          ...LISTED_COUNTRIES.map(
            (country) =>
              `- [Export documents for ${country.name}](${base}/export-documents/${country.slug}): ${country.answer}`,
          ),
          '',
        ]
      : []),
    '## Incoterms 2020 reference',
    '',
    INCOTERMS_DISCLAIMER,
    '',
    ...INCOTERMS.map(
      (term) =>
        `- [${term.code}: ${term.name}](${base}/tools/incoterms/${term.code.toLowerCase()}): ${term.riskPasses}`,
    ),
    '',
    '## Help and contact',
    '',
    `- [Help centre](${base}/help): every answer on the site, searchable in one place.`,
    `- [Contact](${base}/contact): questions, problems and privacy requests, read by a person.`,
    ...(legalApproved
      ? LEGAL_PAGES.map((page) => `- [${page.name}](${base}${page.path}): ${page.summary}`)
      : []),
    '',
    '## Optional',
    '',
    `- [Full text of the guides, blog posts and glossary](${base}/llms-full.txt): every article and term as plain text, with its sources and dates.`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
