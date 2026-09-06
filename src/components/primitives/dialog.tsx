'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Native `<dialog>` in modal mode. The browser owns the focus trap, Escape and
 * focus return to the invoker, which is the behaviour hand-rolled modals get
 * wrong most often.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      aria-describedby={description ? 'dialog-description' : undefined}
      onClose={onClose}
      onCancel={onClose}
    >
      <div className="dialog-head">
        <h2 id="dialog-title">{title}</h2>
        {description ? (
          <p className="muted" id="dialog-description" style={{ marginBottom: 0 }}>
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="dialog-body">{children}</div> : null}
      {footer ? <div className="dialog-foot">{footer}</div> : null}
    </dialog>
  );
}
