import React from 'react';
import { ThemeProvider } from 'next-themes';
import { Decorator } from '@storybook/react';
import '../../styles/globals.css';

/**
 * Theme decorator for Storybook that wraps components in the app's ThemeProvider
 * This allows components to properly render in both light and dark modes
 */
export const ThemeDecorator: Decorator = (Story, context) => {
  // Get the theme from the story parameters or use the default
  const theme = context.parameters.theme || context.globals.theme || 'light';

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem={false}
      disableTransitionOnChange
      storageKey="jovie-theme-storybook"
    >
      <div className={theme === 'dark' ? 'dark' : ''}>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-md min-h-[200px] transition-colors">
          <Story />
        </div>
      </div>
    </ThemeProvider>
  );
};
