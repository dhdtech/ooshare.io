import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_API_BASE, createSecret, getSecret } from "./api";

const BASE = "https://api.ooshare.io";

function mockFetchOnce(status: number, body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    }),
  );
}

function mockFetchNonJson(status: number) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: false,
      status,
      json: () => Promise.reject(new Error("invalid json")),
    }),
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("api", () => {
  it("uses the absolute API base", () => {
    expect(DEFAULT_API_BASE).toBe(BASE);
  });

  it("createSecret posts ciphertext/ttl/id and returns id+alias", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: "uuid-1", alias: "AbCdEf12" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await createSecret("ct", 24, "uuid-1");
    expect(res).toEqual({ id: "uuid-1", alias: "AbCdEf12" });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`${BASE}/api/secrets`);
    expect(JSON.parse(init.body)).toEqual({
      ciphertext: "ct",
      ttl_hours: 24,
      id: "uuid-1",
    });
  });

  it("createSecret surfaces the server error message", async () => {
    mockFetchOnce(400, { error: "ciphertext is required" });
    await expect(createSecret("", 24, "x")).rejects.toThrow(
      "ciphertext is required",
    );
  });

  it("getSecret returns ciphertext + resolved id", async () => {
    mockFetchOnce(200, { ciphertext: "ct", id: "real-uuid" });
    const res = await getSecret("AbCdEf12");
    expect(res).toEqual({ ciphertext: "ct", id: "real-uuid" });
  });

  it("getSecret maps 404 to not-found/already-viewed", async () => {
    mockFetchOnce(404, { error: "Not found" });
    await expect(getSecret("AbCdEf12")).rejects.toThrow(
      "Secret not found or already viewed",
    );
  });

  it("createSecret returns null alias when the server omits it", async () => {
    mockFetchOnce(201, { id: "uuid-2" });
    const res = await createSecret("ct", 24, "uuid-2");
    expect(res).toEqual({ id: "uuid-2", alias: null });
  });

  it("getSecret surfaces a generic server error (non-404)", async () => {
    mockFetchOnce(500, { error: "internal error" });
    await expect(getSecret("AbCdEf12")).rejects.toThrow("internal error");
  });

  it("falls back to the default message when the error body is not JSON", async () => {
    mockFetchNonJson(400);
    await expect(createSecret("", 24, "x")).rejects.toThrow(
      "Failed to create secret",
    );
  });
});
