import { describe, expect, it } from "vitest";
import { MENU_CREATE, MENU_REVEAL, isContentMessage } from "./messages";

describe("messages", () => {
  it("exposes stable menu ids", () => {
    expect(MENU_REVEAL).toBe("ooshare-reveal");
    expect(MENU_CREATE).toBe("ooshare-create");
  });

  it("validates content messages", () => {
    expect(
      isContentMessage({ type: "ooshare:reveal", payload: { text: "x" } }),
    ).toBe(true);
    expect(isContentMessage({ type: "other" })).toBe(false);
    expect(isContentMessage(null)).toBe(false);
  });
});
