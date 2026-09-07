'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { ChevronDown } from 'lucide-react';

export type MenuAction = { label: string; onSelect: () => void; icon?: ReactNode };

/**
 * Anchored menu, following the WAI-ARIA menu button pattern the roles promise:
 * opening moves focus into the menu, arrows and Home/End move between items,
 * items are out of the tab sequence, and Escape or a selection returns focus to
 * the trigger. Positioned inside a relative wrapper rather than the top layer so
 * it lands in the same place in every engine we test.
 */
export function Menu({ label, actions }: { label: string; actions: readonly MenuAction[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  const focusItem = useCallback((index: number) => {
    const list = items.current.filter(Boolean) as HTMLButtonElement[];
    if (list.length === 0) return;
    const wrapped = ((index % list.length) + list.length) % list.length;
    list[wrapped]?.focus();
  }, []);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) trigger.current?.focus();
  }, []);

  // Focus lands on the first item as the menu opens, which is what the role promises.
  useEffect(() => {
    if (open) focusItem(0);
  }, [open, focusItem]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!wrap.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open, close]);

  const currentIndex = () => items.current.findIndex((node) => node === document.activeElement);

  const onMenuKey = (event: KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      Escape: () => close(true),
      Tab: () => close(false),
      ArrowDown: () => focusItem(currentIndex() + 1),
      ArrowUp: () => focusItem(currentIndex() - 1),
      Home: () => focusItem(0),
      End: () => focusItem(items.current.length - 1),
    };
    const handler = keys[event.key];
    if (!handler) return;
    // Tab still moves on; every other key belongs to the menu.
    if (event.key !== 'Tab') event.preventDefault();
    handler();
  };

  return (
    <div className="menu-wrap" ref={wrap}>
      <button
        type="button"
        ref={trigger}
        className="btn secondary compact"
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
          event.preventDefault();
          setOpen(true);
        }}
      >
        {label}
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      <div className="menu" id={id} role="menu" hidden={!open} onKeyDown={onMenuKey}>
        {actions.map((action, index) => (
          <button
            key={action.label}
            type="button"
            role="menuitem"
            tabIndex={-1}
            ref={(node) => {
              items.current[index] = node;
            }}
            onClick={() => {
              close(true);
              action.onSelect();
            }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
