import React from 'react';
import { Decorator } from '@storybook/react';

/**
 * Viewport decorator for Storybook that adds a responsive container
 * This allows components to be viewed at different screen sizes
 */
export const ViewportDecorator: Decorator = (Story, context) => {
  // Get the viewport from the story parameters or use the default
  const viewport =
    context.parameters.viewport || context.globals.viewport || 'responsive';

  // Define viewport styles
  const viewportStyles: Record<string, React.CSSProperties> = {
    responsive: {
      width: '100%',
      height: 'auto',
    },
    mobile: {
      width: '375px',
      height: 'auto',
      margin: '0 auto',
      border: '1px dashed #ccc',
      borderRadius: '8px',
      padding: '8px',
    },
    tablet: {
      width: '768px',
      height: 'auto',
      margin: '0 auto',
      border: '1px dashed #ccc',
      borderRadius: '8px',
      padding: '8px',
    },
    desktop: {
      width: '1280px',
      height: 'auto',
      margin: '0 auto',
      border: '1px dashed #ccc',
      borderRadius: '8px',
      padding: '8px',
    },
  };

  return (
    <div style={viewportStyles[viewport] || viewportStyles.responsive}>
      <Story />
    </div>
  );
};
