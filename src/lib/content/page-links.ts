import { findCountry } from '@/lib/content/countries';
import { findTerm } from '@/lib/content/glossary';
import { findArticleByPath, type RelatedLink } from '@/lib/content/related';
import { findPublicTool } from '@/lib/seo/site';

/**
 * Resolves a related-page reference used by glossary terms and country pages to a link.
 *
 * A bare slug (`teu`) is a glossary term; anything starting with `/` is a site path: a guide,
 * a blog post, a tool, a glossary term or a country page. Undefined when nothing exists there,
 * which the content tests treat as a broken link.
 */
export function resolvePageLink(reference: string): RelatedLink | undefined {
  if (!reference.startsWith('/')) {
    const term = findTerm(reference);
    return term
      ? { href: `/glossary/${term.slug}`, title: term.term, description: term.shortDefinition }
      : undefined;
  }
  const article = findArticleByPath(reference);
  if (article) return { href: reference, title: article.title, description: article.description };
  const tool = findPublicTool(reference);
  if (tool) return { href: tool.path, title: tool.name, description: tool.summary };
  const term = /^\/glossary\/([a-z0-9-]+)$/.exec(reference);
  if (term) return resolvePageLink(term[1]!);
  const country = /^\/export-documents\/([a-z0-9-]+)$/.exec(reference);
  if (country) {
    const page = findCountry(country[1]!);
    if (page) {
      return {
        href: reference,
        title: `Export documents for ${page.name}`,
        description: page.description,
      };
    }
  }
  return undefined;
}

export function resolvePageLinks(references: readonly string[]): RelatedLink[] {
  return references.flatMap((reference) => {
    const link = resolvePageLink(reference);
    return link ? [link] : [];
  });
}
