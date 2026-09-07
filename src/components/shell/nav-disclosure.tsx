'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';

/**
 * A `<details>` menu that closes itself.
 *
 * Native disclosure keeps the expanded state and what is on screen in sync
 * without script. The one thing the element will not do on its own is dismiss:
 * left alone it stays open over the content the user just navigated to, so
 * script covers that and nothing else. A hash link within the same page does
 * not change the path, which is why a click inside also closes it.
 */
export function NavDisclosure({
  summary,
  label,
  className,
  children,
}: {
  summary: ReactNode;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  const close = useCallback((returnFocus = false) => {
    const element = ref.current;
    if (!element?.open) return;
    element.open = false;
    if (returnFocus) element.querySelector('summary')?.focus();
  }, []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [close]);

  return (
    <details className={['nav-disclosure', className].filter(Boolean).join(' ')} ref={ref}>
      <summary className="btn secondary">{summary}</summary>
      <nav aria-label={label} onClick={() => close()}>
        {children}
      </nav>
    </details>
  );
}
