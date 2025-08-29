# Tipping MVP Documentation

This document explains the Tipping MVP feature, including setup, component usage, and event tracking.

## Overview

The Tipping MVP allows fans to send tips to artists directly through the Jovie platform. The initial implementation supports:

- Venmo-based tipping for artists with Venmo accounts
- Configurable tip amounts ($3, $5, $7 by default)
- Dedicated tipping UI mode for artist profiles
- Feature flag control for enabling/disabling the feature

## Feature Flag

The tipping feature is controlled by the `tipping_mvp` feature flag, which can be enabled through environment variables.

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FEATURE_TIPS` | Enables or disables the tipping feature | `true` |

### PostHog Feature Flag

While the project supports PostHog feature flags (including `feature_tip_promo_enabled`), the `TipPromo` component currently only uses the environment variable for gating. The PostHog feature flag system is available for other features in the application.

## Setup

1. **Enable the feature flag**:
   - Set `NEXT_PUBLIC_FEATURE_TIPS=true` in your environment
   - Note: The `TipPromo` component currently only checks the environment variable

2. **Configure Stripe** (for future payment processing):
   - Set `STRIPE_SECRET_KEY` for the Stripe API
   - Set `STRIPE_TIP_WEBHOOK_SECRET` for webhook verification

3. **Ensure artists have Venmo links**:
   - Artists must have a Venmo account linked in their profile for tipping to be available

## Component Usage

### TipPromo Component

The `TipPromo` component displays a promotional section for the tipping feature on the homepage.

```tsx
import dynamic from 'next/dynamic';

// Dynamically import the TipPromo component
const TipPromo = dynamic(() => import('@/components/TipPromo'));

// Use in your page
<TipPromo />
```

The component will only render when `NEXT_PUBLIC_FEATURE_TIPS` is set to `'true'`.

### VenmoTipSelector Component

The `VenmoTipSelector` component provides the UI for selecting tip amounts and redirecting to Venmo.

```tsx
import dynamic from 'next/dynamic';

// Dynamically import the VenmoTipSelector component
const VenmoTipSelector = dynamic(() => import('@/components/profile/VenmoTipSelector'));

// Use in your component
<VenmoTipSelector
  venmoLink={venmoLink}
  venmoUsername={venmoUsername}
  amounts={[3, 5, 7]} // Optional custom amounts
  className="w-full max-w-sm" // Optional styling
  onContinue={(url) => {
    // Optional callback when a tip amount is selected
    console.log('Tip URL:', url);
  }}
/>
```

### Tip Mode in Artist Profiles

Artist profiles support a dedicated "tip" mode that can be accessed via URL:

```
https://jovie.fm/[username]?mode=tip
```

or via the dedicated tip route:

```
https://jovie.fm/[username]/tip
```

The tip route automatically redirects to the profile page with `?mode=tip` parameter.

## API Routes

### Create Tip Intent

```
POST /api/create-tip-intent
```

Creates a Stripe payment intent for tipping (future implementation).

**Request Body**:
```json
{
  "amount": 5, // Amount in dollars
  "handle": "artist_username"
}
```

**Response**:
```json
{
  "clientSecret": "pi_..."
}
```

### Capture Tip

```
POST /api/capture-tip
```

Webhook endpoint for capturing successful tip payments from Stripe (future implementation).

## Implementation Notes

1. The current MVP uses Venmo for tipping, with plans to integrate Stripe for direct payments in the future.

2. Tipping is only available for artists who have added their Venmo account to their profile.

3. The tipping interface is designed to be mobile-friendly, with large, easy-to-tap buttons.

4. The feature includes fallback messaging when an artist doesn't have Venmo configured.

## Testing

To test the tipping feature:

1. Enable the feature flag: `NEXT_PUBLIC_FEATURE_TIPS=true`
2. Visit an artist profile with a Venmo link
3. Click the "Tip" button or navigate to `[username]?mode=tip`
4. Select a tip amount
5. Verify redirection to Venmo with the correct amount

## Future Enhancements

The following enhancements are planned for future versions:

1. Direct credit card payments via Stripe
2. Tip history and analytics for artists
3. Custom tip amounts
4. Recurring tips/subscriptions
5. Multiple payment method support
