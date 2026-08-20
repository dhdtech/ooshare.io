import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // The shared @ui components pull react/motion from ui/node_modules, but the
    // renderer (react-dom) lives in the extension's own node_modules. Force a
    // single React/motion copy so hooks resolve to the same dispatcher.
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react-dom/client", "motion", "motion/react", "framer-motion"],
    alias: {
      "@ui": path.resolve(__dirname, "../ui/src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    css: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["test/**", "entrypoints/**"],
      thresholds: { lines: 90, functions: 90, branches: 80, statements: 90 },
    },
  },
});
