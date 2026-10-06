import { BOUNDARY_STATEMENT } from '@/components/shell/public';
import { GUIDES } from '@/lib/content/guides';
import { POSTS } from '@/lib/content/posts';
import { getPublicBaseUrl } from '@/lib/http/base-url';
import { documentKindLabels } from '@/lib/labels';
import { PUBLIC_DOCUMENT_KINDS, PUBLIC_TOOLS, SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo/site';
import { INCOTERMS, INCOTERMS_DISCLAIMER } from '@/lib/trade/incoterms';

// The links name the deployment's canonical origin, so this is resolved per request.
export const dynamic = 'force-dynamic';

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
      (guide) => `- [${guide.title}](${base}/guides/${guide.slug}): ${guide.answer}`,
    ),
    '',
    '## Blog',
    '',
    `- [All posts](${base}/blog): the index of the posts below; RSS at ${base}/blog/rss.xml.`,
    ...POSTS.map((post) => `- [${post.title}](${base}/blog/${post.slug}): ${post.answer}`),
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
    '## Optional',
    '',
    `- [Full text of the guides and blog posts](${base}/llms-full.txt): every article as plain text, with its sources and dates.`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
