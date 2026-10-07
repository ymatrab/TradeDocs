import type { ContentArticle } from '@/lib/content/article';
import type { CountryPage } from '@/lib/content/country';
import type { GlossaryTerm } from '@/lib/content/glossary-term';
import { sourcesFor, type SourceId } from '@/lib/trade/sources';

function sourceLines(ids: readonly SourceId[]): string[] {
  return sourcesFor(ids).map(
    (record) =>
      `- ${record.title} (${record.authority}), ${record.url}. Retrieved ${record.retrieved}; ${record.reviewer}.`,
  );
}

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
  lines.push(...sourceLines(article.sources), '');
  return lines.join('\n');
}

/** A glossary term as plain text, in the order its page renders it. */
export function termPlainText(term: GlossaryTerm, url: string, disclaimer: string): string {
  const lines: string[] = [
    `# ${term.term}`,
    '',
    `URL: ${url}`,
    `By the TradeDocs team. Published ${term.published}; last reviewed ${term.reviewed}.`,
    '',
    `Definition: ${term.shortDefinition}`,
    '',
    ...term.definition.flatMap((paragraph) => [paragraph, '']),
    '## On your documents',
    '',
    ...term.onYourDocuments.flatMap((paragraph) => [paragraph, '']),
    `## Example (${term.example.caption})`,
    '',
    ...term.example.paragraphs.flatMap((paragraph) => [paragraph, '']),
  ];
  const table = term.example.table;
  if (table) {
    lines.push(`| ${table.head.join(' | ')} |`, `| ${table.head.map(() => '---').join(' | ')} |`);
    lines.push(...table.rows.map((row) => `| ${row.join(' | ')} |`), '');
  }
  if (term.confusedWith && term.confusedWith.length > 0) {
    lines.push('## Not to be confused with', '');
    lines.push(...term.confusedWith.map((entry) => `- ${entry.term}: ${entry.difference}`), '');
  }
  lines.push('## Questions people ask', '');
  for (const entry of term.faq) lines.push(`Q: ${entry.q}`, `A: ${entry.a}`, '');
  lines.push(`Note: ${disclaimer}`, '', 'Sources:', '', ...sourceLines(term.sources), '');
  return lines.join('\n');
}

/** A country page as plain text, every fact followed by its source's authority. */
export function countryPlainText(country: CountryPage, url: string, disclaimer: string): string {
  const authority = (id: SourceId) => sourcesFor([id])[0]?.authority ?? '';
  const lines: string[] = [
    `# Export documents for ${country.name}`,
    '',
    `URL: ${url}`,
    `By the TradeDocs team. Published ${country.published}; last checked against sources ${country.reviewed}.`,
    '',
    `Short answer: ${country.answer}`,
    '',
    `Customs authority: ${country.customsAuthority.name}, ${country.customsAuthority.url}`,
    '',
    '## Documents',
    '',
    ...country.documents.map(
      (row) => `- ${row.document} (${row.status}): ${row.condition} [${authority(row.sourceId)}]`,
    ),
    '',
    '## Commercial invoice',
    '',
    ...country.invoiceRequirements.map((line) => `- ${line.text} [${authority(line.sourceId)}]`),
    '',
    '## Importer identifiers',
    '',
    ...country.importerIdentifiers.map(
      (row) => `- ${row.name}: ${row.whoNeedsIt} [${authority(row.sourceId)}]`,
    ),
    '',
    '## Who can be the importer',
    '',
    ...country.incotermsNotes.flatMap((line) => [`${line.text} [${authority(line.sourceId)}]`, '']),
  ];
  for (const section of country.sections) {
    lines.push(`## ${section.heading}`, '', ...section.paragraphs.flatMap((p) => [p, '']));
  }
  lines.push('## Questions people ask', '');
  for (const entry of country.faq) lines.push(`Q: ${entry.q}`, `A: ${entry.a}`, '');
  lines.push(`Note: ${disclaimer}`, '', 'Sources:', '', ...sourceLines(country.sources), '');
  return lines.join('\n');
}
