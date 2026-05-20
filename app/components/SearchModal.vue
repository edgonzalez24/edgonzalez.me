<script lang="ts" setup>
const isOpen = useSearchModal()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const query = ref('')
const debouncedQuery = refDebounced(query, 250)

watch(isOpen, (open) => {
  if (!open) query.value = ''
})

useEventListener('keydown', (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isOpen.value = !isOpen.value
  }
})

const getSlug = (path: string) => path.split('/').pop() ?? ''

const { data: results, status } = await useAsyncData(
  'article-search',
  async () => {
    const q = debouncedQuery.value.trim()
    if (!q) return []

    if (locale.value === 'es') {
      const [esResults, enResults] = await Promise.all([
        queryCollection('es_articles')
          .where('title', 'LIKE', `%${q}%`)
          .orWhere(g => g.where('description', 'LIKE', `%${q}%`))
          .all(),
        queryCollection('en_articles')
          .where('title', 'LIKE', `%${q}%`)
          .orWhere(g => g.where('description', 'LIKE', `%${q}%`))
          .all(),
      ])
      const esSlugs = new Set(esResults.map(r => getSlug(r.path)))
      const fallback = enResults.filter(r => !esSlugs.has(getSlug(r.path)))
      return [...esResults, ...fallback]
    }

    return queryCollection('en_articles')
      .where('title', 'LIKE', `%${q}%`)
      .orWhere(g => g.where('description', 'LIKE', `%${q}%`))
      .all()
  },
  { server: false, watch: [debouncedQuery, locale] }
)

const groups = computed(() => {
  if (!results.value?.length) return []

  return [{
    id: 'articles',
    label: t('articles.title'),
    ignoreFilter: true,
    items: results.value.map(article => ({
      id: article.path,
      label: article.title,
      suffix: article.description,
      to: localePath(`/articles/${getSlug(article.path)}`),
      onSelect: () => { isOpen.value = false },
    })),
  }]
})

const emptyState = computed(() => ({
  label: debouncedQuery.value ? t('search.noResults') : t('search.typeToSearch'),
  icon: 'i-lucide-search',
}))
</script>

<template>
  <UModal v-model:open="isOpen" :ui="{ body: 'p-0 overflow-hidden' }">
    <template #body>
      <UCommandPalette
        v-model:search-term="query"
        :groups="groups"
        :placeholder="t('search.placeholder')"
        :empty-state="emptyState"
        :loading="status === 'pending'"
      />
    </template>
  </UModal>
</template>
