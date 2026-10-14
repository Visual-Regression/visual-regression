export default defineAppConfig({
  docus: {
    locale: 'en',
  },
  seo: {
    title: 'visual-regression.dev',
    description:
      'Learn visual regression testing, compare the tools, and share one run manifest between them.',
  },
  header: {
    title: 'visual-regression.dev',
    logo: false,
  },
  // Narrow-screen fixes (320px). Classes merge into the Nuxt UI defaults.
  ui: {
    prose: {
      // Inline code is `inline-block`, so long paths such as
      // `build/test-results/roborazzi/<variant>/results-summary.json` could
      // not wrap and pushed the page wider than the viewport.
      code: { base: 'max-w-full wrap-anywhere' },
    },
    separator: {
      variants: {
        orientation: {
          // Docus renders "Edit this page or Report an issue" as a flex row
          // inside a horizontal separator; let that row wrap on phones.
          horizontal: {
            container: 'max-sm:[&>div]:flex-wrap max-sm:[&>div]:justify-center',
          },
        },
      },
    },
  },
  github: {
    url: 'https://github.com/Visual-Regression/visual-regression',
    branch: 'main',
    rootDir: 'apps/site',
  },
  toc: {
    title: 'On this page',
    bottom: {
      title: 'Elsewhere',
      links: [
        {
          icon: 'i-lucide-github',
          label: 'Source on GitHub',
          to: 'https://github.com/Visual-Regression/visual-regression',
          target: '_blank',
        },
      ],
    },
  },
});
