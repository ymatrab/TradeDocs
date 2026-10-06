'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/primitives/button';
import { ConfirmButton } from '@/components/primitives/confirm';
import { Callout, EmptyState } from '@/components/primitives/feedback';
import { Field, Input } from '@/components/primitives/form';
import { DataTable } from '@/components/primitives/table';
import { runPurgeNow, searchUsersAction, type PurgeState, type SearchState } from './actions';

function day(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : '—';
}

/**
 * Search by email. The form posts; the results come back in the action's state and are
 * rendered here, so the address never appears in a URL, the history or a referrer.
 */
export function UserSearch() {
  const [state, action, pending] = useActionState<SearchState, FormData>(searchUsersAction, {});
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <form action={action} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
        <Field
          id="user-query"
          label="Email address"
          hint="The full address, or its first three or more characters."
          error={state.error}
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="query"
              type="search"
              autoComplete="off"
              required
              minLength={3}
              maxLength={254}
              invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <div>
          <Button type="submit" pending={pending} pendingLabel="Searching…">
            Search
          </Button>
        </div>
      </form>

      {state.searched && state.rows && state.rows.length === 0 ? (
        <EmptyState
          title="No account matches"
          description="Nothing starts with that. Check the spelling, or search with fewer characters."
        />
      ) : null}
      {state.rows && state.rows.length > 0 ? (
        <DataTable caption="Matching accounts" density="compact">
          <thead>
            <tr>
              <th scope="col">Email</th>
              <th scope="col">Created</th>
              <th scope="col">Last sign-in</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {state.rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <Link className="text-link" href={`/admin/users/${row.id}`}>
                    {row.email ?? 'No address'}
                  </Link>
                </td>
                <td className="data">{day(row.created_at)}</td>
                <td className="data">{day(row.last_sign_in_at)}</td>
                <td>
                  {[
                    row.email_confirmed_at ? null : 'Unconfirmed',
                    row.banned ? 'Sign-in disabled' : null,
                    row.deletion_due ? `Deletion due ${day(row.deletion_due)}` : null,
                  ]
                    .filter(Boolean)
                    .join(' · ') || 'Active'}
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      ) : null}
    </div>
  );
}

/** Runs the account purge once, now. The same routine a schedule would call. */
export function PurgeNow() {
  const [state, action, pending] = useActionState<PurgeState, FormData>(runPurgeNow, {});
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {state.notice ? (
        <Callout tone="success" title="Purge finished" live>
          {state.notice}
        </Callout>
      ) : null}
      <form id="purge-now" action={action} />
      <div>
        <ConfirmButton
          form="purge-now"
          trigger="Run purge now"
          title="Purge accounts past their grace period?"
          description="Every account whose 30-day deletion grace has ended is removed permanently, with its profile and memberships. Withdrawn requests and accounts still in their grace period are untouched. This cannot be undone."
          confirm="Purge now"
          cancel="Not now"
          pending={pending}
          error={state.error}
        />
      </div>
    </div>
  );
}
