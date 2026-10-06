import { BOUNDARY_STATEMENT } from '@/components/shell/public';
import { GUIDES } from '@/lib/content/guides';
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
    '## Help and contact',
    '',
    `- [Help centre](${base}/help): every answer on the site, searchable in one place.`,
    `- [Contact](${base}/contact): questions, problems and privacy requests, read by a person.`,
    ...(legalApproved
      ? LEGAL_PAGES.map((page) => `- [${page.name}](${base}${page.path}): ${page.summary}`)
      : []),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
