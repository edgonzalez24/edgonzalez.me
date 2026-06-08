# Architecture

## Stack

- **Nuxt 4** with `app/` as the source directory (Nuxt 4 convention)
- **Vue 3** with `<script setup lang="ts">` and Composition API
- **@nuxt/ui v4** — component library; customized via `app/app.config.ts` and CSS variables in `app/assets/css/main.css`
- **@nuxt/content v3** — Markdown-driven content with SQLite cache at `.data/content/contents.sqlite`
- **@nuxtjs/i18n v10** — internationalization with `prefix_except_default` strategy (EN = no prefix, ES = `/es/`)
- **Tailwind CSS v4** — imported via `@import "tailwindcss"` in main.css (no tailwind.config.js used)
- **TypeScript** throughout

## Directory Layout (Nuxt 4 `app/` structure)

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

## Pages & Routing

| Route | File | Data source |
|---|---|---|
| `/` | `pages/index.vue` | Cloudinary image via `useRuntimeConfig()` |
| `/about-me` | `pages/about-me.vue` | `t()` translations (experience in `i18n/locales/*.json`) |
| `/projects` | `pages/projects.vue` | `app/data/projects.json` |
| `/articles` | `pages/articles/index.vue` | `queryCollection('en_articles')` + `queryCollection('es_articles')` merged |
| `/articles/[id]` | `pages/articles/[id].vue` | locale-specific collection with EN fallback |
| `/es/*` | same files | i18n module adds locale prefix to all routes |

## Content System

Articles live under `content/articles/{locale}/`. The `content.config.ts` defines two collections:
- `en_articles` — source: `articles/en/**/*.md`
- `es_articles` — source: `articles/es/**/*.md`

Both share the same schema: `title`, `description`, `date`, `thumbnail`, optional `tags`, `author`.

**Article detail fallback pattern** (`[id].vue`):
```ts
const { locale } = useI18n()
// Try locale-specific first, fall back to EN; isFallback drives the "translation unavailable" banner
if (locale.value === 'es') {
  const es = await queryCollection('es_articles').path(`/articles/es/${slug}`).first()
  if (es) return { article: es, isFallback: false }
}
return { article: await queryCollection('en_articles').path(`/articles/en/${slug}`).first(), isFallback: locale.value !== 'en' }
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `UNAMI_WEBSITE_ID` | Umami analytics site ID |

Thumbnail URLs in article frontmatter are full Cloudinary URLs (no base URL env var needed).
