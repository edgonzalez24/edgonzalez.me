<template>
  <u-page>
    <u-page-body class="relative mx-auto max-w-screen-2xl md:px-8 pb-10 pt-24">
      <u-blog-posts>
        <u-blog-post 
          v-for="article in articles"
          :title="article.title"
          :description="article.description"
          :image="getTumbnail(article.thumbnail)"
          :authors="[{ name: article.author} ]"
          :badge="Math.abs(new Date().getTime() - new Date(article?.date).getTime()) < 8.64e7 * 7 ? { label: 'New', color: 'primary' } : undefined"
          :date="article.date"
          :to="article.path"
          variant="naked"
        ></u-blog-post>
      </u-blog-posts>
    </u-page-body>
  </u-page>
  <!-- lo -->
</template>

<script lang="ts" setup>
const { data: articlesRaw } = await useAsyncData("articles-home", () => queryCollection("articles").all());

const articles = computed(() =>
  (articlesRaw.value || []).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
);

const getTumbnail = (thumbnailPath: string) => {
  const config = useRuntimeConfig();
  return `${config.public.supabaseBucketUrl}/${thumbnailPath}`;
};

</script>