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

## Stack

- **Nuxt 4** with `app/` as the source directory (Nuxt 4 convention)
- **Vue 3** with `<script setup lang="ts">` and Composition API
- **@nuxt/ui v4** — component library; customized via `app/app.config.ts` and CSS variables in `app/assets/css/main.css`
- **@nuxt/content v3** — Markdown-driven content with SQLite cache at `.data/content/contents.sqlite`
- **@nuxtjs/i18n v10** — internationalization with `prefix_except_default` strategy (EN = no prefix, ES = `/es/`)
- **Tailwind CSS v4** — imported via `@import "tailwindcss"` in main.css (no tailwind.config.js used)
- **TypeScript** throughout

## Architecture

### Directory layout (Nuxt 4 `app/` structure)

```
app/
  pages/          # File-based routing
  components/     # Header, Footer, LanguageSwitcher, content/ (prose components)
  layouts/        # default.vue wraps every page with Header + UContainer + Footer
  data/           # Static JSON (projects.json — projects list)
  assets/css/     # main.css — Tailwind + @nuxt/ui imports + CSS custom properties
  app.config.ts   # @nuxt/ui component slot/variant overrides
  app.vue         # Root: <NuxtLayout><NuxtPage>
  i18n.d.ts       # vue-i18n DefineLocaleMessage type extension (gives t() full type-safety)
content/
  articles/
    en/           # English markdown articles (default locale)
    es/           # Spanish markdown articles (add here to translate)
content.config.ts # Defines en_articles and es_articles collections
i18n/
  locales/
    en.json       # English translations (source of truth for DefineLocaleMessage types)
    es.json       # Spanish translations
  i18n.config.ts  # vue-i18n config (legacy: false, fallbackLocale: 'en')
nuxt.config.ts    # Modules, i18n config, runtimeConfig, routeRules, sitemap, umami
```

### Internationalization

The site supports **English** (default, no URL prefix) and **Spanish** (`/es/` prefix). Strategy: `prefix_except_default`.

**Adding a new article translation:**
1. Create `content/articles/es/your-slug.md` (same filename as the EN version)
2. The articles listing auto-merges both collections; untranslated articles show with EN content

**Adding a new UI string:**
1. Add the key to `i18n/locales/en.json` and `i18n/locales/es.json`
2. Use `const { t } = useI18n()` in `<script setup>` and `{{ t('key.path') }}` in template
3. For arrays/objects (e.g. experience jobs), use `tm('key')` and cast the result

**Key composables (auto-imported):**
- `useI18n()` → `{ t, tm, locale }` — from vue-i18n
- `useLocalePath()` → wraps a route path with the active locale prefix
- `useSwitchLocalePath()` → returns a function to switch locale while keeping current route

**i18n TypeScript:** `app/i18n.d.ts` extends `DefineLocaleMessage` from `i18n/locales/en.json`, giving `t()` full type-safety. If you add new keys to en.json, TypeScript will automatically infer them.

### Pages & routing

| Route | File | Data source |
|---|---|---|
| `/` | `pages/index.vue` | Cloudinary image via `useRuntimeConfig()` |
| `/about-me` | `pages/about-me.vue` | `t()` translations (experience in `i18n/locales/*.json`) |
| `/projects` | `pages/projects.vue` | `app/data/projects.json` |
| `/articles` | `pages/articles/index.vue` | `queryCollection('en_articles')` + `queryCollection('es_articles')` merged |
| `/articles/[id]` | `pages/articles/[id].vue` | locale-specific collection with EN fallback |
| `/es/*` | same files | i18n module adds locale prefix to all routes |

### Content system

Articles live under `content/articles/{locale}/`. The `content.config.ts` defines two collections:
- `en_articles` — source: `articles/en/**/*.md`
- `es_articles` — source: `articles/es/**/*.md`

Both share the same schema: `title`, `description`, `date`, `thumbnail`, optional `tags`, `author`.

**Article detail fallback pattern** (`[id].vue`):
```ts
const { locale } = useI18n()
// Try ES first, fall back to EN; isFallback drives the "translation unavailable" banner
if (locale.value === 'es') {
  const es = await queryCollection('es_articles').path(`/articles/es/${slug}`).first()
  if (es) return { article: es, isFallback: false }
}
return { article: await queryCollection('en_articles').path(`/articles/en/${slug}`).first(), isFallback: locale.value !== 'en' }
```

### Environment variables

| Variable | Purpose |
|---|---|
| `UNAMI_WEBSITE_ID` | Umami analytics site ID |

Thumbnail URLs in article frontmatter are full Cloudinary URLs (no base URL env var needed).

### Styling conventions

- The site is **dark-only** — `colorMode: false` in `nuxt.config.ts`, background hardcoded dark (`#1d1d1d`).
- `h1 > span` receives a gradient text treatment (blue → pink) via CSS.
- The animated "blob" background lives in `default.vue`, styled in `main.css`.
- Custom semantic color tokens (`primary`, `secondary`, `success`, `warning`, `error`, `info`) are defined under `@theme static` in `main.css`.

### Analytics

`nuxt-umami` auto-tracks page views. Manual event tracking uses `umTrackEvent(eventName)`, called on CTAs and nav clicks.

### SEO

`@nuxtjs/seo` and `@nuxtjs/sitemap` run globally. Article detail page sets per-page meta via `useSeoMeta()`, `useSchemaOrg()` (`defineArticle()`), and `defineOgImage()` in `[id].vue`.
