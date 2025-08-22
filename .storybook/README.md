# Chromatic Configuration for Jovie

This document outlines the Chromatic configuration for visual testing in the Jovie project.

## Global Configuration

The global Chromatic configuration is defined in `.storybook/preview.ts`:

```typescript
parameters: {
  // Default Chromatic parameters
  chromatic: {
    // Default delay for all stories (milliseconds)
    delay: 300,
    // Default viewports for all stories
    viewports: [320, 768, 1200],
    // Only capture screenshots when stories change
    onlyChanged: true,
  },
}
```

## Per-Story Parameters

### Async Components

For components with asynchronous behavior, we add specific delay parameters to ensure the component has time to render its final state:

```typescript
parameters: {
  chromatic: {
    delay: 3500, // Milliseconds to wait before capturing screenshot
    diffThreshold: 0.2, // Tolerance for pixel differences
  },
}
```

### Responsive Components

For components with responsive layouts, we specify multiple viewports to test different breakpoints:

```typescript
parameters: {
  chromatic: {
    viewports: [320, 640, 768, 1024, 1280], // Capture at these viewport widths
  },
}
```

## When to Use Parameters

### Use `delay` when:

- Component has animations or transitions
- Component loads data asynchronously
- Component has state changes that take time to render
- Component uses setTimeout or promises

### Use `viewports` when:

- Component has responsive layout changes
- Component uses different layouts at different screen sizes
- Component uses grid or flex layouts that change based on viewport
- Testing mobile, tablet, and desktop views is important

### Use `diffThreshold` when:

- Component has subtle animations
- Component has elements that might shift slightly
- Component has anti-aliasing or rendering differences across browsers

## Best Practices

1. **Keep CI runs fast**: Only add parameters where necessary
2. **Be specific**: Target only the components that need special handling
3. **Document changes**: Add comments explaining why parameters are needed
4. **Test thoroughly**: Verify that parameters resolve flaky tests
5. **Use `onlyChanged: true`**: To avoid capturing unchanged stories

## Examples

See the following files for examples:

- `components/organisms/TipSection.stories.tsx`
- `components/profile/AnimatedArtistPage.stories.tsx`
- `components/atoms/BackgroundPattern.stories.tsx`
- `components/atoms/FeatureCard.stories.tsx`
