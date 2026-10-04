# Design system

Status: implemented by Task 03; tokens and public components replaced by the "Manifest" redesign (D-005). Shipped token values and their measured contrast ratios are recorded below; component variants and states are demonstrated at `/design-system`, which returns 404 in production.

Proposed owner: Design/Accessibility Lead; named assignment pending. Review on token/component/interaction changes, new document family or template, localization requirements and each visual baseline update; quarterly accessibility regression. Last reviewed: 2026-10-04.

## Product character

Create a precise, calm workspace that makes shipment state, document consistency and next actions easy to understand. Use original typography/layout/assets, generous readable spacing and clear information hierarchy. Avoid copying competitor assets. Distinguish draft, stale, final, superseded, voided, archived and externally endorsed status with text and iconography, never color alone. Always show the underlying legal meaning of constrained preparation outputs.

## Foundation decisions

Use Tailwind with semantic CSS tokens for canvas/surface/text/muted/border/accent/danger/success/focus, spacing, typography, radius and elevation. The implementation must document actual values and contrast checks; this document does not invent tokens absent from code. Prefer an accessible component foundation with native semantic controls and explicit labels. Pin font assets/metrics or use an appropriate system stack to avoid layout shift. Standardize table density, numeric alignment, units, empty values and validation messages.

Task 03 must implement and document buttons, links, fields, select/combobox, checkbox/radio, tables, dialogs, menus, tabs, toasts, skeletons, status/disclosure components and loading/empty/error/success states. Supply public header/footer/mobile navigation, authenticated sidebar/topbar, command/search pattern and print styles. Restrict the component showcase outside production or protect it.

## Interaction and responsive requirements

Target WCAG 2.2 AA: semantic heading order, named fields, associated errors, visible focus, keyboard-only operation, announced asynchronous results, contrast, zoom/reflow and reduced motion. Dialog focus returns to the invoker and cannot become unintentionally trapped. Preserve user inputs through recoverable errors; conflict resolution must show competing revisions rather than overwrite silently. Document actions show specific progress and safe retry affordances.

Verify at 360 px mobile, tablet and large desktop; test current and previous major Chrome, Safari, Firefox and Edge. Stress long multilingual descriptions, international addresses, currencies and labels. Responsive tables preserve access to all data without hiding legal status. Avoid layout shift from fonts/icons and ensure adequate touch targets. Print hides navigation and retains document identity, units, totals and mandatory disclosures.

## Visual acceptance

Task 03 captures visual snapshots for core states at three viewports, automated axe checks and keyboard E2E, followed by actual visual inspection. Task 18 adds all document types at 1/3/10 pages, Unicode/logo/long-table cases, repeated headers, no clipping/orphan totals and non-removable legal labels. Review every changed baseline; do not approve image diffs merely because tests pass. Provide accessible document alternatives where feasible and record limitations accurately.

## Shipped tokens — "Manifest" (v2)

Defined in `src/app/globals.css`; direction recorded in DECISIONS.md D-005. The concept: one
shipment, stencilled onto every paper. A deep hull-green ground, a warm manifest paper, and a
strip of safety-yellow **tape** painted behind the one or two words that matter. Every ratio
below was measured with the WCAG 2.x relative-luminance formula. Text tokens meet AA (4.5:1);
the focus ring and control border are non-text and meet 3:1.

| Token               | Value     | Role                                                | Measured pair → ratio                                |
| ------------------- | --------- | --------------------------------------------------- | ---------------------------------------------------- |
| `--paper`           | `#f4f1ea` | Public and workspace canvas                         | —                                                    |
| `--surface`         | `#ffffff` | Cards, panels, inputs                               | —                                                    |
| `--surface-sunken`  | `#ece8de` | Table heads, tags, sunken sections                  | `--ink` 13.43 · `--muted` 4.83                       |
| `--surface-pressed` | `#e6e2d8` | Pressed light controls                              | `--ink` 12.70 · `--muted` 4.57                       |
| `--ink`             | `#14221f` | Text, primary button ground                         | paper 14.56 · surface 16.43                          |
| `--ink-raised`      | `#243a35` | Primary button hover (workspace)                    | white 12.13                                          |
| `--ink-pressed`     | `#0a1311` | Primary button pressed                              | white 18.85                                          |
| `--muted`           | `#5a6762` | Captions, hints, units, absent values               | paper 5.24 · surface 5.91                            |
| `--hull`            | `#143d3a` | Reversed ground: hero, status band, footer, sidebar | white 11.94                                          |
| `--hull-raised`     | `#1d524d` | Blocks on hull, active sidebar row                  | white 8.87 · `--hull-muted` 5.13                     |
| `--hull-pressed`    | `#0f302d` | Pressed sidebar row                                 | white 14.18 · `--hull-muted` 8.19                    |
| `--hull-muted`      | `#b6c9c3` | Secondary text on hull                              | hull 6.90                                            |
| `--hull-link`       | `#9fd6c9` | Links on hull                                       | hull 7.36 · hull-raised 5.47                         |
| `--tape`            | `#f6c945` | Marker strip, tape button, hero block               | `--ink` on tape 10.45 · tape on hull (non-text) 7.60 |
| `--tape-pressed`    | `#e5b52c` | Pressed tape button                                 | `--ink` 8.59                                         |
| `--signal`          | `#c2410c` | Document identity, legal callout rule               | paper 4.59 · white on it 5.18                        |
| `--signal-deep`     | `#9a3412` | Stamp, endorsed status, accent hover                | sunken 5.97 · white on it 7.31                       |
| `--link`            | `#0b6b5c` | Inline links                                        | paper 5.69 · surface 6.42                            |
| `--focus`           | `#0b6b5c` | Focus ring (2px, 3px offset); `--tape` on hull      | paper 5.69 · tape on hull 7.60                       |
| `--control`         | `#76847f` | Input, select and search borders (1.5px)            | paper 3.46 · surface 3.91 (non-text)                 |
| `--rule`            | `#d9d6cc` | Decorative separators and box grid lines            | paper 1.29 — never the sole carrier of meaning       |
| `--danger`          | `#a62424` | Errors, void, destructive actions                   | paper 6.42 · surface 7.24                            |
| `--success`         | `#1f6b45` | Final state, included items                         | paper 5.73 · surface 6.47                            |
| `--caution`         | `#8a5a00` | Stale state, not-yet items                          | paper 5.25 · surface 5.93                            |

Rules that the tokens alone cannot enforce:

- **Tape is never text**, and the only thing it ever grounds is `--ink`. On hull the strip
  covers the full line box, because ink on bare hull is 1.2:1 and the strip has to carry it
  alone; on paper it is a band through the lower part of the words.
- `--signal` is used as text only at 16px and up; smaller identity marks use `--signal-deep`.
- Status is always a word plus a glyph plus a border treatment, never colour alone.
- Depth is a flat offset (`4px 4px 0 --ink` on hover, `6px 6px 0` at 18% for floating
  menus and dialogs), the way a stacked container sits on the one below it. Radius is 0
  everywhere except the 2px corner on status stamps.

A reversed section (`.hero`, `.section.dark`, `.public-footer`) redefines `--muted`, `--link`,
`--focus` and `--rule` rather than patching selectors, so anything placed on hull inherits
legible values. `--ink` is deliberately not redefined: the primary button draws its ground from
it and the tape button its text, so foreground uses on hull take `inherit`. A white card placed
on hull restores the light values it was measured against.

### Typography

Three faces, self-hosted at build time by `next/font` with `font-display: swap`:

- **Archivo 600**, `letter-spacing: .01em`: headlines. Uppercase only for headlines of six
  words or fewer (the hero, "Same numbers, every page", "Free while early", the closing line);
  longer H2s stay sentence case.
- **Inter 400/500**: running text, sentence case, 68ch measure.
- **JetBrains Mono 500**, uppercase, `.08em` tracking: eyebrows, tags, plates, figures, totals,
  table heads and every public button label. Numeric contexts set `tabular-nums`.

Scale, desktop → 375px: hero display 64 → 40 (line-height .98) · H2 40 → 30 · H3 24 → 20 ·
body 17 → 16 · small 14 · mono label 12 · stat numeral 72 → 48. Inputs are 16px so iOS never
zooms. The workspace keeps the smaller sentence-case scale (H1 48 → 32, H2 32 → 24) and Inter
button labels.

### Components

- **Header**: a floating white card, square, 1px `--rule`, 12px from the top, 1180px max,
  sticky on desktop. The boundary statement is its first line (mono 12px), so it can never be
  scrolled past or collapsed. Below 900px: wordmark, one short offer and the menu; the card
  scrolls with the page rather than covering a third of a phone.
- **Primary offer**: follows `isDatabaseConfigured()`, the check the auth layout makes. With
  accounts open it is "Create a free account"; without them it is "Use the free invoice
  generator", and "No card required" is dropped.
- **Eyebrow**: mono 12px with a 6px filled square — `--hull` on paper, `--tape` on hull.
- **Marker** (`<mark class="tape">`): one per section, on one or two words.
- **Buttons** (public): square, 48px (52px large), mono label. Primary `--ink`/white; on hull
  the primary is `--tape`/`--ink`; secondary is a 1.5px `currentColor` outline. Hover lifts
  2px onto a flat offset shadow (ink on paper, white under tape on hull); `:active` drops back
  and takes the pressed token.
- **Cards**: white, square, 1px `--rule`, 24px pad, a mono tag top-left ("STEP 01",
  "TOOL · CBM", "TD · CI"); the offset ink shadow appears on hover only.
- **Stat**: a mono numeral and one line, derived from the same list the page renders (document
  types, free tools), never typed. The visible numeral is a CSS counter; the number assistive
  technology reads is real text beside it.
- **Fields**: 48px, white, 1.5px `--control`, square; label 14px/500 above; hint `--muted`;
  error `--danger` text plus icon, associated by `aria-describedby`.
- **Footer**: hull, four columns → two → one, the boundary statement repeated verbatim.
- **Workspace**: the same tokens and fonts on a paper canvas with white square panels; hull
  sidebar with a tape rule on the current row. No tape marker, stack or pixel motion there.

### The stack

The hero visual is the product's own grammar: one entry, then the documents it prepares seen
edge-on, offset like containers on a quay. Each block is a document name with a mono plate. The
only figure on the blocks is the total quantity, because it is the one total all four documents
print — a delivery note carries no weight, and the PDFs have no numbered boxes, so the earlier
"same weight at box 9 / 6 / 4" illustration was withdrawn as untrue. The certificate of origin
is absent from the stack and from every count until its legal review completes.

### Motion

Six motions, all CSS, all inside `prefers-reduced-motion: no-preference`; with reduced motion
every element renders in its final state. One hook, `useInView` in
`src/components/shell/reveal.tsx`, writes `data-reveal="pending"` on a section only when it
starts below the fold, and `"in"` once it is seen; without script nothing is ever hidden.
**Text opacity is never animated** — CI's axe pass samples mid-animation, and every frame of
every motion below keeps text at its full contrast.

1. Tape paint-in: `background-size 0 → 100%`, 480ms after a 200ms delay — on paper grounds
   only, because on hull the ink depends on the tape being there.
2. Container stack: hero blocks `translate 24px → 0` and `clip-path inset(0 100% 0 0) → 0`,
   70ms stagger, on load.
3. Block wipe: cards `clip-path inset(0 0 100% 0) → 0`, 520ms, 70ms stagger.
4. Pixel-grid uncover: a row of 16 paper squares at the top edge of the hull status band
   drops away in a scattered order, 20ms stagger. It carries no text and takes no pointer.
5. Button and card lift: `translate(-2px, -2px)` plus offset shadow, 120ms.
6. Numeral count-up via `@property --n` and `counter-reset`; without `@property` the counter
   shows the final value.

### The public column

`--shell-max` (`1180px`) and `--gutter` (`24px`, `16px` below 900 px) are the only two values that
decide where public content starts. The header card, the footer, `.public-main`, every `.section`
and the hero resolve their side padding from them, so a heading lines up with the wordmark above it
at any viewport. A section computes its own inline padding
(`max(--gutter, (100% - --shell-max) / 2 + --gutter)`), which keeps a full-bleed background while
centring the content inside it. Two paper sections in a row share one gap. Sections carrying an
`id` reserve `8rem` of `scroll-margin-block-start`, because the header they scroll under is sticky.
The public wrapper clips horizontal overflow (`overflow-x: clip`, which keeps sticky working), so
the stack's offsets can never scroll a phone sideways.

## Signature primitive: the field box

A bill of lading, a commercial invoice and a certificate of origin are all grids of numbered,
bordered boxes, each captioned in its corner. `BoxGrid` and `FieldBox` reproduce that grid, so the
screen a user fills in and the document they print share one structure and a field can be named by
its box number in either place. The same caption treatment labels tables, panels and shell
sections, which keeps one idea covering the whole product rather than three competing ones.

The public page no longer borrows the box grid for its own layout. It used to number its
sections like boxes and illustrate the hero with one weight "at box 9, 6 and 4"; the PDFs carry
no numbered boxes and a delivery note carries no weight, so that illustration was withdrawn and
the field box went back to being what it is — the workspace's record of a field. The closing
band keeps **the stamp**, "Prepared · not issued", in `--signal-deep` on the sunken ground
(5.97:1): a stamp is what an authority puts on a document, and TradeDocs is not one.

Status is the second product-specific primitive. Every state carries a word, a glyph and a border
treatment together, so it survives greyscale printing and colour-vision differences; no state is
ever expressed as colour alone. Two lifecycles use it: documents (draft, stale, final, superseded,
voided, archived, endorsed) and shipments (draft, confirmed, shipped, closed). A value the schema
has grown but the interface has not been taught renders as itself, marked unrecognised, rather than
being silently drawn as something it is not.

The meaning of a state travels in two forms — a `title` a pointer can reveal, and text only
assistive technology reads. `title` alone reaches neither a keyboard nor a touch screen, so it is
never the only copy.

## Navigation below the sidebar breakpoint

The authenticated sidebar is a wide-screen affordance, not the navigation itself. Under 900 px it is
replaced by a topbar disclosure carrying the same destinations, the account links and sign-out, so no
page of the workspace becomes unreachable on a phone. Both disclosures close on navigation, on
Escape — which returns focus to the control that opened them — and on a pointer landing outside.

A password can be read back before it is submitted. Twelve characters typed blind is where a
good share of failed sign-ins begin, and the recovery for a typo nobody can see is to clear the
field and start again. The reveal is never the default, sits inside the field's own border box so
the input keeps its width, and is named for what it will do rather than for the state it is in.

Destructive actions confirm before they act, and the confirmation stays open until the action has
actually succeeded: a rejected password or a refused removal keeps the user's input where they can
correct it, instead of dropping them onto a page-level message with nothing left to edit.
