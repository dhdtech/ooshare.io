# 009 — CopyButton copied-state pop

- **Status**: DONE
- **Commit**: 9bae186
- **Severity**: LOW
- **Category**: Feedback / State indication
- **Estimated scope**: 1 file (`ui/src/styles/ui.css`)
- **Depends on**: 002 (tokens)

## Problem

When CopyButton flips to its copied state (`CopyButton.tsx:54` swaps `<Copy/>` for `<Check/>`), the icon and label change instantly with no feedback. Copy is occasional, so a small pop is warranted (AUDIT §8: rare/feedback moments earn the delight budget).

Current (verbatim, `ui.css:1022-1025`):

```css
.share-btn--copied {
  border-color: var(--success);
  color: var(--success);
  background: var(--success-glow);
}
```

## Target

`ui.css` — pop the new icon in and briefly pulse a success ring:

```css
.share-btn--copied {
  border-color: var(--success);
  color: var(--success);
  background: var(--success-glow);
  box-shadow: 0 0 0 4px var(--success-glow);
  transition: border-color var(--transition), color var(--transition),
    background var(--transition), box-shadow var(--dur-panel) var(--ease-out);
}
.share-btn--copied svg {
  animation: ui-pop var(--dur-popover) var(--ease-out);
}
@media (prefers-reduced-motion: reduce) {
  .share-btn--copied svg {
    animation: none;
  }
}
```

(`ui-pop` keyframes come from plan 002.)

## Repo conventions to follow

- `ui-pop` is the shared pop keyframe (scale 0.8→1 + fade). Duration `--dur-popover` 180ms.

## Steps

1. Edit the `.share-btn--copied` rule in `ui.css` (add the box-shadow + explicit transition list).
2. Add the `.share-btn--copied svg` pop and the reduced-motion override.

## Boundaries

- Do NOT change `CopyButton.tsx` or its copy logic.
- The ring uses `--success-glow` only; no new color.

## Verification

- **Mechanical**: `cd ui && npx tsc -b` passes; `npx vitest run` passes (CopyButton tests green).
- **Feel check**: on `/components` click "Copy sample" — the check icon pops in and a soft green ring fades. Toggle `prefers-reduced-motion`: no icon pop, but the check still appears.
- **Done when**: the state flip feels confirmed without being showy.
