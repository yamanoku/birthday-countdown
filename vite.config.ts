import build from "@hono/vite-build/cloudflare-workers";
import adapter from "@hono/vite-dev-server/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import { defineConfig } from "vite";
import { ogAssets } from "./vite/og-assets.ts";

export default defineConfig(() => {
  return {
    define: {
      // 本番ビルドからin-sourceテスト(import.meta.vitestブロック)を除去する
      "import.meta.vitest": "undefined"
    },
    plugins: [
      ogAssets(),
      honox({
        devServer: { adapter },
        client: { input: ["/app/client.ts", "/app/style.css"] }
      }),
      build(),
      tailwindcss()
    ]
  };
});
