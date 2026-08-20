/**
 * Minimal typed wrapper for the Meta (Facebook) Pixel's `fbq` global.
 * The pixel is loaded in index.html (fbevents.js + bootstrap); this module only
 * fires conversions from app code and is a safe no-op until the script loads.
 */

/** Signature of a single `fbq(event, name, payload)` call. */
export interface Fbq {
  (event: "trackCustom", name: "CreateSecret", payload: {
    ttl_hours: number;
    has_attachment: boolean;
    attachment_type: string | null;
  }): void;
  (event: "trackCustom", name: "CreateSecretFailed"): void;
}

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

export interface SecretCreatedPayload {
  ttl_hours: number;
  has_attachment: boolean;
  attachment_type: string | null;
}

/** Fire the "CreateSecret" conversion when a secret is successfully created. */
export function trackSecretCreated(payload: SecretCreatedPayload): void {
  window.fbq?.("trackCustom", "CreateSecret", payload);
}

/** Fire the "CreateSecretFailed" conversion when secret creation fails. */
export function trackSecretFailed(): void {
  window.fbq?.("trackCustom", "CreateSecretFailed");
}
