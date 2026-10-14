<script setup lang="ts">
// The landing page headline: what goes wrong in a UI, one phrase at a time.
const WORDS = ['Pixels drift.', 'Fonts change.', 'Layouts break.', 'Colours shift.'];
const i = ref(0);
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const t = setInterval(() => (i.value = (i.value + 1) % WORDS.length), 2600);
  onBeforeUnmount(() => clearInterval(t));
});
</script>

<template>
  <span>
    <span class="inline-block text-primary" aria-live="polite">{{ WORDS[i] }}</span><br />
    Assertions don't notice. Screenshots do.
  </span>
</template>
