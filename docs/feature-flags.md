# Feature Flags Catalog

Jovie uses a simple feature flag system to control feature availability across different environments.

## Feature Flag Naming Convention

All feature flags follow the snake_case naming convention:

- `feature_claim_handle`
- `feature_tip_promo`
- `feature_artist_search`
- etc.

## MVP Feature Flag Catalog

| Flag Name                            | Default  | Owner              | Environments       | Success Metric                             | Rollback Plan       |
| ------------------------------------ | -------- | ------------------ | ------------------ | ------------------------------------------ | ------------------- |
| `feature_claim_handle`               | OFF      | Product Team       | Dev, Preview, Prod | `profile_handle_claim` PostHog event       | Disable flag in API |
| `feature_tip_promo`                  | ON       | Marketing Team     | Dev, Preview, Prod | `tip_promo_click` PostHog event            | Disable flag in API |
| `feature_artist_search`              | ON       | Search Team        | Dev, Preview, Prod | `artist_search_result_click` PostHog event | Disable flag in API |
| `feature_pricing_clerk`              | OFF      | Payments Team      | Dev, Preview, Prod | `pricing_plan_select` PostHog event        | Disable flag in API |
| `feature_universal_notifications`    | DEV-only | Notifications Team | Dev                | `notification_view` PostHog event          | Disable flag in API |
| `feature_click_analytics_rpc`        | OFF      | Analytics Team     | Dev, Preview, Prod | `click_event_logged` PostHog event         | Disable flag in API |
| `feature_anti_cloaking_interstitial` | ON       | Security Team      | Dev, Preview, Prod | `interstitial_view` PostHog event          | Disable flag in API |

## Implementation

Feature flags are implemented in two key locations:

1. **API Endpoint**: `/api/feature-flags/route.ts` - Serves the current flag values
2. **Client Library**: `/lib/feature-flags.ts` - Provides functions to access flags

### Using Feature Flags in Components

```typescript
import { useEffect, useState } from 'react';
import { getFeatureFlags } from '@/lib/feature-flags';

export function MyComponent() {
  const [flags, setFlags] = useState({
    featureClaimHandle: false,
    featureTipPromo: true,
  });

  useEffect(() => {
    async function loadFlags() {
      const featureFlags = await getFeatureFlags();
      setFlags(featureFlags);
    }
    loadFlags();
  }, []);

  return (
    <div>
      {flags.featureClaimHandle && <ClaimHandleComponent />}
      {flags.featureTipPromo && <TipPromoComponent />}
    </div>
  );
}
```

### Server-Side Usage

```typescript
import { getServerFeatureFlags } from '@/lib/feature-flags';

export async function ServerComponent() {
  const flags = await getServerFeatureFlags();

  return (
    <div>
      {flags.featureArtistSearch && <ArtistSearchResults />}
    </div>
  );
}
```

## Feature Flag Management

### Adding a New Flag

1. Add the flag to the interface in `lib/feature-flags.ts`
2. Add the flag to the defaults in `lib/feature-flags.ts`
3. Add the flag to the API endpoint in `app/api/feature-flags/route.ts`
4. Update this documentation with the flag details

### Changing Flag Values

Flag values should be changed in the API endpoint:

```typescript
// app/api/feature-flags/route.ts
export async function GET() {
  const flags = {
    // ...
    feature_claim_handle: true, // Changed from false to true
    // ...
  } as const;

  // ...
}
```

### Removing a Flag

1. Remove the flag from the API endpoint
2. Remove the flag from the interface and defaults
3. Update this documentation

## Testing with Feature Flags

### Unit Tests

```typescript
// Mock the feature flags for testing
jest.mock('@/lib/feature-flags', () => ({
  getFeatureFlags: jest.fn().mockResolvedValue({
    featureClaimHandle: true,
    // other flags...
  }),
}));

test('component renders with feature flag enabled', async () => {
  render(<MyComponent />);
  // Test component with flag enabled
});
```

### E2E Tests

```typescript
// In your Playwright test
test('feature works when flag is enabled', async ({ page }) => {
  // Mock the API response for feature flags
  await page.route('/api/feature-flags', async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        feature_claim_handle: true,
        // other flags...
      }),
    });
  });

  await page.goto('/');
  // Test with flag enabled
});
```

## Best Practices

1. **Default to OFF for new features**: Start with flags turned off and gradually roll out
2. **Document all flags**: Keep this document updated with all flags
3. **Clean up unused flags**: Remove flags for fully launched features
4. **Use consistent naming**: Follow the `feature_name_action` pattern
5. **Track metrics**: Always associate a PostHog event with each flag
6. **Have a rollback plan**: Document how to quickly disable a feature if issues arise
