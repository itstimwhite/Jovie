import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { ThemeDecorator, ViewportDecorator } from './decorators';
import '../styles/globals.css';

// Define custom viewports for responsive testing
const CUSTOM_VIEWPORTS = {
  mobile: {
    name: 'Mobile',
    styles: {
      width: '375px',
      height: '667px',
    },
    type: 'mobile',
  },
  tablet: {
    name: 'Tablet',
    styles: {
      width: '768px',
      height: '1024px',
    },
    type: 'tablet',
  },
  desktop: {
    name: 'Desktop',
    styles: {
      width: '1280px',
      height: '800px',
    },
    type: 'desktop',
  },
};

const preview: Preview = {
  decorators: [
    // Apply theme decorator to all stories
    ThemeDecorator,
    // Apply viewport decorator to all stories
    ViewportDecorator,
    // Configure theme addon with Tailwind classes
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
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
    // Configure a11y addon
    a11y: {
      // Enable a11y checks for all stories
      enabled: true,
      // Configure which elements to check
      element: '#storybook-root',
      // Configure which rules to check
      config: {
        rules: [
          {
            // Ensure all images have alt text
            id: 'image-alt',
            enabled: true,
          },
          {
            // Ensure all interactive elements are keyboard accessible
            id: 'button-name',
            enabled: true,
          },
          {
            // Ensure proper color contrast
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
      // Show a11y tab in the addon panel
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa'],
        },
      },
    },
    // Configure viewport addon
    viewport: {
      // Use both custom and built-in viewports
      viewports: {
        ...CUSTOM_VIEWPORTS,
        ...INITIAL_VIEWPORTS,
      },
      // Default viewport
      defaultViewport: 'responsive',
    },
    // Configure theme addon
    themes: {
      default: 'light',
      list: [
        { name: 'Light', class: '', color: '#ffffff' },
        { name: 'Dark', class: 'dark', color: '#1a202c' },
      ],
    },
  },
  // Configure global variables
  globals: {
    theme: 'light',
    viewport: 'responsive',
  },
  tags: ['autodocs'],
};

export default preview;
