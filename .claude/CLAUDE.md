# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev       # Start dev server at http://localhost:3000
bun run build     # Build for production
bun run generate  # Static site generation
bun run preview   # Preview production build
```

Use **bun** as the package manager (bun.lock is present). Requires Node.js ≥ 24.14.0 (see `.nvmrc`). Run via nvm: `nvm use && bun run dev`.

> `better-sqlite3` is a native module — if it fails to load, rebuild it with:
> `cd node_modules/better-sqlite3 && node node_modules/.bin/node-gyp rebuild`
> using the node version from `.nvmrc` active in your shell.

## Context

Detailed context is split across two files in [`ai/context/`](ai/context/):

| File | Contents |
|---|---|
| [`ai/context/architecture.md`](ai/context/architecture.md) | Stack, directory layout, pages & routing, content system, environment variables |
| [`ai/context/conventions.md`](ai/context/conventions.md) | i18n patterns, styling, analytics, SEO |
