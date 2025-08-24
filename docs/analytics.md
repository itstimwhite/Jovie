# Analytics with PostHog

Jovie uses [PostHog](https://posthog.com/) for analytics and event tracking. This document outlines how PostHog is configured and used in the project.

## Setup

### 1. Environment Variables

Add your PostHog API key and host to `.env.local`:

```bash
# PostHog - Optional for local development (Toolbar disabled locally)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com
```

> **Note:** PostHog is configured to disable the Toolbar and experiments in local development to prevent 401 errors and console spam.

### 2. Analytics Wrapper

All PostHog usage must go through the centralized analytics wrapper in `lib/analytics.ts`. This ensures consistent tracking and proper environment handling.

## Usage

### Tracking Events

```typescript
import { track } from '@/lib/analytics';

// Track a custom event
track('button_clicked', {
  buttonName: 'signup',
  location: 'header',
});
```

### Page Views

```typescript
import { page } from '@/lib/analytics';

// Track a page view
page('Profile Page', {
  userId: user.id,
});
```

### User Identification

```typescript
import { identify } from '@/lib/analytics';

// Identify a user
identify(user.id, {
  email: user.email,
  plan: user.plan,
});
```

### Feature Flags

```typescript
import { useFeatureFlag, FEATURE_FLAGS } from '@/lib/analytics';

// Use a feature flag with a default value
const isFeatureEnabled = useFeatureFlag(FEATURE_FLAGS.CLAIM_HANDLE, false);

// Check if a feature is enabled
if (isFeatureEnabled) {
  // Feature-specific code
}
```

## Environment-Specific Behavior

PostHog is configured differently based on the environment:

### Local Development

- Toolbar is disabled to prevent 401 errors
- Session recording is disabled
- Feature flag API calls are intercepted to prevent unauthorized requests
- Console errors related to PostHog authentication are suppressed

### Staging/Production

- Full PostHog functionality is enabled when proper API keys are provided
- Events are tracked with environment tags (`preview` or `prod`)
- Error handling is in place to prevent app crashes if PostHog fails

## Troubleshooting

### Console Errors in Local Development

If you're seeing PostHog-related errors in your local console:

1. Ensure you're using the latest version of the codebase
2. Check that you don't have PostHog browser extensions enabled
3. Verify that your `.env.local` file doesn't contain invalid PostHog credentials

### Missing Events in PostHog Dashboard

1. Verify that `NEXT_PUBLIC_POSTHOG_KEY` is set correctly
2. Check that events are being tracked through the `track()` function
3. Look for any errors in the browser console
4. Ensure the event name matches what you're looking for in the dashboard

## Best Practices

1. **Always use the analytics wrapper**: Never import `posthog-js` directly
2. **Provide meaningful event names**: Use descriptive, consistent naming (e.g., `page_element_action`)
3. **Include relevant properties**: Add context to events for better analysis
4. **Test tracking in all environments**: Verify events are captured correctly
5. **Document new events**: Keep track of what events are being captured

## Resources

- [PostHog Documentation](https://posthog.com/docs)
- [Feature Flags Guide](https://posthog.com/docs/feature-flags/manual)
- [Event Tracking Best Practices](https://posthog.com/docs/product-analytics/events)
