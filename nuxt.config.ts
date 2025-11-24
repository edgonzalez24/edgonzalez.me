// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      supabaseBucketUrl: process.env.SUPABASE_BUCKET_URL || '',
    }
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
  umami: {
    id: process.env.UNAMI_WEBSITE_ID || '',
    autoTrack: true,
  },
})