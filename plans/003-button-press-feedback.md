# 003 — Add press feedback to Button and IconButton

- **Status**: DONE
- **Commit**: 9bae186
- **Severity**: HIGH
- **Category**: Purpose & frequency / Feedback
- **Estimated scope**: 1 file (`ui/src/styles/ui.css`)
- **Depends on**: 002 (tokens)

## Problem

Pressable elements give no press feedback: on press, `.ui-btn--primary` only returns to neutral `translateY(0)`, and `.ui-btn--secondary`, `.ui-btn--success`, and `.ui-icon-btn` have no `:active` rule at all. Buttons are hit tens of times/day, so the press affordance must be near-imperceptible (AUDIT §1, §3: `scale(0.95–0.98)`, 100–160ms).

Current (verbatim, `ui/src/styles/ui.css`):

```css
.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-weight: 600;
  border: 0;
  cursor: pointer;
  text-decoration: none;
  transition: color var(--transition), border-color var(--transition),
    background var(--transition), transform var(--transition),
    filter var(--transition), box-shadow var(--transition);
}
```

```css
.ui-btn--primary:active:not(:disabled) {
  transform: translateY(0);
}
```

```css
.ui-icon-btn {
  ...
  flex-shrink: 0;
  transition: all var(--transition);
}
```

## Target

In `ui/src/styles/ui.css`:

1. Change `.ui-btn--primary:active:not(:disabled)` to:

```css
.ui-btn--primary:active:not(:disabled) {
  transform: scale(0.97);
  transition-duration: var(--dur-press);
}
```

2. Add after the `.ui-btn--secondary:disabled` rule:

```css
.ui-btn--secondary:active:not(:disabled),
.ui-btn--success:active:not(:disabled) {
  transform: scale(0.97);
  transition-duration: var(--dur-press);
}
```

3. Replace `.ui-icon-btn`'s `transition: all var(--transition);` with an explicit list and add a press rule:

```css
.ui-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  flex-shrink: 0;
  transition: color var(--transition), border-color var(--transition),
    background var(--transition), transform var(--dur-press) var(--ease-out);
}
.ui-icon-btn:active:not(:disabled) {
  transform: scale(0.94);
}
```

4. Add a reduced-motion override (drop movement, keep the state change):

```css
@media (prefers-reduced-motion: reduce) {
  .ui-btn:active:not(:disabled),
  .ui-icon-btn:active:not(:disabled) {
    transform: none;
    transition-duration: var(--transition);
  }
}
```

## Repo conventions to follow

- Easing/duration tokens come from plan 002 (`var(--ease-out)`, `var(--dur-press)`). Apply 002 first.
- Keep transition property lists explicit — never `transition: all` (AUDIT §5).

## Steps

1. Apply the four edits above to `ui/src/styles/ui.css` at the cited rules.
2. Confirm no duplicate `.ui-btn--primary:active` rule remains.

## Boundaries

- Do NOT change markup, sizes, colors, or hover rules.
- Do NOT add `transition: all` anywhere.

## Verification

- **Mechanical**: `cd ui && npx tsc -b` passes; `npx vitest run` passes (no behavior change).
- **Feel check**: press any primary/secondary/success button and an IconButton on `/components` — each shrinks ~3% and returns on release; the press feels instant (<160ms). Toggle `prefers-reduced-motion` (DevTools Rendering panel) and confirm the scale is gone but the button still works.
- **Done when**: every button variant shows a subtle scale-down on press; reduced-motion disables the movement.
