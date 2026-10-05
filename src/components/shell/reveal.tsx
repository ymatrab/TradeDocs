'use client';

import { useEffect, useRef, type ComponentPropsWithoutRef, type RefObject } from 'react';

/**
 * Arms an element for its entrance motion and fires it once the element is seen.
 *
 * The hook writes a single attribute and nothing else; every motion is CSS keyed off it,
 * inside `prefers-reduced-motion: no-preference`. It only arms an element that starts
 * below the fold, so nothing a visitor can already see is hidden and replayed, and without
 * script, without IntersectionObserver or with reduced motion the element is simply left
 * in its final state.
 */
export function useInView<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const box = element.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;

    element.dataset.reveal = 'pending';
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.dataset.reveal = 'in';
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
}

/** A section whose descendants take their entrance motion from the reveal state. */
export function RevealSection(props: ComponentPropsWithoutRef<'section'>) {
  const ref = useRef<HTMLElement>(null);
  useInView(ref);
  return <section {...props} ref={ref} />;
}
