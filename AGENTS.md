<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — start dev server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint (next core-web-vitals + typescript)
- `npx prisma migrate dev --name <name>` — create/apply migrations
- No test runner exists. No test scripts, no jest/vitest config.
- No `typecheck` script. Use `npx tsc --noEmit` if needed.

## Setup

1. Copy `.env.example` → `.env`
2. Set `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET` in `.env`
3. `npx prisma migrate dev --name init` (creates tables)
4. `npm run dev`

`postinstall` runs `prisma generate` automatically on `npm install`.

## Architecture

- **Next.js 16 App Router** + TypeScript. Path alias `@/*` → `./src/*`.
- **Prisma ORM** with **MySQL** (`prisma/schema.prisma` line 6). Note: README.md incorrectly says PostgreSQL — trust the schema.
- **NextAuth.js v4** — Credentials Provider, JWT strategy, roles (`ADMIN` / `PESERTA`) stored in token.
- **Zod 4** — import from `zod/v4`, not `zod`.
- **Tailwind CSS 4** via PostCSS plugin (`@tailwindcss/postcss`).
- Indonesian language throughout (UI, comments, code).

## Project structure

- `src/app/api/` — API routes (auth, events, registrations, check-in, admin stats)
- `src/app/admin/` — Admin pages (dashboard, events CRUD, check-in)
- `src/app/user/` — User pages (ticket history)
- `src/app/events/` — Public event listing & detail
- `src/lib/prisma.ts` — Prisma singleton (dev hot-reload safe)
- `src/lib/auth.ts` — NextAuth config
- `src/lib/validations.ts` — All Zod schemas (register, login, event, registration, check-in)
- `src/types/next-auth.d.ts` — Session type augmentation
- `prisma.config.ts` — Prisma config (uses `prisma/config` defineConfig)

## Gotchas

- `serverExternalPackages: ["@prisma/client", "bcrypt"]` in `next.config.ts` — these are excluded from bundling.
- Prisma singleton pattern in `src/lib/prisma.ts` stores client on `globalThis` in dev to avoid connection exhaustion during hot-reload.
- Session types are augmented via declaration merging in `src/types/next-auth.d.ts` — cast `session.user` to access `id` and `role`.
- No CI, no pre-commit hooks, no automated quality gates. Lint before pushing manually.
