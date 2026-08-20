# 001 — Add `motion` for exit & layout animations

- **Status**: DONE
- **Commit**: 9bae186
- **Severity**: HIGH
- **Category**: Cohesion & tokens (dependency)
- **Estimated scope**: 1 file (`ui/package.json` + lockfile); no source edits
- **Depends on**: none

## Problem

The design system needs exit animations (Modal, Toast) and a layout-sliding thumb (SegmentedControl). Plain CSS cannot animate an element that unmounts instantly — `Modal.tsx:81` returns `null` on close and `Toast.tsx:50` filters on dismiss, so exit transitions need an `AnimatePresence`-style runtime. A sliding segmented thumb needs a shared-element/layout animation. The repo currently has zero animation libraries (`ui/package.json` dependencies: react, react-dom, react-router-dom, i18next, react-i18next, posthog-js, lucide-react). The single most-maintained React motion library is **`motion`** (successor to Framer Motion, published as the `motion` package, imported from `motion/react`, React 19 supported).

## Target

`ui/package.json` gains a dependency `"motion": "^12.x"` (latest 12.x at execution time). No source imports yet — plans 004, 005, 007 import `{ AnimatePresence, motion, useReducedMotion }` from `"motion/react"`.

## Repo conventions to follow

- Dependencies are plain `npm` deps installed from the `ui/` directory (exemplar: `lucide-react ^0.577.0`).
- `motion` is a normal ESM package — Vite bundles it without any plugin or config change.

## Steps

1. `cd ui && npm install motion@^12`
2. Confirm `ui/package.json` lists `"motion": "^12..."` under `dependencies` (npm updates it).
3. `cd ui && npx tsc -b` still passes.

## Boundaries

- Do NOT add any other animation library (no GSAP, no react-transition-group, no react-spring).
- Do NOT edit any source file in this plan — dependency only.
- Do NOT commit or push.

## Verification

- **Mechanical**: `cd ui && npm ls motion` prints the installed version; `npx tsc -b` exits 0.
- **Feel check**: n/a (dependency only).
- **Done when**: `ui/package.json` shows the dependency and `npm ls motion` resolves.
