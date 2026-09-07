import {
  Archive,
  CircleSlash,
  ClipboardCheck,
  Clock,
  FileCheck2,
  FilePen,
  Layers,
  Stamp,
  Truck,
} from 'lucide-react';

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

type Presentation = { label: string; icon: typeof Stamp; meaning: string };

const presentation: Record<DocumentState, Presentation> = {
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

/** The shipment lifecycle the trade schema allows. */
export const shipmentStates = ['draft', 'confirmed', 'shipped', 'closed'] as const;

export type ShipmentState = (typeof shipmentStates)[number];

const shipmentPresentation: Record<ShipmentState, Presentation> = {
  draft: { label: 'Draft', icon: FilePen, meaning: 'Still being assembled. Figures may move.' },
  confirmed: {
    label: 'Confirmed',
    icon: ClipboardCheck,
    meaning: 'Agreed with the buyer and ready to document.',
  },
  shipped: {
    label: 'Shipped',
    icon: Truck,
    meaning: 'The goods have left. Its documents are in circulation.',
  },
  closed: { label: 'Closed', icon: Archive, meaning: 'Complete and kept for retention.' },
};

/**
 * Status is carried by a word, a glyph and a border treatment together, so it
 * survives greyscale printing and colour-vision differences. Never render the
 * state as colour alone.
 *
 * The meaning rides along in two forms: a `title` a pointer user can reveal, and
 * text only assistive technology reads. `title` alone reaches neither a keyboard
 * nor a touch screen, so it is never the only copy of it.
 */
function Stamped({ state, presented }: { state: string; presented: Presentation }) {
  const { label, icon: Icon, meaning } = presented;
  return (
    <span className={`status ${state}`} title={meaning}>
      <Icon size={13} aria-hidden="true" />
      {label}
      <span className="sr-only">. {meaning}</span>
    </span>
  );
}

export function DocumentStatus({ state }: { state: DocumentState }) {
  return <Stamped state={state} presented={presentation[state]} />;
}

/**
 * Takes the raw column value: a shipment read straight from the table is typed as
 * `string`, and an unrecognised state must still say something honest rather than
 * be silently drawn as a draft.
 */
export function ShipmentStatus({ state }: { state: string }) {
  const presented = shipmentPresentation[state as ShipmentState];
  if (!presented) {
    return (
      <Stamped
        state="unknown"
        presented={{ label: state, icon: Clock, meaning: 'Unrecognised state.' }}
      />
    );
  }
  return <Stamped state={state} presented={presented} />;
}

export function stateMeaning(state: DocumentState): string {
  return presentation[state].meaning;
}
