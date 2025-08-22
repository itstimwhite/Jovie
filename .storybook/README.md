# Storybook Infrastructure

This directory contains the configuration for Storybook in the Jovie project.

## Features

- **Dark Mode/Light Mode**: Toggle between dark and light themes for all components
- **Responsive Testing**: Test components at different viewport sizes (mobile, tablet, desktop)
- **Accessibility Checks**: Automated a11y testing for all components

## Configuration Files

- `main.ts`: Main Storybook configuration (addons, stories, etc.)
- `preview.ts`: Global decorators, parameters, and settings
- `decorators/`: Custom decorators for theme and viewport

## Usage

See the [Storybook Guide](../?path=/docs/documentation-storybook-guide--docs) for detailed usage instructions.

## Running Storybook

```bash
npm run storybook
```

## Building Storybook

```bash
npm run build-storybook
```

## Addons

- `@storybook/addon-docs`: Documentation
- `@storybook/addon-a11y`: Accessibility testing
- `@storybook/addon-themes`: Theme switching
- `@storybook/addon-viewport`: Responsive testing
- `@chromatic-com/storybook`: Chromatic integration

## Best Practices

1. All new components should have stories that:
   - Work in both light and dark mode
   - Are responsive across different viewports
   - Pass accessibility checks

2. Use the provided decorators to ensure consistent behavior

3. Document component variants and edge cases with specific stories
