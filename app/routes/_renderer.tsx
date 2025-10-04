import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <title>{title}</title>
        <meta name="description" content="countdown @yamanoku birthday limit" />
        <meta
          property="og:url"
          content="https://yamanoku-birthday.pages.dev/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="yamanoku birthday countdown" />
        <meta
          property="og:description"
          content="countdown @yamanoku birthday limit"
        />
        <meta
          property="og:image"
          content="https://yamanoku.net/og-images/birthday-countdown.png"
        />
        <meta name="og:locale" content="ja_JP" />
        <meta name="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="yamanoku-birthday.pages.dev" />
        <meta
          property="twitter:url"
          content="https://yamanoku-birthday.pages.dev/"
        />
        <meta name="twitter:title" content="yamanoku birthday countdown" />
        <meta
          name="twitter:description"
          content="countdown @yamanoku birthday limit"
        />
        <meta
          name="twitter:image"
          content="https://yamanoku.net/og-images/birthday-countdown.png"
        />
        <Script src="/app/client.ts" async />
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
