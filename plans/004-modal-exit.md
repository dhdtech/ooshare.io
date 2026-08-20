# 004 — Animate Modal exit (no teleport on close)

- **Status**: DONE
- **Commit**: 9bae186
- **Severity**: MEDIUM
- **Category**: Missed opportunities / Preventing a jarring change
- **Estimated scope**: 2 files (`ui/src/components/ui/Modal.tsx`, `ui/src/styles/ui.css`)
- **Depends on**: 001 (motion), 002 (tokens)

## Problem

The Modal has an entrance (`.ui-modal { ... animation: ui-fade-modal 0.2s ease; }` at `ui.css:627`) but NO exit: `if (!open) return null` at `Modal.tsx:81` unmounts the dialog instantly, so closing teleports the overlay away. Close should mirror enter (fade + scale down).

Current (verbatim, `Modal.tsx:81-94`):

```tsx
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="ui-modal"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={ariaLabel ? undefined : titleId}
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
      >
```

## Target

Rewrite the return in `Modal.tsx` to use `AnimatePresence` + `motion`, preserving all existing props, effects, and dialog markup:

```tsx
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.15, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.div
            ref={dialogRef}
            className="ui-modal"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            aria-labelledby={ariaLabel ? undefined : titleId}
            aria-label={ariaLabel}
            onClick={(e) => e.stopPropagation()}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.24, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="ui-modal-header">…</div>
            <div className="ui-modal-body">…</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
```

Add at the top of `Modal.tsx`:

```tsx
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
```

In `ui/src/styles/ui.css`, DELETE the two `animation:` declarations that would fight motion's inline styles:

```css
.modal-overlay { … animation: ui-fade-overlay 0.15s ease; }   /* remove the animation: line */
.ui-modal { … animation: ui-fade-modal 0.2s ease; }           /* remove the animation: line */
```

Keep the `@keyframes ui-fade-overlay` / `ui-fade-modal` blocks (harmless if unused); delete only the `animation:` lines on the two rules.

## Repo conventions to follow

- Entering/exiting motion uses `ease-out` `cubic-bezier(0.23,1,0.32,1)` (AUDIT §2). Modals stay centered — motion's default center scaling is correct (AUDIT §3 exempts modals from trigger-origin).
- `useReducedMotion()` is the motion-library equivalent of `prefers-reduced-motion` (AUDIT §6).
- Keep the existing `useId()` title id and both `useEffect`s (focus in/out, focus trap, Escape).

## Steps

1. Add the `motion/react` import to `Modal.tsx`.
2. Replace the `if (!open) return null;` + return block with the `AnimatePresence` version above, preserving the two effects and all dialog markup.
3. Remove the two `animation:` lines from `.modal-overlay` and `.ui-modal` in `ui.css`.

## Boundaries

- Do NOT change focus-trap / Escape / backdrop-click logic.
- Do NOT change the `Modal` public props.
- Import motion only from `"motion/react"`.

## Verification

- **Mechanical**: `cd ui && npx tsc -b` passes; `npx vitest run` passes (Modal tests still green — they assert open/close + focus behavior).
- **Feel check**: open the `/components` modal and close it — the overlay + dialog fade and scale down over ~240ms instead of vanishing. Toggle `prefers-reduced-motion`: open/close becomes a quick opacity-only fade. Escape and backdrop click still close it; focus returns to the trigger.
- **Done when**: close animates, reduced-motion disables movement, focus still returns to the trigger.
