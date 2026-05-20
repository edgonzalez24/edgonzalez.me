<template>
  <div class="relative mx-auto max-w-screen-2xl md:px-8 pb-10 pt-24">
    <h1 class="mb-2 text-4xl font-bold text-black sm:text-5xl xl:text-6xl">
      <span>{{ t('aboutMe.title') }}</span>
    </h1>
    <div class="mb-5">
      <p class="text-gray-400 text-lg">
        {{ t('aboutMe.bio') }}
      </p>
    </div>
    <h2 class="text-3xl font-bold">{{ t('aboutMe.experience') }}</h2>
    <ol class="relative border-s border-gray-200 mt-5">
      <li v-for="(job, index) in jobs" :key="index" class="mb-10 ms-4">
        <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white"></div>
        <time class="mb-1 text-sm font-normal leading-none text-gray-400">
          {{ job.date }}
        </time>
        <h3 class="text-lg font-semibold text-white">
          {{ job.title }}
        </h3>
        <ul class="text-base font-normal text-gray-400">
          <li v-for="(bullet, bi) in job.bullets" :key="bi"> - {{ bullet }}</li>
        </ul>
      </li>
    </ol>
  </div>
</template>

<script lang="ts" setup>
interface Job {
  date: string
  title: string
  bullets: string[]
}

const { t, tm, rt } = useI18n()

// tm() returns compiled message functions; rt() resolves each to its string value
const jobs = computed<Job[]>(() =>
  (tm('aboutMe.jobs') as any[]).map(job => ({
    date: rt(job.date),
    title: rt(job.title),
    bullets: (job.bullets as any[]).map((b: any) => rt(b)),
  }))
)

useSeoMeta({ title: t('seo.aboutMe') })
</script>
