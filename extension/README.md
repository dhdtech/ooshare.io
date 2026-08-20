# ooshare browser extension

Create and reveal [ooshare](https://ooshare.io) one-time secrets without
leaving the page you are on. Secrets are encrypted client-side
(AES-256-GCM) before they ever reach the server; the extension only ever
handles the ciphertext and the master key stays in the URL fragment.

Built with [WXT](https://wxt.dev/) as a Manifest V3 web extension, target:
Chrome, Firefox, and Edge.

## What it does

- **Create** — select text on any page and share it as a one-time secret
  through a context-menu item; optionally attach a file.
- **Reveal** — right-click an ooshare link on any page and view its
  plaintext in an inline overlay. The secret is consumed on first reveal.
- **Badges** — on ooshare.io pages, share links are highlighted so the
  secret can be revealed inline.
- **Popup** — create secrets or paste a share URL to reveal it, all from
  the toolbar.

## Prerequisites

- Node.js 20+ and npm.
- The shared UI source lives in the repo's `ui/` directory (the extension
  aliases `@ui` to it); the repo root must be intact.

## Install

```bash
npm install
```

## Build

```bash
npm run build:chrome    # -> .output/chrome-mv3
npm run build:firefox   # -> .output/firefox-mv3
npm run build:edge      # -> .output/edge-mv3
npm run build:all       # all three
```

Build artifacts land in `.output/<browser>-mv3`.

## Load unpacked

### Chrome

1. Run `npm run build:chrome`.
2. Open `chrome://extensions`.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select `.output/chrome-mv3`.

### Firefox

Firefox MV3 extensions must be loaded as temporary add-ons, or signed
before permanent install.

1. Run `npm run build:firefox`.
2. Open `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on** and select
   `.output/firefox-mv3/manifest.json`.

### Edge

1. Run `npm run build:edge`.
2. Open `edge://extensions`.
3. Enable **Developer mode** (left panel).
4. Click **Load unpacked** and select `.output/edge-mv3`.

## Test

```bash
npm test               # run the unit suite (jsdom)
npm run test:coverage  # unit suite with the 90/90/80/90 coverage gate
```

Coverage thresholds (lines / functions / branches / statements = 90 / 90 /
80 / 90) are enforced on `src/**`. The `pretest:coverage` hook runs
`wxt prepare` first so a fresh checkout is self-sufficient.

## Lint

```bash
npm run build:firefox && npm run lint:firefox
```

The Firefox build is verified with `web-ext lint`. The gate is **no
errors**; the only warnings are the three `UNSAFE_VAR_ASSIGNMENT` notices
from inside the bundled React runtime (no authored `innerHTML`).

## Manual QA & interop

- [QA & interop checklist](docs/qa-checklist.md) — run before every release;
  includes the extension ↔ ooshare.io ↔ CLI round-trips and the manual
  feature checks.

## Release

- [Release bootstrap runbook](docs/release-bootstrap.md) — packaging,
  signing, and the per-browser release pipeline.

## Permissions

Lean by design:

- `contextMenus`, `activeTab`, `scripting`, `storage`, `clipboardWrite`
- Hosts limited to `https://ooshare.io/*` and `https://api.ooshare.io/*`

The extension never requests broad `<all_urls>` access; it activates only
on pages where you invoke it.
