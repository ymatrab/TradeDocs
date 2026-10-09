'use client';

import { useActionState } from 'react';
import { Button } from '@/components/primitives/button';
import { ConfirmButton } from '@/components/primitives/confirm';
import { Callout } from '@/components/primitives/feedback';
import { DataTable } from '@/components/primitives/table';
import { ActionResult } from '@/components/primitives/action-result';
import {
  connectProvider,
  disconnectProvider,
  importFromProvider,
  type IntegrationImportState,
} from '@/app/(app)/integration-actions';
import type { ActionState } from '@/app/(app)/actions';

type ProviderKey = 'quickbooks' | 'xero';
type Entity = 'company' | 'product';
type Issue = { row: number; label: string; problem: string };

/** Starts the OAuth flow; the action redirects to the provider. */
export function ConnectForm({
  org,
  provider,
  name,
  reconnect = false,
}: {
  org: string;
  provider: ProviderKey;
  name: string;
  reconnect?: boolean;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(connectProvider, {});
  return (
    <form action={action} style={{ display: 'grid', gap: 12 }}>
      <input type="hidden" name="org" value={org} />
      <input type="hidden" name="provider" value={provider} />
      <ActionResult state={state} />
      <div>
        <Button type="submit" pending={pending} pendingLabel={`Opening ${name}…`}>
          {reconnect ? `Reconnect ${name}` : `Connect ${name}`}
        </Button>
      </div>
    </form>
  );
}

export function DisconnectForm({
  org,
  provider,
  name,
}: {
  org: string;
  provider: ProviderKey;
  name: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(disconnectProvider, {});
  const id = `disconnect-${provider}`;
  return (
    <form id={id} action={action} style={{ display: 'grid', gap: 12 }}>
      <input type="hidden" name="org" value={org} />
      <input type="hidden" name="provider" value={provider} />
      <ActionResult state={state} successTitle="Disconnected" />
      <div>
        <ConfirmButton
          form={id}
          trigger={`Disconnect ${name}`}
          tone="secondary"
          title={`Disconnect ${name}?`}
          description={`TradeDocs revokes its access at ${name} and deletes the stored credentials. Companies and products already imported stay in TradeDocs.`}
          confirm="Disconnect"
          pending={pending}
          error={state.error}
        />
      </div>
    </form>
  );
}

function IssueTable({ caption, issues }: { caption: string; issues: Issue[] }) {
  if (issues.length === 0) return null;
  return (
    <DataTable caption={caption} density="compact">
      <thead>
        <tr>
          <th scope="col" className="numeric">
            Record
          </th>
          <th scope="col">Name</th>
          <th scope="col">What happens</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue, index) => (
          <tr key={`${issue.row}-${index}`}>
            <td className="numeric">{issue.row}</td>
            <td>{issue.label}</td>
            <td>{issue.problem}</td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

const ENTITY_COPY: Record<
  Entity,
  { title: string; source: Record<ProviderKey, string>; target: string }
> = {
  company: {
    title: 'Customers',
    source: { quickbooks: 'customers', xero: 'contacts' },
    target: 'company directory',
  },
  product: {
    title: 'Items',
    source: { quickbooks: 'products and services', xero: 'items' },
    target: 'product catalog',
  },
};

/**
 * One entity's import: check first (reads the provider, writes nothing), then import. Both
 * read the provider afresh, so the import applies what the provider holds at that moment.
 */
export function ImportForm({
  org,
  provider,
  name,
  entity,
}: {
  org: string;
  provider: ProviderKey;
  name: string;
  entity: Entity;
}) {
  const [state, action, pending] = useActionState<IntegrationImportState, FormData>(
    importFromProvider,
    {},
  );
  const copy = ENTITY_COPY[entity];
  const failed = Boolean(state.error);
  return (
    <section aria-labelledby={`import-${provider}-${entity}`} style={{ display: 'grid', gap: 12 }}>
      <h3 id={`import-${provider}-${entity}`} style={{ margin: 0 }}>
        {copy.title}
      </h3>
      <p className="muted" style={{ margin: 0 }}>
        Reads your {name} {copy.source[provider]} into the {copy.target}. A record imported before
        is matched by its {name} id and updated only if nobody changed it in TradeDocs.
      </p>
      <form action={action} style={{ display: 'grid', gap: 12 }}>
        <input type="hidden" name="org" value={org} />
        <input type="hidden" name="provider" value={provider} />
        <input type="hidden" name="entity" value={entity} />
        {failed ? (
          <Callout tone="danger" title="Nothing was imported" live>
            {state.error}
            {state.detail ? ` ${name} said: “${state.detail}”` : ''}
          </Callout>
        ) : null}
        {state.notice ? (
          <Callout
            tone="success"
            title={state.previewed ? 'Ready to import' : state.applied ? 'Imported' : 'Checked'}
            live
          >
            {state.notice}
          </Callout>
        ) : null}
        {state.truncated ? (
          <Callout tone="warning" title="Only the first records were read">
            {name} holds more than {state.read} {copy.source[provider]}; one import reads the first{' '}
            {state.read}.
          </Callout>
        ) : null}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button
            type="submit"
            name="intent"
            value="preview"
            tone="secondary"
            pending={pending}
            pendingLabel={`Reading ${name}…`}
          >
            Check {copy.title.toLowerCase()}
          </Button>
          <Button
            type="submit"
            name="intent"
            value="apply"
            pending={pending}
            pendingLabel="Importing…"
            disabled={pending || !state.previewed}
          >
            Import {copy.title.toLowerCase()}
          </Button>
        </div>
        {!state.previewed && !state.applied ? (
          <p className="hint" style={{ margin: 0 }}>
            Check first: it shows what would be added, updated or left alone, and writes nothing.
          </p>
        ) : null}
      </form>
      <IssueTable caption="Records with a problem (not imported)" issues={state.problems ?? []} />
      <IssueTable caption="Conflicts (TradeDocs version kept)" issues={state.conflicts ?? []} />
      <IssueTable caption="Skipped" issues={state.skipped ?? []} />
      <IssueTable caption="Imported with a value left blank" issues={state.notes ?? []} />
    </section>
  );
}
