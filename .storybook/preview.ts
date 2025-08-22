import type { Preview } from '@storybook/react';
import '../styles/globals.css';
import { withNextJsStubs } from './mocks/next-stubs-decorator';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: true,
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [withNextJsStubs],
  globalTypes: {
    pathname: {
      name: 'Pathname',
      description: 'Next.js current pathname',
      defaultValue: '/',
    },
    asPath: {
      name: 'AsPath',
      description: 'Next.js current asPath',
      defaultValue: '/',
    },
  },
  tags: ['autodocs'],
};

export default preview;
