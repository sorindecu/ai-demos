# Agent Guidelines — Vectis Demo

This file provides instructions for AI coding agents (Claude, Cursor, Codex, Copilot, etc.) working in this repository.

## Project Overview

**Vectis Demo** is a Next.js 14 app (App Router) showcasing AI-powered business automation demos for two verticals: senior living and tax filing. It is used for client demos.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Linting/Formatting**: Biome (replaces ESLint + Prettier)
- **Git Hooks**: Lefthook

## Project Structure

```
app/                  # Next.js App Router pages and API routes
  api/                # API route handlers
    senior-living/
    tax-filing/
  demo/               # Demo page routes
    senior-living/
    tax-filing/
  layout.tsx          # Root layout with nav
  page.tsx            # Home/landing page
components/
  demo/               # Demo-specific components
  ui/                 # Shared UI components (FileUpload, StepIndicator, etc.)
lib/
  mockAI.ts           # Mock AI responses for demos
```

## Code Conventions

- Use TypeScript for all new files — no `.js` unless config files require it
- Prefer named exports over default exports for components
- Use Tailwind utility classes for all styling — no CSS modules or inline styles
- Keep API routes in `app/api/` following Next.js App Router conventions (`route.ts`)
- Mock AI responses live in `lib/mockAI.ts` — add new demo mocks there

## Before Committing

Lefthook runs automatically on commit and push. You can also run checks manually:

```bash
pnpm lint          # Biome lint
pnpm format        # Biome format
pnpm check         # Biome lint + format check (CI-safe, no writes)
pnpm type-check    # TypeScript type check
pnpm build         # Full Next.js build
```

All of these must pass before pushing. The pre-push hook runs `type-check` and `build`.

## Do Not

- Do not install ESLint or Prettier — Biome handles both
- Do not commit `.env` files or secrets
- Do not modify `pnpm-lock.yaml` manually
- Do not add `any` types without a `// biome-ignore` comment explaining why
