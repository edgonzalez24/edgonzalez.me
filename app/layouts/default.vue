<template>
  <div>
    <div class="blob-container">
      <div class="blob left-blob"></div>
      <div class="blob right-blob"></div>
    </div>
    <u-app>
      <Header />
      <u-main>
        <u-container>
          <NuxtPage></NuxtPage>
        </u-container>
      </u-main>
      <Footer />
    </u-app>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>
