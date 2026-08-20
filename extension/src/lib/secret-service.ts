import {
  generateKey,
  exportKey,
  importKey,
  encrypt,
  decrypt,
  encodePayload,
  decodePayload,
} from "@ui/lib/crypto";
import { DEFAULT_API_BASE, createSecret, getSecret } from "./api";
import { buildShareUrl, parseShareUrl } from "./shareurl";

export const DEFAULT_ORIGIN = "https://ooshare.io";

export interface CreateAttachment {
  mime: string;
  data: ArrayBuffer;
}

export interface CreateOptions {
  text: string;
  attachment?: CreateAttachment;
  ttlHours: number;
  lang?: string;
  apiBase?: string;
  origin?: string;
}

export interface CreateShareResult {
  url: string;
  id: string;
  alias: string | null;
}

export function newSecretId(): string {
  return crypto.randomUUID();
}

export async function createShare(
  opts: CreateOptions,
): Promise<CreateShareResult> {
  const id = newSecretId();
  const key = await generateKey();
  const payload = encodePayload(opts.text, opts.attachment);
  const ciphertext = await encrypt(payload, key, id);
  const result = await createSecret(
    ciphertext,
    opts.ttlHours,
    id,
    opts.apiBase ?? DEFAULT_API_BASE,
  );
  const keyStr = await exportKey(key);
  const pathId = result.alias ?? result.id;
  const url = buildShareUrl(
    opts.origin ?? DEFAULT_ORIGIN,
    pathId,
    opts.lang ?? "en",
    keyStr,
  );
  payload.fill(0); // wipe plaintext buffer
  return { url, id: result.id, alias: result.alias };
}

export interface RevealShareResult {
  id: string;
  text: string;
  attachment?: { mime: string; data: Uint8Array };
}

export async function revealShare(
  rawUrl: string,
  apiBase?: string,
): Promise<RevealShareResult> {
  const parsed = parseShareUrl(rawUrl);
  const { ciphertext, id } = await getSecret(parsed.id, apiBase ?? DEFAULT_API_BASE);
  const key = await importKey(parsed.key);
  const bytes = await decrypt(ciphertext, key, id);
  const decoded = decodePayload(bytes);
  return {
    id,
    text: decoded.text,
    attachment: decoded.image
      ? { mime: decoded.image.mime, data: decoded.image.data }
      : undefined,
  };
}
