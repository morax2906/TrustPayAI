# TrustPay AI: Structure and Code Conventions

## Layout
```
src/app/            Next.js App Router (layout.tsx, page.tsx, globals.css, fonts/)
plan&idea/          Planning docs (proposal, 8-day plan). Not code.
docs/archive/       Historical/vision-only docs (not build scope)
.kiro/steering/     These steering docs
```
Path alias: `@/*` maps to `./src/*`.

## Planned layout (follow when adding code)
```
src/app/(marketing)/   Static pages: landing, how-to-try, about, privacy (Quynh)
src/app/(app)/         Authenticated: scanner, report, dashboard, transactions, mock-momo
src/app/api/           Route handlers: analyze, health, import, auth
src/components/        UI (shadcn/ui in components/ui)
src/lib/risk/          Risk engine: deterministic signals, LLM layer, schema, fallback
src/lib/              db (Prisma client), auth, rate-limit, env
prisma/                schema.prisma, seed
eval/                  Ground-truth scam samples and precision/recall script
```

## Conventions
- TypeScript strict. No `any`. Prefer `unknown` plus validation at boundaries.
- Server Components by default. Add `"use client"` only when needed.
- Business logic lives in `src/lib`, not in route handlers or components. Handlers validate, call lib, return JSON.
- Tailwind for styling. Use the shared design tokens and layout set by Quyen. No ad hoc styles for static pages.
- Components: PascalCase files. Utilities and routes: kebab-case or Next.js conventions.
- Show empty, loading and error states for every data view.
- Match existing style in a file before changing it. Keep changes scoped to the task.

## Working agreements
- Stay inside your ownership area (see product.md). Static-page work must not touch auth, scan, dashboard or API code.
- Commit small and often. Do not commit `.env*` or build output.
- Add a prompt-injection and scam sample to `eval/` when you change risk logic, and report precision/recall.
