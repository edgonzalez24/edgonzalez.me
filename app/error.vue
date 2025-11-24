<template>
  <u-app>
    <span class="blob-container">
      <div class="blob left-blob"></div>
      <div class="blob right-blob"></div>
      <u-main class="px-4">
        <u-container>
          <u-error 
            :error="{
              statusCode: error?.statusCode,
              statusMessage: error?.statusMessage,
              message: error?.message,
            }"
          />
        </u-container>
      </u-main>
    </span>
  </u-app>
</template>

<script lang="ts" setup>
const error = useError();

useSeoMeta({
  title: error.value?.statusCode.toString(),
  description: error.value?.statusMessage,
});
</script>