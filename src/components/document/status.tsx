import { Archive, CircleSlash, Clock, FileCheck2, FilePen, Layers, Stamp } from 'lucide-react';

/** The lifecycle DESIGN_SYSTEM.md requires the interface to distinguish. */
export const documentStates = [
  'draft',
  'stale',
  'final',
  'superseded',
  'voided',
  'archived',
  'endorsed',
] as const;

export type DocumentState = (typeof documentStates)[number];

const presentation: Record<DocumentState, { label: string; icon: typeof Stamp; meaning: string }> =
  {
    draft: { label: 'Draft', icon: FilePen, meaning: 'Being prepared. Not issued.' },
    stale: {
      label: 'Stale',
      icon: Clock,
      meaning: 'The shipment changed after this revision was rendered.',
    },
    final: {
      label: 'Final',
      icon: FileCheck2,
      meaning: 'Locked to a shipment revision and reproducible.',
    },
    superseded: {
      label: 'Superseded',
      icon: Layers,
      meaning: 'A later revision replaces this one.',
    },
    voided: {
      label: 'Voided',
      icon: CircleSlash,
      meaning: 'Withdrawn. Retained for the audit trail.',
    },
    archived: { label: 'Archived', icon: Archive, meaning: 'Closed and kept for retention.' },
    endorsed: {
      label: 'Endorsed',
      icon: Stamp,
      meaning: 'Recorded as endorsed outside TradeDocs.',
    },
  };

/**
 * Status is carried by a word, a glyph and a border treatment together, so it
 * survives greyscale printing and colour-vision differences. Never render the
 * state as colour alone.
 */
export function DocumentStatus({ state, describe }: { state: DocumentState; describe?: boolean }) {
  const { label, icon: Icon, meaning } = presentation[state];
  return (
    <span className={`status ${state}`} title={describe ? undefined : meaning}>
      <Icon size={13} aria-hidden="true" />
      {label}
      {describe ? <span className="sr-only">. {meaning}</span> : null}
    </span>
  );
}

export function stateMeaning(state: DocumentState): string {
  return presentation[state].meaning;
}
