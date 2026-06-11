import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";

const SITE_TITLE = "yamanoku birthday countdown";
const SITE_DESCRIPTION = "countdown @yamanoku birthday limit";
const SITE_URL = "https://yamanoku-birthday.pages.dev/";
const SITE_DOMAIN = "yamanoku-birthday.pages.dev";
const OG_IMAGE = "https://yamanoku.net/og-images/birthday-countdown.png";

export default jsxRenderer(({ children, title = SITE_TITLE }) => {
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
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:locale" content="ja_JP" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:domain" content={SITE_DOMAIN} />
        <meta name="twitter:url" content={SITE_URL} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />
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
