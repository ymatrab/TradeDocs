'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/primitives/button';
import { Callout, EmptyState, ErrorState, LoadingBlock, Panel } from '@/components/primitives/feedback';
import { Choice, Field, Input } from '@/components/primitives/form';
import { DataTable } from '@/components/primitives/table';
import {
  CSL_OFFICIAL_SEARCH,
  SCREENING_NAME_MAX,
  screeningRequestSchema,
  type ScreeningAnswer,
} from '@/lib/screening/csl';

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'done'; name: string; answer: ScreeningAnswer };

function isAnswer(value: unknown): value is ScreeningAnswer {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as { total?: unknown }).total === 'number' &&
    Array.isArray((value as { results?: unknown }).results)
  );
}

const OFFICIAL = (
  <a className="text-link" href={CSL_OFFICIAL_SEARCH} rel="noopener">
    Use the official CSL search on trade.gov
  </a>
);

/**
 * One name at a time through /api/tools/denied-party. The name lives only in this
 * component's state; it is cleared from nothing because it was never put anywhere else.
 */
export function DeniedPartyScreening() {
  const [name, setName] = useState('');
  const [fuzzy, setFuzzy] = useState(true);
  const [problem, setProblem] = useState<string | undefined>();
  const [state, setState] = useState<State>({ kind: 'idle' });

  const search = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const checked = screeningRequestSchema.safeParse({ name, fuzzy });
    if (!checked.success) {
      setProblem(checked.error.issues[0]?.message ?? 'Check the name.');
      return;
    }
    setProblem(undefined);
    setState({ kind: 'loading' });
    try {
      const response = await fetch('/api/tools/denied-party', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(checked.data),
      });
      const body: unknown = await response.json().catch(() => null);
      if (!response.ok || !isAnswer(body)) {
        const message =
          body && typeof body === 'object' && typeof (body as { error?: unknown }).error === 'string'
            ? (body as { error: string }).error
            : 'The screening could not be completed.';
        setState({ kind: 'error', message });
        return;
      }
      setState({ kind: 'done', name: checked.data.name, answer: body });
    } catch {
      setState({
        kind: 'error',
        message: 'The screening could not reach TradeDocs. Check your connection and try again.',
      });
    }
  };

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <Panel title="Screen a name">
        <form onSubmit={search} noValidate role="search" aria-label="Denied party screening">
          <Field
            id="screening-name"
            label="Company or person name"
            hint="One party at a time: the buyer, consignee, end user or agent, as it appears on the order."
            error={problem}
          >
            {({ id, describedBy, invalid }) => (
              <Input
                id={id}
                type="search"
                value={name}
                maxLength={SCREENING_NAME_MAX}
                autoComplete="off"
                invalid={invalid}
                aria-describedby={describedBy}
                onChange={(event) => setName(event.target.value)}
              />
            )}
          </Field>
          <Choice
            id="screening-fuzzy"
            label="Include close spellings (fuzzy name search)"
            hint="Recommended: names transliterated into English are spelled many ways."
            checked={fuzzy}
            onChange={(event) => setFuzzy(event.target.checked)}
          />
          <div className="cta-row">
            <Button type="submit" pending={state.kind === 'loading'} pendingLabel="Screening…">
              Screen against the CSL
            </Button>
          </div>
        </form>
      </Panel>

      <div aria-live="polite">
        {state.kind === 'loading' ? (
          <LoadingBlock label="Searching the Consolidated Screening List" lines={3} />
        ) : null}
        {state.kind === 'error' ? (
          <ErrorState title="The screening did not run" description={state.message} action={OFFICIAL} />
        ) : null}
        {state.kind === 'done' && state.answer.results.length === 0 ? (
          <Panel title="No match on the Consolidated Screening List">
            <EmptyState
              title={`No listing matched “${state.name}”`}
              description="This is not a clearance. Try other spellings and the party’s former or trading names, and remember licensing, end-use and other countries’ lists still apply."
              action={OFFICIAL}
            />
          </Panel>
        ) : null}
        {state.kind === 'done' && state.answer.results.length > 0 ? (
          <Panel title="Possible matches on the Consolidated Screening List">
            <Callout tone="warning" title="A possible match is not a finding" level={3}>
              Compare the address, country and other details with the listing and check the
              source list before you decide anything. If the match may be real, stop and take
              advice from your compliance team or a trade lawyer.
            </Callout>
            <p className="muted">
              {state.answer.total > state.answer.results.length
                ? `Showing ${state.answer.results.length} of ${state.answer.total} listings. `
                : `${state.answer.results.length} ${state.answer.results.length === 1 ? 'listing' : 'listings'}. `}
              {OFFICIAL} for the full record of each one.
            </p>
            <DataTable caption="Possible matches" stack>
              <thead>
                <tr>
                  <th scope="col">Listed name</th>
                  <th scope="col">List</th>
                  <th scope="col">Country</th>
                  <th scope="col">Source</th>
                </tr>
              </thead>
              <tbody>
                {state.answer.results.map((hit, index) => (
                  <tr key={`${hit.source}-${hit.name}-${index}`}>
                    <td data-label="Listed name">
                      {hit.name}
                      {hit.altNames.length > 0 ? (
                        <span className="muted"> · also {hit.altNames.join('; ')}</span>
                      ) : null}
                    </td>
                    <td data-label="List">{hit.source}</td>
                    <td data-label="Country">{hit.country ?? '—'}</td>
                    <td data-label="Source">
                      {hit.sourceUrl ? (
                        <a className="text-link" href={hit.sourceUrl} rel="noopener">
                          Source list
                          <span className="sr-only"> for {hit.name}</span>
                        </a>
                      ) : (
                        <span className="muted">See the official search</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </Panel>
        ) : null}
      </div>
    </div>
  );
}
