<template>
  <u-page>
    <u-page-body class="relative mx-auto max-w-screen-2xl md:px-8 pb-10 pt-24">
      <u-blog-posts>
        <u-blog-post
          v-for="article in articles"
          :key="article.path"
          class="shadow-2xl"
          :title="article.title"
          :description="article.description"
          :image="article.thumbnail"
          :authors="[{ name: article.author }]"
          :badge="isNew(article.date) ? { label: t('articles.newBadge'), color: 'primary' } : undefined"
          :date="article.date"
          :to="localePath(`/articles/${getSlug(article.path)}`)"
          variant="naked"
          @click="umTrackEvent(`cta-article-${getSlug(article.path)}`)"
        />
      </u-blog-posts>
    </u-page-body>
  </u-page>
</template>

<script lang="ts" setup>
const { t, locale } = useI18n()
const localePath = useLocalePath()

useSeoMeta({ title: t('seo.articles') })

const { data: enArticles } = await useAsyncData('en-articles', () =>
  queryCollection('en_articles').all()
)
const { data: esArticles } = await useAsyncData('es-articles', () =>
  queryCollection('es_articles').all()
)

const articles = computed(() => {
  const en = (enArticles.value ?? []).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (locale.value === 'en') return en

  const es = (esArticles.value ?? []).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Merge: ES articles take priority; EN fills in untranslated ones
  const esSlugs = new Set(es.map(a => getSlug(a.path)))
  const fallbacks = en.filter(a => !esSlugs.has(getSlug(a.path)))
  return [...es, ...fallbacks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

const getSlug = (path: string) => path.split('/').pop() ?? ''
const isNew = (date: Date | string) =>
  Math.abs(new Date().getTime() - new Date(date).getTime()) < 8.64e7 * 7
</script>
