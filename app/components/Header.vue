<script lang="ts" setup>
interface NavLinkItem {
  name: string;
  href: string;
}
const navigationLinks = ref<NavLinkItem[]>([
  { name: 'Home', href: '/' },
  { name: 'About Me', href: '/about-me' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/articles' },
]);
const route = useRoute();
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
      <div class="hidden lg:flex lg:flex-1 lg:justify-end"></div>
    </nav>
    <!-- <Dialog
      as="div"
      class="lg:hidden"
      open={mobileMenuOpen}
      onClose={setMobileMenuOpen}
    >
      <div class="fixed inset-0 z-50" />
      <Dialog.Panel class="fixed inset-y-0 right-0 z-50 w-1/2 overflow-y-auto bg-secondary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-end">
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-white"
          >
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white transition duration-500 ease-in-out hover:text-gray-400 hover:underline"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog> -->
  </header>
</template>