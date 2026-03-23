# CLAUDE.md — Vectis Demo

This file is read by Claude Code when working in this repository.

## Project

**Vectis Demo** — Next.js 14 (App Router) demo app showcasing AI-powered automation for senior living intake and tax filing workflows. Target audience: prospective clients. Demo date: April 24, 2026.

## Commands

```bash
pnpm dev            # Start dev server (localhost:3000)
pnpm build          # Production build
pnpm lint           # Biome lint (auto-fix)
pnpm format         # Biome format (auto-fix)
pnpm check          # Biome check without writing (for CI)
pnpm type-check     # TypeScript check only
```

## Architecture

- **App Router** — all pages and API routes live under `app/`
- **API routes** — `app/api/[vertical]/route.ts` pattern
- **Mock AI** — `lib/mockAI.ts` simulates AI responses; no real API keys needed for demos
- **Components** — shared UI in `components/ui/`, demo-specific in `components/demo/`

## Key Rules

1. **Biome over ESLint/Prettier** — do not install or use ESLint or Prettier
2. **TypeScript strict** — avoid `any`; use `// biome-ignore lint/suspicious/noExplicitAny: <reason>` if truly needed
3. **Tailwind only** — all styling via Tailwind utility classes
4. **No secrets in code** — use `.env.local` for any API keys (already gitignored)
5. **Run checks before committing** — `pnpm check && pnpm type-check`; lefthook runs this automatically

## Git Hooks (via Lefthook)

- **pre-commit**: Biome format + lint on staged files (auto-fixes and re-stages)
- **pre-push**: TypeScript type-check + full build

Activate hooks after install: `pnpm lefthook install`

## Demo Context

This is a **vibe-coded** demo app — keep changes focused, minimal, and working. The priority is a polished client-facing experience, not perfect code architecture. When in doubt, keep it simple and make it look good.
