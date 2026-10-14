<script setup lang="ts">
// Overrides the Docus header logo: the brand mark next to the site name.
// Docus's own `header.logo` option would replace the name with the image.
// Below `sm` only the mark shows: the name plus the four header buttons do
// not fit a 320px screen (the home link keeps the name as its aria-label).
const appConfig = useAppConfig();
</script>

<template>
  <span class="inline-flex items-center gap-2 font-semibold text-highlighted">
    <BrandMark class="size-6" />
    <span class="hidden whitespace-nowrap sm:inline">{{
      appConfig.header?.title
    }}</span>
  </span>
</template>
