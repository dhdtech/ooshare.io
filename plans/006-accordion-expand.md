# 006 — Animate accordion expand/collapse

- **Status**: DONE
- **Commit**: 9bae186
- **Severity**: MEDIUM
- **Category**: State indication / Preventing a jarring change
- **Estimated scope**: 2 files (`ui/src/components/ui/Accordion.tsx`, `ui/src/styles/ui.css`)
- **Depends on**: 002 (tokens)

## Problem

The `<details>` accordion snaps open/closed — the answer area (`.ui-accordion-answer` at `ui.css:736`) appears and disappears instantly; only the chevron rotates. A height + opacity transition makes the state change legible (AUDIT §8: collapsible content should not teleport).

Current (verbatim, `Accordion.tsx:16-24`):

```tsx
  return (
    <details className="ui-accordion" open={defaultOpen}>
      <summary>
        {question}
        <Plus size={16} className="ui-accordion-chevron" aria-hidden="true" />
      </summary>
      <div className="ui-accordion-answer">{children}</div>
    </details>
  );
```

Current (verbatim, `ui.css:736-744`):

```css
.ui-accordion-answer {
  padding: 0 1.25rem 1rem;
}
.ui-accordion-answer p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.65;
  margin: 0;
}
```

## Target

Add an inner wrapper so the collapsed grid row can close to 0 (padding does not collapse). `Accordion.tsx`:

```tsx
      <div className="ui-accordion-answer">
        <div className="ui-accordion-answer-inner">{children}</div>
      </div>
```

`ui.css` — replace the `.ui-accordion-answer` rule and add the new rules:

```css
.ui-accordion-answer {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  padding: 0 1.25rem;
  transition: grid-template-rows var(--dur-panel) var(--ease-in-out),
    opacity var(--dur-panel) var(--ease-in-out);
}
.ui-accordion-answer-inner {
  overflow: hidden;
  min-height: 0;
  padding-bottom: 1rem;
}
.ui-accordion[open] .ui-accordion-answer {
  grid-template-rows: 1fr;
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .ui-accordion-answer {
    transition: none;
  }
}
```

(`overflow: hidden` on `.ui-accordion` already exists at `ui.css:702` — it clips the collapse.)

## Repo conventions to follow

- On-screen movement uses `ease-in-out` `cubic-bezier(0.77,0,0.175,1)` and `--dur-panel` 260ms (AUDIT §2).
- Interruptible: `grid-template-rows` is a CSS *transition*, so rapid toggling retargets smoothly instead of restarting from zero (AUDIT §4). No keyframes.

## Steps

1. Edit `Accordion.tsx`: wrap `{children}` in `<div className="ui-accordion-answer-inner">`.
2. In `ui.css`, replace `.ui-accordion-answer` and add `.ui-accordion-answer-inner`, `.ui-accordion[open] .ui-accordion-answer`, and the reduced-motion rule.

## Boundaries

- Do NOT change the chevron, the `<details>`/`<summary>` semantics, or the component props.
- Animate `grid-template-rows` only — do NOT animate `height` or `max-height`.

## Verification

- **Mechanical**: `cd ui && npx tsc -b` passes; `npx vitest run` passes (Accordion tests green).
- **Feel check**: on `/components`, toggle an accordion — the answer expands/collapses over ~260ms with a fade. Rapid toggling retargets smoothly (never snaps to zero). Toggle `prefers-reduced-motion`: instant open/close. Keyboard (Enter/Space) still works.
- **Done when**: expand and collapse both animate; content is clipped during animation (no spill).
