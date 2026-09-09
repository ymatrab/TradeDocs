'use client';

import { useState, type ComponentPropsWithoutRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/primitives/form';

/**
 * A password field whose value can be read back.
 *
 * Twelve characters typed blind is where a good share of failed sign-ins begin, and the
 * recovery for a typo nobody can see is to clear the field and start again. Revealing is
 * never the default, and the control is named for what it will do rather than for the
 * state it is in, so its accessible name and its icon say the same thing.
 */
export function PasswordInput({
  invalid,
  ...rest
}: ComponentPropsWithoutRef<'input'> & { invalid?: boolean }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="password-field">
      <Input {...rest} type={shown ? 'text' : 'password'} invalid={invalid} />
      <button type="button" className="password-toggle" onClick={() => setShown((was) => !was)}>
        {shown ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
        <span className="sr-only">{shown ? 'Hide password' : 'Show password'}</span>
      </button>
    </div>
  );
}
