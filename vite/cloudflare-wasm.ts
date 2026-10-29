import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const MARK = "__CF_WASM__";
const END = "__END_CF_WASM__";

/**
 * Vite は .wasm を fetch して WebAssembly.instantiate する。
 * Workers はバイト列からのコンパイルを禁止するので、ビルド成果物には
 * `import x from "./file.wasm"` を残し、Wrangler に事前コンパイルさせる。
 */
export const cloudflareWasmModule = (): Plugin => {
  const wasmFiles = new Set<string>();

  return {
    name: "cloudflare-wasm-module",
    enforce: "pre",
    apply(_config, env) {
      return env.command === "build" && env.mode !== "client";
    },
    config() {
      return {
        ssr: {
          resolve: {
            conditions: ["workerd", "worker", "module", "browser"]
          }
        }
      };
    },
    async resolveId(source, importer, options) {
      const [pathname, query] = source.split("?");
      if (!pathname?.endsWith(".wasm") || (query && query !== "module")) {
        return null;
      }

      const resolved = await this.resolve(pathname, importer, {
        skipSelf: true,
        ...options
      });
      if (!resolved) {
        return null;
      }

      const file = resolved.id.split("?")[0];
      if (!file?.endsWith(".wasm")) {
        return null;
      }

      wasmFiles.add(file);
      return { id: `${MARK}${file}${END}`, external: true };
    },
    renderChunk(code) {
      if (!code.includes(MARK)) {
        return null;
      }

      const next = code.replaceAll(
        new RegExp(`${MARK}(.+?)${END}`, "g"),
        (_match, file: string) => `./${path.basename(file)}`
      );

      return { code: next, map: null };
    },
    // Vite の worker ビルドは emit した asset を落とすので、WASM は自分で隣に置く。
    writeBundle(options) {
      const directory = options.dir;
      if (!directory) {
        return;
      }

      for (const file of wasmFiles) {
        writeFileSync(
          path.join(directory, path.basename(file)),
          readFileSync(file)
        );
      }
    }
  };
};
