import { browser } from "wxt/browser";
import { findShareLinks } from "../src/lib/link-scan";
import {
  isContentMessage,
  type ContentMessage,
} from "../src/lib/messages";

// --- styles: self-contained so on-demand injection needs no separate CSS file
const CSS = `
#ooshare-overlay-frame {
  position: fixed; inset: 0; z-index: 2147483647;
  border: none; width: 100%; height: 100%;
  background: rgba(11,16,32,0.6); backdrop-filter: blur(2px);
}
.ooshare-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; margin-left: 4px; border-radius: 6px;
  cursor: pointer; vertical-align: middle;
  background: rgba(99,102,241,0.15); color: #a5b4fc;
  border: 1px solid rgba(158,168,200,0.26); font-size: 12px; line-height: 1;
}
`;
const styleEl = document.createElement("style");
styleEl.textContent = CSS;

let frame: HTMLIFrameElement | null = null;

export function injectOverlayIframe(): HTMLIFrameElement {
  if (frame?.isConnected) return frame;
  frame = document.createElement("iframe");
  frame.id = "ooshare-overlay-frame";
  frame.src = browser.runtime.getURL("overlay.html");
  document.documentElement.appendChild(frame);
  return frame;
}

export function postToOverlay(msg: ContentMessage): void {
  const f = injectOverlayIframe();
  f.contentWindow?.postMessage(msg, browser.runtime.getURL("/"));
}

export default defineContentScript({
  matches: ["https://ooshare.io/*"],
  main() {
    if ((window as unknown as { __ooshareInjected?: boolean }).__ooshareInjected) return;
    (window as unknown as { __ooshareInjected?: boolean }).__ooshareInjected = true;

    document.head.appendChild(styleEl);

    const badgeFor = (a: HTMLAnchorElement): HTMLElement => {
      const b = document.createElement("span");
      b.className = "ooshare-badge";
      b.textContent = "🛡";
      b.title = "ooshare — reveal";
      b.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        browser.runtime.sendMessage({
          type: "ooshare:reveal-request",
          url: a.href,
        });
      });
      return b;
    };

    const scan = () => {
      if (frame?.isConnected) return; // overlay open: don't re-badge
      for (const a of findShareLinks(document.body)) {
        if (!a.querySelector(".ooshare-badge")) a.appendChild(badgeFor(a));
      }
    };

    browser.runtime.onMessage.addListener((msg: unknown, _sender, sendResponse) => {
      if (!isContentMessage(msg)) return undefined;
      if (msg.type === "ooshare:reveal" || msg.type === "ooshare:created" || msg.type === "ooshare:error") {
        postToOverlay(msg);
      }
      sendResponse({ ok: true });
      return undefined;
    });

    // Background routes "reveal-request" from badge clicks through the same path.
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
  },
});
