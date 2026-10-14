export default defineNuxtConfig({
  extends: ['docus'],

  site: {
    url: 'https://visual-regression.dev',
    name: 'visual-regression.dev',
  },

  app: {
    head: {
      link: [
        // Docus adds `/favicon.ico`; the SVG wins in browsers that support it.
        { rel: 'icon', type: 'image/svg+xml', href: '/brand/mark.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },

  // Fully static: every route is prerendered by `nuxt generate` and served as
  // Cloudflare Workers static assets (see `wrangler.jsonc`). No server at runtime.
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  compatibilityDate: '2026-10-01',
});
