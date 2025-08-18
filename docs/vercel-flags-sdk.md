# Vercel Flags SDK Configuration

This document explains the Vercel Flags SDK setup in Jovie.

## Overview

Jovie uses Vercel Flags SDK v4 to provide feature flag capabilities. The implementation includes:

- Feature flag discovery endpoint at `/.well-known/vercel/flags`
- Integration with Vercel Toolbar for development
- Client and server-side feature flag utilities

## Discovery Endpoint

The discovery endpoint (`/.well-known/vercel/flags`) provides Vercel with the current feature flag configuration:

```json
{
  "version": 4,
  "flags": {
    "waitlistEnabled": {
      "type": "boolean",
      "default": false,
      "description": "Controls waitlist flow visibility"
    },
    "artistSearchEnabled": {
      "type": "boolean",
      "default": true,
      "description": "Enable artist search UI (replaced by claim flow)"
    },
    "debugBannerEnabled": {
      "type": "boolean",
      "default": true,
      "description": "Show debug banner in the UI"
    },
    "tipPromoEnabled": {
      "type": "boolean",
      "default": true,
      "description": "Enable tip promotion features"
    }
  },
  "metadata": {
    "app": "jovie",
    "framework": "next",
    "source": "static-defaults"
  }
}
```

## Configuration

### Dependencies

- `flags@4.0.1` - Main Vercel Flags SDK
- `@flags-sdk/statsig@0.2.2` - Statsig integration
- `@vercel/toolbar@0.1.38` - Development toolbar

### Middleware Exclusion

The `.well-known/vercel/flags` path is excluded from Clerk middleware to ensure it works without authentication:

```typescript
export const config = {
  matcher: [
    // Skip .well-known directory
    '/((?!_next|\\.well-known|.*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

### Cache Headers

The flags endpoint returns `Cache-Control: no-store` to prevent caching, ensuring Vercel gets fresh flag data.

## Testing

The endpoint is validated with automated tests in `tests/api/flags.test.ts` that verify:

- Endpoint returns HTTP 200
- Response contains required version field (version 4)
- Response has proper flag structure
- Cache headers are set correctly
- All expected feature flags are present

## Usage

### Server-side

```typescript
import { getServerFeatureFlags } from '@/lib/feature-flags';

const flags = await getServerFeatureFlags();
if (flags.debugBannerEnabled) {
  // Show debug banner
}
```

### Client-side

```typescript
import { getFeatureFlags } from '@/lib/feature-flags';

const flags = await getFeatureFlags();
if (flags.tipPromoEnabled) {
  // Show tip promotion
}
```

## Production Notes

- The endpoint works in both development and production modes
- No environment variables required for basic functionality
- Vercel Toolbar integration requires `vc link` for full functionality
- All packages are up-to-date as of implementation date
