import { describe, expect, it } from "vitest";
import { findShareLinks } from "./link-scan";

describe("link-scan", () => {
  it("finds ooshare share anchors", () => {
    document.body.innerHTML = `
      <a href="https://ooshare.io/s/AbCdEf12?lng=en#AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA">good</a>
      <a href="https://ooshare.io/s/AbCdEf12">no key</a>
      <a href="https://example.com/s/AbCdEf12#AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA">other</a>
      <a href="/s/AbCdEf12#AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA">relative</a>
    `;
    const found = findShareLinks(document.body);
    expect(found).toHaveLength(1);
    expect(found[0].textContent).toBe("good");
  });
});
