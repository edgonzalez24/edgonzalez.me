<script lang="ts" setup>
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const isSearchOpen = useSearchModal()
const mobileMenuOpen = ref(false)

watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

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
      class="flex items-center justify-between p-4 sm:p-6 lg:px-8"
      aria-label="Global"
    >
      <!-- Mobile: hamburger button -->
      <div class="flex md:hidden">
        <UButton
          :icon="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          color="neutral"
          variant="ghost"
          :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </div>

      <!-- Desktop: spacer -->
      <div class="hidden md:flex lg:flex-1" />

      <!-- Desktop navigation links -->
      <div class="hidden md:flex gap-x-5 lg:gap-x-12">
        <p v-for="item in navigationLinks" :key="item.name">
          <NuxtLink
            :href="item.href"
            :class="route.path === item.href ? 'underline text-gray-400' : 'hover:underline text-white hover:text-gray-400'"
            class="text-base md:text-lg font-bold leading-6 transition duration-500 ease-in-out"
          >
            {{ item.name }}
          </NuxtLink>
        </p>
      </div>

      <!-- Right side: search + language switcher -->
      <div class="flex items-center gap-x-3 lg:flex-1 lg:justify-end">
        <UButton
          icon="i-lucide-search"
          color="neutral"
          variant="ghost"
          aria-label="Search articles"
          @click="isSearchOpen = true"
        />
        <LanguageSwitcher />
      </div>
    </nav>

    <!-- Mobile menu dropdown -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden absolute inset-x-0 bg-neutral-900/95 backdrop-blur-sm border-t border-white/10 px-6 pb-5"
      >
        <div class="flex flex-col">
          <NuxtLink
            v-for="item in navigationLinks"
            :key="item.name"
            :href="item.href"
            :class="route.path === item.href ? 'text-gray-400' : 'text-white hover:text-gray-400'"
            class="py-3 text-base font-bold leading-6 transition duration-300 ease-in-out border-b border-white/5 last:border-0"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>
