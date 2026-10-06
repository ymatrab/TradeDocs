# Design system

Status: implemented by Task 03; tokens and public components replaced by the "Manifest" redesign (D-005); type, spacing, motion and finish refined by design v2 (D-013, palette unchanged). Shipped token values and their measured contrast ratios are recorded below; component variants and states are demonstrated at `/design-system`, which returns 404 in production.

Proposed owner: Design/Accessibility Lead; named assignment pending. Review on token/component/interaction changes, new document family or template, localization requirements and each visual baseline update; quarterly accessibility regression. Last reviewed: 2026-10-06.

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
| `--muted`           | `#5a6762` | Captions, hints, units, absent values               | paper 5.24 · surface 5.91 · sunken 4.83              |
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
it and the tape button its text, so foreground uses on hull take `inherit`.

A light ground placed on hull (a card in the status band, the hero product frame) restores the
light values **by name** — `--paper-muted`, `--paper-link`, `--paper-rule`, which `:root` defines
and `--muted`, `--link`, `--focus` and `--rule` resolve to. Restating hex values, or forgetting a
child, is how the v1 hero shipped a white plate whose label inherited `--hull-muted`: #b6c9c3 on
#fff, 1.73:1, the CI axe failure fixed in v2.

### Typography (v2)

Three faces, self-hosted at build time by `next/font` (`display: swap`, metric-adjusted
fallback), each loaded as its variable font:

- **Inter Tight 500/600**, negative tracking: headlines. It is Inter's own skeleton drawn
  tighter, so headline and body read as one family. Uppercase only for headlines of six words
  or fewer ("Same numbers, every page", "Free while early", the closing line, tool titles);
  longer headlines — including the nine-word home headline — stay sentence case.
- **Inter 400/500**: running text, sentence case, 68ch measure.
- **Geist Mono 500**, uppercase, `.08em` tracking: eyebrows, tags, plates, figures, totals,
  table heads and every public button label. Narrower than the JetBrains Mono it replaced.
  Numeric contexts set `tabular-nums`. PDFs embed their own font and are unaffected.

| Role                           | Face / weight                        | Desktop → mobile | Line height | Tracking | Token            |
| ------------------------------ | ------------------------------------ | ---------------- | ----------- | -------- | ---------------- |
| Display (home headline, close) | Inter Tight 600                      | 72 → 44          | 0.94        | −0.025em | `--type-display` |
| H2                             | Inter Tight 600 upper / 500 sentence | 48 → 32          | 1.0         | −0.02em  | `--type-h2`      |
| H3                             | Inter Tight 500                      | 24 → 20          | 1.15        | −0.01em  | `--type-h3`      |
| Body                           | Inter 400                            | 17 → 16          | 1.55        | 0        | —                |
| Eyebrow / tag / button         | Geist Mono 500 upper                 | 12 (button 14)   | 1.4         | +0.08em  | `--caption`      |
| Numerals (stat, bench marks)   | Inter Tight 600 `tnum`               | 96 → 56          | 0.9         | −0.03em  | `--type-numeral` |

`text-wrap: balance` on every h1/h2. Inputs are 16px so iOS never zooms. The workspace keeps a
smaller sentence-case scale: topbar title 20px/600 (17px below 900px) under a mono section
caption; panel titles are mono captions in `--ink`.

### Spacing (v2)

- **Section rhythm**: one value, `--section-space: clamp(72px, 10vw, 140px)`, top and bottom of
  every public section; two paper sections in a row share one gap.
- **Card padding**: one value, `--card-pad: clamp(20px, 2.2vw, 28px)`, for cards, form cells,
  bench columns, the record card and the hero frame.
- **Hero**: `clamp(32px, 4.5vw, 64px)` above and `clamp(56px, 7vw, 96px)` below, so header,
  headline, offer and product frame fit a 1280 × 800 window.
- **Gutters**: `--gutter` 24px, 16px below 900px; checked at 360px.
- **Workspace**: `.app-page` is the one page column (gap 24, max 960px; `.wide` 1080px); panel
  bodies pad 24 (16 below 640px) and a table that is a panel's only child runs to its edges.

### Components

- **Header**: a floating white card, square, 1px `--rule`, 12px from the top, 1180px max,
  sticky on desktop. The boundary statement is its first line (mono 12px), so it can never be
  scrolled past or collapsed. Once the 1px sentinel above it has scrolled away the row condenses
  from 64 to 52px under a deeper shadow; the boundary line never condenses. Below 900px:
  wordmark, one short offer and the menu; the card scrolls with the page rather than covering a
  third of a phone. Navigation: Free tools · Guides · Blog · Pricing · Sign in, then the offer.
  The phone menu adds Help and Contact. "Free while early" stays in the footer (`/#status`)
  and in the status band, because there are still no prices.
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
- **Stat**: an Inter Tight numeral and one mono line, derived from the same list the page
  renders (document types, free tools), never typed. The visible numeral is a CSS counter; the
  number assistive technology reads is real text beside it.
- **Product frame** (hero): a white frame, 1px `--ink` border, flat 8px tape offset. An example
  record in field boxes (the workspace's own captions, no box numbers because the PDFs print
  none) and a rail of the four document plates. The total quantity is marked in the record and
  on every plate. Labelled "Example shipment" wherever it is drawn.
- **Record flow**: a hull record card pinned left (`position: sticky`), four document cards
  right, each marking the same total. Below 900px a horizontal snap row in a focusable region.
- **Tool bench**: one ruled band, `--ink` rules between columns and 12-column hairlines behind;
  per tool a large mark (CBM, KG, INCO, INV), the tool's name as a link, one live field worked
  out by the tool's own domain function, and one primary action below the band.
- **Workspace header and states**: every page title sits under a mono section caption. Every
  empty state carries the three-plate mark and a next action (create, open shipments, clear the
  search, back to the active list).
- **Fields**: 48px, white, 1.5px `--control`, square; label 14px/500 above; hint `--muted`;
  error `--danger` text plus icon, associated by `aria-describedby`.
- **Footer**: hull, four columns → two → one: the boundary statement repeated verbatim with the
  not-advice line and the primary offer (tape button), then Product, Free tools and Resources
  (Guides, Blog, Help, Contact). The base row carries Privacy, Terms and Cookies.
- **Section photo** (`SectionPhoto`): see "Photos" below.
- **Checklist**: a white ruled list, one row per document: icon (check = prepares, clock = not
  yet, minus = outside TradeDocs), name and purpose, who usually produces it, TradeDocs status.
  Four columns collapse to icon + stacked text below 760px. Always followed by the not-advice
  note.
- **CTA band**: a full-bleed hull section halfway down the homepage, photo on a flat 8px tape
  offset, tape primary button plus one secondary. One per page.
- **Workspace**: the same tokens and fonts on a paper canvas with white square panels; hull
  sidebar with a tape rule on the current row. No tape marker, stack or pixel motion there.

### The product frame (formerly the stack)

v1 drew the documents edge-on, offset like containers. v2 replaces that with the product's own
parts: the record as field boxes and the documents as plates beneath it. The only figure shared
across them is still the total quantity, because it is the one total all four documents print —
a delivery note carries no weight and the PDFs have no numbered boxes. The certificate of origin
is absent from the frame, the record flow and every count until its legal review completes.

### Motion (v2)

All CSS, behind one hook (`useInView` in `src/components/shell/reveal.tsx`), which writes
`data-reveal="pending"` on a section only when it starts below the fold and `"in"` once it is
seen; without script nothing is ever hidden. Everything sits inside
`prefers-reduced-motion: no-preference`, and the global reduced-motion rule removes every
animation and transition, so **reduced motion shows every element in its final state**.
Scroll-driven rules sit inside `@supports (animation-timeline: view())` as well.

**Text opacity and colour never animate.** CI's axe pass samples the page mid-animation, so
text is either drawn at full contrast in every frame or hidden by a transform outside a mask.
Only `translate`, `scale`, `clip-path` and `background-size` move.

Easings: enter `cubic-bezier(.16,1,.3,1)` (`--ease-enter`), state `cubic-bezier(.2,0,0,1)`
(`--ease-state`), scroll linear.

| #   | Motion            | What moves                                                                                                                                                                                                                                       | Trigger                                       | Fallback / reduced motion                                                                 |
| --- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1   | Line rise         | Each headline line (`<Line>`, `components/shell/line.tsx`) rises `translate 110% → 0` inside an `overflow: hidden` mask, 720ms enter, 80ms stagger. A marked word rises inside its line's mask, so on hull its ink never shows without the tape. | Hero on load; sections on reveal              | Reduced: lines in place. Above-the-fold sections are never armed.                         |
| 2   | Stacked documents | Record-flow cards are sticky; each settles `scale .94, translate −12px` as the next card enters, driven by that card's named view timeline (`timeline-scope` on the list).                                                                       | Scroll, ≥901px                                | No scroll timelines or reduced: a static list, not sticky. Phones: snap row.              |
| 3   | Marker sweep      | `background-size 0 → 100%`, 520ms enter after 240ms. In the hero frame the record total and four plates sweep in turn on load.                                                                                                                   | Reveal (paper grounds); load (frame)          | Never on hull (`.dark`, `.on-hull`), where the ink depends on the tape. Reduced: painted. |
| 4   | Header condense   | `.nav-row` 64 → 52px, deeper shadow, 240ms state.                                                                                                                                                                                                | 1px sentinel leaves view (`nav-condense.tsx`) | No IntersectionObserver: full height. Mobile header is not sticky and never condenses.    |
| 5   | Count-up          | `@property --n` counter runs 0 → value, 900ms enter.                                                                                                                                                                                             | Reveal                                        | Without `@property`: the final value. Real number is sr-only text.                        |
| 6   | Pixel dissolve    | 16 paper squares at the top of the status band scale `1 → 0`, each column offset in a scattered order.                                                                                                                                           | Scroll (`view()`, entry range)                | No scroll timelines: drops away on reveal (IO). Reduced: absent.                          |
| 7   | Hero frame drift  | The frame lifts `0 → −24px` as the hero exits.                                                                                                                                                                                                   | Scroll (`view()`, exit range)                 | None.                                                                                     |
| 8   | Press             | `:active` adds `scale(.985)` to every button and linked card, 120ms, on top of the public lift.                                                                                                                                                  | Pointer / key press                           | Reduced: no transition, state still shown.                                                |

Retained alongside the eight: the card wipe (`clip-path inset(0 0 100% 0) → 0`, 520ms, 70ms
stagger, on reveal), the hero plates landing on load (`translate 16px → 0` with a clip wipe,
70ms stagger), and in the workspace a 200–240ms rise on dialogs, menus and disclosures. The
workspace has no marker, line rise or scroll motion.

### Photos (D-016, homepage from 2026-10-06)

- **Source**: Unsplash only, hotlinked from images.unsplash.com through a plain `<img>` (never
  re-hosted, never `next/image`), resized and cropped by Unsplash's imgix parameters. Track the
  download once per photo when it is chosen; reuse an already tracked photo before adding one.
- **Credit**: every photo carries "Photo by {name} on Unsplash" as plain text under it, both
  links with `utm_source=paydocs&utm_medium=referral` (`unsplashReferral`). The credit is never
  hidden, clipped or faded.
- **Role**: photos support a section; they never replace the product. The homepage hero is the
  product frame and stays photo-free. At most one photo per section, beside the heading on
  desktop and below it on a phone. Subjects are the real places the paperwork goes: a desk, a
  warehouse, a port, a delivery. No people posed as customers, no logos, nothing that implies an
  endorsement or a carrier/authority relationship.
- **Markup**: `CoverFigure` (2:1, eager, one per page top) for article covers; `SectionPhoto`
  (4:3 or 3:2, always lazy) for supporting photos. Both set explicit `width`/`height` and a
  cropped `srcset`, so nothing shifts. Alt text says what the photo shows in the page's terms.
- **Frame**: square, 1px `--rule` on paper; on hull no border and a flat 8px `--tape` offset.
- **Motion**: on reveal the frame uncovers left to right (`clip-path`, 760ms enter) while the
  image settles from `scale 1.08`. Only `clip-path` and `scale` move; reduced motion and no
  script show the photo in place.
- **Data**: photo records live in `src/lib/content/home.ts` (homepage) and
  `src/lib/content/guides.ts` (guides); the sitemap lists each page's photos as image entries.

### The public column

`--shell-max` (`1180px`) and `--gutter` (`24px`, `16px` below 900 px) are the only two values that
decide where public content starts. The header card, the footer, `.public-main`, every `.section`
and the hero resolve their side padding from them, so a heading lines up with the wordmark above it
at any viewport. A section computes its own inline padding
(`max(--gutter, (100% - --shell-max) / 2 + --gutter)`), which keeps a full-bleed background while
centring the content inside it. Two paper sections in a row share one gap. Sections carrying an
`id` reserve `8rem` of `scroll-margin-block-start`, because the header they scroll under is sticky.
The public wrapper clips horizontal overflow (`overflow-x: clip`, which keeps sticky working), so
the hero frame's offset shadow can never scroll a phone sideways.

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

## Workspace patterns

The signed-in journey of a first-time exporter, in the order they meet it. Styles live in the
"Workspace patterns (product UX)" block of `globals.css`; only transforms move, nothing fades.

- **Setup checklist** (`Checklist`, `components/primitives/checklist.tsx`): an ordered list on
  the overview — your company, a customer, a product, the first shipment. Each step is ticked
  from the data, never from a dismissed flag, and the whole panel disappears once every step is
  done. The first step not done is the only primary button; done is a word ("Done") and a glyph
  as well as `--success`, and the count ("2 of 4 done") is text beside a native `<progress>`.
  No sample data until it can be created, labelled and deleted as such.
- **Quick actions**: one row of compact buttons under the checklist — the primary is the next
  thing a working exporter does (New shipment); the rest are secondary.
- **Needs attention**: stale documents are listed by number with the revision they were rendered
  from and a link to their shipment's documents panel. Nothing else on the overview asks for a
  decision, so nothing else is listed there.
- **Breadcrumb**: a page that is one record of many passes `parent` to `AppShell`; the mono caption
  above the title becomes "← Shipments" (a link in a `Breadcrumb` nav) instead of a repeat of the
  section name. In-page "← Back" links are retired.
- **Shipment builder**: steps across the top (Parties and terms, Goods, Packing, Documents), each a
  link to its panel with a state word and glyph: Done (`--success` top rule), To do, Check
  (`--caution`, a mismatch or stale documents) and Optional (dashed rule; packing is never shown
  as a gap). The summary — lines, quantity, net and gross kg, CBM, packages, total value — is the
  same arithmetic as the panels (`figures.ts`), sticky in a 272px column from 1280px and a grid
  above the panels below that. Gross weight and volume read "—" until a package is described.
- **Line entry**: Enter in any field adds the line; after a success the cursor returns to the
  description (one-off) or the catalog search, and choosing a catalog product moves it to the
  quantity. A catalog choice lapses once that product is on the shipment.
- **Outcome toasts** (`useOutcomeToast`): a success names what changed ("“Enamel sign” is on the
  shipment: 100 pcs."), composed from what was submitted. The inline result callout remains the
  announced record, so the toast is drawn silently (`notify(…, { silent: true })`) and at most
  three show at once. Failures stay inline, next to the field or inside the confirmation.
- **Document row actions**: the primary per state — Regenerate (accent) on a stale document whose
  kind has no current copy, PDF on every row (secondary when final, quiet otherwise), the set
  download only when it has a current document to bundle. A stale row says which revision it
  came from and which the shipment is at. A preview frame waits until the PDF route can serve
  inline.
- **Filter chips**: links in a labelled `nav`, 44px high; the current one is drawn pressed (ink
  ground, white, 600) and carries `aria-current`. Every filter keeps the others in the URL.
- **List search**: a GET form (`role="search"`) so a search is shareable and works before script.
- **Import preview**: rows as the browser reads them (same parser as the import), up to 50, with a
  Check column; a figure that is not a number is flagged early, and the import's own row problems
  are marked on the same rows (`--danger` inset rule, icon and text). Problems beyond the preview
  are still listed below it.
- **Stacked tables** (`DataTable stack`): below 640px every row becomes a card — its
  `stack-title` cell first, `stack-actions` beside it, every other cell captioned by its
  `data-label` (mono caption left, value right). Column heads stay in the accessibility tree.
  Used for goods, packages, documents, shipments, products and companies; wide reference tables
  keep the horizontal scroll.

