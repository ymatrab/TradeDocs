import { getPublicBaseUrl } from '@/lib/http/base-url';
import {
  articleSchema,
  breadcrumbSchema,
  faqPageSchema,
  jsonLdScript,
  organizationSchema,
  softwareApplicationSchema,
  websiteSchema,
  type Crumb,
  type JsonLdObject,
  type QuestionAndAnswer,
} from '@/lib/seo/json-ld';
import type { ContentArticle } from '@/lib/content/article';
import { findGuide } from '@/lib/content/guides';
import { findPost } from '@/lib/content/posts';
import { findPublicTool } from '@/lib/seo/site';
import { findIncoterm } from '@/lib/trade/incoterms';

/**
 * Structured data for public pages. Server components only: the canonical origin comes
 * from the deployment, and nothing here ships JavaScript to the browser.
 *
 * Each page adds one line. The FAQ entries passed in are the same array the page renders,
 * so the markup can never describe a question the visitor cannot see.
 */
function JsonLd({ data }: { data: JsonLdObject[] }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }} />
  );
}

const HOME: Crumb = { name: 'Home', path: '/' };
const TOOLS: Crumb = { name: 'Free tools', path: '/tools' };
const INCOTERMS: Crumb = { name: 'Incoterms® 2020', path: '/tools/incoterms' };
const GUIDES: Crumb = { name: 'Guides', path: '/guides' };
const BLOG: Crumb = { name: 'Blog', path: '/blog' };

export function HomeJsonLd({ faq }: { faq: readonly QuestionAndAnswer[] }) {
  const base = getPublicBaseUrl();
  return <JsonLd data={[organizationSchema(base), websiteSchema(base), faqPageSchema(faq)]} />;
}

export function ToolsHubJsonLd() {
  return <JsonLd data={[breadcrumbSchema(getPublicBaseUrl(), [HOME, TOOLS])]} />;
}

/** A tool page: breadcrumbs, the application when it is one, and its visible FAQ if given. */
export function ToolJsonLd({ path, faq }: { path: string; faq?: readonly QuestionAndAnswer[] }) {
  const tool = findPublicTool(path);
  if (!tool) return null;
  const base = getPublicBaseUrl();
  const data = [breadcrumbSchema(base, [HOME, TOOLS, { name: tool.name, path: tool.path }])];
  if (tool.kind === 'application') data.push(softwareApplicationSchema(base, tool));
  if (faq && faq.length > 0) data.push(faqPageSchema(faq));
  return <JsonLd data={data} />;
}

export function IncotermJsonLd({ code }: { code: string }) {
  const term = findIncoterm(code);
  if (!term) return null;
  const crumb: Crumb = {
    name: `${term.code} — ${term.name}`,
    path: `/tools/incoterms/${term.code.toLowerCase()}`,
  };
  const base = getPublicBaseUrl();
  const data = [breadcrumbSchema(base, [HOME, TOOLS, INCOTERMS, crumb])];
  if (term.faq.length > 0) data.push(faqPageSchema(term.faq));
  return <JsonLd data={data} />;
}

export function GuidesHubJsonLd() {
  return <JsonLd data={[breadcrumbSchema(getPublicBaseUrl(), [HOME, GUIDES])]} />;
}

/** An article under a hub: breadcrumbs, the Article with its cover, and its visible FAQ. */
function articleData(base: string, hub: Crumb, article: ContentArticle): JsonLdObject[] {
  const path = `${hub.path}/${article.slug}`;
  const data = [
    breadcrumbSchema(base, [HOME, hub, { name: article.title, path }]),
    articleSchema(base, {
      path,
      headline: article.title,
      description: article.description,
      datePublished: article.published,
      dateModified: article.updated,
      image: article.cover,
    }),
  ];
  if (article.faq.length > 0) data.push(faqPageSchema(article.faq));
  return data;
}

/** A guide: breadcrumbs, the article, and its visible FAQ. */
export function GuideJsonLd({ slug }: { slug: string }) {
  const guide = findGuide(slug);
  if (!guide) return null;
  return <JsonLd data={articleData(getPublicBaseUrl(), GUIDES, guide)} />;
}

export function BlogHubJsonLd() {
  return <JsonLd data={[breadcrumbSchema(getPublicBaseUrl(), [HOME, BLOG])]} />;
}

/** A blog post: breadcrumbs, the article, and its visible FAQ. */
export function PostJsonLd({ slug }: { slug: string }) {
  const post = findPost(slug);
  if (!post) return null;
  return <JsonLd data={articleData(getPublicBaseUrl(), BLOG, post)} />;
}

/** The pricing page: breadcrumbs and its visible FAQ. */
export function PricingJsonLd({ faq }: { faq: readonly QuestionAndAnswer[] }) {
  const base = getPublicBaseUrl();
  const crumbs: Crumb[] = [HOME, { name: 'Pricing', path: '/pricing' }];
  return <JsonLd data={[breadcrumbSchema(base, crumbs), faqPageSchema(faq)]} />;
}
