'use client';

import { useId, useRef, useState, type ReactNode } from 'react';

export type TabItem = { id: string; label: string; content: ReactNode };

/** Roving tabindex with arrow-key movement, per the WAI-ARIA tabs pattern. */
export function Tabs({ items, label }: { items: readonly TabItem[]; label: string }) {
  const base = useId();
  const [active, setActive] = useState(items[0]?.id ?? '');
  const refs = useRef(new Map<string, HTMLButtonElement>());

  const move = (delta: number) => {
    const index = items.findIndex((item) => item.id === active);
    const next = items[(index + delta + items.length) % items.length];
    if (!next) return;
    setActive(next.id);
    refs.current.get(next.id)?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={label} className="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${base}-${item.id}-tab`}
            className="tab"
            aria-selected={item.id === active}
            aria-controls={`${base}-${item.id}-panel`}
            tabIndex={item.id === active ? 0 : -1}
            ref={(node) => {
              if (node) refs.current.set(item.id, node);
              else refs.current.delete(item.id);
            }}
            onClick={() => setActive(item.id)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight') move(1);
              if (event.key === 'ArrowLeft') move(-1);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${base}-${item.id}-panel`}
          aria-labelledby={`${base}-${item.id}-tab`}
          hidden={item.id !== active}
          tabIndex={0}
          style={{ paddingTop: 16 }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
