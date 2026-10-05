'use client';

import { useEffect, useRef } from 'react';

/**
 * A 1px sentinel placed directly above the public header. Once it has scrolled out of
 * view the header is stuck, and the header is told so with one attribute; the condensed
 * drawing (a shorter row, a deeper shadow) is CSS keyed off it. The boundary line is part
 * of the card and is never what condenses.
 *
 * Without script, without IntersectionObserver, or before this runs, the header simply
 * keeps its full height.
 */
export function NavSentinel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = ref.current;
    const header = sentinel?.nextElementSibling;
    if (!sentinel || !(header instanceof HTMLElement)) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting) delete header.dataset.condensed;
      else header.dataset.condensed = 'true';
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className="nav-sentinel" aria-hidden="true" />;
}
