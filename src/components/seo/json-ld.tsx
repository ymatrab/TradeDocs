import { getPublicBaseUrl } from '@/lib/http/base-url';
import {
  articleSchema,
  breadcrumbSchema,
  definedTermSchema,
  definedTermSetSchema,
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
import { COUNTRIES_HUB, findCountry } from '@/lib/content/countries';
import {
  GLOSSARY_HUB,
  GLOSSARY_HUB_ENTRIES,
  LISTED_GLOSSARY,
  findTerm,
} from '@/lib/content/glossary';
import { findGuide } from '@/lib/content/guides';
import { findPost } from '@/lib/content/posts';
import { findUseCase } from '@/lib/content/use-cases';
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
const GLOSSARY: Crumb = { name: 'Glossary', path: '/glossary' };
const COUNTRIES: Crumb = { name: COUNTRIES_HUB.title, path: '/export-documents' };

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

/** A use-case page: breadcrumbs and its visible FAQ. */
export function UseCaseJsonLd({ slug }: { slug: string }) {
  const useCase = findUseCase(slug);
  if (!useCase) return null;
  const base = getPublicBaseUrl();
  const crumbs: Crumb[] = [HOME, { name: useCase.name, path: `/for/${useCase.slug}` }];
  const data = [breadcrumbSchema(base, crumbs)];
  if (useCase.faq.length > 0) data.push(faqPageSchema(useCase.faq));
  return <JsonLd data={data} />;
}

/** The glossary hub: breadcrumbs and the DefinedTermSet of every term it lists. */
export function GlossaryHubJsonLd() {
  const base = getPublicBaseUrl();
  const terms = [
    ...LISTED_GLOSSARY.map((term) => ({
      path: `/glossary/${term.slug}`,
      name: term.term,
      description: term.shortDefinition,
    })),
    ...GLOSSARY_HUB_ENTRIES.map((entry) => ({
      path: entry.href,
      name: entry.term,
      description: entry.definition,
    })),
  ];
  const set = {
    path: GLOSSARY.path,
    name: GLOSSARY_HUB.setName,
    description: GLOSSARY_HUB.description,
  };
  return (
    <JsonLd
      data={[breadcrumbSchema(base, [HOME, GLOSSARY]), definedTermSetSchema(base, set, terms)]}
    />
  );
}

/** A term page: breadcrumbs, the DefinedTerm inside the hub's set, and its visible FAQ. */
export function GlossaryTermJsonLd({ slug }: { slug: string }) {
  const term = findTerm(slug);
  if (!term) return null;
  const base = getPublicBaseUrl();
  const path = `/glossary/${term.slug}`;
  const data = [
    breadcrumbSchema(base, [HOME, GLOSSARY, { name: term.term, path }]),
    definedTermSchema(
      base,
      {
        path,
        name: term.term,
        description: term.shortDefinition,
        alternateNames: term.aliases,
        termCode: term.abbreviation,
      },
      GLOSSARY.path,
    ),
  ];
  if (term.faq.length > 0) data.push(faqPageSchema(term.faq));
  return <JsonLd data={data} />;
}

export function CountriesHubJsonLd() {
  return <JsonLd data={[breadcrumbSchema(getPublicBaseUrl(), [HOME, COUNTRIES])]} />;
}

/** A country page: breadcrumbs, the Article and its visible FAQ. */
export function CountryJsonLd({ slug }: { slug: string }) {
  const country = findCountry(slug);
  if (!country) return null;
  const base = getPublicBaseUrl();
  const path = `/export-documents/${country.slug}`;
  const data = [
    breadcrumbSchema(base, [HOME, COUNTRIES, { name: country.name, path }]),
    articleSchema(base, {
      path,
      headline: `Export documents for ${country.name}`,
      description: country.description,
      datePublished: country.published,
      dateModified: country.updated,
    }),
  ];
  if (country.faq.length > 0) data.push(faqPageSchema(country.faq));
  return <JsonLd data={data} />;
}
