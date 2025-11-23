<template>
  <u-app>
    <div class="blob-container">
      <div class="blob left-blob"></div>
      <div class="blob right-blob"></div>
      <Header />
      <u-main>
        <u-container>
          <NuxtPage></NuxtPage>
        </u-container>
      </u-main>
      <Footer />
    </div>
  </u-app>
</template>

<script setup>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
</script>
