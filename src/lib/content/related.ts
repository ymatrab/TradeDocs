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

/** Words too common in this site's titles to say two articles share a topic. */
// prettier-ignore
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'can', 'do', 'does', 'each', 'explained', 'for', 'from', 'how',
  'in', 'is', 'it', 'its', 'of', 'on', 'one', 'or', 'the', 'to', 'vs', 'what', 'when',
  'where', 'which', 'who', 'why', 'with', 'without', 'you', 'your', 'yours', 'need',
  'difference', 'guide', 'example', 'use', 'work', 'works', 'means', 'meaning',
]);

/** The topic words of an article: its slug and title, lower-cased, stop words and plurals dropped. */
export function topicTokens(article: Pick<ContentArticle, 'slug' | 'title'>): Set<string> {
  const words = `${article.slug.replaceAll('-', ' ')} ${article.title}`
    .toLowerCase()
    .replaceAll(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 2 && !STOP_WORDS.has(word))
    .map((word) => (word.length > 4 && word.endsWith('s') ? word.slice(0, -1) : word));
  return new Set(words);
}

type Indexed = Candidate & { tokens: Set<string> };

let corpus: { all: readonly Indexed[]; inbound: ReadonlyMap<string, number> } | undefined;

/** Every guide and post with its topic words, and how often each is hand-picked as related. */
function indexed() {
  if (corpus) return corpus;
  const all: Indexed[] = [
    ...GUIDES.map((entry) => ({ path: `/guides/${entry.slug}`, entry })),
    ...POSTS.map((entry) => ({ path: `/blog/${entry.slug}`, entry })),
  ].map((candidate) => ({ ...candidate, tokens: topicTokens(candidate.entry) }));
  const inbound = new Map<string, number>();
  for (const { entry } of all) {
    for (const path of entry.related ?? []) inbound.set(path, (inbound.get(path) ?? 0) + 1);
  }
  corpus = { all, inbound };
  return corpus;
}

/**
 * The foot links for an article: its own `related` paths first, then guides and posts that
 * share the most topic words with it, until there are six.
 *
 * Ties go to the article that fewer others hand-pick, so links spread across the archive
 * instead of piling onto the same few pages; before 2026-11-20 the fallback was "the newest
 * articles", which left most of the archive linked from its hub alone.
 */
export function relatedLinks(article: ContentArticle, kind: 'blog' | 'guides'): RelatedLink[] {
  const own = `/${kind}/${article.slug}`;
  const chosen: Candidate[] = [];
  const seen = new Set<string>([own]);

  for (const path of article.related ?? []) {
    const entry = findArticleByPath(path);
    if (!entry || seen.has(path)) continue;
    chosen.push({ path, entry });
    seen.add(path);
  }

  if (chosen.length < MAX_RELATED) {
    const { all, inbound } = indexed();
    const mine = topicTokens(article);
    const scored = all
      .filter((candidate) => !seen.has(candidate.path))
      .map((candidate) => ({
        candidate,
        score: [...candidate.tokens].filter((token) => mine.has(token)).length,
      }))
      .filter(({ score }) => score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          (inbound.get(a.candidate.path) ?? 0) - (inbound.get(b.candidate.path) ?? 0) ||
          a.candidate.path.localeCompare(b.candidate.path),
      );
    for (const { candidate } of scored) {
      if (chosen.length >= MAX_RELATED) break;
      chosen.push(candidate);
    }
  }

  return chosen.slice(0, MAX_RELATED).map(({ path, entry }) => ({
    href: path,
    title: entry.title,
    description: entry.description,
  }));
}
