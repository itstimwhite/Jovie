# Testing Feature Flags and Analytics

This document describes the test coverage for feature flags and analytics gating in the Jovie application.

## Test Coverage

The test suite includes the following types of tests:

### Unit Tests

1. **Feature Flags Implementation** (`tests/lib/feature-flags.test.ts`)
   - Tests for `getFeatureFlags` and `getServerFeatureFlags` functions
   - Verifies proper fallback behavior when API endpoints fail
   - Ensures default flags are returned when all fetches fail

2. **FeatureFlagsProvider Component** (`tests/unit/FeatureFlagsProvider.test.tsx`)
   - Tests the React context provider for feature flags
   - Verifies that default flags are used when no initialFlags are provided
   - Ensures that provided initialFlags are used correctly
   - Tests that flags are updated when initialFlags change

3. **Analytics Gating** (`tests/lib/analytics-gating.test.ts`)
   - Tests that analytics calls are blocked when PostHog key is not set
   - Verifies that analytics calls are made when PostHog key is set
   - Covers all analytics functions: `track`, `page`, and `identify`

4. **No Direct PostHog Imports** (`tests/lib/no-direct-posthog-imports.test.ts`)
   - Ensures that `posthog-js` is only imported in `lib/analytics.ts`
   - Verifies that there are no direct usages of `posthog` outside of `lib/analytics.ts`
   - Acts as a backup to ESLint rules to prevent direct PostHog usage

### E2E Tests

1. **Feature Flags and Analytics Gating** (`tests/e2e/feature-flags-analytics.spec.ts`)
   - Tests that SSR-critical surfaces honor server flags without flicker
   - Verifies that analytics are blocked before consent
   - Ensures feature flags are consistent between client and server

## Running the Tests

### Unit Tests

To run all unit tests:

```bash
npm run test
```

To run only the feature flags and analytics tests:

```bash
npm run test -- --grep "feature-flags|analytics"
```

### E2E Tests

To run all E2E tests:

```bash
npm run test:e2e
```

To run only the feature flags and analytics E2E tests:

```bash
npm run test:e2e -- tests/e2e/feature-flags-analytics.spec.ts
```

## CI Integration

The tests are automatically run in CI as part of the test suite. The CI pipeline includes:

1. Running unit tests with Vitest
2. Running E2E tests with Playwright
3. Checking for direct PostHog imports using grep

## Best Practices

When working with feature flags and analytics:

1. **Always use the feature flags API** - Never hardcode feature flag values in components
2. **Always use the analytics API** - Never import `posthog-js` directly
3. **Test with different flag values** - Ensure your components work correctly with different flag configurations
4. **Test analytics gating** - Verify that analytics are properly gated by consent

## Adding New Feature Flags

When adding a new feature flag:

1. Add the flag to the `FeatureFlags` interface in `lib/feature-flags.ts`
2. Add the flag to the `defaultFeatureFlags` object in `lib/feature-flags.ts`
3. Add the flag to the API endpoint in `app/api/feature-flags/route.ts`
4. Update the tests to include the new flag

## Adding New Analytics Events

When adding a new analytics event:

1. Use the `track` function from `lib/analytics.ts`
2. Add appropriate properties to the event
3. Ensure the event is properly gated by consent
4. Add tests for the new event
