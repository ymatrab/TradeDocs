import { BOUNDARY_STATEMENT } from '@/components/shell/public';
import { LISTED_COUNTRIES } from '@/lib/content/countries';
import { COUNTRY_DISCLAIMER } from '@/lib/content/country';
import { LISTED_GLOSSARY } from '@/lib/content/glossary';
import { GLOSSARY_DISCLAIMER } from '@/lib/content/glossary-term';
import { GUIDES, GUIDE_DISCLAIMER } from '@/lib/content/guides';
import { articlePlainText, countryPlainText, termPlainText } from '@/lib/content/plain-text';
import { POSTS, POST_DISCLAIMER } from '@/lib/content/posts';
import { getPublicBaseUrl } from '@/lib/http/base-url';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo/site';

// The links name the deployment's canonical origin, so this is resolved per request.
export const dynamic = 'force-dynamic';

/**
 * The full text of every guide, blog post and glossary term, for language-model crawlers (the llmstxt.org
 * "llms-full" convention). It restates public pages only, from the same data they render;
 * whether those pages may be indexed is still decided by robots.txt and X-Robots-Tag.
 */
export function GET(): Response {
  const base = getPublicBaseUrl();
  const parts = [
    `# ${SITE_NAME}: guides, blog and glossary, full text`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `${BOUNDARY_STATEMENT} Nothing below is legal, customs or compliance advice.`,
    '',
    ...GUIDES.map((guide) =>
      articlePlainText(guide, `${base}/guides/${guide.slug}`, GUIDE_DISCLAIMER),
    ),
    ...POSTS.map((post) => articlePlainText(post, `${base}/blog/${post.slug}`, POST_DISCLAIMER)),
    ...LISTED_GLOSSARY.map((term) =>
      termPlainText(term, `${base}/glossary/${term.slug}`, GLOSSARY_DISCLAIMER),
    ),
    // Country pages are regulated: offered only once a review record exists.
    ...LISTED_COUNTRIES.map((country) =>
      countryPlainText(country, `${base}/export-documents/${country.slug}`, COUNTRY_DISCLAIMER),
    ),
  ];

  return new Response(parts.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
