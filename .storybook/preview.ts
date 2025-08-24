import type { Preview } from '@storybook/react';
import '../styles/globals.css';

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
      navigation: {
        pathname: '/test',
        query: {},
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
