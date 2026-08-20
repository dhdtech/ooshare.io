import { browser } from "wxt/browser";
import { MENU_CREATE, MENU_REVEAL, type ContentMessage } from "../src/lib/messages";
import { createShare, revealShare } from "../src/lib/secret-service";

async function injectContent(tabId: number): Promise<void> {
  try {
    await browser.scripting.executeScript({
      target: { tabId },
      files: ["/content-scripts/content.js"],
    });
  } catch {
    // Already injected (e.g. running on ooshare.io) — safe to ignore.
  }
}

async function sendToTab(tabId: number, msg: ContentMessage): Promise<void> {
  await injectContent(tabId);
  await browser.tabs.sendMessage(tabId, msg);
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    await browser.contextMenus.create({
      id: MENU_REVEAL,
      title: "Reveal ooshare secret",
      contexts: ["link"],
      targetUrlPatterns: ["*://ooshare.io/s/*"],
    });
    await browser.contextMenus.create({
      id: MENU_CREATE,
      title: "Share with ooshare",
      contexts: ["selection"],
    });
  });

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    const tabId = tab?.id;
    if (tabId == null) return;
    try {
      if (info.menuItemId === MENU_REVEAL && info.linkUrl) {
        const res = await revealShare(info.linkUrl);
        await sendToTab(tabId, { type: "ooshare:reveal", payload: res });
      } else if (info.menuItemId === MENU_CREATE && info.selectionText) {
        const created = await createShare({
          text: info.selectionText,
          ttlHours: 24,
        });
        await sendToTab(tabId, { type: "ooshare:created", url: created.url });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      await sendToTab(tabId, {
        type: "ooshare:error",
        title: "ooshare",
        message,
        fallbackUrl: info.linkUrl,
      });
    }
  });
});
