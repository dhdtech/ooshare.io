export const MENU_REVEAL = "ooshare-reveal";
export const MENU_CREATE = "ooshare-create";

export interface RevealPayload {
  text: string;
  attachment?: { mime: string; data: Uint8Array };
}

export type ContentMessage =
  | { type: "ooshare:reveal"; payload: RevealPayload }
  | { type: "ooshare:created"; url: string }
  | { type: "ooshare:error"; title: string; message: string; fallbackUrl?: string };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isReveal(msg: Record<string, unknown>): boolean {
  const payload = msg.payload;
  if (!isRecord(payload) || typeof payload.text !== "string") return false;
  if (payload.attachment === undefined) return true;
  return (
    isRecord(payload.attachment) &&
    typeof payload.attachment.mime === "string" &&
    payload.attachment.data instanceof Uint8Array
  );
}

export function isContentMessage(msg: unknown): msg is ContentMessage {
  if (!isRecord(msg) || typeof msg.type !== "string") return false;
  switch (msg.type) {
    case "ooshare:reveal":
      return isReveal(msg);
    case "ooshare:created":
      return typeof msg.url === "string";
    case "ooshare:error":
      return (
        typeof msg.title === "string" &&
        typeof msg.message === "string" &&
        (msg.fallbackUrl === undefined || typeof msg.fallbackUrl === "string")
      );
    default:
      return false;
  }
}
