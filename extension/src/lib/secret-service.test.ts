import { describe, expect, it, vi } from "vitest";
import { createShare, revealShare } from "./secret-service";
import {
  generateKey,
  exportKey,
  importKey,
  encrypt,
  decrypt,
  encodePayload,
  decodePayload,
} from "@ui/lib/crypto";
import type { ImageAttachment } from "@ui/lib/crypto";

const ORIGIN = "https://ooshare.io";
const BASE = "https://api.ooshare.io";

function stubFetch(handler: (url: string, init?: RequestInit) => { status: number; body: unknown }) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      const r = handler(url, init);
      return {
        ok: r.status >= 200 && r.status < 300,
        status: r.status,
        json: () => Promise.resolve(r.body),
      } as Response;
    }),
  );
}

describe("secret-service", () => {
  it("createShare builds an interop share URL (decryptable by the same protocol)", async () => {
    let stored: { ciphertext: string; id: string; ttl: number } | null = null;
    stubFetch((url, init) => {
      if (url === `${BASE}/api/secrets` && init?.method === "POST") {
        const body = JSON.parse(init.body as string);
        stored = { ciphertext: body.ciphertext, id: body.id, ttl: body.ttl_hours };
        return { status: 201, body: { id: body.id, alias: "AbCdEf12" } };
      }
      return { status: 404, body: {} };
    });

    const res = await createShare({ text: "hunter2", ttlHours: 24, lang: "en" });
    expect(res.url).toMatch(
      /^https:\/\/ooshare\.io\/s\/AbCdEf12\?lng=en#[A-Za-z0-9_-]+$/,
    );
    expect(res.alias).toBe("AbCdEf12");

    // Decrypt the stored ciphertext with the key from the URL's fragment:
    // proves the extension output is readable by the standard protocol.
    const parsed = new URL(res.url);
    const key = await importKey(parsed.hash.slice(1));
    const payload = await decrypt(stored!.ciphertext, key, stored!.id);
    expect(decodePayload(payload).text).toBe("hunter2");
  });

  it("revealShare fetches, decrypts, and decodes text", async () => {
    // Build a secret with the real pipeline, then serve it via GET.
    const id = "10000000-1000-4000-8000-100000000000";
    const key = await generateKey();
    const ct = await encrypt(encodePayload("the-secret", undefined), key, id);
    const keyStr = await exportKey(key);

    stubFetch((url) => {
      if (url === `${BASE}/api/secrets/${id}`) {
        return { status: 200, body: { ciphertext: ct, id } };
      }
      return { status: 404, body: {} };
    });

    const out = await revealShare(`${ORIGIN}/s/${id}?lng=en#${keyStr}`);
    expect(out.id).toBe(id);
    expect(out.text).toBe("the-secret");
  });

  it("revealShare resolves an alias to the real uuid and decrypts with it", async () => {
    const id = "10000000-1000-4000-8000-100000000000";
    const key = await generateKey();
    const ct = await encrypt(encodePayload("via-alias", undefined), key, id);
    const keyStr = await exportKey(key);

    stubFetch((url) => {
      if (url === `${BASE}/api/secrets/AbCdEf12`) {
        // Server resolves alias -> uuid (the decrypt id)
        return { status: 200, body: { ciphertext: ct, id } };
      }
      return { status: 404, body: {} };
    });

    const out = await revealShare(`${ORIGIN}/s/AbCdEf12?lng=en#${keyStr}`);
    expect(out.text).toBe("via-alias");
  });

  it("createShare falls back to the uuid path and default lang when alias/lang are absent", async () => {
    let storedId = "";
    stubFetch((url, init) => {
      if (url === `${BASE}/api/secrets` && init?.method === "POST") {
        const body = JSON.parse(init.body as string);
        storedId = body.id;
        // Server returns no alias on the same request; lang not passed by caller.
        return { status: 201, body: { id: body.id, alias: null } };
      }
      return { status: 404, body: {} };
    });

    const res = await createShare({ text: "no-alias", ttlHours: 12 });
    expect(res.alias).toBeNull();
    expect(res.url.startsWith(`${ORIGIN}/s/${storedId}?lng=en#`)).toBe(true);
  });

  it("revealShare returns the attachment when the payload carries an image", async () => {
    const id = "10000000-1000-4000-8000-100000000000";
    const key = await generateKey();
    const img: ImageAttachment = {
      mime: "image/png",
      data: new Uint8Array([137, 80, 78, 71]),
    };
    const ct = await encrypt(encodePayload("with-image", img), key, id);
    const keyStr = await exportKey(key);

    stubFetch((url) => {
      if (url === `${BASE}/api/secrets/${id}`) {
        return { status: 200, body: { ciphertext: ct, id } };
      }
      return { status: 404, body: {} };
    });

    const out = await revealShare(`${ORIGIN}/s/${id}?lng=en#${keyStr}`);
    expect(out.attachment).toEqual({ mime: "image/png", data: img.data });
  });
});
