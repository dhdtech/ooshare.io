# 007 — SegmentedControl sliding thumb

- **Status**: DONE
- **Commit**: 9bae186
- **Severity**: MEDIUM
- **Category**: Spatial consistency / State indication
- **Estimated scope**: 2 files (`ui/src/components/ui/SegmentedControl.tsx`, `ui/src/styles/ui.css`)
- **Depends on**: 001 (motion), 002 (tokens)

## Problem

The selected segment only swaps its background color (`.ui-segment[aria-pressed="true"] { background: var(--accent-strong); color: #fff; }` at `ui.css:264`). There is no spatial story — the active pill should glide between options so the selection change is legible (AUDIT §8). The control is hit tens/day (the TTL picker), so it must be subtle and interruptible.

Current (verbatim, `SegmentedControl.tsx:27-42`):

```tsx
  return (
    <div className="ui-segmented" role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          className="ui-segment"
          aria-pressed={value === opt.value}
          aria-label={`${ariaLabel}: ${opt.label}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
```

## Target

`SegmentedControl.tsx` — add a `motion.span` thumb with a `layoutId` shared by the active segments, so motion animates it from the previous option to the new one. Namespace the layoutId with `useId()` so two controls on one page never cross-animate:

```tsx
import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/cn";
…
  const thumbId = `ui-segment-thumb-${useId()}`;
  const reduceMotion = useReducedMotion();

  return (
    <div className="ui-segmented" role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            className={cn("ui-segment", active && "ui-segment--active")}
            aria-pressed={active}
            aria-label={`${ariaLabel}: ${opt.label}`}
            onClick={() => onChange(opt.value)}
          >
            {active ? (
              <motion.span
                layoutId={thumbId}
                className="ui-segment-thumb"
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
              />
            ) : null}
            <span className="ui-segment-label">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
```

`ui.css` — replace the `.ui-segment` rule (the active background becomes the thumb):

```css
.ui-segment {
  position: relative;
  border: 0;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-secondary);
  padding: 6px 10px;
  border-radius: 7px;
  cursor: pointer;
  transition: color var(--transition);
}
.ui-segment-thumb {
  position: absolute;
  inset: 0;
  border-radius: 7px;
  background: var(--accent-strong);
  z-index: 0;
}
.ui-segment-label {
  position: relative;
  z-index: 1;
}
.ui-segment--active {
  color: #fff;
}
```

DELETE the old rule:

```css
.ui-segment[aria-pressed="true"] {
  background: var(--accent-strong);
  color: #fff;
}
```

## Repo conventions to follow

- Spatial/morphing movement on screen → spring (AUDIT §4). `stiffness 400 / damping 30` is a gentle, barely-bouncy spring; keep it subtle.
- `useReducedMotion()` forces `duration: 0` (AUDIT §6). `useId()` namespacing matches the existing Modal title-id pattern.

## Steps

1. Edit `SegmentedControl.tsx` per the target (imports, `thumbId`, `reduceMotion`, restructured buttons).
2. Replace the `.ui-segment` CSS per the target and delete the `[aria-pressed="true"]` rule.

## Boundaries

- Do NOT change the `aria-pressed`/`aria-label`/`onChange` contract or the `T extends string | number` generic typing.
- Do NOT change the `--accent-strong` value.

## Verification

- **Mechanical**: `cd ui && npx tsc -b` passes; `npx vitest run` passes (update SegmentedControl test selectors ONLY if they target the old `[aria-pressed="true"]` background; preserve the assertions' intent).
- **Feel check**: on `/components` click across TTL options — the indigo pill slides between options. Two segmented controls on one page do not cross-animate. Toggle `prefers-reduced-motion`: the thumb swaps instantly.
- **Done when**: the active thumb visibly glides; text stays legible (white on indigo); reduced-motion is instant.
