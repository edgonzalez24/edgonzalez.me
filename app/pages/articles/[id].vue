<template>
  <u-page :ui="{ center: 'lg:col-span-7!' }" class="relative mx-auto max-w-screen-2xl md:px-8 pb-10 pt-24 bg-transparent">
    <template #right>
      <u-page-aside :ui="{ root: 'lg:col-span-3!' }">
        <u-page-anchors
          :links="[{ label: t('articles.allArticles'), icon: 'material-symbols:article-rounded', to: localePath('/articles/') }]"
        />
        <u-separator type="dotted" />
        <u-content-toc v-if="article" :links="article.body.toc?.links" highlight />
        <u-field-group class="w-full mt-10">
          <u-button
            :label="t('articles.shareArticle')"
            icon="material-symbols:share"
            variant="subtle"
            color="neutral"
            class="grow"
            @click="share"
          />
          <u-dropdown-menu :items="[{ label: t('articles.copyUrl'), icon: 'mdi:link-variant', onSelect: copyLink }]">
            <u-button icon="i-lucide-chevron-down" variant="subtle" color="neutral" />
          </u-dropdown-menu>
        </u-field-group>
      </u-page-aside>
    </template>

    <!-- Fallback notice when showing EN article in ES locale -->
    <u-alert
      v-if="isFallback"
      icon="material-symbols:translate-rounded"
      color="neutral"
      variant="subtle"
      :description="t('articles.fallbackNotice')"
      class="mb-6"
    />

    <u-page-header :title="article?.title" :description="article?.description" :headline="t('articles.headline')">
      <div class="flex items-end flex-wrap gap-4 justify-between mt-4">
        <div class="flex flex-col gap-4">
          <u-user
            :name="article?.author"
            class="cursor-default"
            @click="() => authorEl?.scrollIntoView()"
          />
          <div class="flex flex-row gap-2 items-center flex-wrap">
            <u-badge v-for="k in article?.tags" :key="k" color="primary" variant="soft">{{ k }}</u-badge>
          </div>
        </div>
        <div class="flex flex-row items-center gap-4">
          <p class="flex flex-row items-center gap-1 typ-sublabel">
            <icon name="material-symbols:calendar-today-rounded" class="text-primary" />
            {{ dayjs(article?.date).format('DD MMM YYYY') }}
          </p>
          <p class="flex flex-row items-center gap-1 typ-sublabel">
            <icon name="material-symbols:alarm-rounded" class="text-primary" />
            {{ readingTimeText }}
          </p>
        </div>
      </div>
    </u-page-header>

    <u-content-toc v-if="article" :links="article.body.toc?.links" highlight class="lg:hidden" />

    <u-page-body>
      <ContentRenderer v-if="article" id="content" :value="article" class="markdown-content flex-1" />
      <u-separator />
      <p class="font-semibold">{{ t('articles.relatedArticles') }}</p>
      <u-blog-posts id="related-articles">
        <u-blog-post
          v-for="article in links"
          :key="article.path"
          :title="article.title"
          :image="article.thumbnail"
          :authors="[{ name: article.author }]"
          :badge="isNew(article.date) ? { label: t('articles.newBadge'), color: 'primary' } : undefined"
          :date="article.date"
          :to="localePath(`/articles/${getSlug(article.path)}`)"
          variant="subtle"
        />
      </u-blog-posts>
      <u-content-surround :surround="surroundLinks" />
    </u-page-body>
  </u-page>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import l from 'lodash'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const authorEl = ref<HTMLElement | null>()
const clipboard = useClipboard()
const toast = useToast()

const slug = computed(() => route.params.id as string)

// Fetch article: prefer current locale, fall back to EN
const { data } = await useAsyncData(`article-${locale.value}-${slug.value}`, async () => {
  if (locale.value === 'es') {
    const es = await queryCollection('es_articles')
      .path(`/articles/es/${slug.value}`)
      .first()
    if (es) return { article: es, isFallback: false }
  }
  const en = await queryCollection('en_articles')
    .path(`/articles/en/${slug.value}`)
    .first()
  return en ? { article: en, isFallback: locale.value !== 'en' } : null
})

const article = computed(() => data.value?.article ?? null)
const isFallback = computed(() => data.value?.isFallback ?? false)
const readingTimeText = computed(() => (article.value?.meta as Record<string, unknown> | undefined)?.readingTime as string | undefined)

// Related articles always from EN collection (widest coverage)
const { data: links } = await useAsyncData(`linked-${locale.value}-${slug.value}`, async () => {
  const res = await queryCollection('en_articles')
    .where('path', 'NOT LIKE', article.value?.path ?? '')
    .all()
  return l
    .orderBy(res, a => l.intersection(a.tags, article.value?.tags).length, 'desc')
    .slice(0, 5)
})

// Surround from EN collection for consistent navigation
const { data: surroundLinks } = await useAsyncData(`${slug.value}-surround`, () =>
  queryCollectionItemSurroundings('en_articles', article.value?.path ?? '', {
    fields: ['description'],
  })
)


const getSlug = (path: string) => path.split('/').pop() ?? ''
const isNew = (date: Date | string) =>
  Math.abs(new Date().getTime() - new Date(date).getTime()) < 8.64e7 * 7

const copyLink = async () => {
  await clipboard.copy(window.location.href)
  toast.add({ title: t('articles.copiedToClipboard'), icon: 'material-symbols:check-circle-rounded', color: 'success' })
}
const share = async () => {
  await navigator.share({ url: route.fullPath })
}

// Reactive getters ensure meta is set on SSR and updated on client navigation
useSeoMeta({
  title: () => article.value?.title ?? '',
  description: () => article.value?.description ?? '',
  ogImage: () => article.value?.thumbnail ?? '',
  twitterImage: () => article.value?.thumbnail ?? '',
})

// article is guaranteed to be loaded here (awaited above), so these run correctly in SSR
if (article.value) {
  useSchemaOrg([
    defineArticle({
      headline: article.value.title,
      description: article.value.description,
      image: article.value.thumbnail ?? '',
      datePublished: dayjs(article.value.date, 'YYYY-MM-DD').toDate().toString(),
      keywords: article.value.tags,
      author: { name: article.value.author },
    }),
  ])
  defineOgImage({ url: article.value.thumbnail ?? '' })
}
</script>
