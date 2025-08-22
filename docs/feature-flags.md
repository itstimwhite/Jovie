# Feature Flags Architecture

Jovie uses a hybrid feature flag system that combines server-side flags for SSR-critical UI components and client-side PostHog experiments for non-critical UI elements.

## Architecture Overview

### Server-Side Feature Flags

Server-side feature flags are the source of truth for SSR-critical UI components. These flags are:

- Environment-aware (configured via environment variables)
- Consistent between server and client rendering
- Cached appropriately to minimize performance impact
- Used for critical UI components that must not flicker during hydration

### Client-Side Experiments (PostHog)

Client-side experiments are used for non-critical UI elements where dynamic updates are acceptable:

- Powered by PostHog's experimentation platform
- Can update after initial hydration
- Used for A/B testing, gradual rollouts, and personalization
- Suitable for copy changes, style variations, and non-critical components

## Setup

### 1. Environment Variables

Configure server-side feature flags in your environment:

```bash
# Server-side feature flags (SSR-critical)
FEATURE_FLAG_PRICING_USE_CLERK=false
FEATURE_FLAG_UNIVERSAL_NOTIFICATIONS_ENABLED=false
FEATURE_FLAG_CLICK_ANALYTICS_RPC=false

# PostHog for client-side experiments
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 2. Provider Integration

The `FeatureFlagsProvider` component integrates both server-side and client-side flags:

```tsx
// In a server component (e.g., app/layout.tsx)
import { FeatureFlagsProvider } from '@/components/providers/FeatureFlagsProvider';
import { getServerFeatureFlags } from '@/lib/server/feature-flags';

export default async function RootLayout({ children }) {
  // Fetch server-side flags
  const serverFlags = await getServerFeatureFlags();

  return (
    <FeatureFlagsProvider serverFlags={serverFlags}>
      {children}
    </FeatureFlagsProvider>
  );
}
```

## Available Feature Flags

### SSR-Critical Flags

These flags must be consistent between server and client rendering:

| Flag Name                       | Description                     | Default             |
| ------------------------------- | ------------------------------- | ------------------- |
| `pricingUseClerk`               | Controls pricing table provider | `false`             |
| `universalNotificationsEnabled` | Controls notification UI        | `development: true` |
| `featureClickAnalyticsRpc`      | Controls analytics behavior     | `false`             |

### Experimental Flags (PostHog)

These flags can be dynamically updated after initial hydration:

| Flag Name             | Description                      | Default             |
| --------------------- | -------------------------------- | ------------------- |
| `artistSearchEnabled` | Controls artist search feature   | `true`              |
| `debugBannerEnabled`  | Controls debug banner visibility | `development: true` |
| `tipPromoEnabled`     | Controls tip promotion UI        | `true`              |

## Usage in Components

### In Server Components

```tsx
// In a server component
import { getServerFeatureFlags } from '@/lib/server/feature-flags';

export default async function MyServerComponent() {
  const flags = await getServerFeatureFlags();

  return (
    <div>
      {flags.pricingUseClerk && <ClerkPricingTable />}
      {/* Pass server flags to client components */}
      <ClientComponent serverFlags={flags} />
    </div>
  );
}
```

### In Client Components

```tsx
// In a client component
import { useFeatureFlags } from '@/components/providers/FeatureFlagsProvider';

export function MyClientComponent() {
  const { flags } = useFeatureFlags();

  return (
    <div>
      {flags.pricingUseClerk && <ClerkPricingTable />}
      {flags.artistSearchEnabled && <ArtistSearch />}
    </div>
  );
}
```

## Flag Categories

### When to Use Server-Side Flags

Use server-side flags for:

- Components that must be consistent between server and client rendering
- UI elements that should not flicker during hydration
- Critical user flows (onboarding, checkout, authentication)
- SEO-critical content
- Core functionality that affects the main user experience

### When to Use PostHog Experiments

Use PostHog experiments for:

- Non-critical UI elements
- A/B testing of copy, styles, or minor features
- Gradual rollouts of new features
- Personalization based on user segments
- Features that can gracefully appear after initial page load

## Implementation Details

### Server-Side Flag Configuration

Server-side flags are configured in `lib/server/feature-flags-config.ts`:

```typescript
export function getServerFeatureFlagsConfig(): FeatureFlags {
  return {
    // SSR-critical flags with environment variable fallbacks
    pricingUseClerk: getBooleanEnv('FEATURE_FLAG_PRICING_USE_CLERK', false),
    // ... other flags
  };
}
```

### Server-Side Flag Fetching

Server components can fetch flags using `getServerFeatureFlags()`:

```typescript
import { getServerFeatureFlags } from '@/lib/server/feature-flags';

// In a server component or server action
const flags = await getServerFeatureFlags();
```

### Client-Side Flag Access

Client components access flags through the `useFeatureFlags()` hook:

```typescript
import { useFeatureFlags } from '@/components/providers/FeatureFlagsProvider';

// In a client component
const { flags, isLoading } = useFeatureFlags();
```

## Testing

### Unit Tests

When testing components that use feature flags:

```typescript
import { render, screen } from '@testing-library/react';
import { FeatureFlagsProvider } from '@/components/providers/FeatureFlagsProvider';

const mockServerFlags = {
  pricingUseClerk: true,
  // ... other flags
};

test('component shows when flag is enabled', () => {
  render(
    <FeatureFlagsProvider serverFlags={mockServerFlags}>
      <MyComponent />
    </FeatureFlagsProvider>
  );

  expect(screen.getByText('Feature enabled')).toBeInTheDocument();
});
```

### E2E Tests

For end-to-end tests, you can configure environment variables:

```typescript
// In playwright.config.ts
export default defineConfig({
  // ...
  use: {
    // ...
    env: {
      FEATURE_FLAG_PRICING_USE_CLERK: 'true',
    },
  },
});
```

## Best Practices

1. **Categorize flags appropriately**: Distinguish between SSR-critical and experimental flags
2. **Provide defaults**: Always use fallback values for all feature flags
3. **Test both states**: Test components with flags enabled and disabled
4. **Use descriptive names**: Make flag names self-documenting
5. **Document changes**: Update this file when adding new flags
6. **Clean up unused flags**: Remove flags that are no longer needed
7. **Avoid nested flags**: Keep flag dependencies to a minimum
8. **Use type safety**: Leverage TypeScript for flag type checking

## Troubleshooting

### Server/Client Mismatch

If you see hydration errors or UI flicker:

1. Ensure SSR-critical flags are fetched server-side and passed to `FeatureFlagsProvider`
2. Check that the component is using the correct flag category
3. Verify that server and client environments have consistent flag values

### Performance Issues

1. Server flags are cached for 60 seconds by default
2. Consider increasing cache TTL for stable flags
3. Use `getServerFeatureFlag(flagName)` for single flag access
4. Minimize the number of flags fetched per page

## Resources

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [PostHog Feature Flags](https://posthog.com/docs/feature-flags)
- [Feature Flag Best Practices](https://posthog.com/blog/feature-flag-best-practices)
