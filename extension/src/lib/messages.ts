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

export function isContentMessage(msg: unknown): msg is ContentMessage {
  return (
    typeof msg === "object" &&
    msg !== null &&
    "type" in msg &&
    (msg as { type: string }).type.startsWith("ooshare:")
  );
}
