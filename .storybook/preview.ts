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
    // Default Chromatic parameters
    chromatic: {
      // Default delay for all stories (milliseconds)
      delay: 300,
      // Default viewports for all stories
      viewports: [320, 768, 1200],
      // Only capture screenshots when stories change
      onlyChanged: true,
    },
  },
  tags: ['autodocs'],
};

export default preview;
