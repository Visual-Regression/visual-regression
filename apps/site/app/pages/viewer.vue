<script setup lang="ts">
// Spike: a plain Vue page next to the markdown content, to prove custom routes
// prerender and hydrate under `nuxt generate`. The real viewer replaces this.
useSeoMeta({
  title: 'Manifest viewer',
  description:
    'Drop a visual-regression-manifest and its images to review them in the browser. Nothing is uploaded.',
});

const count = ref(0);
</script>

<template>
  <UContainer class="py-16">
    <h1 class="text-3xl font-semibold">Manifest viewer</h1>
    <p class="mt-4 text-muted">
      Placeholder for the client-side viewer. Hydration check:
      <UButton size="sm" variant="soft" @click="count++">
        clicked {{ count }} times
      </UButton>
    </p>
  </UContainer>
</template>
