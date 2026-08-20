import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { webcrypto } from "node:crypto";

// Initialize the shared i18n instance once so `useTranslation()` resolves real
// strings (English) in component tests.
import "../src/i18n";

// jsdom does not ship WebCrypto; the extension core depends on it.
if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, "crypto", {
    value: webcrypto,
    configurable: true,
  });
}

afterEach(() => cleanup());

const writeText = vi.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, "clipboard", {
  value: { writeText },
  writable: true,
  configurable: true,
});

// jsdom's `window.postMessage` delivers `source: null` and `origin: ""` even
// for a self-targeted same-origin message. The overlay (a web_accessible_iframe
// hosted as a top-level page here) must reject any message whose `source` is not
// `window.parent` and whose `origin` is not `location.origin`. Emulate the real
// browser contract so the component's security gate is exercised faithfully.
const originalPostMessage = window.postMessage.bind(window);
window.postMessage = (message, targetOrigin) => {
  const ev = new MessageEvent("message", {
    source: window,
    origin: location.origin,
    data: message,
  });
  window.dispatchEvent(ev);
  return undefined as unknown as ReturnType<typeof originalPostMessage>;
};
