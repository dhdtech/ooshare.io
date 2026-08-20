import { describe, expect, it } from "vitest";
import { buildShareUrl, parseShareUrl } from "./shareurl";

const KEY = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"; // 32 bytes base64url
const ORIGIN = "https://ooshare.io";

describe("shareurl", () => {
  it("builds a canonical share URL", () => {
    expect(buildShareUrl(ORIGIN, "AbCdEf12", "en", KEY)).toBe(
      `https://ooshare.io/s/AbCdEf12?lng=en#${KEY}`,
    );
  });

  it("round-trips build -> parse", () => {
    const u = buildShareUrl(ORIGIN, "AbCdEf12", "pt", KEY);
    const p = parseShareUrl(u);
    expect(p).toEqual({ id: "AbCdEf12", lang: "pt", key: KEY });
  });

  it("parses a UUID id and defaults language to empty", () => {
    const u = `https://ooshare.io/s/10000000-1000-4000-8000-100000000000#${KEY}`;
    const p = parseShareUrl(u);
    expect(p.id).toBe("10000000-1000-4000-8000-100000000000");
    expect(p.lang).toBe("");
    expect(p.key).toBe(KEY);
  });

  it("rejects a missing fragment (no master key)", () => {
    expect(() => parseShareUrl("https://ooshare.io/s/AbCdEf12")).toThrow(
      /master key/i,
    );
  });

  it("rejects a non-ooshare path", () => {
    expect(() => parseShareUrl(`https://example.com/x#${KEY}`)).toThrow(
      /secret id/i,
    );
  });
});
