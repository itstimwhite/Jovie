# Feature Flags with Statsig

Jovie uses [Statsig](https://statsig.com/) for feature flag management and experimentation. This provides a robust, real-time feature flag system with advanced A/B testing capabilities.

## Setup

### 1. Environment Variables

Add your Statsig client key to `.env.local`:

```bash
NEXT_PUBLIC_STATSIG_CLIENT_KEY=client-<your-statsig-client-key>
```

### 2. Provider Integration

The Statsig provider is integrated in `app/my-statsig.tsx` and wraps the entire application in `app/layout.tsx`.

## Available Feature Flags

### Current Flags

| Flag Name              | Type   | Description                      | Default             |
| ---------------------- | ------ | -------------------------------- | ------------------- |
| `waitlist_enabled`     | Gate   | Controls waitlist functionality  | `false`             |
| `debug_banner_enabled` | Gate   | Controls debug banner visibility | `development`       |
| `artist_search_config` | Config | Artist search configuration      | `{ enabled: true }` |

### Usage in Components

```typescript
import { useFeatureFlags } from '@/lib/feature-flags';

export function MyComponent() {
  const { waitlistEnabled, debugBannerEnabled } = useFeatureFlags();

  return (
    <div>
      {waitlistEnabled && <WaitlistComponent />}
      {debugBannerEnabled && <DebugBanner />}
    </div>
  );
}
```

## Statsig Dashboard Configuration

### 1. Create Gates

In the Statsig dashboard, create the following gates:

#### `waitlist_enabled`

- **Type**: Boolean Gate
- **Description**: Controls waitlist functionality
- **Default**: `false`

#### `debug_banner_enabled`

- **Type**: Boolean Gate
- **Description**: Controls debug banner visibility
- **Default**: `true` (development), `false` (production)

### 2. Create Configs

#### `artist_search_config`

- **Type**: JSON Config
- **Description**: Artist search configuration
- **Default**: `{ "enabled": true }`

## Advanced Usage

### User Segmentation

Statsig automatically includes user information from Clerk:

```typescript
// User object passed to Statsig
const statsigUser = {
  userID: user?.id || 'anonymous-user',
  email: user?.emailAddresses?.[0]?.emailAddress,
  custom: {
    plan: (user?.publicMetadata?.plan as string) || 'free',
  },
};
```

### A/B Testing

You can create experiments in the Statsig dashboard:

```typescript
import { useExperiment } from '@statsig/react-bindings';

export function MyComponent() {
  const experiment = useExperiment('my_experiment');

  return (
    <div>
      {experiment.get('variant') === 'A' && <VariantA />}
      {experiment.get('variant') === 'B' && <VariantB />}
    </div>
  );
}
```

### Dynamic Configs

```typescript
import { useConfig } from '@statsig/react-bindings';

export function MyComponent() {
  const config = useConfig('my_config');

  const setting = config.get('setting', 'default');

  return <div>{setting}</div>;
}
```

## Migration from Edge Config

The feature flags system has been migrated from Vercel Edge Config to Statsig:

### Before (Edge Config)

```typescript
import { createClient } from '@vercel/edge-config';

const edgeConfig = createClient(process.env.EDGE_CONFIG);
const flags = await edgeConfig.get('featureFlags');
```

### After (Statsig)

```typescript
import { useFeatureFlags } from '@/lib/feature-flags';

const { waitlistEnabled, debugBannerEnabled } = useFeatureFlags();
```

## Testing

### Unit Tests

When testing components that use feature flags:

```typescript
import { render, screen } from '@testing-library/react';
import { StatsigProvider } from '@statsig/react-bindings';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <StatsigProvider
    sdkKey="test-key"
    user={{ userID: 'test-user' }}
    options={{ logLevel: 'none' }}
  >
    {children}
  </StatsigProvider>
);

test('component shows when flag is enabled', () => {
  render(
    <TestWrapper>
      <MyComponent />
    </TestWrapper>
  );

  expect(screen.getByText('Feature enabled')).toBeInTheDocument();
});
```

### E2E Tests

For end-to-end tests, you can configure feature flags per test:

```typescript
test('waitlist flow with flag enabled', async ({ page }) => {
  // Configure Statsig for this test
  await page.addInitScript(() => {
    window.STATSIG_OVERRIDES = {
      waitlist_enabled: true,
    };
  });

  await page.goto('/');
  await expect(page.locator('[data-testid="waitlist"]')).toBeVisible();
});
```

## Best Practices

1. **Always provide defaults**: Use fallback values for all feature flags
2. **Test both states**: Test components with flags enabled and disabled
3. **Use descriptive names**: Make flag names self-documenting
4. **Document changes**: Update this file when adding new flags
5. **Monitor usage**: Use Statsig analytics to track flag usage

## Troubleshooting

### Flag not working?

1. Check that `NEXT_PUBLIC_STATSIG_CLIENT_KEY` is set correctly
2. Verify the flag exists in the Statsig dashboard
3. Check browser console for Statsig errors
4. Ensure the component is wrapped in `StatsigProvider`

### Performance issues?

1. Statsig caches flags locally for performance
2. Use `useFeatureFlags()` hook for real-time updates
3. Consider using `useConfig()` for complex configurations

## Resources

- [Statsig Documentation](https://docs.statsig.com/)
- [React Bindings Guide](https://docs.statsig.com/client-libraries/react)
- [Feature Flag Best Practices](https://docs.statsig.com/guides/feature-flags)
