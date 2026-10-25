import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    environmentMatchGlobs: [
      ["tests/component/**", "jsdom"],
      ["tests/unit/**", "node"],
      ["tests/integration/**", "node"],
    ],
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/unit/**/*.test.ts", "tests/**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", ".agents", "e2e/**"],
    testTimeout: 5000,
  },
});
