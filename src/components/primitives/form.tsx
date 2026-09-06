import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

type FieldProps = {
  /** Must match the control's id so the label and messages are associated. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Shown beside the label. Say "Optional" rather than marking required fields. */
  requirement?: string;
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
};

/**
 * Owns label, hint and error wiring so no control can ship an unassociated
 * message. The render prop hands back the ids the control must apply.
 */
export function Field({ id, label, hint, error, requirement, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {requirement ? <span className="requirement"> · {requirement}</span> : null}
      </label>
      {hint ? (
        <p className="hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {children({ id, describedBy, invalid: Boolean(error) })}
      {error ? (
        <p className="error-text" id={errorId}>
          <AlertCircle size={15} aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ invalid, className, ...rest }: ComponentPropsWithoutRef<'input'> & { invalid?: boolean }) {
  return <input {...rest} aria-invalid={invalid || undefined} className={['input', className].filter(Boolean).join(' ')} />;
}

export function Textarea({
  invalid,
  className,
  ...rest
}: ComponentPropsWithoutRef<'textarea'> & { invalid?: boolean }) {
  return (
    <textarea
      {...rest}
      aria-invalid={invalid || undefined}
      className={['textarea', className].filter(Boolean).join(' ')}
    />
  );
}

export function Select({
  invalid,
  className,
  children,
  ...rest
}: ComponentPropsWithoutRef<'select'> & { invalid?: boolean }) {
  return (
    <select {...rest} aria-invalid={invalid || undefined} className={['select', className].filter(Boolean).join(' ')}>
      {children}
    </select>
  );
}

/**
 * A native combobox. `list` keeps typing, filtering and keyboard behaviour in
 * the browser, so there is no custom listbox to get wrong.
 */
export function Combobox({
  id,
  options,
  invalid,
  ...rest
}: ComponentPropsWithoutRef<'input'> & { id: string; options: readonly string[]; invalid?: boolean }) {
  return (
    <>
      <Input {...rest} id={id} list={`${id}-options`} invalid={invalid} />
      <datalist id={`${id}-options`}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </>
  );
}

type ChoiceProps = ComponentPropsWithoutRef<'input'> & { id: string; label: string; hint?: string };

export function Choice({ id, label, hint, type = 'checkbox', ...rest }: ChoiceProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="choice">
      <input {...rest} type={type} id={id} aria-describedby={hintId} />
      <div>
        <label htmlFor={id}>{label}</label>
        {hint ? (
          <p className="hint" id={hintId}>
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
