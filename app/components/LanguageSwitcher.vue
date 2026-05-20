<template>
  <div class="flex items-center gap-0.5 rounded-full bg-neutral-800/70 p-1 backdrop-blur-sm ring-1 ring-white/10">
    <NuxtLink
      v-for="loc in locales"
      :key="loc.code"
      :to="switchLocalePath(loc.code)"
      :aria-label="`Switch to ${loc.name}`"
      :aria-current="locale === loc.code ? 'true' : undefined"
      class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wider transition-all duration-200"
      :class="locale === loc.code
        ? 'bg-white text-neutral-900 shadow-sm'
        : 'text-neutral-400 hover:text-white'"
    >
      <span>{{ localeFlags[loc.code] }}</span>
      <span>{{ loc.code.toUpperCase() }}</span>
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const localeFlags: Record<string, string> = {
  en: '🇺🇸',
  es: '🇸🇻',
}
</script>
