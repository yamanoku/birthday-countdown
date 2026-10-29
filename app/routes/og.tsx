import { createRoute } from "honox/factory";
import { buildOgPath, parseOgRequest } from "../og/params";
import { renderOgPng } from "../og/render";

const PNG_HEADERS = {
  "content-type": "image/png",
  "cache-control": "public, max-age=31536000, immutable",
  "x-content-type-options": "nosniff"
};

export default createRoute(async (c) => {
  const url = new URL(c.req.url);
  const parsed = parseOgRequest(url);
  if (!parsed) {
    return c.text("Bad Request", 400);
  }

  if (!parsed.canonical) {
    const canonical = new URL(buildOgPath(parsed.snapshot), url.origin);
    return c.redirect(canonical.href, 301);
  }

  const cacheKey = new Request(url.href, { method: "GET" });
  const cache = caches.default;
  const hit = await cache.match(cacheKey);
  if (hit) {
    return hit;
  }

  let png: Uint8Array;
  try {
    png = await renderOgPng(parsed.snapshot);
  } catch (error) {
    console.error(error);
    return c.text("Internal Server Error", 500);
  }

  const response = new Response(png, { status: 200, headers: PNG_HEADERS });
  c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
});
