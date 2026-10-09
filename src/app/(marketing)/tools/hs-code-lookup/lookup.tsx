'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/primitives/button';
import { EmptyState, ErrorState, LoadingBlock, Panel } from '@/components/primitives/feedback';
import { Field, Input } from '@/components/primitives/form';
import { DataTable } from '@/components/primitives/table';
import {
  HS_QUERY_MAX,
  TARIFFS,
  hsQuerySchema,
  type TariffEntry,
  type TariffId,
  type TariffOutcome,
} from '@/lib/tariff/hs-lookup';

type Answer = { query: string } & Record<TariffId, TariffOutcome>;

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'done'; answer: Answer };

function isAnswer(value: unknown): value is Answer {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  const ok = (outcome: unknown) =>
    !!outcome &&
    typeof outcome === 'object' &&
    ['ok', 'unavailable'].includes(String((outcome as { status?: unknown }).status));
  return typeof record.query === 'string' && ok(record.us) && ok(record.uk);
}

function Results({ id, outcome }: { id: TariffId; outcome: TariffOutcome }) {
  const tariff = TARIFFS[id];
  if (outcome.status === 'unavailable') {
    return (
      <Panel title={tariff.name}>
        <ErrorState
          title="The official service did not answer"
          description={`${tariff.publisher} did not respond in time or returned something we could not read. Nothing is wrong with your search; try again in a minute, or search on the official site.`}
          action={
            <a className="text-link" href={outcome.searchUrl} rel="noopener">
              Search the official tariff
            </a>
          }
        />
      </Panel>
    );
  }
  if (outcome.results.length === 0) {
    return (
      <Panel title={tariff.name}>
        <EmptyState
          title="No matching lines"
          description="Try a broader word (wire rather than copper wire, 1.5 mm), the material, or the first four digits of a code."
          action={
            <a className="text-link" href={outcome.searchUrl} rel="noopener">
              Search the official tariff instead
            </a>
          }
        />
      </Panel>
    );
  }
  return (
    <Panel title={tariff.name}>
      <p className="muted">
        {outcome.results.length} {outcome.results.length === 1 ? 'line' : 'lines'} from{' '}
        {tariff.publisher}.{' '}
        <a className="text-link" href={outcome.searchUrl} rel="noopener">
          See every result on the official site
        </a>
        .
      </p>
      <DataTable caption={`${tariff.name}: matching lines`} stack>
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Description</th>
            <th scope="col">Official page</th>
          </tr>
        </thead>
        <tbody>
          {outcome.results.map((entry: TariffEntry) => (
            <tr key={entry.url}>
              <td data-label="Code" className="data">
                {entry.code}
              </td>
              <td data-label="Description">
                {entry.context ? <span className="muted">{entry.context} › </span> : null}
                {entry.description}
              </td>
              <td data-label="Official page">
                <a className="text-link" href={entry.url} rel="noopener">
                  Open {entry.code}
                  <span className="sr-only"> on the official tariff</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </Panel>
  );
}

/** Searches both tariffs through /api/tools/hs-lookup; nothing is kept in the browser. */
export function HsCodeLookup() {
  const [query, setQuery] = useState('');
  const [problem, setProblem] = useState<string | undefined>();
  const [state, setState] = useState<State>({ kind: 'idle' });

  const search = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const checked = hsQuerySchema.safeParse(query);
    if (!checked.success) {
      setProblem(checked.error.issues[0]?.message ?? 'Check the search.');
      return;
    }
    setProblem(undefined);
    setState({ kind: 'loading' });
    try {
      const response = await fetch(
        `/api/tools/hs-lookup?q=${encodeURIComponent(checked.data)}`,
        { headers: { Accept: 'application/json' } },
      );
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          body && typeof body === 'object' && typeof (body as { error?: unknown }).error === 'string'
            ? (body as { error: string }).error
            : 'The lookup could not be completed.';
        setState({ kind: 'error', message });
        return;
      }
      if (!isAnswer(body)) {
        setState({ kind: 'error', message: 'The lookup returned something unexpected.' });
        return;
      }
      setState({ kind: 'done', answer: body });
    } catch {
      setState({
        kind: 'error',
        message: 'The lookup could not reach TradeDocs. Check your connection and try again.',
      });
    }
  };

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Panel title="Search the tariffs">
        <form onSubmit={search} noValidate role="search" aria-label="HS code lookup">
          <Field
            id="hs-query"
            label="Goods description or code"
            hint="A plain description such as copper wire or cotton t-shirts, or a code such as 7408 or 6109.10."
            error={problem}
          >
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                type="search"
                value={query}
                maxLength={HS_QUERY_MAX}
                autoComplete="off"
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => setQuery(event.target.value)}
              />
            )}
          </Field>
          <div className="cta-row">
            <Button type="submit" pending={state.kind === 'loading'} pendingLabel="Searching…">
              Search the US and UK tariffs
            </Button>
          </div>
        </form>
      </Panel>

      <div aria-live="polite">
        {state.kind === 'loading' ? (
          <LoadingBlock label="Searching the official tariffs" lines={4} />
        ) : null}
        {state.kind === 'error' ? (
          <ErrorState
            title="The lookup did not run"
            description={state.message}
            action={
              <a className="text-link" href={TARIFFS.uk.home} rel="noopener">
                Use the UK Trade Tariff directly
              </a>
            }
          />
        ) : null}
        {state.kind === 'done' ? (
          <div style={{ display: 'grid', gap: 24 }}>
            <Results id="us" outcome={state.answer.us} />
            <Results id="uk" outcome={state.answer.uk} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
