# Edwin González — Portfolio

Personal portfolio and blog built with Nuxt 4, featuring bilingual content (English / Spanish) and Markdown-driven articles.

## Stack

- **[Nuxt 4](https://nuxt.com)** — full-stack Vue framework with SSR and file-based routing
- **[Vue 3](https://vuejs.org)** — Composition API with `<script setup>`
- **[@nuxt/ui v4](https://ui.nuxt.com)** — component library with custom design tokens
- **[@nuxt/content v3](https://content.nuxt.com)** — Markdown articles with SQLite cache
- **[@nuxtjs/i18n v10](https://i18n.nuxtjs.org)** — internationalization (EN / ES)
- **[Tailwind CSS v4](https://tailwindcss.com)** — utility-first CSS
- **[Bun](https://bun.sh)** — package manager and runtime

## Requirements

- Node.js `>= 24.14.0` (use [nvm](https://github.com/nvm-sh/nvm): `nvm use`)
- Bun `>= 1.3.2`

## Setup

```bash
nvm use
bun install
```

## Development

```bash
bun run dev
```

Starts the dev server at `http://localhost:3000`.

> **Note:** `better-sqlite3` is a native module. If it fails to load after switching Node.js versions, rebuild it:
> ```bash
> cd node_modules/better-sqlite3 && node node_modules/.bin/node-gyp rebuild
> ```

## Production

```bash
bun run build    # Build for production (SSR)
bun run generate # Static site generation
bun run preview  # Preview the production build locally
```

## Internationalization

The site supports **English** (default, no URL prefix) and **Spanish** (`/es/` prefix).

**Adding a translated article:**

1. Create the English version at `content/articles/en/your-slug.md`
2. Create the Spanish translation at `content/articles/es/your-slug.md`

If a Spanish translation doesn't exist, the article is shown in English with a notice banner.

**Adding UI translations:**

1. Add the key to `i18n/locales/en.json` and `i18n/locales/es.json`
2. Use `const { t } = useI18n()` in `<script setup>` and `{{ t('key') }}` in the template

## Article Frontmatter

```yaml
---
title: Your Article Title
description: Short description (min 10 chars)
date: 2025-01-01
author: Edwin González
thumbnail: /v1234567890/image-name.jpg  # Cloudinary path suffix
tags:
  - vue
  - nuxt
---
```
