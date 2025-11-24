// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
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
  runtimeConfig: {
    public: {
      supabaseBucketUrl: process.env.SUPABASE_BUCKET_URL || '',
    }
  },
  robots: {
    disallow: ["/app/**", "/api/**", "/_nuxt/**"],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Edwin González - Frontend Developer',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
  },
  router: {
    options: { scrollBehaviorType: "smooth" },
  },   
  modules: [
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