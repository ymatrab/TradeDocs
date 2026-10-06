import { getPublicBaseUrl } from '@/lib/http/base-url';
import { BLOG_UPDATED, POSTS } from '@/lib/content/posts';
import { SITE_NAME } from '@/lib/seo/site';

// The links name the deployment's canonical origin, so this is resolved per request.
export const dynamic = 'force-dynamic';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RFC 822 dates, as RSS 2.0 requires; posts carry a day, so noon UTC avoids a date shift. */
function rssDate(day: string): string {
  return new Date(`${day}T12:00:00Z`).toUTCString();
}

/**
 * The blog as RSS 2.0, built from the same data as the pages. Summaries only: the feed
 * points readers at the page, where the sources, dates and not-advice note are shown.
 */
export function GET(): Response {
  const base = getPublicBaseUrl();
  const items = [...POSTS]
    .sort((a, b) => b.published.localeCompare(a.published))
    .map((post) => {
      const url = `${base}/blog/${post.slug}`;
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${rssDate(post.published)}</pubDate>`,
        `      <description>${escapeXml(post.description)}</description>`,
        '    </item>',
      ].join('\n');
    });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(`${SITE_NAME} blog`)}</title>`,
    `    <link>${escapeXml(`${base}/blog`)}</link>`,
    `    <atom:link href="${escapeXml(`${base}/blog/rss.xml`)}" rel="self" type="application/rss+xml" />`,
    '    <description>Export paperwork explained: invoices, packing lists, export documents and the Incoterms® rules.</description>',
    '    <language>en</language>',
    `    <lastBuildDate>${rssDate(BLOG_UPDATED)}</lastBuildDate>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
