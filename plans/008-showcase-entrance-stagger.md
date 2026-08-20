# 008 — /components page entrance + section stagger

- **Status**: DONE
- **Commit**: 9bae186
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens (group entrance)
- **Estimated scope**: 1 file (`ui/src/styles/ui.css`)
- **Depends on**: 002 (tokens)

## Problem

The `/components` style-guide page renders all 19 sections at once with no entrance. As the living showcase it is where the motion vocabulary is demonstrated — a gentle mount stagger makes the page feel designed, and the page is visited only occasionally (AUDIT §7: 30–80ms stagger on group entrances; decorative, never blocking).

Current (verbatim, `ui.css:946-949`):

```css
.comp-section {
  padding: 28px 0;
  border-top: 1px solid var(--border);
}
```

## Target

`ui.css` — extend `.comp-section` with a rise-in entrance and per-section delay. The `.comp-page` children are the `header.ui-page-header`, a `ul` (TrustBadges), then the `.comp-section` siblings — all `<section>`, so `:nth-of-type(n)` indexes them regardless of the non-section siblings:

```css
.comp-section {
  padding: 28px 0;
  border-top: 1px solid var(--border);
  animation: ui-rise-in var(--dur-panel) var(--ease-out) both;
}
.comp-section:nth-of-type(1)  { animation-delay: 0ms; }
.comp-section:nth-of-type(2)  { animation-delay: 60ms; }
.comp-section:nth-of-type(3)  { animation-delay: 120ms; }
.comp-section:nth-of-type(4)  { animation-delay: 180ms; }
.comp-section:nth-of-type(5)  { animation-delay: 240ms; }
.comp-section:nth-of-type(6)  { animation-delay: 300ms; }
.comp-section:nth-of-type(7)  { animation-delay: 360ms; }
.comp-section:nth-of-type(8)  { animation-delay: 420ms; }
.comp-section:nth-of-type(9)  { animation-delay: 480ms; }
.comp-section:nth-of-type(10) { animation-delay: 540ms; }
.comp-section:nth-of-type(11) { animation-delay: 600ms; }
.comp-section:nth-of-type(12) { animation-delay: 660ms; }
.comp-section:nth-of-type(13) { animation-delay: 720ms; }
.comp-section:nth-of-type(14) { animation-delay: 780ms; }
.comp-section:nth-of-type(15) { animation-delay: 840ms; }
.comp-section:nth-of-type(16) { animation-delay: 900ms; }
.comp-section:nth-of-type(17) { animation-delay: 960ms; }
.comp-section:nth-of-type(18) { animation-delay: 1020ms; }
.comp-section:nth-of-type(19) { animation-delay: 1080ms; }
```

Give the page header the same rise at delay 0, and a reduced-motion override:

```css
.comp-page .ui-page-header {
  animation: ui-rise-in 0.3s var(--ease-out) both;
}
@media (prefers-reduced-motion: reduce) {
  .comp-page .ui-page-header,
  .comp-section {
    animation: none;
  }
}
```

(`ui-rise-in` keyframes come from plan 002.)

## Repo conventions to follow

- Entrance uses `ease-out` `cubic-bezier(0.23,1,0.32,1)`, `--dur-panel` 260ms, 60ms stagger (AUDIT §7).
- `animation-fill-mode: both` keeps delayed sections hidden until their turn; nothing blocks interaction because this is a showcase page.

## Steps

1. In `ui.css`, extend `.comp-section` with the animation and add the 19 `nth-of-type` delay rules.
2. Add the `.comp-page .ui-page-header` entrance and the reduced-motion override.

## Boundaries

- Do NOT touch `Components.tsx` markup or the `Section` component.
- Do NOT apply this stagger to real app pages (create, blog listing) — showcase only.

## Verification

- **Mechanical**: `cd ui && npx tsc -b` passes; `npx vitest run` passes (Components test green).
- **Feel check**: load `/components` — the header rises in, then sections cascade top-to-bottom at 60ms intervals; no element stays hidden. Toggle `prefers-reduced-motion`: everything visible instantly.
- **Done when**: sections cascade in on mount; reduced-motion shows all immediately.
