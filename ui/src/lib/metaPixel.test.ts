import { describe, it, expect, vi, afterEach } from "vitest";
import { trackSecretCreated, trackSecretFailed } from "./metaPixel";

afterEach(() => {
  delete (window as { fbq?: unknown }).fbq;
});

describe("metaPixel", () => {
  it("calls fbq('trackCustom','CreateSecret',payload) with the exact payload when fbq is a function", () => {
    const fbq = vi.fn();
    window.fbq = fbq as never;

    const payload = {
      ttl_hours: 24,
      has_attachment: false,
      attachment_type: null,
    };
    trackSecretCreated(payload);

    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith("trackCustom", "CreateSecret", payload);
  });

  it("calls fbq('trackCustom','CreateSecretFailed') when fbq is a function", () => {
    const fbq = vi.fn();
    window.fbq = fbq as never;

    trackSecretFailed();

    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith("trackCustom", "CreateSecretFailed");
  });

  it("trackSecretCreated is a safe no-op when window.fbq is undefined", () => {
    expect(() => trackSecretCreated({ ttl_hours: 1, has_attachment: true, attachment_type: "pdf" })).not.toThrow();
  });

  it("trackSecretFailed is a safe no-op when window.fbq is undefined", () => {
    expect(() => trackSecretFailed()).not.toThrow();
  });
});
