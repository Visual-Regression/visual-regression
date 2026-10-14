<script setup lang="ts">
// The learn track as a reading path, with reading times from the chapters'
// word counts at build time (220 words a minute).
const { data: pages } = await useAsyncData('learn-path', () =>
  queryCollection('docs')
    .where('path', 'LIKE', '/learn/%')
    // the collection also indexes the section's `.navigation.yml`
    .where('extension', '=', 'md')
    .order('stem', 'ASC')
    .select('path', 'title', 'description', 'body')
    .all(),
);
const chapters = computed(() => pages.value ?? []);

const words = (node: unknown): number => {
  if (typeof node === 'string') return node.split(/\s+/).filter(Boolean).length;
  if (Array.isArray(node)) return node.slice(2).reduce((n: number, c) => n + words(c), 0);
  return 0;
};
const minutes = (body: unknown) => {
  const value = (body as { value?: unknown[] } | null)?.value ?? [];
  return Math.max(1, Math.round(value.reduce((n: number, c) => n + words(c), 0) / 220));
};
</script>

<template>
  <ol class="not-prose mx-auto grid max-w-2xl divide-y divide-default border-y border-default">
    <li v-for="(c, i) in chapters" :key="c.path">
      <NuxtLink :to="c.path" class="group flex items-baseline gap-4 py-3 sm:gap-6">
        <span class="font-mono text-xs text-primary">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="min-w-0 flex-1">
          <span class="block font-medium text-highlighted group-hover:text-primary">{{ c.title }}</span>
          <span class="mt-0.5 hidden text-sm text-muted sm:block">{{ c.description }}</span>
        </span>
        <span class="shrink-0 font-mono text-xs text-muted">{{ minutes(c.body) }} min</span>
      </NuxtLink>
    </li>
  </ol>
</template>
