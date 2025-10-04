import pages from "@hono/vite-cloudflare-pages";
import adapter from "@hono/vite-dev-server/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [
      honox({
        devServer: { adapter },
        client: { input: ["/app/client.ts", "/app/style.css"] }
      }),
      pages(),
      tailwindcss()
    ]
  };
});
