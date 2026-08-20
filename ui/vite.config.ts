/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sri from "vite-plugin-sri";

export default defineConfig({
  plugins: [react(), sri()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react-router") || id.includes("node_modules/react/")) return "vendor";
          if (id.includes("node_modules/i18next") || id.includes("node_modules/react-i18next")) return "i18n";
          if (id.includes("node_modules/posthog")) return "analytics";
          if (id.includes("/content/blog")) return "blog";
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    watch: {
      usePolling: true,
      interval: 300,
    },
    proxy: {
      "/api": "http://api:5000",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/test/**", "src/main.tsx", "src/vite-env.d.ts"],
    },
  },
});
