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
  socials: {
    github: 'https://github.com/Visual-Regression/visual-regression',
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
