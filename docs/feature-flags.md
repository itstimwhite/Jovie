# Feature Flags System

This document explains how to use the feature flags system in the Jovie application.

## Overview

The feature flags system allows toggling features on/off across different environments (Development, Preview, Production) without code changes. This is useful for:

- Gradual rollouts of new features
- A/B testing
- Environment-specific configurations
- Emergency feature disabling

## How It Works

Feature flags are served by the `/api/feature-flags` endpoint, which:

1. Reads configuration from environment variables
2. Falls back to sensible defaults when variables aren't set
3. Returns both camelCase and snake_case versions of each flag
4. Uses edge runtime for optimal performance
5. Includes cache-busting headers to ensure fresh data

## Available Feature Flags

| Flag Name (camelCase)           | Environment Variable              | Default                    | Description                               |
| ------------------------------- | --------------------------------- | -------------------------- | ----------------------------------------- |
| `artistSearchEnabled`           | `FEATURE_ARTIST_SEARCH`           | `true`                     | Controls artist search functionality      |
| `debugBannerEnabled`            | `FEATURE_DEBUG_BANNER`            | `false`                    | Controls debug banner visibility          |
| `tipPromoEnabled`               | `NEXT_PUBLIC_FEATURE_TIPS`        | `true`                     | Controls tip promotion features           |
| `pricingUseClerk`               | `FEATURE_PRICING_USE_CLERK`       | `false`                    | Controls whether to use Clerk for pricing |
| `universalNotificationsEnabled` | `FEATURE_UNIVERSAL_NOTIFICATIONS` | `false` (or `true` in dev) | Controls universal notifications          |
| `featureClickAnalyticsRpc`      | `FEATURE_CLICK_ANALYTICS_RPC`     | `false`                    | Controls anonymous click logging via RPC  |

## Using Feature Flags in Code

### Client-Side

```typescript
import { useFeatureFlags } from '@/lib/feature-flags';

export function MyComponent() {
  const { artistSearchEnabled, debugBannerEnabled } = useFeatureFlags();

  return (
    <div>
      {artistSearchEnabled && <SearchComponent />}
      {debugBannerEnabled && <DebugBanner />}
    </div>
  );
}
```

### Server-Side

```typescript
import { getServerFeatureFlags } from '@/lib/feature-flags';

export async function MyServerComponent() {
  const flags = await getServerFeatureFlags();

  if (flags.tipPromoEnabled) {
    // Do something with tip promo
  }

  return <div>...</div>;
}
```

## Environment Configuration

### Development

In development, you can set feature flags in your `.env.local` file:

```
FEATURE_ARTIST_SEARCH=true
FEATURE_DEBUG_BANNER=true
NEXT_PUBLIC_FEATURE_TIPS=true
```

### Preview/Production

For preview and production environments, set the environment variables in your deployment platform (e.g., Vercel):

1. Go to your project settings
2. Navigate to the Environment Variables section
3. Add the feature flag variables with appropriate values for each environment

## Best Practices

1. **Default to Off for New Features**: When adding a new feature flag, default it to `false` in code and only enable via environment variables.
2. **Document All Flags**: Add new flags to this documentation when created.
3. **Clean Up Unused Flags**: Remove flags and related code when features are fully launched or deprecated.
4. **Use Descriptive Names**: Flag names should clearly indicate what feature they control.
5. **Consider Scope**: Only use `NEXT_PUBLIC_` prefix for flags that need to be accessible on the client-side.

## Adding New Feature Flags

1. Add the flag to the defaults object in `app/api/feature-flags/route.ts`
2. Add the environment variable check in the flags object
3. Add the flag to the `.env.example` file
4. Update this documentation
5. Add appropriate tests
