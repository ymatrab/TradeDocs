/**
 * Plain-text search over the help entries. Runs in the browser on data already on the page,
 * so a query never leaves the device and never lands in a URL or a log.
 */

export type Searchable = { q: string; a: string; source: { label: string } };

function normalize(value: string): string {
  return value.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/®/g, '').toLowerCase();
}

function tokens(query: string): string[] {
  return normalize(query)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 1)
    .slice(0, 12);
}

/**
 * Entries that contain every word of the query, best first: a word in the question counts
 * three times one in the answer or the page it comes from. An empty query returns nothing,
 * so the caller decides what to show before anyone types.
 */
export function searchHelp<T extends Searchable>(
  entries: readonly T[],
  query: string,
  limit = 20,
): T[] {
  const words = tokens(query);
  if (words.length === 0) return [];
  const scored: { entry: T; score: number; index: number }[] = [];
  entries.forEach((entry, index) => {
    const question = normalize(entry.q);
    const rest = normalize(`${entry.a} ${entry.source.label}`);
    let score = 0;
    for (const word of words) {
      const inQuestion = question.includes(word);
      if (!inQuestion && !rest.includes(word)) return;
      score += inQuestion ? 3 : 1;
    }
    scored.push({ entry, score, index });
  });
  return scored
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, limit)
    .map((item) => item.entry);
}
