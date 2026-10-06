import { BOUNDARY_STATEMENT } from '@/components/shell/public';
import { GUIDES, GUIDE_DISCLAIMER } from '@/lib/content/guides';
import { articlePlainText } from '@/lib/content/plain-text';
import { POSTS, POST_DISCLAIMER } from '@/lib/content/posts';
import { getPublicBaseUrl } from '@/lib/http/base-url';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo/site';

// The links name the deployment's canonical origin, so this is resolved per request.
export const dynamic = 'force-dynamic';

/**
 * The full text of every guide and blog post, for language-model crawlers (the llmstxt.org
 * "llms-full" convention). It restates public pages only, from the same data they render;
 * whether those pages may be indexed is still decided by robots.txt and X-Robots-Tag.
 */
export function GET(): Response {
  const base = getPublicBaseUrl();
  const parts = [
    `# ${SITE_NAME}: guides and blog, full text`,
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    `${BOUNDARY_STATEMENT} Nothing below is legal, customs or compliance advice.`,
    '',
    ...GUIDES.map((guide) =>
      articlePlainText(guide, `${base}/guides/${guide.slug}`, GUIDE_DISCLAIMER),
    ),
    ...POSTS.map((post) => articlePlainText(post, `${base}/blog/${post.slug}`, POST_DISCLAIMER)),
  ];

  return new Response(parts.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
