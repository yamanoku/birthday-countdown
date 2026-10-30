import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, sep } from "node:path";
import type { Plugin } from "vite";
import {
  eachOgSnapshot,
  ogAssetCount,
  ogAssetFilename,
  parseOgAssetPath
} from "../app/og/params.ts";
import { renderOgPng } from "../app/og/render.ts";

/**
 * OG 画像をビルド時に dist/og へ書き出す。
 * リクエスト時に描くと Workers Free の CPU 10ms を超える。
 * 静的アセットは Worker を起動しない。日付ごとの画像と、前日・誕生日の画像だけを書く。
 */
export const ogAssets = (): Plugin => {
  let command = "";
  let mode = "";
  let root = "";
  let outDir = "";
  let fontData: Uint8Array | undefined;

  const loadFont = (): Uint8Array => {
    fontData ??= new Uint8Array(
      readFileSync(join(root, "app/og/fonts/NotoSansJP-subset.woff2"))
    );
    return fontData;
  };

  return {
    name: "og-assets",
    configResolved(config) {
      command = config.command;
      mode = config.mode;
      root = config.root;
      outDir = config.build.outDir;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") {
          next();
          return;
        }

        let pathname = "";
        try {
          pathname = new URL(req.url ?? "/", "http://localhost").pathname;
        } catch {
          next();
          return;
        }

        const snapshot = parseOgAssetPath(pathname);
        if (!snapshot) {
          next();
          return;
        }

        try {
          const png = await renderOgPng(snapshot, loadFont());
          res.writeHead(200, {
            "content-type": "image/png",
            "cache-control": "no-cache",
            "content-length": String(png.byteLength)
          });
          res.end(req.method === "HEAD" ? undefined : png);
        } catch (error) {
          console.error(error);
          res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
          res.end("Internal Server Error");
        }
      });
    },
    async closeBundle() {
      if (command !== "build" || mode !== "client") {
        return;
      }

      const ogDir = join(outDir, "og");
      if (!ogDir.endsWith(`${sep}og`)) {
        throw new Error(`unexpected og directory: ${ogDir}`);
      }

      rmSync(ogDir, { recursive: true, force: true });
      mkdirSync(ogDir, { recursive: true });

      const font = loadFont();
      const total = ogAssetCount;
      const started = Date.now();
      let count = 0;
      console.log(`og: generating ${total} images`);

      for (const snapshot of eachOgSnapshot()) {
        const png = await renderOgPng(snapshot, font);
        writeFileSync(join(ogDir, ogAssetFilename(snapshot)), png);
        count += 1;
        if (count % 500 === 0) {
          console.log(`og: ${count}/${total}`);
        }
      }

      if (count !== total) {
        throw new Error(`og: wrote ${count}, expected ${total}`);
      }

      const seconds = ((Date.now() - started) / 1000).toFixed(1);
      console.log(`og: wrote ${count} images in ${seconds}s`);
    }
  };
};
