# 002 — Add motion tokens and shared entrance keyframes

- **Status**: DONE
- **Commit**: 9bae186
- **Severity**: HIGH
- **Category**: Cohesion & tokens
- **Estimated scope**: 1 file (`ui/src/styles/tokens.css`)
- **Depends on**: none

## Problem

Every transition in the system uses a single blunt `--transition: 200ms ease`. There is no easing-curve scale, no duration scale, and no shared entrance keyframe. Plans 003–011 each need this vocabulary; without it they would invent near-identical values (a cohesion finding, AUDIT §7).

Current (verbatim, `ui/src/styles/tokens.css` `:root` block):

```css
  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 16px;
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  --transition: 200ms ease;
```

## Target

Insert the five motion tokens inside `:root` immediately after `--transition: 200ms ease;`:

```css
  --transition: 200ms ease;

  /* Motion tokens (approved design system, AUDIT §2) */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --dur-press: 120ms;
  --dur-popover: 180ms;
  --dur-panel: 260ms;
  --dur-modal: 320ms;
```

Append two shared keyframes at the end of the file (top level, outside `:root`):

```css
/* Shared entrance: opacity + 12px rise */
@keyframes ui-rise-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Shared pop-in for state-swap icons */
@keyframes ui-pop {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}
```

`--transition` stays untouched (legacy CSS still uses it).

## Repo conventions to follow

- Tokens already live in `ui/src/styles/tokens.css` `:root`. Add the new tokens next to `--transition`.
- Curve and duration values come from the skill's AUDIT.md §2 exactly — do not approximate.

## Steps

1. Edit `ui/src/styles/tokens.css`: insert the five `--*` motion tokens after `--transition: 200ms ease;` inside `:root`.
2. Append `@keyframes ui-rise-in` and `@keyframes ui-pop` at the end of the file (outside `:root`).

## Boundaries

- Do NOT change any existing token value.
- Do NOT define keyframes named `ui-rise-in` or `ui-pop` in any other file (later plans reuse these or use unique names).

## Verification

- **Mechanical**: `cd ui && npx tsc -b` passes; `grep -c "ui-rise-in" ui/src/styles/tokens.css` returns ≥ 1.
- **Feel check**: n/a — tokens only; later plans consume them.
- **Done when**: the five tokens and two keyframes are present in `tokens.css`.
