# ooshare Extension — Manual QA & Interop Checklist

Run this checklist before every release and after any change to the
source (background, content script, overlay, popup, or CLI). The interop
items verify that the extension stays wire-compatible with ooshare.io and
the `ooshare` CLI — same URL scheme, same ciphertext envelope, same
one-time deletion semantics.

## Prerequisites

- Extension loaded unpacked in the browser under test (see the extension `README`).
- `ooshare` CLI installed and pointed at the production API.
- A second browser tab open to `https://ooshare.io`.

## Interop round-trips

### Interop A — CLI → data URL → extension popup reveal

1. Create a secret from the CLI:
   ```bash
   ooshare create --ttl 24 "hunter2"
   ```
2. Copy the returned `https://ooshare.io/s/...` URL.
3. Open the extension popup, paste the URL, and click **Reveal**.
4. **Expect:** the overlay/popup shows the plaintext `hunter2`.
5. Re-reveal the same URL a second time.
6. **Expect:** the secret is gone — reveal fails with "not found or
   already viewed" (one-time semantics preserved across the CLI).

### Interop B — extension popup → ooshare.io browser tab

1. In the extension popup, create a secret for "interop-b".
2. Copy the generated share URL.
3. Open that URL in a normal ooshare.io browser tab and reveal it.
4. **Expect:** ooshare.io reveals `interop-b` (extension ciphertext is
   readable by the web client — same protocol).
5. Re-reveal the URL.
6. **Expect:** the tab now shows the "already viewed / expired" state.

### Interop C — popup with a file → ooshare.io

1. In the extension popup, create a secret with a file attached:
   - an **image** (PNG) attachment, and
   - a **PDF** attachment in a second run.
2. Open each generated URL in a normal ooshare.io tab and reveal.
3. **Expect:** the PNG renders inline; the PDF triggers a download of the
   original bytes.
4. Re-reveal each URL.
5. **Expect:** both are consumed exactly once and then 404.

## Extension feature checks

### Context-menu reveal on a non-ooshare page

1. Open an arbitrary page (e.g. a chat/discussion thread) that contains an
   ooshare link.
2. Right-click the ooshare link and choose the **Reveal ooshare secret**
   context-menu item.
3. **Expect:** a small overlay near the cursor shows the plaintext.
4. Reveal the same link again (or reload + repeat).
5. **Expect:** the second reveal fails — the secret was consumed on first
   reveal, so the link now 404s.

### Share selected text

1. On any page, select a snippet of text.
2. Right-click the selection and choose **Share with ooshare**.
3. **Expect:** an overlay appears showing the created share link.
4. Open that link in a new tab and reveal it.
5. **Expect:** the tab shows exactly the selected text.

### Badges on ooshare.io

1. Navigate to a page on `https://ooshare.io` that contains share links.
2. **Expect:** each share link shows the shield badge indicator.
3. Click a badge.
4. **Expect:** the secret reveals inline.

### Theme

1. Set the OS to **light mode**; open the popup and an overlay.
2. **Expect:** popup/overlay render light, matching the ooshare.io site.
3. Set the OS to **dark mode** and repeat.
4. **Expect:** popup/overlay render dark (theme follows the system).

### Permissions audit

1. Open `chrome://extensions` and expand the ooshare extension.
2. **Expect:** only the lean permission set is declared:
   - `contextMenus`, `activeTab`, `scripting`, `storage`, `clipboardWrite`
   - Hosts limited to `https://ooshare.io/*` and `https://api.ooshare.io/*`
3. **Expect:** the details screen lists **no** broad `<all_urls>` host
   permission request from the browser's point of view.

## Cross-browser

### Firefox / Edge

1. Load the extension unpacked in Firefox (`about:debugging`) and Edge
   (`edge://extensions`). For Firefox, build with `npm run build:firefox`
   first.
2. Re-run Interop A, B, C and the context-menu / share-selection / badge /
   theme checks in each browser.

## Release gate

- [ ] All interop round-trips (A, B, C) pass with no plaintext leakage on a
      second reveal.
- [ ] Context-menu reveal consumes the secret exactly once.
- [ ] Share-selection overlay produces a working reveal.
- [ ] Badges render and work on ooshare.io.
- [ ] Theme follows the OS in both modes.
- [ ] Permission audit shows only the lean set.
- [ ] Firefox and Edge repeat checks pass.
