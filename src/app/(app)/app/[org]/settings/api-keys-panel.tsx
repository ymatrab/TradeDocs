'use client';

import Link from 'next/link';
import { useActionState, useRef } from 'react';
import { Button } from '@/components/primitives/button';
import { Callout } from '@/components/primitives/feedback';
import { Field, Input } from '@/components/primitives/form';
import { ActionResult } from '@/components/primitives/action-result';
import { useInvalidFocus } from '@/components/primitives/use-invalid-focus';
import { createApiKey, revokeApiKey, type ApiKeyState } from '@/app/(app)/api-key-actions';

export type ApiKeyView = {
  id: string;
  name: string;
  prefix: string;
  /** Already formatted on the server, such as "9 Oct 2026". */
  created: string;
  lastUsed: string | null;
  revoked: string | null;
};

function RevokeKey({ org, view }: { org: string; view: ApiKeyView }) {
  const [state, revoke, revoking] = useActionState<ApiKeyState, FormData>(revokeApiKey, {});
  return (
    <form action={revoke} style={{ display: 'grid', gap: 8 }}>
      <input type="hidden" name="org" value={org} />
      <input type="hidden" name="key" value={view.id} />
      <ActionResult state={state} successTitle="Revoked" />
      <div>
        <Button
          type="submit"
          tone="danger"
          compact
          pending={revoking}
          pendingLabel="Revoking…"
          aria-label={`Revoke the key ${view.name}`}
        >
          Revoke
        </Button>
      </div>
    </form>
  );
}

/**
 * API keys on the organization settings page (D-025). Shown to owners and administrators;
 * the database decides every action again. Without the Team plan the list still shows (so
 * old keys can be revoked) and the create form is disabled with a plain statement why.
 */
export function ApiKeysPanel({
  org,
  keys,
  entitled,
  available,
  loadFailed,
}: {
  org: string;
  keys: ApiKeyView[];
  entitled: boolean;
  /** False when the deployment has no API key pepper configured. */
  available: boolean;
  loadFailed: boolean;
}) {
  const [created, create, creating] = useActionState<ApiKeyState, FormData>(createApiKey, {});
  const form = useRef<HTMLFormElement>(null);
  useInvalidFocus(form, created.fields);
  const canCreate = entitled && available;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <p className="muted" style={{ margin: 0 }}>
        A key lets your own software use the{' '}
        <Link className="text-link" href="/developers">
          TradeDocs REST API
        </Link>{' '}
        for this organization: list and create shipments, generate documents and download their
        PDFs. A key acts with the rights of the owner or administrator who created it, and stops
        working if they leave the organization or lose that role.
      </p>
      {entitled ? null : (
        <Callout tone="neutral" title="The API is part of Team">
          See{' '}
          <Link className="text-link" href={`/app/${org}/billing`}>
            Billing
          </Link>{' '}
          for this organization’s plan, or{' '}
          <Link className="text-link" href="/pricing">
            pricing
          </Link>{' '}
          for what each plan includes. Existing keys can still be revoked.
        </Callout>
      )}
      {entitled && !available ? (
        <Callout tone="warning" title="Not available on this deployment yet">
          API keys need a server setting that has not been configured. Nothing is lost; try again
          later.
        </Callout>
      ) : null}

      <ActionResult state={created} successTitle="Key created" />
      {created.key ? (
        <Field
          id="api-key-new"
          label="Your new API key"
          hint="Copy it now and keep it somewhere safe, such as a password manager or your server's secret store. It is not shown again; if it is lost, revoke it and create another."
        >
          {({ id, describedBy }) => (
            <Input
              id={id}
              aria-describedby={describedBy}
              readOnly
              value={created.key}
              spellCheck={false}
              autoComplete="off"
              onFocus={(event) => event.currentTarget.select()}
              style={{ fontFamily: 'var(--font-mono, monospace)' }}
            />
          )}
        </Field>
      ) : null}

      <form ref={form} action={create} style={{ display: 'grid', gap: 12 }} noValidate>
        <input type="hidden" name="org" value={org} />
        <fieldset
          disabled={!canCreate}
          style={{ display: 'grid', gap: 12, border: 0, padding: 0, margin: 0 }}
        >
          <Field
            id="api-key-name"
            label="Key name"
            hint="What will use it, so you can tell keys apart later."
            error={created.fields?.name}
          >
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                name="name"
                maxLength={60}
                invalid={invalid}
                aria-describedby={describedBy}
                autoComplete="off"
              />
            )}
          </Field>
          <div>
            <Button type="submit" pending={creating} pendingLabel="Creating…" disabled={!canCreate || creating}>
              Create key
            </Button>
          </div>
        </fieldset>
      </form>

      {loadFailed ? (
        <Callout tone="warning" title="The keys could not be loaded">
          Reload the page to try again.
        </Callout>
      ) : keys.length === 0 ? (
        <p className="muted" style={{ margin: 0 }}>
          No API keys yet.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
          {keys.map((view) => (
            <li
              key={view.id}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                justifyContent: 'space-between',
                alignItems: 'start',
                paddingTop: 12,
                borderTop: '1px solid var(--line, #d0d0d0)',
              }}
            >
              <div style={{ display: 'grid', gap: 4, minWidth: 0 }}>
                <strong style={{ overflowWrap: 'anywhere' }}>{view.name}</strong>
                <span className="muted">
                  <code>{view.prefix}…</code> · created {view.created} ·{' '}
                  {view.lastUsed ? `last used ${view.lastUsed}` : 'never used'}
                  {view.revoked ? ` · revoked ${view.revoked}` : ''}
                </span>
              </div>
              {view.revoked ? null : <RevokeKey org={org} view={view} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
