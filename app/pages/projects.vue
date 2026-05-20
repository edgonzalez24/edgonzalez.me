<template>
  <div class="mx-auto max-w-screen-2xl px-4 md:px-8 pb-10 pt-24">
    <h1 class="mb-2 text-4xl font-bold text-black sm:text-5xl xl:text-6xl">
      <span>{{ t('projects.title') }}</span>
    </h1>
    <p class="mt-5 text-gray-400 text-lg">
      {{ t('projects.description') }}
    </p>
    <div class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <u-page-card
        v-for="(project, index) in projectsList"
        :key="index"
        :title="project.name"
        :description="project.description"
        :icon="project.icon ?? 'i-simple-icons-github'"
        :to="project.url"
        target="_blank"
        orientation="vertical"
        spotlight
        variant="outline"
        :reverse="true"
        class="[--spotlight-color:var(--ui-error)]"
        @click="umTrackEvent(`cta-project-${project.slug}`)"
      >
        <img
          :src="project.thumbnail"
          :alt="project.name"
          class="w-full h-48 object-cover rounded-lg"
        />
      </u-page-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import projects from '@/data/projects.json'

const { t } = useI18n()
const projectsList = computed(() => projects.projects)

useSeoMeta({ title: t('seo.projects') })
</script>
