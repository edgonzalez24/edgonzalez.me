# Conventions

## Internationalization (i18n)

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

**TypeScript:** `app/i18n.d.ts` extends `DefineLocaleMessage` from `i18n/locales/en.json`, giving `t()` full type-safety. New keys added to `en.json` are automatically inferred.

## Styling

- The site is **dark-only** — `colorMode: false` in `nuxt.config.ts`, background hardcoded dark (`#1d1d1d`).
- `h1 > span` receives a gradient text treatment (blue → pink) via CSS.
- The animated "blob" background lives in `default.vue`, styled in `main.css`.
- Custom semantic color tokens (`primary`, `secondary`, `success`, `warning`, `error`, `info`) are defined under `@theme static` in `main.css`.
- No `tailwind.config.js` — Tailwind v4 is configured entirely via CSS imports and `@theme`.

## Analytics

`nuxt-umami` auto-tracks page views. Manual event tracking uses `umTrackEvent(eventName)`, called on CTAs and nav clicks.

## SEO

`@nuxtjs/seo` and `@nuxtjs/sitemap` run globally. Article detail page sets per-page meta via `useSeoMeta()`, `useSchemaOrg()` (`defineArticle()`), and `defineOgImage()` in `[id].vue`.
