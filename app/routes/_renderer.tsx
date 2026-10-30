import type { Context } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";
import { buildOgPath, ogImageAlt, toOgSnapshot } from "../og/params";
import { getBirthdayStatus } from "../utils";

const SITE_TITLE = "yamanoku birthday countdown";
const SITE_DESCRIPTION = "countdown @yamanoku birthday limit";
const SITE_URL = "https://birthday.yamanoku.net/";
const SITE_DOMAIN = "birthday.yamanoku.net";

export default jsxRenderer(({ children, title = SITE_TITLE }, c: Context) => {
  const snapshot = toOgSnapshot(getBirthdayStatus());
  const ogImage = new URL(buildOgPath(snapshot), c.req.url).href;
  const ogAlt = ogImageAlt(snapshot);

  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content={ogAlt} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="ja_JP" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content={SITE_DOMAIN} />
        <meta name="twitter:url" content={SITE_URL} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content={ogAlt} />
        <Script src="/app/client.ts" />
        <Link href="/app/style.css" rel="stylesheet" />
        <link
          rel="icon"
          type="image/x-icon"
          href="https://yamanoku.net/favicon.ico"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/reset-css@2.2.1/reset.css"
        />
      </head>
      <body class="text-white text-center px-10 bg-navy-blue">{children}</body>
    </html>
  );
});
