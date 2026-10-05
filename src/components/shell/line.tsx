import type { CSSProperties, ReactNode } from 'react';

/**
 * One line of a headline, inside its own mask.
 *
 * The outer span clips; the inner span is what rises into it. Text is therefore either
 * hidden by a transform outside the mask or drawn at full contrast — never faded — which
 * is the property CI's axe pass depends on, because it samples the page mid-animation.
 * A marked word sits inside the same mask as its line, so on hull its ink never shows
 * without the tape behind it.
 *
 * Separate lines are block spans, so callers put a `{' '}` between them: the accessible
 * name of the heading must read "Same numbers, every page", not "Same numbers,every page".
 */
export function Line({ index = 0, children }: { index?: number; children: ReactNode }) {
  return (
    <span className="line">
      <span style={{ '--i': index } as CSSProperties}>{children}</span>
    </span>
  );
}
