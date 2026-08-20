# 005 — Toast: enter from the viewport edge, exit symmetrically

- **Status**: DONE
- **Commit**: 9bae186
- **Severity**: MEDIUM
- **Category**: Spatial consistency / Preventing a jarring change
- **Estimated scope**: 2 files (`ui/src/components/ui/Toast.tsx`, `ui/src/styles/ui.css`)
- **Depends on**: 001 (motion), 002 (tokens)

## Problem

Toasts reuse the *modal* entrance curve (`.ui-toast { … animation: ui-fade-modal 0.2s ease; }` at `ui.css:1079` — it rises like a centered modal, not like a surface pinned to the bottom edge), and dismissal is a teleport: `Toast.tsx:50` `setToasts((prev) => prev.filter(...))` removes the node instantly with no exit.

Current (verbatim, `Toast.tsx:70-96`):

```tsx
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 ? (
        <div className="ui-toast-viewport" aria-live="polite" aria-atomic="false">
          {toasts.map((toast) => (
            <div key={toast.id} className={cn("ui-toast", `ui-toast--${toast.variant}`)}>
              <span className="ui-toast__icon" aria-hidden="true">
                <ToastIcon variant={toast.variant} />
              </span>
              <span className="ui-toast__msg">{toast.message}</span>
              <button …>…</button>
            </div>
          ))}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
```

The viewport is bottom-centered (`ui.css:1049` `.ui-toast-viewport { position: fixed; bottom: 20px; left: 50%; … }`).

## Target

`Toast.tsx` — wrap the list in `AnimatePresence` and make each toast a `motion.div` that enters from and exits toward the bottom edge (spatial consistency with the bottom-anchored viewport):

```tsx
  const reduceMotion = useReducedMotion();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="ui-toast-viewport" aria-live="polite" aria-atomic="false">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={cn("ui-toast", `ui-toast--${toast.variant}`)}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.24, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="ui-toast__icon" aria-hidden="true">
                <ToastIcon variant={toast.variant} />
              </span>
              <span className="ui-toast__msg">{toast.message}</span>
              <button …>…</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
```

Note: the viewport stays always mounted (drop the `toasts.length > 0 ? … : null` conditional — `AnimatePresence` handles the empty case) so exits are visible. Add at the top of `Toast.tsx`:

```tsx
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
```

In `ui.css`, delete the conflicting entrance animation on `.ui-toast`:

```css
.ui-toast {
  …
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
  animation: ui-fade-modal 0.2s ease;   /* delete this line */
}
```

## Repo conventions to follow

- Symmetric enter/exit from the same edge (AUDIT §4). Toasts are small fixed-height cards, so a px offset (16→0→8) reads naturally; percentages are reserved for full-size sheets (AUDIT §8).
- Ease-out `cubic-bezier(0.23,1,0.32,1)` for both phases, ~240ms in / 240ms out (AUDIT §2 toast budget 200–500ms).

## Steps

1. Add the `motion/react` import to `Toast.tsx`.
2. Replace the return block per the target; keep the auto-dismiss effect, `ToastContext.Provider`, inner toast content, and the dismiss button identical.
3. Delete the `animation:` line from `.ui-toast` in `ui.css`.

## Boundaries

- Do NOT change toast content, variants, icons, `aria-live`, or the 4000ms auto-dismiss timing.
- Do NOT change the viewport CSS.

## Verification

- **Mechanical**: `cd ui && npx tsc -b` passes; `npx vitest run` passes (Toast tests still green).
- **Feel check**: on `/components` fire a toast — it slides up 16px + fades in; dismiss or let it auto-dismiss — it slides back down 8px + fades out. Rapid-firing toasts stacks them without restarting. Toggle `prefers-reduced-motion`: opacity-only fade both ways.
- **Done when**: enter and exit both animate toward/from the bottom edge; reduced-motion is respected.
