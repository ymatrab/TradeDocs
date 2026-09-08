import { Callout } from '@/components/primitives/feedback';
import { showsSummary } from '@/lib/form-errors';

/**
 * The outcome of one server action, announced.
 *
 * Every action on a screen reports through its own copy of this, so a failure in one
 * panel is never masked by a success in another — and a rejection that a field already
 * carries word for word is not repeated here.
 */
export function ActionResult({
  state,
  successTitle = 'Done',
}: {
  state: { error?: string; notice?: string; fields?: Record<string, string> };
  successTitle?: string;
}) {
  if (showsSummary(state)) {
    return (
      <Callout tone="danger" title="That did not work" live>
        {state.error}
      </Callout>
    );
  }
  if (state.notice) {
    return (
      <Callout tone="success" title={successTitle} live>
        {state.notice}
      </Callout>
    );
  }
  return null;
}
