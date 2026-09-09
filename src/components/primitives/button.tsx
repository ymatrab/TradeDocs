import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import Link from 'next/link';

export type ButtonTone = 'primary' | 'secondary' | 'quiet' | 'accent' | 'danger';

function classes(tone: ButtonTone, compact?: boolean, block?: boolean, extra?: string): string {
  return [
    'btn',
    tone === 'primary' ? '' : tone,
    compact ? 'compact' : '',
    block ? 'block' : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  tone?: ButtonTone;
  compact?: boolean;
  block?: boolean;
  /** Replaces the label while work is in flight and announces the change. */
  pending?: boolean;
  pendingLabel?: string;
  children: ReactNode;
};

export function Button({
  tone = 'primary',
  compact,
  block,
  pending,
  pendingLabel = 'Working…',
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={classes(tone, compact, block, className)}
      disabled={disabled ?? pending}
      aria-busy={pending || undefined}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

type LinkButtonProps = ComponentPropsWithoutRef<'a'> & {
  tone?: ButtonTone;
  compact?: boolean;
  block?: boolean;
  children: ReactNode;
};

/**
 * A link drawn as a button. Anything pointing at one of this application's own routes
 * navigates on the client, because a raw anchor reloads the document, discards the
 * router cache and makes the primary call to action the slowest thing on the page.
 *
 * Three kinds of href stay plain anchors. A download is served by a route handler and
 * has no client navigation to perform — and `Link` would prefetch it, generating a
 * document nobody has asked for yet. An in-page fragment is not a navigation. An
 * off-site address is not ours to route.
 */
function navigatesOnClient(href: string | undefined, download: unknown): href is string {
  return (
    download === undefined && typeof href === 'string' && href.startsWith('/') && href[1] !== '/'
  );
}

export function LinkButton({
  tone = 'primary',
  compact,
  block,
  className,
  children,
  href,
  download,
  ...rest
}: LinkButtonProps) {
  const applied = classes(tone, compact, block, className);
  if (!navigatesOnClient(href, download)) {
    return (
      <a {...rest} href={href} download={download} className={applied}>
        {children}
      </a>
    );
  }
  return (
    <Link {...rest} href={href} className={applied}>
      {children}
    </Link>
  );
}
