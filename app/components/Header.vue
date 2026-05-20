<script lang="ts" setup>
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const navigationLinks = computed(() => [
  { name: t('nav.home'), href: localePath('/') },
  { name: t('nav.aboutMe'), href: localePath('/about-me') },
  { name: t('nav.projects'), href: localePath('/projects') },
  { name: t('nav.blog'), href: localePath('/articles') },
])
</script>

<template>
  <header class="absolute inset-x-0 top-0 z-50">
    <nav
      class="flex items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1"></div>
      <div class="flex gap-x-5 lg:gap-x-12">
        <p v-for="item in navigationLinks" :key="item.name">
          <NuxtLink
            :href="item.href"
            :class="route.path === item.href ? 'underline text-gray-400' : 'hover:underline text-white hover:text-gray-400'"
            class="md:text-lg text-base font-bold leading-6 transition duration-500 ease-in-out"
          >
            {{ item.name }}
          </NuxtLink>
        </p>
      </div>
      <div class="flex lg:flex-1 lg:justify-end">
        <LanguageSwitcher />
      </div>
    </nav>
  </header>
</template>
