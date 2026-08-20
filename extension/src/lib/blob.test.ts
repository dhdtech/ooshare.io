import { afterEach, describe, expect, it, vi } from "vitest";
import { bytesToBlob, downloadBlob } from "./blob";

function stubAnchor() {
  const click = vi.fn();
  const appended: HTMLAnchorElement[] = [];
  const createElement = vi.spyOn(document, "createElement").mockImplementation(
    (tag: string): HTMLElement => {
      if (tag === "a") {
        const a = { click, remove: vi.fn(), href: "", download: "" } as unknown as HTMLAnchorElement;
        return a;
      }
      return document.createElement(tag);
    },
  );
  const appendChild = vi
    .spyOn(document.body, "appendChild")
    .mockImplementation((node: Node): Node => {
      appended.push(node as HTMLAnchorElement);
      return node;
    });
  return { click, appended, createElement, appendChild };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("blob", () => {
  it("builds a blob of the right type", () => {
    const b = bytesToBlob(new Uint8Array([1, 2, 3]), "image/png");
    expect(b.type).toBe("image/png");
    expect(b.size).toBe(3);
  });

  it("downloadBlob wires an object URL into a clicked anchor and revokes it", () => {
    vi.useFakeTimers();
    const createUrl = vi.fn(() => "blob:ooshare-1");
    const revokeUrl = vi.fn();
    vi.stubGlobal("URL", { ...URL, createObjectURL: createUrl, revokeObjectURL: revokeUrl });

    const { click, appended } = stubAnchor();
    const blob = bytesToBlob(new Uint8Array([4, 5]), "text/plain");

    downloadBlob(blob, "secret.txt");

    expect(createUrl).toHaveBeenCalledWith(blob);
    expect(appended).toHaveLength(1);
    expect(appended[0].href).toBe("blob:ooshare-1");
    expect(appended[0].download).toBe("secret.txt");
    expect(click).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(revokeUrl).toHaveBeenCalledWith("blob:ooshare-1");
  });
});
