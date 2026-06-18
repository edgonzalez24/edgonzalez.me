// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  experimental: { viewTransition: true },
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', language: 'es-SV', name: 'Español', file: 'es.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    vueI18n: './i18n/i18n.config.ts',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
  },
  sitemap: {
    autoLastmod: true,
    discoverImages: true,
    exclude: ["/app/**", "/api/**", "/_nuxt/**", "/__nuxt_content/**"],
    debug: false,
    xslColumns: [
      { label: "URL", width: "60%" },
      {
          label: "Images",
          width: "20%",
          select: "count(image:image)",
      },
      { label: "Last Modified", select: "sitemap:lastmod", width: "20%" },
    ],
  },
  robots: {
    disallow: ["/app/**", "/api/**", "/_nuxt/**"],
  },
  site: {
    name: 'Edwin González',
  },
  app: {
    head: {
      titleTemplate: '%s',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
  },
  router: {
    options: { scrollBehaviorType: "smooth" },
  },   
  modules: [
    '@nuxtjs/i18n',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/seo',
    '@vueuse/nuxt',
    'nuxt-umami'
  ],
  content: {
    build: {
      markdown: {}
    }
  },
  css: ['@/assets/css/main.css'],
  umami: {
    id: process.env.UNAMI_WEBSITE_ID || '',
    host: 'https://cloud.umami.is',
    autoTrack: true,
  },
  routeRules: {
    "/_nuxt/**": {
      cache: {
        maxAge: 2592000,
        staleMaxAge: 31536000,
      },
    },
    "/sitemap.xml": {
      isr: 3600,
    },
  },
  ui: {
    colorMode: false,
  },
})