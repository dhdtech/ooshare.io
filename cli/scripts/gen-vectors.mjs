// Regenerates the golden vectors in internal/crypto/vectors_test.go.
// Requires Node >= 18 (Web Crypto API). Run: node scripts/gen-vectors.mjs
import { webcrypto } from "node:crypto";
const { subtle } = webcrypto;
const enc = new TextEncoder();

const masterKey = new Uint8Array(32).map((_, i) => i);
const secretId = "10000000-1000-4000-8000-100000000000";
const iv = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
const aad = enc.encode(secretId);

console.log("MASTER_KEY_B64URL:", Buffer.from(masterKey).toString("base64url"));

async function golden(label, payload) {
  const rawKey = await subtle.importKey("raw", masterKey, "HKDF", false, ["deriveKey"]);
  const dk = await subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: enc.encode("only-once-share-v1"), info: enc.encode(secretId) },
    rawKey, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const ct = await subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad }, dk, payload);
  const combined = new Uint8Array(1 + iv.length + ct.byteLength);
  combined[0] = 0x01;
  combined.set(iv, 1);
  combined.set(new Uint8Array(ct), 1 + iv.length);
  console.log(label + ":", Buffer.from(combined).toString("base64"));
}

(async () => {
  await golden("TEXT_CIPHERTEXT", new Uint8Array([0x00, ...Buffer.from("Hello, World!", "utf8")]));
  const text = Buffer.from("Caption", "utf8");
  const mime = Buffer.from("image/png", "utf8");
  const image = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
  const img = new Uint8Array(1 + 4 + text.length + 1 + mime.length + image.length);
  img[0] = 0x01;
  new DataView(img.buffer).setUint32(1, text.length, false);
  img.set(text, 5);
  img[5 + text.length] = mime.length;
  img.set(mime, 6 + text.length);
  img.set(image, 6 + text.length + mime.length);
  await golden("IMG_CIPHERTEXT", img);
})();
