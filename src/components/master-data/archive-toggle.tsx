'use client';

import { useActionState } from 'react';
import { Button } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import type { ActionState } from '@/app/(app)/actions';

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Archiving, not deleting. A catalog entry or a party that a finalized document was
 * built from is part of that document's provenance, so the interface offers to put it
 * away rather than to destroy it — and says so, because "archive" is only reassuring
 * if the reader knows what happens to the documents that referenced it.
 */
export function ArchiveToggle({
  action,
  org,
  field,
  id,
  archived,
  archiveLabel,
  restoreLabel,
}: {
  action: Action;
  org: string;
  /** Form field the record's id is submitted under, matching the action's schema. */
  field: 'company' | 'product';
  id: string;
  archived: boolean;
  archiveLabel: string;
  restoreLabel: string;
}) {
  const [state, submit, pending] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={submit} style={{ display: 'grid', gap: 12 }}>
      <input type="hidden" name="org" value={org} />
      <input type="hidden" name={field} value={id} />
      <input type="hidden" name="archived" value={archived ? 'false' : 'true'} />
      {state.error ? (
        <Callout tone="danger" title="That did not work" live>
          {state.error}
        </Callout>
      ) : null}
      {state.notice ? (
        <Callout tone="success" title="Done" live>
          {state.notice}
        </Callout>
      ) : null}
      <div>
        <Button
          type="submit"
          tone={archived ? 'secondary' : 'quiet'}
          pending={pending}
          pendingLabel="Working…"
        >
          {archived ? restoreLabel : archiveLabel}
        </Button>
      </div>
    </form>
  );
}
