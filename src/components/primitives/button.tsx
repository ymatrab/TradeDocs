import type { ComponentPropsWithoutRef, ReactNode } from 'react';

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

export function LinkButton({
  tone = 'primary',
  compact,
  block,
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <a {...rest} className={classes(tone, compact, block, className)}>
      {children}
    </a>
  );
}
