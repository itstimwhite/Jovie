# Next.js Stubs for Storybook

This directory contains stubs and mocks for Next.js primitives and routing to make Storybook work seamlessly with Next.js components.

## What's Included

- **next/link**: A mock implementation of the `Link` component that renders as an anchor tag
- **next/router**: Mocks for the `useRouter` hook
- **next/navigation**: Mocks for App Router hooks like `useRouter`, `usePathname`, `useSearchParams`, `useParams`, `redirect`, and `notFound`

## How to Use

### In Stories

The stubs are automatically applied to all stories. You can use Next.js components and hooks in your stories without any additional configuration:

```tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

// These will work in Storybook without errors
```

### Controlling Router Values

You can control router values using Storybook's globals:

```tsx
// In your story
export const WithCustomPath = {
  parameters: {
    nextRouter: {
      pathname: '/dashboard',
      asPath: '/dashboard?tab=settings',
      query: { tab: 'settings' },
    },
  },
};
```

### Handling Navigation

When using `Link` components or router navigation methods (`push`, `replace`, etc.), the navigation will be intercepted and logged to the console. This allows you to see navigation events without actually navigating away from your story.

## Extending

If you need to add more Next.js stubs or modify existing ones:

1. Update the mock implementations in `.storybook/mocks/`
2. Register new mocks in `.storybook/mocks/next-stubs-decorator.tsx`

## Troubleshooting

If you encounter issues with Next.js components in Storybook:

1. Check the console for errors
2. Ensure the component is using the mocked versions of Next.js primitives
3. If needed, add additional mocks for specific Next.js features

