# TradeDocs design v2 — palette, type, motion, layout

Ratios measured with the WCAG luminance formula (`scratchpad/wcag.py`). Text ≥4.5; non-text (`*`) ≥3. A marker's edge against the canvas is decorative (1.2–1.4, as the shipped tape) and not a 1.4.11 boundary. Status colours (`--danger`, `--success`, `--caution`) stay as measured.

## 1. Palettes

### A. Daylight — light-led (recommended)
Mood: a bright drafting table; the product is the hero, the dark ground is only a footer.

| Token | Hex | Pair → ratio |
|---|---|---|
| canvas | `#f1f3f2` | — |
| surface | `#ffffff` | — |
| ink | `#121517` | canvas 16.45 · surface 18.33 · on marker 13.73 · on accent-on-dark 12.05 |
| muted | `#5a6268` | canvas 5.57 · surface 6.21 |
| ground | `#232629` graphite | white 15.21 · ground-muted `#b8c0c4` 8.24 |
| marker | `#a8ecdf` aqua | ink 13.73 · on ground* 11.39 |
| accent-on-dark | `#7fe3d0` | ground 10.00 |
| link / focus | `#0c6775` petrol | canvas 5.87 · surface 6.54 · white on it 6.54 |
| control border | `#78838a` | canvas* 3.48 · surface* 3.88 |

Hero on canvas; dark only for the status band and footer. Eyebrow square: ink on canvas, marker on ground.

### B. Chart — cool/ink
Mood: a nautical chart; graphite, cobalt, sky — carrier and customs colours.

| Token | Hex | Pair → ratio |
|---|---|---|
| canvas | `#f4f6f8` | — |
| surface | `#ffffff` | — |
| ink | `#101418` | canvas 17.07 · surface 18.50 · on marker 12.29 · on accent-on-dark 10.69 |
| muted | `#55606c` | canvas 5.92 · surface 6.41 |
| ground | `#1c1f24` | white 16.52 · ground-muted `#b4bcc6` 8.62 |
| marker | `#a9d8ff` sky | ink 12.29 · on ground* 10.98 |
| accent-on-dark | `#8ecbff` | ground 9.55 |
| link / focus | `#1549c7` cobalt | canvas 6.90 · surface 7.47 · white on it 7.47 |
| control border | `#7a8591` | canvas* 3.47 · surface* 3.76 |

### C. Kiln — warm/clay
Mood: kraft paper and a wax seal; warm without amber.

| Token | Hex | Pair → ratio |
|---|---|---|
| canvas | `#f8f3ec` | — |
| surface | `#ffffff` | — |
| ink | `#1e1815` | canvas 15.90 · surface 17.55 · on marker 11.25 · on accent-on-dark 9.88 |
| muted | `#6a5d55` | canvas 5.75 · surface 6.34 |
| ground | `#2c1f1a` umber | white 15.93 · ground-muted `#cdb9ad` 8.45 |
| marker | `#ffc29e` apricot | ink 11.25 · on ground* 10.21 |
| accent-on-dark | `#ffb088` | ground 8.97 |
| link / focus | `#a3391a` oxblood | canvas 6.02 · surface 6.65 · white on it 6.65 |
| control border | `#8c7f76` | canvas* 3.51 · surface* 3.88 |

**Recommend A.** It alone changes the first impression the owner reacted to (reversed hero, warm accent); ink/graphite/petrol keeps aqua serious enough for freight and consultants. B is the safe second if aqua feels young; C is the most memorable but apricot on warm paper drifts back toward amber.

## 2. Typography

Gap vs Forest (Matter): Archivo 600 is wide and square with positive tracking, so uppercase reads stencilled and heavy; Matter is a tight neo-grotesque at medium weight with negative tracking. Fix: narrower skeleton, 500–600 not 600–800, tracking −2 to −3%, line-height under 1 only at display size.

- **Display: Inter Tight** 500/600 — Inter's skeleton, so headline and body are one family, already Matter-tight. Geist is the cooler alternative; Schibsted and Host carry too much personality; Funnel is condensed, display-only.
- **Body: Inter** 400/500, unchanged.
- **Mono: Geist Mono** 500 — narrower than JetBrains, better numerals than Plex.

| Role | Face / weight | Desktop / mobile | LH | Tracking |
|---|---|---|---|---|
| Display (uppercase, ≤6 words) | Inter Tight 600 | 72 / 44 | 0.94 | −0.025em |
| H2 | Inter Tight 600 upper, 500 sentence | 48 / 32 | 1.0 | −0.02em |
| H3 | Inter Tight 500 | 24 / 20 | 1.15 | −0.01em |
| Body | Inter 400 | 17 / 16 | 1.55 | 0 |
| Eyebrow / tag / button | Geist Mono 500 upper | 12 (button 14) | 1.4 | +0.08em |
| Numerals | Inter Tight 600 `tnum` | 96 / 56 | 0.9 | −0.03em |

`text-wrap: balance` on display and H2; `font-display: swap` with `adjustFontFallback`.

## 3. Motion (ranked)

Easings: **enter** `cubic-bezier(0.16,1,0.3,1)` 640–800ms; **state** `cubic-bezier(0.2,0,0,1)` 200–280ms; **scroll** linear. One hook, the existing `useInView`, sets `data-reveal`. Reduced motion: final state everywhere; `animation-timeline` rules sit inside `no-preference`. Text opacity and colour never animate.

1. **Line rise.** Each headline line in an `overflow:hidden` span; inner span `translateY(110%) → 0`, 720ms enter, 80ms stagger. On dark grounds the marked word rises inside the same mask, so ink never shows without its marker.
2. **Stacked documents on scroll.** Sticky cards; each scales `1 → .94`, moves `−12px` as the next covers it, `animation-timeline: view()`, `animation-range: exit 0% exit 100%`. `@supports not`: today's static stack.
3. **Marker sweep.** `background-size 0 → 100%`, 520ms enter after 240ms, light grounds only.
4. **Nav card condense.** 1px sentinel above the header; when it leaves, `.nav-row` 64 → 52px, deeper shadow, 240ms state. The boundary line stays.
5. **Count-up.** Keep `@property --n`; 900ms enter instead of `steps(12)`.
6. **Pixel dissolve, scroll-driven.** Squares scale `1 → 0` on `view()`, `animation-range: entry 0% entry 35%`, per-column delay; IO fallback.
7. **Hero frame drift.** `0 → −24px` on `view()`; none in fallback.
8. **Press.** Keep the lift; `:active` adds `scale(.985)` 120ms.

```css
.line{overflow:hidden}.line>span{display:block;translate:0 110%}
[data-reveal=in] .line>span{translate:0 0;transition:translate 720ms cubic-bezier(.16,1,.3,1) calc(var(--i)*80ms)}
@supports (animation-timeline:view()){.doc{animation:settle linear both;animation-timeline:view();animation-range:exit 0% exit 100%}}
@keyframes settle{to{scale:.94;translate:0 -12px}}
```

## 4. Layout upgrades

1. **Real product frame in the hero.** Replace the edge-on stack with a `BoxGrid` of six populated shipment fields on a surface frame, a mono rail beneath listing CI · PL · PI · DN; the quantity field and the four plates share one marker, so the tie is seen, not described.
2. **Pinned "one record → four documents".** Sticky record left; four `DocumentPreview` cards scroll and stack right (motion 2), each with the shared total marked. Mobile: horizontal snap scroller.
3. **Tool bench, not tool cards.** One ruled full-width band: four big numerals (CBM, KG, INCO, INV), a live one-field preview each, hairline rules exposing the 12-column grid, one primary action.
