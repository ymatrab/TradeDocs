import type { ContentArticle } from '@/lib/content/article';
import { sourcesFor } from '@/lib/trade/sources';

/**
 * An article as Markdown-flavoured plain text, for /llms-full.txt.
 *
 * Built from the same data the page renders, in the same order, so the text an assistant
 * reads is the text a visitor sees: the short answer, key facts, terms, sections, FAQ,
 * the not-advice note and the sources with their retrieval dates.
 */
export function articlePlainText(article: ContentArticle, url: string, disclaimer: string): string {
  const lines: string[] = [
    `# ${article.title}`,
    '',
    `URL: ${url}`,
    `By ${article.byline}. Published ${article.published}; updated ${article.updated}; last reviewed ${article.reviewed}.`,
    '',
    `Short answer: ${article.answer}`,
    '',
    '## Key facts',
    '',
    ...article.keyFacts.map((fact) => `- ${fact}`),
    '',
  ];
  if (article.definitions.length > 0) {
    lines.push('## Terms used', '');
    lines.push(...article.definitions.map((entry) => `- ${entry.term}: ${entry.meaning}`), '');
  }
  for (const section of article.sections) {
    lines.push(`## ${section.heading}`, '', ...section.paragraphs.flatMap((p) => [p, '']));
    if (section.list) lines.push(...section.list.map((item) => `- ${item}`), '');
    if (section.steps) lines.push(...section.steps.map((step, i) => `${i + 1}. ${step}`), '');
    if (section.table) {
      lines.push(`${section.table.caption}:`, '');
      lines.push(`| ${section.table.head.join(' | ')} |`);
      lines.push(`| ${section.table.head.map(() => '---').join(' | ')} |`);
      lines.push(...section.table.rows.map((row) => `| ${row.join(' | ')} |`), '');
    }
  }
  lines.push('## Questions people ask', '');
  for (const entry of article.faq) lines.push(`Q: ${entry.q}`, `A: ${entry.a}`, '');
  lines.push(`Note: ${disclaimer}`, '', 'Sources:', '');
  lines.push(
    ...sourcesFor(article.sources).map(
      (record) =>
        `- ${record.title} (${record.authority}), ${record.url}. Retrieved ${record.retrieved}; ${record.reviewer}.`,
    ),
    '',
  );
  return lines.join('\n');
}
