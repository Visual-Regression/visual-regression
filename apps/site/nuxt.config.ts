export default defineNuxtConfig({
  extends: ['docus'],

  site: {
    url: 'https://visual-regression.dev',
    name: 'visual-regression.dev',
  },

  // Fully static: every route is prerendered by `nuxt generate` and served from
  // Cloudflare Pages. No server at runtime.
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  compatibilityDate: '2026-10-01',
});
