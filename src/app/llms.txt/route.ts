import { BOUNDARY_STATEMENT } from '@/components/shell/public';
import { currentPlans } from '@/lib/billing/server';
import { FEATURES, INTERVAL_LABELS, type Plan } from '@/lib/billing/plans';
import { GUIDES } from '@/lib/content/guides';
import { getPublicBaseUrl } from '@/lib/http/base-url';
import { documentKindLabels } from '@/lib/labels';
import { PUBLIC_DOCUMENT_KINDS, PUBLIC_TOOLS, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo/site';
import { INCOTERMS, INCOTERMS_DISCLAIMER } from '@/lib/trade/incoterms';

// The links name the deployment's canonical origin, so this is resolved per request.
export const dynamic = 'force-dynamic';

/** A plan's status in one line, from the same module the pricing page renders. */
function planLine(plan: Plan): string {
  if (plan.offer.state === 'free') return `- ${plan.name}: free, no card. ${plan.summary}`;
  if (plan.offer.state === 'purchasable') {
    const term = INTERVAL_LABELS[plan.offer.interval];
    return `- ${plan.name}: ${plan.offer.price} ${term}. ${plan.summary}`;
  }
  return `- ${plan.name}: not available yet; no price is set.`;
}

/**
 * A plain-text map of the public site for language-model crawlers (llmstxt.org).
 *
 * Generated from the data the pages render: the tool list, the guides, the eleven Incoterms
 * rules and the document types on offer, which leave the certificate of origin out while
 * D-008 holds. Served on every deployment, because it only restates public pages; whether those
 * pages may be indexed is still decided by robots.txt and X-Robots-Tag.
 */
export function GET(): Response {
  const base = getPublicBaseUrl();
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
    '## Free tools (no account)',
    '',
    `- [All free tools](${base}/tools): the index of the tools below.`,
    ...PUBLIC_TOOLS.map((tool) => `- [${tool.name}](${base}${tool.path}): ${tool.summary}`),
    '',
    '## Guides',
    '',
    `- [All guides](${base}/guides): the index of the guides below.`,
    ...GUIDES.map(
      (guide) => `- [${guide.title}](${base}/guides/${guide.slug}): ${guide.description}`,
    ),
    '',
    '## Incoterms 2020 reference',
    '',
    INCOTERMS_DISCLAIMER,
    '',
    ...INCOTERMS.map(
      (term) =>
        `- [${term.code}: ${term.name}](${base}/tools/incoterms/${term.code.toLowerCase()}): ${term.riskPasses}`,
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
