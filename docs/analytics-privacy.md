# Analytics Privacy

Jovie implements privacy-first analytics using PostHog. This document outlines how analytics are implemented with respect to user consent and privacy.

## Cookie Consent Integration

Analytics are only initialized and tracked when users have explicitly consented to analytics cookies:

1. **Consent-Based Initialization**: PostHog is only initialized after a user has explicitly consented to analytics cookies.
2. **Consent Revocation**: If a user revokes consent, PostHog tracking is disabled and the user is opted out.
3. **Default State**: The default state is no tracking until consent is given.

## Privacy-Hardened Configuration

PostHog is configured with privacy-focused settings:

1. **Autocapture Disabled**: By default, autocapture is disabled to prevent capturing sensitive user interactions.
2. **Text Masking**: All text inputs are masked to prevent capturing sensitive information.
3. **Element Attributes**: Element attribute properties are not captured to reduce PII risk.
4. **Do Not Track**: Browser's "Do Not Track" setting is respected.
5. **Performance Metrics**: Performance metrics collection is disabled.

## Route Exclusions

Analytics are automatically suppressed on sensitive routes:

1. **Excluded Routes**:
   - `/go/*` - Link shortener/redirects
   - `/out/*` - External redirects
   - `/api/*` - API endpoints
   - Error pages (404, 500)

## Implementation Details

The analytics implementation follows these principles:

1. **Wrapper Pattern**: All analytics calls go through the `@/lib/analytics` wrapper.
2. **Consent Check**: Every tracking function checks for consent before sending data.
3. **Environment Tagging**: All events include the environment tag (`dev`, `preview`, `prod`).
4. **Minimal Data**: Only essential data is collected for each event.

## Testing Analytics Consent

You can test analytics consent behavior:

1. **Development**: Cookie banner is shown in development mode.
2. **Production**: Cookie banner is shown based on geolocation (EU, UK, California, etc.).
3. **Manual Testing**: Use browser developer tools to clear cookies and test the consent flow.

## Feature Flags

Feature flags are tied to analytics consent:

1. **Consent Required**: Feature flags only work when analytics consent is given.
2. **Fallback Values**: All feature flag hooks include fallback values for when consent is not available.

## Implementation Files

- `lib/analytics.ts` - Main analytics implementation
- `lib/cookies/consent.ts` - Server-side consent management
- `lib/cookies/useConsent.ts` - Client-side consent hook
- `components/providers/AnalyticsProvider.tsx` - Provider that initializes analytics
- `components/organisms/CookieBannerSection.tsx` - Cookie consent UI
- `components/CookieModal.tsx` - Detailed cookie preferences UI
