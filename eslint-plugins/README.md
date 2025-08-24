# Custom ESLint Rules for Jovie

This directory contains custom ESLint rules for the Jovie project.

## Available Rules

### `no-direct-next-image`

This rule prevents direct imports of `next/image` and encourages the use of our optimized image components.

## Installation

To enable these rules, you need to:

1. Install the plugin locally:

```bash
npm link ./eslint-plugins
```

2. Update your `.eslintrc.js` to include the plugin:

```js
module.exports = {
  // ... other config
  plugins: ['@typescript-eslint', 'prettier', 'jovie'],
  rules: {
    // ... other rules
    'jovie/no-direct-next-image': 'warn', // or 'error' to enforce strictly
  },
};
```

## Development

To add a new rule:

1. Create a new file in the `rules/` directory
2. Add the rule to the `index.js` file
3. Update this README with documentation for the rule

