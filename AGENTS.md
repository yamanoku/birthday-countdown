# AGENTS.md

## Cursor Cloud specific instructions

This is a single-product repo: a birthday countdown web app built with **HonoX** (Hono + file-based routing, SSR + client islands), **Tailwind CSS v4**, and the TC39 **Temporal** API, targeting **Cloudflare Workers**. There is no backend/database/auth — all countdown data is computed from the system clock, so no environment variables or secrets are needed for local development.

Standard commands live in `package.json` scripts; use those rather than duplicating them here:

- Dev server: `npm run dev` (Vite, serves at `http://localhost:5173/`). This is the single service needed to run/test the product end to end.
- Tests: `npm run test` (Vitest, in-source tests via `import.meta.vitest`, node environment).
- Lint/format: `npm run biome:ci` (check only) or `npm run biome` (writes fixes).
- Build: `npm run build` (client build then SSR build → `dist/`).
- Worker emulation (optional): `npm run preview` (`wrangler dev`, needs `npm run build` first).
- Deploy (optional, not for local dev): `npm run deploy` — requires Cloudflare credentials.

Non-obvious notes:

- The countdown target is fixed to Oct 30 (`Asia/Tokyo`); on non-birthday days the app shows a countdown, and on the birthday it switches to a celebration screen. To exercise the celebration branch without waiting, adjust the date logic in `app/utils.ts` locally (do not commit).
- In-source Vitest tests are stripped from production builds via the `import.meta.vitest` define in both `vite.config.ts` and `vitest.config.ts`.
- CI (`.github/workflows/biome.yml`) runs on Node 23.x, but the app runs fine on the Node 22.x provided by the VM (no `engines` constraint); no version manager switch is required.
