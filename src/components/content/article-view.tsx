import { Fragment } from 'react';
import Link from 'next/link';
import { LinkButton } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { CoverFigure } from '@/components/content/cover-figure';
import { primaryAction } from '@/components/shell/public';
import type { ArticleSection, ContentArticle } from '@/lib/content/article';
import { shortDate } from '@/lib/format';
import { findPublicTool, type PublicTool } from '@/lib/seo/site';
import { isDatabaseConfigured } from '@/lib/supabase/server';
import { SourcesBlock, ToolCta } from '@/app/(marketing)/tools/page-parts';

/**
 * One rendering for guides and blog posts. Server component: no JavaScript ships with it.
 *
 * The order is the answer-engine order: the short answer, the key facts and the terms come
 * before the detail, so a crawler or a reader gets the answer in the first screen. Every
 * block is rendered from the article data, and the FAQ is the same array the FAQPage
 * structured data is built from.
 */

type ArticleViewProps = {
  article: ContentArticle;
  /** The hub this article belongs to, for the eyebrow link and the closing link. */
  hub: { href: string; label: string; allLabel: string };
  disclaimer: string;
  /** Other articles to link at the foot, already filtered. */
  related: readonly { href: string; title: string; description: string }[];
  relatedTitle: string;
};

/** Lower-cases a tool name's first letter for use mid-sentence, leaving acronyms (CBM) alone. */
function midSentence(name: string): string {
  const second = name.charAt(1);
  if (second === '' || second !== second.toLowerCase()) return name;
  return name.charAt(0).toLowerCase() + name.slice(1);
}

export function toolCtaLabel(tool: PublicTool): string {
  return tool.kind === 'application'
    ? `Open the free ${midSentence(tool.name)}`
    : `Open the ${tool.name}`;
}

/**
 * The in-context offer: the tool this article's reader needs next. Capability-aware like
 * ToolCta — the account offer appears only where accounts are open, so no page offers a
 * sign-up that would land on "Accounts aren't open".
 */
export function ArticleToolCta({ tool }: { tool: PublicTool }) {
  const accountsOpen = isDatabaseConfigured();
  const action = primaryAction(accountsOpen);
  return (
    <div className="cta-row">
      <LinkButton href={tool.path}>{toolCtaLabel(tool)}</LinkButton>
      {accountsOpen && action.href !== tool.path ? (
        <Link className="text-link" href={action.href}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

function SectionView({ section }: { section: ArticleSection }) {
  return (
    <>
      <h2>{section.heading}</h2>
      {section.paragraphs.map((paragraph) => (
        <p key={paragraph} className="measure">
          {paragraph}
        </p>
      ))}
      {section.list ? (
        <ul className="measure">
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.steps ? (
        <ol className="measure">
          {section.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
      {section.table ? (
        <DataTable caption={section.table.caption}>
          <thead>
            <tr>
              {section.table.head.map((cell, index) => (
                <th key={`${cell}-${index}`} scope="col">
                  {cell === '' ? <span className="sr-only">Item</span> : cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.table.rows.map((row) => (
              <tr key={row.join('|')}>
                {row.map((cell, index) =>
                  index === 0 ? (
                    <th key={`${cell}-${index}`} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={`${cell}-${index}`}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </DataTable>
      ) : null}
    </>
  );
}

export function ArticleView({ article, hub, disclaimer, related, relatedTitle }: ArticleViewProps) {
  const tools = article.tools
    .map((path) => findPublicTool(path))
    .filter((tool): tool is PublicTool => tool !== undefined);
  const primary = findPublicTool(article.primaryTool);
  const calloutTool = findPublicTool(article.callout.tool);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">
          <Link className="text-link" href={hub.href}>
            {hub.label}
          </Link>
        </p>
        <h1>{article.title}</h1>
        <p className="lede">{article.lede}</p>
        <p className="muted">
          {article.byline} · Published{' '}
          <time dateTime={article.published}>{shortDate(article.published)}</time>
          {article.updated !== article.published ? (
            <>
              {' '}
              · Updated <time dateTime={article.updated}>{shortDate(article.updated)}</time>
            </>
          ) : null}{' '}
          · Last reviewed <time dateTime={article.reviewed}>{shortDate(article.reviewed)}</time>
        </p>
      </section>

      <section className="section guide-cover-section">
        <CoverFigure photo={article.cover} priority />
      </section>

      <section className="section" aria-labelledby="answer-title">
        <h2 id="answer-title">Short answer</h2>
        <p className="measure">{article.answer}</p>
        {primary ? <ArticleToolCta tool={primary} /> : null}
      </section>

      <section className="section" aria-labelledby="facts-title">
        <h2 id="facts-title">Key facts</h2>
        <ul className="measure">
          {article.keyFacts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        {article.definitions.length > 0 ? (
          <>
            <h3>Terms used</h3>
            <dl className="record-list measure">
              {article.definitions.map((entry) => (
                <div key={entry.term}>
                  <dt className="caption">{entry.term}</dt>
                  <dd>{entry.meaning}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}
      </section>

      <article className="section">
        {article.sections.map((section, index) => (
          // A fragment, not a wrapper: the section styles select direct children of .section.
          <Fragment key={section.heading}>
            <SectionView section={section} />
            {index === article.callout.afterSection && calloutTool ? (
              <Callout title={article.callout.title}>
                {article.callout.text}{' '}
                <Link className="text-link" href={calloutTool.path}>
                  {toolCtaLabel(calloutTool)}
                </Link>
              </Callout>
            ) : null}
          </Fragment>
        ))}
      </article>

      {tools.length > 0 ? (
        <section className="section" aria-labelledby="article-tools-title">
          <h2 id="article-tools-title">Tools for this</h2>
          <div className="form-grid">
            {tools.map((tool) => (
              <Link key={tool.path} href={tool.path} className="form-cell">
                <h3>{tool.name}</h3>
                <p>{tool.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section" aria-labelledby="faq-title">
        <h2 id="faq-title">Questions people ask</h2>
        <div className="faq">
          {article.faq.map((entry) => (
            <details key={entry.q}>
              <summary>{entry.q}</summary>
              <p>{entry.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <Callout tone="legal" title="What this page is">
          {disclaimer}
        </Callout>
      </section>

      <SourcesBlock ids={article.sources} />

      <section className="section">
        <h2>One record, every document</h2>
        <p className="measure">
          The invoice, the proforma and the packing list only agree if they are prepared from the
          same figures. TradeDocs keeps the parties, goods and terms of a shipment once and prepares
          each document from that record. The free tools work without an account;{' '}
          <Link className="text-link" href="/pricing">
            see pricing
          </Link>{' '}
          for the workspace.
        </p>
        <ToolCta secondary={{ href: hub.href, label: hub.allLabel }} />
      </section>

      {related.length > 0 ? (
        <section className="section" aria-labelledby="related-articles-title">
          <h2 id="related-articles-title">{relatedTitle}</h2>
          <div className="form-grid">
            {related.map((entry) => (
              <Link key={entry.href} href={entry.href} className="form-cell">
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
