import { describe, expect, it } from "vitest";
import { bytesToBlob } from "./blob";

describe("blob", () => {
  it("builds a blob of the right type", () => {
    const b = bytesToBlob(new Uint8Array([1, 2, 3]), "image/png");
    expect(b.type).toBe("image/png");
    expect(b.size).toBe(3);
  });
});
