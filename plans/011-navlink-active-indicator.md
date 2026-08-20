# 011 — NavLink active indicator slide-in

- **Status**: DONE
- **Commit**: 9bae186
- **Severity**: LOW
- **Category**: State indication
- **Estimated scope**: 1 file (`ui/src/styles/ui.css`)
- **Depends on**: 002 (tokens)

## Problem

`.ui-nav-link--active` only changes text color (`.ui-nav-link--active { color: var(--text); }`). There is no indicator showing the current route. An underline that scales in on activation is a subtle state indication, and the active state changes only on navigation, so it is low-frequency (AUDIT §8).

Current (verbatim, `ui.css:810-828`):

```css
.ui-nav-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 8px 0;
  transition: color var(--transition);
}
.ui-nav-link:hover {
  color: var(--text);
}
.ui-nav-link:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}
.ui-nav-link--active {
  color: var(--text);
}
```

## Target

`ui.css` — add an underline that draws in from the left on the active link:

```css
.ui-nav-link {
  position: relative;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 8px 0;
  transition: color var(--transition);
}
.ui-nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  height: 2px;
  border-radius: 2px;
  background: var(--primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur-popover) var(--ease-out);
}
.ui-nav-link--active::after {
  transform: scaleX(1);
}
@media (prefers-reduced-motion: reduce) {
  .ui-nav-link::after {
    transition: none;
  }
}
```

## Repo conventions to follow

- The indicator animates `transform` only (GPU-friendly, AUDIT §5). `transform-origin: left` makes it draw from the link's left edge. Duration `--dur-popover` 180ms ease-out.

## Steps

1. Edit the `.ui-nav-link` rule in `ui.css` (add `position: relative`).
2. Add the `::after`, `.ui-nav-link--active::after`, and reduced-motion rules.

## Boundaries

- Do NOT change `NavLink.tsx` (the `aria-current` logic stays).
- Do NOT change the active text color.

## Verification

- **Mechanical**: `cd ui && npx tsc -b` passes; `npx vitest run` passes (NavLink tests green).
- **Feel check**: navigate between `/`, `/security`, `/faq` in the real header — the active nav link's underline draws from the left. Toggle `prefers-reduced-motion`: underline appears instantly.
- **Done when**: the active route has a visible underline that draws in on navigation.
