const KEY_BYTES = 32;

function isOoshareHost(hostname: string): boolean {
  return (
    hostname === "ooshare.io" ||
    hostname === "www.ooshare.io" ||
    hostname.endsWith(".ooshare.io")
  );
}

export interface ParsedShareUrl {
  id: string;
  lang: string;
  /** base64url-encoded 32-byte master key, exactly as it appears in the fragment */
  key: string;
}

function decodeB64url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function buildShareUrl(
  origin: string,
  id: string,
  lang: string,
  keyB64url: string,
): string {
  const base = origin.replace(/\/+$/, "");
  const lng = lang || "en";
  return `${base}/s/${id}?lng=${lng}#${keyB64url}`;
}

export function parseShareUrl(raw: string): ParsedShareUrl {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error("Invalid URL");
  }
  if (!isOoshareHost(u.hostname)) {
    throw new Error("Missing secret id in URL path");
  }
  const path = u.pathname.replace(/^\/+/, "");
  const id = path.startsWith("s/") ? path.slice(2) : path;
  if (!id) throw new Error("Missing secret id in URL path");
  if (!u.hash) throw new Error("Missing master key in URL fragment");
  const key = u.hash.slice(1);
  if (decodeB64url(key).length !== KEY_BYTES) {
    throw new Error("Invalid master key in URL fragment");
  }
  return { id, lang: u.searchParams.get("lng") ?? "", key };
}
