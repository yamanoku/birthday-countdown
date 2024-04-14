import { Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'
import { htmlClass, bodyClass } from '../css/classNames';

export default jsxRenderer(({ children, title }) => {
  return (
    <html class={htmlClass} lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content="countdown @yamanoku birthday limit" />
        <meta name="image" content="https://yamanoku.net/og-images/birthday-countdown.png" />
        <meta itemprop="name" content="yamanoku birthday countdown" />
        <meta itemprop="description" content="countdown @yamanoku birthday limit" />
        <meta itemprop="image" content="https://yamanoku.net/og-images/birthday-countdown.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="yamanoku birthday countdown" />
        <meta name="twitter:description" content="countdown @yamanoku birthday limit" />
        <meta name="og:title" content="yamanoku birthday countdown" />
        <meta name="og:description" content="countdown @yamanoku birthday limit" />
        <meta name="og:url" content="https://yamanoku.net/birthday-countdown-js/" />
        <meta name="og:site_name" content="yamanoku.net" />
        <meta name="og:image" content="https://yamanoku.net/og-images/birthday-countdown.png" />
        <meta name="og:locale" content="ja_JP" />
        <meta name="og:type" content="website" />
        <Script src="/app/client.ts" />
        <Style />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@2.2.1/reset.css" />
      </head>
      <body class={bodyClass}>
        {children}
      </body>
    </html>
  )
})
