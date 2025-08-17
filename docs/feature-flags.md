# Feature Flags with PostHog

Jovie uses [PostHog](https://posthog.com/) for feature flag management and experimentation. This provides a robust, real-time feature flag system with advanced A/B testing capabilities and privacy-friendly analytics.

## Setup

### 1. Environment Variables

Add your PostHog keys to `.env.local`:

```bash
# Required
POSTHOG_API_KEY=phc_your_posthog_api_key_here
NEXT_PUBLIC_POSTHOG_PUBLIC_KEY=phc_your_posthog_public_key_here

# Optional (will use defaults if not set)
POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_POSTHOG_PROXY_PATH=/phx
```

### 2. Provider Integration

The PostHog provider is integrated in `app/layout.tsx` and includes:

- **Server-side evaluation**: Flags are evaluated server-side for fast rendering
- **Client bootstrapping**: Server flags are passed to client to prevent FOUC (Flash of Unstyled Content)
- **Reverse proxy**: Routes through `/phx` to evade common ad blockers

## Available Feature Flags

- **`artistSearchEnabled`**: Controls whether the artist search feature is enabled (default: `true`)
- **`debugBannerEnabled`**: Controls whether the debug banner is shown (default: `true`)
- **`tipPromoEnabled`**: Controls whether tip promotion features are enabled (default: `true`)

## Usage

### Server Components

```typescript
import { isEnabled, getVariant } from '@/lib/flags';

export default async function MyServerComponent() {
  const showNewFeature = await isEnabled('new_feature', {
    distinctId: 'user-123', // user ID or anonymous ID
    properties: { plan: 'pro' } // optional user properties
  });

  if (showNewFeature) {
    return <NewFeature />;
  }

  return <OldFeature />;
}
```

### Client Components

```typescript
'use client';
import posthog from 'posthog-js';

export function MyClientComponent() {
  // Uses bootstrapped flags for instant evaluation
  const enabled = posthog.isFeatureEnabled('new_feature');

  return enabled ? <NewComponent /> : <OldComponent />;
}
```

### Multivariate Flags (A/B Testing)

```typescript
// Server-side
const variant = await getVariant<'A' | 'B'>('pricing_test', {
  distinctId: 'user-123',
});

// Client-side
const variant = posthog.getFeatureFlag('pricing_test');
```

## PostHog Dashboard Configuration

### 1. Create Boolean Flags

In the PostHog dashboard, create feature flags:

#### `artistSearchEnabled`

- **Type**: Boolean Flag
- **Description**: Controls artist search functionality
- **Default**: `true`

#### `debugBannerEnabled`

- **Type**: Boolean Flag
- **Description**: Controls debug banner visibility
- **Default**: `true` (development), `false` (production)

#### `tipPromoEnabled`

- **Type**: Boolean Flag
- **Description**: Controls tip promotion features
- **Default**: `true`

### 2. Create Multivariate Flags

#### `pricing_test`

- **Type**: Multivariate Flag
- **Variants**: `A`, `B`, `control`
- **Description**: A/B test for pricing page

## Advanced Usage

### User Identification

PostHog automatically includes user information from Clerk:

```typescript
import { identifyUser } from '@/lib/flags';

// Identify user with properties
await identifyUser('user-123', {
  email: 'user@example.com',
  plan: 'pro',
  signupDate: '2024-01-01',
});
```

### Rollout Strategy

1. **0%**: Create flag, set to 0% rollout
2. **1%**: Enable for 1% of users to test
3. **10%**: Increase to 10% if stable
4. **50%**: Rollout to half of users
5. **100%**: Full rollout

### Kill Switch

For immediate rollback:

- Set flag to 0% in PostHog dashboard
- Changes take effect within 30 seconds
- No code deployment required

## Migration from Statsig

The feature flags system has been migrated from Statsig to PostHog:

### Before (Statsig)

```typescript
import { useFeatureFlags } from '@/lib/feature-flags';

const { waitlistEnabled, debugBannerEnabled } = useFeatureFlags();
```

### After (PostHog)

```typescript
import { isEnabled } from '@/lib/flags';

const waitlistEnabled = await isEnabled('waitlistEnabled', {
  distinctId: userId,
});
const debugBannerEnabled = await isEnabled('debugBannerEnabled', {
  distinctId: userId,
});
```

### API Compatibility

The existing `getFeatureFlags()` and `getServerFeatureFlags()` functions continue to work for backward compatibility.

## Testing

### Unit Tests

When testing components that use feature flags:

```typescript
import { describe, it, expect, vi } from 'vitest';

// Mock PostHog
vi.mock('@/lib/posthog/server', () => ({
  getServerFlag: vi.fn().mockResolvedValue(true),
}));

describe('MyComponent', () => {
  it('shows feature when flag is enabled', async () => {
    // Test implementation
  });
});
```

### E2E Tests

For end-to-end tests, you can override flags:

```typescript
test('new feature flow', async ({ page }) => {
  // Set PostHog feature flag override
  await page.addInitScript(() => {
    window.__PH_FLAGS__ = {
      new_feature: true,
    };
  });

  await page.goto('/');
  await expect(page.locator('[data-testid="new-feature"]')).toBeVisible();
});
```

## Blocker Resistance

The reverse proxy setup routes PostHog requests through `/phx/*` to evade common ad blockers:

- PostHog assets: `/phx/static/*` → `https://us-assets.i.posthog.com/static/*`
- PostHog API: `/phx/*` → `https://us.i.posthog.com/*`

This ensures feature flags work even when users have ad blockers enabled.

## Best Practices

1. **Use server-side evaluation** for initial page renders to avoid FOUC
2. **Provide sensible defaults** for when PostHog is unavailable
3. **Use user properties** for targeted rollouts (plan, location, etc.)
4. **Monitor flag performance** in PostHog dashboard
5. **Clean up old flags** after full rollout or removal

## Troubleshooting

### Flag not updating

- Check PostHog dashboard for flag configuration
- Verify user is in the rollout percentage
- Check browser console for PostHog errors

### Performance issues

- Flags are cached for 30 seconds by default
- Server-side evaluation has 1.5s timeout
- Client-side uses bootstrapped values for instant access

### Environment variables missing

Run the environment check:

```bash
npm run check-posthog-env
```

## Resources

- [PostHog Documentation](https://posthog.com/docs)
- [Feature Flags Guide](https://posthog.com/docs/feature-flags)
- [A/B Testing with PostHog](https://posthog.com/docs/experiments)
- [PostHog Next.js Integration](https://posthog.com/docs/libraries/next-js)
