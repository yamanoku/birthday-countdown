import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    includeSource: ["app/**/*.ts"]
  },
  define: {
    "import.meta.vitest": "undefined"
  }
});
