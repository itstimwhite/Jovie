import type { StorybookConfig } from '@storybook/nextjs-vite';
import nextJsMocks from './mocks/next-stubs-decorator';

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../stories/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {
      builder: {
        viteConfigPath: 'vite.config.ts',
      },
    },
  },
  docs: {},
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  // Mock Next.js modules
  async viteFinal(config) {
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }

    // Add mocks for Next.js modules
    for (const [moduleName, mockImplementation] of Object.entries(nextJsMocks)) {
      config.resolve.alias[moduleName] = mockImplementation;
    }

    return config;
  },
};

export default config;
