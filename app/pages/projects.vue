<template>
  <div class="mx-auto max-w-screen-2xl px-4 md:px-8 pb-10 pt-24">
    <h1 class="mb-2 text-4xl font-bold text-black sm:text-5xl xl:text-6xl">
      <span>Projects</span>
    </h1>
    <p class="mt-5 text-gray-400 text-lg">
      In this section, you'll find a selection of the projects I've developed as part of my work as a web developer. Each project reflects my focus on creating efficient, scalable applications with an excellent user experience. From intuitive interfaces to complete backend solutions, here you can explore how to transform ideas into functional products.
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
          :src="getProjectThumbnail(project.thumbnail)"
          :alt="project.name"
          class="w-full h-48 object-cover rounded-lg"
        />
      </u-page-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import projects from "@/data/projects.json";

  const projectsList = computed(() => projects.projects);

  const getProjectThumbnail = (thumbnail: string) => {
    const config = useRuntimeConfig();
    return `${config.public.supabaseBucketUrl}${thumbnail}`;
  };
</script>