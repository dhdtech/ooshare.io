import { describe, expect, it } from "vitest";
import { generateKey, exportKey, importKey, encrypt, decrypt } from "@ui/lib/crypto";

describe("shared @ui crypto (smoke)", () => {
  it("round-trips via the real WebCrypto pipeline", async () => {
    const key = await generateKey();
    const id = "10000000-1000-4000-8000-100000000000";
    const ct = await encrypt(new TextEncoder().encode("hi"), key, id);
    const out = await decrypt(ct, await importKey(await exportKey(key)), id);
    expect(new TextDecoder().decode(out)).toBe("hi");
  });
});
