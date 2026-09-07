'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Button, type ButtonTone } from '@/components/primitives/button';
import { Dialog } from '@/components/primitives/dialog';
import { Callout } from '@/components/primitives/feedback';

/**
 * A destructive submit that says what it is about to do before it does it.
 *
 * The confirmation submits the caller's own form by id, so the action, its hidden
 * fields and its pending state stay where they already were. The dialog closes
 * only once the action has succeeded: a rejected password or a refused deletion
 * leaves the confirmation on screen with the user's input still in it, rather
 * than dropping them back to a page-level message with nothing to correct.
 */
export function ConfirmButton({
  form,
  trigger,
  triggerLabel,
  triggerIcon,
  title,
  description,
  confirm,
  cancel = 'Keep it',
  tone = 'danger',
  compact,
  pending = false,
  error,
  failed,
  children,
}: {
  /** Id of the form this confirmation submits. */
  form: string;
  /** Visible label on the trigger. Omit for an icon-only trigger. */
  trigger?: ReactNode;
  /** Accessible name, required when the trigger carries no visible text. */
  triggerLabel?: string;
  triggerIcon?: ReactNode;
  title: string;
  description: string;
  confirm: string;
  cancel?: string;
  /**
   * How the trigger is drawn. A quiet trigger suits a dense row; the button that
   * actually destroys something is always drawn as destructive.
   */
  tone?: ButtonTone;
  compact?: boolean;
  pending?: boolean;
  /** The action's error, when it belongs at dialog level rather than on a field. */
  error?: string;
  /**
   * Whether the action failed. Defaults to whether `error` was given, and is set
   * separately when the message is already showing on a field inside `children`:
   * the dialog still has to stay open, or the correction has nowhere to happen.
   */
  failed?: boolean;
  /** Anything the confirmation itself must collect, such as a password. */
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const wasPending = useRef(false);
  const errorId = useId();
  const rejected = failed ?? Boolean(error);

  // Closing is driven by the outcome, not by the click that started it.
  useEffect(() => {
    if (wasPending.current && !pending && !rejected) setOpen(false);
    wasPending.current = pending;
  }, [pending, rejected]);

  return (
    <>
      <Button
        type="button"
        tone={tone}
        compact={compact}
        aria-label={triggerLabel}
        onClick={() => setOpen(true)}
      >
        {triggerIcon}
        {trigger}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
        footer={
          <>
            <Button type="button" tone="secondary" onClick={() => setOpen(false)}>
              {cancel}
            </Button>
            <Button
              type="submit"
              form={form}
              tone="danger"
              pending={pending}
              aria-describedby={error ? errorId : undefined}
            >
              {confirm}
            </Button>
          </>
        }
      >
        {error ? (
          <div id={errorId}>
            <Callout tone="danger" title="That did not work" live>
              {error}
            </Callout>
          </div>
        ) : null}
        {children}
      </Dialog>
    </>
  );
}
