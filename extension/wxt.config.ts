import path from "node:path";
import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifestVersion: 3,
  manifest: {
    name: "ooshare — one-time secret sharing",
    description:
      "Create and reveal one-time secrets without leaving the page you are on.",
    browser_specific_settings: {
      gecko: {
        id: "ooshare-extension@ooshare.io",
        data_collection_permissions: { required: ["none"] },
      },
    },
    permissions: [
      "contextMenus",
      "activeTab",
      "scripting",
      "storage",
      "clipboardWrite",
    ],
    host_permissions: [
      "https://ooshare.io/*",
      "https://api.ooshare.io/*",
    ],
    web_accessible_resources: [
      {
        resources: ["overlay.html", "chunks/*", "assets/*", "fonts/*"],
        matches: ["<all_urls>"],
      },
    ],
    icons: {
      16: "icons/icon-16.png",
      32: "icons/icon-32.png",
      48: "icons/icon-48.png",
      128: "icons/icon-128.png",
    },
  },
  vite: () => ({
    resolve: {
      alias: {
        "@ui": path.resolve(__dirname, "../ui/src"),
      },
    },
  }),
});
