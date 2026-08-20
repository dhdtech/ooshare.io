import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { webcrypto } from "node:crypto";

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
