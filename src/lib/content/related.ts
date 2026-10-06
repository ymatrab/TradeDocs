import type { ContentArticle } from '@/lib/content/article';
import { GUIDES, findGuide } from '@/lib/content/guides';
import { POSTS, findPost } from '@/lib/content/posts';

/** The most articles linked at the foot of one article. */
export const MAX_RELATED = 6;

export type RelatedLink = { href: string; title: string; description: string };

type Candidate = { path: string; entry: ContentArticle };

/** Resolves a site path such as `/blog/fca-vs-fob` or `/guides/lcl-vs-fcl` to its article. */
export function findArticleByPath(path: string): ContentArticle | undefined {
  const match = /^\/(blog|guides)\/([a-z0-9-]+)$/.exec(path);
  if (!match) return undefined;
  return match[1] === 'blog' ? findPost(match[2]!) : findGuide(match[2]!);
}

function candidates(article: ContentArticle, kind: 'blog' | 'guides'): Candidate[] {
  if (article.related) {
    return article.related.flatMap((path) => {
      const entry = findArticleByPath(path);
      return entry ? [{ path, entry }] : [];
    });
  }
  const pool = kind === 'blog' ? POSTS : GUIDES;
  const others = pool.filter((entry) => entry.slug !== article.slug);
  return others.map((entry) => ({ path: `/${kind}/${entry.slug}`, entry }));
}

/**
 * The foot links for an article: its own `related` paths when it names them, otherwise the
 * newest articles of the same kind, so a hub of 60 posts never prints 59 links on every page.
 */
export function relatedLinks(article: ContentArticle, kind: 'blog' | 'guides'): RelatedLink[] {
  const links = candidates(article, kind).slice(0, MAX_RELATED);
  return links.map(({ path, entry }) => ({
    href: path,
    title: entry.title,
    description: entry.description,
  }));
}
