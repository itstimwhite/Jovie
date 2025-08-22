# Analytics Privacy Configuration

This document outlines the privacy configuration implemented for PostHog analytics in the Jovie application.

## Overview

Jovie uses PostHog for analytics to understand user behavior and improve the application. To protect user privacy, we've implemented several privacy-focused configurations:

1. **Text and Input Masking**: Sensitive text inputs and attributes are masked to prevent collection of personal information.
2. **Do Not Track (DNT) Respect**: The application respects the browser's Do Not Track setting.
3. **Route-Based Suppression**: Analytics are suppressed for specific routes that might contain sensitive information.
4. **Query Parameter Filtering**: Sensitive query parameters are filtered from URLs before they are sent to analytics.

## Privacy Features

### Text and Input Masking

- All text inputs are masked by default to prevent collection of sensitive information.
- Elements with `data-private` or `data-sensitive` attributes are masked.
- Only click events are captured by default (not form inputs).

### Do Not Track (DNT) Respect

- The application checks for the browser's Do Not Track setting.
- If DNT is enabled, all analytics tracking is disabled.
- This respects user privacy preferences set at the browser level.

### Route-Based Suppression

The following routes are suppressed from analytics:

- `/go/*` - Redirect routes
- `/out/*` - External link routes
- `/api/*` - API routes
- Error pages (404, 500, etc.)

This prevents tracking of sensitive operations like redirects, API calls, and error states.

### Query Parameter Filtering

Sensitive query parameters are filtered from URLs before they are sent to analytics, including:

- Authentication tokens (`token`, `access_token`, etc.)
- Passwords and secrets
- Personal information (`email`, `phone`, etc.)
- Session identifiers

## Implementation Details

The privacy configuration is implemented in the following files:

- `lib/analytics.ts` - Main analytics implementation with privacy configuration
- `lib/analytics/route-suppression.ts` - Route-based suppression logic
- `lib/analytics/query-param-filter.ts` - Query parameter filtering logic

## Testing

The privacy configuration is tested with:

- Unit tests for route suppression logic
- Unit tests for query parameter filtering
- Manual verification in network traces and PostHog dashboard

## Compliance

This configuration helps Jovie comply with privacy regulations by:

- Respecting user preferences (DNT)
- Minimizing collection of personal information
- Providing transparency about what data is collected
- Implementing privacy by design principles
