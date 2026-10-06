import type { ReactNode } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle } from 'lucide-react';

export type ChecklistStep = {
  id: string;
  title: string;
  description: string;
  done: boolean;
  /** Where the step is done. */
  href: string;
  /** The button label for the step when it is the next one. */
  action: string;
  /** A second way to do it, drawn as a quiet link (for example, importing instead). */
  alternative?: { href: string; label: string };
};

/**
 * A short ordered list of things to set up, each one ticked from real data rather than
 * from a flag the user dismisses. The first step not yet done is the only one drawn with
 * a primary button, so the list always says what to do next.
 *
 * Done is a word and a glyph as well as a colour, and the count is real text, so the
 * progress reads the same to a screen reader and in greyscale.
 */
export function Checklist({
  label,
  steps,
  footer,
}: {
  label: string;
  steps: readonly ChecklistStep[];
  footer?: ReactNode;
}) {
  const done = steps.filter((step) => step.done).length;
  const next = steps.find((step) => !step.done);
  return (
    <div className="checklist">
      <div className="checklist-progress">
        <p className="caption">
          {done} of {steps.length} done
        </p>
        <progress value={done} max={steps.length} aria-label={label}>
          {done} of {steps.length}
        </progress>
      </div>
      <ol className="checklist-steps">
        {steps.map((step, index) => {
          const isNext = step === next;
          return (
            <li
              key={step.id}
              className={['checklist-step', step.done ? 'done' : '', isNext ? 'next' : '']
                .filter(Boolean)
                .join(' ')}
              aria-current={isNext ? 'step' : undefined}
            >
              <span className="checklist-mark" aria-hidden="true">
                {step.done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </span>
              <div className="checklist-text">
                <h3>
                  <span className="checklist-ordinal">{String(index + 1).padStart(2, '0')}</span>
                  {step.title}
                  {step.done ? <span className="checklist-done"> · Done</span> : null}
                </h3>
                <p className="muted">{step.description}</p>
              </div>
              {step.done ? null : (
                <div className="checklist-actions">
                  <Link
                    className={isNext ? 'btn compact' : 'btn secondary compact'}
                    href={step.href}
                  >
                    {step.action}
                  </Link>
                  {step.alternative ? (
                    <Link className="text-link" href={step.alternative.href}>
                      {step.alternative.label}
                    </Link>
                  ) : null}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {footer}
    </div>
  );
}
