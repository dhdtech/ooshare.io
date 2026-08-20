import { describe, expect, it } from "vitest";
import { MENU_CREATE, MENU_REVEAL, isContentMessage } from "./messages";

describe("messages", () => {
  it("exposes stable menu ids", () => {
    expect(MENU_REVEAL).toBe("ooshare-reveal");
    expect(MENU_CREATE).toBe("ooshare-create");
  });

  it("validates a reveal message with text", () => {
    expect(
      isContentMessage({ type: "ooshare:reveal", payload: { text: "x" } }),
    ).toBe(true);
  });

  it("validates a reveal message with an attachment", () => {
    expect(
      isContentMessage({
        type: "ooshare:reveal",
        payload: {
          text: "x",
          attachment: { mime: "text/plain", data: new Uint8Array([1]) },
        },
      }),
    ).toBe(true);
  });

  it("validates a created message", () => {
    expect(
      isContentMessage({ type: "ooshare:created", url: "https://ooshare.io" }),
    ).toBe(true);
  });

  it("validates an error message", () => {
    expect(
      isContentMessage({
        type: "ooshare:error",
        title: "t",
        message: "m",
      }),
    ).toBe(true);
    expect(
      isContentMessage({
        type: "ooshare:error",
        title: "t",
        message: "m",
        fallbackUrl: "https://ooshare.io",
      }),
    ).toBe(true);
  });

  it("rejects a reveal message without a payload", () => {
    expect(isContentMessage({ type: "ooshare:reveal" })).toBe(false);
  });

  it("rejects an unknown type", () => {
    expect(isContentMessage({ type: "other" })).toBe(false);
  });

  it("rejects null", () => {
    expect(isContentMessage(null)).toBe(false);
  });

  it("rejects a reveal message with a non-string text", () => {
    expect(isContentMessage({ type: "ooshare:reveal", payload: { text: 1 } })).toBe(
      false,
    );
  });
});
